import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useCreateFireExtinguisherInspectionMutation, useGetAllFireExtinguisherInspectionsQuery } from '../../../../api/hse/extinguisher/extinguisherApi';
// Import the hook instead of axios
// import { useCreateFireExtinguisherInspectionMutation } from 'your-api-slice-path'; // Replace with your actual API slice path

// Define the extinguisher type options
const extinguisherTypes = ["Dry Powder", "CO2", "Foam", "Water"];
const pressureOptions = ["Normal", "Low", "High"];
const conditionOptions = ["Good", "Fair", "Poor"];
const accessOptions = ["Clear", "Partially Blocked", "Blocked"];

const FireExtinguisherInspectionDialog = ({ open, setOpen }) => {
  // Form state
  const [siteName, setSiteName] = useState('');
  const [dateOfInspection, setDateOfInspection] = useState('');
  const [checkedByName, setCheckedByName] = useState('');
  const [signature, setSignature] = useState(null);
    const { refetch } = useGetAllFireExtinguisherInspectionsQuery();
  
  // Validation states
  const [errors, setErrors] = useState({
    siteName: false,
    dateOfInspection: false,
    checkedByName: false,
    signature: false,
    extinguishers: []
  });
  
  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // RTK Query hook
  const [createFireExtinguisherInspection, { isLoading: isSubmitting }] = useCreateFireExtinguisherInspectionMutation();
  
  // Extinguisher details array
  const [extinguishers, setExtinguishers] = useState([{
    extinguisher_no: '',
    extinguisher_type: 'Dry Powder',
    weight: 0,
    location: '',
    seal_intact: true,
    pressure_in_gauge: 'Normal',
    tube_nozzle: 'Good',
    painting_condition: 'Good',
    refilling_date: '',
    due_date_refilling: '',
    due_date_hydro_test: '',
    access: 'Clear',
    remarks: ''
  }]);

  // Handle form field changes
  const handleExtinguisherChange = (index, field, value) => {
    const updatedExtinguishers = [...extinguishers];
    updatedExtinguishers[index][field] = value;
    setExtinguishers(updatedExtinguishers);
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
  // Add a new extinguisher entry
  const addExtinguisher = () => {
    setExtinguishers([
      ...extinguishers,
      {
        extinguisher_no: '',
        extinguisher_type: 'Dry Powder',
        weight: 0,
        location: '',
        seal_intact: true,
        pressure_in_gauge: 'Normal',
        tube_nozzle: 'Good',
        painting_condition: 'Good',
        refilling_date: '',
        due_date_refilling: '',
        due_date_hydro_test: '',
        access: 'Clear',
        remarks: ''
      }
    ]);
    
    // Add a new entry to the errors array for proper validation tracking
    setErrors(prev => ({
      ...prev,
      extinguishers: [...prev.extinguishers, {}]
    }));
  };

  // Remove an extinguisher entry
  const removeExtinguisher = (index) => {
    const updatedExtinguishers = [...extinguishers];
    updatedExtinguishers.splice(index, 1);
    setExtinguishers(updatedExtinguishers);
    
    // Update the errors array to match
    const updatedErrors = {...errors};
    updatedErrors.extinguishers.splice(index, 1);
    setErrors(updatedErrors);
  };

  // Handle signature file selection
  const handleSignatureChange = (event) => {
    setSignature(event.target.files[0]);
  };

  // Form validation with detailed error tracking
  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {
      siteName: false,
      dateOfInspection: false,
      checkedByName: false,
      signature: false,
      extinguishers: []
    };
    
    // Validate main fields
    if (!siteName) {
      newErrors.siteName = true;
      formIsValid = false;
    }
    
    if (!dateOfInspection) {
      newErrors.dateOfInspection = true;
      formIsValid = false;
    }
    
    if (!checkedByName) {
      newErrors.checkedByName = true;
      formIsValid = false;
    }
    
    if (!signature) {
      newErrors.signature = true;
      formIsValid = false;
    }
    
    // Validate extinguishers
    extinguishers.forEach((extinguisher, index) => {
      const extinguisherErrors = {};
      
      if (!extinguisher.extinguisher_no) {
        extinguisherErrors.extinguisher_no = true;
        formIsValid = false;
      }
      
      if (!extinguisher.location) {
        extinguisherErrors.location = true;
        formIsValid = false;
      }
      
      newErrors.extinguishers[index] = extinguisherErrors;
    });
    
    setErrors(newErrors);
    return formIsValid;
  };

  // Handle toast close
  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Format the data according to the API requirements
      const formData = new FormData();
      
      // Add the main inspection details
      formData.append('site_name', siteName);
      formData.append('date_of_inspection', dateOfInspection);
      formData.append('checked_by_name', checkedByName);
      formData.append('signature', signature);
      
      // Add the extinguisher details as JSON string
      formData.append('fire_extinguisher_details', JSON.stringify(extinguishers));
      
      // Use the RTK Query mutation hook instead of axios
      const response = await createFireExtinguisherInspection(formData).unwrap();
      
      // Handle successful response
      console.log('Response:', response);
      
      // Check if response has the expected structure
      if (response && response.status === true) {
        setToast({
          open: true,
          message: response.message || 'Fire extinguisher inspection created successfully',
          severity: 'success'
        });
        refetch();
        // Reset form and close dialog
        resetForm();
        setOpen(false);
      } else {
        // Handle unexpected success response format
        setToast({
          open: true,
          message: 'Form submitted but received unexpected response format',
          severity: 'warning'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setToast({
        open: true,
        message: error.data?.message || 'Failed to submit inspection form',
        severity: 'error'
      });
    }
  };

  // Reset form fields
  const resetForm = () => {
    setSiteName('');
    setDateOfInspection('');
    setCheckedByName('');
    setSignature(null);
    setExtinguishers([{
      extinguisher_no: '',
      extinguisher_type: 'Dry Powder',
      weight: 0,
      location: '',
      seal_intact: true,
      pressure_in_gauge: 'Normal',
      tube_nozzle: 'Good',
      painting_condition: 'Good',
      refilling_date: '',
      due_date_refilling: '',
      due_date_hydro_test: '',
      access: 'Clear',
      remarks: ''
    }]);
    
    // Reset errors
    setErrors({
      siteName: false,
      dateOfInspection: false,
      checkedByName: false,
      signature: false,
      extinguishers: [{}]
    });
  };

  // Handle dialog close
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle className="bg-[#F2EDED]">
          <Typography variant="h6" className="text-[#29346B] font-semibold">Add New Fire Extinguisher Inspection</Typography>
        </DialogTitle>
      
      <DialogContent className="p-6">
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Main Inspection Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom className="text-[#29346B] font-medium">
              Inspection Details
            </Typography>
            <Paper elevation={1} sx={{ p: 2 }} className="border border-gray-200 rounded-md">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Site Name"
                    fullWidth
                    required
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="bg-white"
                    error={errors.siteName}
                    helperText={errors.siteName ? 'Site name is required' : ''}
                    sx={commonInputStyles}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Inspection"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={dateOfInspection}
                    onChange={(e) => setDateOfInspection(e.target.value)}
                    className="bg-white"
                    error={errors.dateOfInspection}
                    helperText={errors.dateOfInspection ? 'Date of inspection is required' : ''}
                    sx={commonInputStyles}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Checked By (Name)"
                    fullWidth
                    required
                    value={checkedByName}
                    onChange={(e) => setCheckedByName(e.target.value)}
                    className="bg-white"
                    error={errors.checkedByName}
                    helperText={errors.checkedByName ? 'Checked by name is required' : ''}
                    sx={commonInputStyles}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color={errors.signature ? "error" : "text.secondary"} 
                      gutterBottom
                    >
                      Signature (Upload File) *
                      {errors.signature && <span style={{ marginLeft: '8px' }}>Signature is required</span>}
                    </Typography>
                    <input
                      accept="image/*,.pdf,.docx"
                      id="signature-upload"
                      type="file"
                      onChange={handleSignatureChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="signature-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        className="border-[#29346B] text-[#29346B] hover:bg-[#29346B10]"
                      >
                        Upload Signature
                      </Button>
                    </label>
                    {signature && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        File: {signature.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Extinguishers Section */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" className="text-[#29346B] font-medium">Fire Extinguisher Details</Typography>
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                className="bg-[#FF8C00] hover:bg-[#FF8C00DD] text-white font-medium"
                onClick={addExtinguisher}
              >
                Add Extinguisher
              </Button>
            </Box>
            
            {extinguishers.map((extinguisher, index) => (
              <Paper 
                key={index} 
                elevation={1} 
                sx={{ p: 2, mb: 2, position: 'relative' }}
                className="border border-gray-200 rounded-md"
              >
                <IconButton 
                  size="small" 
                  color="error" 
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => removeExtinguisher(index)}
                  disabled={extinguishers.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
                
                <Typography variant="subtitle2" gutterBottom className="text-[#29346B] font-medium">
                  Extinguisher #{index + 1}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Extinguisher Number"
                      fullWidth
                      required
                      value={extinguisher.extinguisher_no}
                      onChange={(e) => handleExtinguisherChange(index, 'extinguisher_no', e.target.value)}
                      className="bg-white"
                      error={errors.extinguishers[index]?.extinguisher_no}
                      helperText={errors.extinguishers[index]?.extinguisher_no ? 'Extinguisher number is required' : ''}
                      sx={commonInputStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="bg-white">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={extinguisher.extinguisher_type}
                        label="Type"
                        sx={commonInputStyles}
                        onChange={(e) => handleExtinguisherChange(index, 'extinguisher_type', e.target.value)}
                      >
                        {extinguisherTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      fullWidth
                      value={extinguisher.weight}
                      onChange={(e) => handleExtinguisherChange(index, 'weight', parseInt(e.target.value))}
                      className="bg-white"
                      sx={commonInputStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Location"
                      fullWidth
                      required
                      value={extinguisher.location}
                      onChange={(e) => handleExtinguisherChange(index, 'location', e.target.value)}
                      className="bg-white"
                      error={errors.extinguishers[index]?.location}
                      helperText={errors.extinguishers[index]?.location ? 'Location is required' : ''}
                      sx={commonInputStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={extinguisher.seal_intact}
                          onChange={(e) => handleExtinguisherChange(index, 'seal_intact', e.target.checked)}
                        />
                      }
                      label="Seal Intact"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="bg-white">
                      <InputLabel>Pressure in Gauge</InputLabel>
                      <Select
                        value={extinguisher.pressure_in_gauge}
                        sx={commonInputStyles}
                        label="Pressure in Gauge"
                        onChange={(e) => handleExtinguisherChange(index, 'pressure_in_gauge', e.target.value)}
                      >
                        {pressureOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="bg-white">
                      <InputLabel>Tube/Nozzle</InputLabel>
                      <Select
                        value={extinguisher.tube_nozzle}
                        label="Tube/Nozzle"
                        sx={commonInputStyles}
                        onChange={(e) => handleExtinguisherChange(index, 'tube_nozzle', e.target.value)}
                      >
                        {conditionOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="bg-white">
                      <InputLabel>Painting Condition</InputLabel>
                      <Select
                        value={extinguisher.painting_condition}
                        sx={commonInputStyles}
                        label="Painting Condition"
                        onChange={(e) => handleExtinguisherChange(index, 'painting_condition', e.target.value)}
                      >
                        {conditionOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="bg-white">
                      <InputLabel>Access</InputLabel>
                      <Select
                        value={extinguisher.access}
                        sx={commonInputStyles}
                        label="Access"
                        onChange={(e) => handleExtinguisherChange(index, 'access', e.target.value)}
                      >
                        {accessOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Refilling Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={extinguisher.refilling_date}
                      sx={commonInputStyles}
                      onChange={(e) => handleExtinguisherChange(index, 'refilling_date', e.target.value)}
                      className="bg-white"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Due Date (Refilling)"
                      sx={commonInputStyles}
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={extinguisher.due_date_refilling}
                      onChange={(e) => handleExtinguisherChange(index, 'due_date_refilling', e.target.value)}
                      className="bg-white"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Due Date (Hydro Test)"
                      sx={commonInputStyles}
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={extinguisher.due_date_hydro_test}
                      onChange={(e) => handleExtinguisherChange(index, 'due_date_hydro_test', e.target.value)}
                      className="bg-white"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Remarks"
                      sx={commonInputStyles}
                      fullWidth
                      multiline
                      rows={2}
                      value={extinguisher.remarks}
                      onChange={(e) => handleExtinguisherChange(index, 'remarks', e.target.value)}
                      className="bg-white"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }} className="border-t border-gray-200">
        <Button onClick={handleClose} color="inherit" className="text-gray-700 font-medium">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          className="bg-[#FF8C00] hover:bg-[#FF8C00DD] text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
    
    {/* Toast notification */}
    <Snackbar 
      open={toast.open} 
      autoHideDuration={6000} 
      onClose={handleToastClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleToastClose} 
        severity={toast.severity} 
        sx={{ width: '100%' }}
        variant="filled"
      >
        {toast.message}
      </Alert>
    </Snackbar>
    </>
  );
};

export default FireExtinguisherInspectionDialog;