import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

const AssignUserModal = ({ 
  open, 
  handleClose, 
  selectedUser,
  departmentData,
  projectData,
  groupData,
  assignUserAllThings,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    department_id: '',
    project_id: '',
    group_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens with a new user
  useEffect(() => {
    if (open && selectedUser) {
      setFormData({
        department_id: selectedUser.department || '',
        project_id: selectedUser.project_id || '',
        group_id: selectedUser.group_id || ''
      });
      setFormErrors({});
    }
  }, [open, selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Department is always required
    if (!formData.department_id) {
      errors.department_id = 'Department is required';
    }
    
    // Project is optional, but if selected, all fields must be filled
    if (formData.project_id) {
      // If project is selected, ensure department and group are also selected
      if (!formData.department_id) {
        errors.department_id = 'Department is required when a project is selected';
      }
      
      if (!formData.group_id) {
        errors.group_id = 'Group is required when a project is selected';
      }
    }
    
    // Group is always required
    if (!formData.group_id) {
      errors.group_id = 'Group is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data to send
      const submitData = new FormData();
      submitData.append('user_id', selectedUser.id.toString());
      submitData.append('department_id', formData.department_id.toString());
      
      // Always send project_id - as a value if selected, or explicitly as null if not
      submitData.append('project_id', formData.project_id ? formData.project_id.toString() : null);
      
      submitData.append('group_id', formData.group_id.toString());
      
      const response = await assignUserAllThings(submitData).unwrap();
      
      if (response && response.status) {
        toast.success('User assignments updated successfully!');
        onSuccess(); // Callback to refresh data
        handleClose();
      } else {
        toast.error(response?.message || 'Failed to update user assignments');
      }
    } catch (error) {
      console.error('Error assigning user:', error);
      toast.error('An error occurred while updating user assignments');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '500px',
          maxWidth: '90%',
          padding: '16px'
        }
      }}
    >
      <DialogTitle
        sx={{
          color: '#29346B',
          fontSize: '24px',
          fontWeight: '600',
          paddingTop: '16px',
        }}
      >
        Assign {selectedUser?.full_name || 'User'} to Department, Project & Group
      </DialogTitle>
      
      <DialogContent>
        <div className="flex flex-col gap-4 mt-4">
          {/* Department Selection */}
          <FormControl fullWidth error={Boolean(formErrors.department_id)}>
            <label htmlFor="department_id" className="block text-lg font-medium text-gray-700 mb-2">
              Department <span className="text-red-600">*</span>
            </label>
            <Select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              displayEmpty
              className="border rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
              sx={{
                height: '50px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Department</em>
              </MenuItem>
              {departmentData?.data?.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.department_name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.department_id && (
              <FormHelperText error>{formErrors.department_id}</FormHelperText>
            )}
          </FormControl>
          
          {/* Project Selection */}
          <FormControl fullWidth error={Boolean(formErrors.project_id)}>
            <label htmlFor="project_id" className="block text-lg font-medium text-gray-700 mb-2">
              Project
            </label>
            <Select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              displayEmpty
              className="border rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
              sx={{
                height: '50px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {projectData?.data?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.project_name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.project_id && (
              <FormHelperText error>{formErrors.project_id}</FormHelperText>
            )}
          </FormControl>
          
          {/* Group Selection */}
          <FormControl fullWidth error={Boolean(formErrors.group_id)}>
            <label htmlFor="group_id" className="block text-lg font-medium text-gray-700 mb-2">
              Group <span className="text-red-600">*</span>
            </label>
            <Select
              id="group_id"
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              displayEmpty
              className="border rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
              sx={{
                height: '50px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Group</em>
              </MenuItem>
              {groupData?.data?.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.group_id && (
              <FormHelperText error>{formErrors.group_id}</FormHelperText>
            )}
          </FormControl>
        </div>
      </DialogContent>
      
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: '#29346B',
            borderColor: '#29346B',
            fontSize: '16px',
            padding: '6px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            marginRight: '12px'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E66A1F',
            },
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ marginRight: '8px' }} />
              Saving...
            </>
          ) : (
            'Save Assignments'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserModal;