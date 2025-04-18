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
import { useCreateLadderInspectionMutation } from "../../../../api/hse/ladder/ladderInspectionApi";
import { useParams } from "react-router-dom";
// import { useCreateLadderInspectionMutation } from "../services/ladderInspectionApi"; // Adjust path as needed

export default function LadderInspectionDialog({ open, setOpen,onSuccess }) {
  const { locationId } = useParams();
  const [site, setSite] = useState("");
  const [ladderNo, setLadderNo] = useState("");
  const [dateOfInspection, setDateOfInspection] = useState("");
  const [visualPhysicalChecks, setVisualPhysicalChecks] = useState({
    rail_strings_damaged: "",
    rung_missing: "",
    rung_broken: "",
    rung_distance_uneven: "",
    rungs_loose: "",
    top_hook_missing_damaged: "",
    bottom_non_skid_pad_missing_damaged: "",
    non_slip_bases: "",
    custom_check: "",
  });
  const [remarks, setRemarks] = useState("");
  const [inspectedCheckedBy, setInspectedCheckedBy] = useState({
    name: "",
    signature: null,
  });

  // RTK Query hook for creating ladder inspection
  const [createLadderInspection, { isLoading }] = useCreateLadderInspectionMutation();

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!ladderNo.trim()) return toast.error("Ladder No. is required!");
    if (!dateOfInspection.trim()) return toast.error("Date of Inspection is required!");
    if (!inspectedCheckedBy.name.trim())
      return toast.error("Inspected/Checked By Name is required!");
    if (!inspectedCheckedBy.signature)
      return toast.error("Inspected/Checked By Signature is required!");

    return true;
  };

  const handleClose = () => setOpen(false);

  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      transition: "border 0.2s ease-in-out",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15", // Ensures yellow border on hover
        borderBottom: "4px solid #FACC15",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15", // Ensures yellow border on focus
        borderWidth: "2px",
        borderBottom: "4px solid #FACC15",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #FACC15", // Default border
      borderBottom: "4px solid #FACC15", // Maintain yellow bottom border
    },
  };

  const handleVisualPhysicalChecksChange = (field, value) => {
    setVisualPhysicalChecks({ ...visualPhysicalChecks, [field]: value });
  };

  const handleInspectedCheckedBySignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file for form submission
      setInspectedCheckedBy({
        ...inspectedCheckedBy,
        signatureFile: file,
      });
      
      // Create preview for display
      const reader = new FileReader();
      reader.onload = () => {
        setInspectedCheckedBy(prev => ({
          ...prev,
          signature: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create FormData for API submission
    const formData = new FormData();
    
    // Add basic fields
    formData.append("site_name", site);
    formData.append("location", locationId);
    formData.append("ladder_no", ladderNo);
    formData.append("date_of_inspection", dateOfInspection);
    formData.append("remarks", remarks);
    formData.append("inspected_by_name", inspectedCheckedBy.name);
    
    // Add visual/physical checks
    Object.entries(visualPhysicalChecks).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add signature file if available
    if (inspectedCheckedBy.signatureFile) {
      formData.append("inspected_by_signature", inspectedCheckedBy.signatureFile);
    }

    try {
      const response = await createLadderInspection(formData).unwrap();
      if (response.status) {
        toast.success(response.message || "Ladder inspection data submitted successfully!");
        // Reset form
        setSite("");
        setLadderNo("");
        setDateOfInspection("");
        setVisualPhysicalChecks({
          rail_strings_damaged: "",
          rung_missing: "",
          rung_broken: "",
          rung_distance_uneven: "",
          rungs_loose: "",
          top_hook_missing_damaged: "",
          bottom_non_skid_pad_missing_damaged: "",
          non_slip_bases: "",
          custom_check: "",
        });
        setRemarks("");
        setInspectedCheckedBy({
          name: "",
          signature: null,
          signatureFile: null,
        });
        onSuccess();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit ladder inspection data");
      }
    } catch (error) {
      console.error("Error submitting ladder inspection:", error);
      toast.error(error.data?.message || "An error occurred while submitting the form");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Ladder Inspection Form
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Inspection Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Inspection Details
            </Typography>
            <Divider />
          </Grid>

          {/* Site & Ladder No */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site Name"
              value={site}
              sx={commonInputStyles}
              onChange={(e) => setSite(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Ladder No.<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Ladder No."
              value={ladderNo}
              sx={commonInputStyles}
              onChange={(e) => setLadderNo(e.target.value)}
            />
          </Grid>

          {/* Date of Inspection */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date of Inspection<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={dateOfInspection}
              sx={commonInputStyles}
              onChange={(e) => setDateOfInspection(e.target.value)}
            />
          </Grid>

          {/* Visual/Physical Checks */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Visual/Physical Checks
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {Object.entries(visualPhysicalChecks).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <TextField
                    fullWidth
                    label={key.replace(/_/g, " ")}
                    variant="outlined"
                    value={value}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleVisualPhysicalChecksChange(key, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Remarks
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter remarks"
              value={remarks}
              sx={commonInputStyles}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Grid>

          {/* Inspected/Checked By */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Inspected/Checked By Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={inspectedCheckedBy.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setInspectedCheckedBy({
                  ...inspectedCheckedBy,
                  name: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Inspected/Checked By Signature<span className="text-red-600"> *</span>
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
                  onChange={handleInspectedCheckedBySignatureUpload}
                />
              </Button>
              {inspectedCheckedBy.signature && (
                <Avatar
                  src={inspectedCheckedBy.signature}
                  alt="Inspected/Checked By Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
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