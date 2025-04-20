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
  CircularProgress,
} from "@mui/material";
import { useClosureOfPermitMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
// import { useClosureOfPermitMutation } from "../../../api/hse/permitTowork/permitToworkApi";

const ClosurePermitModal = ({ open, onClose, permitId }) => {
  const [closureRemarks, setClosureRemarks] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [closureSignature, setClosureSignature] = useState(null);
  const [closureTime, setClosureTime] = useState("");
  const [fileLabel, setFileLabel] = useState("No file chosen");
  
  // Use the closure hook from the API
  const [closureOfPermit, { isLoading }] = useClosureOfPermitMutation();

  // File handling
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setClosureSignature(e.target.files[0]);
      setFileLabel(e.target.files[0].name);
    }
  };

  // Reset form on close
  const handleClose = () => {
    setClosureRemarks("");
    setInspectorName("");
    setClosureSignature(null);
    setClosureTime("");
    setFileLabel("No file chosen");
    onClose();
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate form
    if (!inspectorName || !closureSignature || !closureRemarks || !closureTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("closure_remarks", closureRemarks);
      formData.append("inspector_name", inspectorName);
      formData.append("closure_sign", closureSignature);
      formData.append("closure_time", closureTime);
      
      // Call the API using the mutation hook
      await closureOfPermit({ permitId, formData }).unwrap();
      
      // If successful, close the modal and potentially show success message
      handleClose();
      // You might want to show a success notification here
    } catch (error) {
      // Handle error
      console.error("Error closing permit:", error);
      alert("Error closing permit. Please try again.");
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
            onChange={(e) => setInspectorName(e.target.value)}
            variant="outlined"
            placeholder="Enter the name of inspector closing this permit"
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
          />
          
          <TextField
            label="Time of Closure"
            type="time"
            fullWidth
            required
            value={closureTime}
            onChange={(e) => setClosureTime(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Closure Signature (File Upload)*
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