import React, { useState, useEffect } from "react";
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
  MenuItem,
  FormControl,
  Select,
  Avatar,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useCreateMockDrillReportMutation } from "../../../../api/hse/mockdrill/mockDrillApi";
import { useParams } from "react-router-dom";

export default function MockDrillDialog({ open, setOpen,onSuccess }) {
  const { locationId } = useParams();
  const [createMockDrillReport, { isLoading }] = useCreateMockDrillReportMutation();
  
  // Basic Information
  const [sitePlantName, setSitePlantName] = useState("");
  const [location, setLocation] = useState(locationId || "");
  const [emergencyScenario, setEmergencyScenario] = useState("");
  const [typeOfMockDrill, setTypeOfMockDrill] = useState("");
  
  // Mock Drill Conducted
  const [mockDrillDate, setMockDrillDate] = useState("");
  const [mockDrillTime, setMockDrillTime] = useState("");
  const [completedTime, setCompletedTime] = useState("");
  const [overallTime, setOverallTime] = useState("");
  
  // Drill details
  const [teamLeaderIncidentController, setTeamLeaderIncidentController] = useState("");
  const [performance, setPerformance] = useState("");
  const [trafficOrEvacuation, setTrafficOrEvacuation] = useState("");
  const [ambulanceFirstAidPpeRescue, setAmbulanceFirstAidPpeRescue] = useState("");
  
  // Images for drill details
  const [teamLeaderImage, setTeamLeaderImage] = useState(null);
  const [performanceImage, setPerformanceImage] = useState(null);
  const [trafficImage, setTrafficImage] = useState(null);
  const [ambulanceImage, setAmbulanceImage] = useState(null);
  
  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    { name: "", image: null }
  ]);
  
  // Description of Control Mitigation Measures
  const [descriptionOfControl, setDescriptionOfControl] = useState("");
  
  // Head Count at Assembly Point
  const [kpiEmployee, setKpiEmployee] = useState(0);
  const [contractorEmployee, setContractorEmployee] = useState(0);
  const [visitorAngies, setVisitorAngies] = useState(0);
  const [headCountRemarks, setHeadCountRemarks] = useState("");
  
  // Actual participants
  const [actualKpiEmployee, setActualKpiEmployee] = useState(0);
  const [actualContractorEmployee, setActualContractorEmployee] = useState(0);
  const [actualVisitorAngies, setActualVisitorAngies] = useState(0);
  const [actualRemarks, setActualRemarks] = useState("");
  
  // Not participated
  const [notParticipatedKpi, setNotParticipatedKpi] = useState(0);
  const [notParticipatedContractor, setNotParticipatedContractor] = useState(0);
  const [notParticipatedVisitor, setNotParticipatedVisitor] = useState(0);
  const [notParticipatedRemarks, setNotParticipatedRemarks] = useState("");
  
  // Table Top Records
  // const [tableTopRecords, setTableTopRecords] = useState({});
  const [tableTopRecords, setTableTopRecords] = useState("");
  // Ratings
  const [ratingOfEmergencyTeamMembers, setRatingOfEmergencyTeamMembers] = useState("");
  // const [ratingOfEmergencyTeamMembers, setRatingOfEmergencyTeamMembers] = useState([]);
  const [overallRating, setOverallRating] = useState("");
  
  // Observations and Recommendations
  const [observation, setObservation] = useState("");
  const [recommendations, setRecommendations] = useState({
    short_term: [""],
    long_term: [""]
  });

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

  // File handling functions
  const handleFileChange = (setter, e) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleTeamMemberFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const newTeamMembers = [...teamMembers];
      newTeamMembers[index].image = e.target.files[0];
      setTeamMembers(newTeamMembers);
    }
  };
  
  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      // Cleanup created object URLs when component unmounts
      if (teamLeaderImage) URL.revokeObjectURL(URL.createObjectURL(teamLeaderImage));
      if (performanceImage) URL.revokeObjectURL(URL.createObjectURL(performanceImage));
      if (trafficImage) URL.revokeObjectURL(URL.createObjectURL(trafficImage));
      if (ambulanceImage) URL.revokeObjectURL(URL.createObjectURL(ambulanceImage));
      
      teamMembers.forEach(member => {
        if (member.image) URL.revokeObjectURL(URL.createObjectURL(member.image));
      });
    };
  }, [teamLeaderImage, performanceImage, trafficImage, ambulanceImage, teamMembers]);
  
  // Team members handlers
  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", image: null }]);
  };
  
  const handleRemoveTeamMember = (index) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
  };
  
  const handleTeamMemberNameChange = (index, value) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index].name = value;
    setTeamMembers(newTeamMembers);
  };
  
  // Recommendations handlers
  const handleShortTermRecommendationChange = (index, value) => {
    const newRecommendations = {...recommendations};
    newRecommendations.short_term[index] = value;
    setRecommendations(newRecommendations);
  };
  
  const handleLongTermRecommendationChange = (index, value) => {
    const newRecommendations = {...recommendations};
    newRecommendations.long_term[index] = value;
    setRecommendations(newRecommendations);
  };
  
  const handleAddShortTermRecommendation = () => {
    const newRecommendations = {...recommendations};
    newRecommendations.short_term.push("");
    setRecommendations(newRecommendations);
  };
  
  const handleAddLongTermRecommendation = () => {
    const newRecommendations = {...recommendations};
    newRecommendations.long_term.push("");
    setRecommendations(newRecommendations);
  };
  
  const handleRemoveShortTermRecommendation = (index) => {
    const newRecommendations = {...recommendations};
    newRecommendations.short_term.splice(index, 1);
    setRecommendations(newRecommendations);
  };
  
  const handleRemoveLongTermRecommendation = (index) => {
    const newRecommendations = {...recommendations};
    newRecommendations.long_term.splice(index, 1);
    setRecommendations(newRecommendations);
  };

  // Validation function
  const validateForm = () => {
    if (!sitePlantName.trim()) return toast.error("Site plant name is required!");
    // if (!location.trim()) return toast.error("Location is required!");
    if (!emergencyScenario.trim()) return toast.error("Emergency scenario is required!");
    if (!typeOfMockDrill) return toast.error("Mock drill type is required!");
    if (!mockDrillDate) return toast.error("Drill date is required!");
    if (!mockDrillTime) return toast.error("Mock drill time is required!");
    if (!completedTime) return toast.error("Completed time is required!");
    if (!overallTime) return toast.error("Overall time is required!");
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    // Create FormData object
    const formData = new FormData();
    
    // Append basic text fields
    formData.append("site_plant_name", sitePlantName);
    formData.append("location", locationId);
    formData.append("emergncy_scenario_mock_drill", emergencyScenario);
    formData.append("type_of_mock_drill", typeOfMockDrill);
    formData.append("mock_drill_date", mockDrillDate);
    formData.append("mock_drill_time", mockDrillTime);
    formData.append("completed_time", completedTime);
    formData.append("overall_time", overallTime);
    
    // Append drill details
    formData.append("team_leader_incident_controller", teamLeaderIncidentController);
    formData.append("performance", performance);
    formData.append("traffic_or_evacuation", trafficOrEvacuation);
    formData.append("ambulance_first_aid_ppe_rescue", ambulanceFirstAidPpeRescue);
    
    // Append drill detail images
    if (teamLeaderImage) {
      formData.append("team_leader_incident_controller_image", teamLeaderImage);
    }
    if (performanceImage) {
      formData.append("performance_image", performanceImage);
    }
    if (trafficImage) {
      formData.append("traffic_or_evacuation_image", trafficImage);
    }
    if (ambulanceImage) {
      formData.append("ambulance_first_aid_ppe_rescue_image", ambulanceImage);
    }
    
    // Append team members
    teamMembers.forEach((member, index) => {
      if (member.name) {
        formData.append(`team_member_name_${index}`, member.name);
      }
      if (member.image) {
        formData.append(`team_member_image_${index}`, member.image);
      }
    });
    
    // Append table top records as JSON
    // formData.append("table_top_records", JSON.stringify(tableTopRecords));
    try {
      const parsedTableTopRecords = tableTopRecords ? JSON.parse(tableTopRecords) : {};
      formData.append("table_top_records", JSON.stringify(parsedTableTopRecords));
    } catch (error) {
      formData.append("table_top_records", JSON.stringify({}));
    }
    // Append description of control
    formData.append("description_of_control", descriptionOfControl);
    
    // Append head count information
    formData.append("no_of_kpi_employee", kpiEmployee);
    formData.append("no_of_contractor_employee", contractorEmployee);
    formData.append("no_of_visitor_angies", visitorAngies);
    formData.append("head_count_remarks", headCountRemarks);
    
    // Append actual participants
    formData.append("no_of_kpi_employee", actualKpiEmployee);
    formData.append("no_of_contractor_employee", actualContractorEmployee);
    formData.append("no_of_visitor_angies", actualVisitorAngies);
    formData.append("actual_remarks", actualRemarks);
    
    // Append not participated
    formData.append("not_participated_kpi", notParticipatedKpi);
    formData.append("not_participated_contractor", notParticipatedContractor);
    formData.append("not_participated_visitor", notParticipatedVisitor);
    formData.append("not_participated_remarks", notParticipatedRemarks);
    
    // Append ratings as JSON
    // formData.append("rating_of_emergency_team_members", JSON.stringify(ratingOfEmergencyTeamMembers));
    try {
      const parsedRatings = ratingOfEmergencyTeamMembers ? JSON.parse(ratingOfEmergencyTeamMembers) : [];
      formData.append("rating_of_emergency_team_members", JSON.stringify(parsedRatings));
    } catch (error) {
      formData.append("rating_of_emergency_team_members", JSON.stringify([]));
    }
    formData.append("overall_rating", overallRating);
    formData.append("overall_rating", overallRating);
    
    // Append observation
    formData.append("observation", observation);
    
    // Append recommendations as JSON
    formData.append("recommendations", JSON.stringify(recommendations));
    
    try {
      // Use the RTK mutation hook to submit the form
      const response = await createMockDrillReport(formData).unwrap();
      
      if (response.status) {
        toast.success(response.message || "Mock drill report created successfully!");
        onSuccess();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to create mock drill report");
      }
    } catch (error) {
      toast.error(`Error: ${error.message || "An unexpected error occurred"}`);
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Mock Drill Report Form
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
              Site Plant Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site Plant Name"
              value={sitePlantName}
              sx={commonInputStyles}
              onChange={(e) => setSitePlantName(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Location ID<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Location ID"
              value={location}
              sx={commonInputStyles}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid> */}

          {/* Emergency Scenario */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Emergency Scenario Mock Drill<span className="text-red-600"> *</span>
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
              Type of Mock Drill<span className="text-red-600"> *</span>
            </label>
            <FormControl fullWidth sx={commonInputStyles}>
              <Select
                value={typeOfMockDrill}
                onChange={(e) => setTypeOfMockDrill(e.target.value)}
              >
                <MenuItem value="table top drill">Table Top Drill</MenuItem>
                <MenuItem value="physical practice drill">Physical Practice Drill</MenuItem>
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
              value={mockDrillDate}
              sx={commonInputStyles}
              onChange={(e) => setMockDrillDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Mock Drill Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              type="time"
              variant="outlined"
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
              type="time"
              variant="outlined"
              value={completedTime}
              sx={commonInputStyles}
              onChange={(e) => setCompletedTime(e.target.value)}
            />
          </Grid>

          {/* Overall Time */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Overall Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              type="time"
              variant="outlined"
              value={overallTime}
              sx={commonInputStyles}
              onChange={(e) => setOverallTime(e.target.value)}
            />
          </Grid>

          {/* Drill Details Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Drill Details
            </Typography>
            <Divider />
          </Grid>

          {/* Team Leader/Incident Controller */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Leader/Incident Controller Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Team Leader/Incident Controller Name"
              value={teamLeaderIncidentController}
              sx={commonInputStyles}
              onChange={(e) => setTeamLeaderIncidentController(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Team Leader/Incident Controller Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleFileChange(setTeamLeaderImage, e)}
                />
              </Button>
              {teamLeaderImage && (
                <Avatar
                  src={teamLeaderImage ? URL.createObjectURL(teamLeaderImage) : ""}
                  alt="Team Leader Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Performance */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Performance Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Performance Name"
              value={performance}
              sx={commonInputStyles}
              onChange={(e) => setPerformance(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Performance Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleFileChange(setPerformanceImage, e)}
                />
              </Button>
              {performanceImage && (
                <Avatar
                  src={performanceImage ? URL.createObjectURL(performanceImage) : ""}
                  alt="Performance Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Traffic/Evacuation */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Traffic/Evacuation Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Traffic/Evacuation Name"
              value={trafficOrEvacuation}
              sx={commonInputStyles}
              onChange={(e) => setTrafficOrEvacuation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Traffic/Evacuation Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleFileChange(setTrafficImage, e)}
                />
              </Button>
              {trafficImage && (
                <Avatar
                  src={trafficImage ? URL.createObjectURL(trafficImage) : ""}
                  alt="Traffic/Evacuation Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Ambulance/First Aid/PPE/Rescue */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Ambulance/First Aid/PPE/Rescue Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Ambulance/First Aid/PPE/Rescue Name"
              value={ambulanceFirstAidPpeRescue}
              sx={commonInputStyles}
              onChange={(e) => setAmbulanceFirstAidPpeRescue(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Ambulance/First Aid/PPE/Rescue Signature<span className="text-red-600"> *</span>
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
                  onChange={(e) => handleFileChange(setAmbulanceImage, e)}
                />
              </Button>
              {ambulanceImage && (
                <Avatar
                  src={ambulanceImage ? URL.createObjectURL(ambulanceImage) : ""}
                  alt="Ambulance/First Aid Signature"
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
                      onChange={(e) => handleTeamMemberNameChange(index, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                      Signature<span className="text-red-600"> *</span>
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
                          onChange={(e) => handleTeamMemberFileChange(index, e)}
                        />
                      </Button>
                      {member.image && (
                        <Avatar
                          src={member.image ? URL.createObjectURL(member.image) : ""}
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

          {/* Table Top Records */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Table Top Records
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Table Top Records (JSON)"
              placeholder=''
              value={tableTopRecords}
              sx={commonInputStyles}
              onChange={(e) => setTableTopRecords(e.target.value)}
            />
          </Grid>

          {/* Description of Control */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Description of Control
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Enter description of control"
              value={descriptionOfControl}
              sx={commonInputStyles}
              onChange={(e) => setDescriptionOfControl(e.target.value)}
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
                    label="No. of KPI Employee"
                    type="number"
                    variant="outlined"
                    value={kpiEmployee}
                    onChange={(e) => setKpiEmployee(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of Contractor Employee"
                    type="number"
                    variant="outlined"
                    value={contractorEmployee}
                    onChange={(e) => setContractorEmployee(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of Visitor Angies"
                    type="number"
                    variant="outlined"
                    value={visitorAngies}
                    onChange={(e) => setVisitorAngies(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={headCountRemarks}
                    onChange={(e) => setHeadCountRemarks(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Actual Participants */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Actual Participants in Drill
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of KPI Employee"
                    type="number"
                    variant="outlined"
                    value={actualKpiEmployee}
                    onChange={(e) => setActualKpiEmployee(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of Contractor Employee"
                    type="number"
                    variant="outlined"
                    value={actualContractorEmployee}
                    onChange={(e) => setActualContractorEmployee(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of Visitor Angies"
                    type="number"
                    variant="outlined"
                    value={actualVisitorAngies}
                    onChange={(e) => setActualVisitorAngies(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={actualRemarks}
                    onChange={(e) => setActualRemarks(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Not Participated */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                People Not Participated in Drill
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of KPI Employee"
                    type="number"
                    variant="outlined"
                    value={notParticipatedKpi}
                    onChange={(e) => setNotParticipatedKpi(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of Contractor Employee"
                    type="number"
                    variant="outlined"
                    value={notParticipatedContractor}
                    onChange={(e) => setNotParticipatedContractor(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="No. of Visitor Angies"
                    type="number"
                    variant="outlined"
                    value={notParticipatedVisitor}
                    onChange={(e) => setNotParticipatedVisitor(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={notParticipatedRemarks}
                    onChange={(e) => setNotParticipatedRemarks(e.target.value)}
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
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Rating of Emergency Team Members (JSON array)"
              placeholder='[{"member":"John Doe","rating":4.5},{"member":"Jane Smith","rating":4.2}]'
              value={ratingOfEmergencyTeamMembers}
              sx={commonInputStyles}
              onChange={(e) => setRatingOfEmergencyTeamMembers(e.target.value)}
            />
          </Grid>

          {/* Overall Rating */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Overall Rating"
              placeholder="4.5"
              value={overallRating}
              sx={commonInputStyles}
              onChange={(e) => setOverallRating(e.target.value)}
            />
          </Grid>

          {/* Observations */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Observations
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter observations"
              value={observation}
              sx={commonInputStyles}
              onChange={(e) => setObservation(e.target.value)}
            />
          </Grid>

          {/* Recommendations Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Recommendations
            </Typography>
            <Divider />
          </Grid>

          {/* Short Term Recommendations */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Short Term Recommendations
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddShortTermRecommendation}
                  sx={{
                    backgroundColor: "#29346B",
                    "&:hover": {
                      backgroundColor: "#202a5a",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
              
              {recommendations.short_term.map((rec, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter short term recommendation"
                    value={rec}
                    onChange={(e) => handleShortTermRecommendationChange(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveShortTermRecommendation(index)}
                    disabled={recommendations.short_term.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Long Term Recommendations */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Long Term Recommendations
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddLongTermRecommendation}
                  sx={{
                    backgroundColor: "#29346B",
                    "&:hover": {
                      backgroundColor: "#202a5a",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
              
              {recommendations.long_term.map((rec, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter long term recommendation"
                    value={rec}
                    onChange={(e) => handleLongTermRecommendationChange(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveLongTermRecommendation(index)}
                    disabled={recommendations.long_term.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Paper>
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
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}