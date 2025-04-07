import React, { useState, useEffect } from "react";
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
  IconButton,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function AttendanceFormDialog({ open, setOpen, onSubmit, initialData = {} }) {
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendees, setAttendees] = useState([
    { name: "", designation: "", signature: null },
  ]);

  // Set initial data when provided and dialog opens
  useEffect(() => {
    if (open && initialData) {
      if (initialData.site) setSite(initialData.site);
      if (initialData.date) setDate(initialData.date);
      if (initialData.time) setTime(initialData.time);
    }
  }, [open, initialData]);

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!time.trim()) return toast.error("Time is required!");

    if (attendees.length === 0) return toast.error("At least one attendee is required!");

    for (let i = 0; i < attendees.length; i++) {
      if (!attendees[i].name.trim()) return toast.error(`Attendee ${i + 1} name is required!`);
      if (!attendees[i].designation.trim()) return toast.error(`Attendee ${i + 1} designation is required!`);
      if (!attendees[i].signature) return toast.error(`Attendee ${i + 1} signature is required!`);
    }

    return true;
  };

  const handleClose = () => {
    // Reset form when closing
    if (!initialData.site) setSite("");
    if (!initialData.date) setDate("");
    if (!initialData.time) setTime("");
    setAttendees([{ name: "", designation: "", signature: null }]);
    setOpen(false);
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

  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: "", designation: "", signature: null }]);
  };

  const handleRemoveAttendee = (index) => {
    const newAttendees = [...attendees];
    newAttendees.splice(index, 1);
    setAttendees(newAttendees);
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handleAttendeeSignatureUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleAttendeeChange(index, "signature", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      site: site,
      date: date,
      time: time,
      attendance: attendees.map(a => ({
        name: a.name,
        designation: a.designation,
        signature: a.signature, // In a real implementation, this would be the URL returned from the server
      })),
    };

    console.log(formData);
    
    if (onSubmit) {
      onSubmit(formData);
    }
    
    toast.success("Attendance data submitted successfully!");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Record Attendance
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Site Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Site Information
            </Typography>
            <Divider />
          </Grid>

          {/* Site, Date & Time */}
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Time<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="time"
              value={time}
              sx={commonInputStyles}
              onChange={(e) => setTime(e.target.value)}
            />
          </Grid>

          {/* Attendance Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Attendees
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAttendee}
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Add Attendee
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Attendee List */}
          <Grid item xs={12}>
            {attendees.map((attendee, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #e0e0e0",
                  position: "relative",
                }}
              >
                <IconButton
                  color="error"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleRemoveAttendee(index)}
                  disabled={attendees.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
                
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Attendee {index + 1}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      value={attendee.name}
                      required
                      onChange={(e) =>
                        handleAttendeeChange(index, "name", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      variant="outlined"
                      value={attendee.designation}
                      required
                      onChange={(e) =>
                        handleAttendeeChange(index, "designation", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                      >
                        Upload Signature
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleAttendeeSignatureUpload(index, e)}
                        />
                      </Button>
                      {attendee.signature && (
                        <Avatar
                          src={attendee.signature}
                          alt="Attendee Signature"
                          variant="rounded"
                          sx={{ width: 100, height: 56 }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
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