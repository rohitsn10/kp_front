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
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useCreateSuggestionSchemeReportMutation } from "../../../../api/hse/suggestionScheme/suggestionSchemeReportApi ";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
export default function SuggestionFormDialog({ open, setOpen,onSuccess }) {
  const { locationId } = useParams();
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [descriptionOfSuggestion, setDescriptionOfSuggestion] = useState("");
  const [benefitsUponImplementation, setBenefitsUponImplementation] = useState("");
const [evaluation, setEvaluation] = useState({
  evaluated_by: "",
  name: "",
  designation: "",
  remarks: "",
  signature: null,
  signatureFileName: "",
});
  
  // RTK Query mutation hook
  const [createSuggestionSchemeReport, { isLoading }] = useCreateSuggestionSchemeReportMutation();

const validateForm = () => {
  if (!site.trim()) return toast.error("Site is required!");
  if (!date.trim()) return toast.error("Date is required!");
  if (!name.trim()) return toast.error("Name is required!");
  if (!designation.trim()) return toast.error("Designation is required!");
  if (!descriptionOfSuggestion.trim())
    return toast.error("Description of Suggestion is required!");
  if (!benefitsUponImplementation.trim())
    return toast.error("Benefits Upon Implementation is required!");
  if (!evaluation.evaluated_by.trim())
    return toast.error("Evaluated By is required!");
  if (!evaluation.name.trim()) return toast.error("Evaluator Name is required!");
  if (!evaluation.designation.trim())
    return toast.error("Evaluator Designation is required!");
  if (!evaluation.remarks.trim()) return toast.error("Evaluation Remarks are required!");
  if (!evaluation.signature) return toast.error("Evaluator Signature PDF is required!"); // Updated message

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

const handleEvaluationSignatureUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file for evaluator signature!");
      return;
    }
    
    // Check file size (15MB = 15 * 1024 * 1024 bytes)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Evaluator signature PDF must be less than 15MB!");
      return;
    }
    
    setEvaluation({ 
      ...evaluation, 
      signature: file,
      signatureFileName: file.name
    });
  }
};

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('site', site);
    formData.append('location', locationId);
    formData.append('date', date);
    formData.append('name', name);
    formData.append('designation', designation);
    formData.append('suggestion_description', descriptionOfSuggestion);
    formData.append('benefits_upon_implementation', benefitsUponImplementation);
    formData.append('evaluated_by', evaluation.evaluated_by);
    formData.append('evaluator_name', evaluation.name);
    formData.append('evaluator_designation', evaluation.designation);
    formData.append('evaluation_remarks', evaluation.remarks);
    
    // Append the file if it exists
    if (evaluation.signature instanceof File) {
      formData.append('evaluator_signature', evaluation.signature);
    }

    try {
      const response = await createSuggestionSchemeReport(formData).unwrap();
      if (response.status) {
        toast.success("Suggestion submitted successfully!");
        resetForm();
        onSuccess();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit suggestion");
      }
    } catch (error) {
      toast.error(error.data?.message || "An error occurred while submitting the suggestion");
      console.error("Submission error:", error);
    }
  };

const resetForm = () => {
  setSite("");
  setDate("");
  setName("");
  setDesignation("");
  setDescriptionOfSuggestion("");
  setBenefitsUponImplementation("");
  setEvaluation({
    evaluated_by: "",
    name: "",
    designation: "",
    remarks: "",
    signature: null,
    signatureFileName: "" // Add this line
  });
};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Suggestion Form
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Suggestion Details */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Suggestion Details
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Site<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Site"
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

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Description of Suggestion<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Description of Suggestion"
              value={descriptionOfSuggestion}
              sx={commonInputStyles}
              onChange={(e) => setDescriptionOfSuggestion(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Benefits Upon Implementation<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Benefits Upon Implementation"
              value={benefitsUponImplementation}
              sx={commonInputStyles}
              onChange={(e) => setBenefitsUponImplementation(e.target.value)}
            />
          </Grid>

          {/* Evaluation Details */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Evaluation Details
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluated By<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Evaluated By"
              value={evaluation.evaluated_by}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, evaluated_by: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluator Name<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Evaluator Name"
              value={evaluation.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, name: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluator Designation<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Evaluator Designation"
              value={evaluation.designation}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, designation: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluation Remarks<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Evaluation Remarks"
              value={evaluation.remarks}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, remarks: e.target.value })
              }
            />
          </Grid>

<Grid item xs={12}>
  <label className="block mb-1 text-[#29346B] text-lg font-semibold">
    Evaluator Signature PDF<span className="text-red-600"> *</span>
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
        onChange={handleEvaluationSignatureUpload}
      />
    </Button>
    {evaluation.signature && (
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
          {evaluation.signatureFileName}
        </Typography>
      </Box>
    )}
  </Box>
  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
    Upload signed PDF (Max: 15MB)
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
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}