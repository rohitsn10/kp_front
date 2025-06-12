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
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useCreateLotoRegisterMutation } from "../../../../api/hse/loto/lotoRegisterApi";
// import { useCreateLotoRegisterMutation } from "../api/lotoRegisterApi"; // Update this path to your actual API file path

// Add the file size constant
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

export default function CreateLotoRegister({ open, setOpen }) {
  const { locationId } = useParams();
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

  // Initialize the mutation hook
  const [createLotoRegister, { isLoading }] = useCreateLotoRegisterMutation();

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

  // Updated signature upload handler for PDF files
  const handleSignatureUpload = (setter, e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file only');
        // Clear the input
        e.target.value = '';
        return;
      }
      
      // Check file size (15MB limit)
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 15MB');
        // Clear the input
        e.target.value = '';
        return;
      }
      
      setter(file); // Store the actual file for FormData
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create FormData instance
    const formData = new FormData();
    
    // Add applied_info fields
    formData.append('site_name', site);
    formData.append('location', locationId);
    formData.append('applied_datetime', appliedDateTime);
    formData.append('applied_lock_tag_number', appliedLockTagNumber);
    formData.append('applied_permit_number', appliedPermitNumber);
    formData.append('applied_by_name', appliedByName);
    formData.append('applied_by_signature', appliedBySignature);
    formData.append('applied_approved_by_name', appliedApprovedByName);
    formData.append('applied_approved_by_signature', appliedApprovedBySignature);
    
    // Add location field for the main model
    formData.append('location', locationId);
    
    try {
      // Call the mutation with the FormData
      const response = await createLotoRegister(formData).unwrap();
      
      if (response.status) {
        toast.success("Lockout/Tagout form submitted successfully!");
        resetForm();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.data?.message || "An error occurred while submitting the form");
    }
  };
  
  const resetForm = () => {
    setSite("");
    setAppliedDateTime("");
    setAppliedLockTagNumber("");
    setAppliedPermitNumber("");
    setAppliedByName("");
    setAppliedBySignature(null);
    setAppliedApprovedByName("");
    setAppliedApprovedBySignature(null);
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

          {/* Applied By Signature PDF */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied By Signature PDF (Max 15MB)<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleSignatureUpload(setAppliedBySignature, e)}
                />
              </Button>
              {appliedBySignature && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" display="block">
                    File: {appliedBySignature.name}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Size: {(appliedBySignature.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
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

          {/* Applied Approved By Signature PDF */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Applied Approved By Signature PDF (Max 15MB)<span className="text-red-600"> *</span>
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
                  onChange={(e) =>
                    handleSignatureUpload(setAppliedApprovedBySignature, e)
                  }
                />
              </Button>
              {appliedApprovedBySignature && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" display="block">
                    File: {appliedApprovedBySignature.name}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Size: {(appliedApprovedBySignature.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
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
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}