import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetAllGroupsQuery, useDeleteGroupMutation } from '../../api/permission/permissionApi';
import CreateGroupModal from '../../components/pages/groups/CreateGroupModal';
import EditGroupModal from '../../components/pages/groups/editGroupModal';

function UserGroupSection() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchFilter);
      setPage(0); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilter]);

  // Fetch groups with pagination parameters
  const { data: groupData, isLoading, error, refetch } = useGetAllGroupsQuery({
    page: page + 1, // Backend expects 1-indexed pages
    page_size: rowsPerPage,
    search: debouncedSearch,
  });

  const [deleteGroup] = useDeleteGroupMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenConfirm = (groupId) => {
    setSelectedGroupId(groupId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedGroupId(null);
  };

  const handleDelete = async () => {
    if (selectedGroupId) {
      try {
        await deleteGroup(selectedGroupId).unwrap();
        // Auto-refetch handled by invalidatesTags
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
    handleCloseConfirm();
  };

  const handleEditClick = (group) => {
    setSelectedGroup({ ...group, permission_list: group.permission_list });
    setEditModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading groups. Please try again later.
        </div>
      </div>
    );
  }

  // Get rows from API response
  const rows = groupData?.data?.map((group, index) => ({
    id: group.id,
    name: group.name,
    sr: (page * rowsPerPage) + index + 1, // Calculate global serial number
    permission_list: group.permission_list,
  })) || [];

  const totalCount = groupData?.count || 0;

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="mb-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            User Groups
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <TextField
              value={searchFilter}
              placeholder="Search groups..."
              onChange={(e) => setSearchFilter(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '8px'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
          </div>

          <div className="w-full sm:w-auto">
            <Button
              variant="contained"
              fullWidth
              onClick={() => setCreateModal(true)}
              sx={{
                backgroundColor: '#FF8C00',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '14px', sm: '16px' },
                textTransform: 'none',
                padding: { xs: '10px 16px', sm: '8px 24px' },
                '&:hover': {
                  backgroundColor: '#e67c00'
                }
              }}
            >
              Add Group
            </Button>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <TableContainer
          component={Paper}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            minWidth: '300px'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow style={{ backgroundColor: '#F2EDED' }}>
                <TableCell
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Sr No.
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Group Name
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ padding: '32px' }}>
                    No groups found
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: '14px', sm: '16px', md: '20px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      {row.sr}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: '#1D2652' }}
                      sx={{
                        fontSize: { xs: '14px', sm: '16px', md: '20px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                        wordBreak: 'break-word'
                      }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <RiEditFill
                          style={{
                            cursor: 'pointer',
                            color: '#61D435',
                            fontSize: '20px'
                          }}
                          title="Edit"
                          onClick={() => handleEditClick(row)}
                        />
                        <DeleteIcon
                          style={{
                            cursor: 'pointer',
                            color: 'red',
                            fontSize: '20px'
                          }}
                          title="Delete"
                          onClick={() => handleOpenConfirm(row.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            style={{ borderTop: '1px solid #e0e0e0' }}
            sx={{
              '& .MuiTablePagination-toolbar': {
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '8px', sm: '16px' }
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: { xs: '12px', sm: '14px' }
              }
            }}
          />
        </TableContainer>
      </div>

      <CreateGroupModal open={createModal} setOpen={setCreateModal} />
      <EditGroupModal open={editModal} setOpen={setEditModal} groupData={selectedGroup} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            margin: { xs: '16px', sm: '32px' },
            width: { xs: 'calc(100% - 32px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: '18px', sm: '20px' },
            padding: { xs: '16px', sm: '24px' },
            paddingBottom: { xs: '8px', sm: '16px' }
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ padding: { xs: '0 16px', sm: '0 24px' } }}>
          <DialogContentText sx={{ fontSize: { xs: '14px', sm: '16px' } }}>
            Are you sure you want to delete this group? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: { xs: '16px', sm: '24px' } }}>
          <Button
            onClick={handleCloseConfirm}
            color="primary"
            sx={{ fontSize: { xs: '14px', sm: '16px' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            sx={{ fontSize: { xs: '14px', sm: '16px' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserGroupSection;
