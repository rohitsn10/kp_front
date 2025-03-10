import React, { useState } from 'react';
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

function UserGroupSection() {
  const { data: groupData, isLoading, error, refetch } = useGetAllGroupsQuery();
  const [deleteGroup] = useDeleteGroupMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createModal, setCreateModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading groups.</p>;

  // Transform API data
  const rows = groupData?.data?.map((group, index) => ({
    id: group.id,
    name: group.name,
    sr: index + 1,
  })) || [];

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Delete Confirmation
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
        await deleteGroup(selectedGroupId);
        refetch(); // Refresh group list after deletion
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
    handleCloseConfirm();
  };

  // Get current page rows
  const currentRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <TextField
          value={""}
          placeholder="Search"
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
        />
        <h2 className="text-3xl text-[#29346B] font-semibold">User Groups</h2>
        <Button
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          onClick={() => setCreateModal(true)}
        >
          Add Group
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Group Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.sr}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                  <RiEditFill
                    style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                    title="Edit"
                  />
                  <DeleteIcon
                    style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                    title="Delete"
                    onClick={() => handleOpenConfirm(row.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          style={{ borderTop: '1px solid #e0e0e0' }}
        />
      </TableContainer>
      <CreateGroupModal open={createModal} setOpen={setCreateModal} />
      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserGroupSection;
