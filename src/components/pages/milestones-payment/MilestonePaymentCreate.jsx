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
    gst_amount: "",  // This will now store total + GST amount
    paid_amount: "",
    pending_amount: "",
    payment_date: "",
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
      paid_amount: "",
      pending_amount: "",
      payment_date: "",
      notes: "",
    });
  }, [open]);

  useEffect(() => {
    if (milestoneId) {
      setFormData((prev) => ({ ...prev, milestone_id: milestoneId }));
    }
  }, [milestoneId]);

  // Calculate total amount with GST when total amount or GST percentage changes
  useEffect(() => {
    if (formData.total_amount && formData.gst_percentage) {
      const totalAmount = parseFloat(formData.total_amount);
      const gstPercentage = parseFloat(formData.gst_percentage);
      
      if (!isNaN(totalAmount) && !isNaN(gstPercentage)) {
        const gstAmount = totalAmount * gstPercentage / 100;
        const totalWithGst = (totalAmount + gstAmount).toFixed(2);
        
        setFormData(prev => ({
          ...prev,
          gst_amount: totalWithGst
        }));
      }
    }
  }, [formData.total_amount, formData.gst_percentage]);

  // Calculate pending amount based on total with GST and paid amount
  useEffect(() => {
    if (formData.gst_amount && formData.paid_amount) {
      const totalWithGst = parseFloat(formData.gst_amount);
      const paidAmount = parseFloat(formData.paid_amount);
      
      if (!isNaN(totalWithGst) && !isNaN(paidAmount)) {
        const pendingAmount = (totalWithGst - paidAmount).toFixed(2);
        
        setFormData(prev => ({
          ...prev,
          pending_amount: pendingAmount
        }));
      }
    }
  }, [formData.gst_amount, formData.paid_amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return (
      formData.party_name.trim() !== "" &&
      formData.po_number.trim() !== "" &&
      formData.invoice_number.trim() !== "" &&
      formData.total_amount !== "" &&
      formData.gst_percentage !== "" &&
      formData.gst_amount !== "" &&
      formData.paid_amount !== "" &&
      formData.pending_amount !== "" &&
      formData.payment_date !== ""
    );
  };

  // Calculate just the GST amount (for display purposes)
  const calculateGstOnlyAmount = () => {
    if (formData.total_amount && formData.gst_percentage) {
      const totalAmount = parseFloat(formData.total_amount);
      const gstPercentage = parseFloat(formData.gst_percentage);
      
      if (!isNaN(totalAmount) && !isNaN(gstPercentage)) {
        return (totalAmount * gstPercentage / 100).toFixed(2);
      }
    }
    return "0.00";
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await createMilestonePayment(formData).unwrap();
      if (response?.status) {
        toast.success("Invoice Added Successfully");
        refetch();
        handleClose();
      } else {
        toast.error(response?.message || "Failed to add invoice");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Something went wrong");
    }
  };

  // Get GST only amount for the label
  const gstOnlyAmount = calculateGstOnlyAmount();

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
              label: `Total Amount With GST (GST: ₹${gstOnlyAmount})`, 
              name: "gst_amount", 
              type: "number", 
              readOnly: true 
            },
            { label: "Paid Amount", name: "paid_amount", type: "number" },
            { label: "Pending Amount", name: "pending_amount", type: "number", readOnly: true },
            { label: "Payment Date", name: "payment_date", type: "date" },
          ].map(({ label, name, type = "text", readOnly = false }) => (
            <div key={name} className="w-full">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                {label}
                <span className="text-red-600"> *</span>
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                readOnly={readOnly}
                className={`border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none ${
                  readOnly ? "bg-gray-100" : ""
                }`}
              />
            </div>
          ))}

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              rows={2}
            ></textarea>
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