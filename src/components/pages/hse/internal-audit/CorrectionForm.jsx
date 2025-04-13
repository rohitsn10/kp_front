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
} from "@mui/material";
import { toast } from "react-toastify";

export default function CorrectionForm({ open, setOpen }) {
  const [correction, setCorrection] = useState({
    corrective_preventive_action: "",
    root_cause: "",
    auditee: { name: "", signature: null, date: "" },
  });

  const validateForm = () => {
    // Correction validation
    if (!correction.root_cause.trim()) 
      return toast.error("Root Cause is required!");
    if (!correction.corrective_preventive_action.trim())
      return toast.error("Corrective/Preventive Action is required!");
    if (!correction.auditee.name.trim()) 
      return toast.error("Auditee Name is required!");
    if (!correction.auditee.signature)
      return toast.error("Auditee Signature is required!");
    if (!correction.auditee.date.trim()) 
      return toast.error("Auditee Date is required!");

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

  const handleSignatureUpload = (setter, field, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      correction: correction,
    };

    console.log(formData);
    toast.success("Correction information submitted successfully!");
    setOpen(false);
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
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Corrective Action for Actual Observation / Preventive Action for Potential Observation<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Corrective/Preventive Action"
              value={correction.corrective_preventive_action}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection({
                  ...correction,
                  corrective_preventive_action: e.target.value,
                })
              }
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
              value={correction.auditee.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection((prev) => ({
                  ...prev,
                  auditee: { ...prev.auditee, name: e.target.value },
                }))
              }
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
              >
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleSignatureUpload(setCorrection, "auditee.signature", e)}
                />
              </Button>
              {correction.auditee.signature && (
                <Avatar
                  src={correction.auditee.signature}
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
              value={correction.auditee.date}
              sx={commonInputStyles}
              onChange={(e) =>
                setCorrection((prev) => ({
                  ...prev,
                  auditee: { ...prev.auditee, date: e.target.value },
                }))
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
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
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}