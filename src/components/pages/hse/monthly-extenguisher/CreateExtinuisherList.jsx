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
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useCreateFireExtinguisherInspectionMutation } from "../../../../api/hse/extinguisher/extinguisherApi";

export default function FireExtinguisherInspectionDialog({ open, setOpen }) {
  const [createFireExtinguisherInspection, { isLoading }] = 
    useCreateFireExtinguisherInspectionMutation();

  const [site, setSite] = useState("");
  const [dateOfInspection, setDateOfInspection] = useState("");
  const [extinguishers, setExtinguishers] = useState([
    {
      extinguisher_no: "",
      extinguisher_type: "",
      weight: "", // Changed from weight_kg to match API
      location: "",
      seal_intact: "", // Will convert to boolean before submission
      pressure_in_gauge: "",
      tube_nozzle: "",
      painting_condition: "",
      refilling_date: "",
      due_date_refilling: "",
      due_date_hydro_test: "",
      access: "",
      remarks: "",
    },
    {
      extinguisher_no: "",
      extinguisher_type: "",
      weight: "",
      location: "",
      seal_intact: "",
      pressure_in_gauge: "",
      tube_nozzle: "",
      painting_condition: "",
      refilling_date: "",
      due_date_refilling: "",
      due_date_hydro_test: "",
      access: "",
      remarks: "",
    },
  ]);
  const [checkedBy, setCheckedBy] = useState({ name: "" });
  const [signatureFile, setSignatureFile] = useState(null); // Store the actual file

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!dateOfInspection.trim()) return toast.error("Date of Inspection is required!");

    for (let i = 0; i < extinguishers.length; i++) {
      const ext = extinguishers[i];
      if (!ext.extinguisher_no.trim())
        return toast.error(`Extinguisher ${i + 1}: Extinguisher No. is required!`);
      if (!ext.extinguisher_type.trim())
        return toast.error(`Extinguisher ${i + 1}: Extinguisher Type is required!`);
      if (!ext.weight.toString().trim())
        return toast.error(`Extinguisher ${i + 1}: Weight is required!`);
      if (!ext.location.trim())
        return toast.error(`Extinguisher ${i + 1}: Location is required!`);
      if (!ext.seal_intact.toString().trim())
        return toast.error(`Extinguisher ${i + 1}: Seal Intact is required!`);
      if (!ext.pressure_in_gauge.trim())
        return toast.error(`Extinguisher ${i + 1}: Pressure in Gauge is required!`);
      if (!ext.tube_nozzle.trim())
        return toast.error(`Extinguisher ${i + 1}: Tube/Nozzle is required!`);
      if (!ext.painting_condition.trim())
        return toast.error(`Extinguisher ${i + 1}: Painting Condition is required!`);
      if (!ext.refilling_date.trim())
        return toast.error(`Extinguisher ${i + 1}: Refilling Date is required!`);
      if (!ext.due_date_refilling.trim())
        return toast.error(`Extinguisher ${i + 1}: Due Date Refilling is required!`);
      if (!ext.due_date_hydro_test.trim())
        return toast.error(`Extinguisher ${i + 1}: Due Date Hydro Test is required!`);
      if (!ext.access.trim())
        return toast.error(`Extinguisher ${i + 1}: Access is required!`);
      if (!ext.remarks.trim())
        return toast.error(`Extinguisher ${i + 1}: Remarks is required!`);
    }

    if (!checkedBy.name.trim()) return toast.error("Checked By Name is required!");
    if (!signatureFile) return toast.error("Checked By Signature is required!");

    return true;
  };

  const handleClose = () => setOpen(false);

  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      border: "none",
      borderRadius: "4px",
    },
  };

  const handleExtinguisherChange = (index, field, value) => {
    const newExtinguishers = [...extinguishers];
    newExtinguishers[index][field] = value;
    setExtinguishers(newExtinguishers);
  };

  const handleAddExtinguisher = () => {
    setExtinguishers([
      ...extinguishers,
      {
        extinguisher_no: "",
        extinguisher_type: "",
        weight: "",
        location: "",
        seal_intact: "",
        pressure_in_gauge: "",
        tube_nozzle: "",
        painting_condition: "",
        refilling_date: "",
        due_date_refilling: "",
        due_date_hydro_test: "",
        access: "",
        remarks: "",
      },
    ]);
  };

  const handleRemoveExtinguisher = (index) => {
    const newExtinguishers = [...extinguishers];
    newExtinguishers.splice(index, 1);
    setExtinguishers(newExtinguishers);
  };

  const handleCheckedBySignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setCheckedBy({ ...checkedBy, signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  


  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Process extinguishers to match API format
    const processedExtinguishers = extinguishers.map(ext => ({
      extinguisher_no: ext.extinguisher_no,
      extinguisher_type: ext.extinguisher_type,
      weight: ext.weight,
      location: ext.location,
      seal_intact: ext.seal_intact === "Yes" || ext.seal_intact === true,
      pressure_in_gauge: ext.pressure_in_gauge,
      tube_nozzle: ext.tube_nozzle,
      painting_condition: ext.painting_condition,
      refilling_date: ext.refilling_date,
      due_date_refilling: ext.due_date_refilling,
      due_date_hydro_test: ext.due_date_hydro_test,
      access: ext.access,
      remarks: ext.remarks
    }));
    
    // Create FormData object
    const formData = new FormData();
    
    // Add basic fields
    formData.append('site_name', site);
    formData.append('date_of_inspection', dateOfInspection);
    formData.append('checked_by_name', checkedBy.name);
    
    // Add signature file
    if (signatureFile) {
      formData.append('signature', signatureFile);
    }
    
    // Add extinguishers as a JSON string
    formData.append('extinguishers', JSON.stringify(processedExtinguishers));

    try {
      // Call the API with FormData
      await createFireExtinguisherInspection(formData).unwrap();
      toast.success("Fire extinguisher inspection data submitted successfully!");
      
      // Reset form and close dialog
      setOpen(false);
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error(error.data?.message || "Failed to submit inspection data. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Fire Extinguisher Inspection
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Inspection Details Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Inspection Details
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
              Date of Inspection<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={dateOfInspection}
              sx={commonInputStyles}
              onChange={(e) => setDateOfInspection(e.target.value)}
            />
          </Grid>

          {/* Extinguishers Section */}
          <Grid item xs={12} mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography
                variant="h6"
                className="text-[#29346B] font-semibold"
              >
                Extinguishers
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddExtinguisher}
                sx={{
                  backgroundColor: "#29346B",
                  "&:hover": {
                    backgroundColor: "#202a5a",
                  },
                }}
              >
                Add Extinguisher
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {extinguishers.map((extinguisher, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0", position: "relative" }}
            >
              <IconButton
                color="error"
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => handleRemoveExtinguisher(index)}
                disabled={extinguishers.length === 1}
              >
                <DeleteIcon />
              </IconButton>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Extinguisher {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Extinguisher No."
                    variant="outlined"
                    value={extinguisher.extinguisher_no}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "extinguisher_no",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`extinguisher-type-label-${index}`}>Extinguisher Type</InputLabel>
                    <Select
                      labelId={`extinguisher-type-label-${index}`}
                      id={`extinguisher-type-${index}`}
                      value={extinguisher.extinguisher_type}
                      label="Extinguisher Type"
                      sx={commonInputStyles}
                      onChange={(e) =>
                        handleExtinguisherChange(
                          index,
                          "extinguisher_type",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="CO2">CO2</MenuItem>
                      <MenuItem value="Dry Powder">Dry Powder</MenuItem>
                      <MenuItem value="Foam">Foam</MenuItem>
                      <MenuItem value="Water">Water</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    variant="outlined"
                    type="number"
                    step="0.1"
                    value={extinguisher.weight}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "weight",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Location"
                    variant="outlined"
                    value={extinguisher.location}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "location",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`seal-intact-label-${index}`}>Seal Intact</InputLabel>
                    <Select
                      labelId={`seal-intact-label-${index}`}
                      id={`seal-intact-${index}`}
                      value={extinguisher.seal_intact}
                      label="Seal Intact"
                      sx={commonInputStyles}
                      onChange={(e) =>
                        handleExtinguisherChange(
                          index,
                          "seal_intact",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`pressure-gauge-label-${index}`}>Pressure in Gauge</InputLabel>
                    <Select
                      labelId={`pressure-gauge-label-${index}`}
                      id={`pressure-gauge-${index}`}
                      value={extinguisher.pressure_in_gauge}
                      label="Pressure in Gauge"
                      sx={commonInputStyles}
                      onChange={(e) =>
                        handleExtinguisherChange(
                          index,
                          "pressure_in_gauge",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`tube-nozzle-label-${index}`}>Tube/Nozzle</InputLabel>
                    <Select
                      labelId={`tube-nozzle-label-${index}`}
                      id={`tube-nozzle-${index}`}
                      value={extinguisher.tube_nozzle}
                      label="Tube/Nozzle"
                      sx={commonInputStyles}
                      onChange={(e) =>
                        handleExtinguisherChange(
                          index,
                          "tube_nozzle",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Intact">Intact</MenuItem>
                      <MenuItem value="Loose">Loose</MenuItem>
                      <MenuItem value="Damaged">Damaged</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`painting-condition-label-${index}`}>Painting Condition</InputLabel>
                    <Select
                      labelId={`painting-condition-label-${index}`}
                      id={`painting-condition-${index}`}
                      value={extinguisher.painting_condition}
                      label="Painting Condition"
                      sx={commonInputStyles}
                      onChange={(e) =>
                        handleExtinguisherChange(
                          index,
                          "painting_condition",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Good">Good</MenuItem>
                      <MenuItem value="Fair">Fair</MenuItem>
                      <MenuItem value="Poor">Poor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Refilling Date"
                    variant="outlined"
                    value={extinguisher.refilling_date}
                    sx={commonInputStyles}
                    InputLabelProps={{ shrink: true }} 
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "refilling_date",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Due Date Refilling"
                    variant="outlined"
                    value={extinguisher.due_date_refilling}
                    sx={commonInputStyles}
                    InputLabelProps={{ shrink: true }} 
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "due_date_refilling",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Due Date Hydro Test"
                    variant="outlined"
                    value={extinguisher.due_date_hydro_test}
                    InputLabelProps={{ shrink: true }} 
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "due_date_hydro_test",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`access-label-${index}`}>Access</InputLabel>
                    <Select
                      labelId={`access-label-${index}`}
                      id={`access-${index}`}
                      value={extinguisher.access}
                      label="Access"
                      sx={commonInputStyles}
                      onChange={(e) =>
                        handleExtinguisherChange(
                          index,
                          "access",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Easily Accessible">Easily Accessible</MenuItem>
                      <MenuItem value="Partially Blocked">Partially Blocked</MenuItem>
                      <MenuItem value="Blocked">Blocked</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    value={extinguisher.remarks}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      handleExtinguisherChange(
                        index,
                        "remarks",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* Checked By Section */}
          <Grid item xs={12} mt={2}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Checked By
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
              placeholder="Enter Name"
              value={checkedBy.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setCheckedBy({ ...checkedBy, name: e.target.value })
              }
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
                  onChange={handleCheckedBySignatureUpload}
                />
              </Button>
              {checkedBy.signature && (
                <Avatar
                  src={checkedBy.signature}
                  alt="Checked By Signature"
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
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}