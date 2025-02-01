import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete } from "@mui/material";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";
import { useApproveLandBankByHodMutation } from "../../../api/users/landbankApi";
import { toast } from "react-toastify";

export default function LandApproveModal({ open, setOpen, selectedLand }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [landTitle, setLandTitle] = useState("");
  const { data: categories, isLoading, isError } = useGetLandCategoriesQuery();
  const [files, setFiles] = useState({
    landLocation: [],
    landSurveyNumber: [],
    keyPlan: [],
    approachRoad: [],
    coordinates: [],
    proposedGSS: [],
    transmissionLine: [],
  });
  const [approvalReport, setApprovalReport] = useState([]);

  const [approveLandBankByHod] = useApproveLandBankByHodMutation();

  const categoryOptions = categories?.data || [];
  const energyOptions = [
    { label: "Solar", value: "solar" },
    { label: "Wind", value: "wind" },
  ];

  // Pre-fill the form when selectedLand changes
  useEffect(() => {
    if (selectedLand) {
      setLandTitle(selectedLand.land_name);
      setSelectedCategory(
        categoryOptions.find((cat) => cat.id === selectedLand.land_category) ||
          null
      );
      setSelectedEnergy(
        energyOptions.find(
          (energy) => energy.value === selectedLand.solar_or_winds.toLowerCase()
        ) || null
      );

      // Set files from selectedLand
      setFiles({
        landLocation: selectedLand.land_location_file || [],
        landSurveyNumber: selectedLand.land_survey_number_file || [],
        keyPlan: selectedLand.land_key_plan_file || [],
        approachRoad: selectedLand.land_approach_road_file || [],
        coordinates: selectedLand.land_co_ordinates_file || [],
        proposedGSS: selectedLand.land_proposed_gss_file || [],
        transmissionLine: selectedLand.land_transmission_line_file || [],
      });
    }
  }, [selectedLand, categoryOptions]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e, field) => {
    setFiles({
      ...files,
      [field]: [...files[field], ...Array.from(e.target.files)],
    });
  };

  const handleApprovalReportChange = (e) => {
    setApprovalReport([...Array.from(e.target.files)]);
  };

  const handleFilePreview = (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
    } else {
      // Handle local file preview if needed
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Append required fields
    formData.append("land_category_id", selectedCategory?.id || "");
    formData.append("land_bank_status", "Approved");

    // Append approval report files
    approvalReport.forEach((file) => {
      formData.append("approved_report_files", file);
    });

    try {
      const response = await approveLandBankByHod({
        id: selectedLand.id, // Pass the land bank ID from selectedLand
        formData, // Pass the formData
      }).unwrap();

      console.log("Response:", response);
      toast.success("Land bank approved successfully!");
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to approve land bank. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: "600px",
          },
        }}
      >
        <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
          Approve Land
        </DialogTitle>
        <DialogContent>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Land Title
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={landTitle}
            placeholder="Enter Land Title"
            onChange={(e) => setLandTitle(e.target.value)}
          />

          {/* Select Category Autocomplete */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Category
          </label>
          <Autocomplete
            options={categoryOptions}
            getOptionLabel={(option) => option.category_name}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select a category"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid #FACC15",
                    borderBottom: "4px solid #FACC15",
                    borderRadius: "6px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    border: "none",
                    borderRadius: "4px",
                  },
                }}
              />
            )}
          />

          {/* Energy Type Autocomplete */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Energy Type
          </label>
          <Autocomplete
            options={energyOptions}
            getOptionLabel={(option) => option.label}
            value={selectedEnergy}
            onChange={(event, newValue) => setSelectedEnergy(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select an energy type"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid #FACC15",
                    borderBottom: "4px solid #FACC15",
                    borderRadius: "6px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    border: "none",
                    borderRadius: "4px",
                  },
                }}
              />
            )}
          />

          {/* File Uploads Section */}
          <div className="mt-6">
            <div className="flex justify-between mb-4">
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Land Location (View Only)
                </label>
                {files.landLocation.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => handleFilePreview(file)}
                  >
                    {file.url || file.name}
                  </div>
                ))}
              </div>

              {/* Land Survey Number View Only */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Land Survey Number (View Only)
                </label>
                {files.landSurveyNumber.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => handleFilePreview(file)}
                  >
                    {file.url || file.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mb-4">
              {/* Key Plan View Only */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Key Plan (View Only)
                </label>
                {files.keyPlan.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => handleFilePreview(file)}
                  >
                    {file.url || file.name}
                  </div>
                ))}
              </div>

              {/* Approach Road View Only */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Approach Road (View Only)
                </label>
                {files.approachRoad.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => handleFilePreview(file)}
                  >
                    {file.url || file.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mb-4">
              {/* Coordinates View Only */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Coordinates (View Only)
                </label>
                {files.coordinates.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => handleFilePreview(file)}
                  >
                    {file.url || file.name}
                  </div>
                ))}
              </div>

              {/* Proposed GSS View Only */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Proposed GSS (View Only)
                </label>
                {files.proposedGSS.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => handleFilePreview(file)}
                  >
                    {file.url || file.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission Line View Only */}
            <div className="w-full mb-4">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Transmission Line (View Only)
              </label>
              {files.transmissionLine.map((file, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 cursor-pointer hover:underline"
                  onClick={() => handleFilePreview(file)}
                >
                  {file.url || file.name}
                </div>
              ))}
            </div>

            {/* Attach Approval Report Upload */}
            <div className="w-full mb-4">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Attach Approval Report (Upload)
              </label>
              <input
                type="file"
                multiple
                className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                onChange={handleApprovalReportChange}
              />
              {approvalReport.map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            padding: "20px",
          }}
        >
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
              "&:hover": {
                backgroundColor: "#E66A1F",
              },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}