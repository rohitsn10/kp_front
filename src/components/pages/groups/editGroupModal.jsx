import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { toast } from 'react-toastify';
import { useUpdateGroupWithPermissionsMutation, useGetAllPermissionsQuery } from '../../../api/permission/permissionApi';

function EditGroupModal({ open, setOpen, groupData }) {
  const { data: permissionsData, isLoading } = useGetAllPermissionsQuery();
  const [updateGroupPermissions, { isLoading: isSubmitting }] = useUpdateGroupWithPermissionsMutation();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [groupName, setGroupName] = useState('');
  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.name);
      const permissions = groupData.permission_list.flatMap((perm) =>
        Object.values(perm).flatMap((action) => Object.values(action))
      );
      setSelectedPermissions(permissions);
    }
  }, [groupData]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCheckboxChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectedPermissions.length === permissionsData?.data.length * 4) {
      setSelectedPermissions([]);
    } else {
      const allPermissions = permissionsData?.data.flatMap(item => [item.add, item.change, item.delete, item.view]);
      setSelectedPermissions(allPermissions);
    }
  };
  const handleSubmit = async () => {
    if (!groupName || selectedPermissions.length === 0) {
      toast.error("Please enter group name & add at least one Permission");
      return;
    }
    try {
      await updateGroupPermissions({ id: groupData.id, name: groupName, permissions: selectedPermissions }).unwrap();
      toast.success('Group updated successfully!');
      setOpen(false);
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { width: '90%' } }}
    >
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Edit User Group</h2>
        <Box display="flex" alignItems="center" gap={2} marginBottom="20px">
          <TextField
            label="Group Name"
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPermissions.length === permissionsData?.data.length * 4}
                onChange={handleSelectAll}
                indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < permissionsData?.data.length * 4}
              />
            }
            label="Select All"
          />
        </Box>
        {isLoading ? (
          <p>Loading permissions...</p>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Section</TableCell>
                  <TableCell>Add</TableCell>
                  <TableCell>Change</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissionsData?.data.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedPermissions.includes(item.add)}
                        onChange={() => handleCheckboxChange(item.add)}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedPermissions.includes(item.change)}
                        onChange={() => handleCheckboxChange(item.change)}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedPermissions.includes(item.delete)}
                        onChange={() => handleCheckboxChange(item.delete)}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedPermissions.includes(item.view)}
                        onChange={() => handleCheckboxChange(item.view)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#E66A1F' },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Update'}
        </Button>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#E66A1F' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default EditGroupModal;