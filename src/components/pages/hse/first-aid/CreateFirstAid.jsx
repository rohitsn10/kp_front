import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateFirstAidRecordMutation } from "../../../../api/hse/firstAidRecord/firstAidRecordApi";
import { useParams } from "react-router-dom";
// import { useCreateFirstAidRecordMutation } from "./firstAidRecordApi"; // Import the mutation hook

export default function FirstAidDialog({ open, setOpen,onSuccess }) {
  // State for form fields
  const [siteName, setSiteName] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeOf, setEmployeeOf] = useState("");
  const [description, setDescription] = useState("");
  const { locationId } = useParams();
  // RTK Query mutation hook
  const [createFirstAidRecord, { isLoading }] = useCreateFirstAidRecordMutation();

  const validateForm = () => {
    if (!siteName.trim()) return toast.error("Site name is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!name.trim()) return toast.error("Name is required!");
    if (!designation.trim()) return toast.error("Designation is required!");
    if (!employeeOf.trim()) return toast.error("Employee Of is required!");
    if (!description.trim()) return toast.error("Description is required!");

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create FormData object for API submission
    const formData = new FormData();
    formData.append("site_name", siteName);
    formData.append("location", locationId); // You may want to make this dynamic
    formData.append("date", date);
    formData.append("first_aid_name", name); // Changed from "name" to "first_aid_name"
    formData.append("designation", designation);
    formData.append("employee_of", employeeOf);
    formData.append("description", description);

    try {
      // Call the API using the RTK Query mutation hook
      const response = await createFirstAidRecord(formData).unwrap();
      
      // Check response status
      if (response.status === true) {
        toast.success(response.message || "First aid record submitted successfully!");
        onSuccess();
        setOpen(false);
        
        // Reset form fields
        setSiteName("");
        setDate("");
        setName("");
        setDesignation("");
        setEmployeeOf("");
        setDescription("");
      } else {
        // Handle error from API
        toast.error(response.message || "Failed to submit first aid record");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error submitting first aid record:", error);
      toast.error(error.data?.message || "An error occurred while submitting the form");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        First Aid
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Site Name - New field */}
          <Grid item xs={12}>
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
          </Grid>

          {/* Date */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={date}
              sx={commonInputStyles}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>

          {/* Name */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Name"
              value={name}
              sx={commonInputStyles}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          {/* Designation */}
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

          {/* Employee Of */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Employee Of<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Employee Of"
              value={employeeOf}
              sx={commonInputStyles}
              onChange={(e) => setEmployeeOf(e.target.value)}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Description<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Description"
              value={description}
              sx={commonInputStyles}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="secondary" 
          variant="outlined"
          disabled={isLoading}
        >
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
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}