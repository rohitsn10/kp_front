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

export default function HarnessInspectionDialog({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [dateOfInspection, setDateOfInspection] = useState("");
  const [report, setReport] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [inspectorSignature, setInspectorSignature] = useState("");
  const [visualPhysicalChecks, setVisualPhysicalChecks] = useState([
    // Removed "Visual / Physical Checks" from the list
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

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!makeModel.trim()) return toast.error("Make/Model is required!");
    if (!manufacturingDate.trim()) return toast.error("Manufacturing Date is required!");
    if (!dateOfInspection.trim()) return toast.error("Date of Inspection is required!");

    for (let i = 0; i < visualPhysicalChecks.length; i++) {
      if (!visualPhysicalChecks[i].status.trim())
        return toast.error(`Status for ${visualPhysicalChecks[i].check} is required!`);
      if (!visualPhysicalChecks[i].remarks.trim())
        return toast.error(`Remarks for ${visualPhysicalChecks[i].check} is required!`);
    }
    
    if (!report.trim()) return toast.error("Report is required!");
    if (!inspectorName.trim()) return toast.error("Inspector Name is required!");
    if (!inspectorSignature.trim()) return toast.error("Inspector Signature is required!");

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

  const handleCheckChange = (index, field, value) => {
    const newChecks = [...visualPhysicalChecks];
    newChecks[index][field] = value;
    setVisualPhysicalChecks(newChecks);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      site: site,
      make_model: makeModel,
      manufacturing_date: manufacturingDate,
      date_of_inspection: dateOfInspection,
      visual_physical_checks: visualPhysicalChecks,
      report: report,
      inspector_name: inspectorName,
      inspector_signature: inspectorSignature,
    };

    console.log(formData);
    toast.success("Harness inspection data submitted successfully!");
    setOpen(false);
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
                  {/* Changed from TextField to RadioGroup for Status */}
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
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Inspector Signature"
              variant="outlined"
              placeholder="Enter inspector's signature"
              value={inspectorSignature}
              sx={commonInputStyles}
              onChange={(e) => setInspectorSignature(e.target.value)}
            />
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