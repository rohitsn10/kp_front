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
  CircularProgress,
} from "@mui/material";
import { useClosureOfPermitMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
import { AuthContext } from "../../../../context/AuthContext"; // Update path as needed
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";

const ClosurePermitModal = ({ open, onClose, permitId }) => {
  const { user } = useContext(AuthContext);
  const [closureRemarks, setClosureRemarks] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [closureSignature, setClosureSignature] = useState(null);
  const [closureTime, setClosureTime] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState(0);
  
  // Use the closure hook from the API
  const [closureOfPermit, { isLoading }] = useClosureOfPermitMutation();

  // Auto-populate inspector name when modal opens or user context changes
  useEffect(() => {
    if (user?.name && open) {
      setInspectorName(user.name);
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
      setClosureSignature(file);
      setPdfFileName(file.name);
      setPdfFileSize(file.size);
      toast.success(`PDF uploaded successfully! Size: ${formatFileSize(file.size)}`);
    }
  };

  // Remove uploaded PDF
  const handleRemovePdf = () => {
    setClosureSignature(null);
    setPdfFileName("");
    setPdfFileSize(0);
  };

  // Reset form on close
  const handleClose = () => {
    setClosureRemarks("");
    setInspectorName(user?.name || ""); // Reset to user's name instead of empty
    setClosureSignature(null);
    setClosureTime("");
    setPdfFileName("");
    setPdfFileSize(0);
    onClose();
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate form
    if (!inspectorName || !closureSignature || !closureRemarks || !closureTime) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("closure_remarks", closureRemarks);
      formData.append("inspector_name", inspectorName);
      formData.append("closure_sign", closureSignature); // Keeping the same API field name
      formData.append("closure_time", closureTime);
      
      // Call the API using the mutation hook
      await closureOfPermit({ permitId, formData }).unwrap();
      
      // If successful, close the modal and show success message
      toast.success("Permit closed successfully!");
      handleClose();
    } catch (error) {
      // Handle error
      console.error("Error closing permit:", error);
      toast.error("Error closing permit. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: "bold", color: "#29346B" }}>
          Closure of PTW
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Permit ID: {permitId}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Inspector Name"
            fullWidth
            required
            value={inspectorName}
            variant="outlined"
            disabled={true}
            placeholder={user?.name || "Enter inspector name"}
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
          
          <TextField
            label="Closure Remarks"
            fullWidth
            required
            value={closureRemarks}
            onChange={(e) => setClosureRemarks(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            disabled={isLoading}
          />
          
          <TextField
            label="Time of Closure"
            type="time"
            fullWidth
            required
            value={closureTime}
            onChange={(e) => setClosureTime(e.target.value)}
            variant="outlined"
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
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
          {isLoading ? (
            <>
              <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
              Submitting...
            </>
          ) : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClosurePermitModal;