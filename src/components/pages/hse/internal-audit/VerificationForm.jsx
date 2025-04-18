import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  Divider,
  Box,
  Avatar,
  CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateVerificationInternalAuditReportMutation } from "../../../../api/hse/internalAudit/internalAuditReportApi ";
// import { useCreateVerificationInternalAuditReportMutation } from "../../../api/hse/internalAudit/internalAuditReportApi"; // Adjust import path as needed

export default function VerificationForm({ open, setOpen, auditId, onSuccess }) {
  const [verification, setVerification] = useState({
    verification_auditor_name: "",
    verification_auditor_sign: null,
    verification_auditor_date: ""
  });

  // RTK mutation hook
  const [createVerificationReport, { isLoading }] = useCreateVerificationInternalAuditReportMutation();

  const validateForm = () => {
    if (!verification.verification_auditor_name.trim())
      return toast.error("Auditor Name is required!");
    if (!verification.verification_auditor_sign)
      return toast.error("Auditor Signature is required!");
    if (!verification.verification_auditor_date.trim())
      return toast.error("Auditor Date is required!");

    return true;
  };

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      // Reset form
      setVerification({
        verification_auditor_name: "",
        verification_auditor_sign: null,
        verification_auditor_date: ""
      });
    }
  };

  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      border: "none",
      borderRadius: "4px",
    },
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file for form submission
      setVerification(prev => ({
        ...prev,
        verification_auditor_sign: file
      }));

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setVerification(prev => ({
          ...prev,
          signaturePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('audit_report', auditId);
      formData.append('verification_auditor_name', verification.verification_auditor_name);
      formData.append('verification_auditor_sign', verification.verification_auditor_sign);
      formData.append('verification_auditor_date', verification.verification_auditor_date);

      // Call the mutation
      const response = await createVerificationReport(formData).unwrap();
      
      if (response.status) {
        toast.success("Verification information submitted successfully!");
        onSuccess(); // Trigger refetch of the audit list
        handleClose();
      } else {
        toast.error(response.message || "Failed to submit verification information");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error(error.data?.message || "An error occurred while submitting the verification");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Verification of Root Cause & Corrective Action
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Verification Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Verification of root cause & corrective action / preventive action taken
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditor Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={verification.verification_auditor_name}
              sx={commonInputStyles}
              onChange={(e) =>
                setVerification((prev) => ({
                  ...prev,
                  verification_auditor_name: e.target.value,
                }))
              }
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditor Signature<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                component="label"
                color="primary"
                sx={{ height: "56px" }}
                disabled={isLoading}
              >
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleSignatureUpload}
                />
              </Button>
              {verification.signaturePreview && (
                <Avatar
                  src={verification.signaturePreview}
                  alt="Auditor Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={verification.verification_auditor_date}
              sx={commonInputStyles}
              onChange={(e) =>
                setVerification((prev) => ({
                  ...prev,
                  verification_auditor_date: e.target.value,
                }))
              }
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="secondary" 
          variant="outlined"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{
            backgroundColor: "#f6812d",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "6px 36px",
            width: "200px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#E66A1F",
            },
          }}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}