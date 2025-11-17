import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { useCreateMilestonePaymentMutation } from "../../../api/milestonePayment/milestonePaymentApi";

function AddInvoiceModal({ open, handleClose, milestoneId, refetch }) {
  const [createMilestonePayment, { isLoading }] = useCreateMilestonePaymentMutation();

  const [formData, setFormData] = useState({
    milestone_id: milestoneId,
    party_name: "",
    po_number: "",
    invoice_number: "",
    total_amount: "",
    gst_percentage: "",
    gst_amount: "",
    notes: "",
  });

  useEffect(() => {
    setFormData({
      milestone_id: milestoneId,
      party_name: "",
      po_number: "",
      invoice_number: "",
      total_amount: "",
      gst_percentage: "",
      gst_amount: "",
      notes: "",
    });
  }, [open]);

  useEffect(() => {
    if (milestoneId) {
      setFormData((prev) => ({ ...prev, milestone_id: milestoneId }));
    }
  }, [milestoneId]);

  // Auto Calculate GST Total Amount
  useEffect(() => {
    if (formData.total_amount && formData.gst_percentage) {
      const total = parseFloat(formData.total_amount);
      const gst = parseFloat(formData.gst_percentage);

      if (!isNaN(total) && !isNaN(gst)) {
        const gstValue = (total * gst) / 100;
        const totalWithGst = (total + gstValue).toFixed(2);

        setFormData((prev) => ({
          ...prev,
          gst_amount: totalWithGst,
        }));
      }
    }
  }, [formData.total_amount, formData.gst_percentage]);

  const gstOnlyAmount = () => {
    if (formData.total_amount && formData.gst_percentage) {
      const total = parseFloat(formData.total_amount);
      const gst = parseFloat(formData.gst_percentage);
      if (!isNaN(total) && !isNaN(gst)) {
        return (total * gst / 100).toFixed(2);
      }
    }
    return "0.00";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return (
      formData.party_name.trim() &&
      formData.invoice_number.trim() &&
      formData.total_amount &&
      formData.gst_amount
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        milestone_id: formData.milestone_id,
        party_name: formData.party_name,
        po_number: formData.po_number,
        invoice_number: formData.invoice_number,
        total_amount: formData.total_amount,
        gst_amount: formData.gst_amount,
        notes: formData.notes,
      };

      const response = await createMilestonePayment(payload).unwrap();

      if (response?.status) {
        toast.success("Invoice Added Successfully");
        refetch();
        handleClose();
      } else {
        toast.error(response?.message || "Failed to add invoice");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { width: "700px", paddingBottom: "15px" } }}
    >
      <h2 className="text-2xl my-6 text-center font-semibold text-[#29346B] mb-5">
        Add Invoice
      </h2>

      <DialogContent>
        <div className="mb-4">
          {[
            { label: "Party Name", name: "party_name" },
            { label: "PO Number", name: "po_number" },
            { label: "Invoice Number", name: "invoice_number" },
            { label: "Total Amount", name: "total_amount", type: "number" },
            { label: "GST Percentage (%)", name: "gst_percentage", type: "number" },
            {
              label: `Total Amount With GST (GST: ₹${gstOnlyAmount()})`,
              name: "gst_amount",
              type: "number",
              readOnly: true,
            },
          ].map(({ label, name, type = "text", readOnly = false }) => (
            <div key={name} className="w-full">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                {label}
                {name !== "po_number" && name !== "notes" && (
                  <span className="text-red-600"> *</span>
                )}
              </label>

              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                readOnly={readOnly}
                className={`border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none ${
                  readOnly ? "bg-gray-200" : ""
                }`}
              />
            </div>
          ))}

          {/* Notes */}
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            backgroundColor: "#F6812D",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "6px 36px",
            width: "200px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#E66A1F" },
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddInvoiceModal;
