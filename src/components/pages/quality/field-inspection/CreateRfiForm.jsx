import React, { useState } from 'react';
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
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function CreateRfiForm({ open, handleClose, projectId, category }) {
  // Form state
  const [formData, setFormData] = useState({
    rfiNumber: '',
    classification: 'table_work',
    otherClassification: '',
    epcName: '',
    offeredDate: '',
    workActivityDetails: '',
    blockNumber: '',
    tableNo: '',
    activityDescription: '',
    holdDetails: '',
    buildingLocationName: '',
    constructionActivity: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form submitted with data:', { ...formData, projectId, category });
    // Here you would typically make an API call to save the data
    handleClose();
  };

  return (
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
          
          {/* RFI Number */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="RFI Number"
              name="rfiNumber"
              value={formData.rfiNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          {/* Classification */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Classification</FormLabel>
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
            </FormControl>
          </Grid>
          
          {/* Other Classification text field (only shown if "Other" is selected) */}
          {formData.classification === 'other' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Please specify"
                name="otherClassification"
                value={formData.otherClassification}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          )}
          
          {/* EPC Name */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="epc-name-label">EPC Name</InputLabel>
              <Select
                labelId="epc-name-label"
                name="epcName"
                value={formData.epcName}
                label="EPC Name"
                onChange={handleInputChange}
              >
                <MenuItem value="PowerGen Engineering">PowerGen Engineering</MenuItem>
                <MenuItem value="Industrial Systems Ltd">Industrial Systems Ltd</MenuItem>
                <MenuItem value="MechWorks Solutions">MechWorks Solutions</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Offered Date - using regular TextField with type="date" instead of DatePicker */}
          <Grid item xs={12} md={6}>
            <TextField
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
            />
          </Grid>
          
          {/* Details of Work Activity */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details of Work Activity"
              name="workActivityDetails"
              value={formData.workActivityDetails}
              onChange={handleInputChange}
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          
          {/* Block Number */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Block Number"
              name="blockNumber"
              value={formData.blockNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          {/* Table No */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Table No"
              name="tableNo"
              value={formData.tableNo}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          {/* Activity Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Activity Description"
              name="activityDescription"
              value={formData.activityDescription}
              onChange={handleInputChange}
              multiline
              rows={2}
              variant="outlined"
            />
          </Grid>
          
          {/* Hold Details */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hold Details (If any)"
              name="holdDetails"
              value={formData.holdDetails}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          {/* Building Location Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Building Location Name"
              name="buildingLocationName"
              value={formData.buildingLocationName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          {/* Construction Activity */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Construction Activity"
              name="constructionActivity"
              value={formData.constructionActivity}
              onChange={handleInputChange}
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
          sx={{
            bgcolor: "#FACC15",
            color: "#29346B",
            "&:hover": { bgcolor: "#e5b812" }
          }}
        >
          Submit RFI
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateRfiForm;