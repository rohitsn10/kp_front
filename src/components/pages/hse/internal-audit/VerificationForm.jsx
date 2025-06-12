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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function VerificationForm({ open, setOpen, auditId, onSuccess }) {
  const [verification, setVerification] = useState({
    verification_auditor_name: "",
    verification_auditor_sign: null,
    verification_auditor_date: "",
    signatureFileName: ""
  });

  // RTK mutation hook
  const [createVerificationReport, { isLoading }] = useCreateVerificationInternalAuditReportMutation();

  const validateForm = () => {
    if (!verification.verification_auditor_name.trim())
      return toast.error("Auditor Name is required!");
    if (!verification.verification_auditor_sign)
      return toast.error("Auditor Signature PDF is required!");
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
        verification_auditor_date: "",
        signatureFileName: ""
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
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file for auditor signature!");
        return;
      }
      
      // Check file size (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Auditor signature PDF must be less than 15MB!");
        return;
      }
      
      // Store the actual file for form submission
      setVerification(prev => ({
        ...prev,
        verification_auditor_sign: file,
        signatureFileName: file.name
      }));
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
              Auditor Signature PDF<span className="text-red-600"> *</span>
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
                Upload Signature PDF
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleSignatureUpload}
                />
              </Button>
              {verification.verification_auditor_sign && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "8px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <PictureAsPdfIcon color="error" />
                  <Typography variant="body2">
                    {verification.signatureFileName}
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Upload signed PDF (Max: 15MB)
            </Typography>
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