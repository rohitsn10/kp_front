import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  Alert,
  LinearProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useSubmitCompletedPunchPointMutation } from '../../../../api/hoto/punchPointApi';

// Import the RTK Query mutation hook
// import { useSubmitCompletedPunchPointMutation } from '../../services/api'; // Adjust path based on your project structure

const ClosePointsModal = ({ open, handleClose, punchPointData ,onSuccess}) => {
  // State for form fields
  const [pointsToClose, setPointsToClose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [files, setFiles] = useState([]);
  
  // State for validation and submission
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  // Initialize the mutation hook
  const [submitCompletedPunchPoint, { isLoading: isSubmitting }] = useSubmitCompletedPunchPointMutation();

  // Reset form when modal opens with new punch point data
  useEffect(() => {
    if (open && punchPointData) {
      setPointsToClose('');
      setRemarks('');
      setFiles([]);
      setErrors({});
      setAlertMessage(null);
    }
  }, [open, punchPointData]);

  if (!punchPointData) {
    return null;
  }

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    if (!fileName) return <ArticleIcon />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return <ArticleIcon />;
    }
    return <ArticleIcon />;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  // Remove file from list
  const handleRemoveFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate points to close
    if (!pointsToClose) {
      newErrors.pointsToClose = 'Number of points to close is required';
    } else if (isNaN(pointsToClose) || parseInt(pointsToClose) <= 0) {
      newErrors.pointsToClose = 'Please enter a positive number';
    } else if (parseInt(pointsToClose) > parseInt(punchPointData.punch_point_balance)) {
      newErrors.pointsToClose = `Cannot exceed remaining balance of ${punchPointData.punch_point_balance} points`;
    }
    
    // Validate remarks 
    if (!remarks.trim()) {
      newErrors.remarks = 'Remarks are required';
    } else if (remarks.trim().length < 5) {
      newErrors.remarks = 'Remarks should be at least 5 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData object for submission
      const formData = new FormData();
      formData.append('punch_id', punchPointData.id);
      formData.append('punch_description', remarks);
      formData.append('punch_point_completed', pointsToClose);
      formData.append('status', 'submit');
      
      // Append all files to the form data
      files.forEach(file => {
        formData.append('punch_file', file);
      });
      
      // Submit using the RTK Query mutation
      const response = await submitCompletedPunchPoint(formData).unwrap();
      
      // Show success message
      setAlertMessage({
        type: 'success',
        message: `Successfully submitted request to close ${pointsToClose} points!`
      });
      onSuccess();
      // Close modal after short delay on success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      // Show error message
      setAlertMessage({
        type: 'error',
        message: error.data?.message || 'Failed to submit close points request'
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isSubmitting ? handleClose : undefined}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Typography variant="h6" component="div" color="#29346B">
          Close Punch Points
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {alertMessage && (
          <Alert 
            severity={alertMessage.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlertMessage(null)}
          >
            {alertMessage.message}
          </Alert>
        )}

        {/* Punch Point Info */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            {punchPointData.punch_title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            File: {punchPointData.punch_file_name}
          </Typography>
          <Box mt={1} display="flex" flexWrap="wrap" gap={3}>
            <Typography variant="body2">
              <strong>Points Raised:</strong> {punchPointData.punch_point_raised}
            </Typography>
            <Typography variant="body2">
              <strong>Balance Points:</strong> {punchPointData.punch_point_balance}
            </Typography>
            <Typography variant="body2">
              <strong>Current Status:</strong> {punchPointData.status}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Close Points Form */}
        <Typography variant="subtitle2" gutterBottom>
          Close Points
        </Typography>

        {/* Points to Close Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Number of Points to Close"
          type="number"
          value={pointsToClose}
          onChange={(e) => setPointsToClose(e.target.value)}
          disabled={isSubmitting}
          error={!!errors.pointsToClose}
          helperText={errors.pointsToClose || `Maximum: ${punchPointData.punch_point_balance} points`}
          InputProps={{ inputProps: { min: 1, max: parseInt(punchPointData.punch_point_balance) || 1 } }}
        />

        {/* Remarks Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Remarks"
          multiline
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          disabled={isSubmitting}
          error={!!errors.remarks}
          helperText={errors.remarks || "Provide details about how these points have been addressed"}
          // placeholder="Example: Replaced cable termination and applied proper labeling according to specifications..."
        />

        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Supporting Documents
          </Typography>
          
          {/* File Upload Area */}
          <Box 
            sx={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: 1, 
              p: 3, 
              textAlign: 'center',
              bgcolor: '#f9fafb',
              '&:hover': { bgcolor: '#f3f4f6' }
            }}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              disabled={isSubmitting}
            />
            <label htmlFor="file-upload">
              <Button
                component="span"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={isSubmitting}
                sx={{ 
                  mb: 2, 
                  bgcolor: '#FACC15',
                  color: '#29346B',
                  '&:hover': { bgcolor: '#e5b812' }
                }}
              >
                Select Files
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              Upload evidence of completion (before/after photos, reports, etc.)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Supported formats: JPG, PNG, PDF, DOC, XLSX, ZIP (Max 10MB per file)
            </Typography>
          </Box>

          {/* Selected Files List - Simplified to only show file names */}
          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Selected Files ({files.length})
              </Typography>
              <Paper variant="outlined" sx={{ p: 1 }}>
                <List dense>
                  {files.map((file, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: '40px' }}>
                        {getFileIcon(file.name)}
                      </ListItemIcon>
                      <ListItemText primary={file.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFile(index)}
                          disabled={isSubmitting}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Upload Progress */}
        {isSubmitting && (
          <Box sx={{ width: '100%', mt: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" align="center" mt={1}>
              Processing submission...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={<DoneAllIcon />}
          sx={{ 
            bgcolor: '#10B981', 
            '&:hover': { bgcolor: '#059669' } 
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Close Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClosePointsModal;