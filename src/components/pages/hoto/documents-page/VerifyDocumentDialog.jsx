import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Chip
} from "@mui/material";
import { toast } from "react-toastify";
import { useVerifyDocumentMutation } from '../../../../api/hoto/hotoApi';
// import { useVerifyDocumentMutation } from '../../path/to/your/api'; // Update with your actual API path

// Component for document verification
const VerifyDocumentDialog = ({ open, handleClose, documentData, onVerifyDocument }) => {
  const [verifyComment, setVerifyComment] = useState("");
  const [status, setStatus] = useState("Approved");
  const [error, setError] = useState(null);
  
  // Use the RTK Query mutation hook
  const [verifyDocument, { isLoading }] = useVerifyDocumentMutation();
  
  // Initialize form with document data if available
  useEffect(() => {
    if (documentData) {
      setStatus(documentData.status || "Approved");
      setVerifyComment(documentData.verify_comment || "");
    }
  }, [documentData]);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);
  
  // Status options with colors for visual feedback
  const statusOptions = [
    { value: "Approved", label: "Approved", color: "#10B981" },
    { value: "Rejected", label: "Rejected", color: "#EF4444" },
    { value: "Pending", label: "Pending", color: "#F59E0B" },
    { value: "Needs Revision", label: "Needs Revision", color: "#F97316" }
  ];
  
  const handleVerify = async () => {
    if (!documentData?.id) {
      toast.error("Missing document ID");
      return;
    }
    
    try {
      setError(null);
      
      // Prepare the verify data following the API structure
      const verifyData = {
        status: status,
        verify_comment: verifyComment.trim()
      };
      
      // Call the mutation with document ID and verification data
      const response = await verifyDocument({
        documentId: documentData.id,
        verifyData: verifyData
      }).unwrap();
      
      if (response && response.status) {
        toast.success(`Document ${status.toLowerCase()} successfully`);
        
        // Call the parent callback to update the UI
        onVerifyDocument(documentData.id, status, verifyComment);
        
        // Close the dialog
        handleClose();
      } else {
        toast.error(response?.message || "Verification failed");
        setError(response?.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage = error.data?.message || "Failed to verify document. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '8px' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#29346B', 
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6">
          Verify Document: {documentData?.document_name}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="verification-status-label">Verification Status</InputLabel>
            <Select
              labelId="verification-status-label"
              value={status}
              label="Verification Status"
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
              renderValue={(selected) => {
                const selectedOption = statusOptions.find(option => option.value === selected);
                return (
                  <Chip 
                    label={selectedOption.label}
                    sx={{ 
                      bgcolor: `${selectedOption.color}20`,
                      color: selectedOption.color,
                      fontWeight: 'medium'
                    }}
                  />
                );
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: `${option.color}10`,
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: `${option.color}20`,
                    }
                  }}
                >
                  <Chip 
                    label={option.label} 
                    size="small"
                    sx={{ 
                      bgcolor: `${option.color}20`,
                      color: option.color,
                      fontWeight: 'medium'
                    }} 
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#555' }}>
            Verification Comments
          </Typography>
          <TextareaAutosize
            minRows={5}
            placeholder="Enter verification comments here..."
            className="w-full p-2 border border-gray-300 rounded"
            value={verifyComment}
            onChange={(e) => setVerifyComment(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px',
              borderRadius: '4px',
              borderColor: '#ccc',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
            disabled={isLoading}
          />
          
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
            Please provide your verification decision and any comments on the document.
            {status === "Rejected" || status === "Needs Revision" ? (
              <span className="text-red-500 ml-1">
                * Comments are required when rejecting or requesting revisions.
              </span>
            ) : null}
          </Typography>
        </Box>
        
        {documentData && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '4px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#555' }}>
              Document Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <div>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Category
                </Typography>
                <Typography variant="body2">
                  {documentData.category || 'N/A'}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Current Status
                </Typography>
                <Typography variant="body2">
                  {documentData.status || 'Pending'}
                </Typography>
              </div>
              {documentData.remarks && (
                <div style={{ gridColumn: '1 / span 2' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Remarks
                  </Typography>
                  <Typography variant="body2">
                    {documentData.remarks}
                  </Typography>
                </div>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: "#29346B",
            '&:hover': {
              bgcolor: 'rgba(41, 52, 107, 0.04)'
            }
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleVerify}
          variant="contained"
          disabled={isLoading || (
            (status === "Rejected" || status === "Needs Revision") && 
            verifyComment.trim().length === 0
          )}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{ 
            bgcolor: "#29346B", 
            color: "white", 
            "&:hover": { bgcolor: "#1e2756" } 
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Verification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyDocumentDialog;