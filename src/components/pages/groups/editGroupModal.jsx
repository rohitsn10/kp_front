import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  TextField,
  FormControlLabel,
  Box,
  InputAdornment,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import { 
  useUpdateGroupWithPermissionsMutation, 
  useGetAllPermissionsQuery, 
  useGetAllGroupsQuery 
} from '../../../api/permission/permissionApi';

// Debounce hook for search optimization
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Optimized Checkbox Component
const OptimizedCheckbox = React.memo(({ 
  checked, 
  onChange, 
  permissionId 
}) => {
  const handleChange = useCallback(() => {
    onChange(permissionId);
  }, [onChange, permissionId]);

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      size="small"
    />
  );
});

OptimizedCheckbox.displayName = 'OptimizedCheckbox';

// Optimized Table Row Component
const PermissionRow = React.memo(({ 
  item, 
  selectedPermissions, 
  onCheckboxChange 
}) => {
  return (
    <TableRow key={item.name}>
      <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
      <TableCell align="center">
        <OptimizedCheckbox
          checked={selectedPermissions.has(item.add)}
          onChange={onCheckboxChange}
          permissionId={item.add}
        />
      </TableCell>
      <TableCell align="center">
        <OptimizedCheckbox
          checked={selectedPermissions.has(item.change)}
          onChange={onCheckboxChange}
          permissionId={item.change}
        />
      </TableCell>
      <TableCell align="center">
        <OptimizedCheckbox
          checked={selectedPermissions.has(item.delete)}
          onChange={onCheckboxChange}
          permissionId={item.delete}
        />
      </TableCell>
      <TableCell align="center">
        <OptimizedCheckbox
          checked={selectedPermissions.has(item.view)}
          onChange={onCheckboxChange}
          permissionId={item.view}
        />
      </TableCell>
    </TableRow>
  );
});

PermissionRow.displayName = 'PermissionRow';

function EditGroupModal({ open, setOpen, groupData }) {
  const { refetch } = useGetAllGroupsQuery();
  const { data: permissionsData, isLoading } = useGetAllPermissionsQuery();
  const [updateGroupPermissions, { isLoading: isSubmitting }] = useUpdateGroupWithPermissionsMutation();
  
  // Use Set for better performance with large datasets
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Items per page for pagination
  const ITEMS_PER_PAGE = 25;

  // Initialize form data when groupData changes
  useEffect(() => {
    if (groupData && open) {
      setGroupName(groupData.name || '');
      
      // Extract permissions from the nested structure and convert to Set
      const permissions = new Set();
      if (groupData.permission_list && Array.isArray(groupData.permission_list)) {
        groupData.permission_list.forEach((permGroup) => {
          Object.values(permGroup).forEach((actions) => {
            if (actions && typeof actions === 'object') {
              Object.values(actions).forEach((permissionId) => {
                if (permissionId) {
                  permissions.add(typeof permissionId === 'object' ? permissionId.id : permissionId);
                }
              });
            }
          });
        });
      }
      setSelectedPermissions(permissions);
      setSearchTerm('');
      setCurrentPage(1);
    }
  }, [groupData, open]);

  // Memoize filtered permissions with debounced search
  const filteredPermissions = useMemo(() => {
    if (!permissionsData?.data) return [];
    if (!debouncedSearchTerm) return permissionsData.data;
    
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return permissionsData.data.filter(item => 
      item.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [permissionsData?.data, debouncedSearchTerm]);

  // Memoize paginated permissions
  const paginatedPermissions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPermissions.slice(startIndex, endIndex);
  }, [filteredPermissions, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPermissions.length / ITEMS_PER_PAGE);

  // Memoize permission counts for select all logic
  const permissionCounts = useMemo(() => {
    const totalPermissions = filteredPermissions.length * 4;
    const selectedCount = selectedPermissions.size;
    
    // Check if all filtered permissions are selected
    const allFilteredSelected = filteredPermissions.every(item => 
      selectedPermissions.has(item.add) &&
      selectedPermissions.has(item.change) &&
      selectedPermissions.has(item.delete) &&
      selectedPermissions.has(item.view)
    );
    
    return {
      total: totalPermissions,
      selected: selectedCount,
      isAllSelected: allFilteredSelected && filteredPermissions.length > 0,
      isIndeterminate: selectedCount > 0 && !allFilteredSelected
    };
  }, [filteredPermissions, selectedPermissions]);

  // Handle modal close with cleanup
  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchTerm('');
    setCurrentPage(1);
  }, [setOpen]);

  // Optimized checkbox change handler using Set operations
  const handleCheckboxChange = useCallback((id) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Optimized select all handler for filtered permissions
  const handleSelectAll = useCallback(() => {
    if (permissionCounts.isAllSelected) {
      // Deselect all filtered permissions
      setSelectedPermissions(prev => {
        const newSet = new Set(prev);
        filteredPermissions.forEach(item => {
          newSet.delete(item.add);
          newSet.delete(item.change);
          newSet.delete(item.delete);
          newSet.delete(item.view);
        });
        return newSet;
      });
    } else {
      // Select all filtered permissions
      setSelectedPermissions(prev => {
        const newSet = new Set(prev);
        filteredPermissions.forEach(item => {
          newSet.add(item.add);
          newSet.add(item.change);
          newSet.add(item.delete);
          newSet.add(item.view);
        });
        return newSet;
      });
    }
  }, [filteredPermissions, permissionCounts.isAllSelected]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle page change
  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    if (selectedPermissions.size === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    try {
      // Convert Set to Array and ensure we're sending IDs only
      const permissionIds = Array.from(selectedPermissions).map(perm => 
        typeof perm === 'object' ? perm.id : perm
      );

      await updateGroupPermissions({
        id: groupData.id,
        groupData: {
          name: groupName.trim(),
          permissions: permissionIds,
        },
      }).unwrap();
      
      toast.success("Group updated successfully!");
      refetch();
      handleClose();
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error(error?.data?.message || "Failed to update group. Please try again.");
    }
  };

  // Reset page when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPermissions.length]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ 
        style: { 
          width: '90%', 
          maxHeight: '90vh' 
        } 
      }}
    >
      <DialogContent sx={{ pb: 2 }}>
        <Box mb={3}>
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">
            Edit User Group
          </h2>
          
          {/* Group Name and Select All Row */}
          <Box display="flex" alignItems="center" gap={2} marginBottom="20px">
            <TextField
              label="Group Name"
              variant="outlined"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ flexGrow: 1 }}
              size="small"
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={permissionCounts.isAllSelected}
                  onChange={handleSelectAll}
                  indeterminate={permissionCounts.isIndeterminate}
                />
              }
              label={`Select All (${selectedPermissions.size} selected)`}
            />
          </Box>

          {/* Search Box */}
          <Box marginBottom="20px">
            <TextField
              fullWidth
              placeholder="Search permissions..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            />
          </Box>

          {/* Results Info */}
          {debouncedSearchTerm && (
            <Box mb={2}>
              <small className="text-gray-600">
                Found {filteredPermissions.length} permissions matching "{debouncedSearchTerm}"
              </small>
            </Box>
          )}
        </Box>

        {/* Table Section */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <p>Loading permissions...</p>
          </Box>
        ) : (
          <>
            <TableContainer 
              component={Paper} 
              sx={{ 
                maxHeight: '400px',
                border: '1px solid #e0e0e0'
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Section
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Add
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Change
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Delete
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      View
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPermissions.length > 0 ? (
                    paginatedPermissions.map((item) => (
                      <PermissionRow
                        key={item.name}
                        item={item}
                        selectedPermissions={selectedPermissions}
                        onCheckboxChange={handleCheckboxChange}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        {debouncedSearchTerm ? (
                          <Box>
                            <p>No permissions found for "{debouncedSearchTerm}"</p>
                            <Button 
                              size="small" 
                              onClick={() => setSearchTerm("")}
                              sx={{ mt: 1 }}
                            >
                              Clear Search
                            </Button>
                          </Box>
                        ) : (
                          "No permissions available"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Summary */}
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <small className="text-gray-600">
                Showing {paginatedPermissions.length} of {filteredPermissions.length} permissions
              </small>
              <small className="text-gray-600">
                {selectedPermissions.size} permissions selected
              </small>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', padding: '20px', gap: 2 }}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !groupName.trim() || selectedPermissions.size === 0}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '8px 32px',
            minWidth: '160px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#E66A1F' },
            '&:disabled': { 
              backgroundColor: '#cccccc',
              color: '#666666'
            }
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Group'}
        </Button>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#6c757d',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '8px 32px',
            minWidth: '160px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#5a6268' },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditGroupModal;
