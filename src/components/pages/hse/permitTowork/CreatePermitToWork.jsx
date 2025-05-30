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
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreatePermitToWorkMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
import { useParams } from "react-router-dom";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PermitToWorkDialog({ open, setOpen, refetch }) {
  const [createPermitToWork, { isLoading }] = useCreatePermitToWorkMutation();
  // States updated to match API payload field names
  const {locationId}=useParams();
  const [site_name, setSiteName] = useState("");
  const [department, setDepartment] = useState("");
  const [permit_number, setPermitNumber] = useState("");
  const [permit_date, setPermitDate] = useState(""); // Added permit date
  const [external_agency_name, setExternalAgencyName] = useState("");
  const [type_of_permit, setTypeOfPermit] = useState("");
  const [other_permit_type, setOtherPermitType] = useState(""); 
  const [permit_valid_from, setPermitValidFrom] = useState(""); // Changed from permit_issued_for
  const [permit_valid_to, setPermitValidTo] = useState(""); // Added permit valid to
  const [permit_risk_type, setPermitRiskType] = useState("general"); // Added for risk type (general/critical)
  const [job_activity, setJobActivity] = useState("");
  const [location_area, setLocationArea] = useState("");
  const [tools_equipment, setToolsEquipment] = useState("");
  const [hazard_consideration, setHazardConsideration] = useState([]);
  const [other_hazard, setOtherHazard] = useState(""); 
  const [job_preparation, setJobPreparation] = useState([]);
  const [other_job_preparation, setOtherJobPreparation] = useState(""); 
  const [risk_assessment_number, setRiskAssessmentNumber] = useState("");
  const [fire_protection, setFireProtection] = useState([]);
  const [other_fire_protection, setOtherFireProtection] = useState(""); 
  // Updated state for issuer name and signed PDF
  const [issuer_name, setIssuerName] = useState("");
  const [issuer_signed_pdf, setIssuerSignedPdf] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState(0);

  const validateForm = () => {
    const requiredFields = [
      { value: site_name, label: "Site Name" },
      { value: department, label: "Department" },
      { value: permit_number, label: "Permit Number" },
      { value: permit_date, label: "Permit Date" }, // Added date validation
      { value: type_of_permit === "other" ? other_permit_type : type_of_permit, label: "Type of Permit" },
      { value: permit_valid_from, label: "Permit Valid From" }, // Changed validation
      { value: permit_valid_to, label: "Permit Valid To" }, // Added validation
      { value: job_activity, label: "Job Activity" },
      { value: location_area, label: "Location" },
      { value: tools_equipment, label: "Tools & Equipment" },
      { value: hazard_consideration.length > 0 ? "ok" : "", label: "Hazard Consideration" },
      { value: job_preparation.length > 0 ? "ok" : "", label: "Job Preparation" },
      { value: fire_protection.length > 0 ? "ok" : "", label: "Fire Protection" },
      { value: issuer_name, label: "Issuer Name" },
      { value: issuer_signed_pdf ? "ok" : "", label: "Signed PDF Document" },
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

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle PDF upload with size validation
  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's a PDF file
      if (file.type !== 'application/pdf') {
        toast.error("Please upload only PDF files!");
        return;
      }
      
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        toast.error(`File size too large! Please upload a PDF smaller than 20MB. Current size: ${formatFileSize(file.size)}`);
        return;
      }
      
      // If validation passes, set the file
      setIssuerSignedPdf(file);
      setPdfFileName(file.name);
      setPdfFileSize(file.size);
      toast.success(`PDF uploaded successfully! Size: ${formatFileSize(file.size)}`);
    }
  };

  // Remove uploaded PDF
  const handleRemovePdf = () => {
    setIssuerSignedPdf(null);
    setPdfFileName("");
    setPdfFileSize(0);
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
    "other",
  ];

  // Updated hazard options 
  const hazardOptions = [
    "fire",
    "electrical",
    "fall",
    "slip & trip",
    "cut & injury",
    "toppling",
    "dust",
    "other",
  ];

  // Updated job preparation options - removed "method statement"
  const jobPreparationOptions = [
    "work permit procedure",
    "risk assessment",
    "sop", // Added Safe Operating Procedure
    "other",
  ];

  // Updated fire protection options
  const fireProtectionOptions = [
    "fire extinguisher",
    "fire blanket",
    "fire watch",
    "face shield",
    "dust mask",
    "full body harness",
    "ppe suit",
    "other",
  ];

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Keep "other" in the arrays but send custom text in separate fields
    
    // Prepare the final type_of_permit - keep "other" as is
    const finalTypeOfPermit = type_of_permit;
    
    // Create form data to handle file upload
    const formData = new FormData();
    
    // Add all text fields to formData
    const payload = {
      location_id: Number(locationId),
      site_name,
      department,
      permit_number,
      permit_date,
      external_agency_name,
      type_of_permit: finalTypeOfPermit,
      permit_valid_from,
      permit_valid_to,
      permit_risk_type,
      job_activity,
      location_area,
      tools_equipment,
      hazard_consideration: hazard_consideration,
      job_preparation: job_preparation,
      risk_assessment_number,
      fire_protection: fire_protection,
      issuer_name
    };
    
    // Add other fields as separate properties if they exist
    if (hazard_consideration.includes("other") && other_hazard.trim()) {
      payload.other_hazard_consideration = other_hazard.trim();
    }
    
    if (job_preparation.includes("other") && other_job_preparation.trim()) {
      payload.other_job_preparation = other_job_preparation.trim();
    }
    
    if (fire_protection.includes("other") && other_fire_protection.trim()) {
      payload.other_fire_protection = other_fire_protection.trim();
    }
    
    if (type_of_permit === "other" && other_permit_type.trim()) {
      payload.other_permit_description = other_permit_type.trim();
    }
    
    // Append all text data as a single JSON field
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'object') {
        formData.append(key, JSON.stringify(payload[key]));
      } else {
        formData.append(key, payload[key]);
      }
    });
    
    // Append the signed PDF file (changed field name from 'issuer_sign' to 'issuer_signed_pdf')
    if (issuer_signed_pdf) {
      formData.append('issuer_signature', issuer_signed_pdf);
    }
  
    try {
      const response = await createPermitToWork(formData).unwrap();
  
      if (response.status) {
        toast.success(response.message || "Permit submitted successfully!");
        setOpen(false);
        if (refetch) refetch();
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
      <DialogTitle className="text-[rgb(41,52,107)] text-2xl font-semibold">
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

        {/* Permit Number, Date & External Agency */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/3">
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
          <div className="w-1/3">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              value={permit_date}
              sx={commonInputStyles}
              onChange={(e) => setPermitDate(e.target.value)}
            />
          </div>
          <div className="w-1/3">
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

        {/* Type of Permit (Radio buttons) */}
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

        {/* Permit Valid From/To */}
        <div className="mb-4">
          <div className="flex flex-col mb-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Permit Valid<span className="text-red-600"> *</span>
            </label>
            <div className="flex gap-4">
              <div className="w-1/2">
                <TextField
                  fullWidth
                  type="time"
                  variant="outlined"
                  label="From (hrs)"
                  value={permit_valid_from}
                  sx={commonInputStyles}
                  onChange={(e) => setPermitValidFrom(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  fullWidth
                  type="time"
                  variant="outlined"
                  label="To (hrs)"
                  value={permit_valid_to}
                  sx={commonInputStyles}
                  onChange={(e) => setPermitValidTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Permit Risk Type */}
        <div className="mb-4">
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              className="text-[#29346B] text-lg font-semibold"
            >
              Permit Risk Type<span className="text-red-600"> *</span>
            </FormLabel>
            <RadioGroup
              row
              value={permit_risk_type}
              onChange={(e) => setPermitRiskType(e.target.value)}
            >
              <FormControlLabel 
                value="general" 
                control={<Radio />} 
                label="General/Low Risk PTW (Can be revalidated up to 25 days.)" 
              />
              <FormControlLabel
                value="critical"
                control={<Radio />}
                label="Critical/High Risk PTW (HSEO/Dept. Head/Project Head/Site In-charge/ONM Head will validate)"
              />
            </RadioGroup>
          </FormControl>
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
                label={item === "sop" ? "SOP (Safe Operating Procedure)" : (item.charAt(0).toUpperCase() + item.slice(1))}
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
            Fire Protection & PPEs<span className="text-red-600"> *</span>
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
          
          {/* Note about mandatory PPEs */}
          <Typography variant="body2" className="mt-2 text-gray-600 italic">
            Note: Safety shoes, Safety helmet, Safety goggles, Hand gloves are mandatory in addition to Job specific PPEs to be used.
          </Typography>
        </div>
        
        {/* UPDATED SECTION: Issuer Name and Signed PDF */}
        <div className="mb-4 mt-6 border-t pt-4">
          <Typography variant="h6" className="text-[#29346B] text-lg font-semibold mb-4">
            Permit Issuer Details
          </Typography>
          
          {/* Issuer Name */}
          <div className="mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Issuer Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter issuer's full name"
              value={issuer_name}
              sx={commonInputStyles}
              onChange={(e) => setIssuerName(e.target.value)}
            />
          </div>
          
          {/* Signed PDF Document */}
          <div className="mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Signed PDF Document<span className="text-red-600"> *</span>
            </label>
            <Typography variant="body2" className="mb-2 text-gray-600">
              Upload a PDF document that contains digital signatures. Maximum file size: 20MB
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                color="primary"
                startIcon={<PictureAsPdfIcon />}
                sx={{ 
                  height: "56px",
                  borderColor: "#FACC15",
                  color: "#29346B",
                  "&:hover": {
                    borderColor: "#F6812D",
                    backgroundColor: "rgba(246, 129, 45, 0.04)"
                  }
                }}
              >
                Upload Signed PDF
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={handlePdfUpload}
                />
              </Button>
              
              {/* Show uploaded PDF info */}
              {pdfFileName && (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  padding: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0"
                }}>
                  <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 32 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {pdfFileName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {formatFileSize(pdfFileSize)}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemovePdf}
                  >
                    Remove
                  </Button>
                </Box>
              )}
              
              {!pdfFileName && (
                <Typography variant="body2" color="text.secondary">
                  No PDF document uploaded
                </Typography>
              )}
            </Box>
          </div>
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