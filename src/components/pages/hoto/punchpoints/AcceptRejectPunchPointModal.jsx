import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import { useAcceptRejectPunchPointMutation } from '../../../../api/hoto/punchPointApi';
// import { useAcceptRejectPunchPointMutation } from '../../api/hoto/punchPointApi';

function AcceptRejectPunchPointModal({ open, handleClose, punchPoint, projectId, onSuccess }) {
  const [acceptRejectPunchPoint, { isLoading }] = useAcceptRejectPunchPointMutation();
  
  const [formState, setFormState] = useState({
    is_accepted: 'true',
    punch_description: '',
    tentative_timeline: '',
    comments: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
    if (!formState.punch_description.trim()) {
      setError('Punch description is required');
      return;
    }
    if (!formState.tentative_timeline) {
      setError('Tentative timeline is required');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('punch_id', punchPoint.id);
    formData.append('is_accepted', formState.is_accepted);
    formData.append('punch_description', formState.punch_description);
    formData.append('tentative_timeline', formState.tentative_timeline);
    formData.append('comments', formState.comments);
    
    // Add all selected files
    selectedFiles.forEach(file => {
      formData.append('punch_file', file);
    });

    try {
      const result = await acceptRejectPunchPoint({ 
        projectId, 
        formData 
      }).unwrap();
      
      setSuccess(result.message || 'Operation completed successfully');
      
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
    setFormState({
      is_accepted: 'true',
      punch_description: '',
      tentative_timeline: '',
      comments: '',
    });
    setSelectedFiles([]);
    setError(null);
    setSuccess(null);
    handleClose();
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!punchPoint) return null;

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
        <Typography variant="h6" component="div">
          Accept/Reject Punch Point
        </Typography>
        <IconButton
          onClick={handleCloseModal}
          sx={{ color: 'white' }}
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Punch Point Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Punch Point Details
          </Typography>
          <Typography variant="body1" fontWeight="600">
            {punchPoint.punch_title}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {punchPoint.punch_description}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`Status: ${punchPoint.status}`} 
              size="small" 
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`Created by: ${punchPoint.created_by_name}`} 
              size="small"
              variant="outlined"
            />
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

        {/* Decision Radio Buttons */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ color: '#29346B', fontWeight: '600' }}>
            Decision *
          </FormLabel>
          <RadioGroup
            row
            name="is_accepted"
            value={formState.is_accepted}
            onChange={handleInputChange}
          >
            <FormControlLabel 
              value="true" 
              control={<Radio sx={{ color: '#29346B', '&.Mui-checked': { color: '#29346B' } }} />} 
              label="Accept" 
            />
            <FormControlLabel 
              value="false" 
              control={<Radio sx={{ color: '#29346B', '&.Mui-checked': { color: '#29346B' } }} />} 
              label="Reject" 
            />
          </RadioGroup>
        </FormControl>

        {/* Punch Description */}
        <TextField
          fullWidth
          label="Punch Description"
          name="punch_description"
          value={formState.punch_description}
          onChange={handleInputChange}
          multiline
          rows={3}
          required
          placeholder={formState.is_accepted === 'true' 
            ? "Describe how the issue has been resolved..." 
            : "Explain why this punch point is being rejected..."}
          sx={{ mb: 2 }}
        />

        {/* Tentative Timeline */}
        <TextField
          fullWidth
          label="Tentative Timeline"
          name="tentative_timeline"
          type="date"
          value={formState.tentative_timeline}
          onChange={handleInputChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getMinDate()
          }}
          sx={{ mb: 2 }}
        />

        {/* Comments */}
        <TextField
          fullWidth
          label="Comments (Optional)"
          name="comments"
          value={formState.comments}
          onChange={handleInputChange}
          multiline
          rows={2}
          placeholder="Add any additional comments..."
          sx={{ mb: 2 }}
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
            Upload Files
            <input
              type="file"
              hidden
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            Upload supporting documents or images (optional)
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
          sx={{
            bgcolor: formState.is_accepted === 'true' ? '#4caf50' : '#f44336',
            '&:hover': {
              bgcolor: formState.is_accepted === 'true' ? '#45a049' : '#d32f2f'
            },
            minWidth: '120px'
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            formState.is_accepted === 'true' ? 'Accept' : 'Reject'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AcceptRejectPunchPointModal;
