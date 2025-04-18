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

export default function TrainingAttendanceDialog({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [facultySignature, setFacultySignature] = useState(null);
  const [participantDoc, setParticipantDoc] = useState(null);
  const [participantDocName, setParticipantDocName] = useState("");

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!facultyName.trim()) return toast.error("Faculty Name is required!");
    if (!topic.trim()) return toast.error("Training Topic is required!");
    if (!facultySignature) return toast.error("Faculty Signature is required!");
    if (!participantDoc) return toast.error("Participant document is required!");

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

  const handleFacultySignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you'd upload this file to a server
      // and get back a URL. For this example, we'll create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setFacultySignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParticipantDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParticipantDoc(file);
      setParticipantDocName(file.name);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Create FormData object to handle file uploads
    const formData = new FormData();
    formData.append("site", site);
    formData.append("date", date);
    formData.append("faculty_name", facultyName);
    formData.append("topic", topic);
    formData.append("remarks", remarks);
    
    // In a real implementation, you would handle the signature file differently
    // Here we're just appending the dataURL, but in practice you'd upload the file
    // and get a URL from the server
    formData.append("faculty_signature", facultySignature);
    
    // Append the participant document
    formData.append("participant_document", participantDoc);

    // Log the FormData (for demonstration purposes)
    console.log("Form data to be submitted:", {
      site,
      date,
      faculty_name: facultyName,
      topic,
      remarks,
      participant_document: participantDocName
    });
    
    toast.success("Training attendance data submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Training Attendance Form
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Training Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Training Details
            </Typography>
            <Divider />
          </Grid>

          {/* Site & Date */}
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

          {/* Topic */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Training Topic<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Training Topic"
              value={topic}
              sx={commonInputStyles}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Remarks
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Remarks (Optional)"
              value={remarks}
              multiline
              rows={3}
              sx={commonInputStyles}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Grid>

          {/* Faculty Information */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Faculty Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Faculty Name"
              value={facultyName}
              sx={commonInputStyles}
              onChange={(e) => setFacultyName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Faculty Signature<span className="text-red-600"> *</span>
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
                  onChange={handleFacultySignatureUpload}
                />
              </Button>
              {facultySignature && (
                <Avatar
                  src={facultySignature}
                  alt="Faculty Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Participant Document Upload Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Participants
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Participant Document<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: 2,
              }}
            >
              <Button
                variant="outlined"
                component="label"
                color="primary"
                sx={{ height: "56px" }}
              >
                Upload Document
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  hidden
                  onChange={handleParticipantDocUpload}
                />
              </Button>
              {participantDocName && (
                <Typography>
                  {participantDocName}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX
            </Typography>
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