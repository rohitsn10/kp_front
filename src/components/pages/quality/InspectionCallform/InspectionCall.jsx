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
} from "@mui/material";
import { useGenerateInspectionCallReportMutation } from "../../../../api/quality/qualitySupplyApi";

function InspectionCallForm({ open, handleClose, projectId, selectedItem }) {
  const [formData, setFormData] = useState({
    itemDescription: "",
    supplierNameAndAddress: "",
    inspectionPlace: "",
    supplierContact: "",
    startDateTime: "",
    endDateTime: "",
    purchaseOrderDetails: "",
    quantityOrdered: "",
    quantityReleased: "",
    quantityBalance: "",
    quantityOffered: "",
    itemCategory: "",
    attachedDocuments: "",
    otherDetails: "",
    ic_number: "",
    raisedByName: "",
    supplierName: "",
    epccName: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [generateReport] = useGenerateInspectionCallReportMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((val) => val.trim() !== "");
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please fill all fields.",
      });
      return;
    }

    const requestBody = {
      project_id: projectId,
      date: new Date().toISOString().split("T")[0],
      item_description: formData.itemDescription,
      name_address_supplier: formData.supplierNameAndAddress,
      place_inspection: formData.inspectionPlace,
      contact_person: formData.supplierContact,
      date_time_inspection_start: formData.startDateTime,
      date_time_inspection_end: formData.endDateTime,
      purchase_order_number_date: formData.purchaseOrderDetails,
      quantity_ordered: formData.quantityOrdered,
      quantity_released_till_date: formData.quantityReleased,
      quantity_balance: formData.quantityBalance,
      quantity_offered_for_inspection: formData.quantityOffered,
      item_category: formData.itemCategory,
      details_num_of_approved_drawings: formData.attachedDocuments,
      any_others: formData.otherDetails,
      ic_number: formData.ic_number,
      raised_by_name: formData.raisedByName,
      supplier_name: formData.supplierName,
      epcc_name: formData.epccName,
    };

    try {
      const { data, error } = await generateReport({
        id: selectedItem.id,
        data: requestBody,
      });

      if (error || !data?.data) {
        throw new Error(error?.message || "Failed to generate report");
      }

      const link = document.createElement("a");
      link.href = data.data;
      link.download = "inspection_call_report.pdf";
      link.target = "_blank";
      link.click();

      setAlert({
        open: true,
        severity: "success",
        message: "PDF generated successfully!",
      });
      handleClose();
    } catch (err) {
      setAlert({ open: true, severity: "error", message: err.message });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
          Format for Inspection Call
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { label: "Item Description", name: "itemDescription" },
              {
                label: "Name and complete address of supplier",
                name: "supplierNameAndAddress",
                multiline: true,
              },
              { label: "Place of inspection", name: "inspectionPlace" },
              {
                label: "Contact person at supplier place",
                name: "supplierContact",
              },
              {
                label: "Start Date and Time of Inspection",
                name: "startDateTime",
                type: "datetime-local",
              },
              {
                label: "End Date and Time of Inspection",
                name: "endDateTime",
                type: "datetime-local",
              },
              {
                label: "Purchase order number and date",
                name: "purchaseOrderDetails",
              },
              { label: "Quantity Ordered", name: "quantityOrdered" },
              {
                label: "Quantity released till date",
                name: "quantityReleased",
              },
              { label: "Quantity balance for MDCC", name: "quantityBalance" },
              {
                label: "Quantity Offered for Inspection",
                name: "quantityOffered",
              },
              { label: "Item Category (A/B/C)", name: "itemCategory" },
              { label: "I/C No.", name: "ic_number" },
              {
                label: "Details of approved QAP/drawing/documents",
                name: "attachedDocuments",
                multiline: true,
              },
              {
                label: "Any other details",
                name: "otherDetails",
                multiline: true,
              },
              { label: "Raised by Name", name: "raisedByName" },
              { label: "Supplier Name", name: "supplierName" },
              { label: "EPCC Name", name: "epccName" },
            ].map(({ label, name, multiline = false, type = "text" }) => (
              <Grid item xs={12} key={name}>
                <TextField
                  fullWidth
                  required
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline={multiline}
                  rows={multiline ? 3 : 1}
                  type={type}
                  InputLabelProps={
                    type === "datetime-local" ? { shrink: true } : undefined
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} sx={{ color: "#29346B" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#FACC15",
              color: "#29346B",
              "&:hover": { bgcolor: "#e5b812" },
            }}
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
}

export default InspectionCallForm;
