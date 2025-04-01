import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Grid,
  Box,
  Typography,
  Rating,
  Checkbox,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";

export default function MockDrillReportDialog({ open, setOpen }) {
  const [sitePlantName, setSitePlantName] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyScenario, setEmergencyScenario] = useState("");
  const [typeOfMockDrill, setTypeOfMockDrill] = useState("");
  const [mockDrillDate, setMockDrillDate] = useState("");
  const [mockDrillTime, setMockDrillTime] = useState("");
  const [completedTime, setCompletedTime] = useState("");
  const [overallTime, setOverallTime] = useState("");
  const [teamLeaderController, setTeamLeaderController] = useState("");
  const [performance, setPerformance] = useState("");
  const [trafficEvacuation, setTrafficEvacuation] = useState("");
  const [ambulanceFirstAid, setAmbulanceFirstAid] = useState("");
  const [teamMember1, setTeamMember1] = useState("");
  const [teamMember2, setTeamMember2] = useState("");
  const [tableTopActivity, setTableTopActivity] = useState("");
  const [tableTopRemarks, setTableTopRemarks] = useState("");
  const [controlDescription, setControlDescription] = useState("");
  const [expectedHeadCount, setExpectedHeadCount] = useState("");
  const [actualHeadCount, setActualHeadCount] = useState("");
  const [missingHeadCount, setMissingHeadCount] = useState("");
  const [teamLeaderRating, setTeamLeaderRating] = useState(0);
  const [teamMembersRating, setTeamMembersRating] = useState([]);
  const [overallRating, setOverallRating] = useState("");
  const [observation, setObservation] = useState("");
  const [improvements, setImprovements] = useState("");
  const [additionalTrainingNeeded, setAdditionalTrainingNeeded] = useState(false);

  const validateForm = () => {
    if (!sitePlantName.trim()) return toast.error("Site/Plant Name is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!emergencyScenario.trim()) return toast.error("Emergency Scenario is required!");
    if (!typeOfMockDrill.trim()) return toast.error("Type of Mock Drill is required!");
    if (!mockDrillDate.trim()) return toast.error("Mock Drill Date is required!");
    if (!mockDrillTime.trim()) return toast.error("Mock Drill Time is required!");
    if (!completedTime.trim()) return toast.error("Completed Time is required!");
    if (!teamLeaderController.trim()) return toast.error("Team Leader/Incident Controller is required!");

    return true;
  };

  const mockDrillTypes = [
    "Physical practice drill",
    "Tabletop exercise",
    "Full-scale simulation",
    "Functional drill"
  ];

  const performanceOptions = [
    "Excellent",
    "Good",
    "Satisfactory",
    "Needs improvement"
  ];

  const ratingOptions = [
    "Excellent",
    "Good",
    "Satisfactory",
    "Needs improvement",
    "Poor"
  ];

  const handleClose = () => setOpen(false);

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

    const formData = {
      site_plant_name: sitePlantName,
      location: location,
      emergncy_scenario_mock_drill: emergencyScenario,
      type_of_mock_drill: typeOfMockDrill,
      mock_drill_date: mockDrillDate,
      mock_drill_time: mockDrillTime,
      completed_time: completedTime,
      overall_time: overallTime,
      team_leader_incident_controller: teamLeaderController,
      performance: performance,
      traffic_or_evacuation: trafficEvacuation,
      ambulance_first_aid_ppe_rescue: ambulanceFirstAid,
      team_member1: teamMember1,
      team_member2: teamMember2,
      table_top_records: {
        activity: tableTopActivity.split(",").map(item => item.trim()),
        remarks: tableTopRemarks
      },
      description_of_control: controlDescription,
      head_count_at_assembly_point: {
        expected: parseInt(expectedHeadCount) || 0,
        actual: parseInt(actualHeadCount) || 0,
        missing: parseInt(missingHeadCount) || 0
      },
      rating_of_emergency_team_members: {
        team_leader: teamLeaderRating,
        team_members: teamMembersRating
      },
      overall_rating: overallRating,
      observation: observation,
      recommendations: {
        improvements: improvements.split(",").map(item => item.trim()),
        additional_training_needed: additionalTrainingNeeded
      }
    };

    console.log(formData);
    toast.success("Mock Drill Report submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Mock Drill Report
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Site/Plant Name & Location */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site/Plant Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site/Plant Name"
              value={sitePlantName}
              sx={commonInputStyles}
              onChange={(e) => setSitePlantName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Location<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Location"
              value={location}
              sx={commonInputStyles}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>

          {/* Emergency Scenario */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Emergency Scenario / Mock Drill<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Describe emergency scenario"
              value={emergencyScenario}
              sx={commonInputStyles}
              onChange={(e) => setEmergencyScenario(e.target.value)}
            />
          </Grid>

          {/* Type of Mock Drill (Radio Button) */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                className="text-[#29346B] text-lg font-semibold"
              >
                Type of Mock Drill<span className="text-red-600"> *</span>
              </FormLabel>
              <RadioGroup
                row
                value={typeOfMockDrill}
                onChange={(e) => setTypeOfMockDrill(e.target.value)}
              >
                {mockDrillTypes.map((type) => (
                  <FormControlLabel 
                    key={type} 
                    value={type.toLowerCase()} 
                    control={<Radio />} 
                    label={type} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Date and Time Section */}
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Drill Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={mockDrillDate}
              sx={commonInputStyles}
              onChange={(e) => setMockDrillDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Start Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="time"
              value={mockDrillTime}
              sx={commonInputStyles}
              onChange={(e) => setMockDrillTime(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Completed Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="time"
              value={completedTime}
              sx={commonInputStyles}
              onChange={(e) => setCompletedTime(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Overall Time
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="HH:MM:SS"
              value={overallTime}
              sx={commonInputStyles}
              onChange={(e) => setOverallTime(e.target.value)}
            />
          </Grid>

          {/* Team Members */}
          <Grid item xs={12}>
            <Divider textAlign="left">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Team Information
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Leader/Incident Controller<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter name of team leader"
              value={teamLeaderController}
              sx={commonInputStyles}
              onChange={(e) => setTeamLeaderController(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Member 1
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter name"
              value={teamMember1}
              sx={commonInputStyles}
              onChange={(e) => setTeamMember1(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Member 2
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter name"
              value={teamMember2}
              sx={commonInputStyles}
              onChange={(e) => setTeamMember2(e.target.value)}
            />
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12}>
            <Divider textAlign="left">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Performance & Details
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Performance
            </label>
            <TextField
              select
              fullWidth
              variant="outlined"
              value={performance}
              sx={commonInputStyles}
              onChange={(e) => setPerformance(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Performance</option>
              {performanceOptions.map((option) => (
                <option key={option} value={option.toLowerCase()}>{option}</option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Traffic/Evacuation
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Traffic or evacuation details"
              value={trafficEvacuation}
              sx={commonInputStyles}
              onChange={(e) => setTrafficEvacuation(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Ambulance/First Aid/PPE/Rescue
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="First aid details"
              value={ambulanceFirstAid}
              sx={commonInputStyles}
              onChange={(e) => setAmbulanceFirstAid(e.target.value)}
            />
          </Grid>

          {/* Table Top Records */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Table Top Activities
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter activities (comma separated)"
              value={tableTopActivity}
              sx={commonInputStyles}
              onChange={(e) => setTableTopActivity(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Table Top Remarks
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter remarks"
              value={tableTopRemarks}
              sx={commonInputStyles}
              onChange={(e) => setTableTopRemarks(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Description of Control
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Describe control measures taken"
              value={controlDescription}
              sx={commonInputStyles}
              onChange={(e) => setControlDescription(e.target.value)}
            />
          </Grid>

          {/* Head Count Section */}
          <Grid item xs={12}>
            <Divider textAlign="left">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Head Count at Assembly Point
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Expected
            </label>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Number of expected people"
              value={expectedHeadCount}
              sx={commonInputStyles}
              onChange={(e) => setExpectedHeadCount(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Actual
            </label>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Number of actual people"
              value={actualHeadCount}
              sx={commonInputStyles}
              onChange={(e) => setActualHeadCount(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Missing
            </label>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Number of missing people"
              value={missingHeadCount}
              sx={commonInputStyles}
              onChange={(e) => setMissingHeadCount(e.target.value)}
            />
          </Grid>

          {/* Rating Section */}
          <Grid item xs={12}>
            <Divider textAlign="left">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Rating & Evaluation
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Leader Rating
            </label>
            <Box display="flex" alignItems="center">
              <Rating
                value={teamLeaderRating}
                onChange={(e, newValue) => setTeamLeaderRating(newValue)}
                max={5}
              />
              <Box ml={2}>{teamLeaderRating} of 5</Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Overall Rating
            </label>
            <TextField
              select
              fullWidth
              variant="outlined"
              value={overallRating}
              sx={commonInputStyles}
              onChange={(e) => setOverallRating(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Rating</option>
              {ratingOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Observations
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter observations"
              value={observation}
              sx={commonInputStyles}
              onChange={(e) => setObservation(e.target.value)}
            />
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Recommended Improvements
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter recommendations (comma separated)"
              value={improvements}
              sx={commonInputStyles}
              onChange={(e) => setImprovements(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={additionalTrainingNeeded}
                  onChange={(e) => setAdditionalTrainingNeeded(e.target.checked)}
                />
              }
              label="Additional Training Needed"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
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