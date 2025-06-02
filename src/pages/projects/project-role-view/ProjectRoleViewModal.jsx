import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import { Person, Email, Group, Close, Assignment } from '@mui/icons-material';

const ProjectRoleViewModal = ({ open, handleClose, projectId, projectName }) => {
  const [roleData, setRoleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalAssignments, setTotalAssignments] = useState(0);

  // Mock function to load role assignments
  const loadRoleAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call - replace with actual API call
      // const response = await fetch(`/api/projects/${projectId}/role-assignments`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockRoleData = {
        'Project Director': [
          {
            id: 14,
            full_name: 'Viraj Kumar',
            email: 'vj@gmail.com',
            phone: '9030032',
            group_name: 'Admin',
            designation: 'Senior Project Director',
            department: 'Engineering',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-01T10:30:00Z',
            assigned_by: 'John Admin'
          },
          {
            id: 17,
            full_name: 'Sarah Johnson',
            email: 'sarah.j@company.com',
            phone: '9876543210',
            group_name: 'Manager',
            designation: 'Project Director',
            department: 'Engineering',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-02T14:15:00Z',
            assigned_by: 'John Admin'
          }
        ],
        'Manager': [
          {
            id: 13,
            full_name: 'Kedar Sharma',
            email: 'kedar@gmail.com',
            phone: '981928289',
            group_name: 'Manager',
            designation: 'Project Manager',
            department: 'Operations',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-01T11:00:00Z',
            assigned_by: 'Viraj Kumar'
          }
        ],
        'Sr. Engineer': [
          {
            id: 15,
            full_name: 'Amit Patel',
            email: 'amit.p@company.com',
            phone: '7894561230',
            group_name: 'Engineer',
            designation: 'Senior Engineer',
            department: 'Technical',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-01T12:30:00Z',
            assigned_by: 'Kedar Sharma'
          },
          {
            id: 16,
            full_name: 'Priya Singh',
            email: 'priya.s@company.com',
            phone: '8529637410',
            group_name: 'Engineer',
            designation: 'Senior Engineer',
            department: 'Technical',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-02T09:45:00Z',
            assigned_by: 'Viraj Kumar'
          }
        ],
        'Civil Quality Engineer': [
          {
            id: 18,
            full_name: 'Rajesh Gupta',
            email: 'rajesh.g@company.com',
            phone: '9632587410',
            group_name: 'Engineer',
            designation: 'Quality Engineer',
            department: 'Quality Assurance',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-01T16:20:00Z',
            assigned_by: 'Sarah Johnson'
          }
        ],
        'Assistant': [
          {
            id: 19,
            full_name: 'Neha Verma',
            email: 'neha.v@company.com',
            phone: '7410852963',
            group_name: 'Support',
            designation: 'Project Assistant',
            department: 'Administration',
            profile_image: 'http://127.0.0.1:8000/media/profile_image/default_profile.jpeg',
            assigned_at: '2024-06-03T08:00:00Z',
            assigned_by: 'Kedar Sharma'
          }
        ]
      };
      
      // Calculate total assignments
      const total = Object.values(mockRoleData).reduce((sum, users) => sum + users.length, 0);
      
      // Simulate delay
      setTimeout(() => {
        setRoleData(mockRoleData);
        setTotalAssignments(total);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load role assignments');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && projectId) {
      loadRoleAssignments();
    } else {
      // Reset state when modal closes
      setRoleData({});
      setTotalAssignments(0);
      setError('');
    }
  }, [open, projectId]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role color based on role type
  const getRoleColor = (role) => {
    const colorMap = {
      'Project Director': '#1976d2',
      'Director - Projects': '#1565c0',
      'GM Project Management': '#0d47a1',
      'Manager': '#388e3c',
      'Sr. Manager': '#2e7d32',
      'Deputy Manager': '#1b5e20',
      'Assistant Manager': '#4caf50',
      'Commissioning Manager': '#ff9800',
      'Engineer': '#9c27b0',
      'Sr. Engineer': '#7b1fa2',
      'Civil Quality Engineer': '#673ab7',
      'Officer': '#795548',
      'Assistant': '#607d8b'
    };
    return colorMap[role] || '#757575';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
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
        fontSize: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h5" component="div" fontWeight="bold" display="flex" alignItems="center">
            <Assignment sx={{ mr: 1 }} />
            Project Role Assignments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Project: {projectName}
          </Typography>
          {totalAssignments > 0 && (
            <Chip 
              label={`${totalAssignments} Total Assignments`} 
              size="small" 
              color="primary" 
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} sx={{ color: '#666' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Alert severity="error" sx={{ m: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress size={50} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading role assignments...
            </Typography>
          </Box>
        ) : Object.keys(roleData).length === 0 ? (
          <Box textAlign="center" py={6}>
            <Assignment sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No Role Assignments Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No users have been assigned roles to this project yet.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {Object.entries(roleData).map(([role, users], roleIndex) => (
              <Box key={role} sx={{ mb: 3 }}>
                <Box sx={{ 
                  backgroundColor: getRoleColor(role), 
                  color: 'white', 
                  p: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {role}
                    </Typography>
                    <Badge badgeContent={users.length} color="secondary">
                      <Group />
                    </Badge>
                  </Box>
                </Box>
                
                <List sx={{ py: 0 }}>
                  {users.map((user, userIndex) => (
                    <React.Fragment key={user.id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <ListItemAvatar>
                          <Avatar 
                            src={user.profile_image} 
                            sx={{ 
                              width: 56, 
                              height: 56,
                              border: `3px solid ${getRoleColor(role)}20`
                            }}
                          >
                            {user.full_name?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText 
                          sx={{ ml: 2 }}
                          primary={
                            <Box>
                              <Typography variant="h6" fontWeight="semibold" color="#29346B">
                                {user.full_name}
                              </Typography>
                              <Box display="flex" gap={1} mt={1}>
                                <Chip 
                                  label={user.group_name} 
                                  size="small" 
                                  variant="outlined"
                                  color="primary"
                                />
                                {user.designation && (
                                  <Chip 
                                    label={user.designation} 
                                    size="small" 
                                    variant="outlined"
                                    color="secondary"
                                  />
                                )}
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Box display="flex" alignItems="center" mb={0.5}>
                                <Email sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {user.email}
                                </Typography>
                              </Box>
                              
                              {user.phone && (
                                <Box display="flex" alignItems="center" mb={0.5}>
                                  <Person sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {user.phone}
                                  </Typography>
                                </Box>
                              )}
                              
                              {user.department && (
                                <Box display="flex" alignItems="center" mb={0.5}>
                                  <Group sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {user.department}
                                  </Typography>
                                </Box>
                              )}
                              
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Assigned on {formatDate(user.assigned_at)} by {user.assigned_by}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      
                      {userIndex < users.length - 1 && (
                        <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
                
                {roleIndex < Object.keys(roleData).length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #E0E3E7', backgroundColor: '#F8F9FA' }}>
        <Button 
          onClick={handleClose} 
          variant="contained"
          sx={{
            backgroundColor: '#29346B',
            '&:hover': {
              backgroundColor: '#1E2A5A'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectRoleViewModal;