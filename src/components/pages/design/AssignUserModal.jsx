import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import { useFetchUsersQuery } from '../../../api/users/usersApi';
// import { useFetchUsersQuery } from '../services/api'; // Adjust path as needed

function AssignUserModal({ open, handleClose, drawingDetails }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  console.log(drawingDetails)
  // Fetch users data
  const { data: usersData, isLoading, error } = useFetchUsersQuery();
console.log(usersData)
  useEffect(() => {
    // Reset selections when the modal opens with new drawing details
    if (open && drawingDetails) {
      setSelectedUser(null);
      // You can fetch already assigned users for this drawing here if needed
      // For now, we'll use an empty array
      setAssignedUsers([]);
    }
  }, [open, drawingDetails]);
  
  const handleAssign = () => {
    if (!selectedUser) return;
    
    // Check if user is already assigned
    if (assignedUsers.some(user => user.id === selectedUser.id)) {
      // Show error or notification that user is already assigned
      return;
    }
    // Add to local state
    setAssignedUsers([...assignedUsers, selectedUser]);
    // Here you would typically make an API call to assign the user
    console.log(`Assigning user ${selectedUser.full_name} to drawing ${drawingDetails?.drawing_number}`);
    
    // Reset selection
    setSelectedUser(null);
  };
  
  const handleRemoveUser = (userId) => {
    // Remove from local state
    setAssignedUsers(assignedUsers.filter(user => user.id !== userId));
    
    // Here you would typically make an API call to unassign the user
    console.log(`Removing user assignment for ID: ${userId}`);
  };
  
  const handleSave = () => {
    // Here you would make an API call to save all assigned users
    // console.log('Saving assigned users:', assignedUsers);
    // console.log('For drawing:', drawingDetails);
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: '#29346B', color: 'white', py: 2 }}>
        Assign Users to Drawing
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        {drawingDetails && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#29346B', mb: 1 }}>
              Drawing Details
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Typography variant="body1"><strong>Number:</strong> {drawingDetails.drawing_number}</Typography>
              <Typography variant="body1"><strong>Name:</strong> {drawingDetails.name_of_drawing}</Typography>
              <Typography variant="body1"><strong>Discipline:</strong> {drawingDetails.discipline}</Typography>
              <Typography variant="body1"><strong>Category:</strong> {drawingDetails.drawing_category}</Typography>
            </Box>
          </Box>
        )}

        <Typography variant="h6" sx={{ color: '#29346B', mb: 1 }}>
          Select User to Assign
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error loading users: {error.message}</Typography>
        ) : (
          <Autocomplete
            options={usersData || []}
            getOptionLabel={(option) => `${option.full_name} - ${option.email} (${option.designation || 'No designation'})`}
            renderOption={(props, option) => (
              <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} {...props}>
                <Avatar 
                  src={option.profile_image} 
                  alt={option.full_name} 
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography variant="body1">{option.full_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.email} - {option.designation || 'No designation'}
                  </Typography>
                </Box>
              </Box>
            )}
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Users"
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                }}
              />
            )}
          />
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleAssign}
            disabled={!selectedUser}
            sx={{ 
              bgcolor: "#4F46E5", 
              "&:hover": { bgcolor: "#4338CA" }
            }}
          >
            Assign Selected User
          </Button>
        </Box>
        
        {assignedUsers.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: '#29346B', mb: 1 }}>
              Currently Assigned Users
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {assignedUsers.map(user => (
                <Chip
                  key={user.id}
                  avatar={<Avatar src={user.profile_image} alt={user.full_name} />}
                  label={`${user.full_name} (${user.designation || 'No designation'})`}
                  onDelete={() => handleRemoveUser(user.id)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            borderColor: "#29346B", 
            color: "#29346B",
            "&:hover": { borderColor: "#1e2756", backgroundColor: "#f0f0f0" }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ 
            bgcolor: "#29346B", 
            "&:hover": { bgcolor: "#1e2756" }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssignUserModal;