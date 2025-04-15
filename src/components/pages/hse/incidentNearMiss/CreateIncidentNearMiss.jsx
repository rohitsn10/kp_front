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
} from "@mui/material";
import { toast } from "react-toastify";

export default function CreateIncidentNearMiss({ open, setOpen }) {
  // State for all fields based on the curl request
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfOccurrence, setDateOfOccurrence] = useState(""); // Change to string
  const [dateOfReport, setDateOfReport] = useState(""); // Change to string
  const [category, setCategory] = useState("incident");
  const [titleIncidentNearmiss, setTitleIncidentNearmiss] = useState("");
  const [description, setDescription] = useState("");
  const [investigationFindings, setInvestigationFindings] = useState("");
  const [physicalFactor, setPhysicalFactor] = useState("");
  const [humanFactor, setHumanFactor] = useState("");
  const [systemFactor, setSystemFactor] = useState("");

  // Recommendation details
  const [recommendationDescription, setRecommendationDescription] = useState("");
  const [recommendationResponsibility, setRecommendationResponsibility] = useState("");
  const [recommendationTargetDate, setRecommendationTargetDate] = useState(""); // Change to string

  // Committee member details
  const [committeeMemberName, setCommitteeMemberName] = useState("");
  const [committeeMemberRank, setCommitteeMemberRank] = useState("");

  const validateForm = () => {
    if (!siteName.trim()) return toast.error("Site Name is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!dateOfOccurrence.trim()) return toast.error("Date of Occurrence is required!");
    if (!dateOfReport.trim()) return toast.error("Date of Report is required!");
    if (!category) return toast.error("Category is required!");
    if (!titleIncidentNearmiss.trim()) return toast.error("Title of Incident/Near Miss is required!");
    if (!description.trim()) return toast.error("Description is required!");
    if (!investigationFindings.trim()) return toast.error("Investigation Findings are required!");
    if (!physicalFactor.trim()) return toast.error("Physical Factor is required!");
    if (!humanFactor.trim()) return toast.error("Human Factor is required!");
    if (!systemFactor.trim()) return toast.error("System Factor is required!");
    if (!recommendationDescription.trim()) return toast.error("Recommendation Description is required!");
    if (!recommendationResponsibility.trim()) return toast.error("Recommendation Responsibility is required!");
    if (!recommendationTargetDate.trim()) return toast.error("Recommendation Target Date is required!");
    if (!committeeMemberName.trim()) return toast.error("Committee Member Name is required!");
    if (!committeeMemberRank.trim()) return toast.error("Committee Member Rank is required!");

    return true;
  };

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
      site_name: siteName,
      location: location,
      date_of_occurrence: dateOfOccurrence, // Store as string
      date_of_report: dateOfReport, // Store as string
      category: category,
      title_incident_nearmiss: titleIncidentNearmiss,
      description: description,
      investigation_findings: investigationFindings,
      physical_factor: physicalFactor,
      human_factor: humanFactor,
      system_factor: systemFactor,
      recommendation_for_preventive_action: {
        "sr no.": "1", // Hardcoded for now, could be made dynamic if needed
        description: recommendationDescription,
        responsibility: recommendationResponsibility,
        target_date: recommendationTargetDate, // Store as string
      },
      committee_members: {
        name: committeeMemberName,
        rank: committeeMemberRank,
      },
    };

    console.log(formData);

    // Here you would make the API call to update the data
    // Example:
    // axios.put(`http://127.0.0.1:8000/annexures_module/update_incident_nearmiss_investigation/${investigationId}`, formData, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }
    // })
    // .then(response => {
    //   toast.success("Investigation report updated successfully!");
    //   setOpen(false);
    // })
    // .catch(error => {
    //   toast.error("Error updating report: " + error.message);
    // });

    toast.success("Investigation report updated successfully!");
    setOpen(false);
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
              type="datetime-local" // Use datetime-local
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
              type="datetime-local" // Use datetime-local
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

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Title of Incident/Near Miss<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Title"
            value={titleIncidentNearmiss}
            sx={commonInputStyles}
            onChange={(e) => setTitleIncidentNearmiss(e.target.value)}
          />
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
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">Contributing Factors</h3>

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

        {/* Recommendations Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">Recommendation for Preventive Action</h3>

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
              value={recommendationDescription}
              sx={commonInputStyles}
              onChange={(e) => setRecommendationDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Responsibility<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter responsible person/team"
                value={recommendationResponsibility}
                sx={commonInputStyles}
                onChange={(e) => setRecommendationResponsibility(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Target Date<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                type="datetime-local" // Use datetime-local
                value={recommendationTargetDate}
                sx={commonInputStyles}
                onChange={(e) => setRecommendationTargetDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Committee Members Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">Committee Members</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Name<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter member name"
                value={committeeMemberName}
                sx={commonInputStyles}
                onChange={(e) => setCommitteeMemberName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Rank<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter member rank"
                value={committeeMemberRank}
                sx={commonInputStyles}
                onChange={(e) => setCommitteeMemberRank(e.target.value)}
              />
            </div>
          </div>
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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}