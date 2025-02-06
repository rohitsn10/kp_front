import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify"; // Import toast for notifications
import { useGetSfaDataQuery, useAddSfaDataToLandBankMutation } from "../../../api/sfa/sfaApi";

const AssessmentFormModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    sfa_name: "",
    land_sfa_file: [],
    sfa_for_transmission_line_gss_files: [],
    timeline: "",
    solar_or_winds: "",
    date_of_assessment: "",
    site_visit_date: "",
  });

  const [addSfaDataToLandBank] = useAddSfaDataToLandBankMutation(); // Initialize the mutation hook
  const { refetch } = useGetSfaDataQuery();

  // Function to validate the form
  const validateForm = () => {
    if (!formData.sfa_name || !formData.timeline || !formData.solar_or_winds || !formData.date_of_assessment || !formData.site_visit_date) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    
    // Check if files are selected for each input field
    if (formData.land_sfa_file.length === 0 || formData.sfa_for_transmission_line_gss_files.length === 0) {
      toast.error("Please upload files for both land SFA and transmission line GSS.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Only proceed if the form is valid

    const formDataToSend = new FormData();
    formDataToSend.append("sfa_name", formData.sfa_name);
    
    // Append files to FormData
    formData.land_sfa_file.forEach((file) => formDataToSend.append("land_sfa_file", file));
    formData.sfa_for_transmission_line_gss_files.forEach((file) => formDataToSend.append("sfa_for_transmission_line_gss_files", file));
    
    formDataToSend.append("timeline", formData.timeline);
    formDataToSend.append("solar_or_winds", formData.solar_or_winds);
    formDataToSend.append("date_of_assessment", formData.date_of_assessment);
    formDataToSend.append("site_visit_date", formData.site_visit_date);

    try {
      await addSfaDataToLandBank(formDataToSend);
      toast.success("SFA data added successfully!");
      refetch();
      handleClose();
    } catch (error) {
      toast.error("Failed to add SFA data. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    setFormData({ ...formData, [field]: Array.from(files) }); // Convert FileList to an array
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
      padding: "2px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      outline: "none",
      borderBottom: "4px solid #E6A015",
    },
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          color: "#29346B",
          fontSize: "27px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        SFA Form
      </DialogTitle>
      <DialogContent>
        <TextField
          label="SFA Name"
          name="sfa_name"
          value={formData.sfa_name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
        />
        
        {/* <input
          type="file"
          name="land_sfa_file"
          multiple // Allow multiple file selection
          onChange={(e) => handleFileChange(e, "land_sfa_file")}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        /> */}

<div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Land SFA File
                </label>
                <input
                  type="file"
                  name="land_sfa_file"
                  multiple // Allow multiple file selection
                  onChange={(e) => handleFileChange(e, "land_sfa_file")}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                />
              </div>

        {/* <input
          type="file"
          name="sfa_for_transmission_line_gss_files"
          multiple // Allow multiple file selection
          onChange={(e) => handleFileChange(e, "sfa_for_transmission_line_gss_files")}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        /> */}

              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  SFA For Transmission Line GSS Files
                </label>
                <input
                  type="file"
                  name="sfa_for_transmission_line_gss_files"
                  multiple // Allow multiple file selection
                  onChange={(e) => handleFileChange(e, "sfa_for_transmission_line_gss_files")}
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                />
              </div>

        <TextField
          label="Timeline"
          name="timeline"
          type="date"
          value={formData.timeline}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Solar or Wind"
          name="solar_or_winds"
          select
          value={formData.solar_or_winds}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
        >
          <MenuItem value="Solar">Solar</MenuItem>
          <MenuItem value="Wind">Wind</MenuItem>
        </TextField>

        <TextField
          label="Date of Assessment"
          name="date_of_assessment"
          type="date"
          value={formData.date_of_assessment}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Site Visit Date"
          name="site_visit_date"
          type="date"
          value={formData.site_visit_date}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            backgroundColor: "#f6812d",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "6px 36px",
            width: "200px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#E66A1F" },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentFormModal;
