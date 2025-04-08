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
import { useCreateMockDrillReportMutation } from "../../../../api/hse/mockdrill/mockDrillApi";

export default function MockDrillDialog({ open, setOpen }) {
  // Basic Information
  const [site, setSite] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyScenario, setEmergencyScenario] = useState("");
  const [mockDrillType, setMockDrillType] = useState("");

  const [createMockDrillReport, { isLoading }] = useCreateMockDrillReportMutation();
  
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
  
  // State for actual file objects (for FormData)
  const [signatureFiles, setSignatureFiles] = useState({
    teamLeader: null,
    performanceOMControl: null,
    trafficEvacuation: null,
    rescueFirstAid: null,
    teamMembers: [null]
  });
  
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

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      if (teamLeader.signature && teamLeader.signature.startsWith("blob:")) {
        URL.revokeObjectURL(teamLeader.signature);
      }
      if (performanceOMControl.signature && performanceOMControl.signature.startsWith("blob:")) {
        URL.revokeObjectURL(performanceOMControl.signature);
      }
      if (trafficEvacuation.signature && trafficEvacuation.signature.startsWith("blob:")) {
        URL.revokeObjectURL(trafficEvacuation.signature);
      }
      if (rescueFirstAid.signature && rescueFirstAid.signature.startsWith("blob:")) {
        URL.revokeObjectURL(rescueFirstAid.signature);
      }
      
      teamMembers.forEach(member => {
        if (member.signature && member.signature.startsWith("blob:")) {
          URL.revokeObjectURL(member.signature);
        }
      });
    };
  }, [teamLeader, performanceOMControl, trafficEvacuation, rescueFirstAid, teamMembers]);

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

  // Signature upload handlers using FormData approach
  const handleSignatureUpload = (setter, currentValue, role, e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for display
      const objectUrl = URL.createObjectURL(file);
      
      // Update the signature preview
      setter({ ...currentValue, signature: objectUrl });
      
      // Store the actual file for FormData
      setSignatureFiles(prev => ({
        ...prev,
        [role]: file
      }));
    }
  };
  
  const handleTeamMemberSignatureUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for display
      const objectUrl = URL.createObjectURL(file);
      
      // Update the signature preview
      const newTeamMembers = [...teamMembers];
      newTeamMembers[index].signature = objectUrl;
      setTeamMembers(newTeamMembers);
      
      // Store the actual file for FormData
      setSignatureFiles(prev => {
        const newTeamMemberFiles = [...prev.teamMembers];
        newTeamMemberFiles[index] = file;
        return {
          ...prev,
          teamMembers: newTeamMemberFiles
        };
      });
    }
  };
  
  // Team members handlers
  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", signature: null }]);
    // Also update the signature files array
    setSignatureFiles(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, null]
    }));
  };
  
  const handleRemoveTeamMember = (index) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
    
    // Also update the signature files array
    setSignatureFiles(prev => {
      const newTeamMemberFiles = [...prev.teamMembers];
      newTeamMemberFiles.splice(index, 1);
      return {
        ...prev,
        teamMembers: newTeamMemberFiles
      };
    });
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    // Create FormData object
    const formData = new FormData();
    
    // Append basic text fields
    formData.append("site_plant_name", site);
    formData.append("location", location);
    formData.append("emergncy_scenario_mock_drill", emergencyScenario);
    formData.append("type_of_mock_drill", mockDrillType.toLowerCase());
    formData.append("mock_drill_date", drillDate);
    formData.append("mock_drill_time", startTime);
    formData.append("completed_time", completedTime);
    formData.append("overall_time", responseTime);
    
    // Append team leader information
    formData.append("teamLeaderName", teamLeader.name);
    formData.append("performanceOMControlName", performanceOMControl.name);
    formData.append("trafficEvacuationName", trafficEvacuation.name);
    formData.append("rescueFirstAidName", rescueFirstAid.name);
    
    // Append table top records
    formData.append("scenarioConductedRemarks", tableTopScenarioRemarks);
    formData.append("requiredParticipationRemarks", requiredParticipationRemarks);
    formData.append("observersParticipationRemarks", observersParticipationRemarks);
    
    // Append control mitigation measures as a string
    formData.append("controlMitigationMeasures", controlMitigationMeasures);
    
    // Append head count information as JSON
    formData.append("peoplePresent", JSON.stringify(peoplePresent));
    formData.append("actualParticipants", JSON.stringify(actualParticipants));
    formData.append("notParticipated", JSON.stringify(notParticipated));
    
    // Append ratings as JSON
    formData.append("ratings", JSON.stringify(ratings));
    formData.append("overallRating", overallRating);
    
    // Append observations
    formData.append("observations", observations);
    
    // Append recommendations as JSON
    formData.append("recommendations", JSON.stringify(recommendations));
    
    // Append signature files with role-specific names
    if (signatureFiles.teamLeader) {
      formData.append("teamLeaderSignature", signatureFiles.teamLeader);
    }
    if (signatureFiles.performanceOMControl) {
      formData.append("performanceOMControlSignature", signatureFiles.performanceOMControl);
    }
    if (signatureFiles.trafficEvacuation) {
      formData.append("trafficEvacuationSignature", signatureFiles.trafficEvacuation);
    }
    if (signatureFiles.rescueFirstAid) {
      formData.append("rescueFirstAidSignature", signatureFiles.rescueFirstAid);
    }
    
    // Create a team members data structure
    // Note: We can't include the actual File objects in JSON, so we'll reference them by index
    const teamMembersData = teamMembers.map((member, index) => ({
      name: member.name,
      signatureIndex: index // This associates the name with the signature file index
    }));
    
    // Add team members data as JSON
    formData.append("teamMembers", JSON.stringify(teamMembersData));
    
    // Add the signature files separately
    signatureFiles.teamMembers.forEach((file, index) => {
      if (file) {
        formData.append(`teamMemberSignature_${index}`, file);
      }
    });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/annexures_module/create_mock_drill_report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
          // No Content-Type header for FormData
        },
        body: formData // Your FormData object
      });
      
      console.log("Form Data Entries:");
      for (let [key, value] of formData.entries()) {
        // Check if the value is a File object
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      toast.success("Mock drill data submitted successfully!");
      setOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
  
  //   // Create FormData object
  //   const formData = new FormData();
    
  //   // Append basic text fields
  //   formData.append("site_plant_name", site);
  //   formData.append("location", location);
  //   formData.append("emergncy_scenario_mock_drill", emergencyScenario);
  //   formData.append("type_of_mock_drill", mockDrillType.toLowerCase());
  //   formData.append("mock_drill_date", drillDate);
  //   formData.append("mock_drill_time", startTime);
  //   formData.append("completed_time", completedTime);
  //   formData.append("overall_time", responseTime);
    
  //   // Append team leader information
  //   formData.append("teamLeaderName", teamLeader.name);
  //   formData.append("performanceOMControlName", performanceOMControl.name);
  //   formData.append("trafficEvacuationName", trafficEvacuation.name);
  //   formData.append("rescueFirstAidName", rescueFirstAid.name);
    
  //   // Append team members information
  //   teamMembers.forEach((member, index) => {
  //     formData.append(`teamMemberName_${index}`, member.name);
  //   });
    
  //   // Append table top records
  //   formData.append("scenarioConductedRemarks", tableTopScenarioRemarks);
  //   formData.append("requiredParticipationRemarks", requiredParticipationRemarks);
  //   formData.append("observersParticipationRemarks", observersParticipationRemarks);
    
  //   // Append control mitigation measures as a string
  //   formData.append("controlMitigationMeasures", controlMitigationMeasures);
    
  //   // Append head count information - flattened objects
  //   formData.append("peoplePresent_kpiEmployee", peoplePresent.kpiEmployee);
  //   formData.append("peoplePresent_contractorEmployee", peoplePresent.contractorEmployee);
  //   formData.append("peoplePresent_visitorsExternalAgencies", peoplePresent.visitorsExternalAgencies);
  //   formData.append("peoplePresent_remarks", peoplePresent.remarks);
    
  //   formData.append("actualParticipants_kpiEmployee", actualParticipants.kpiEmployee);
  //   formData.append("actualParticipants_contractorEmployee", actualParticipants.contractorEmployee);
  //   formData.append("actualParticipants_visitorsExternalAgencies", actualParticipants.visitorsExternalAgencies);
  //   formData.append("actualParticipants_remarks", actualParticipants.remarks);
    
  //   formData.append("notParticipated_kpiEmployee", notParticipated.kpiEmployee);
  //   formData.append("notParticipated_contractorEmployee", notParticipated.contractorEmployee);
  //   formData.append("notParticipated_visitorsExternalAgencies", notParticipated.visitorsExternalAgencies);
  //   formData.append("notParticipated_remarks", notParticipated.remarks);
    
  //   // Append ratings
  //   Object.entries(ratings).forEach(([key, value]) => {
  //     formData.append(`rating_${key}`, value);
  //   });
  //   formData.append("overallRating", overallRating);
    
  //   // Append observations
  //   formData.append("observations", observations);
    
  //   // Append recommendations - flattened array of objects
  //   recommendations.forEach((rec, index) => {
  //     formData.append(`recommendation_${index}`, rec.recommendation);
  //     formData.append(`recommendation_responsibility_${index}`, rec.responsibility);
  //     formData.append(`recommendation_targetDate_${index}`, rec.targetDate);
  //     formData.append(`recommendation_status_${index}`, rec.status);
  //     formData.append(`recommendation_actionRemarks_${index}`, rec.actionRemarks);
  //   });
    
  //   // Append signature files with role-specific names
  //   if (signatureFiles.teamLeader) {
  //     formData.append("teamLeaderSignature", signatureFiles.teamLeader);
  //   }
  //   if (signatureFiles.performanceOMControl) {
  //     formData.append("performanceOMControlSignature", signatureFiles.performanceOMControl);
  //   }
  //   if (signatureFiles.trafficEvacuation) {
  //     formData.append("trafficEvacuationSignature", signatureFiles.trafficEvacuation);
  //   }
  //   if (signatureFiles.rescueFirstAid) {
  //     formData.append("rescueFirstAidSignature", signatureFiles.rescueFirstAid);
  //   }
    
  //   // Append team member signatures
  //   signatureFiles.teamMembers.forEach((file, index) => {
  //     if (file) {
  //       formData.append(`teamMemberSignature_${index}`, file);
  //     }
  //   });
    
  //   try {
  //     // Example of how you would submit the form data
  //     // const response = await fetch('https://your-api-endpoint.com/mock-drill', {
  //     //   method: 'POST',
  //     //   body: formData,
  //     //   // No need to set Content-Type header, browser sets it automatically with boundary
  //     // });
      
  //     // if (response.ok) {
  //     //   toast.success("Mock drill data submitted successfully!");
  //     //   setOpen(false);
  //     // } else {
  //     //   toast.error("Failed to submit mock drill data");
  //     // }
      
  //     // For now, just log the formData and close the dialog
  //     // const response = await createMockDrillReport(formData).unwrap();
  //     const response = await fetch(`${import.meta.env.VITE_API_KEY}/annexures_module/create_mock_drill_report`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
  //         // No Content-Type header for FormData
  //       },
  //       body: formData // Your FormData object
  //     });
  //     // console.log(response)
  //     console.log("Form Data Entries:");
  //     for (let [key, value] of formData.entries()) {
  //       // Check if the value is a File object
  //       if (value instanceof File) {
  //         console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
  //       } else {
  //         console.log(`${key}: ${value}`);
  //       }
  //     }
      
  //     toast.success("Mock drill data submitted successfully!");
  //     setOpen(false);
  //   } catch (error) {
  //     toast.error(`Error: ${error.message}`);
  //   }
  // };
  // const handleSubmit = async () => {
  //   if (!validateForm()) return;

  //   // Create FormData object
  //   const formData = new FormData();
    
  //   // Append basic text fields
  //   // formData.append("site", site);
  //   // formData.append("location", location);
  //   // formData.append("emergencyScenario", emergencyScenario);
  //   // formData.append("mockDrillType", mockDrillType);
  //   // formData.append("drillDate", drillDate);
  //   // formData.append("startTime", startTime);
  //   // formData.append("completedTime", completedTime);
  //   // formData.append("responseTime", responseTime);
  //   formData.append("site_plant_name", site);
  //   formData.append("location", location);
  //   formData.append("emergncy_scenario_mock_drill", emergencyScenario);
  //   formData.append("type_of_mock_drill", mockDrillType.toLowerCase());
  //   formData.append("mock_drill_date", drillDate);
  //   formData.append("mock_drill_time", startTime);
  //   formData.append("completed_time", completedTime);
  //   formData.append("overall_time", responseTime);
    
  //   // Append signature files with role-specific names
  //   if (signatureFiles.teamLeader) {
  //     formData.append("teamLeaderSignature", signatureFiles.teamLeader);
  //   }
  //   if (signatureFiles.performanceOMControl) {
  //     formData.append("performanceOMControlSignature", signatureFiles.performanceOMControl);
  //   }
  //   if (signatureFiles.trafficEvacuation) {
  //     formData.append("trafficEvacuationSignature", signatureFiles.trafficEvacuation);
  //   }
  //   if (signatureFiles.rescueFirstAid) {
  //     formData.append("rescueFirstAidSignature", signatureFiles.rescueFirstAid);
  //   }
    
  //   // Append team member signatures
  //   signatureFiles.teamMembers.forEach((file, index) => {
  //     if (file) {
  //       formData.append(`teamMemberSignature_${index}`, file);
  //     }
  //   });
    
  //   // Create JSON data for all the other form fields
  //   const jsonData = {
  //     teamLeaderName: teamLeader.name,
  //     performanceOMControlName: performanceOMControl.name,
  //     trafficEvacuationName: trafficEvacuation.name,
  //     rescueFirstAidName: rescueFirstAid.name,
      
  //     teamMembers: teamMembers.map(member => ({ name: member.name })),
      
  //     tableTopRecords: {
  //       scenarioConductedRemarks: tableTopScenarioRemarks,
  //       requiredParticipationRemarks: requiredParticipationRemarks,
  //       observersParticipationRemarks: observersParticipationRemarks
  //     },
      
  //     controlMitigationMeasures,
      
  //     headCountAtAssemblyPoint: {
  //       peoplePresent,
  //       actualParticipants,
  //       notParticipated
  //     },
      
  //     emergencyTeamRating: ratings,
  //     overallRating,
  //     observations,
  //     recommendations
  //   };
    
  //   // Append JSON data
  //   formData.append("formData", JSON.stringify(jsonData));
    
  //   try {
  //     // Example of how you would submit the form data
  //     // const response = await fetch('https://your-api-endpoint.com/mock-drill', {
  //     //   method: 'POST',
  //     //   body: formData,
  //     //   // No need to set Content-Type header, browser sets it automatically with boundary
  //     // });
      
  //     // if (response.ok) {
  //     //   toast.success("Mock drill data submitted successfully!");
  //     //   setOpen(false);
  //     // } else {
  //     //   toast.error("Failed to submit mock drill data");
  //     // }
      
  //     // For now, just log the formData and close the dialog
  //     // console.log("FormData created with files");
  //     console.log("Form Data Entries:");
  //     for (let [key, value] of formData.entries()) {
  //       // Check if the value is a File object
  //       if (value instanceof File) {
  //         console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
  //       } else {
  //         console.log(`${key}: ${value}`);
  //       }
  //     }
      
  //     toast.success("Mock drill data submitted successfully!");
  //     setOpen(false);
  //   } catch (error) {
  //     toast.error(`Error: ${error.message}`);
  //   }
  // };
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
                  onChange={(e) => handleSignatureUpload(setTeamLeader, teamLeader, "teamLeader", e)}
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
                  onChange={(e) => handleSignatureUpload(setPerformanceOMControl, performanceOMControl, "performanceOMControl", e)}
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
                  onChange={(e) => handleSignatureUpload(setTrafficEvacuation, trafficEvacuation, "trafficEvacuation", e)}
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
                  onChange={(e) => handleSignatureUpload(setRescueFirstAid, rescueFirstAid, "rescueFirstAid", e)}
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