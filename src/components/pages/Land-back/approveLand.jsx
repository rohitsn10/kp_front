import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useApproveRejectLandBankStatusMutation } from "../../../api/users/landbankApi";

export default function LandApproveModal({ open, setOpen, selectedLand }) {
  const [files, setFiles] = useState({});
  const [landBankStatus, setLandBankStatus] = useState("pending"); // Default to pending
  const [approveRejectLandBankStatus, { isLoading, error }] = useApproveRejectLandBankStatusMutation();

  useEffect(() => {
    if (selectedLand) {
      // Extract only file-related keys dynamically
      const fileKeys = Object.keys(selectedLand).filter((key) => key.includes("file"));
      const fileData = {};

      fileKeys.forEach((key) => {
        fileData[key] = selectedLand[key] || [];
      });

      setFiles(fileData);
      // Set initial land bank status if available
      if (selectedLand.land_bank_status) {
        setLandBankStatus(selectedLand.land_bank_status);
      }
    }
  }, [selectedLand]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilePreview = (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const handleSubmit = async () => {
    if (selectedLand?.id) {
      try {
        await approveRejectLandBankStatus({ id: selectedLand.id, land_bank_status: landBankStatus }).unwrap();
        console.log("Status updated successfully");
        setOpen(false); // Close modal after successful submission
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Approve Land</DialogTitle>
      <DialogContent>
        <h3 className="text-lg font-semibold">Files</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          {Object.entries(files).map(([category, fileList]) => (
            <div key={category} className="mb-4 ">
              {/* <h4 className="font-medium capitalize"></h4> */}
              <label className="block mb-1 capitalize text-[#29346B] text-xl font-semibold">
                {category.replace(/_/g, " ")} :
            </label>
            <div className="flex flex-row gap-2">
              {fileList.length > 0 ? (
                fileList.map((file, index) => (
                  <div key={index} className="mb-2">
                    <Button variant="contained" color="primary" onClick={() => handleFilePreview(file)}>
                      View File
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No files available</p>
              )}
              </div>
            </div>
          ))}
        </div>

        {/* Dropdown for Land Bank Status */}
        <FormControl fullWidth className="mt-4">
          {/* <InputLabel></InputLabel> */}
          <label className="block mb-1 capitalize text-[#29346B] text-xl font-semibold">
              Land Bank Status
          </label>
          <Select value={landBankStatus} onChange={(e) => setLandBankStatus(e.target.value)} disabled={isLoading}>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
        {error && <p className="text-red-500 mt-2">Error updating status. Try again.</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
