import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateTrailerInspectionMutation } from "../../../../api/hse/trailerInspection/trailerInspectionApi";
import { useParams } from "react-router-dom";
// import { useCreateTrailerInspectionMutation } from "../services/api"; // Adjust the import path as necessary

export default function TrailerInspectionDialog({ open, setOpen, onSuccess }) {
  // API mutation hook
  const { locationId } = useParams();
  const [createTrailerInspection, { isLoading }] = useCreateTrailerInspectionMutation();

  // Basic information
  const [equipmentName, setEquipmentName] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");

  // New fields
  const [remarks, setRemarks] = useState("");
  const [inspectedByName, setInspectedByName] = useState("");
  const [inspectedBySignature, setInspectedBySignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  // Inspection fields - each field has observations, action_by, and remarks
  const [inspectionFields, setInspectionFields] = useState({
    all_valid_document: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    driver_fitness_certificate: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    main_horn_reverse_horn: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    cutch_brake: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    tyre_pressure_condition: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    head_light_indicator: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    seat_belt: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    wiper_blade: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    side_mirror: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    wind_screen: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    door_lock: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    battery_condition: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    hand_brake: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    any_leakage: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    speedometere: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    guard_parts: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    ppe: {
      observations: "",
      action_by: "",
      remarks: ""
    }
  });

  const observationOptions = [
    "Valid", "Working", "Good", "Functional", "Clean",
    "Operational", "Checked", "No leaks", "Used correctly",
    "Needs repair", "Damaged", "Broken", "Needs replacement"
  ];

  const validateForm = () => {
    if (!equipmentName.trim()) return toast.error("Equipment Name is required!");
    if (!makeModel.trim()) return toast.error("Make/Model is required!");
    if (!identificationNumber.trim()) return toast.error("Identification Number is required!");
    if (!inspectionDate.trim()) return toast.error("Inspection Date is required!");
    if (!siteName.trim()) return toast.error("Site Name is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!inspectedByName.trim()) return toast.error("Inspected By Name is required!");
    if (!inspectedBySignature) return toast.error("Inspected By Signature is required!");

    // Check if all inspection fields have observations filled
    for (const [key, value] of Object.entries(inspectionFields)) {
      if (!value.observations) {
        return toast.error(`Observations for ${key.replace(/_/g, " ")} is required!`);
      }
      if (!value.action_by) {
        return toast.error(`Action by for ${key.replace(/_/g, " ")} is required!`);
      }
    }

    return true;
  };

  const handleClose = () => setOpen(false);

  const handleInspectionFieldChange = (field, subfield, value) => {
    setInspectionFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value
      }
    }));
  };

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

  // Signature upload handler
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInspectedBySignature(file); // Store the actual file object

      // If you still need to show a preview:
      const reader = new FileReader();
      reader.onload = () => {
        setSignaturePreview(reader.result); // New state for preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEquipmentName("");
    setMakeModel("");
    setIdentificationNumber("");
    setInspectionDate("");
    setSiteName("");
    setLocation("");
    setRemarks("");
    setInspectedByName("");
    setInspectedBySignature(null);

    // Reset all inspection fields
    const resetFields = {};
    for (const key in inspectionFields) {
      resetFields[key] = {
        observations: "",
        action_by: "",
        remarks: ""
      };
    }
    setInspectionFields(resetFields);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Format the date as ISO string if it's a valid date
    let formattedDate = inspectionDate;
    if (inspectionDate) {
      try {
        // Add time if not present (API expects full datetime)
        const dateObj = new Date(inspectionDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString();
        }
      } catch (error) {
        console.error("Date formatting error:", error);
      }
    }
    const formData = new FormData();
    formData.append('equipment_name', equipmentName);
    formData.append('make_model', makeModel);
    formData.append('identification_number', identificationNumber);
    formData.append('inspection_date', formattedDate);
    formData.append('site_name', siteName);
    formData.append('location', locationId);
    formData.append('inspected_name', inspectedByName);
    if (inspectedBySignature) {
      formData.append('inspected_sign', inspectedBySignature);
    }

    // Transform the state data to match the API request format
    // const requestData = {
    //   equipment_name: equipmentName,
    //   make_model: makeModel,
    //   identification_number: identificationNumber,
    //   inspection_date: formattedDate,
    //   site_name: siteName,
    //   location: location,
    //   remarks: remarks,
    //   inspected_by_name: inspectedByName,
    //   inspected_by_signature: inspectedBySignature,
    // };

    // Add all inspection fields to request data
    // for (const [key, value] of Object.entries(inspectionFields)) {
    //   requestData[`${key}_observations`] = value.observations;
    //   requestData[`${key}_action_by`] = value.action_by;
    //   requestData[`${key}_remarks`] = value.remarks;
    // }
    for (const [key, value] of Object.entries(inspectionFields)) {
      formData.append(`${key}_observations`, value.observations);
      formData.append(`${key}_action_by`, value.action_by);
      formData.append(`${key}_remarks`, value.remarks || "");
    }

    try {
      // Call the mutation hook with the request data
      const response = await createTrailerInspection(formData).unwrap();
      if (response.status) {
        toast.success(response.message || "Trailer Lift inspection submitted successfully!");
        onSuccess();
        resetForm();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit inspection.");
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = error.data?.message || "Failed to submit trailer inspection";
      toast.error(errorMessage);
    }
  };

  const renderInspectionField = (fieldKey, label) => {
    return (
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12}>
          <p className="font-semibold text-[#29346B]">{label}</p>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" sx={commonInputStyles}>
            {/* <InputLabel>Observation</InputLabel> */}
            {/* <Select
              value={inspectionFields[fieldKey].observations}
              onChange={(e) => handleInspectionFieldChange(fieldKey, 'observations', e.target.value)}
              label="Observation"
            >
              {observationOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select> */}
            <TextField
              fullWidth
              label="Observations"
              variant="outlined"
              value={inspectionFields[fieldKey].observations}
              onChange={(e) => handleInspectionFieldChange(fieldKey, 'observations', e.target.value)}
              sx={commonInputStyles}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Action By"
            variant="outlined"
            value={inspectionFields[fieldKey].action_by}
            onChange={(e) => handleInspectionFieldChange(fieldKey, 'action_by', e.target.value)}
            sx={commonInputStyles}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Remarks"
            variant="outlined"
            value={inspectionFields[fieldKey].remarks}
            onChange={(e) => handleInspectionFieldChange(fieldKey, 'remarks', e.target.value)}
            sx={commonInputStyles}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Trailer Inspection Form
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} className="mt-1">
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Equipment Name"
              variant="outlined"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              required
              sx={commonInputStyles}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Make/Model"
              variant="outlined"
              value={makeModel}
              onChange={(e) => setMakeModel(e.target.value)}
              required
              sx={commonInputStyles}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Identification Number"
              variant="outlined"
              value={identificationNumber}
              onChange={(e) => setIdentificationNumber(e.target.value)}
              required
              sx={commonInputStyles}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Inspection Date"
              type="datetime-local"
              variant="outlined"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              sx={commonInputStyles}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site Name"
              variant="outlined"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              sx={commonInputStyles}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={commonInputStyles}
              className="mb-4"
            />
          </Grid>
        </Grid>

        <div className="my-4 border-t border-gray-300 pt-4">
          <h3 className="text-xl font-bold text-[#29346B] mb-4">Inspection Details</h3>

          {/* Inspection Fields */}
          {renderInspectionField('all_valid_document', 'All valid documents are available - Registration, Insurance, Vehicle Fitness, PUC &  License')}
          {renderInspectionField('driver_fitness_certificate', 'Driver fitness certificate including eye  test.')}
          {renderInspectionField('main_horn_reverse_horn', 'Main Horn & Reverse Horn')}
          {renderInspectionField('cutch_brake', 'Clutch & Brake')}
          {renderInspectionField('tyre_pressure_condition', 'Tyre Pressure & Condition')}
          {renderInspectionField('head_light_indicator', 'Head Light & Indicator')}
          {renderInspectionField('seat_belt', 'Seat Belt')}
          {renderInspectionField('wiper_blade', 'Wiper Blade')}
          {renderInspectionField('side_mirror', 'Side view Mirror')}
          {renderInspectionField('wind_screen', 'Wind Screen')}
          {renderInspectionField('door_lock', 'Door/Door Lock')}
          {renderInspectionField('battery_condition', 'Battery Condition')}
          {renderInspectionField('hand_brake', 'Hand Brake')}
          {renderInspectionField('any_leakage', 'Condition of hydraulic cylinder & any  leakage')}
          {renderInspectionField('speedometere', 'Speedometer & Gauge')}
          {renderInspectionField('guard_parts', 'Guard for moving Parts')}
          {renderInspectionField('ppe', 'PPEs  (Safety shoes & helmet)')}
        </div>

        {/* Added new fields section */}
        <div className="my-4 border-t border-gray-300 pt-4">
          {/* <h3 className="text-xl font-bold text-[#29346B] mb-4">Summary & Sign-off</h3> */}
          <p className="mb-4 text-[#29346B] text-lg"> <span className="text-slate-950 font-semibold">Note:</span>  This checklist is applicable for all vehicles like- Truck /JCB / Tractor / Transit Mixer /
            Conveyance Vehicles /    Loader / Roller etc.

          </p>
          <Grid container spacing={3}>
            {/* Remarks field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                variant="outlined"
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={commonInputStyles}
                className="mb-4"
              />
            </Grid>

            {/* Inspected By Name field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Inspected By Name"
                variant="outlined"
                value={inspectedByName}
                onChange={(e) => setInspectedByName(e.target.value)}
                required
                sx={commonInputStyles}
                className="mb-4"
              />
            </Grid>

            {/* Inspected By Signature field */}
            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Inspected By Signature<span className="text-red-600"> *</span>
              </label>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    onChange={handleSignatureUpload}
                  />
                </Button>
                {signaturePreview && (
                  <Avatar
                    src={signaturePreview}
                    alt="Inspector Signature"
                    variant="rounded"
                    sx={{ width: 100, height: 56 }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
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