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
import { useCreateBoomLiftInspectionMutation } from "../../../../api/hse/boomLift/boomLiftApi";
import { useParams } from "react-router-dom";

export default function BoomLiftInspectionDialog({ open, setOpen }) {
  // RTK query hook
  const [createBoomLiftInspection, { isLoading }] = useCreateBoomLiftInspectionMutation();
  const { locationId } = useParams();
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
  
  // Signature upload handler
const handleSignatureUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 20MB");
      return;
    }
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file only");
      return;
    }
    
    setInspectedBySignature(file);
    setSignaturePreview(file.name); // Show filename instead of image preview
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    // Create FormData object for file upload
    const formData = new FormData();
    
    // Add basic information
    formData.append('equipment_name', equipmentName);
    formData.append('make_model', makeModel);
    formData.append('identification_number', identificationNumber);
    formData.append('inspection_date', inspectionDate);
    formData.append('site_name', siteName);
    formData.append('location', locationId); // Using locationId from useParams
    
    // Add inspected information
    formData.append('inspected_name', inspectedByName);
    
    // Convert base64 signature to file if it exists
    if (inspectedBySignature) {
      formData.append('inspected_sign', inspectedBySignature);
    }
    
    // Add all inspection fields according to backend naming convention
    for (const [key, value] of Object.entries(inspectionFields)) {
      formData.append(`${key}_observations`, value.observations);
      formData.append(`${key}_action_by`, value.action_by);
      formData.append(`${key}_remarks`, value.remarks || "");
    }
  
    try {
      const result = await createBoomLiftInspection(formData).unwrap();
  
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
          {renderInspectionField('all_valid_document', 'All valid documents (Registration, Insurance, License, Operator authority letter, Form 10)')}
          {renderInspectionField('operator_fitness_certificate', 'Operator fitness certificate including eye test')}
          {renderInspectionField('main_horn_reverse_horn', 'Main Horn & Reverse Horn')}
          {renderInspectionField('emergency_lowering', 'Emergency lowering function properly')}
          {renderInspectionField('tyre_pressure_condition', 'Tyre Pressure & Condition')}
          {renderInspectionField('any_leakage', 'Hydraulic cylinder & any leakage.')}
          {renderInspectionField('smooth_function', 'Smooth function of hydraulic boom')}
          {renderInspectionField('brake_stop_hold', 'Brake Stop & Hold')}
          {renderInspectionField('condition_of_all', 'Condition of all lever button.')}
          {renderInspectionField('guard_rails_without_damage', 'Guard rails are in good condition without any damage on platform')}
          {renderInspectionField('toe_guard', 'Toe Guard')}
          {renderInspectionField('platform_condition', 'Platform Condition')}
          {renderInspectionField('door_lock_platform', 'Door Lock Arrangement for Platform')}
          {renderInspectionField('swl', 'SWL mentioned on boom lift')}
          {renderInspectionField('over_load_indicator_cut_off_devices', 'Over load indicator & cut off devices working properly.')}
          {renderInspectionField('battery_condition', 'Battery Condition')}
          {renderInspectionField('operator_list', 'Display Authorized operator list')}
          {renderInspectionField('ppe', 'PPE (Safety shoes & helmet)')}
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
  accept=".pdf,application/pdf"
  hidden
  onChange={handleSignatureUpload}
/>
                </Button>
{signaturePreview && (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    padding: '8px 12px', 
    border: '1px solid #ccc', 
    borderRadius: '4px',
    backgroundColor: '#f5f5f5'
  }}>
    📄 {signaturePreview}
  </Box>
)}
              </Box>
            </Grid>
          </Grid>
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