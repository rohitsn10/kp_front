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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toast } from "react-toastify";
import { useCreateInductionTrainingMutation } from "../../../../api/hse/induction/inductionApi";
import { useParams } from "react-router-dom";

export default function TrainingInductionDialog({ open, setOpen, onSuccess }) {
  // Initialize the RTK mutation hook
  const [createInductionTraining, { isLoading }] = useCreateInductionTrainingMutation();
  const { locationId } = useParams();
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [topic, setTopic] = useState("");
  const [facultySignature, setFacultySignature] = useState(null);
  const [facultySignatureName, setFacultySignatureName] = useState("");
  
  // Individual state for each topic
  const [topic1, setTopic1] = useState("");
  const [topic2, setTopic2] = useState("");
  const [topic3, setTopic3] = useState("");
  const [topic4, setTopic4] = useState("");
  const [topic5, setTopic5] = useState("");
  const [topic6, setTopic6] = useState("");
  const [topic7, setTopic7] = useState("");
  const [topic8, setTopic8] = useState("");
  const [topic9, setTopic9] = useState("");
  const [topic10, setTopic10] = useState("");
  const [topic11, setTopic11] = useState("");
  const [topic12, setTopic12] = useState("");
  const [topic13, setTopic13] = useState("");
  const [topic14, setTopic14] = useState("");
  
  const [participantsFile, setParticipantsFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const validateForm = () => {
    // Validation checks - return false after showing error to prevent submission
    if (!site.trim()) {
      toast.error("Site is required!");
      return false;
    }
    
    if (!date.trim()) {
      toast.error("Date is required!");
      return false;
    }
    
    if (!facultyName.trim()) {
      toast.error("Faculty Name is required!");
      return false;
    }
    
    if (!topic.trim()) {
      toast.error("Training Topic is required!");
      return false;
    }
    
    if (!facultySignature) {
      toast.error("Faculty Signature PDF is required!");
      return false;
    }
    
    // Check if at least one topic has a value
    const hasAtLeastOneTopic = 
      topic1.trim() !== "" || 
      topic2.trim() !== "" || 
      topic3.trim() !== "" || 
      topic4.trim() !== "" || 
      topic5.trim() !== "" || 
      topic6.trim() !== "" || 
      topic7.trim() !== "" || 
      topic8.trim() !== "" || 
      topic9.trim() !== "" || 
      topic10.trim() !== "" || 
      topic11.trim() !== "" || 
      topic12.trim() !== "" || 
      topic13.trim() !== "" || 
      topic14.trim() !== "";
      
    if (!hasAtLeastOneTopic) {
      toast.error("At least one topic must be filled!");
      return false;
    }
    
    if (!participantsFile) {
      toast.error("Participants file is required!");
      return false;
    }

    // All validations passed
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
      
      // Store the file directly for FormData
      setFacultySignature(file);
      setFacultySignatureName(file.name);
    }
  };

  const handleParticipantsFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is Excel or Word (based on your API which accepts docx)
      const validExtensions = ['.xlsx', '.xls', '.csv', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error("Please upload a valid Excel, Word or CSV file!");
        return;
      }
      
      setParticipantsFile(file);
    }
  };

  const handleSubmit = async () => {
    // Validate the form before submission
    if (!validateForm()) {
      return; // Stop execution if validation fails
    }

    // Create FormData object
    const formData = new FormData();
    
    // Append basic fields (matching the API endpoint field names)
    formData.append('location', locationId)
    formData.append("site_name", site);
    formData.append("date", date);
    formData.append("faculty_name", facultyName);
    formData.append("training_topics", topic);
    
    // Append faculty signature
    if (facultySignature) {
      formData.append("faculty_signature", facultySignature); 
    }
    
    // Append each topic individually
    if (topic1.trim() !== "") formData.append("topic_1", topic1);
    if (topic2.trim() !== "") formData.append("topic_2", topic2);
    if (topic3.trim() !== "") formData.append("topic_3", topic3);
    if (topic4.trim() !== "") formData.append("topic_4", topic4);
    if (topic5.trim() !== "") formData.append("topic_5", topic5);
    if (topic6.trim() !== "") formData.append("topic_6", topic6);
    if (topic7.trim() !== "") formData.append("topic_7", topic7);
    if (topic8.trim() !== "") formData.append("topic_8", topic8);
    if (topic9.trim() !== "") formData.append("topic_9", topic9);
    if (topic10.trim() !== "") formData.append("topic_10", topic10);
    if (topic11.trim() !== "") formData.append("topic_11", topic11);
    if (topic12.trim() !== "") formData.append("topic_12", topic12);
    if (topic13.trim() !== "") formData.append("topic_13", topic13);
    if (topic14.trim() !== "") formData.append("topic_14", topic14);
    
    // Append participants file
    if (participantsFile) {
      formData.append("participants_file", participantsFile);
    }
    
    // Add remarks if needed (not in the original CURL request but might be useful)
    if (remarks.trim() !== "") formData.append("remarks", remarks);

    try {
      // Call the RTK mutation to send the data to the API
      const response = await createInductionTraining(formData).unwrap();
      
      // Check if the response status is successful
      if (response && response.status === true) {
        // Success handling
        console.log("API Response:", response);
        toast.success(response.message || "Induction training data submitted successfully!");
        // Close the dialog and reset form if needed
        setOpen(false);
        onSuccess();
      } else {
        // Handle case where API returns a failure status
        toast.error(response?.message || "Failed to submit training data. Please try again.");
      }
    } catch (error) {
      // Error handling for network/server errors
      console.error("API Error:", error);
      toast.error(error.data?.message || "Failed to submit training data. Please try again.");
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
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => {
                      setFacultySignature(null);
                      setFacultySignatureName("");
                    }}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Upload signed PDF (Max: 15MB)
            </Typography>
          </Grid>

          {/* Topics Discussed Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Topics Discussed<span className="text-red-600"> *</span>
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="1. Site/Plant familiarization"
                  value={topic1}
                  onChange={(e) => setTopic1(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="2. Company Policy and Objectives"
                  value={topic2}
                  onChange={(e) => setTopic2(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="3. Standard operating procedures /Checklists"
                  value={topic3}
                  onChange={(e) => setTopic3(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="4. Use of fire-fighting equipment"
                  value={topic4}
                  onChange={(e) => setTopic4(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="5. Displayed Emergency Contact Details"
                  value={topic5}
                  onChange={(e) => setTopic5(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="6. Assemble Point"
                  value={topic6}
                  onChange={(e) => setTopic6(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="7. Mandatory PPEs"
                  value={topic7}
                  onChange={(e) => setTopic7(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="8. Restricted Area"
                  value={topic8}
                  onChange={(e) => setTopic8(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="9. Location of Drinking Water & Wash Room"
                  value={topic9}
                  onChange={(e) => setTopic9(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="10. No Alcohol Consumption inside Plant/Site"
                  value={topic10}
                  onChange={(e) => setTopic10(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="11. Smoking Zone"
                  value={topic11}
                  onChange={(e) => setTopic11(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="12. Speed Limit"
                  value={topic12}
                  onChange={(e) => setTopic12(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="13. Display ID Card"
                  value={topic13}
                  onChange={(e) => setTopic13(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="14. Other"
                  value={topic14}
                  onChange={(e) => setTopic14(e.target.value)}
                  sx={commonInputStyles}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Participants Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" className="text-[#29346B] font-semibold">
                Participants<span className="text-red-600"> *</span>
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Excel Upload for Participants */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
                border: "1px dashed #29346B",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: "#29346B", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Upload Participants File
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
                Upload an Excel file (.xlsx, .xls), Word file (.docx, .doc) or CSV file with participants information
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Select File
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.doc,.docx"
                  hidden
                  onChange={handleParticipantsFileUpload}
                />
              </Button>
              {participantsFile && (
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    {participantsFile.name} ({Math.round(participantsFile.size / 1024)} KB)
                  </Typography>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => setParticipantsFile(null)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
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
          disabled={isLoading}
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
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}