import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { useUploadActivitySheetMutation } from '../../api/activity/activityApi'; // You'll need to create this API endpoint

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProjectActivityUploadDialog = ({ open, handleActivityClose, projectId, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  
  // const [uploadActivity, { isLoading }] = useUploadActivitySheetMutation(); // Uncomment when API is ready
  const isLoading = false; // Temporary placeholder

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Check if the file is an Excel file
      const validExcelTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12'
      ];
      
      if (validExcelTypes.includes(file.type)) {
        setSelectedFile(file);
        setError('');
      } else {
        setSelectedFile(null);
        setError('Please upload only Excel files (.xls, .xlsx)');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('project_id', projectId);
      
      // const response = await uploadActivity(formData).unwrap(); // Uncomment when API is ready
      
      // Temporary success simulation - remove this when API is implemented
      const response = { status: true, message: 'Activity sheet uploaded successfully!' };
      
      // Handle successful upload
      if (response.status === true) {
        setSuccessMessage(response.message || 'Activity sheet uploaded successfully!');
        setShowSuccessSnackbar(true);
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
        
        // Close dialog after small delay to allow user to see success message
        setTimeout(() => {
          handleDialogClose();
        }, 1500);
      } else {
        // API returned success: false
        setError(response.message || 'Failed to upload activity sheet. Please try again.');
      }
    } catch (err) {
      console.error('Error uploading activity sheet:', err);
      // Extract error message from the response
      const errorMessage = err.data?.message || 
                          (err.data?.status === false ? err.data.message : null) || 
                          'Failed to upload activity sheet. Please try again.';
      
      setError(errorMessage);
    }
  };

  const handleDialogClose = () => {
    setSelectedFile(null);
    setError('');
    setSuccessMessage('');
    handleActivityClose();
  };

  const handleSnackbarClose = () => {
    setShowSuccessSnackbar(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white', fontWeight: 'bold' }}>
          Upload Project Activity Sheet
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          
          <Box sx={{ mb: 3, mt: 5 }}>          
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                bgcolor: '#f9f9f9'
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#e67e00' } }}
              >
                Select Excel File
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.xlsm"
                />
              </Button>
              
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Accepts .xlsx, .xls, and .xlsm files only
              </Typography>
              
              {selectedFile && (
                <Box sx={{ mt: 2, p: 1, bgcolor: '#e8f4f8', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    Selected: {selectedFile.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDialogClose}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading || !selectedFile}
            sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#e67e00' } }}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload Activity'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProjectActivityUploadDialog;