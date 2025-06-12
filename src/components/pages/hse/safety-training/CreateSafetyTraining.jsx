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
import { useParams } from "react-router-dom";
import { useCreateSafetyTrainingAttendanceMutation } from "../../../../api/hse/safetyTraining/safetyTrainingApi";
import commonInputStyles from "../../../../utils/commonInputStyles";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function TrainingAttendanceDialog({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");
  const [facultySignature, setFacultySignature] = useState(null);
  const [facultySignatureName, setFacultySignatureName] = useState("");
  const [participantDoc, setParticipantDoc] = useState(null);
  const [participantDocName, setParticipantDocName] = useState("");
  const { locationId } = useParams();
  const [createAttendance, { isLoading }] = useCreateSafetyTrainingAttendanceMutation();
  
  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!facultyName.trim()) return toast.error("Faculty Name is required!");
    if (!topic.trim()) return toast.error("Training Topic is required!");
    if (!facultySignature) return toast.error("Faculty Signature PDF is required!");
    if (!participantDoc) return toast.error("Participant document is required!");

    return true;
  };

  const handleClose = () => setOpen(false);

  const handleFacultySignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file for faculty signature!");
        return;
      }
      
      // Check file size (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Faculty signature PDF must be less than 15MB!");
        return;
      }
      
      setFacultySignature(file);
      setFacultySignatureName(file.name);
    }
  };

  const handleParticipantDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParticipantDoc(file);
      setParticipantDocName(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append("site_name", site);
    formData.append("date", date);
    formData.append("faculty_name", facultyName);
    formData.append("training_topic", topic);
    formData.append("remarks", remarks);
    formData.append("location", locationId);
  
    // Append the PDF signature file directly
    formData.append("trainer_signature", facultySignature);
  
    formData.append("file_upload", participantDoc);
  
    try {
      const response = await createAttendance(formData).unwrap();
      toast.success(response.message || "Training attendance submitted successfully!");
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong while submitting the form.");
    }
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
              Faculty Signature PDF<span className="text-red-600"> *</span>
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
                  onChange={handleFacultySignatureUpload}
                />
              </Button>
              {facultySignature && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "8px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <PictureAsPdfIcon color="error" />
                  <Typography variant="body2">
                    {facultySignatureName}
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Upload signed PDF (Max: 15MB)
            </Typography>
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