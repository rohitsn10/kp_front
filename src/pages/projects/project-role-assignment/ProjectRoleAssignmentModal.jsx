import React, { useState, useEffect } from 'react';
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
import { useFetchUsersQuery } from '../../../api/users/usersApi';
// import { useFetchUsersQuery } from "../../../api/users/usersApi";

const ProjectRoleAssignmentModal = ({ open, handleClose, projectId, projectName }) => {
  // Fetch users data
  const { data: usersData, isLoading } = useFetchUsersQuery();
  
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Transform users data for dropdown options
  const userOptions = usersData?.data?.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    group_name: user.group_name
  })) || [];

  // Initialize role assignments
  useEffect(() => {
    if (open) {
      // Initialize empty assignments for all roles
      const initialAssignments = {};
      roles.forEach(role => {
        initialAssignments[role] = [];
      });
      setRoleAssignments(initialAssignments);
      setError('');
      setSuccess('');
      
      // Load existing assignments if available
      loadExistingAssignments();
    }
  }, [open, projectId]);

  // Mock function to load existing assignments
  const loadExistingAssignments = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual API call
      // const response = await fetch(`/api/projects/${projectId}/role-assignments`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockExistingAssignments = {
        'Project Director': [
          { id: 14, full_name: 'Viraj', email: 'vj@gmail.com', group_name: 'Viewer' }
        ],
        'Manager': [
          { id: 13, full_name: 'Kedar', email: 'kedar@gmail.com', group_name: 'Viewer' }
        ]
      };
      
      // Simulate delay
      setTimeout(() => {
        setRoleAssignments(prev => ({
          ...prev,
          ...mockExistingAssignments
        }));
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load existing role assignments');
      setLoading(false);
    }
  };

  // Handle role assignment change
  const handleRoleChange = (role, selectedUsers) => {
    setRoleAssignments(prev => ({
      ...prev,
      [role]: selectedUsers || []
    }));
  };

  // Handle save assignments
  const handleSaveAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare payload for backend
      const payload = {
        project_id: projectId,
        role_assignments: Object.entries(roleAssignments)
          .filter(([role, users]) => users.length > 0)
          .map(([role, users]) => ({
            role_name: role,
            user_ids: users.map(user => user.id),
            users: users.map(user => ({
              id: user.id,
              full_name: user.full_name,
              email: user.email
            }))
          }))
      };

      console.log('Payload to be sent to backend:', payload);
      
      // Simulate API call - replace with actual API call
      // const response = await fetch(`/api/projects/${projectId}/assign-roles`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(payload)
      // });
      
      // Simulate success response
      setTimeout(() => {
        setLoading(false);
        setSuccess('Role assignments saved successfully!');
        
        // Close modal after 2 seconds
        setTimeout(() => {
          handleClose();
          setSuccess('');
        }, 2000);
      }, 1500);
      
    } catch (err) {
      setError('Failed to save role assignments. Please try again.');
      setLoading(false);
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading && !success ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              {Object.keys(roleAssignments).some(role => roleAssignments[role].length > 0) 
                ? 'Saving role assignments...' 
                : 'Loading existing assignments...'}
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
                      isOptionEqualToValue={(option, value) => option.id === value.id}
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
                          placeholder={`Select users for ${role}`}
                          variant="outlined"
                          size="small"
                          sx={inputStyles}
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
          disabled={loading}
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
          disabled={loading || Object.entries(roleAssignments).filter(([role, users]) => users.length > 0).length === 0}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Assignments'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectRoleAssignmentModal;