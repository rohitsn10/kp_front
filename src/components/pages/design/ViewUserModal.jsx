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


function ViewUserModal({ open, handleClose, drawingDetails }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  // console.log(drawingDetails)
  // Fetch users data

  useEffect(() => {
    if (open && drawingDetails) {
      setSelectedUser(null);
      setAssignedUsers([]);
    }
  }, [open, drawingDetails]);
  
  const handleAssign = () => {
    // if (!selectedUser) return;
    
    // // Check if user is already assigned
    // if (assignedUsers.some(user => user.id === selectedUser.id)) {
    //   // Show error or notification that user is already assigned
    //   return;
    // }
    // // Add to local state
    // setAssignedUsers([...assignedUsers, selectedUser]);
    // // Here you would typically make an API call to assign the user
    // console.log(`Assigning user ${selectedUser.full_name} to drawing ${drawingDetails?.drawing_number}`);
    
    // // Reset selection
    // setSelectedUser(null);
  };
  
  const handleRemoveUser = (userId) => {
    // Remove from local state
    // setAssignedUsers(assignedUsers.filter(user => user.id !== userId));
    
    // // Here you would typically make an API call to unassign the user
    // console.log(`Removing user assignment for ID: ${userId}`);
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
        View Assigned users
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
          Users:
        </Typography>
        
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


export default ViewUserModal

