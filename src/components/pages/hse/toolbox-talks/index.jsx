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
  const [facultyName, setFacultyName] = useState("");
  const [topic, setTopic] = useState("");
  const [facultySignature, setFacultySignature] = useState(null);
  const [topicsDiscussed, setTopicsDiscussed] = useState([""]);
  const [participants, setParticipants] = useState([
    { name: "", designation: "", signature: null },
  ]);
  const [remarks, setRemarks] = useState("");

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!facultyName.trim()) return toast.error("Faculty Name is required!");
    if (!topic.trim()) return toast.error("Training Topic is required!");
    if (!facultySignature) return toast.error("Faculty Signature is required!");

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

  const handleFacultySignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFacultySignature(reader.result);
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
      faculty_name: facultyName,
      signature: facultySignature,
      topic: topic,
      topics_discussed: topicsDiscussed.filter((topic) => topic.trim() !== ""),
      participants: participants.map((p) => ({
        name: p.name,
        designation: p.designation,
        signature: p.signature,
      })),
      remarks: remarks,
    };

    console.log(formData);
    toast.success("Training attendance data submitted successfully!");
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