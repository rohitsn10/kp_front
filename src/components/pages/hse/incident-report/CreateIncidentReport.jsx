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
  Box,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";

export default function IncidentNearMissReportDialog({ open, setOpen }) {
  const [nameOfSite, setNameOfSite] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfOccurrence, setDateOfOccurrence] = useState("");
  const [dateOfReport, setDateOfReport] = useState("");
  const [incidentNearMissReportedBy, setIncidentNearMissReportedBy] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [category, setCategory] = useState("");
  const [descriptionOfIncidentNearMiss, setDescriptionOfIncidentNearMiss] =
    useState("");
  const [immediateActionTaken, setImmediateActionTaken] = useState("");
  const [apparentCause, setApparentCause] = useState("");
  const [preventiveAction, setPreventiveAction] = useState("");
  const [reviewByMembers, setReviewByMembers] = useState([
    { name: "", signature: null },
    { name: "", signature: null },
    { name: "", signature: null },
  ]);
  const [reviewBySiteInCharge, setReviewBySiteInCharge] = useState({
    name: "",
    designation: "",
    signature: null,
  });

  const validateForm = () => {
    if (!nameOfSite.trim()) return toast.error("Name of Site is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!dateOfOccurrence.trim()) return toast.error("Date of Occurrence is required!");
    if (!dateOfReport.trim()) return toast.error("Date of Report is required!");
    if (!incidentNearMissReportedBy.trim())
      return toast.error("Incident/Near Miss Reported By is required!");
    if (!designation.trim()) return toast.error("Designation is required!");
    if (!employeeCode.trim()) return toast.error("Employee Code is required!");
    if (!vendorName.trim()) return toast.error("Vendor Name is required!");
    if (!category.trim()) return toast.error("Category is required!");
    if (!descriptionOfIncidentNearMiss.trim())
      return toast.error("Description of Incident/Near Miss is required!");
    if (!immediateActionTaken.trim())
      return toast.error("Immediate Action Taken is required!");
    if (!apparentCause.trim()) return toast.error("Apparent Cause is required!");
    if (!preventiveAction.trim()) return toast.error("Preventive Action is required!");

    for (let i = 0; i < reviewByMembers.length; i++) {
      if (!reviewByMembers[i].name.trim())
        return toast.error(`Review Member ${i + 1} Name is required!`);
      if (!reviewByMembers[i].signature)
        return toast.error(`Review Member ${i + 1} Signature is required!`);
    }

    if (!reviewBySiteInCharge.name.trim())
      return toast.error("Review By Site In-Charge Name is required!");
    if (!reviewBySiteInCharge.designation.trim())
      return toast.error("Review By Site In-Charge Designation is required!");
    if (!reviewBySiteInCharge.signature)
      return toast.error("Review By Site In-Charge Signature is required!");

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

  const handleMemberSignatureUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newMembers = [...reviewByMembers];
        newMembers[index].signature = reader.result;
        setReviewByMembers(newMembers);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSiteInChargeSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReviewBySiteInCharge({
          ...reviewBySiteInCharge,
          signature: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      name_of_site: nameOfSite,
      location: location,
      date_of_occurrence: dateOfOccurrence,
      date_of_report: dateOfReport,
      incident_near_miss_reported_by: incidentNearMissReportedBy,
      designation: designation,
      employee_code: employeeCode,
      vendor_name: vendorName,
      category: category,
      description_of_incident_near_miss: descriptionOfIncidentNearMiss,
      immediate_action_taken: immediateActionTaken,
      apparent_cause: apparentCause,
      preventive_action: preventiveAction,
      review_by_members: reviewByMembers,
      review_by_site_in_charge: reviewBySiteInCharge,
    };

    console.log(formData);
    toast.success("Incident/Near Miss report submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Incident / Near Miss Report
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Incident Details Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Incident Details
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Name of Site<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name of Site"
              value={nameOfSite}
              sx={commonInputStyles}
              onChange={(e) => setNameOfSite(e.target.value)}
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

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date of Occurrence<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={dateOfOccurrence}
              sx={commonInputStyles}
              onChange={(e) => setDateOfOccurrence(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date of Report<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={dateOfReport}
              sx={commonInputStyles}
              onChange={(e) => setDateOfReport(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Incident/Near Miss Reported By<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Reported By"
              value={incidentNearMissReportedBy}
              sx={commonInputStyles}
              onChange={(e) => setIncidentNearMissReportedBy(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Designation<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Designation"
              value={designation}
              sx={commonInputStyles}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Employee Code<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Employee Code"
              value={employeeCode}
              sx={commonInputStyles}
              onChange={(e) => setEmployeeCode(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Vendor Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Vendor Name"
              value={vendorName}
              sx={commonInputStyles}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Category<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Category"
              value={category}
              sx={commonInputStyles}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Description of Incident/Near Miss<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Description of Incident/Near Miss"
              value={descriptionOfIncidentNearMiss}
              sx={commonInputStyles}
              onChange={(e) => setDescriptionOfIncidentNearMiss(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Immediate Action Taken<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Immediate Action Taken"
              value={immediateActionTaken}
              sx={commonInputStyles}
              onChange={(e) => setImmediateActionTaken(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Apparent Cause<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Apparent Cause"
              value={apparentCause}
              sx={commonInputStyles}
              onChange={(e) => setApparentCause(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Preventive Action<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Preventive Action"
              value={preventiveAction}
              sx={commonInputStyles}
              onChange={(e) => setPreventiveAction(e.target.value)}
            />
          </Grid>

          {/* Review By Members Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Review By Members
            </Typography>
            <Divider />
          </Grid>

          {reviewByMembers.map((member, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="subtitle1" className="text-[#29346B] font-semibold">
                Review Member {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={member.name}
                    sx={commonInputStyles}
                    onChange={(e) => {
                      const newMembers = [...reviewByMembers];
                      newMembers[index].name = e.target.value;
                      setReviewByMembers(newMembers);
                    }}
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
                      sx={{ height: "56px" }}
                    >
                      Upload Signature
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleMemberSignatureUpload(index, e)}
                      />
                    </Button>
                    {member.signature && (
                      <Avatar
                        src={member.signature}
                        alt={`Member ${index + 1} Signature`}
                        variant="rounded"
                        sx={{ width: 100, height: 56 }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ))}

          {/* Review By Site In-Charge Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Review By Site In-Charge
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={reviewBySiteInCharge.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setReviewBySiteInCharge({
                  ...reviewBySiteInCharge,
                  name: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Designation<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Designation"
              value={reviewBySiteInCharge.designation}
              sx={commonInputStyles}
              onChange={(e) =>
                setReviewBySiteInCharge({
                  ...reviewBySiteInCharge,
                  designation: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
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
                  onChange={handleSiteInChargeSignatureUpload}
                />
              </Button>
              {reviewBySiteInCharge.signature && (
                <Avatar
                  src={reviewBySiteInCharge.signature}
                  alt="Site In-Charge Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
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