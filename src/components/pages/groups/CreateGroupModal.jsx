import React, { useState } from 'react';
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
  TextField
} from '@mui/material';
import { useCreateGroupWithPermissionsMutation, useGetAllPermissionsQuery } from '../../../api/permission/permissionApi';
import { toast } from 'react-toastify';
// import { useGetAllPermissionsQuery, useCreateGroupWithPermissionsMutation } from '../../api/permissionsApi';

function CreateGroupModal({ open, setOpen }) {
  const { data, isLoading } = useGetAllPermissionsQuery();
  const [createGroupWithPermissions, { isLoading: isSubmitting }] = useCreateGroupWithPermissionsMutation();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [groupName, setGroupName] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!groupName || selectedPermissions.length === 0) {
    //   alert('Please enter a group name and select at least one permission.');
      toast.error("Please enter group name & add atleast one Permission")
      return;
    }

    try {
      await createGroupWithPermissions({ name: groupName, permissions: selectedPermissions }).unwrap();
    //   alert('Group created successfully!');
      toast.success('Group created successfully!')
      setGroupName('');
      setSelectedPermissions([]);
      setOpen(false);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
      
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
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add User Group</h2>
        <TextField
          fullWidth
          label="Group Name"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ marginBottom: '20px' }}
        />
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
                {data?.data.map((item) => (
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
          {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default CreateGroupModal;
