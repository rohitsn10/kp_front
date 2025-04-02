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

export default function SuggestionFormDialog({ open, setOpen }) {
  const [id, setId] = useState("");
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [descriptionOfSuggestion, setDescriptionOfSuggestion] = useState("");
  const [benefitsUponImplementation, setBenefitsUponImplementation] = useState(
    ""
  );
  const [evaluation, setEvaluation] = useState({
    status: "",
    evaluated_by: "",
    name: "",
    designation: "",
    date: "",
    comments: "",
    signature: null,
  });

  const validateForm = () => {
    if (!id.trim()) return toast.error("Suggestion ID is required!");
    if (!site.trim()) return toast.error("Site is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!name.trim()) return toast.error("Name is required!");
    if (!designation.trim()) return toast.error("Designation is required!");
    if (!department.trim()) return toast.error("Department is required!");
    if (!descriptionOfSuggestion.trim())
      return toast.error("Description of Suggestion is required!");
    if (!benefitsUponImplementation.trim())
      return toast.error("Benefits Upon Implementation is required!");
    if (!evaluation.status.trim()) return toast.error("Evaluation Status is required!");
    if (!evaluation.evaluated_by.trim())
      return toast.error("Evaluated By is required!");
    if (!evaluation.name.trim()) return toast.error("Evaluator Name is required!");
    if (!evaluation.designation.trim())
      return toast.error("Evaluator Designation is required!");
    if (!evaluation.date.trim()) return toast.error("Evaluation Date is required!");
    if (!evaluation.comments.trim()) return toast.error("Evaluation Comments are required!");
    if (!evaluation.signature) return toast.error("Evaluator Signature is required!");

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

  const handleEvaluationSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEvaluation({ ...evaluation, signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      id: id,
      site: site,
      date: date,
      name: name,
      designation: designation,
      department: department,
      description_of_suggestion: descriptionOfSuggestion,
      benefits_upon_implementation: benefitsUponImplementation,
      evaluation: evaluation,
    };

    console.log(formData);
    toast.success("Suggestion submitted successfully!");
    setOpen(false);
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
              Suggestion ID<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Suggestion ID"
              value={id}
              sx={commonInputStyles}
              onChange={(e) => setId(e.target.value)}
            />
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

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Department<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Department"
              value={department}
              sx={commonInputStyles}
              onChange={(e) => setDepartment(e.target.value)}
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
              Evaluation Status<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Evaluation Status"
              value={evaluation.status}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, status: e.target.value })
              }
            />
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

          <Grid item xs={12} md={6}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluation Date<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={evaluation.date}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, date: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluation Comments<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter Evaluation Comments"
              value={evaluation.comments}
              sx={commonInputStyles}
              onChange={(e) =>
                setEvaluation({ ...evaluation, comments: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Evaluator Signature<span className="text-red-600"> *</span>
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
                  onChange={handleEvaluationSignatureUpload}
                />
              </Button>
              {evaluation.signature && (
                <Avatar
                  src={evaluation.signature}
                  alt="Evaluator Signature"
                  variant="rounded"
                  sx={{ width: 100, height: 56 }}
                />
              )}
            </Box>
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