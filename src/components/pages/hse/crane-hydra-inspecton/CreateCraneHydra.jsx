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
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateCraneHydraInspectionMutation } from "../../../../api/hse/crane/craneHydraApi";

export default function CraneHydraInspectionDialog({ open, setOpen }) {
  // RTK mutation hook
  const [createCraneHydraInspection, { isLoading }] = useCreateCraneHydraInspectionMutation();
  
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
    swl_on_boom_lift: {
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
    const requiredFields = [
      { value: equipmentName, label: "Equipment Name" },
      { value: makeModel, label: "Make/Model" },
      { value: identificationNumber, label: "Identification Number" },
      { value: inspectionDate, label: "Inspection Date" },
      { value: siteName, label: "Site Name" },
      { value: location, label: "Location" },
      { value: inspectedByName, label: "Inspected By Name" },
    ];
  
    const emptyField = requiredFields.find(field => !field.value || field.value.trim?.() === "");
    if (emptyField) {
      toast.error(`${emptyField.label} is required!`);
      return false;
    }
    
    if (!inspectedBySignature) {
      toast.error("Inspected By Signature is required!");
      return false;
    }
  
    for (const [key, value] of Object.entries(inspectionFields)) {
      if (!value.observations?.trim()) {
        toast.error(`Observations for ${key.replace(/_/g, " ")} is required!`);
        return false;
      }
      if (!value.action_by?.trim()) {
        toast.error(`Action by for ${key.replace(/_/g, " ")} is required!`);
        return false;
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
      const reader = new FileReader();
      reader.onload = () => {
        setInspectedBySignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      let formattedDate = inspectionDate;
      if (inspectionDate) {
        try {
          const dateObj = new Date(inspectionDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString();
          }
        } catch (error) {
          console.error("Date formatting error:", error);
        }
      }
  
      const requestData = {
        equipment_name: equipmentName,
        make_model: makeModel,
        identification_number: identificationNumber,
        inspection_date: formattedDate,
        site_name: siteName,
        location: location,
        remarks: remarks,
        inspected_by_name: inspectedByName,
        inspected_by_signature: inspectedBySignature,
      };
  
      for (const [key, value] of Object.entries(inspectionFields)) {
        requestData[`${key}_observations`] = value.observations;
        requestData[`${key}_action_by`] = value.action_by;
        requestData[`${key}_remarks`] = value.remarks || "No remarks";
      }
  
      const response = await createCraneHydraInspection(requestData).unwrap();
  
      if (response.status) {
        toast.success(response.message || "Crane inspection submitted successfully!");
        resetForm();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit inspection.");
      }
  
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.data?.message || "Failed to submit inspection. Please try again.");
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
    Object.keys(inspectionFields).forEach(key => {
      resetFields[key] = { observations: "", action_by: "", remarks: "" };
    });
    setInspectionFields(resetFields);
  };

  const renderInspectionField = (fieldKey, label) => {
    return (
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12}>
          <p className="font-semibold text-[#29346B]">{label}</p>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" sx={commonInputStyles}>
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
        Crane/Hydra Inspection Form
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
          {renderInspectionField('all_valid_document', 'All Valid Documents')}
          {renderInspectionField('driver_fitness_certificate', 'Driver Fitness Certificate')}
          {renderInspectionField('main_horn_reverse_horn', 'Main Horn & Reverse Horn')}
          {renderInspectionField('cutch_brake', 'Clutch & Brake')}  {/* Fixed typo: cutch to clutch */}
          {renderInspectionField('tyre_pressure_condition', 'Tyre Pressure & Condition')}
          {renderInspectionField('head_light_indicator', 'Head Light & Indicator')}
          {renderInspectionField('seat_belt', 'Seat Belt')}
          {renderInspectionField('wiper_blade', 'Wiper Blade')}
          {renderInspectionField('side_mirror', 'Side Mirror')}
          {renderInspectionField('wind_screen', 'Wind Screen')}
          {renderInspectionField('door_lock', 'Door Lock')}
          {renderInspectionField('battery_condition', 'Battery Condition')}
          {renderInspectionField('hand_brake', 'Hand Brake')}
          {renderInspectionField('swl_on_boom_lift', 'SWL on Boom/Lift')}
          {renderInspectionField('any_leakage', 'Any Leakage')}
          {renderInspectionField('speedometere', 'Speedometer')}
          {renderInspectionField('guard_parts', 'Guard Parts')}
          {renderInspectionField('ppe', 'PPE')}
        </div>
        
        {/* Added new fields section */}
        <div className="my-4 border-t border-gray-300 pt-4">
          {/* <h3 className="text-xl font-bold text-[#29346B] mb-4">Summary & Sign-off</h3> */}
          
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
                {inspectedBySignature && (
                  <Avatar
                    src={inspectedBySignature}
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
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}