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

export default function VerificationForm({ open, setOpen }) {
  const [verification, setVerification] = useState({
    auditor: { name: "", signature: null, date: "" },
  });

  const validateForm = () => {
    // Verification validation
    if (!verification.auditor.name.trim())
      return toast.error("Auditor Name is required!");
    if (!verification.auditor.signature)
      return toast.error("Auditor Signature is required!");
    if (!verification.auditor.date.trim())
      return toast.error("Auditor Date is required!");

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
      verification: verification,
    };

    console.log(formData);
    toast.success("Verification information submitted successfully!");
    setOpen(false);
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
              value={verification.auditor.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setVerification((prev) => ({
                  ...prev,
                  auditor: { ...prev.auditor, name: e.target.value },
                }))
              }
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
              >
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleSignatureUpload(setVerification, "auditor.signature", e)
                  }
                />
              </Button>
              {verification.auditor.signature && (
                <Avatar
                  src={verification.auditor.signature}
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
              value={verification.auditor.date}
              sx={commonInputStyles}
              onChange={(e) =>
                setVerification((prev) => ({
                  ...prev,
                  auditor: { ...prev.auditor, date: e.target.value },
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