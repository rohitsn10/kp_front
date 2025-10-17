import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useApproveLandBankByProjectHodMutation } from "../../../api/users/landbankApi";

function HodApprovalModal({ open, setOpen, selectedLand, onSuccess }) {
  const [approvalStatus, setApprovalStatus] = useState("");
  const [error, setError] = useState("");
  
  const [approveLandBankByProjectHod, { isLoading }] = 
    useApproveLandBankByProjectHodMutation();

  const handleClose = () => {
    setOpen(false);
    setApprovalStatus("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!approvalStatus) {
      setError("Please select Approve or Reject");
      return;
    }

    try {
      const result = await approveLandBankByProjectHod({
        land_bank_id: selectedLand?.id,
        is_land_bank_approved_by_project_hod: approvalStatus,
      }).unwrap();

      if (result.status) {
        alert(result.message);
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || "Failed to process approval");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err?.data?.message || "An error occurred while processing approval");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle 
        style={{ 
          backgroundColor: "#29346B", 
          color: "white",
          fontSize: "1.25rem",
          fontWeight: "600"
        }}
      >
        HOD Approval - {selectedLand?.land_name}
      </DialogTitle>

      <DialogContent style={{ marginTop: "20px" }}>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}

        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "16px", color: "#5C5E67", marginBottom: "12px" }}>
            Please select your decision:
          </p>
          
          <RadioGroup
            value={approvalStatus}
            onChange={(e) => {
              setApprovalStatus(e.target.value);
              setError("");
            }}
          >
            <FormControlLabel
              value="Approved"
              control={<Radio color="primary" />}
              label={
                <span style={{ fontSize: "16px", color: "#4CAF50", fontWeight: "500" }}>
                  Approve
                </span>
              }
            />
            <FormControlLabel
              value="Rejected"
              control={<Radio color="error" />}
              label={
                <span style={{ fontSize: "16px", color: "#f44336", fontWeight: "500" }}>
                  Reject
                </span>
              }
            />
          </RadioGroup>
        </div>

        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "12px", 
          borderRadius: "8px",
          marginTop: "16px"
        }}>
          <p style={{ fontSize: "14px", color: "#5C5E67", margin: 0 }}>
            <strong>Land Name:</strong> {selectedLand?.land_name}
          </p>
          <p style={{ fontSize: "14px", color: "#5C5E67", margin: "8px 0 0 0" }}>
            <strong>Category:</strong> {selectedLand?.land_category_name}
          </p>
          <p style={{ fontSize: "14px", color: "#5C5E67", margin: "8px 0 0 0" }}>
            <strong>Current Status:</strong> {selectedLand?.land_bank_status}
          </p>
        </div>
      </DialogContent>

      <DialogActions style={{ padding: "16px 24px" }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          style={{
            color: "#5C5E67",
            textTransform: "none",
            fontSize: "16px"
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          variant="contained"
          style={{
            backgroundColor: approvalStatus === "Approved" ? "#4CAF50" : "#f44336",
            color: "white",
            textTransform: "none",
            fontSize: "16px",
            minWidth: "100px"
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} style={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default HodApprovalModal;
