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
  IconButton,
  Paper,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function ToolboxAttendanceDialog({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [permitNo, setPermitNo] = useState("");
  const [permitDate, setPermitDate] = useState("");
  const [conductorName, setConductorName] = useState("");
  const [conductorSignature, setConductorSignature] = useState(null);
  const [contractorName, setContractorName] = useState("");
  const [jobActivity, setJobActivity] = useState("");
  const [topicsDiscussed, setTopicsDiscussed] = useState([""]);
  const [participants, setParticipants] = useState([
    { name: "", designation: "", signature: null },
  ]);
  const [remarks, setRemarks] = useState("");

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!time.trim()) return toast.error("Time is required!");
    if (!permitNo.trim()) return toast.error("TBT Against Permit No. is required!");
    if (!permitDate.trim()) return toast.error("Permit Date is required!");
    if (!conductorName.trim()) return toast.error("TBT Conductor Name is required!");
    if (!conductorSignature) return toast.error("TBT Conductor Signature is required!");
    if (!contractorName.trim()) return toast.error("Name of contractor is required!");
    if (!jobActivity.trim()) return toast.error("Job activity details are required!");

    if (participants.length === 0)
      return toast.error("At least one participant is required!");

    for (let i = 0; i < participants.length; i++) {
      if (!participants[i].name.trim())
        return toast.error(`Participant ${i + 1} name is required!`);
      if (!participants[i].designation.trim())
        return toast.error(`Participant ${i + 1} designation is required!`);
      if (!participants[i].signature)
        return toast.error(`Participant ${i + 1} signature is required!`);
    }

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
  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { name: "", designation: "", signature: null },
    ]);
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const handleConductorSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setConductorSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParticipantSignatureUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleParticipantChange(index, "signature", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTopic = () => {
    setTopicsDiscussed([...topicsDiscussed, ""]);
  };

  const handleRemoveTopic = (index) => {
    const newTopics = [...topicsDiscussed];
    newTopics.splice(index, 1);
    setTopicsDiscussed(newTopics);
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topicsDiscussed];
    newTopics[index] = value;
    setTopicsDiscussed(newTopics);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      site: site,
      date: date,
      time: time,
      permit_no: permitNo,
      permit_date: permitDate,
      conductor_name: conductorName,
      conductor_signature: conductorSignature,
      contractor_name: contractorName,
      job_activity: jobActivity,
      topics_discussed: topicsDiscussed.filter((topic) => topic.trim() !== ""),
      participants: participants.map((p) => ({
        name: p.name,
        designation: p.designation,
        signature: p.signature,
      })),
      remarks: remarks,
    };

    console.log(formData);
    toast.success("Toolbox talk attendance data submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Toolbox talk attendance
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Training Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              TBT Details
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

          {/* Permit Number & Date */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              TBT Against Permit No.<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Permit Number"
              value={permitNo}
              sx={commonInputStyles}
              onChange={(e) => setPermitNo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Permit Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={permitDate}
              sx={commonInputStyles}
              onChange={(e) => setPermitDate(e.target.value)}
            />
          </Grid>

          {/* TBT Conductor Information */}
          <Grid item xs={12}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2 mt-2">
              TBT Conducted by
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
              placeholder="Enter Conductor's Name"
              value={conductorName}
              sx={commonInputStyles}
              onChange={(e) => setConductorName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
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
                  onChange={handleConductorSignatureUpload}
                />
              </Button>
              {conductorSignature && (
                <Avatar
                  src={conductorSignature}
                  alt="Conductor Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
          </Grid>

          {/* Contractor & Job Activity */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Name of contractor<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Contractor Name"
              value={contractorName}
              sx={commonInputStyles}
              onChange={(e) => setContractorName(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Job activity in details<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Job Activity Details"
              value={jobActivity}
              sx={commonInputStyles}
              onChange={(e) => setJobActivity(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          {/* Topics Discussed Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Topics Discussed
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTopic}
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Add Topic
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <List>
              {topicsDiscussed.map((topic, index) => (
                <ListItem key={index}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={`Topic ${index + 1}`}
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                  />
                  {topicsDiscussed.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTopic(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Participants Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Participants
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddParticipant}
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Add Participant
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Participant List */}
          <Grid item xs={12}>
            {participants.map((participant, index) => (
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
                  onClick={() => handleRemoveParticipant(index)}
                  disabled={participants.length === 1}
                >
                  <DeleteIcon />
                </IconButton>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Participant {index + 1}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      value={participant.name}
                      required
                      onChange={(e) =>
                        handleParticipantChange(index, "name", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      variant="outlined"
                      value={participant.designation}
                      required
                      onChange={(e) =>
                        handleParticipantChange(index, "designation", e.target.value)
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
                          onChange={(e) => handleParticipantSignatureUpload(index, e)}
                        />
                      </Button>
                      {participant.signature && (
                        <Avatar
                          src={participant.signature}
                          alt="Participant Signature"
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
          {/* Remarks */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Remarks
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter remarks"
              value={remarks}
              sx={commonInputStyles}
              onChange={(e) => setRemarks(e.target.value)}
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