import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  CircularProgress,
  Alert,
  Typography,
  Box
} from "@mui/material";
import { toast } from "react-toastify";
import { useAddRemarksToDocumentMutation } from '../../../../api/hoto/hotoApi';

// Component for remarks dialog
const RemarksDialog = ({ open, handleClose, documentData, onSaveRemarks }) => {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);
  
  // Use the RTK Query mutation hook
  const [addRemarksToDocument, { isLoading }] = useAddRemarksToDocumentMutation();
  
  useEffect(() => {
    if (documentData) {
      setRemarks(documentData.remarks || "");
    }
  }, [documentData]);
  
  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);
  
  const handleSave = async () => {
    if (!documentData?.id) {
      toast.error("Missing document ID");
      return;
    }
    
    try {
      setError(null);
      
      // Prepare the request payload
      const remarksData = {
        remarks: remarks.trim()
      };
      
      // Call the mutation with the document ID and remarks data
      const response = await addRemarksToDocument({
        documentId: documentData.id,
        remarksData: remarksData
      }).unwrap();
      
      if (response && response.status) {
        toast.success("Remarks added successfully");
        
        // Call the parent callback to update the UI
        onSaveRemarks(documentData.id, remarks);
        
        // Close the dialog
        handleClose();
      } else {
        toast.error(response?.message || "Failed to add remarks");
        setError(response?.message || "Failed to add remarks");
      }
    } catch (error) {
      console.error("Error adding remarks:", error);
      const errorMessage = error.data?.message || "Failed to add remarks. Please try again.";
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
          Add Remarks for {documentData?.document_name}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#555' }}>
            Remarks
          </Typography>
          <TextareaAutosize
            minRows={6}
            placeholder="Enter your remarks here..."
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
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
            Add any comments, feedback, or instructions regarding this document.
          </Typography>
        </Box>
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
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{ 
            bgcolor: "#29346B", 
            color: "white", 
            "&:hover": { bgcolor: "#1e2756" } 
          }}
        >
          {isLoading ? 'Saving...' : 'Save Remarks'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemarksDialog;