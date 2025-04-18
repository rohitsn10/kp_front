import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Box,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateSafetyViolationReportMutation } from "../../../../api/hse/safetyViolation/safetyViolatioApi";
import { useParams } from "react-router-dom";

export default function CreateSafetyViolation({ open, setOpen }) {
  // RTK mutation hook
  const [createSafetyViolationReport, { isLoading }] =
    useCreateSafetyViolationReportMutation();

  const [siteName, setSiteName] = useState("");
  const [siteDate, setSiteDate] = useState("");
  const [issuedToViolatorName, setIssuedToViolatorName] = useState("");
  const [issuedToDesignation, setIssuedToDesignation] = useState("");
  const [issuedToDepartment, setIssuedToDepartment] = useState("");
  const [issuedToSignature, setIssuedToSignature] = useState(null);
  const [issuedByName, setIssuedByName] = useState("");
  const [issuedByDesignation, setIssuedByDesignation] = useState("");
  const [issuedByDepartment, setIssuedByDepartment] = useState("");
  const [issuedBySignature, setIssuedBySignature] = useState(null);
  const [contractorsName, setContractorsName] = useState("");
  const [descriptionSafetyViolation, setDescriptionSafetyViolation] =
    useState("");
  const [actionTaken, setActionTaken] = useState("");
  const { locationId } = useParams();
  // New fields for the additional sections
  const [siteHseoName, setSiteHseoName] = useState("");
  const [siteHseoSignature, setSiteHseoSignature] = useState(null);
  const [siteInChargeName, setSiteInChargeName] = useState("");
  const [siteInChargeSignature, setSiteInChargeSignature] = useState(null);
  const [projectManagerName, setProjectManagerName] = useState("");
  const [projectManagerSignature, setProjectManagerSignature] = useState(null);

  const validateForm = () => {
    const requiredFields = [
      { value: siteName, label: "Site Name" },
      { value: siteDate, label: "Date" },
      { value: issuedToViolatorName, label: "Violator Name" },
      { value: issuedToDesignation, label: "Violator Designation" },
      { value: issuedToDepartment, label: "Violator Department" },
      { value: issuedByName, label: "Issuer Name" },
      { value: issuedByDesignation, label: "Issuer Designation" },
      { value: issuedByDepartment, label: "Issuer Department" },
      { value: contractorsName, label: "Contractor's Name" },
      {
        value: descriptionSafetyViolation,
        label: "Description of Safety Violation",
      },
      { value: actionTaken, label: "Action Taken" },
      { value: siteHseoName, label: "Site HSEO Name" },
      { value: siteInChargeName, label: "Site In Charge Name" },
      { value: projectManagerName, label: "Project Manager Name" },
    ];

    // Check text fields
    const emptyField = requiredFields.find((field) => !field.value.trim());
    if (emptyField) {
      toast.error(`${emptyField.label} is required!`);
      return false;
    }

    // Check signatures
    if (!issuedToSignature) {
      toast.error("Violator Signature is required!");
      return false;
    }

    if (!issuedBySignature) {
      toast.error("Issuer Signature is required!");
      return false;
    }

    if (!siteHseoSignature) {
      toast.error("Site HSEO Signature is required!");
      return false;
    }

    if (!siteInChargeSignature) {
      toast.error("Site In Charge Signature is required!");
      return false;
    }

    if (!projectManagerSignature) {
      toast.error("Project Manager Signature is required!");
      return false;
    }

    return true;
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      site_name: siteName,
      site_date: siteDate,
      issued_to_violator_name: issuedToViolatorName,
      issued_to_designation: issuedToDesignation,
      issued_to_department: issuedToDepartment,
      issued_to_sign: issuedToSignature, // Now it's the signature data URL
      issued_by_name: issuedByName,
      issued_by_designation: issuedByDesignation,
      issued_by_department: issuedByDepartment,
      issued_by_sign: issuedBySignature, // Now it's the signature data URL
      contractors_name: contractorsName,
      description_safety_violation: descriptionSafetyViolation,
      action_taken: actionTaken,
      hseo_name: siteHseoName,
      hseo_sign: siteHseoSignature, // Now it's the signature data URL
      site_incharge_name: siteInChargeName,
      site_incharge_sign: siteInChargeSignature, // Now it's the signature data URL
      manager_name: projectManagerName,
      manager_sign: projectManagerSignature, // Now it's the signature data URL
      location: locationId,
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
    setSiteDate("");
    setIssuedToViolatorName("");
    setIssuedToDesignation("");
    setIssuedToDepartment("");
    setIssuedToSignature(null);
    setIssuedByName("");
    setIssuedByDesignation("");
    setIssuedByDepartment("");
    setIssuedBySignature(null);
    setContractorsName("");
    setDescriptionSafetyViolation("");
    setActionTaken("");
    setSiteHseoName("");
    setSiteHseoSignature(null);
    setSiteInChargeName("");
    setSiteInChargeSignature(null);
    setProjectManagerName("");
    setProjectManagerSignature(null);
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

  // Signature upload handlers
  const handleSignatureUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

        {/* Date Field - Added below Site Name */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Date<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            value={siteDate}
            sx={commonInputStyles}
            onChange={(e) => setSiteDate(e.target.value)}
          />
        </div>

        {/* Issued To Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">
            Issued To (Violator Details)
          </h3>

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

          {/* Signature field for Issued To with upload functionality */}
          <div className="mt-4">
            <label className="block mb-1 text-[#29346B] font-semibold">
              Signature<span className="text-red-600"> *</span>
            </label>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  onChange={handleSignatureUpload(setIssuedToSignature)}
                />
              </Button>
              {issuedToSignature && (
                <Avatar
                  src={issuedToSignature}
                  alt="Violator Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </div>
        </div>

        {/* Issued By Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">
            Issued By (Reporter Details)
          </h3>

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

          {/* Signature field for Issued By with upload functionality */}
          <div className="mt-4">
            <label className="block mb-1 text-[#29346B] font-semibold">
              Signature<span className="text-red-600"> *</span>
            </label>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  onChange={handleSignatureUpload(setIssuedBySignature)}
                />
              </Button>
              {issuedBySignature && (
                <Avatar
                  src={issuedBySignature}
                  alt="Issuer Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
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
            Description of Safety Violation
            <span className="text-red-600"> *</span>
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

        {/* Additional Sections */}

        {/* Site HSEO Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">
            Site HSEO
          </h3>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Name<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Name"
                value={siteHseoName}
                sx={commonInputStyles}
                onChange={(e) => setSiteHseoName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Signature<span className="text-red-600"> *</span>
              </label>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    onChange={handleSignatureUpload(setSiteHseoSignature)}
                  />
                </Button>
                {siteHseoSignature && (
                  <Avatar
                    src={siteHseoSignature}
                    alt="Site HSEO Signature"
                    variant="rounded"
                    sx={{ width: 100, height: 56 }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </div>

        {/* Site In Charge Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">
            Site In Charge
          </h3>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Name<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Name"
                value={siteInChargeName}
                sx={commonInputStyles}
                onChange={(e) => setSiteInChargeName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Signature<span className="text-red-600"> *</span>
              </label>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    onChange={handleSignatureUpload(setSiteInChargeSignature)}
                  />
                </Button>
                {siteInChargeSignature && (
                  <Avatar
                    src={siteInChargeSignature}
                    alt="Site In Charge Signature"
                    variant="rounded"
                    sx={{ width: 100, height: 56 }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </div>

        {/* Project Manager Section */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[#29346B] text-xl font-semibold mb-3">
            Project Manager
          </h3>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Name<span className="text-red-600"> *</span>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Name"
                value={projectManagerName}
                sx={commonInputStyles}
                onChange={(e) => setProjectManagerName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="block mb-1 text-[#29346B] font-semibold">
                Signature<span className="text-red-600"> *</span>
              </label>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    onChange={handleSignatureUpload(setProjectManagerSignature)}
                  />
                </Button>
                {projectManagerSignature && (
                  <Avatar
                    src={projectManagerSignature}
                    alt="Project Manager Signature"
                    variant="rounded"
                    sx={{ width: 100, height: 56 }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
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
