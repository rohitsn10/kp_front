import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useApproverApprovePermitMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
// import { useApproverApprovePermitMutation } from "../path/to/permitToWorkApi"; // Update this path

const ApprovePermitModal = ({ open, onClose, permitId }) => {
  const [approverName, setApproverName] = useState("");
  const [approverStatus, setApproverStatus] = useState("");
  const [approverSignature, setApproverSignature] = useState(null);
  const [fileLabel, setFileLabel] = useState("No file chosen");
  
  // Use the RTK Query mutation hook
  const [approverApprovePermit, { isLoading, isSuccess, isError, error }] = 
    useApproverApprovePermitMutation();

  // File handling
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setApproverSignature(e.target.files[0]);
      setFileLabel(e.target.files[0].name);
    }
  };

  // Reset form on close
  const handleClose = () => {
    setApproverName("");
    setApproverStatus("");
    setApproverSignature(null);
    setFileLabel("No file chosen");
    onClose();
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate form
    if (!approverName || !approverStatus || !approverSignature) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append("approver_name", approverName);
      formData.append("approver_status", approverStatus === "approve" ? "approved" : "rejected");
      formData.append("approver_sign", approverSignature);
      // Adding default current time values since they are required by the backend
    //   const now = new Date().toISOString();
    //   formData.append("start_time", now);
    //   formData.append("end_time", now);
      
      // Call the mutation with permitId and formData
      await approverApprovePermit({ permitId, formData }).unwrap();
      
      // If successful, close the modal
      if (!isError) {
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to approve permit:", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: "bold", color: "#29346B" }}>
          Approve Permit
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Permit ID: {permitId}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {isSuccess && (
            <Alert severity="success">Permit approved successfully!</Alert>
          )}
          
          {isError && (
            <Alert severity="error">
              {error?.data?.message || "An error occurred while approving the permit"}
            </Alert>
          )}
          
          <TextField
            label="Approver Name"
            fullWidth
            required
            value={approverName}
            onChange={(e) => setApproverName(e.target.value)}
            variant="outlined"
            disabled={isLoading}
          />
          
          <FormControl fullWidth required>
            <InputLabel id="approver-status-label">Approver Status</InputLabel>
            <Select
              labelId="approver-status-label"
              value={approverStatus}
              label="Approver Status"
              onChange={(e) => setApproverStatus(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="approve">Approve</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
            </Select>
          </FormControl>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Approver Signature (File Upload)*
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

export default ApprovePermitModal;