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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateHarnessInspectionMutation, useGetAllHarnessInspectionsQuery } from "../../../../api/hse/harness/harnessApi";
import { useParams } from "react-router-dom";
import commonInputStyles from "../../../../utils/commonInputStyles";
// import { useCreateHarnessInspectionMutation } from "../path/to/harnessInspectionApi"; // Update path as needed

// Add the file size constant
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

export default function HarnessInspectionDialog({ open, setOpen, onSuccess }) {
  const [site, setSite] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [dateOfInspection, setDateOfInspection] = useState("");
  const [report, setReport] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [inspectorSignature, setInspectorSignature] = useState(null);
  const [inspectorSignatureFile, setInspectorSignatureFile] = useState(null);
    // const { refetch } = useGetAllHarnessInspectionsQuery();
    const { locationId } = useParams();
  // Keeping this for future implementation
  const [visualPhysicalChecks, setVisualPhysicalChecks] = useState([
    { check: "Harness no fissure, wear or twisted strap", status: "", remarks: "" },
    { check: "Waist bucket", status: "", remarks: "" },
    { check: "Both leg Strap buckle", status: "", remarks: "" },
    { check: "Waist buckle", status: "", remarks: "" },
    { check: "Metal D ring at back for lanyard", status: "", remarks: "" },
    { check: "Buckle working (inserting and pulling)", status: "", remarks: "" },
    { check: "Harness shelf life (valid-for three years)", status: "", remarks: "" },
    { check: "No fissures, wear or twisted strap of lanyard rope", status: "", remarks: "" },
    { check: "Lanyard with two ropes", status: "", remarks: "" },
    { check: "No fissures in the sleeve", status: "", remarks: "" },
    { check: "Shock absorber, lanyard & hooks are intact", status: "", remarks: "" },
    { check: "Snap hooks mouth opening & closing", status: "", remarks: "" },
  ]);

  // RTK Query mutation hook
  const [createHarnessInspection, { isLoading }] = useCreateHarnessInspectionMutation();

  const validateForm = () => {
    if (!site.trim()){
      toast.error("Site is required!")
      return false;
    };
    if (!makeModel.trim()) {
      toast.error("Make/Model is required!");
      return false;
    }
    if (!manufacturingDate.trim()) {
      toast.error("Manufacturing Date is required!");
      return false;
    }
    if (!dateOfInspection.trim()) {
      toast.error("Date of Inspection is required!");
      return false;
    }

    for (let i = 0; i < visualPhysicalChecks.length; i++) {
      if (!visualPhysicalChecks[i].status.trim()) {
        toast.error(`Status for ${visualPhysicalChecks[i].check} is required!`);
        return false;
      }
      if (!visualPhysicalChecks[i].remarks.trim()) {
        toast.error(`Remarks for ${visualPhysicalChecks[i].check} is required!`);
        return false;
      }
    }
    
    if (!report.trim()) {
      toast.error("Report is required!");
      return false;
    }
    if (!inspectorName.trim()) {
      toast.error("Inspector Name is required!");
      return false;
    }

    if (!inspectorSignatureFile) {
      toast.error("Inspector Signature PDF is required!");
      return false;
    }

    return true;
  };

  const handleClose = () => setOpen(false);
  
  // Updated signature upload handler for PDF files
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file only');
        // Clear the input
        e.target.value = '';
        return;
      }
      
      // Check file size (15MB limit)
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 15MB');
        // Clear the input
        e.target.value = '';
        return;
      }
      
      setInspectorSignatureFile(file);
      setInspectorSignature(file); // Keep for compatibility with existing logic
    }
  };

  const handleCheckChange = (index, field, value) => {
    const newChecks = [...visualPhysicalChecks];
    newChecks[index][field] = value;
    setVisualPhysicalChecks(newChecks);
  };

  const handleSubmit = async () => {
  const isValid = validateForm();
  if (!isValid) return;

    // Create FormData object for file upload support
    const formData = new FormData();
    
    // Mapping from UI form to API model structure
    formData.append('location', locationId);
    formData.append("site_name", site);
    formData.append("make_model", makeModel);
    formData.append("manufacturing_date", manufacturingDate);
    formData.append("date_of_inspection", dateOfInspection);
    
    // Map visual physical checks to the API model fields
    const checksMap = {
      0: { status: "wear_or_twisted_strap_status", remarks: "wear_or_twisted_strap_remarks" },
      1: { status: "waist_buckle_status", remarks: "waist_buckle_remarks" },
      2: { status: "both_leg_strap_buckle_status", remarks: "both_leg_strap_buckle_remarks" },
      3: { status: "waist_buckle_status_2", remarks: "waist_buckle_remarks_2" },
      4: { status: "metal_d_ring_status", remarks: "metal_d_ring_remarks" },
      5: { status: "buckle_working_status", remarks: "buckle_working_remarks" },
      6: { status: "harness_shelf_life_status", remarks: "harness_shelf_life_remarks" },
      7: { status: "lanyard_wear_twist_status", remarks: "lanyard_wear_twist_remarks" },
      8: { status: "lanyard_two_ropes_status", remarks: "lanyard_two_ropes_remarks" },
      9: { status: "sleeve_fissures_status", remarks: "sleeve_fissures_remarks" },
      10: { status: "shock_absorber_status", remarks: "shock_absorber_remarks" },
      11: { status: "snap_hooks_status", remarks: "snap_hooks_remarks" },
    };
    
    // Add each check to the form data with correct field names
    for (let i = 0; i < visualPhysicalChecks.length; i++) {
      // Convert "OK" to true and "Not OK" to false
      const statusValue = visualPhysicalChecks[i].status === "OK";
      formData.append(checksMap[i].status, statusValue);
      formData.append(checksMap[i].remarks, visualPhysicalChecks[i].remarks);
    }
    
    formData.append("report", report);
    formData.append("inspector_name", inspectorName);
    
    // Inspector signature PDF
    if (inspectorSignatureFile) {
      formData.append("inspector_signature", inspectorSignatureFile);
    }

    try {
      const response = await createHarnessInspection(formData).unwrap();
      if (response.status) {
        toast.success(response.message || "Harness inspection submitted successfully!");
        if (onSuccess) onSuccess();
        handleClose();
        // Reset form after successful submission
        // refetch()
        resetForm();
      } else {
        toast.error("Error submitting harness inspection");
      }
    } catch (error) {
      console.error("Error submitting harness inspection:", error);
      toast.error(error.data?.message || "An error occurred while submitting the form");
    }
  };

  const resetForm = () => {
    setSite("");
    setMakeModel("");
    setManufacturingDate("");
    setDateOfInspection("");
    setReport("");
    setInspectorName("");
    setInspectorSignature(null);
    setInspectorSignatureFile(null);
    setVisualPhysicalChecks(
      visualPhysicalChecks.map(check => ({ ...check, status: "", remarks: "" }))
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Harness Inspection Form
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Harness Details Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Harness Details
            </Typography>
            <Divider />
          </Grid>

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
              Make/Model<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Make/Model"
              value={makeModel}
              sx={commonInputStyles}
              onChange={(e) => setMakeModel(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Manufacturing Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={manufacturingDate}
              sx={commonInputStyles}
              onChange={(e) => setManufacturingDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date of Inspection<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={dateOfInspection}
              sx={commonInputStyles}
              onChange={(e) => setDateOfInspection(e.target.value)}
            />
          </Grid>

          {/* Visual/Physical Checks Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Visual/Physical Checks
            </Typography>
            <Divider />
          </Grid>

          {visualPhysicalChecks.map((checkItem, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="subtitle1" className="text-[#29346B] font-semibold">
                {checkItem.check}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" color="textSecondary">
                      Status<span className="text-red-600"> *</span>
                    </Typography>
                    <RadioGroup
                      row
                      value={checkItem.status}
                      onChange={(e) =>
                        handleCheckChange(index, "status", e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="OK"
                        control={<Radio color="primary" />}
                        label="OK"
                      />
                      <FormControlLabel
                        value="Not OK"
                        control={<Radio color="primary" />}
                        label="Not OK"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={checkItem.remarks}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleCheckChange(index, "remarks", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}

          {/* Report Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2 mt-4"
            >
              Report
            </Typography>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Report"
              variant="outlined"
              multiline
              rows={4}
              placeholder="Add multiple points here..."
              value={report}
              sx={commonInputStyles}
              onChange={(e) => setReport(e.target.value)}
            />
          </Grid>

          {/* Inspector Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2 mt-4"
            >
              Inspector Information
            </Typography>
            <Divider />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Inspector Name"
              variant="outlined"
              placeholder="Enter inspector's name"
              value={inspectorName}
              sx={commonInputStyles}
              onChange={(e) => setInspectorName(e.target.value)}
            />
          </Grid>
          
          {/* Inspector Signature PDF Upload */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Signature PDF (Max 15MB)<span className="text-red-600"> *</span>
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
                Upload Signature PDF
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleSignatureUpload}
                />
              </Button>
              {inspectorSignatureFile && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" display="block">
                    File: {inspectorSignatureFile.name}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Size: {(inspectorSignatureFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
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