import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreatePunchPointMutation } from '../../../../api/hoto/punchPointApi';
import { useParams } from 'react-router-dom';

const AddPunchPointForm = ({ open, handleClose, onSuccess }) => {
  // Initialize the mutation hook
  const [createPunchPoint, { isLoading }] = useCreatePunchPointMutation();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    punch_title: '',
    punch_description: '',
    punch_file: [] // Changed field name to match backend
  });

  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.punch_title.trim()) {
      newErrors.punch_title = 'Title is required';
    }
    
    if (!formData.punch_description.trim()) {
      newErrors.punch_description = 'Description is required';
    }
    
    if (formData.punch_file.length === 0) {
      newErrors.punch_file = 'At least one file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the error for this field when user changes it
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (newFiles.length > 0) {
      // Add the new files to the existing files array
      setFormData((prev) => ({
        ...prev,
        punch_file: [...prev.punch_file, ...newFiles]
      }));
      
      // Clear file error if it exists
      if (errors.punch_file) {
        setErrors((prev) => ({
          ...prev,
          punch_file: undefined
        }));
      }
    }
    
    // Clear the file input to allow selecting the same files again
    e.target.value = '';
  };
  
  const handleRemoveFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      punch_file: prev.punch_file.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Create FormData object for file upload
        const submitData = new FormData();
        submitData.append('punch_title', formData.punch_title);
        submitData.append('punch_description', formData.punch_description);
        
        // Append all files with the same field name 'punch_file' for multiple file upload
        formData.punch_file.forEach((file) => {
          submitData.append('punch_file', file);
        });
        
        // Use the mutation hook to send the data with projectId
        const response = await createPunchPoint({ 
          projectId: projectId, 
          formData: submitData 
        }).unwrap();
        
        console.log('Punch point created successfully:', response);
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Reset form and close modal on success
        resetForm();
        handleClose();
      } catch (error) {
        console.error('Failed to create punch point:', error);
        // You could display an error message here
        setErrors({ submit: error?.data?.message || 'Failed to create punch point' });
      }
    }
  };
  
  const resetForm = () => {
    setFormData({
      punch_title: '',
      punch_description: '',
      punch_file: []
    });
    setErrors({});
  };
  
  const handleReset = () => {
    resetForm();
  };
  
  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#29346B', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6" component="div">
          Add New Punch Point
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Punch Title"
                name="punch_title"
                value={formData.punch_title}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.punch_title}
                helperText={errors.punch_title}
                required
              />
            </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Punch Description"
                name="punch_description"
                value={formData.punch_description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                error={!!errors.punch_description}
                helperText={errors.punch_description}
                required
              />
            </Grid>
            
            {/* Multiple File Upload */}
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  p: 3,
                  textAlign: 'center',
                  mb: 2,
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#29346B',
                    backgroundColor: '#f1f3f9'
                  }
                }}
                onClick={() => document.getElementById('punch-file-input').click()}
              >
                <input
                  type="file"
                  id="punch-file-input"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  multiple // Enable multiple file selection
                />
                
                <CloudUploadIcon sx={{ fontSize: 48, color: '#29346B', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Punch Point Files
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Drag & drop your files here or click to browse
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                  Supported formats: PDF, Word, Excel, JPG, PNG
                </Typography>
              </Box>
              
              {/* Display selected files list */}
              {formData.punch_file.length > 0 && (
                <List 
                  sx={{ 
                    bgcolor: '#f5f5f5', 
                    borderRadius: '8px', 
                    mt: 2, 
                    maxHeight: '200px', 
                    overflowY: 'auto' 
                  }}
                >
                  {formData.punch_file.map((file, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <DescriptionIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={file.name}
                        secondary={formatFileSize(file.size)}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleRemoveFile(index)}
                          size="small"
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
              
              {errors.punch_file && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.punch_file}
                </Typography>
              )}
            </Grid>

            {/* Display submit error if any */}
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errors.submit}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleReset}
          variant="outlined"
          sx={{ 
            borderColor: '#f44336', 
            color: '#f44336',
            '&:hover': {
              borderColor: '#d32f2f',
              backgroundColor: 'rgba(244, 67, 54, 0.04)'
            }
          }}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderColor: '#9e9e9e', 
            color: '#616161',
            '&:hover': {
              borderColor: '#616161',
              backgroundColor: 'rgba(97, 97, 97, 0.04)'
            }
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{ 
            bgcolor: '#29346B',
            '&:hover': {
              bgcolor: '#1e2756'
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Submit'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPunchPointForm;
