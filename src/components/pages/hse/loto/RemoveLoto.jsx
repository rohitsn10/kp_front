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
import { useUpdateLotoRegisterMutation } from "../../../../api/hse/loto/lotoRegisterApi";
// import { useUpdateLotoRegisterMutation } from "../api/lotoRegisterApi"; // Update this path to your actual API file path

export default function RemoveLogoutForm({ open, setOpen, lotoId=1 }) {
  const [removedDateTime, setRemovedDateTime] = useState("");
  const [removedLockTagNumber, setRemovedLockTagNumber] = useState("");
  const [removedPermitNumber, setRemovedPermitNumber] = useState("");
  const [removedByName, setRemovedByName] = useState("");
  const [removedBySignature, setRemovedBySignature] = useState(null);
  const [removedSiteInChargeName, setRemovedSiteInChargeName] = useState("");
  const [removedApprovedBySiteInChargeSignature, setRemovedApprovedBySiteInChargeSignature] = useState(null);

  // Initialize the mutation hook
  const [updateLotoRegister, { isLoading }] = useUpdateLotoRegisterMutation();

  const validateForm = () => {
    if (!lotoId) return toast.error("No LOTO record selected!");
    if (!removedDateTime.trim()) return toast.error("Removed Date/Time is required!");
    if (!removedLockTagNumber.trim())
      return toast.error("Removed Lock/Tag Number is required!");
    if (!removedPermitNumber.trim())
      return toast.error("Removed Permit Number is required!");
    if (!removedByName.trim()) return toast.error("Removed By Name is required!");
    if (!removedBySignature) return toast.error("Removed By Signature is required!");
    if (!removedSiteInChargeName.trim())
      return toast.error("Removed Site In-Charge Name is required!");
    if (!removedApprovedBySiteInChargeSignature)
      return toast.error("Removed Approved By Site In-Charge Signature is required!");

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
      setter(file); // Store the actual file for FormData
      
      // For preview purpose
      const reader = new FileReader();
      reader.onload = () => {
        e.target.dataset.preview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create FormData instance
    const formData = new FormData();
    
    // Add removal fields
    formData.append('removed_datetime', removedDateTime);
    formData.append('removed_lock_tag_number', removedLockTagNumber);
    formData.append('removed_permit_number', removedPermitNumber);
    formData.append('removed_by_name', removedByName);
    formData.append('removed_by_signature', removedBySignature);
    formData.append('removed_site_incharge_name', removedSiteInChargeName);
    formData.append('removed_approved_by_signature', removedApprovedBySiteInChargeSignature);
    
    try {
      // Call the mutation with the FormData
      const response = await updateLotoRegister({ 
        id: lotoId, 
        formData 
      }).unwrap();
      
      if (response.status) {
        toast.success("Lockout/Tagout removal form submitted successfully!");
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
    setRemovedDateTime("");
    setRemovedLockTagNumber("");
    setRemovedPermitNumber("");
    setRemovedByName("");
    setRemovedBySignature(null);
    setRemovedSiteInChargeName("");
    setRemovedApprovedBySiteInChargeSignature(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Lockout/Tagout Removal
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Removed Date/Time */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed Date/Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="datetime-local"
              value={removedDateTime}
              sx={commonInputStyles}
              onChange={(e) => setRemovedDateTime(e.target.value)}
            />
          </Grid>

          {/* Removed Lock/Tag Number */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed Lock/Tag Number<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Lock/Tag Number"
              value={removedLockTagNumber}
              sx={commonInputStyles}
              onChange={(e) => setRemovedLockTagNumber(e.target.value)}
            />
          </Grid>

          {/* Removed Permit Number */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed Permit Number<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Permit Number"
              value={removedPermitNumber}
              sx={commonInputStyles}
              onChange={(e) => setRemovedPermitNumber(e.target.value)}
            />
          </Grid>

          {/* Removed By Name */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed By Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={removedByName}
              sx={commonInputStyles}
              onChange={(e) => setRemovedByName(e.target.value)}
            />
          </Grid>

          {/* Removed By Signature */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed By Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleSignatureUpload(setRemovedBySignature, e)}
                />
              </Button>
              {removedBySignature && (
                <Avatar
                  src={e => e.target.dataset.preview || ''}
                  alt="Removed By Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Removed Site In-Charge Name */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed Site In-Charge Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={removedSiteInChargeName}
              sx={commonInputStyles}
              onChange={(e) => setRemovedSiteInChargeName(e.target.value)}
            />
          </Grid>

          {/* Removed Approved By Site In-Charge Signature */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Removed Approved By Site In-Charge Signature<span className="text-red-600"> *</span>
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
                    handleSignatureUpload(setRemovedApprovedBySiteInChargeSignature, e)
                  }
                />
              </Button>
              {removedApprovedBySiteInChargeSignature && (
                <Avatar
                  src={e => e.target.dataset.preview || ''}
                  alt="Approved By Site In-Charge Signature"
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