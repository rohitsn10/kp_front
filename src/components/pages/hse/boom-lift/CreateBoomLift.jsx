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
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateBoomLiftInspectionMutation } from "../../../../api/hse/boomLift/boomliftApi";
// import { useCreateBoomLiftInspectionMutation } from "../services/api"; // Update path as needed
export default function BoomLiftInspectionDialog({ open, setOpen }) {
  // RTK query hook
  const [createBoomLiftInspection, { isLoading }] = useCreateBoomLiftInspectionMutation();

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
    operator_fitness_certificate: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    main_horn_reverse_horn: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    emergency_lowering: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    tyre_pressure_condition: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    any_leakage: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    smooth_function: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    brake_stop_hold: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    condition_of_all: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    guard_rails_without_damage: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    toe_guard: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    platform_condition: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    door_lock_platform: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    swl: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    over_load_indicator_cut_off_devices: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    battery_condition: {
      observations: "",
      action_by: "",
      remarks: ""
    },
    operator_list: {
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
    "Valid", "Working", "Functional", "No leakage", "Operational",
    "Good condition", "No damage", "Proper pressure", "Within limits",
    "Smooth movement", "Needs repair", "Damaged", "Needs replacement"
  ];

  const validateForm = () => {
    const requiredFields = [
      { value: equipmentName, label: "Equipment Name" },
      { value: makeModel, label: "Make/Model" },
      { value: identificationNumber, label: "Identification Number" },
      { value: inspectionDate, label: "Inspection Date" },
      { value: siteName, label: "Site Name" },
      { value: location, label: "Location" },
    ];
  
    const emptyField = requiredFields.find(field => !field.value || field.value.trim?.() === "");
    if (emptyField) {
      toast.error(`${emptyField.label} is required!`);
      return false;
    }
  
    // Check if all inspection fields have observations and action_by filled
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

  const resetForm = () => {
    setEquipmentName("");
    setMakeModel("");
    setIdentificationNumber("");
    setInspectionDate("");
    setSiteName("");
    setLocation("");
    
    // Reset all inspection fields
    const resetFields = {};
    Object.keys(inspectionFields).forEach(key => {
      resetFields[key] = { observations: "", action_by: "", remarks: "" };
    });
    setInspectionFields(resetFields);
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) return;

  //   // Format the date as ISO string if it's a valid date
  //   let formattedDate = inspectionDate;
  //   if (inspectionDate) {
  //     try {
  //       const dateObj = new Date(inspectionDate);
  //       if (!isNaN(dateObj.getTime())) {
  //         formattedDate = dateObj.toISOString();
  //       }
  //     } catch (error) {
  //       console.error("Date formatting error:", error);
  //     }
  //   }

  //   // Transform the state data to match the API request format
  //   const requestData = {
  //     equipment_name: equipmentName,
  //     make_model: makeModel,
  //     identification_number: identificationNumber,
  //     inspection_date: formattedDate,
  //     site_name: siteName,
  //     location: location,
  //   };

  //   // Add all inspection fields to request data
  //   for (const [key, value] of Object.entries(inspectionFields)) {
  //     requestData[`${key}_observations`] = value.observations;
  //     requestData[`${key}_action_by`] = value.action_by;
  //     requestData[`${key}_remarks`] = value.remarks || "No remarks"; // Set default value if empty
  //   }

  //   try {
  //     // Call the RTK query mutation
  //     const result = await createBoomLiftInspection(requestData).unwrap();
  //     toast.success("Boom Lift inspection submitted successfully!");
  //     resetForm();
  //     setOpen(false);
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     toast.error(error.data?.message || "Failed to submit inspection. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
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
    };
  
    for (const [key, value] of Object.entries(inspectionFields)) {
      requestData[`${key}_observations`] = value.observations;
      requestData[`${key}_action_by`] = value.action_by;
      requestData[`${key}_remarks`] = value.remarks || "No remarks";
    }
  
    try {
      const result = await createBoomLiftInspection(requestData).unwrap();
  
      if (result.status) {
        toast.success(result.message || "Boom Lift inspection submitted successfully!");
        resetForm();
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to submit inspection.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.data?.message || "Failed to submit inspection. Please try again.");
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
            {/* <InputLabel>Observations</InputLabel>
            <Select
              value={inspectionFields[fieldKey].observations}
              onChange={(e) => handleInspectionFieldChange(fieldKey, 'observations', e.target.value)}
              label="Observations"
            >
              {observationOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
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
        Boom Lift Inspection Form
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
          {renderInspectionField('operator_fitness_certificate', 'Operator Fitness Certificate')}
          {renderInspectionField('main_horn_reverse_horn', 'Main Horn & Reverse Horn')}
          {renderInspectionField('emergency_lowering', 'Emergency Lowering')}
          {renderInspectionField('tyre_pressure_condition', 'Tyre Pressure & Condition')}
          {renderInspectionField('any_leakage', 'Any Leakage')}
          {renderInspectionField('smooth_function', 'Smooth Function')}
          {renderInspectionField('brake_stop_hold', 'Brake Stop & Hold')}
          {renderInspectionField('condition_of_all', 'Condition of All')}
          {renderInspectionField('guard_rails_without_damage', 'Guard Rails Without Damage')}
          {renderInspectionField('toe_guard', 'Toe Guard')}
          {renderInspectionField('platform_condition', 'Platform Condition')}
          {renderInspectionField('door_lock_platform', 'Door Lock Platform')}
          {renderInspectionField('swl', 'SWL (Safe Working Load)')}
          {renderInspectionField('over_load_indicator_cut_off_devices', 'Overload Indicator & Cut-off Devices')}
          {renderInspectionField('battery_condition', 'Battery Condition')}
          {renderInspectionField('operator_list', 'Operator List')}
          {renderInspectionField('ppe', 'PPE')}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined" disabled={isLoading}>
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