import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useReceiverApprovePermitMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
import { AuthContext } from "../../../../context/AuthContext"; // Update path as needed
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";

const ReceiverPermitModal = ({ open, onClose, permitId }) => {
  const { user } = useContext(AuthContext);
  const [receiverName, setReceiverName] = useState("");
  const [receiverSignature, setReceiverSignature] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState(0);
  
  // Use the RTK Query mutation hook
  const [receiverApprovePermit, { isLoading, isSuccess, isError, error }] = 
    useReceiverApprovePermitMutation();

  // Auto-populate receiver name when modal opens or user context changes
  useEffect(() => {
    if (user?.name && open) {
      setReceiverName(user.name);
    }
  }, [user, open]);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle PDF upload with size validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's a PDF file
      if (file.type !== 'application/pdf') {
        toast.error("Please upload only PDF files!");
        return;
      }
      
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        toast.error(`File size too large! Please upload a PDF smaller than 20MB. Current size: ${formatFileSize(file.size)}`);
        return;
      }
      
      // If validation passes, set the file
      setReceiverSignature(file);
      setPdfFileName(file.name);
      setPdfFileSize(file.size);
      toast.success(`PDF uploaded successfully! Size: ${formatFileSize(file.size)}`);
    }
  };

  // Remove uploaded PDF
  const handleRemovePdf = () => {
    setReceiverSignature(null);
    setPdfFileName("");
    setPdfFileSize(0);
  };

  // Reset form on close
  const handleClose = () => {
    setReceiverName(user?.name || ""); // Reset to user's name instead of empty
    setReceiverSignature(null);
    setPdfFileName("");
    setPdfFileSize(0);
    onClose();
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate form
    if (!receiverName || !receiverSignature) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append("receiver_name", receiverName);
      formData.append("receiver_sign", receiverSignature); // Keeping the same API field name
      
      // Adding default current time values since they are required by the backend
      const now = new Date().toISOString();
      formData.append("start_time", now);
      formData.append("end_time", now);
      
      // Call the mutation with permitId and formData
      await receiverApprovePermit({ permitId, formData }).unwrap();
      
      // If successful, close the modal
      if (!isError) {
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to add receiver:", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: "bold", color: "#29346B" }}>
          Add Receiver PTW
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Permit ID: {permitId}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {isSuccess && (
            <Alert severity="success">Receiver added successfully!</Alert>
          )}
          
          {isError && (
            <Alert severity="error">
              {error?.data?.message || "An error occurred while adding receiver"}
            </Alert>
          )}
          
          <TextField
            label="Receiver Name"
            fullWidth
            required
            value={receiverName}
            variant="outlined"
            disabled={true}
            placeholder={user?.name || "Enter receiver name"}
            helperText="This field is locked and auto-populated with your logged-in name"
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000', // Makes text black instead of gray
                opacity: 1,
              },
              '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)', // Normal border color
              },
              '& .MuiInputLabel-root.Mui-disabled': {
                color: 'rgba(0, 0, 0, 0.6)', // Normal label color
              }
            }}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Signed PDF Document*
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Upload a PDF document that contains digital signatures. Maximum file size: 20MB
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PictureAsPdfIcon />}
                style={{
                  backgroundColor: "#FF8C00",
                  color: "white",
                  textTransform: "none",
                  height: "48px",
                }}
                disabled={isLoading}
              >
                Upload Signed PDF
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={handleFileChange}
                  required
                />
              </Button>
              
              {/* Show uploaded PDF info */}
              {pdfFileName && (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  padding: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0"
                }}>
                  <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 32 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {pdfFileName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {formatFileSize(pdfFileSize)}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemovePdf}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </Box>
              )}
              
              {!pdfFileName && (
                <Typography variant="body2" color="text.secondary">
                  No PDF document uploaded
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose}
          disabled={isLoading}
          style={{ color: "#29346B" }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          variant="contained"
          style={{
            backgroundColor: "#FF8C00",
            color: "white",
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiverPermitModal;