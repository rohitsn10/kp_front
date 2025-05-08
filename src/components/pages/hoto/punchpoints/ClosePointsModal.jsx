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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormHelperText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ClosePointsModal = ({ open, handleClose, punchPointData, onSubmitClosePoints }) => {
  // State for form fields
  const [pointsToClose, setPointsToClose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [files, setFiles] = useState([]);
  
  // State for validation and submission
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);

  // Reset form when modal opens with new punch point data
  useEffect(() => {
    if (open && punchPointData) {
      setPointsToClose('');
      setRemarks('');
      setFiles([]);
      setErrors({});
      setAlertMessage(null);
      setUploadProgress(0);
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
      return <ImageIcon />;
    }
    return <ArticleIcon />;
  };

  // Format file size in human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    } else if (remarks.trim().length < 10) {
      newErrors.remarks = 'Remarks should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          
          // Simulate API submission
          setTimeout(() => {
            try {
              // Prepare submission data
              const closePointsData = {
                punchPointId: punchPointData.id,
                pointsClosed: parseInt(pointsToClose),
                remarks: remarks,
                files: files.map(file => ({ 
                  name: file.name, 
                  size: file.size, 
                  type: file.type 
                }))
              };
              
              // Call the handler function (would be API in real implementation)
              if (onSubmitClosePoints) {
                onSubmitClosePoints(closePointsData);
              }
              
              setAlertMessage({
                type: 'success',
                message: `Successfully submitted request to close ${pointsToClose} points!`
              });
              
              // Close modal after short delay on success
              setTimeout(() => {
                handleClose();
              }, 2000);
              
            } catch (error) {
              setAlertMessage({
                type: 'error',
                message: error.message || 'Failed to submit close points request'
              });
            } finally {
              setIsSubmitting(false);
            }
          }, 500);
          
          return 100;
        }
        return prevProgress + 5;
      });
    }, 200);
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
          placeholder="Example: Replaced cable termination and applied proper labeling according to specifications..."
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

          {/* Selected Files List */}
          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Selected Files ({files.length})
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                      <TableCell>File Name</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getFileIcon(file.name)}
                            <Typography variant="body2" ml={1} sx={{ maxWidth: 250 }} noWrap>
                              {file.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>{file.type || 'Unknown'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFile(index)}
                            disabled={isSubmitting}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>

        {/* Upload Progress */}
        {isSubmitting && (
          <Box sx={{ width: '100%', mt: 3 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="text.secondary" align="center" mt={1}>
              {uploadProgress < 100 ? 
                `Uploading... ${uploadProgress}%` : 
                'Processing submission...'
              }
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