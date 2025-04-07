import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  Divider,
  IconButton,
  Paper,
  Box,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function MockDrillDialog({ open, setOpen }) {
  // Basic Information
  const [site, setSite] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyScenario, setEmergencyScenario] = useState("");
  const [mockDrillType, setMockDrillType] = useState("");
  
  // Mock Drill Conducted
  const [drillDate, setDrillDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [completedTime, setCompletedTime] = useState("");
  const [responseTime, setResponseTime] = useState("");
  
  // Drill Team Observer
  const [teamLeader, setTeamLeader] = useState({ name: "", signature: null });
  const [performanceOMControl, setPerformanceOMControl] = useState({ name: "", signature: null });
  const [trafficEvacuation, setTrafficEvacuation] = useState({ name: "", signature: null });
  const [rescueFirstAid, setRescueFirstAid] = useState({ name: "", signature: null });
  const [teamMembers, setTeamMembers] = useState([
    { name: "", signature: null }
  ]);
  
  // Table Top Records
  const [tableTopScenarioRemarks, setTableTopScenarioRemarks] = useState("");
  const [requiredParticipationRemarks, setRequiredParticipationRemarks] = useState("");
  const [observersParticipationRemarks, setObserversParticipationRemarks] = useState("");
  
  // Description of Control Mitigation Measures
  const [controlMitigationMeasures, setControlMitigationMeasures] = useState("");
  
  // Head Count at Assembly Point
  const [peoplePresent, setPeoplePresent] = useState({
    kpiEmployee: 0,
    contractorEmployee: 0,
    visitorsExternalAgencies: 0,
    remarks: ""
  });
  
  const [actualParticipants, setActualParticipants] = useState({
    kpiEmployee: 0,
    contractorEmployee: 0,
    visitorsExternalAgencies: 0,
    remarks: ""
  });
  
  const [notParticipated, setNotParticipated] = useState({
    kpiEmployee: 0,
    contractorEmployee: 0,
    visitorsExternalAgencies: 0,
    remarks: ""
  });
  
  // Ratings
  const [ratings, setRatings] = useState({
    operationProcessControl: "Good",
    performanceOMControl: "Good",
    firstAidAmbulanceTeam: "Good",
    trafficEvacuationAssembly: "Good",
    communicationDuringDrill: "Good",
    fireTeamResponse: "Good",
    rescueTeamResponse: "Good",
    other: "Good",
    otherDescription: ""
  });
  
  const [overallRating, setOverallRating] = useState("Good");
  const [observations, setObservations] = useState("");
  
  // Recommendations
  const [recommendations, setRecommendations] = useState([
    { recommendation: "", responsibility: "", targetDate: "", status: "", actionRemarks: "" }
  ]);

  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      transition: "border 0.2s ease-in-out",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15",
        borderBottom: "4px solid #FACC15",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15",
        borderWidth: "2px",
        borderBottom: "4px solid #FACC15",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
    },
  };

  const handleClose = () => setOpen(false);
  const ratingOptions = ["Good", "Very Good", "Excellent"];

  // Validation function
  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!emergencyScenario.trim()) return toast.error("Emergency scenario is required!");
    if (!mockDrillType) return toast.error("Mock drill type is required!");
    if (!drillDate) return toast.error("Drill date is required!");
    if (!startTime) return toast.error("Start time is required!");
    if (!completedTime) return toast.error("Completed time is required!");
    if (!responseTime) return toast.error("Response time is required!");
    
    // Validate team leader
    if (!teamLeader.name.trim()) return toast.error("Team Leader name is required!");
    if (!teamLeader.signature) return toast.error("Team Leader signature is required!");
    
    // Validate other roles
    if (!performanceOMControl.name.trim()) return toast.error("Performance O&M Control name is required!");
    if (!performanceOMControl.signature) return toast.error("Performance O&M Control signature is required!");
    
    if (!trafficEvacuation.name.trim()) return toast.error("Traffic/Evacuation name is required!");
    if (!trafficEvacuation.signature) return toast.error("Traffic/Evacuation signature is required!");
    
    if (!rescueFirstAid.name.trim()) return toast.error("Rescue/First Aid name is required!");
    if (!rescueFirstAid.signature) return toast.error("Rescue/First Aid signature is required!");
    
    // Validate team members
    for (let i = 0; i < teamMembers.length; i++) {
      if (!teamMembers[i].name.trim())
        return toast.error(`Team Member ${i + 1} name is required!`);
      if (!teamMembers[i].signature)
        return toast.error(`Team Member ${i + 1} signature is required!`);
    }
    
    // Validate recommendations
    for (let i = 0; i < recommendations.length; i++) {
      if (!recommendations[i].recommendation.trim())
        return toast.error(`Recommendation ${i + 1} is required!`);
      if (!recommendations[i].responsibility.trim())
        return toast.error(`Responsibility for recommendation ${i + 1} is required!`);
      if (!recommendations[i].targetDate.trim())
        return toast.error(`Target date for recommendation ${i + 1} is required!`);
      if (!recommendations[i].status.trim())
        return toast.error(`Status for recommendation ${i + 1} is required!`);
    }
    
    return true;
  };

  // Signature upload handlers
  const handleSignatureUpload = (setter, currentValue, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter({ ...currentValue, signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTeamMemberSignatureUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newTeamMembers = [...teamMembers];
        newTeamMembers[index].signature = reader.result;
        setTeamMembers(newTeamMembers);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Team members handlers
  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", signature: null }]);
  };
  
  const handleRemoveTeamMember = (index) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
  };
  
  const handleTeamMemberChange = (index, field, value) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index][field] = value;
    setTeamMembers(newTeamMembers);
  };
  
  // Recommendations handlers
  const handleAddRecommendation = () => {
    setRecommendations([
      ...recommendations,
      { recommendation: "", responsibility: "", targetDate: "", status: "", actionRemarks: "" }
    ]);
  };
  
  const handleRemoveRecommendation = (index) => {
    const newRecommendations = [...recommendations];
    newRecommendations.splice(index, 1);
    setRecommendations(newRecommendations);
  };
  
  const handleRecommendationChange = (index, field, value) => {
    const newRecommendations = [...recommendations];
    newRecommendations[index][field] = value;
    setRecommendations(newRecommendations);
  };
  
  // Head count handlers
  const handlePeoplePresentChange = (field, value) => {
    setPeoplePresent({ ...peoplePresent, [field]: value });
  };
  
  const handleActualParticipantsChange = (field, value) => {
    setActualParticipants({ ...actualParticipants, [field]: value });
  };
  
  const handleNotParticipatedChange = (field, value) => {
    setNotParticipated({ ...notParticipated, [field]: value });
  };
  
  // Rating handlers
  const handleRatingChange = (field, value) => {
    setRatings({ ...ratings, [field]: value });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      site,
      location,
      emergencyScenario,
      mockDrillType,
      mockDrillConducted: {
        date: drillDate,
        startTime,
        completedTime
      },
      overallResponseTime: responseTime,
      drillTeamObserver: {
        teamLeader: {
          name: teamLeader.name,
          signature: teamLeader.signature
        },
        performanceOMControl: {
          name: performanceOMControl.name,
          signature: performanceOMControl.signature
        },
        trafficEvacuation: {
          name: trafficEvacuation.name,
          signature: trafficEvacuation.signature
        },
        rescueFirstAid: {
          name: rescueFirstAid.name,
          signature: rescueFirstAid.signature
        },
        teamMembers: teamMembers.map(member => ({
          name: member.name,
          signature: member.signature
        }))
      },
      tableTopRecords: {
        scenarioConductedRemarks: tableTopScenarioRemarks,
        requiredParticipationRemarks: requiredParticipationRemarks,
        observersParticipationRemarks: observersParticipationRemarks
      },
      controlMitigationMeasures,
      headCountAtAssemblyPoint: {
        peoplePresent,
        actualParticipants,
        notParticipated
      },
      emergencyTeamRating: {
        operationProcessControl: ratings.operationProcessControl,
        performanceOMControl: ratings.performanceOMControl,
        firstAidAmbulanceTeam: ratings.firstAidAmbulanceTeam,
        trafficEvacuationAssembly: ratings.trafficEvacuationAssembly,
        communicationDuringDrill: ratings.communicationDuringDrill,
        fireTeamResponse: ratings.fireTeamResponse,
        rescueTeamResponse: ratings.rescueTeamResponse,
        other: ratings.other,
        otherDescription: ratings.otherDescription
      },
      overallRating,
      observations,
      recommendations
    };

    console.log(formData);
    toast.success("Mock drill data submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Mock Drill Form
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Basic Information
            </Typography>
            <Divider />
          </Grid>

          {/* Site & Location */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site Name"
              value={site}
              sx={commonInputStyles}
              onChange={(e) => setSite(e.target.value)}
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
              Emergency Scenario<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Emergency Scenario"
              value={emergencyScenario}
              sx={commonInputStyles}
              onChange={(e) => setEmergencyScenario(e.target.value)}
            />
          </Grid>

          {/* Drill Type */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Mock Drill Type<span className="text-red-600"> *</span>
            </label>
            <FormControl fullWidth sx={commonInputStyles}>
              <Select
                value={mockDrillType}
                onChange={(e) => setMockDrillType(e.target.value)}
              >
                <MenuItem value="Table top Drill">Table top Drill</MenuItem>
                <MenuItem value="Physical Practice Drill">Physical Practice Drill</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Mock Drill Conducted Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Mock Drill Conducted
            </Typography>
            <Divider />
          </Grid>

          {/* Date & Times */}
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              value={drillDate}
              sx={commonInputStyles}
              onChange={(e) => setDrillDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Start Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              type="time"
              variant="outlined"
              value={startTime}
              sx={commonInputStyles}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Completed Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              type="time"
              variant="outlined"
              value={completedTime}
              sx={commonInputStyles}
              onChange={(e) => setCompletedTime(e.target.value)}
            />
          </Grid>

          {/* Response Time */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Overall Response Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="HH:MM:SS"
              value={responseTime}
              sx={commonInputStyles}
              onChange={(e) => setResponseTime(e.target.value)}
            />
          </Grid>

          {/* Drill Team Observer Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Drill Team Observer
            </Typography>
            <Divider />
          </Grid>

          {/* Team Leader */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Leader/Incident Controller - Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Team Leader Name"
              value={teamLeader.name}
              sx={commonInputStyles}
              onChange={(e) => setTeamLeader({ ...teamLeader, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Leader/Incident Controller - Signature<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                  onChange={(e) => handleSignatureUpload(setTeamLeader, teamLeader, e)}
                />
              </Button>
              {teamLeader.signature && (
                <Avatar
                  src={teamLeader.signature}
                  alt="Team Leader Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Performance O&M */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Performance - O&M and Control - Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={performanceOMControl.name}
              sx={commonInputStyles}
              onChange={(e) => setPerformanceOMControl({ ...performanceOMControl, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Performance - O&M and Control - Signature<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                  onChange={(e) => handleSignatureUpload(setPerformanceOMControl, performanceOMControl, e)}
                />
              </Button>
              {performanceOMControl.signature && (
                <Avatar
                  src={performanceOMControl.signature}
                  alt="Performance O&M Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Traffic/Evacuation */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Traffic/Evacuation/Assembly Point & Head Count - Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={trafficEvacuation.name}
              sx={commonInputStyles}
              onChange={(e) => setTrafficEvacuation({ ...trafficEvacuation, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Traffic/Evacuation/Assembly Point & Head Count - Signature<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                  onChange={(e) => handleSignatureUpload(setTrafficEvacuation, trafficEvacuation, e)}
                />
              </Button>
              {trafficEvacuation.signature && (
                <Avatar
                  src={trafficEvacuation.signature}
                  alt="Traffic/Evacuation Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Rescue/First Aid */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Rescue/First Aid/Ambulance/PPE - Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={rescueFirstAid.name}
              sx={commonInputStyles}
              onChange={(e) => setRescueFirstAid({ ...rescueFirstAid, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Rescue/First Aid/Ambulance/PPE - Signature<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                  onChange={(e) => handleSignatureUpload(setRescueFirstAid, rescueFirstAid, e)}
                />
              </Button>
              {rescueFirstAid.signature && (
                <Avatar
                  src={rescueFirstAid.signature}
                  alt="Rescue/First Aid Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Team Members
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTeamMember}
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Add Team Member
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Team Member List */}
          <Grid item xs={12}>
            {teamMembers.map((member, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #e0e0e0",
                  position: "relative",
                }}
              >
                <IconButton
                  color="error"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleRemoveTeamMember(index)}
                  disabled={teamMembers.length === 1}
                >
                  <DeleteIcon />
                </IconButton>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Team Member {index + 1}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      value={member.name}
                      required
                      onChange={(e) =>
                        handleTeamMemberChange(index, "name", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        color="primary"
                      >
                        Upload Signature
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleTeamMemberSignatureUpload(index, e)}
                        />
                      </Button>
                      {member.signature && (
                        <Avatar
                          src={member.signature}
                          alt="Team Member Signature"
                          variant="rounded"
                          sx={{ width: 100, height: 56 }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>

          {/* Table Top Records Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Table Top Records
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Table top for the Scenario conducted - Remarks
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter remarks"
              value={tableTopScenarioRemarks}
              sx={commonInputStyles}
              onChange={(e) => setTableTopScenarioRemarks(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Required Participation in the table top ensured - Remarks
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter remarks"
              value={requiredParticipationRemarks}
              sx={commonInputStyles}
              onChange={(e) => setRequiredParticipationRemarks(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Observers Participation in the table top - Remarks
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter remarks"
              value={observersParticipationRemarks}
              sx={commonInputStyles}
              onChange={(e) => setObserversParticipationRemarks(e.target.value)}
            />
          </Grid>

          {/* Control Mitigation Measures */}
{/* Control Mitigation Measures */}
<Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Description of Control Mitigation Measures
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter control mitigation measures"
              value={controlMitigationMeasures}
              sx={commonInputStyles}
              onChange={(e) => setControlMitigationMeasures(e.target.value)}
            />
          </Grid>

          {/* Head Count at Assembly Point */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Head Count at Assembly Point
            </Typography>
            <Divider />
          </Grid>

          {/* People Present */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                People Present as per Record
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of KPI Employee"
                    type="number"
                    variant="outlined"
                    value={peoplePresent.kpiEmployee}
                    onChange={(e) => handlePeoplePresentChange("kpiEmployee", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of Contractor Employee"
                    type="number"
                    variant="outlined"
                    value={peoplePresent.contractorEmployee}
                    onChange={(e) => handlePeoplePresentChange("contractorEmployee", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of Visitors/External Agencies"
                    type="number"
                    variant="outlined"
                    value={peoplePresent.visitorsExternalAgencies}
                    onChange={(e) => handlePeoplePresentChange("visitorsExternalAgencies", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={peoplePresent.remarks}
                    onChange={(e) => handlePeoplePresentChange("remarks", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Actual Participants */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Actual Participants Participate in Drill
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of KPI Employee"
                    type="number"
                    variant="outlined"
                    value={actualParticipants.kpiEmployee}
                    onChange={(e) => handleActualParticipantsChange("kpiEmployee", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of Contractor Employee"
                    type="number"
                    variant="outlined"
                    value={actualParticipants.contractorEmployee}
                    onChange={(e) => handleActualParticipantsChange("contractorEmployee", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of Visitors/External Agencies"
                    type="number"
                    variant="outlined"
                    value={actualParticipants.visitorsExternalAgencies}
                    onChange={(e) => handleActualParticipantsChange("visitorsExternalAgencies", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={actualParticipants.remarks}
                    onChange={(e) => handleActualParticipantsChange("remarks", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Not Participated */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Nos. of people not participated in drill
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of KPI Employee"
                    type="number"
                    variant="outlined"
                    value={notParticipated.kpiEmployee}
                    onChange={(e) => handleNotParticipatedChange("kpiEmployee", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of Contractor Employee"
                    type="number"
                    variant="outlined"
                    value={notParticipated.contractorEmployee}
                    onChange={(e) => handleNotParticipatedChange("contractorEmployee", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nos. of Visitors/External Agencies"
                    type="number"
                    variant="outlined"
                    value={notParticipated.visitorsExternalAgencies}
                    onChange={(e) => handleNotParticipatedChange("visitorsExternalAgencies", parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={notParticipated.remarks}
                    onChange={(e) => handleNotParticipatedChange("remarks", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Rating of Emergency Team Members */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Rating of Emergency Team Members
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Operation & Process Control</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.operationProcessControl}
                      onChange={(e) => handleRatingChange("operationProcessControl", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Performance - O&M and Control</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.performanceOMControl}
                      onChange={(e) => handleRatingChange("performanceOMControl", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>First Aid/Ambulance Team Response</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.firstAidAmbulanceTeam}
                      onChange={(e) => handleRatingChange("firstAidAmbulanceTeam", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Traffic/Evacuation/Assembly Point & Head Count</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.trafficEvacuationAssembly}
                      onChange={(e) => handleRatingChange("trafficEvacuationAssembly", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Communication During Drill</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.communicationDuringDrill}
                      onChange={(e) => handleRatingChange("communicationDuringDrill", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Fire Fighting Team Response</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.fireTeamResponse}
                      onChange={(e) => handleRatingChange("fireTeamResponse", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Rescue Team Response</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.rescueTeamResponse}
                      onChange={(e) => handleRatingChange("rescueTeamResponse", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Other</FormLabel>
                    <RadioGroup
                      row
                      value={ratings.other}
                      onChange={(e) => handleRatingChange("other", e.target.value)}
                    >
                      {ratingOptions.map((option) => (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Other (specify)"
                    variant="outlined"
                    value={ratings.otherDescription}
                    onChange={(e) => handleRatingChange("otherDescription", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Overall Rating */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Overall Rating
            </label>
            <FormControl fullWidth sx={commonInputStyles}>
              <Select
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
              >
                {ratingOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Observations */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Observations
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter observations"
              value={observations}
              sx={commonInputStyles}
              onChange={(e) => setObservations(e.target.value)}
            />
          </Grid>

          {/* Recommendations Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Recommendations
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRecommendation}
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Add Recommendation
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Recommendations List */}
          <Grid item xs={12}>
            {recommendations.map((rec, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #e0e0e0",
                  position: "relative",
                }}
              >
                <IconButton
                  color="error"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleRemoveRecommendation(index)}
                  disabled={recommendations.length === 1}
                >
                  <DeleteIcon />
                </IconButton>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Recommendation {index + 1}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Recommendation"
                      variant="outlined"
                      value={rec.recommendation}
                      required
                      onChange={(e) =>
                        handleRecommendationChange(index, "recommendation", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Responsibility"
                      variant="outlined"
                      value={rec.responsibility}
                      required
                      onChange={(e) =>
                        handleRecommendationChange(index, "responsibility", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Target Date"
                      type="date"
                      variant="outlined"
                      value={rec.targetDate}
                      required
                      onChange={(e) =>
                        handleRecommendationChange(index, "targetDate", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={rec.status}
                        label="Status"
                        onChange={(e) =>
                          handleRecommendationChange(index, "status", e.target.value)
                        }
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Action Remarks"
                      variant="outlined"
                      value={rec.actionRemarks}
                      onChange={(e) =>
                        handleRecommendationChange(index, "actionRemarks", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
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
