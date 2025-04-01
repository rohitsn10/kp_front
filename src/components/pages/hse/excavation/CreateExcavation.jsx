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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";

export default function ExcavationPermitDialog({ open, setOpen }) {
  const [site, setSite] = useState("");
  const [permitNo, setPermitNo] = useState("");
  const [date, setDate] = useState("");
  const [descriptionOfWork, setDescriptionOfWork] = useState("");
  const [locationAreaOfWork, setLocationAreaOfWork] = useState("");
  const [sizeOfExcavation, setSizeOfExcavation] = useState({
    length: "",
    breadth: "",
    depth: "",
  });
  const [startingTheWork, setStartingTheWork] = useState({
    date: "",
    time: "",
  });
  const [expectedDurationOfWork, setExpectedDurationOfWork] = useState({
    day: "",
    hour: "",
  });
  const [purposeOfExcavation, setPurposeOfExcavation] = useState("");
  const [clearancesForExcavation, setClearancesForExcavation] = useState({
    electrical_cables: { status: "", name: "", signature: null, date: "" },
    water_gas_pipes: { status: "", name: "", signature: null, date: "" },
    telephone_it_cables: { status: "", name: "", signature: null, date: "" },
  });
  const [precautionsTakenByAcceptor, setPrecautionsTakenByAcceptor] = useState({
    road_barricading_done: false,
    warning_signs_provided: false,
    barricading_excavated_area: false,
    shoring_carried_out: "",
    other_precautions: "",
    name: "",
    signature: null,
  });
  const [remarks, setRemarks] = useState("");
  const [checkedBy, setCheckedBy] = useState({ name: "", signature: null });

  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!permitNo.trim()) return toast.error("Permit No. is required!");
    if (!date.trim()) return toast.error("Date is required!");
    if (!descriptionOfWork.trim())
      return toast.error("Description of Work is required!");
    if (!locationAreaOfWork.trim())
      return toast.error("Location/Area of Work is required!");
    if (
      !sizeOfExcavation.length.trim() ||
      !sizeOfExcavation.breadth.trim() ||
      !sizeOfExcavation.depth.trim()
    )
      return toast.error("Size of Excavation details are required!");
    if (!startingTheWork.date.trim() || !startingTheWork.time.trim())
      return toast.error("Starting the Work details are required!");
    if (!expectedDurationOfWork.day.trim() || !expectedDurationOfWork.hour.trim())
      return toast.error("Expected Duration of Work details are required!");
    if (!purposeOfExcavation.trim())
      return toast.error("Purpose of Excavation is required!");
    if (
      !clearancesForExcavation.electrical_cables.name.trim() ||
      !clearancesForExcavation.electrical_cables.signature ||
      !clearancesForExcavation.electrical_cables.date.trim()
    )
      return toast.error("Electrical Cables clearance details are required!");
    if (
      !clearancesForExcavation.water_gas_pipes.name.trim() ||
      !clearancesForExcavation.water_gas_pipes.signature ||
      !clearancesForExcavation.water_gas_pipes.date.trim()
    )
      return toast.error("Water/Gas Pipes clearance details are required!");
    if (
      !clearancesForExcavation.telephone_it_cables.name.trim() ||
      !clearancesForExcavation.telephone_it_cables.signature ||
      !clearancesForExcavation.telephone_it_cables.date.trim()
    )
      return toast.error("Telephone/IT Cables clearance details are required!");
    if (
      !precautionsTakenByAcceptor.name.trim() ||
      !precautionsTakenByAcceptor.signature
    )
      return toast.error("Precautions Taken by Acceptor details are required!");
    if (!checkedBy.name.trim() || !checkedBy.signature)
      return toast.error("Checked By details are required!");

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

  const handleClearanceSignatureUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setClearancesForExcavation({
          ...clearancesForExcavation,
          [field]: {
            ...clearancesForExcavation[field],
            signature: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrecautionsSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPrecautionsTakenByAcceptor({
          ...precautionsTakenByAcceptor,
          signature: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckedBySignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCheckedBy({ ...checkedBy, signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      site: site,
      permit_no: permitNo,
      date: date,
      description_of_work: descriptionOfWork,
      location_area_of_work: locationAreaOfWork,
      size_of_excavation: sizeOfExcavation,
      starting_the_work: startingTheWork,
      expected_duration_of_work: expectedDurationOfWork,
      purpose_of_excavation: purposeOfExcavation,
      clearances_for_excavation: clearancesForExcavation,
      precautions_taken_by_acceptor: precautionsTakenByAcceptor,
      remarks: remarks,
      checked_by: checkedBy,
    };

    console.log(formData);
    toast.success("Excavation permit data submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        Excavation Permit
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Site & Permit No */}
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
              Permit No.<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Permit No."
              value={permitNo}
              sx={commonInputStyles}
              onChange={(e) => setPermitNo(e.target.value)}
            />
          </Grid>

          {/* Date & Description of Work */}
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
              Description of Work<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Description of Work"
              value={descriptionOfWork}
              sx={commonInputStyles}
              onChange={(e) => setDescriptionOfWork(e.target.value)}
            />
          </Grid>

          {/* Location/Area of Work */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Location/Area of Work<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Location/Area of Work"
              value={locationAreaOfWork}
              sx={commonInputStyles}
              onChange={(e) => setLocationAreaOfWork(e.target.value)}
            />
          </Grid>

          {/* Size of Excavation */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Size of Excavation
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Length (m)"
                  variant="outlined"
                  value={sizeOfExcavation.length}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setSizeOfExcavation({
                      ...sizeOfExcavation,
                      length: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Breadth (m)"
                  variant="outlined"
                  value={sizeOfExcavation.breadth}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setSizeOfExcavation({
                      ...sizeOfExcavation,
                      breadth: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Depth (m)"
                  variant="outlined"
                  value={sizeOfExcavation.depth}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setSizeOfExcavation({
                      ...sizeOfExcavation,
                      depth: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Starting the Work */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Starting the Work
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  variant="outlined"
                  value={startingTheWork.date}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setStartingTheWork({
                      ...startingTheWork,
                      date: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  variant="outlined"
                  value={startingTheWork.time}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setStartingTheWork({
                      ...startingTheWork,
                      time: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Expected Duration of Work */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Expected Duration of Work
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Days"
                  variant="outlined"
                  value={expectedDurationOfWork.day}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setExpectedDurationOfWork({
                      ...expectedDurationOfWork,
                      day: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hours"
                  variant="outlined"
                  value={expectedDurationOfWork.hour}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setExpectedDurationOfWork({
                      ...expectedDurationOfWork,
                      hour: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Purpose of Excavation */}
          <Grid item xs={12}>
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Purpose of Excavation<span className="text-red-600"> *</span>
            </label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Purpose of Excavation"
              value={purposeOfExcavation}
              sx={commonInputStyles}
              onChange={(e) => setPurposeOfExcavation(e.target.value)}
            />
          </Grid>

          {/* Clearances for Excavation */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Clearances for Excavation
            </Typography>
            <Divider />
          </Grid>

          {Object.entries(clearancesForExcavation).map(([key, clearance]) => (
            <Grid item xs={12} key={key}>
              <Typography
                variant="subtitle1"
                className="text-[#29346B] font-semibold mb-1"
              >
                {key.replace(/_/g, " ")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Status"
                    variant="outlined"
                    value={clearance.status}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      setClearancesForExcavation({
                        ...clearancesForExcavation,
                        [key]: {
                          ...clearancesForExcavation[key],
                          status: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={clearance.name}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      setClearancesForExcavation({
                        ...clearancesForExcavation,
                        [key]: {
                          ...clearancesForExcavation[key],
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    variant="outlined"
                    value={clearance.date}
                    sx={commonInputStyles}
                    onChange={(e) =>
                      setClearancesForExcavation({
                        ...clearancesForExcavation,
                        [key]: {
                          ...clearancesForExcavation[key],
                          date: e.target.value,
                        },
                      })
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
                      sx={{ height: "56px" }}
                    >
                      Upload Signature
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleClearanceSignatureUpload(key, e)}
                      />
                    </Button>
                    {clearance.signature && (
                      <Avatar
                        src={clearance.signature}
                        alt={`${key.replace(/_/g, " ")} Signature`}
                        variant="rounded"
                        sx={{ width: 100, height: 56 }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ))}

          {/* Precautions Taken by Acceptor */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Precautions Taken by Acceptor
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={precautionsTakenByAcceptor.road_barricading_done}
                      onChange={(e) =>
                        setPrecautionsTakenByAcceptor({
                          ...precautionsTakenByAcceptor,
                          road_barricading_done: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Road Barricading Done"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={precautionsTakenByAcceptor.warning_signs_provided}
                      onChange={(e) =>
                        setPrecautionsTakenByAcceptor({
                          ...precautionsTakenByAcceptor,
                          warning_signs_provided: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Warning Signs Provided"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        precautionsTakenByAcceptor.barricading_excavated_area
                      }
                      onChange={(e) =>
                        setPrecautionsTakenByAcceptor({
                          ...precautionsTakenByAcceptor,
                          barricading_excavated_area: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Barricading Excavated Area"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Shoring Carried Out"
                  variant="outlined"
                  value={precautionsTakenByAcceptor.shoring_carried_out}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setPrecautionsTakenByAcceptor({
                      ...precautionsTakenByAcceptor,
                      shoring_carried_out: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Other Precautions"
                  variant="outlined"
                  value={precautionsTakenByAcceptor.other_precautions}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setPrecautionsTakenByAcceptor({
                      ...precautionsTakenByAcceptor,
                      other_precautions: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={precautionsTakenByAcceptor.name}
                  sx={commonInputStyles}
                  onChange={(e) =>
                    setPrecautionsTakenByAcceptor({
                      ...precautionsTakenByAcceptor,
                      name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      onChange={handlePrecautionsSignatureUpload}
                    />
                  </Button>
                  {precautionsTakenByAcceptor.signature && (
                    <Avatar
                      src={precautionsTakenByAcceptor.signature}
                      alt="Precautions Signature"
                      variant="rounded"
                      sx={{ width: 100, height: 56 }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
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

          {/* Checked By */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              className="text-[#29346B] font-semibold mb-2"
            >
              Checked By
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={checkedBy.name}
              sx={commonInputStyles}
              onChange={(e) =>
                setCheckedBy({ ...checkedBy, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
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