import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Box,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useGetUserByNamesQuery } from '../../../api/users/usersApi';
import { useAssignProjectRolesMutation } from '../../../api/users/projectApi';
// import { useAssignProjectRolesMutation } from '../../../api/projects/projectApi'; // Import the mutation hook


const ProjectRoleAssignmentModal = ({ open, handleClose, projectId, projectName }) => {
  // State for search input
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Available roles
  const roles = [
    'Deputy Manager',
    'Assistant',
    'Project Director',
    'Director - Projects',
    'GM Project Management',
    'Sr. Manager',
    'Commissioning Manager',
    'Engineer',
    'Civil Quality Engineer',
    'Manager',
    'Sr. Engineer',
    'Officer',
    'Assistant Manager'
  ];

  // State for role assignments
  const [roleAssignments, setRoleAssignments] = useState({});
  const [loading, setLoading] = useState(false);

  // RTK Query mutation hook
  const [assignProjectRoles, { isLoading: isSaving, isSuccess, isError, error: mutationError }] = useAssignProjectRolesMutation();

  // Debounced search function
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 500),
    []
  );

  // Fetch users with search query
  const { data: usersData, isLoading: isLoadingUsers } = useGetUserByNamesQuery(
    {
      name: debouncedSearch,
      page: 1,
      page_size: 50
    },
    {
      skip: !debouncedSearch || debouncedSearch.length < 2 // Only search if 2+ characters
    }
  );

  // Transform users data for dropdown options
  const userOptions = useMemo(() => {
    if (!usersData?.users) return [];
    
    return usersData.users.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      group_name: user.group_name
    }));
  }, [usersData]);

  // Handle search input change
  useEffect(() => {
    if (searchInput) {
      debouncedSetSearch(searchInput);
    }
    
    return () => {
      debouncedSetSearch.clear();
    };
  }, [searchInput, debouncedSetSearch]);

  // Initialize role assignments
  useEffect(() => {
    if (open) {
      // Initialize empty assignments for all roles
      const initialAssignments = {};
      roles.forEach(role => {
        initialAssignments[role] = [];
      });
      setRoleAssignments(initialAssignments);
      setSearchInput('');
      setDebouncedSearch('');
      
    }
  }, [open, projectId]);

  // Handle successful mutation
  useEffect(() => {
    if (isSuccess) {
      // Close modal after 2 seconds on success
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, handleClose]);


  // Handle role assignment change
  const handleRoleChange = (role, selectedUsers) => {
    setRoleAssignments(prev => ({
      ...prev,
      [role]: selectedUsers || []
    }));
  };

  // Handle save assignments with RTK Query mutation
  const handleSaveAssignments = async () => {
    try {
      // Prepare payload in the format expected by the backend
      const assigned_users = Object.entries(roleAssignments)
        .filter(([role, users]) => users.length > 0)
        .map(([role, users]) => ({
          role: role,
          user_ids: users.map(user => user.id)
        }));

      // Call the mutation
      await assignProjectRoles({
        project_id: projectId,
        assigned_users: assigned_users
      }).unwrap();

      console.log('Role assignments saved successfully!');
      
    } catch (err) {
      console.error('Failed to save role assignments:', err);
    }
  };

  // Input styles for consistency
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E0E3E7',
      },
      '&:hover fieldset': {
        borderColor: '#B2BAC2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#29346B',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#29346B',
      '&.Mui-focused': {
        color: '#29346B',
      },
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#F8F9FA', 
        borderBottom: '1px solid #E0E3E7',
        color: '#29346B',
        fontWeight: 'bold',
        fontSize: '1.5rem'
      }}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Assign Roles to Project
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project: {projectName}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mutationError?.data?.message || 'Failed to save role assignments. Please try again.'}
          </Alert>
        )}
        
        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Role assignments saved successfully!
          </Alert>
        )}

        {loading && !isSuccess ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading existing assignments...
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Select users for each role. You can assign multiple users to the same role.
            </Typography>

            <Grid container spacing={3}>
              {roles.map((role, index) => (
                <Grid item xs={12} sm={6} key={role}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="semibold" color="#29346B" sx={{ mb: 1 }}>
                      {role}
                    </Typography>
                    
                    <Autocomplete
                      multiple
                      options={userOptions}
                      getOptionLabel={(option) => `${option.full_name} (${option.email})`}
                      value={roleAssignments[role] || []}
                      onChange={(_, selectedUsers) => handleRoleChange(role, selectedUsers)}
                      onInputChange={(_, newInputValue) => {
                        setSearchInput(newInputValue);
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingUsers}
                      noOptionsText={
                        debouncedSearch.length < 2 
                          ? "Type at least 2 characters to search" 
                          : "No users found"
                      }
                      loadingText="Searching users..."
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option.id}
                            variant="outlined"
                            label={option.full_name}
                            size="small"
                            color="primary"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={`Search and select users for ${role}`}
                          variant="outlined"
                          size="small"
                          sx={inputStyles}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingUsers ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {option.full_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.email} • {option.group_name}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  
                  {index < roles.length - 1 && index % 2 === 1 && (
                    <Divider sx={{ mt: 2, gridColumn: 'span 2' }} />
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Summary Section */}
            <Box sx={{ mt: 4, p: 2, backgroundColor: '#F8F9FA', borderRadius: '8px' }}>
              <Typography variant="h6" color="#29346B" sx={{ mb: 2 }}>
                Assignment Summary
              </Typography>
              
              {Object.entries(roleAssignments).filter(([role, users]) => users.length > 0).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No roles assigned yet.
                </Typography>
              ) : (
                <Box>
                  {Object.entries(roleAssignments)
                    .filter(([role, users]) => users.length > 0)
                    .map(([role, users]) => (
                      <Box key={role} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          <strong>{role}:</strong> {users.map(user => user.full_name).join(', ')}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #E0E3E7' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            color: '#6B7280', 
            borderColor: '#D1D5DB',
            '&:hover': {
              borderColor: '#9CA3AF',
              backgroundColor: '#F9FAFB'
            }
          }}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveAssignments}
          variant="contained"
          sx={{
            backgroundColor: '#29346B',
            '&:hover': {
              backgroundColor: '#1E2A5A'
            }
          }}
          disabled={isSaving || Object.entries(roleAssignments).filter(([role, users]) => users.length > 0).length === 0}
        >
          {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save Assignments'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectRoleAssignmentModal;
