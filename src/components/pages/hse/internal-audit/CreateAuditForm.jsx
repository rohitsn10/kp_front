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

export default function CreateAuditForm({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [observations, setObservations] = useState({
    observation_details: "",
    auditor_observer: { name: "", signature: null },
    auditee: { name: "", signature: null },
    agreed_completion_date: "",
  });

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");

    // Observations
    if (!observations.observation_details.trim())
      return toast.error("Observations are required!");
    if (!observations.auditor_observer.name.trim())
      return toast.error("Auditor/Observer Name is required!");
    if (!observations.auditor_observer.signature)
      return toast.error("Auditor/Observer Signature is required!");
    if (!observations.auditee.name.trim()) return toast.error("Auditee Name is required!");
    if (!observations.auditee.signature) return toast.error("Auditee Signature is required!");
    if (!observations.agreed_completion_date.trim())
      return toast.error("Agreed Completion Date is required!");

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
      site: site,
      date: date,
      observations: observations,
    };

    console.log(formData);
    toast.success("Basic Audit Information submitted successfully!");
    setOpen(false);
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
              value={site}
              sx={commonInputStyles}
              onChange={(e) => setSite(e.target.value)}
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
              value={observations.observation_details}
              sx={commonInputStyles}
              onChange={(e) =>
                setObservations((prev) => ({
                  ...prev,
                  observation_details: e.target.value,
                }))
              }
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
              value={observations.auditor_observer.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setObservations((prev) => ({
                  ...prev,
                  auditor_observer: { ...prev.auditor_observer, name: e.target.value },
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditor/Observer Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) =>
                    handleSignatureUpload(setObservations, "auditor_observer.signature", e)
                  }
                />
              </Button>
              {observations.auditor_observer.signature && (
                <Avatar
                  src={observations.auditor_observer.signature}
                  alt="Auditor Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auditee Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={observations.auditee.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setObservations((prev) => ({
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
                  onChange={(e) => handleSignatureUpload(setObservations, "auditee.signature", e)}
                />
              </Button>
              {observations.auditee.signature && (
                <Avatar
                  src={observations.auditee.signature}
                  alt="Auditee Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Agreed Completion Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={observations.agreed_completion_date}
              sx={commonInputStyles}
              onChange={(e) =>
                setObservations((prev) => ({
                  ...prev,
                  agreed_completion_date: e.target.value,
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