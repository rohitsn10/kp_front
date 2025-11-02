import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Typography
} from "@mui/material";
import { toast } from "react-toastify";
import { useVerifyDocumentMutation } from '../../../../api/hoto/hotoApi';
import { useParams } from 'react-router-dom';


const VerifyDocumentDialog = ({ open, handleClose, documentData, onVerifyDocument }) => {
  const { projectId } = useParams();
  
  const [verifyComment, setVerifyComment] = useState("");
  const [status, setStatus] = useState("Verified");
  const [error, setError] = useState(null);
  
  const [verifyDocument, { isLoading }] = useVerifyDocumentMutation();
  
  useEffect(() => {
    if (documentData) {
      setStatus(documentData.status || "Verified");
      setVerifyComment(documentData.verify_comment || "");
    }
  }, [documentData]);
  
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);
  
  const statusOptions = [
    { value: "Verified", label: "Verified" },
    { value: "Rejected", label: "Rejected" },
    { value: "Pending", label: "Pending" }
  ];
  
  const handleVerify = async () => {
    if (!documentData?.id) {
      toast.error("Missing document ID");
      return;
    }
    
    if (!projectId) {
      toast.error("Missing project ID");
      return;
    }
    
    try {
      setError(null);
      
      const response = await verifyDocument({
        projectId: parseInt(projectId),
        documentId: documentData.id,
        status: status,
        verifyComment: verifyComment.trim()
      }).unwrap();
      
      if (response && response.status) {
        toast.success(response.message || "Document verified successfully");
        
        if (onVerifyDocument) {
          onVerifyDocument(response.data);
        }
        
        handleClose();
      } else {
        toast.error(response?.message || "Verification failed");
        setError(response?.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage = error.data?.message || error.message || "Failed to verify document";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Verify Document: {documentData?.document_name}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
          sx={{ mt: 2, mb: 2 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Verification Comments"
          placeholder="Enter your comments..."
          value={verifyComment}
          onChange={(e) => setVerifyComment(e.target.value)}
          disabled={isLoading}
          helperText={status === "Rejected" ? "Comments are required for rejection" : ""}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleVerify}
          variant="contained"
          disabled={
            isLoading || 
            (status === "Rejected" && verifyComment.trim().length === 0)
          }
        >
          {isLoading ? <CircularProgress size={20} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default VerifyDocumentDialog;
