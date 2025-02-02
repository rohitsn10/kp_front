import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { useFetchUsersQuery } from "../../../api/users/usersApi";
import { useAddSfaDataToLandBankMutation } from "../../../api/users/landbankApi";
import { toast } from "react-toastify"; // Import toast for notifications

const AssessmentFormModal = ({ open, handleClose, selectedLand }) => {
  const [formData, setFormData] = useState({
    assessmentDate: "",
    siteVisitDate: "",
    siteVisitStatus: "",
    approvalStatus: "",
    assessmentType: "",
    sfaLandFiles: [],
    sfaTransmissionFiles: [],
    approvedReportFiles: [],
    selectedUsers: [],
    timeline: "",
  });

  const { data: userData, isLoading } = useFetchUsersQuery();
  const [addSfaDataToLandBank] = useAddSfaDataToLandBankMutation(); // Initialize the mutation hook

  const handleSubmit = async () => {
    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append all fields to the FormData object
      formDataToSend.append("timeline", formData.timeline);
      formDataToSend.append(
        "land_sfa_assigned_to_users",
        formData.selectedUsers.join(",")
      ); // Convert array to string
      formDataToSend.append("status_of_site_visit", formData.siteVisitStatus);
      formDataToSend.append("date_of_assessment", formData.assessmentDate);
      formDataToSend.append("site_visit_date", formData.siteVisitDate);

      // Append files
      Array.from(formData.sfaLandFiles).forEach((file) => {
        formDataToSend.append("land_sfa_file", file);
      });

      Array.from(formData.sfaTransmissionFiles).forEach((file) => {
        formDataToSend.append("sfa_for_transmission_line_gss_files", file);
      });

      Array.from(formData.approvedReportFiles).forEach((file) => {
        formDataToSend.append("approved_report_file", file);
      });

      // Call the mutation
      const response = await addSfaDataToLandBank({
        id: selectedLand.id, // Use the selected land ID
        formData: formDataToSend,
      }).unwrap();

      // Handle success
      toast.success("SFA data added successfully!");
      handleClose(); // Close the modal
    } catch (error) {
      // Handle error
      toast.error("Failed to add SFA data. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files });
  };

  const handleUserChange = (event, value) => {
    setFormData({ ...formData, selectedUsers: value });
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
      padding: "2px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      outline: "none",
      borderBottom: "4px solid #E6A015",
    },
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          color: "#29346B",
          fontSize: "27px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        SFA Form
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">
              Date of Assessment
            </h2>
            <TextField
              fullWidth
              type="date"
              name="assessmentDate"
              value={formData.assessmentDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              sx={inputStyles}
            />
          </div>
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">
              Site Visit Date
            </h2>
            <TextField
              fullWidth
              type="date"
              name="siteVisitDate"
              value={formData.siteVisitDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              sx={inputStyles}
            />
          </div>
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">
              Status of Site Visit
            </h2>
            <TextField
              fullWidth
              select
              name="siteVisitStatus"
              value={formData.siteVisitStatus}
              onChange={handleChange}
              margin="dense"
              sx={inputStyles}
            >
              {["Approved", "Pending", "Completed"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">
              Approval Status
            </h2>
            <TextField
              fullWidth
              select
              name="approvalStatus"
              value={formData.approvalStatus}
              onChange={handleChange}
              margin="dense"
              sx={inputStyles}
            >
              {["Approved", "Pending", "Completed"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">
              Enter Land Title
            </h2>
            <TextField
              fullWidth
              type="text"
              placeholder="Enter Land Title"
              value={formData.landTitle}
              onChange={handleChange}
              name="landTitle"
              sx={inputStyles}
              variant="outlined"
            />
          </div>

          {/* User Selection */}
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">
              Select Users
            </h2>
            <Autocomplete
              multiple
              options={userData ? userData.map((user) => user) : []} 
              getOptionLabel={(option) => option.full_name}
              value={formData.selectedUsers.map((userId) =>
                userData.find((user) => user.id === userId)
              )} 
              onChange={(event, value) => {
                setFormData({
                  ...formData,
                  selectedUsers: value.map((user) => user.id),
                });
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Users" sx={inputStyles} />
              )}
            />
          </div>

          {/* Timeline Date Picker (Future dates only) */}
          <div>
            <h2 className="text-[#29346B] font-semibold text-lg">Timeline</h2>
            <TextField
              fullWidth
              type="date"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              sx={inputStyles}
              inputProps={{
                min: today,
              }}
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="mt-4">
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            SFA for Land1 (Upload)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, "sfaLandFiles")}
            className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
          />

          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            SFA for Transmission Line & GSS (Upload)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, "sfaTransmissionFiles")}
            className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
          />

          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Approved Report (Upload)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, "approvedReportFiles")}
            className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            backgroundColor: "#f6812d",
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
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentFormModal;
