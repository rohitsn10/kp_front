import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useMarkPunchPointCompletedMutation } from '../../../../api/hoto/punchPointApi';
// import { useMarkPunchPointCompletedMutation } from '../../api/hoto/punchPointApi';

function MarkCompletedModal({ open, handleClose, completedPunchPoint, projectId, onSuccess }) {
  const [markPunchPointCompleted, { isLoading }] = useMarkPunchPointCompletedMutation();
  
  const [remarks, setRemarks] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Remove selected file
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!remarks.trim()) {
      setError('Remarks are required');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('completed_punch_id', completedPunchPoint.id);
    formData.append('remarks', remarks);
    
    // Add all selected files
    selectedFiles.forEach(file => {
      formData.append('punch_file', file);
    });

    try {
      const result = await markPunchPointCompleted({ 
        projectId, 
        formData 
      }).unwrap();
      
      setSuccess(result.message || 'Punch point marked as completed successfully');
      
      // Call onSuccess callback after short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        handleCloseModal();
      }, 1500);
      
    } catch (err) {
      setError(err?.data?.message || 'Operation failed. Please try again.');
    }
  };

  // Reset and close modal
  const handleCloseModal = () => {
    setRemarks('');
    setSelectedFiles([]);
    setError(null);
    setSuccess(null);
    handleClose();
  };

  if (!completedPunchPoint) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#29346B', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutlineIcon />
          <Typography variant="h6" component="div">
            Mark Punch Point as Completed
          </Typography>
        </Box>
        <IconButton
          onClick={handleCloseModal}
          sx={{ color: 'white' }}
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Completed Punch Point Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Completed Punch Point Details
          </Typography>
          <Typography variant="body1" fontWeight="600">
            ID: #{completedPunchPoint.id}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {completedPunchPoint.punch_description || 'No description available'}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`Status: ${completedPunchPoint.status || 'Accepted'}`} 
              size="small" 
              color="primary"
              variant="outlined"
            />
            {completedPunchPoint.tentative_timeline && (
              <Chip 
                label={`Timeline: ${new Date(completedPunchPoint.tentative_timeline).toLocaleDateString('en-GB')}`} 
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Show alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Remarks */}
        <TextField
          fullWidth
          label="Remarks"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          multiline
          rows={4}
          required
          placeholder="Add remarks about the completion status..."
          sx={{ mb: 2 }}
          helperText="Describe what work has been completed and any relevant details"
        />

        {/* File Upload */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: '#29346B',
              color: '#29346B',
              '&:hover': {
                borderColor: '#1e2756',
                bgcolor: '#f0f0f0'
              }
            }}
          >
            Upload Supporting Files
            <input
              type="file"
              hidden
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            Upload photos or documents showing completed work (optional)
          </Typography>
        </Box>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Files ({selectedFiles.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selectedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: '4px'
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Info Box */}
        <Box sx={{ 
          p: 2, 
          bgcolor: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #90caf9'
        }}>
          <Typography variant="body2" color="primary">
            <strong>Note:</strong> Marking this punch point as completed will update its status to "Completed" 
            and notify the relevant stakeholders.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
        <Button
          onClick={handleCloseModal}
          disabled={isLoading}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
          sx={{
            bgcolor: '#4caf50',
            '&:hover': {
              bgcolor: '#45a049'
            },
            minWidth: '160px'
          }}
        >
          {isLoading ? 'Marking Complete...' : 'Mark as Completed'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MarkCompletedModal;
