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

export default function CreateLotoRegister({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [appliedDateTime, setAppliedDateTime] = useState("");
  const [appliedLockTagNumber, setAppliedLockTagNumber] = useState("");
  const [appliedPermitNumber, setAppliedPermitNumber] = useState("");
  const [appliedByName, setAppliedByName] = useState("");
  const [appliedBySignature, setAppliedBySignature] = useState(null);
  const [appliedApprovedByName, setAppliedApprovedByName] = useState("");
  const [appliedApprovedBySignature, setAppliedApprovedBySignature] = useState(
    null
  );

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!appliedDateTime.trim()) return toast.error("Applied Date/Time is required!");
    if (!appliedLockTagNumber.trim())
      return toast.error("Applied Lock/Tag Number is required!");
    if (!appliedPermitNumber.trim())
      return toast.error("Applied Permit Number is required!");
    if (!appliedByName.trim()) return toast.error("Applied By Name is required!");
    if (!appliedBySignature) return toast.error("Applied By Signature is required!");
    if (!appliedApprovedByName.trim())
      return toast.error("Applied Approved By Name is required!");
    if (!appliedApprovedBySignature)
      return toast.error("Applied Approved By Signature is required!");

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

  const handleSignatureUpload = (setter, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      Site: site,
      "applied-date-time": appliedDateTime,
      "applied-lock-tag-number": appliedLockTagNumber,
      "applied-permit-number": appliedPermitNumber,
      "applied-by-name": appliedByName,
      "applied-by-signature": appliedBySignature,
      "applied-approvedBy-name": appliedApprovedByName,
      "applied-approvedBy-signature": appliedApprovedBySignature,
    };

    console.log(formData);
    toast.success("Lockout/Tagout form submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Lockout/Tagout Application
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Site */}
          <Grid item xs={12}>
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

          {/* Applied Date/Time */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied Date/Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="datetime-local"
              value={appliedDateTime}
              sx={commonInputStyles}
              onChange={(e) => setAppliedDateTime(e.target.value)}
            />
          </Grid>

          {/* Applied Lock/Tag Number */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied Lock/Tag Number<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Lock/Tag Number"
              value={appliedLockTagNumber}
              sx={commonInputStyles}
              onChange={(e) => setAppliedLockTagNumber(e.target.value)}
            />
          </Grid>

          {/* Applied Permit Number */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied Permit Number<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Permit Number"
              value={appliedPermitNumber}
              sx={commonInputStyles}
              onChange={(e) => setAppliedPermitNumber(e.target.value)}
            />
          </Grid>

          {/* Applied By Name */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied By Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={appliedByName}
              sx={commonInputStyles}
              onChange={(e) => setAppliedByName(e.target.value)}
            />
          </Grid>

          {/* Applied By Signature */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied By Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleSignatureUpload(setAppliedBySignature, e)}
                />
              </Button>
              {appliedBySignature && (
                <Avatar
                  src={appliedBySignature}
                  alt="Applied By Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Applied Approved By Name */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied Approved By Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={appliedApprovedByName}
              sx={commonInputStyles}
              onChange={(e) => setAppliedApprovedByName(e.target.value)}
            />
          </Grid>

          {/* Applied Approved By Signature */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied Approved By Signature<span className="text-red-600"> *</span>
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
                    handleSignatureUpload(setAppliedApprovedBySignature, e)
                  }
                />
              </Button>
              {appliedApprovedBySignature && (
                <Avatar
                  src={appliedApprovedBySignature}
                  alt="Approved By Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
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