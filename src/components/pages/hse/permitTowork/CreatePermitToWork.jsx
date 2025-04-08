import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreatePermitToWorkMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
// import { useCreatePermitToWorkMutation } from "your-rtk-query-file"; // Import path may need adjustment

export default function PermitToWorkDialog({ open, setOpen }) {
  const [createPermitToWork, { isLoading }] = useCreatePermitToWorkMutation();
  
  // States updated to match API payload field names
  const [site_name, setSiteName] = useState("");
  const [department, setDepartment] = useState("");
  const [permit_number, setPermitNumber] = useState("");
  const [external_agency_name, setExternalAgencyName] = useState("");
  const [type_of_permit, setTypeOfPermit] = useState("");
  const [other_permit_type, setOtherPermitType] = useState(""); // Added for "Other" permit type
  const [permit_issued_for, setPermitIssuedFor] = useState([]);
  const [day, setDay] = useState("");
  const [job_activity, setJobActivity] = useState("");
  const [location_area, setLocationArea] = useState("");
  const [tools_equipment, setToolsEquipment] = useState("");
  const [hazard_consideration, setHazardConsideration] = useState([]);
  const [other_hazard, setOtherHazard] = useState(""); // Added for "Other" hazard
  const [job_preparation, setJobPreparation] = useState([]);
  const [other_job_preparation, setOtherJobPreparation] = useState(""); // Added for "Other" job preparation
  const [risk_assessment_number, setRiskAssessmentNumber] = useState("");
  const [fire_protection, setFireProtection] = useState([]);
  const [other_fire_protection, setOtherFireProtection] = useState(""); // Added for "Other" fire protection

  const validateForm = () => {
    const requiredFields = [
      { value: site_name, label: "Site Name" },
      { value: department, label: "Department" },
      { value: permit_number, label: "Permit Number" },
      { value: type_of_permit === "other" ? other_permit_type : type_of_permit, label: "Type of Permit" },
      { value: permit_issued_for.length > 0 ? "ok" : "", label: "Permit Issued For" },
      { value: job_activity, label: "Job Activity" },
      { value: location_area, label: "Location" },
      { value: tools_equipment, label: "Tools & Equipment" },
      { value: hazard_consideration.length > 0 ? "ok" : "", label: "Hazard Consideration" },
      { value: job_preparation.length > 0 ? "ok" : "", label: "Job Preparation" },
      { value: fire_protection.length > 0 ? "ok" : "", label: "Fire Protection" },
    ];
  
    // Check general required fields
    const emptyField = requiredFields.find(field => !field.value || field.value.trim?.() === "");
    if (emptyField) {
      toast.error(`${emptyField.label} is required!`);
      return false;
    }
  
    // Check if "other" is selected but no text is provided
    if (type_of_permit === "other" && !other_permit_type.trim()) {
      toast.error("Please specify Other Permit Type!");
      return false;
    }
    
    if (hazard_consideration.includes("other") && !other_hazard.trim()) {
      toast.error("Please specify Other Hazard!");
      return false;
    }
    
    if (job_preparation.includes("other") && !other_job_preparation.trim()) {
      toast.error("Please specify Other Job Preparation!");
      return false;
    }
    
    if (fire_protection.includes("other") && !other_fire_protection.trim()) {
      toast.error("Please specify Other Fire Protection!");
      return false;
    }
  
    // Special case: Risk assessment number required if "risk assessment" is selected
    if (job_preparation.includes("risk assessment") && !risk_assessment_number.trim()) {
      toast.error("Risk Assessment Number is required!");
      return false;
    }
  
    return true;
  };

  // Permit type options (changed to strings to match API)
  const permitTypeOptions = [
    "cold work",
    "hot work",
    "work at height",
    "electrical work",
    "excavation",
    "equipment testing",
    "crane / hydra / jcb work",
    "other", // Added "other" option
  ];

  // Permit issued for options
  const permitIssuedForOptions = ["day", "night"];

  const hazardOptions = [
    "fire",
    "electrical",
    "fall",
    "slip & trip",
    "toppling",
    "other", // Added "other" option
  ];

  const jobPreparationOptions = [
    "work permit",
    "method statement",
    "risk assessment",
    "safety training",
    "other", // Added "other" option
  ];

  const fireProtectionOptions = [
    "fire extinguisher",
    "fire blanket",
    "fire watch",
    "ppe suit",
    "other", // Added "other" option
  ];

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    // Prepare hazard_consideration with "other" value if selected
    let finalHazardConsideration = [...hazard_consideration];
    if (hazard_consideration.includes("other") && other_hazard.trim()) {
      // Replace "other" with the custom text
      finalHazardConsideration = hazard_consideration.filter(h => h !== "other");
      finalHazardConsideration.push(other_hazard.trim());
    }
    
    // Prepare job_preparation with "other" value if selected
    let finalJobPreparation = [...job_preparation];
    if (job_preparation.includes("other") && other_job_preparation.trim()) {
      // Replace "other" with the custom text
      finalJobPreparation = job_preparation.filter(j => j !== "other");
      finalJobPreparation.push(other_job_preparation.trim());
    }
    
    // Prepare fire_protection with "other" value if selected
    let finalFireProtection = [...fire_protection];
    if (fire_protection.includes("other") && other_fire_protection.trim()) {
      // Replace "other" with the custom text
      finalFireProtection = fire_protection.filter(f => f !== "other");
      finalFireProtection.push(other_fire_protection.trim());
    }
    
    // Prepare the final type_of_permit
    const finalTypeOfPermit = type_of_permit === "other" ? other_permit_type.trim() : type_of_permit;
  
    const payload = {
      site_name,
      department,
      permit_number,
      external_agency_name,
      type_of_permit: finalTypeOfPermit,
      permit_issued_for,
      day,
      job_activity,
      location_area,
      tools_equipment,
      hazard_consideration: finalHazardConsideration,
      job_preparation: finalJobPreparation,
      risk_assessment_number,
      fire_protection: finalFireProtection
    };
  
    try {
      const response = await createPermitToWork(payload).unwrap();
  
      if (response.status) {
        toast.success(response.message || "Permit submitted successfully!");
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit permit.");
      }
    } catch (error) {
      toast.error(`Submission failed: ${error?.data?.message || "Unknown error"}`);
    }
  };
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Permit to Work
      </DialogTitle>
      <DialogContent>
        {/* Site Name */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Site Name<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Site Name"
            value={site_name}
            onChange={(e) => setSiteName(e.target.value)}
            sx={commonInputStyles}
          />
        </div>

        {/* Department (Radio Button) */}
        <div className="mb-4">
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              className="text-[#29346B] text-lg font-semibold"
            >
              Department<span className="text-red-600"> *</span>
            </FormLabel>
            <RadioGroup
              row
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <FormControlLabel value="onm" control={<Radio />} label="ONM" />
              <FormControlLabel
                value="project"
                control={<Radio />}
                label="Project"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Permit Number & External Agency */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Permit Number<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Permit Number"
              value={permit_number}
              sx={commonInputStyles}
              onChange={(e) => setPermitNumber(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              External Agency Name (if any)
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Agency Name"
              value={external_agency_name}
              sx={commonInputStyles}
              onChange={(e) => setExternalAgencyName(e.target.value)}
            />
          </div>
        </div>

        {/* Type of Permit (Radio buttons instead of checkboxes) */}
        <div className="mb-4">
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              className="text-[#29346B] text-lg font-semibold"
            >
              Type of Permit<span className="text-red-600"> *</span>
            </FormLabel>
            <RadioGroup
              row
              value={type_of_permit}
              onChange={(e) => setTypeOfPermit(e.target.value)}
            >
              {permitTypeOptions.map((option) => (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio />} 
                  label={option.charAt(0).toUpperCase() + option.slice(1)} 
                />
              ))}
            </RadioGroup>
            
            {/* Add text field for "Other" permit type */}
            {type_of_permit === "other" && (
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Please specify other permit type"
                value={other_permit_type}
                sx={{...commonInputStyles, marginTop: "8px"}}
                onChange={(e) => setOtherPermitType(e.target.value)}
              />
            )}
          </FormControl>
        </div>

        {/* Permit Issued For (Checkboxes) */}
        <div className="mb-4">
          <FormLabel
            component="legend"
            className="text-[#29346B] text-lg font-semibold"
          >
            Permit Issued For<span className="text-red-600"> *</span>
          </FormLabel>
          <FormGroup row>
            {permitIssuedForOptions.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={permit_issued_for.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPermitIssuedFor([...permit_issued_for, option]);
                      } else {
                        setPermitIssuedFor(permit_issued_for.filter(item => item !== option));
                      }
                    }}
                  />
                }
                label={option.charAt(0).toUpperCase() + option.slice(1)}
              />
            ))}
          </FormGroup>
        </div>

        {/* Day */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Day<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Day"
            value={day}
            sx={commonInputStyles}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>

        {/* Job Activity */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Job / Activity in Details<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Enter job activities"
            value={job_activity}
            sx={commonInputStyles}
            onChange={(e) => setJobActivity(e.target.value)}
          />
        </div>

        {/* Location & Tools */}
        <div className="flex gap-4 mb-4 mt-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Location / Area<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter location"
              value={location_area}
              sx={commonInputStyles}
              onChange={(e) => setLocationArea(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Tools & Equipment<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Enter tools and equipment"
              value={tools_equipment}
              sx={commonInputStyles}
              onChange={(e) => setToolsEquipment(e.target.value)}
            />
          </div>
        </div>

        {/* Hazard Consideration */}
        <div className="mb-4">
          <FormLabel
            component="legend"
            className="text-[#29346B] text-lg font-semibold"
          >
            Hazard Consideration<span className="text-red-600"> *</span>
          </FormLabel>
          <FormGroup row>
            {hazardOptions.map((hazard) => (
              <FormControlLabel
                key={hazard}
                control={
                  <Checkbox
                    checked={hazard_consideration.includes(hazard)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setHazardConsideration([...hazard_consideration, hazard]);
                      } else {
                        setHazardConsideration(hazard_consideration.filter(item => item !== hazard));
                      }
                    }}
                  />
                }
                label={hazard.charAt(0).toUpperCase() + hazard.slice(1)}
              />
            ))}
          </FormGroup>
          
          {/* Add text field for "Other" hazard */}
          {hazard_consideration.includes("other") && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Please specify other hazard"
              value={other_hazard}
              sx={{...commonInputStyles, marginTop: "8px"}}
              onChange={(e) => setOtherHazard(e.target.value)}
            />
          )}
        </div>

        {/* Job Preparation */}
        <div className="mb-4">
          <FormLabel
            component="legend"
            className="text-[#29346B] text-lg font-semibold"
          >
            Job Preparation<span className="text-red-600"> *</span>
          </FormLabel>
          <FormGroup row>
            {jobPreparationOptions.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={job_preparation.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setJobPreparation([...job_preparation, item]);
                      } else {
                        setJobPreparation(job_preparation.filter(prep => prep !== item));
                      }
                    }}
                  />
                }
                label={item.charAt(0).toUpperCase() + item.slice(1)}
              />
            ))}
          </FormGroup>
          
          {/* Add text field for "Other" job preparation */}
          {job_preparation.includes("other") && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Please specify other job preparation"
              value={other_job_preparation}
              sx={{...commonInputStyles, marginTop: "8px"}}
              onChange={(e) => setOtherJobPreparation(e.target.value)}
            />
          )}
        </div>

        {/* Risk Assessment Number - Only show if Risk Assessment is selected */}
        {job_preparation.includes("risk assessment") && (
          <div className="mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Risk Assessment Number<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Risk Assessment Number"
              value={risk_assessment_number}
              sx={commonInputStyles}
              onChange={(e) => setRiskAssessmentNumber(e.target.value)}
            />
          </div>
        )}

        {/* Fire Protection */}
        <div className="mb-4">
          <FormLabel
            component="legend"
            className="text-[#29346B] text-lg font-semibold"
          >
            Fire Protection<span className="text-red-600"> *</span>
          </FormLabel>
          <FormGroup row>
            {fireProtectionOptions.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={fire_protection.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFireProtection([...fire_protection, item]);
                      } else {
                        setFireProtection(fire_protection.filter(prot => prot !== item));
                      }
                    }}
                  />
                }
                label={item.charAt(0).toUpperCase() + item.slice(1)}
              />
            ))}
          </FormGroup>
          
          {/* Add text field for "Other" fire protection */}
          {fire_protection.includes("other") && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Please specify other fire protection"
              value={other_fire_protection}
              sx={{...commonInputStyles, marginTop: "8px"}}
              onChange={(e) => setOtherFireProtection(e.target.value)}
            />
          )}
        </div>
      </DialogContent>

      <DialogActions>
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