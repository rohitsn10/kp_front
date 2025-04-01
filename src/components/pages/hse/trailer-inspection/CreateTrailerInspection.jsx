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
} from "@mui/material";
import { toast } from "react-toastify";

export default function TrailerInspectionDialog({ open, setOpen }) {
  // Basic information
  const [equipmentName, setEquipmentName] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");

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

  const handleSubmit = () => {
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

    // Transform the state data to match the API request format
    const requestData = {
      equipment_name: equipmentName,
      make_model: makeModel,
      identification_number: identificationNumber,
      inspection_date: formattedDate,
      site_name: siteName,
      location: location,
    };

    // Add all inspection fields to request data
    for (const [key, value] of Object.entries(inspectionFields)) {
      requestData[`${key}_observations`] = value.observations;
      requestData[`${key}_action_by`] = value.action_by;
      requestData[`${key}_remarks`] = value.remarks;
    }

    console.log(requestData);
    toast.success("Trailer inspection submitted successfully!");
    setOpen(false);
  };

  const renderInspectionField = (fieldKey, label) => {
    return (
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12}>
          <p className="font-semibold text-[#29346B]">{label}</p>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <FormControl fullWidth variant="outlined" sx={commonInputStyles}>
            <InputLabel>Observations</InputLabel>
            <Select
              value={inspectionFields[fieldKey].observations}
              onChange={(e) => handleInspectionFieldChange(fieldKey, 'observations', e.target.value)}
              label="Observations"
            >
              {observationOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <TextField
            fullWidth
            label="Observation"
            variant="outlined"
            value={inspectionFields[fieldKey].observations}
            onChange={(e) => handleInspectionFieldChange(fieldKey, 'observations', e.target.value)}
            sx={commonInputStyles}
          />
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
          {renderInspectionField('all_valid_document', 'All Valid Documents')}
          {renderInspectionField('driver_fitness_certificate', 'Driver Fitness Certificate')}
          {renderInspectionField('main_horn_reverse_horn', 'Main Horn & Reverse Horn')}
          {renderInspectionField('cutch_brake', 'Clutch & Brake')}
          {renderInspectionField('tyre_pressure_condition', 'Tyre Pressure & Condition')}
          {renderInspectionField('head_light_indicator', 'Head Light & Indicator')}
          {renderInspectionField('seat_belt', 'Seat Belt')}
          {renderInspectionField('wiper_blade', 'Wiper Blade')}
          {renderInspectionField('side_mirror', 'Side Mirror')}
          {renderInspectionField('wind_screen', 'Wind Screen')}
          {renderInspectionField('battery_condition', 'Battery Condition')}
          {renderInspectionField('hand_brake', 'Hand Brake')}
          {renderInspectionField('any_leakage', 'Any Leakage')}
          {renderInspectionField('speedometere', 'Speedometer')}
          {renderInspectionField('guard_parts', 'Guard Parts')}
          {renderInspectionField('ppe', 'PPE')}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
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