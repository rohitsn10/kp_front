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
import { useCreateSafetyViolationReportMutation } from "../../../../api/hse/safetyViolation/safetyViolatioApi";

export default function CreateSafetyViolation({ open, setOpen }) {
  // RTK mutation hook
  const [createSafetyViolationReport, { isLoading }] = useCreateSafetyViolationReportMutation();

  const [siteName, setSiteName] = useState("");
  const [issuedTo, setIssuedTo] = useState("onm"); // Default value matching the curl example
  const [issuedToViolatorName, setIssuedToViolatorName] = useState("");
  const [issuedToDesignation, setIssuedToDesignation] = useState("");
  const [issuedToDepartment, setIssuedToDepartment] = useState("");
  const [issuedBy, setIssuedBy] = useState("day"); // Default value matching the curl example
  const [issuedByName, setIssuedByName] = useState("");
  const [issuedByDesignation, setIssuedByDesignation] = useState("");
  const [issuedByDepartment, setIssuedByDepartment] = useState("");
  const [contractorsName, setContractorsName] = useState("");
  const [descriptionSafetyViolation, setDescriptionSafetyViolation] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  const validateForm = () => {
    const requiredFields = [
      { value: siteName, label: "Site Name" },
      { value: issuedTo, label: "Issued To" },
      { value: issuedToViolatorName, label: "Violator Name" },
      { value: issuedToDesignation, label: "Violator Designation" },
      { value: issuedToDepartment, label: "Violator Department" },
      { value: issuedBy, label: "Issued By" },
      { value: issuedByName, label: "Issuer Name" },
      { value: issuedByDesignation, label: "Issuer Designation" },
      { value: issuedByDepartment, label: "Issuer Department" },
      { value: contractorsName, label: "Contractor's Name" },
      { value: descriptionSafetyViolation, label: "Description of Safety Violation" },
      { value: actionTaken, label: "Action Taken" },
    ];
  
    const emptyField = requiredFields.find(field => !field.value.trim());
  
    if (emptyField) {
      toast.error(`${emptyField.label} is required!`);
      return false;
    }
  
    return true;
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      site_name: siteName,
      issued_to: issuedTo,
      issued_to_violator_name: issuedToViolatorName,
      issued_to_designation: issuedToDesignation,
      issued_to_department: issuedToDepartment,
      issued_by: issuedBy,
      issued_by_name: issuedByName,
      issued_by_designation: issuedByDesignation,
      issued_by_department: issuedByDepartment,
      contractors_name: contractorsName,
      description_safety_violation: descriptionSafetyViolation,
      action_taken: actionTaken
    };

    try {
      const response = await createSafetyViolationReport(formData).unwrap();
  
      if (response.status) {
        toast.success(response.message || "Report submitted successfully!");
        setOpen(false);
        resetForm(); // Optional: Reset form fields
      } else {
        toast.error(response.message || "Failed to submit the report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error?.data?.message || "An unexpected error occurred.");
    }
  };

  // Function to reset all form fields
  const resetForm = () => {
    setSiteName("");
    setIssuedTo("onm");
    setIssuedToViolatorName("");
    setIssuedToDesignation("");
    setIssuedToDepartment("");
    setIssuedBy("day");
    setIssuedByName("");
    setIssuedByDesignation("");
    setIssuedByDepartment("");
    setContractorsName("");
    setDescriptionSafetyViolation("");
    setActionTaken("");
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
        Safety Violation Report
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
            value={siteName}
            sx={commonInputStyles}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>

        {/* Issued To Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">Issued To (Violator Details)</h3>
          
          <div className="mb-3">
            <FormControl component="fieldset" className="mb-2">
              <FormLabel component="legend" className="text-[#29346B] font-semibold">
                Issued To<span className="text-red-600"> *</span>
              </FormLabel>
              <RadioGroup
                row
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
              >
                <FormControlLabel value="onm" control={<Radio />} label="ONM" />
                <FormControlLabel value="project" control={<Radio />} label="Project" />
                <FormControlLabel value="contractor" control={<Radio />} label="Contractor" />
                <FormControlLabel value="visitor" control={<Radio />} label="Visitor" />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Violator Name<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Violator Name"
                value={issuedToViolatorName}
                sx={commonInputStyles}
                onChange={(e) => setIssuedToViolatorName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Designation<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Designation"
                value={issuedToDesignation}
                sx={commonInputStyles}
                onChange={(e) => setIssuedToDesignation(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Department<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Department"
                value={issuedToDepartment}
                sx={commonInputStyles}
                onChange={(e) => setIssuedToDepartment(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Issued By Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">Issued By (Reporter Details)</h3>
          
          <div className="mb-3">
            <FormControl component="fieldset" className="mb-2">
              <FormLabel component="legend" className="text-[#29346B] font-semibold">
                Issued By<span className="text-red-600"> *</span>
              </FormLabel>
              <RadioGroup
                row
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
              >
                <FormControlLabel value="day" control={<Radio />} label="Day" />
                <FormControlLabel value="night" control={<Radio />} label="Night" />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Issuer Name<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Issuer Name"
                value={issuedByName}
                sx={commonInputStyles}
                onChange={(e) => setIssuedByName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Designation<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Designation"
                value={issuedByDesignation}
                sx={commonInputStyles}
                onChange={(e) => setIssuedByDesignation(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Department<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Department"
                value={issuedByDepartment}
                sx={commonInputStyles}
                onChange={(e) => setIssuedByDepartment(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contractor's Name */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Contractor's Name<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Contractor's Name"
            value={contractorsName}
            sx={commonInputStyles}
            onChange={(e) => setContractorsName(e.target.value)}
          />
        </div>

        {/* Description of Safety Violation */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Description of Safety Violation<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Describe the safety violation in detail"
            value={descriptionSafetyViolation}
            sx={commonInputStyles}
            onChange={(e) => setDescriptionSafetyViolation(e.target.value)}
          />
        </div>

        {/* Action Taken */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Action Taken<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Describe the actions taken"
            value={actionTaken}
            sx={commonInputStyles}
            onChange={(e) => setActionTaken(e.target.value)}
          />
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
          disabled={isLoading}
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
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}