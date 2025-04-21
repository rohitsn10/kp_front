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
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Avatar,
  IconButton,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useCreateIncidentNearMissInvestigationMutation } from "../../../../api/hse/incidentNearmissInvestigation/incidentNearmissInvestigationApi";
import { useParams } from "react-router-dom";
// import { useCreateIncidentNearMissInvestigationMutation } from "../services/api"; // Adjust the import path as needed

export default function CreateIncidentNearMiss({ open, setOpen,onSuccess }) {
  const [createIncidentNearMiss, { isLoading }] = useCreateIncidentNearMissInvestigationMutation();
  const {locationId}=useParams();
  // State for all fields based on the curl request
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfOccurrence, setDateOfOccurrence] = useState("");
  const [dateOfReport, setDateOfReport] = useState("");
  const [category, setCategory] = useState("incident");
  const [description, setDescription] = useState("");
  const [investigationFindings, setInvestigationFindings] = useState("");
  const [physicalFactor, setPhysicalFactor] = useState("");
  const [humanFactor, setHumanFactor] = useState("");
  const [systemFactor, setSystemFactor] = useState("");

  // Multiple Recommendations
  const [recommendations, setRecommendations] = useState([
    {
      description: "",
      responsibility: "",
      targetDate: "",
      closeDate: "",
      id: Date.now()
    }
  ]);

  // Multiple Committee Members
  const [committeeMembers, setCommitteeMembers] = useState([
    {
      name: "",
      rank: "",
      signature: null,
      signatureFile: null, // Added to store the actual file object
      id: Date.now()
    }
  ]);

  const validateForm = () => {
    // Basic field validation
    if (!siteName.trim()) return toast.error("Site Name is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!dateOfOccurrence.trim()) return toast.error("Date of Occurrence is required!");
    if (!dateOfReport.trim()) return toast.error("Date of Report is required!");
    if (!category) return toast.error("Category is required!");
    if (!description.trim()) return toast.error("Description is required!");
    if (!investigationFindings.trim()) return toast.error("Investigation Findings are required!");
    if (!physicalFactor.trim()) return toast.error("Physical Factor is required!");
    if (!humanFactor.trim()) return toast.error("Human Factor is required!");
    if (!systemFactor.trim()) return toast.error("System Factor is required!");
    
    // Validate recommendations
    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      if (!rec.description.trim()) return toast.error(`Recommendation ${i+1} description is required!`);
      if (!rec.responsibility.trim()) return toast.error(`Recommendation ${i+1} responsibility is required!`);
      if (!rec.targetDate.trim()) return toast.error(`Recommendation ${i+1} target date is required!`);
    }
    
    // Validate committee members with enhanced signature checking
    for (let i = 0; i < committeeMembers.length; i++) {
      const member = committeeMembers[i];
      if (!member.name.trim()) return toast.error(`Committee Member ${i+1} name is required!`);
      if (!member.rank.trim()) return toast.error(`Committee Member ${i+1} rank is required!`);
      
      // Extra debug for signature files
      if (!member.signatureFile) {
        console.error(`Missing signature file for member ${i+1}: ${member.name}`);
        toast.error(`Committee Member ${i+1} signature is required!`);
        return false;
      } else {
        // Additional check to make sure the file is valid
        console.log(`Validating signature for member ${i+1}:`, 
          member.signatureFile.name, 
          member.signatureFile.type,
          member.signatureFile.size
        );
        
        // Check if it's a valid image file
        if (!member.signatureFile.type.startsWith('image/')) {
          toast.error(`Committee Member ${i+1} signature must be an image file!`);
          return false;
        }
      }
    }
  
    return true;
  };

  const handleClose = () => setOpen(false);

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

  // Handle recommendation actions
  const addRecommendation = () => {
    setRecommendations([
      ...recommendations,
      {
        description: "",
        responsibility: "",
        targetDate: "",
        closeDate: "",
        id: Date.now()
      }
    ]);
  };

  const removeRecommendation = (id) => {
    if (recommendations.length === 1) {
      toast.error("At least one recommendation is required!");
      return;
    }
    setRecommendations(recommendations.filter(rec => rec.id !== id));
  };

  const updateRecommendation = (id, field, value) => {
    setRecommendations(
      recommendations.map(rec => 
        rec.id === id ? { ...rec, [field]: value } : rec
      )
    );
  };

  // Handle committee member actions
  const addCommitteeMember = () => {
    setCommitteeMembers([
      ...committeeMembers,
      {
        name: "",
        rank: "",
        signature: null,
        signatureFile: null,
        id: Date.now()
      }
    ]);
  };

  const removeCommitteeMember = (id) => {
    if (committeeMembers.length === 1) {
      toast.error("At least one committee member is required!");
      return;
    }
    setCommitteeMembers(committeeMembers.filter(member => member.id !== id));
  };

  const updateCommitteeMember = (id, field, value) => {
    setCommitteeMembers(
      committeeMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleSignatureUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`File selected for member ${id}:`, file.name, file.type, file.size);
      
      // Store the actual file object - make sure it's properly stored
      const updatedMembers = committeeMembers.map(member => 
        member.id === id 
          ? { ...member, signatureFile: file, signature: URL.createObjectURL(file) } 
          : member
      );
      
      setCommitteeMembers(updatedMembers);
      
      // Reset the file input
      event.target.value = null;
    }
  };
  
  // 2. Then modify the handleSubmit function
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Add basic fields
      formData.append('site_name', siteName);
      formData.append('location', locationId);
      formData.append('date_of_occurrence', dateOfOccurrence);
      formData.append('date_of_report', dateOfReport);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('investigation_findings', investigationFindings);
      formData.append('physical_factor', physicalFactor);
      formData.append('human_factor', humanFactor);
      formData.append('system_factor', systemFactor);
      
      // Add recommendation_for_preventive_action as a JSON string
      const recommendationsObj = {};
      recommendations.forEach((rec, index) => {
        recommendationsObj[`action${index + 1}`] = {
          description: rec.description,
          responsibility: rec.responsibility,
          target_date: rec.targetDate,
          close_date: rec.closeDate || ""
        };
      });
      formData.append('recommendation_for_preventive_action', JSON.stringify(recommendationsObj));
      
      // Add committee members with special focus on signatures
      committeeMembers.forEach((member, index) => {
        formData.append(`committee_member_name_${index}`, member.name);
        formData.append(`committee_member_rank_${index}`, member.rank);
        
        // Debug logging before adding the file
        if (member.signatureFile) {
          console.log(`About to append file for member ${index}:`, 
            member.signatureFile.name, 
            member.signatureFile.type, 
            member.signatureFile.size
          );
          
          // Just use the signatureFile directly - simpler is better
          formData.append(`committee_member_signature_${index}`, member.signatureFile);
        } else {
          console.warn(`No signature file for member ${index}`);
        }
      });
      
      // Debug: Log the FormData entries to verify files are included
      // console.log("FormData entries:");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`Found file: ${pair[0]}`, pair[1].name, pair[1].type, pair[1].size);
        } else {
          console.log(pair[0], pair[1]);
        }
      }
      
      // Use the RTK Query mutation with the formData
      const response = await createIncidentNearMiss(formData).unwrap();
      
      if (response && response.status) {
        toast.success("Investigation report created successfully!");
        setOpen(false);
        onSuccess();
      } else {
        const errorMessage = response?.message || "Failed to create report. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "An error occurred while submitting the form");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Incident/Near Miss Investigation Report
      </DialogTitle>
      <DialogContent>
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Site Name */}
          <div>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site Name"
              value={siteName}
              sx={commonInputStyles}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
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
          </div>
        </div>

        {/* Date Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Date of Occurrence */}
          <div>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date of Occurrence<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="datetime-local"
              value={dateOfOccurrence}
              sx={commonInputStyles}
              onChange={(e) => setDateOfOccurrence(e.target.value)}
            />
          </div>

          {/* Date of Report */}
          <div>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date of Report<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="datetime-local"
              value={dateOfReport}
              sx={commonInputStyles}
              onChange={(e) => setDateOfReport(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              className="text-[#29346B] text-lg font-semibold"
            >
              Category<span className="text-red-600"> *</span>
            </FormLabel>
            <RadioGroup
              row
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <FormControlLabel value="incident" control={<Radio />} label="Incident" />
              <FormControlLabel value="nearmiss" control={<Radio />} label="Near Miss" />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Description<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Describe what happened"
            value={description}
            sx={commonInputStyles}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Investigation Findings */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Investigation Findings<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Enter investigation findings"
            value={investigationFindings}
            sx={commonInputStyles}
            onChange={(e) => setInvestigationFindings(e.target.value)}
          />
        </div>

        {/* Factors Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">Root Causes</h3>

          <div className="mb-3">
            <label className="block mb-1 text-[#29346B] font-semibold">
              Physical Factor (Machinary/ equipment fault)<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Describe physical factors"
              value={physicalFactor}
              sx={commonInputStyles}
              onChange={(e) => setPhysicalFactor(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-[#29346B] font-semibold">
              Human Factor(Fault by Human)<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Describe human factors"
              value={humanFactor}
              sx={commonInputStyles}
              onChange={(e) => setHumanFactor(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-[#29346B] font-semibold">
              System Factor (Lagging of procedure)<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Describe system factors"
              value={systemFactor}
              sx={commonInputStyles}
              onChange={(e) => setSystemFactor(e.target.value)}
            />
          </div>
        </div>

        {/* Multiple Recommendations Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <h3 className="text-[#29346B] text-xl font-semibold">Recommendations for Preventive Action</h3>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addRecommendation}
              sx={{
                backgroundColor: "#29346B",
                "&:hover": { backgroundColor: "#212959" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Add Recommendation
            </Button>
          </Box>

          {recommendations.map((rec, index) => (
            <Paper
              key={rec.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton
                  onClick={() => removeRecommendation(rec.id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: "#29346B" }}>
                Recommendation #{index + 1}
              </Typography>

              <div className="mb-3">
                <label className="block mb-1 text-[#29346B] font-semibold">
                  Description<span className="text-red-600"> *</span>
                </label>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  placeholder="Describe recommendation"
                  value={rec.description}
                  sx={commonInputStyles}
                  onChange={(e) => updateRecommendation(rec.id, "description", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 text-[#29346B] font-semibold">
                  Responsibility<span className="text-red-600"> *</span>
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter responsible person/team"
                  value={rec.responsibility}
                  sx={commonInputStyles}
                  onChange={(e) => updateRecommendation(rec.id, "responsibility", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-[#29346B] font-semibold">
                    Target Date<span className="text-red-600"> *</span>
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="datetime-local"
                    value={rec.targetDate}
                    sx={commonInputStyles}
                    onChange={(e) => updateRecommendation(rec.id, "targetDate", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[#29346B] font-semibold">
                    Close Date
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="datetime-local"
                    value={rec.closeDate}
                    sx={commonInputStyles}
                    onChange={(e) => updateRecommendation(rec.id, "closeDate", e.target.value)}
                  />
                </div>
              </div>
            </Paper>
          ))}
        </div>

        {/* Multiple Committee Members Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <h3 className="text-[#29346B] text-xl font-semibold">Committee Members</h3>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addCommitteeMember}
              sx={{
                backgroundColor: "#29346B",
                "&:hover": { backgroundColor: "#212959" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Add Member
            </Button>
          </Box>

          {committeeMembers.map((member, index) => (
            <Paper
              key={member.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton
                  onClick={() => removeCommitteeMember(member.id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: "#29346B" }}>
                Committee Member #{index + 1}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <label className="block mb-1 text-[#29346B] font-semibold">
                    Name<span className="text-red-600"> *</span>
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter member name"
                    value={member.name}
                    sx={commonInputStyles}
                    onChange={(e) => updateCommitteeMember(member.id, "name", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <label className="block mb-1 text-[#29346B] font-semibold">
                    Rank<span className="text-red-600"> *</span>
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter member rank"
                    value={member.rank}
                    sx={commonInputStyles}
                    onChange={(e) => updateCommitteeMember(member.id, "rank", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <label className="block mb-1 text-[#29346B] font-semibold">
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
                        onChange={(e) => handleSignatureUpload(member.id, e)}
                      />
                    </Button>
                    {member.signature && (
                      <Avatar
                        src={member.signature}
                        alt="Member Signature"
                        variant="rounded"
                        sx={{ width: 100, height: 56 }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          sx={{
            borderColor: "#29346B",
            color: "#29346B",
            fontSize: "16px",
            padding: "6px 24px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
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
        >
          {isLoading ? "Submitting..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}