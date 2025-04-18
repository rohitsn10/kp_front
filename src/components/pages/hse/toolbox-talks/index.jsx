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
import { useCreateToolTalkAttendanceMutation, useGetToolTalkAttendanceQuery } from "../../../../api/hse/toolbox/toolBoxApi";
import { useParams } from "react-router-dom";
// import { useCreateToolTalkAttendanceMutation } from "../path/to/toolTalkAttendanceApi"; // Update with your actual path

export default function ToolboxAttendanceDialog({ open, setOpen }) {
  const [createToolTalkAttendance, { isLoading }] = useCreateToolTalkAttendanceMutation();
  const { refetch } = useGetToolTalkAttendanceQuery();
  const { locationId } = useParams();
  const [site, setSite] = useState("");
  const [location, setLocation] = useState(locationId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [permitNo, setPermitNo] = useState("");
  const [permitDate, setPermitDate] = useState("");
  const [conductorName, setConductorName] = useState("");
  const [conductorSignature, setConductorSignature] = useState(null);
  const [conductorSignatureFile, setConductorSignatureFile] = useState(null);
  const [contractorName, setContractorName] = useState("");
  const [jobActivity, setJobActivity] = useState("");
  const [participantAttachments, setParticipantAttachments] = useState(null);
  const [participantAttachmentsFile, setParticipantAttachmentsFile] = useState(null);
  
  // Fixed topics
  const [ppesTopic, setPpesTopic] = useState("");
  const [toolsTopic, setToolsTopic] = useState("");
  const [hazardTopic, setHazardTopic] = useState("");
  const [emergencyTopic, setEmergencyTopic] = useState("");
  const [healthTopic, setHealthTopic] = useState("");
  const [othersTopic, setOthersTopic] = useState("");
  
  const [remarks, setRemarks] = useState("");

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!time.trim()) return toast.error("Time is required!");
    if (!permitNo.trim()) return toast.error("TBT Against Permit No. is required!");
    if (!permitDate.trim()) return toast.error("Permit Date is required!");
    if (!conductorName.trim()) return toast.error("TBT Conductor Name is required!");
    if (!conductorSignatureFile) return toast.error("TBT Conductor Signature is required!");
    if (!contractorName.trim()) return toast.error("Name of contractor is required!");
    if (!jobActivity.trim()) return toast.error("Job activity details are required!");
    if (!participantAttachmentsFile) return toast.error("Participant attachments are required!");
    
    // Validate at least one topic
    if (!ppesTopic.trim() && !toolsTopic.trim() && !hazardTopic.trim() && 
        !emergencyTopic.trim() && !healthTopic.trim() && !othersTopic.trim()) {
      return toast.error("At least one topic must be discussed!");
    }

    return true;
  };

  const handleClose = () => setOpen(false);

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

  const handleConductorSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setConductorSignatureFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setConductorSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParticipantAttachmentsUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParticipantAttachmentsFile(file);
      
      // For preview if needed
      const reader = new FileReader();
      reader.onload = () => {
        setParticipantAttachments(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Create FormData for the API call
      const formData = new FormData();
      // formData.append("id","1")
      formData.append("site_name", site);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("tbt_against_permit_no", permitNo);
      formData.append("permit_date", permitDate);
      formData.append("tbt_conducted_by_name", conductorName);
      formData.append("tbt_conducted_by_signature", conductorSignatureFile);
      formData.append("name_of_contractor", contractorName);
      formData.append("job_activity_in_detail", jobActivity);
      
      // Add topics
      formData.append("use_of_ppes_topic_discussed", ppesTopic);
      formData.append("use_of_tools_topic_discussed", toolsTopic);
      formData.append("hazard_at_work_place_topic_discussed", hazardTopic);
      formData.append("use_of_action_in_an_emergency_topic_discussed", emergencyTopic);
      formData.append("use_of_health_status_topic_discussed", healthTopic);
      formData.append("use_of_others_topic_discussed", othersTopic);
      
      // Add participant attachments
      formData.append("participant_upload_attachments", participantAttachmentsFile);
      
      // Add remarks
      formData.append("remarks", remarks);

      // Call the mutation
      await createToolTalkAttendance(formData).unwrap();
      refetch();
      toast.success("Toolbox talk attendance data submitted successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.data?.message || "Failed to submit toolbox talk attendance data");
    }
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

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site Name<span className="text-red-600"> *</span>
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
          {/* <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Location<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Location"
              value={location}
              sx={commonInputStyles}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid> */}
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
          <Grid item xs={12} md={6}>
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
            <Typography variant="h6" className="text-[#29346B] font-semibold">
              Topics Discussed
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Individual Topic Fields */}
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Use of PPEs
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter details about PPEs discussed"
              value={ppesTopic}
              sx={commonInputStyles}
              onChange={(e) => setPpesTopic(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Use of Tools
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter details about tools discussed"
              value={toolsTopic}
              sx={commonInputStyles}
              onChange={(e) => setToolsTopic(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Hazard at Workplace
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter details about workplace hazards discussed"
              value={hazardTopic}
              sx={commonInputStyles}
              onChange={(e) => setHazardTopic(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Action in an Emergency
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter details about emergency actions discussed"
              value={emergencyTopic}
              sx={commonInputStyles}
              onChange={(e) => setEmergencyTopic(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Health Status
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter details about health status discussed"
              value={healthTopic}
              sx={commonInputStyles}
              onChange={(e) => setHealthTopic(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Others
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter details about other topics discussed"
              value={othersTopic}
              sx={commonInputStyles}
              onChange={(e) => setOthersTopic(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          {/* Participants Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" className="text-[#29346B] font-semibold mb-2">
              Participants
            </Typography>
            <Divider />
          </Grid>

          {/* Participant Attachments Upload */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Upload Participant Sheet<span className="text-red-600"> *</span>
            </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: "1px dashed #FACC15",
                padding: 2,
                borderRadius: "8px",
              }}
            >
              <Button
                variant="outlined"
                component="label"
                color="primary"
                sx={{ height: "56px" }}
              >
                Upload Participant Sheet
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  hidden
                  onChange={handleParticipantAttachmentsUpload}
                />
              </Button>
              {participantAttachmentsFile && (
                <Typography>
                  {participantAttachmentsFile.name} ({Math.round(participantAttachmentsFile.size / 1024)} KB)
                </Typography>
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
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}