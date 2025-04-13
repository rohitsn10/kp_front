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

export default function ClosureReportForm({ open, setOpen }) {
  const [closure, setClosure] = useState({
    report_of_closure: "",
    site_incharge: { name: "", signature: null, date: "" },
  });

  const validateForm = () => {
    // Closure validation
    if (!closure.report_of_closure.trim())
      return toast.error("Report of Closure is required!");
    if (!closure.site_incharge.name.trim())
      return toast.error("Site In-Charge Name is required!");
    if (!closure.site_incharge.signature)
      return toast.error("Site In-Charge Signature is required!");
    if (!closure.site_incharge.date.trim())
      return toast.error("Site In-Charge Date is required!");

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
      closure: closure,
    };

    console.log(formData);
    toast.success("Closure Report submitted successfully!");
    setOpen(false);
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
              value={closure.report_of_closure}
              sx={commonInputStyles}
              onChange={(e) =>
                setClosure({
                  ...closure,
                  report_of_closure: e.target.value,
                })
              }
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
              value={closure.site_incharge.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setClosure((prev) => ({
                  ...prev,
                  site_incharge: { ...prev.site_incharge, name: e.target.value },
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site In-Charge/Site Head - Signature<span className="text-red-600"> *</span>
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
                    handleSignatureUpload(setClosure, "site_incharge.signature", e)
                  }
                />
              </Button>
              {closure.site_incharge.signature && (
                <Avatar
                  src={closure.site_incharge.signature}
                  alt="Site In-Charge Signature"
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
              value={closure.site_incharge.date}
              sx={commonInputStyles}
              onChange={(e) =>
                setClosure((prev) => ({
                  ...prev,
                  site_incharge: { ...prev.site_incharge, date: e.target.value },
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