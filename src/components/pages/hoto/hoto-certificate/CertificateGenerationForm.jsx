import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Grid,
  Divider,
  FormHelperText,
  IconButton,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGenerateHotoCertificateMutation } from '../../../../api/hoto/hotoApi';

const CertificateGenerationForm = ({ open, handleClose, projectId, onSuccess }) => {
  // Initialize form state
    const [generateHotoCertificate, { isLoading: isGenerating }] = useGenerateHotoCertificateMutation();
  const [formState, setFormState] = useState({
    plantName: '',
    plantCOD: '',
    issuedDate: '',
    listAttached: [],
    newListItem: '',
    
    // Design Section
    asBuiltDrawings: 'Available',
    pvsystReport: 'Available',
    dataSheet: 'Available',
    gadAndGtp: 'Available',
    
    // SCM Section
    warrantyCertificate: 'Available',
    sla: 'Available',
    manual: 'Available',
    escalationMatrix: 'Available',
    
    // Project Section
    factoryTestReport: 'Available',
    inspectionReport: 'Available',
    punchPointList: 'Available',
    onSiteTestReport: 'Available',
    
    // User Names
    projectManagerNameProjectTeam: '',
    siteInchargeHotoEngineerName: '',
    headOMName: '',
    siteInChargeName: '',
    epcTeamBEPL: '',
    projectManagerNameBEPL: '',
    seniorEngineerBEPL: ''
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for dropdowns
  const availabilityOptions = ['Available', 'Not Available', 'Not Applicable'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    
    if (errors.issuedDate) {
      setErrors({
        ...errors,
        issuedDate: null
      });
    }
  };

  // Handle adding item to list attached
  const handleAddListItem = () => {
    if (formState.newListItem.trim()) {
      setFormState({
        ...formState,
        listAttached: [...formState.listAttached, formState.newListItem.trim()],
        newListItem: ''
      });
    }
  };

  // Handle removing item from list attached
  const handleRemoveListItem = (index) => {
    const updatedList = [...formState.listAttached];
    updatedList.splice(index, 1);
    setFormState({
      ...formState,
      listAttached: updatedList
    });
  };

  // Handle form submission
const handleSubmit = async () => {
  // Validate form
  const newErrors = {};
  
  if (!formState.plantName.trim()) {
    newErrors.plantName = 'Plant Name is required';
  }
  
  if (!formState.plantCOD.trim()) {
    newErrors.plantCOD = 'Plant COD is required';
  }
  
  if (!formState.issuedDate) {
    newErrors.issuedDate = 'Issued Date is required';
  }
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Convert form data to the format needed by your API
    const certificateData = {
      project_id: projectId,
      plant_name: formState.plantName,
      plant_cod: formState.plantCOD,
      issued_date: formState.issuedDate,
      list_attached: formState.listAttached,
      
      // Added team names
      project_team_name: formState.projectTeamName,
      onm_team_name: formState.onmTeamName,
      epc_team_name: formState.epcTeamName,
      
      design_section: {
        as_built_drawings: formState.asBuiltDrawings,
        pvsyst_report: formState.pvsystReport,
        data_sheet: formState.dataSheet,
        gad_and_gtp: formState.gadAndGtp
      },
      
      scm_section: {
        warranty_certificate: formState.warrantyCertificate,
        sla: formState.sla,
        manual: formState.manual,
        escalation_matrix: formState.escalationMatrix
      },
      
      project_section: {
        factory_test_report: formState.factoryTestReport,
        inspection_report: formState.inspectionReport,
        punch_point_list: formState.punchPointList,
        on_site_test_report: formState.onSiteTestReport
      },
      
      user_names: {
        project_manager_name_project_team: formState.projectManagerNameProjectTeam,
        site_incharge_hoto_engineer_name: formState.siteInchargeHotoEngineerName,
        head_om_name: formState.headOMName,
        site_in_charge_name: formState.siteInChargeName,
        epc_team_bepl: formState.epcTeamBEPL,
        project_manager_name_bepl: formState.projectManagerNameBEPL,
        senior_engineer_bepl: formState.seniorEngineerBEPL
      }
    };
    
    // Call the RTK hook to generate the certificate
    const response = await generateHotoCertificate(certificateData).unwrap();
    
    console.log('Certificate response:', response);
    
    // Check if status is true
    if (response.status) {
      // Show success message
      console.log('Certificate generated successfully');
      
      // Open PDF in a new tab/window
      if (response.data) {
        window.open(response.data, '_blank');
      }
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(response);
      }
      
      // Close the form
      handleClose();
    } else {
      // Handle false status
      throw new Error(response.message || 'Failed to generate certificate');
    }
    
  } catch (error) {
    console.error('Error generating certificate:', error);
    // Handle API error
    setErrors({
      ...errors,
      submit: error.message || 'Failed to generate certificate. Please try again.'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog 
      open={open} 
      onClose={isSubmitting ? undefined : handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Generate HOTO Certificate
          </Typography>
          {!isSubmitting && (
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Plant Name"
                name="plantName"
                value={formState.plantName}
                onChange={handleInputChange}
                error={!!errors.plantName}
                helperText={errors.plantName}
                disabled={isSubmitting}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Plant COD"
                name="plantCOD"
                value={formState.plantCOD}
                onChange={handleInputChange}
                error={!!errors.plantCOD}
                helperText={errors.plantCOD}
                disabled={isSubmitting}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issued Date"
                name="issuedDate"
                type="date"
                value={formState.issuedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.issuedDate}
                helperText={errors.issuedDate}
                disabled={isSubmitting}
                required
              />
            </Grid>
            
            {/* List Attached */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                List Attached
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  fullWidth
                  label="Add Document"
                  name="newListItem"
                  value={formState.newListItem}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddListItem}
                  disabled={!formState.newListItem.trim() || isSubmitting}
                  sx={{ ml: 1, minWidth: '40px', height: '40px' }}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {formState.listAttached.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveListItem(index)}
                    color="primary"
                    disabled={isSubmitting}
                  />
                ))}
                {formState.listAttached.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No documents added to the list.
                  </Typography>
                )}
              </Box>
            </Grid>
            
            {/* Design Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Design Section
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>As-Built Drawings</InputLabel>
                <Select
                  name="asBuiltDrawings"
                  value={formState.asBuiltDrawings}
                  onChange={handleInputChange}
                  label="As-Built Drawings"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>PVsyst Report</InputLabel>
                <Select
                  name="pvsystReport"
                  value={formState.pvsystReport}
                  onChange={handleInputChange}
                  label="PVsyst Report"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Data Sheet</InputLabel>
                <Select
                  name="dataSheet"
                  value={formState.dataSheet}
                  onChange={handleInputChange}
                  label="Data Sheet"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>GAD and GTP</InputLabel>
                <Select
                  name="gadAndGtp"
                  value={formState.gadAndGtp}
                  onChange={handleInputChange}
                  label="GAD and GTP"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* SCM Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                SCM Section
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Warranty Certificate</InputLabel>
                <Select
                  name="warrantyCertificate"
                  value={formState.warrantyCertificate}
                  onChange={handleInputChange}
                  label="Warranty Certificate"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>SLA</InputLabel>
                <Select
                  name="sla"
                  value={formState.sla}
                  onChange={handleInputChange}
                  label="SLA"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Manual</InputLabel>
                <Select
                  name="manual"
                  value={formState.manual}
                  onChange={handleInputChange}
                  label="Manual"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Escalation Matrix</InputLabel>
                <Select
                  name="escalationMatrix"
                  value={formState.escalationMatrix}
                  onChange={handleInputChange}
                  label="Escalation Matrix"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Project Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Project Section
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Factory Test Report</InputLabel>
                <Select
                  name="factoryTestReport"
                  value={formState.factoryTestReport}
                  onChange={handleInputChange}
                  label="Factory Test Report"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Inspection Report</InputLabel>
                <Select
                  name="inspectionReport"
                  value={formState.inspectionReport}
                  onChange={handleInputChange}
                  label="Inspection Report"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Punch Point List</InputLabel>
                <Select
                  name="punchPointList"
                  value={formState.punchPointList}
                  onChange={handleInputChange}
                  label="Punch Point List"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>On Site Test Report</InputLabel>
                <Select
                  name="onSiteTestReport"
                  value={formState.onSiteTestReport}
                  onChange={handleInputChange}
                  label="On Site Test Report"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* User Names */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                User Names
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Manager Name - Project Team"
                name="projectManagerNameProjectTeam"
                value={formState.projectManagerNameProjectTeam}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Incharge/HOTO Engineer Name - Project Team"
                name="siteInchargeHotoEngineerName"
                value={formState.siteInchargeHotoEngineerName}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Head O&M Name - O&M"
                name="headOMName"
                value={formState.headOMName}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site in Charge Name - O&M"
                name="siteInChargeName"
                value={formState.siteInChargeName}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="EPC Team"
                name="epcTeamBEPL"
                value={formState.epcTeamBEPL}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Manager Name"
                name="projectManagerNameBEPL"
                value={formState.projectManagerNameBEPL}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Senior Engineer"
                name="seniorEngineerBEPL"
                value={formState.seniorEngineerBEPL}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </Grid>
            
            {/* Error message */}
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error">{errors.submit}</Typography>
              </Grid>
            )}
          </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Generating...
            </>
          ) : 'Generate Certificate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateGenerationForm;