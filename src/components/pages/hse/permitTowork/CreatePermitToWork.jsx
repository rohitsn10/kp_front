import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";

export default function PermitToWorkDialog({ open, setOpen }) {
  const [siteName, setSiteName] = useState("");
  const [department, setDepartment] = useState("");
  const [permitNo, setPermitNo] = useState("");
  const [externalAgency, setExternalAgency] = useState("");
  const [permitType, setPermitType] = useState([]);
  const [permitIssuedFor, setPermitIssuedFor] = useState([]);
  const [jobDetails, setJobDetails] = useState("");
  const [location, setLocation] = useState("");
  const [tools, setTools] = useState("");
  const [hazards, setHazards] = useState([]);
  const [jobPreparation, setJobPreparation] = useState([]);
  const [fireProtection, setFireProtection] = useState([]);

  const validateForm = () => {
    if (!siteName.trim()) return toast.error("Site Name is required!");
    if (!department) return toast.error("Please select a Department!");
    if (!permitNo.trim()) return toast.error("Permit Number is required!");
    if (permitType.length === 0) return toast.error("Select at least one Permit Type!");
    if (permitIssuedFor.length === 0) return toast.error("Permit Issued For is required!");
    if (!jobDetails.trim()) return toast.error("Job Details are required!");
    if (!location.trim()) return toast.error("Location is required!");
    if (!tools.trim()) return toast.error("Tools & Equipment are required!");
    if (hazards.length === 0) return toast.error("Select at least one Hazard Consideration!");
    if (jobPreparation.length === 0) return toast.error("Select at least one Job Preparation step!");
    if (fireProtection.length === 0) return toast.error("Select at least one Fire Protection & PPE!");

    return true;
  };
  const permitOptions = [
    "Cold Work",
    "Hot Work",
    "Work at Height",
    "Electrical Work",
    "Excavation",
    "Equipment Testing",
    "Crane / Hydra / JCB work",
  ];

  const hazardOptions = [
    "Fire",
    "Electrical",
    "Fall",
    "Slip & Trip",
    "Toppling",
  ];

  const jobPreparationOptions = [
    "Work Permit",
    "Method Statement",
    "Risk Assessment",
    "Safety Training",
  ];

  const fireProtectionOptions = [
    "Fire Extinguisher",
    "Fire Blanket",
    "Fire Watch",
    "PPE Suit",
  ];

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
  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log({
      siteName,
      department,
      permitNo,
      externalAgency,
      permitType,
      permitIssuedFor,
      jobDetails,
      location,
      tools,
      hazards,
      jobPreparation,
      fireProtection,
    });

    toast.success("Permit submitted successfully!");
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Permit to Work
      </DialogTitle>
      <DialogContent>
        {/* Site Name */}
        <div className="mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Site Name<span className="text-red-600"> *</span>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>

        {/* Department (Radio Button) */}
        <div className="mb-4">
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              className="text-[#29346B] text-lg font-semibold"
            >
              Department<span className="text-red-600"> *</span>
            </FormLabel>
            <RadioGroup
              row
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <FormControlLabel value="ONM" control={<Radio />} label="ONM" />
              <FormControlLabel
                value="Project"
                control={<Radio />}
                label="Project"
              />
              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Permit No & External Agency */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Permit No<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Permit Number"
              value={permitNo}
              sx={commonInputStyles}
              onChange={(e) => setPermitNo(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              External Agency (if any)
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Agency Name"
              value={externalAgency}
              sx={commonInputStyles}
              onChange={(e) => setExternalAgency(e.target.value)}
            />
          </div>
        </div>

        {/* Permit Type (Checkbox) */}
        <div className="mb-4">
          <p className="text-lg font-semibold">Type of Permit:</p>
          <FormGroup row>
            {permitOptions.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={permitType.includes(option)}
                    onChange={(e) =>
                      setPermitType(
                        e.target.checked
                          ? [...permitType, option]
                          : permitType.filter((p) => p !== option)
                      )
                    }
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        </div>

        {/* Permit Issued For (Multi-Select) */}
        <Autocomplete
          multiple
          options={permitOptions}
          getOptionLabel={(option) => option}
          value={permitIssuedFor}
          sx={commonInputStyles}
          onChange={(event, newValue) => setPermitIssuedFor(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Permit Issued For"
              fullWidth
            />
          )}
          className="mb-4"
        />

        {/* Job Details */}
        <TextField
          label="Job / Activity in Details"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          className="mb-4"
          value={jobDetails}
          sx={commonInputStyles}
          onChange={(e) => setJobDetails(e.target.value)}
        />

        {/* Location & Tools */}
        <div className="flex gap-4 mb-4 mt-4">
          <TextField
            label="Location / Area"
            fullWidth
            variant="outlined"
            value={location}
            sx={commonInputStyles}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            label="Tools & Equipment to be used"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={tools}
            sx={commonInputStyles}
            onChange={(e) => setTools(e.target.value)}
          />
        </div>

        {/* Hazard Consideration */}
        <div className="mb-4">
          <p className="text-lg font-semibold">Hazard Consideration:</p>
          <FormGroup row>
            {hazardOptions.map((hazard) => (
              <FormControlLabel
                key={hazard}
                control={
                  <Checkbox
                    checked={hazards.includes(hazard)}
                    onChange={(e) =>
                      setHazards(
                        e.target.checked
                          ? [...hazards, hazard]
                          : hazards.filter((h) => h !== hazard)
                      )
                    }
                  />
                }
                label={hazard}
              />
            ))}
          </FormGroup>
        </div>

        {/* Job Preparation */}
        <div className="mb-4">
          <p className="text-lg font-semibold">Job Preparation:</p>
          <FormGroup row>
            {jobPreparationOptions.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    onChange={() =>
                      setJobPreparation([...jobPreparation, item])
                    }
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>
        </div>

        {/* Fire Protection & PPEs */}
        <div className="mb-4">
          <p className="text-lg font-semibold">Fire Protection & PPEs:</p>
          <FormGroup row>
            {fireProtectionOptions.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    onChange={() =>
                      setFireProtection([...fireProtection, item])
                    }
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>
        </div>
      </DialogContent>

      <DialogActions>
        {/* <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button> */}
        <Button onClick={handleSubmit} color="primary"
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
        variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
