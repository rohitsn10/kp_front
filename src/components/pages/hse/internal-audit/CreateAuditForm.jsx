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
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useCreateInternalAuditReportMutation } from "../../../../api/hse/internalAudit/internalAuditReportApi ";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function CreateAuditForm({ open, setOpen, onSuccess }) {
  const { locationId } = useParams();
  const [site_name, setSiteName] = useState("");
  const [date, setDate] = useState("");
  const [observer_details, setObserverDetails] = useState("");
  const [observer_name, setObserverName] = useState("");
  const [observer_sign, setObserverSign] = useState(null);
  const [observer_sign_name, setObserverSignName] = useState("");
  const [auditee_name, setAuditeeName] = useState("");
  const [auditee_sign, setAuditeeSign] = useState(null);
  const [auditee_sign_name, setAuditeeSignName] = useState("");
  const [agreed_completion_date, setAgreedCompletionDate] = useState("");
  
  // Using the RTK Query mutation hook
  const [createInternalAuditReport, { isLoading }] = useCreateInternalAuditReportMutation();

  const validateForm = () => {
    if (!site_name.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!observer_details.trim()) return toast.error("Observations are required!");
    if (!observer_name.trim()) return toast.error("Auditor/Observer Name is required!");
    if (!observer_sign) return toast.error("Auditor/Observer Signature PDF is required!");
    if (!auditee_name.trim()) return toast.error("Auditee Name is required!");
    if (!auditee_sign) return toast.error("Auditee Signature PDF is required!");
    if (!agreed_completion_date.trim()) return toast.error("Agreed Completion Date is required!");

    return true;
  };

  const handleClose = () => setOpen(false);

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

  const handleObserverSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file for observer signature!");
        return;
      }
      
      // Check file size (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Observer signature PDF must be less than 15MB!");
        return;
      }
      
      setObserverSign(file);
      setObserverSignName(file.name);
    }
  };

  const handleAuditeeSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file for auditee signature!");
        return;
      }
      
      // Check file size (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Auditee signature PDF must be less than 15MB!");
        return;
      }
      
      setAuditeeSign(file);
      setAuditeeSignName(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('site_name', site_name);
    formData.append('location', locationId);
    formData.append('date', date);
    formData.append('observer_details', observer_details);
    formData.append('observer_name', observer_name);
    formData.append('observer_sign', observer_sign);
    formData.append('auditee_name', auditee_name);
    formData.append('auditee_sign', auditee_sign);
    formData.append('agreed_completion_date', agreed_completion_date);

    try {
      const response = await createInternalAuditReport(formData).unwrap();
      if (response.status) {
        toast.success(response.message || "Internal audit report created successfully!");
        if (onSuccess) onSuccess();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to create internal audit report");
      }
    } catch (error) {
      console.error("Error creating internal audit report:", error);
      toast.error(error.data?.message || "An error occurred while submitting the form");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Non-Conformance Report
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Site and Date */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site"
              value={site_name}
              sx={commonInputStyles}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={date}
              sx={commonInputStyles}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>

          {/* Observations Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Observations
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Observation Details<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter detailed observations"
              value={observer_details}
              sx={commonInputStyles}
              onChange={(e) => setObserverDetails(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditor/Observer Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={observer_name}
              sx={commonInputStyles}
              onChange={(e) => setObserverName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditor/Observer Signature PDF<span className="text-red-600"> *</span>
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
              >
                Upload Signature PDF
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleObserverSignatureUpload}
                />
              </Button>
              {observer_sign && (
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
                    {observer_sign_name}
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
              Auditee Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={auditee_name}
              sx={commonInputStyles}
              onChange={(e) => setAuditeeName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditee Signature PDF<span className="text-red-600"> *</span>
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
              >
                Upload Signature PDF
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleAuditeeSignatureUpload}
                />
              </Button>
              {auditee_sign && (
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
                  <Typography sx={{maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} variant="body2">
                    {auditee_sign_name}
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Upload signed PDF (Max: 15MB)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Agreed Completion Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={agreed_completion_date}
              sx={commonInputStyles}
              onChange={(e) => setAgreedCompletionDate(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={isLoading}
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
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}