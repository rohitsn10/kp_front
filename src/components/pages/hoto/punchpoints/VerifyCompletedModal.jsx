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
import VerifiedIcon from '@mui/icons-material/Verified';
import BuildIcon from '@mui/icons-material/Build';
import { useVerifyCompletedPunchPointNewMutation } from '../../../../api/hoto/punchPointApi';
// import { useVerifyCompletedPunchPointNewMutation } from '../../api/hoto/punchPointApi';

function VerifyCompletedModal({ open, handleClose, completedPunchPoint, projectId, onSuccess }) {
  const [verifyCompletedPunchPoint, { isLoading }] = useVerifyCompletedPunchPointNewMutation();
  const [formState, setFormState] = useState({
    status: 'Verified',
    verify_description: '',
  });
  
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

  // Handle form submission
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!formState.verify_description.trim()) {
      setError('Verification description is required');
      return;
    }

    // Create data object
    const data = {
      completed_punch_id: completedPunchPoint.id,
      verify_description: formState.verify_description,
      status: formState.status,
    };

    try {
      const result = await verifyCompletedPunchPoint({ 
        projectId, 
        data 
      }).unwrap();
      
      setSuccess(result.message || 'Punch point verified successfully');
      
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
      status: 'Verified',
      verify_description: '',
    });
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
          <VerifiedIcon />
          <Typography variant="h6" component="div">
            Verify Completed Punch Point
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
          
          {/* Show remarks if available */}
          {completedPunchPoint.remarks && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="textSecondary" fontWeight="600">
                Remarks:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {completedPunchPoint.remarks}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`Status: ${completedPunchPoint.status || 'Completed'}`} 
              size="small" 
              color="success"
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

        {/* Verification Status Radio Buttons */}
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend" sx={{ color: '#29346B', fontWeight: '600', mb: 1 }}>
            Verification Status *
          </FormLabel>
          <RadioGroup
            row
            name="status"
            value={formState.status}
            onChange={handleInputChange}
            sx={{ gap: 2 }}
          >
            <FormControlLabel 
              value="Verified" 
              control={
                <Radio 
                  sx={{ 
                    color: '#4caf50', 
                    '&.Mui-checked': { color: '#4caf50' } 
                  }} 
                />
              } 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                  <Typography>Verified</Typography>
                </Box>
              }
              sx={{
                border: formState.status === 'Verified' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 16px',
                margin: 0,
                flex: 1,
                bgcolor: formState.status === 'Verified' ? '#f1f8f4' : 'transparent'
              }}
            />
            <FormControlLabel 
              value="Rework" 
              control={
                <Radio 
                  sx={{ 
                    color: '#ff9800', 
                    '&.Mui-checked': { color: '#ff9800' } 
                  }} 
                />
              } 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BuildIcon sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
                  <Typography>Needs Rework</Typography>
                </Box>
              }
              sx={{
                border: formState.status === 'Rework' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 16px',
                margin: 0,
                flex: 1,
                bgcolor: formState.status === 'Rework' ? '#fff8e1' : 'transparent'
              }}
            />
          </RadioGroup>
        </FormControl>

        {/* Verification Description */}
        <TextField
          fullWidth
          label="Verification Description"
          name="verify_description"
          value={formState.verify_description}
          onChange={handleInputChange}
          multiline
          rows={4}
          required
          placeholder={formState.status === 'Verified' 
            ? "Describe what has been verified and confirm the work meets requirements..." 
            : "Explain what issues were found and what needs to be reworked..."}
          sx={{ mb: 2 }}
          helperText={
            formState.status === 'Verified' 
              ? "Confirm that the completed work meets all requirements and standards"
              : "Specify what needs to be corrected or improved"
          }
        />

        {/* Info Box */}
        <Box sx={{ 
          p: 2, 
          bgcolor: formState.status === 'Verified' ? '#e8f5e9' : '#fff3e0', 
          borderRadius: '8px',
          border: `1px solid ${formState.status === 'Verified' ? '#4caf50' : '#ff9800'}`
        }}>
          <Typography variant="body2" sx={{ color: formState.status === 'Verified' ? '#2e7d32' : '#e65100' }}>
            <strong>Note:</strong> {formState.status === 'Verified' 
              ? 'Verifying this punch point will mark it as "Verified" and close the work item.'
              : 'Marking this as "Rework" will send it back for corrections. The original punch point status will be updated to "Rework".'}
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
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : formState.status === 'Verified' ? (
              <VerifiedIcon />
            ) : (
              <BuildIcon />
            )
          }
          sx={{
            bgcolor: formState.status === 'Verified' ? '#4caf50' : '#ff9800',
            '&:hover': {
              bgcolor: formState.status === 'Verified' ? '#45a049' : '#f57c00'
            },
            minWidth: '160px'
          }}
        >
          {isLoading ? 'Processing...' : formState.status === 'Verified' ? 'Verify' : 'Send for Rework'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VerifyCompletedModal;
