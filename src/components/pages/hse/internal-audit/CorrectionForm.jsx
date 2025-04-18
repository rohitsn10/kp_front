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
import { useCreateCorrectionInternalAuditReportMutation } from "../../../../api/hse/internalAudit/internalAuditReportApi ";
// import { useCreateCorrectionInternalAuditReportMutation } from "../../../api/hse/internalAudit/internalAuditReportApi"; // Adjust import path as needed

export default function CorrectionForm({ open, setOpen, auditId, onSuccess }) {
  const [correction, setCorrection] = useState({
    root_cause: "",
    corrective_action: "",
    correction_auditee_name: "",
    correction_auditee_sign: null,
    correction_auditee_date: ""
  });

  // RTK mutation hook
  const [createCorrectionReport, { isLoading }] = useCreateCorrectionInternalAuditReportMutation();

  const validateForm = () => {
    if (!correction.root_cause.trim()) 
      return toast.error("Root Cause is required!");
    if (!correction.corrective_action.trim())
      return toast.error("Corrective/Preventive Action is required!");
    if (!correction.correction_auditee_name.trim()) 
      return toast.error("Auditee Name is required!");
    if (!correction.correction_auditee_sign)
      return toast.error("Auditee Signature is required!");
    if (!correction.correction_auditee_date.trim()) 
      return toast.error("Auditee Date is required!");

    return true;
  };

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      // Reset form
      setCorrection({
        root_cause: "",
        corrective_action: "",
        correction_auditee_name: "",
        correction_auditee_sign: null,
        correction_auditee_date: ""
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
      setCorrection(prev => ({
        ...prev,
        correction_auditee_sign: file
      }));

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setCorrection(prev => ({
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
      formData.append('root_cause', correction.root_cause);
      formData.append('corrective_action', correction.corrective_action);
      formData.append('correction_auditee_name', correction.correction_auditee_name);
      formData.append('correction_auditee_sign', correction.correction_auditee_sign);
      formData.append('correction_auditee_date', correction.correction_auditee_date);

      // Call the mutation
      const response = await createCorrectionReport(formData).unwrap();
      
      if (response.status) {
        toast.success("Correction information submitted successfully!");
        onSuccess(); // Trigger refetch of the audit list
        handleClose();
      } else {
        toast.error(response.message || "Failed to submit correction information");
      }
    } catch (error) {
      console.error("Error submitting correction:", error);
      toast.error(error.data?.message || "An error occurred while submitting the correction");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Correction Information
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Correction Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Correction Details
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Root Cause<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Root Cause"
              value={correction.root_cause}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection({ ...correction, root_cause: e.target.value })
              }
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Corrective Action for Actual Observation / Preventive Action for Potential Observation
              <span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Corrective/Preventive Action"
              value={correction.corrective_action}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection({
                  ...correction,
                  corrective_action: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditee Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={correction.correction_auditee_name}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection(prev => ({
                  ...prev,
                  correction_auditee_name: e.target.value
                }))
              }
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditee Signature<span className="text-red-600"> *</span>
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
              {correction.signaturePreview && (
                <Avatar
                  src={correction.signaturePreview}
                  alt="Auditee Signature"
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
              value={correction.correction_auditee_date}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection(prev => ({
                  ...prev,
                  correction_auditee_date: e.target.value
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