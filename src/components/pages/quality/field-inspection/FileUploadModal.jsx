import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUploadFilesInspectionOutcomeMutation } from '../../../../api/quality/qualityApi';

const FileUploadModal = ({ open, handleClose, rfiData }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const [uploadFiles, { isLoading }] = useUploadFilesInspectionOutcomeMutation();
  
  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const resetForm = () => {
    setFiles([]);
    setUploadProgress(0);
    setUploadStatus(null);
    setErrorMessage('');
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus('error');
      setErrorMessage('Please select at least one file to upload.');
      return;
    }
    
    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('rfi_id', rfiData.id);
      
      // Append all files to the FormData
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Upload files simulation with progress
      setUploadProgress(0);
      setUploadStatus(null);
      
      // Simulate progress (in a real app, you might get progress from your upload library)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Send the FormData directly to the mutation
      const result = await uploadFiles(formData).unwrap();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Handle successful response
      setUploadStatus('success');
      console.log('Files uploaded successfully:', result);
      
      // Close the modal after a delay to show success state
      setTimeout(() => {
        handleClose();
        resetForm();
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('error');
      setErrorMessage(error.data?.message || 'Failed to upload files. Please try again.');
      setUploadProgress(0);
    }
  };
  
  const handleDialogClose = () => {
    if (!isLoading) {
      handleClose();
      resetForm();
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: '#29346B', color: 'white' }}>
        Upload Files for RFI: {rfiData?.rfi_number || ''}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            EPC Name: {rfiData?.epc_name || 'N/A'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Location: {`${rfiData?.block_number || ''} ${rfiData?.location_name || ''}`}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {/* File Upload Section */}
          <Box 
            sx={{ 
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              mb: 3,
              bgcolor: '#f9f9f9'
            }}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={isLoading}
                sx={{
                  bgcolor: "#29346B",
                  "&:hover": { bgcolor: "#1e2756" }
                }}
              >
                Select Files
              </Button>
            </label>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Supports PDF, JPG, PNG, DOCX (Max 10MB per file)
            </Typography>
          </Box>
          
          {/* Selected Files List */}
          {files.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected Files:
              </Typography>
              <List dense>
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={() => handleRemoveFile(index)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {/* Progress Bar */}
          {isLoading && (
            <Box sx={{ width: '100%', mt: 2, mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 2 }}
              />
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}
          
          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Files uploaded successfully!
            </Alert>
          )}
          
          {uploadStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleDialogClose} 
          disabled={isLoading}
          sx={{ color: '#29346B' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
          sx={{
            bgcolor: "#10B981",
            "&:hover": { bgcolor: "#059669" }
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadModal;