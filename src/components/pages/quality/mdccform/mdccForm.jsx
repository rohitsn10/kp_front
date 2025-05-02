import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

const MDCCForm = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    refNo: "",
    date: "",
    projectName: "",
    to: "",
    supplierAddress: "",
    inspectionPlace: "",
    materialDescription: "",
    qap: "",
    drawingNo: "",
    standard: "",
    tpiRequired: "",
    tpiConducted: "",
    tpiReportAttached: "",
    tpiDetails: "",
    tpiRecommendation: "",
    internalRequired: "",
    internalConducted: "",
    internalReportAttached: "",
    internalInspectorDetails: "",
    internalRecommendation: "",
    quantityOffered: "",
    unitOffered: "",
    quantityCleared: "",
    unitCleared: "",
    conditions: "",
    comments: "",
    annexures: "",
    reviewedBy: "",
    approvedBy: "",
    reportReview: Array(7).fill({ description: "", certNo: "", remark: "" }),
  });

  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = (index, key, value) => {
    const updatedReviews = [...formData.reportReview];
    updatedReviews[index] = { ...updatedReviews[index], [key]: value };
    setFormData((prev) => ({ ...prev, reportReview: updatedReviews }));
  };

  const handleSubmit = () => {
    console.log("MDCC Form Submission:", formData);
    setAlert({ open: true, severity: "success", message: "Form data captured successfully!" });
    handleClose();
  };

  const radioGroup = (label, name) => (
    <Grid item xs={12}>
      <FormControl component="fieldset">
        <FormLabel>{label}</FormLabel>
        <RadioGroup
          row
          value={formData[name]}
          onChange={(e) => handleRadioChange(name, e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Grid>
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
          MDCC Form
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* General fields */}
            {[
              ["Ref No", "refNo"],
              ["Date", "date", "date"],
              ["Project Name", "projectName"],
              ["To", "to"],
              ["Name and address of Supplier", "supplierAddress", true],
              ["Place of Inspection", "inspectionPlace"],
              ["Material Description", "materialDescription", true],
              ["QAP/MQP", "qap"],
              ["Drawing/Model No", "drawingNo"],
              ["IS/IEC/ISO Standards", "standard"],
              ["Details of Third Party", "tpiDetails"],
              ["Recommendation of Third Party", "tpiRecommendation", true],
              ["Name & Details of Internal Inspector", "internalInspectorDetails"],
              ["Recommendation of Internal Inspector", "internalRecommendation", true],
              ["Quantity Offered", "quantityOffered"],
              ["Unit", "unitOffered"],
              ["Quantity Cleared for Dispatch", "quantityCleared"],
              ["Unit", "unitCleared"],
              ["Conditions (if any)", "conditions", true],
              ["Comments (if any)", "comments", true],
              ["Annexures (if any)", "annexures", true],
              ["Reviewed by", "reviewedBy"],
              ["Approved by", "approvedBy"],
            ].map(([label, name, multiline = false, type = "text"]) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleInputChange}
                  multiline={multiline}
                  rows={multiline ? 3 : 1}
                  InputLabelProps={type === "date" ? { shrink: true } : undefined}
                />
              </Grid>
            ))}

            {/* Radio fields */}
            {radioGroup("Third party test required", "tpiRequired")}
            {radioGroup("Third party test conducted", "tpiConducted")}
            {radioGroup("Third party test report attached", "tpiReportAttached")}
            {radioGroup("Internal test/witness required", "internalRequired")}
            {radioGroup("Internal test/witness conducted", "internalConducted")}
            {radioGroup("Internal test/witness report attached", "internalReportAttached")}

            {/* Report Review Section */}
            <Grid item xs={12}>
              <strong>Report Review</strong>
            </Grid>
            {["TPI report", "Inspection date", "Compliance report", "NABL Report/MTC", "QAP", "Drawing/Model", "Calibration Report"].map((desc, i) => (
              <React.Fragment key={i}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={`Description`}
                    value={desc}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Certificate No."
                    value={formData.reportReview[i]?.certNo || ""}
                    onChange={(e) => handleReviewChange(i, "certNo", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Remark"
                    value={formData.reportReview[i]?.remark || ""}
                    onChange={(e) => handleReviewChange(i, "remark", e.target.value)}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#29346B" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: "#FACC15", color: "#29346B", "&:hover": { bgcolor: "#e5b812" } }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MDCCForm;
