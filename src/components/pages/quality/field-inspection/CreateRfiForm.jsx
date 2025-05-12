import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Snackbar,
  Alert,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { useCreateRfiMutation } from '../../../../api/quality/qualityApi';
import { useGetMainProjectsQuery } from '../../../../api/users/projectApi';

function CreateRfiForm({ open, handleClose, projectId, category,onSuccess }) {
  // RTK Query mutation hook
  const [createRfi, { isLoading }] = useCreateRfiMutation();
  
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const { data: projects } = useGetMainProjectsQuery();
  
  // Check if project is IPP
  const [isIppProject, setIsIppProject] = useState(false);
  
  // Find the current project based on projectId
  useEffect(() => {
    if (projects?.data && projectId) {
      const currentProject = projects.data.find(project => project.id === parseInt(projectId));
      if (currentProject) {
        setIsIppProject(currentProject.cpp_or_ipp === 'ipp');
      }
    }
  }, [projects, projectId]);

  // Validation state
  const [errors, setErrors] = useState({
    clientInitials: '',
    companyInitials: '',
    department: '',
    rfiSequence: '',
    classification: '',
    otherClassification: '',
    epcName: '',
    offeredDate: '',
    blockNumber: '',
    tableNo: '',
    activityDescription: '',
    buildingLocationName: '',
    constructionActivity: '',
    offeredTime: '',
    siteReachingTime: '',
    inspectionStartTime: '',
    inspectionEndTime: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    clientInitials: '',
    companyInitials: 'KPGL',
    department: 'ELE',
    rfiSequence: '',
    classification: 'table_work',
    otherClassification: '',
    epcName: '',
    offeredDate: '',
    blockNumber: '',
    tableNo: '',
    activityDescription: '',
    holdDetails: '',
    buildingLocationName: '',
    constructionActivity: '',
    offeredTime: '',
    siteReachingTime: '',
    inspectionStartTime: '',
    inspectionEndTime: ''
  });

  // Computed RFI number from component parts
  const [generatedRfiNumber, setGeneratedRfiNumber] = useState('');

  // Generate RFI number when component parts change
  useEffect(() => {
    const { clientInitials, companyInitials, department, rfiSequence } = formData;
    if (clientInitials && companyInitials && department && rfiSequence) {
      const rfiNumber = `${clientInitials}/${companyInitials}/${department}/RFI-${rfiSequence.padStart(2, '0')}`;
      setGeneratedRfiNumber(rfiNumber);
    } else {
      setGeneratedRfiNumber('');
    }
  }, [formData.clientInitials, formData.companyInitials, formData.department, formData.rfiSequence]);

  // Validate form fields
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'clientInitials':
        if (!value.trim()) {
          errorMessage = 'Client initials are required';
        }
        break;
      case 'companyInitials':
        if (!value.trim()) {
          errorMessage = 'Company initials are required';
        }
        break;
      case 'department':
        if (!value.trim()) {
          errorMessage = 'Department is required';
        }
        break;
      case 'rfiSequence':
        if (!value.trim()) {
          errorMessage = 'RFI sequence number is required';
        } else if (!/^\d+$/.test(value)) {
          errorMessage = 'Sequence number should only contain digits';
        }
        break;
      case 'otherClassification':
        if (formData.classification === 'other' && !value.trim()) {
          errorMessage = 'Please specify classification';
        }
        break;
      case 'epcName':
        if (!value.trim()) {
          errorMessage = 'EPC Name is required';
        }
        break;
      case 'offeredDate':
        if (!value) {
          errorMessage = 'Offered Date is required';
        }
        break;
      case 'blockNumber':
        if (!value.trim()) {
          errorMessage = 'Block Number is required';
        }
        break;
      case 'tableNo':
        if (!value.trim()) {
          errorMessage = 'Table Number is required';
        }
        break;
      case 'activityDescription':
        if (!value.trim()) {
          errorMessage = 'Activity Description is required';
        }
        break;
      case 'buildingLocationName':
        if (!value.trim()) {
          errorMessage = 'Location Name is required';
        }
        break;
      case 'constructionActivity':
        if (!value.trim()) {
          errorMessage = 'Construction Activity is required';
        }
        break;
      // Time fields validation for IPP projects
      case 'offeredTime':
      case 'siteReachingTime':
      case 'inspectionStartTime':
      case 'inspectionEndTime':
        if (isIppProject && !value.trim()) {
          errorMessage = 'This field is required';
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field and update errors
    const errorMessage = validateField(name, value);
    setErrors({
      ...errors,
      [name]: errorMessage
    });
    
    if (name === 'classification' && value !== 'other') {
      setErrors({
        ...errors,
        [name]: errorMessage,
        otherClassification: ''
      });
    }
  };

  // Close alert
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(formData).forEach(field => {
      // Skip holdDetails as it's optional
      if (field === 'holdDetails') return;
      
      // Skip otherClassification if classification is not 'other'
      if (field === 'otherClassification' && formData.classification !== 'other') return;
      
      // Skip time fields if not IPP project
      if (!isIppProject && ['offeredTime', 'siteReachingTime', 'inspectionStartTime', 'inspectionEndTime'].includes(field)) return;
      
      const errorMessage = validateField(field, formData[field]);
      newErrors[field] = errorMessage;
      
      if (errorMessage) {
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage('Please fix the errors in the form before submitting.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    try {
      // Map form data to API expected format
      const apiData = {
        project_id: parseInt(projectId),
        rfi_activity: category,
        rfi_number: generatedRfiNumber,
        rfi_classification: formData.classification === 'other' ? 'Other' : 
                         formData.classification === 'table_work' ? 'Table Work' : 'Buildings',
        rfi_other: formData.otherClassification,
        epc_name: formData.epcName,
        offered_date: formData.offeredDate,
        block_number: formData.blockNumber,
        table_number: formData.tableNo,
        activity_description: formData.activityDescription,
        hold_details: formData.holdDetails || 'N/A',
        location_name: formData.buildingLocationName,
        construction_activity: formData.constructionActivity
      };

      // Add time fields if IPP project
      if (isIppProject) {
        apiData.offered_time = formData.offeredTime;
        apiData.reaching_time = formData.siteReachingTime;
        apiData.inspection_start_time = formData.inspectionStartTime;
        apiData.inspection_end_time = formData.inspectionEndTime;
      }

      // Call the mutation
      const response = await createRfi(apiData).unwrap();
      
      // Show success message
      setAlertMessage('RFI created successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
      onSuccess();
      // Reset form and close dialog
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating RFI:', error);
      
      // Show error message
      setAlertMessage('Failed to create RFI. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
          Create New RFI - {category.charAt(0).toUpperCase() + category.slice(1)}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Project ID (disabled, just for display) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project ID"
                value={projectId}
                disabled
                variant="outlined"
              />
            </Grid>
            
            {/* Project Type (disabled, just for display) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Type"
                value={isIppProject ? "IPP" : "CPP"}
                disabled
                variant="outlined"
              />
            </Grid>
            
            {/* RFI Number Components */}
            <Grid item xs={12}>
              <FormLabel component="legend" sx={{ mb: 1 }}>RFI Number Details *</FormLabel>
              <Grid container spacing={2}>
                {/* Client Initials */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    label="Client Initials"
                    name="clientInitials"
                    value={formData.clientInitials}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.clientInitials}
                    helperText={errors.clientInitials}
                  />
                </Grid>
                
                {/* Company Initials */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    label="Company Initials"
                    name="companyInitials"
                    value={formData.companyInitials}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.companyInitials}
                    helperText={errors.companyInitials}
                  />
                </Grid>
                
                {/* Department */}
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required error={!!errors.department}>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                      labelId="department-label"
                      name="department"
                      value={formData.department}
                      label="Department"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="ELE">ELE (Electrical)</MenuItem>
                      <MenuItem value="MEC">MEC (Mechanical)</MenuItem>
                      <MenuItem value="CIV">CIV (Civil)</MenuItem>
                    </Select>
                    {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                {/* RFI Sequence Number */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    label="Sequence No."
                    name="rfiSequence"
                    value={formData.rfiSequence}
                    onChange={handleInputChange}
                    variant="outlined"
                    placeholder="1"
                    error={!!errors.rfiSequence}
                    helperText={errors.rfiSequence || "Numbers only (e.g. 1, 2)"}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Generated RFI Number Display */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Generated RFI Number"
                value={generatedRfiNumber}
                disabled
                variant="outlined"
                sx={{ 
                  "& .MuiInputBase-input.Mui-disabled": { 
                    WebkitTextFillColor: "#000",
                    fontSize: "1rem", 
                    fontWeight: "bold" 
                  } 
                }}
              />
            </Grid>
            
            {/* Classification */}
            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.classification}>
                <FormLabel component="legend">Classification *</FormLabel>
                <RadioGroup
                  row
                  name="classification"
                  value={formData.classification}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="table_work" control={<Radio />} label="Table Work" />
                  <FormControlLabel value="buildings" control={<Radio />} label="Buildings" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
                {errors.classification && <FormHelperText error>{errors.classification}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Other Classification text field (only shown if "Other" is selected) */}
            {formData.classification === 'other' && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Please specify"
                  name="otherClassification"
                  value={formData.otherClassification}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={!!errors.otherClassification}
                  helperText={errors.otherClassification}
                />
              </Grid>
            )}
            
            {/* EPC Name */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="EPC Name"
                name="epcName"
                value={formData.epcName}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.epcName}
                helperText={errors.epcName}
              />
            </Grid>
            
            {/* Offered Date - using regular TextField with type="date" */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Offered Date"
                type="date"
                name="offeredDate"
                value={formData.offeredDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                error={!!errors.offeredDate}
                helperText={errors.offeredDate}
              />
            </Grid>
            
            {/* Time fields for IPP projects */}
            {isIppProject && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Offered Time"
                    type="time"
                    name="offeredTime"
                    value={formData.offeredTime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    variant="outlined"
                    error={!!errors.offeredTime}
                    helperText={errors.offeredTime}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Site Reaching Time"
                    type="time"
                    name="siteReachingTime"
                    value={formData.siteReachingTime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    variant="outlined"
                    error={!!errors.siteReachingTime}
                    helperText={errors.siteReachingTime}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Inspection Start Time"
                    type="time"
                    name="inspectionStartTime"
                    value={formData.inspectionStartTime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    variant="outlined"
                    error={!!errors.inspectionStartTime}
                    helperText={errors.inspectionStartTime}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Inspection End Time"
                    type="time"
                    name="inspectionEndTime"
                    value={formData.inspectionEndTime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    variant="outlined"
                    error={!!errors.inspectionEndTime}
                    helperText={errors.inspectionEndTime}
                  />
                </Grid>
              </>
            )}
            
            {/* Block Number */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Block Number"
                name="blockNumber"
                value={formData.blockNumber}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.blockNumber}
                helperText={errors.blockNumber}
              />
            </Grid>
            
            {/* Table No */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Table No"
                name="tableNo"
                value={formData.tableNo}
                onChange={handleInputChange}
                variant="outlined"
                error={!!errors.tableNo}
                helperText={errors.tableNo}
              />
            </Grid>
            
            {/* Activity Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Activity Description"
                name="activityDescription"
                value={formData.activityDescription}
                onChange={handleInputChange}
                multiline
                rows={2}
                variant="outlined"
                error={!!errors.activityDescription}
                helperText={errors.activityDescription}
              />
            </Grid>
            
            {/* Hold Details - Increased rows for more text input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hold Details (If any)"
                name="holdDetails"
                value={formData.holdDetails}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            
            {/* Building Location Name */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Building Location Name"
                name="buildingLocationName"
                value={formData.buildingLocationName}
                onChange={handleInputChange}
                multiline
                rows={3}
                variant="outlined"
                error={!!errors.buildingLocationName}
                helperText={errors.buildingLocationName}
              />
            </Grid>
            
            {/* Construction Activity */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Construction Activity"
                name="constructionActivity"
                value={formData.constructionActivity}
                onChange={handleInputChange}
                multiline
                rows={3}
                variant="outlined"
                error={!!errors.constructionActivity}
                helperText={errors.constructionActivity}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{ color: "#29346B" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: "#FACC15",
              color: "#29346B",
              "&:hover": { bgcolor: "#e5b812" }
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit RFI'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert for success/error messages */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateRfiForm;