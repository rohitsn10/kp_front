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
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  IconButton,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateRfiInspectionOutcomeMutation } from '../../../api/quality/qualityApi';
import { useGetMainProjectsQuery } from '../../../api/users/projectApi';

function RfiOutcomeForm({ open, handleClose, rfiData, projectId }) {
  // RTK mutation hook
  const [createRfiInspectionOutcome, { isLoading }] = useCreateRfiInspectionOutcomeMutation();
  const { data: projects } = useGetMainProjectsQuery();
  
  // State to track if project is IPP
  const [isIppProject, setIsIppProject] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    offeredTime: '',
    siteReachingTime: '',
    inspectionStartTime: '',
    inspectionEndTime: '',
    disposition: '',
    observations: [{ text: '' }],
    actions: '',
    responsibility: '',
    timelines: '',
    remarks: ''
  });

  // Check project type when project data loads
  useEffect(() => {
    if (projects?.data && projectId) {
      const currentProject = projects.data.find(project => project.id === parseInt(projectId));
      if (currentProject) {
        setIsIppProject(currentProject.cpp_or_ipp === 'ipp');
      }
    }
  }, [projects, projectId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle observation changes
  const handleObservationChange = (index, value) => {
    const updatedObservations = [...formData.observations];
    updatedObservations[index].text = value;
    
    setFormData({
      ...formData,
      observations: updatedObservations
    });
  };

  // Add new observation field
  const addObservation = () => {
    setFormData({
      ...formData,
      observations: [...formData.observations, { text: '' }]
    });
  };

  // Remove observation field
  const removeObservation = (index) => {
    if (formData.observations.length > 1) {
      const updatedObservations = formData.observations.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        observations: updatedObservations
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Extract observation texts into an array format as requested
      const observationArray = formData.observations.map(obs => obs.text).filter(text => text.trim() !== '');
      
      // Prepare data for API
      const inspectionData = {
        project_id: projectId,
        rfi_id: rfiData?.id,
        observation: observationArray,
        disposition_status: formData.disposition,
        actions: formData.actions,
        responsibility: formData.responsibility,
        timelines: formData.timelines,
        remarks: formData.remarks
      };

      // Only add time fields if project is not IPP
      if (!isIppProject) {
        inspectionData.offered_time = formData.offeredTime;
        inspectionData.reaching_time = formData.siteReachingTime;
        inspectionData.inspection_start_time = formData.inspectionStartTime;
        inspectionData.inspection_end_time = formData.inspectionEndTime;
      } else {
        // For IPP projects, explicitly set time fields to null
        inspectionData.offered_time = null;
        inspectionData.reaching_time = null;
        inspectionData.inspection_start_time = null;
        inspectionData.inspection_end_time = null;
      }
      
      console.log('Sending inspection outcome data:', inspectionData);
      
      // Call RTK mutation hook
      const response = await createRfiInspectionOutcome(inspectionData).unwrap();
      console.log('Inspection outcome created successfully:', response);
      
      // Close dialog
      handleClose();
    } catch (error) {
      console.error('Failed to create inspection outcome:', error);
      // You might want to add error handling UI here
    }
  };

  if (!rfiData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
        Add Inspection Outcome - {rfiData?.rfi_number || ''}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {/* RFI Info Summary */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="subtitle1" fontWeight="bold">RFI Details:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">RFI Number: {rfiData?.rfi_number}</Typography>
              <Typography variant="body2">Project Type: {isIppProject ? 'IPP' : 'CPP'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">EPC: {rfiData?.epc_name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Location: {rfiData?.location_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Activity: {rfiData?.rfi_activity}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Classification: {rfiData?.rfi_classification}</Typography>
            </Grid>
          </Grid>
        </Paper>
        
        <Grid container spacing={2}>
          {/* Time fields - only show if not IPP project */}
          {!isIppProject && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
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
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
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
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
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
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
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
                />
              </Grid>
            </>
          )}
          
          {/* Disposition */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="disposition-label">Disposition/Status</InputLabel>
              <Select
                labelId="disposition-label"
                name="disposition"
                value={formData.disposition}  
                label="Disposition/Status"
                onChange={handleInputChange}
              >
                <MenuItem value="Released">Released</MenuItem>
                <MenuItem value="Sort">Sort</MenuItem>
                <MenuItem value="Rework">Rework</MenuItem>
                <MenuItem value="Use-As-Is/Deviate">Use-As-Is/Deviate</MenuItem>
                <MenuItem value="Reject">Reject</MenuItem>
                <MenuItem value="Hold">Hold</MenuItem>
                <MenuItem value="Approved with comments">Approved with comments</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Observations Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Observations</Typography>
            
            {formData.observations.map((observation, index) => (
              <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label={`Observation ${index + 1}`}
                    value={observation.text}
                    onChange={(e) => handleObservationChange(index, e.target.value)}
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    color="error" 
                    onClick={() => removeObservation(index)}
                    disabled={formData.observations.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            
            <Button 
              startIcon={<AddIcon />} 
              onClick={addObservation}
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
            >
              Add Observation
            </Button>
          </Grid>
          
          {/* Modified Fields with Increased Text Space */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Actions"
              name="actions"
              value={formData.actions}
              onChange={handleInputChange}
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Responsibility"
              name="responsibility"
              value={formData.responsibility}
              onChange={handleInputChange}
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Timelines"
              name="timelines"
              value={formData.timelines}
              onChange={handleInputChange}
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          sx={{ color: "#29346B" }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: "#10B981", // Green
            "&:hover": { bgcolor: "#059669" }
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Submitting...' : 'Submit Outcome'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RfiOutcomeForm;