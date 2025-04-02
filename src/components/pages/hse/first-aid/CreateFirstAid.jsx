import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";

export default function IncidentReportDialog({ open, setOpen }) {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeOf, setEmployeeOf] = useState("");
  const [description, setDescription] = useState("");

  const validateForm = () => {
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      date: date,
      name: name,
      designation: designation,
      employee_of: employeeOf,
      description: description,
    };

    console.log(formData);
    toast.success("Incident report submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        First Aid
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
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