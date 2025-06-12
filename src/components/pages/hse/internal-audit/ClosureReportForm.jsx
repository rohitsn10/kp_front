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
import { useCreateClosureInternalAuditReportMutation } from "../../../../api/hse/internalAudit/internalAuditReportApi ";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function ClosureReportForm({ open, setOpen, auditId, onSuccess }) {
  const [closure, setClosure] = useState({
    report_closure: "",
    siteincharge_name: "",
    siteincharge_sign: null,
    siteincharge_date: "",
    signatureFileName: ""
  });

  // RTK mutation hook
  const [createClosureReport, { isLoading }] = useCreateClosureInternalAuditReportMutation();

  const validateForm = () => {
    if (!closure.report_closure.trim())
      return toast.error("Report of Closure is required!");
    if (!closure.siteincharge_name.trim())
      return toast.error("Site In-Charge Name is required!");
    if (!closure.siteincharge_sign)
      return toast.error("Site In-Charge Signature PDF is required!");
    if (!closure.siteincharge_date.trim())
      return toast.error("Site In-Charge Date is required!");

    return true;
  };

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      // Reset form
      setClosure({
        report_closure: "",
        siteincharge_name: "",
        siteincharge_sign: null,
        siteincharge_date: "",
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
        toast.error("Please upload a PDF file for site in-charge signature!");
        return;
      }
      
      // Check file size (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Site in-charge signature PDF must be less than 15MB!");
        return;
      }
      
      // Store the actual file for form submission
      setClosure(prev => ({
        ...prev,
        siteincharge_sign: file,
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
      formData.append('report_closure', closure.report_closure);
      formData.append('siteincharge_name', closure.siteincharge_name);
      formData.append('siteincharge_sign', closure.siteincharge_sign);
      formData.append('siteincharge_date', closure.siteincharge_date);

      // Call the mutation
      const response = await createClosureReport(formData).unwrap();
      
      if (response.status) {
        toast.success("Closure Report submitted successfully!");
        onSuccess(); // Trigger refetch of the audit list
        handleClose();
      } else {
        toast.error(response.message || "Failed to submit closure report");
      }
    } catch (error) {
      console.error("Error submitting closure report:", error);
      toast.error(error.data?.message || "An error occurred while submitting the closure report");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Report of Closure
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Closure Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Report closure by Site In-charge / Site Head & Remarks
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Report of Closure by Site In-Charge/Site Head & Remarks<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Report of Closure"
              value={closure.report_closure}
              sx={commonInputStyles}
              onChange={(e) =>
                setClosure({
                  ...closure,
                  report_closure: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site In-Charge/Site Head - Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={closure.siteincharge_name}
              sx={commonInputStyles}
              onChange={(e) =>
                setClosure(prev => ({
                  ...prev,
                  siteincharge_name: e.target.value
                }))
              }
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site In-Charge/Site Head - Signature PDF<span className="text-red-600"> *</span>
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
              {closure.siteincharge_sign && (
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
                    {closure.signatureFileName}
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
              value={closure.siteincharge_date}
              sx={commonInputStyles}
              onChange={(e) =>
                setClosure(prev => ({
                  ...prev,
                  siteincharge_date: e.target.value
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