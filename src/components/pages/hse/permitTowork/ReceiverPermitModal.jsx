import React, { useState } from "react";
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
// import { useReceiverApprovePermitMutation } from "../path/to/permitToWorkApi"; // Update this path

const ReceiverPermitModal = ({ open, onClose, permitId }) => {
  const [receiverName, setReceiverName] = useState("");
  const [receiverSignature, setReceiverSignature] = useState(null);
  const [fileLabel, setFileLabel] = useState("No file chosen");
  
  // Use the RTK Query mutation hook
  const [receiverApprovePermit, { isLoading, isSuccess, isError, error }] = 
    useReceiverApprovePermitMutation();

  // File handling
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setReceiverSignature(e.target.files[0]);
      setFileLabel(e.target.files[0].name);
    }
  };

  // Reset form on close
  const handleClose = () => {
    setReceiverName("");
    setReceiverSignature(null);
    setFileLabel("No file chosen");
    onClose();
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate form
    if (!receiverName || !receiverSignature) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append("receiver_name", receiverName);
      formData.append("receiver_sign", receiverSignature);
      
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
            onChange={(e) => setReceiverName(e.target.value)}
            variant="outlined"
            disabled={isLoading}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Receiver Signature (File Upload)*
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                component="label"
                style={{
                  backgroundColor: "#FF8C00",
                  color: "white",
                  textTransform: "none",
                }}
                disabled={isLoading}
              >
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                  required
                />
              </Button>
              <Typography variant="body2">{fileLabel}</Typography>
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