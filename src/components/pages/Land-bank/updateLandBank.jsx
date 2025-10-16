import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload as UploadIcon, Download as DownloadIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useUpdateLandBankMasterMutation } from "../../../api/users/landbankApi";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";

const UpdateLandBankModal = ({ open, handleClose, activeItem }) => {
  const [updateLandBank, { isLoading }] = useUpdateLandBankMasterMutation();
  const { data, isLoading: isLoadingCategory } = useGetLandCategoriesQuery();

  const [formData, setFormData] = useState({
    land_bank_id: "",
    land_category_id: "",
    land_name: "",
    block_number: "",
    land_type: "",
    sale_deed_date: "",
    sale_deed_number: "",
    lease_deed_date: "",
    lease_deed_number: "",
    survey_number: "",
    village_name: "",
    district_name: "",
    taluka_tahshil_name: "",
    propose_gss_number: "",
    land_co_ordinates: "",
    land_status: "",
    area_meters: "",
    area_acres: "",
    industrial_jantri: "",
    jantri_value: "",
    mort_gaged: "",
    seller_name: "",
    buyer_name: "",
    actual_bucket: "",
    remarks: "",
    index_number: "",
    tsr: "",
    advocate_name: "",
    total_land_area: "",
    keypoints: [],
    // File fields
    land_location_files: [],
    land_survey_number_files: [],
    land_key_plan_files: [],
    land_attach_approval_report_files: [],
    land_approach_road_files: [],
    land_co_ordinates_files: [],
    land_lease_deed_files: [],
    land_transmission_line_files: [],
  });

  const [existingFiles, setExistingFiles] = useState({
    land_location_file: [],
    land_survey_number_file: [],
    land_key_plan_file: [],
    land_attach_approval_report_file: [],
    land_approach_road_file: [],
    land_co_ordinates_file: [],
    land_lease_deed_file: [],
    land_transmission_line_file: [],
  });

  const [currentKeypoint, setCurrentKeypoint] = useState("");

  useEffect(() => {
    if (activeItem) {
      setFormData({
        land_bank_id: activeItem?.id || "",
        land_category_id: activeItem?.land_category_id || "",
        land_name: activeItem?.land_name || "",
        block_number: activeItem?.block_number || "",
        land_type: activeItem?.land_type || "",
        sale_deed_date: activeItem?.sale_deed_date || "",
        sale_deed_number: activeItem?.sale_deed_number || "",
        lease_deed_date: activeItem?.lease_deed_date || "",
        lease_deed_number: activeItem?.lease_deed_number || "",
        survey_number: activeItem?.survey_number || "",
        village_name: activeItem?.village_name || "",
        district_name: activeItem?.district_name || "",
        taluka_tahshil_name: activeItem?.taluka_tahshil_name || "",
        propose_gss_number: activeItem?.propose_gss_number || "",
        land_co_ordinates: activeItem?.land_co_ordinates || "",
        land_status: activeItem?.land_status || "",
        area_meters: activeItem?.area_meters || "",
        area_acres: activeItem?.area_acres || "",
        industrial_jantri: activeItem?.industrial_jantri || "",
        jantri_value: activeItem?.jantri_value || "",
        mort_gaged: activeItem?.mort_gaged || "",
        seller_name: activeItem?.seller_name || "",
        buyer_name: activeItem?.buyer_name || "",
        actual_bucket: activeItem?.actual_bucket || "",
        remarks: activeItem?.remarks || "",
        index_number: activeItem?.index_number || "",
        tsr: activeItem?.tsr || "",
        advocate_name: activeItem?.advocate_name || "",
        total_land_area: activeItem?.total_land_area || "",
        // keypoints: activeItem?.keypoints ? JSON.parse(activeItem.keypoints) : [],
        land_location_files: [],
        land_survey_number_files: [],
        land_key_plan_files: [],
        land_attach_approval_report_files: [],
        land_approach_road_files: [],
        land_co_ordinates_files: [],
        land_lease_deed_files: [],
        land_transmission_line_files: [],
      });

      // Set existing files
      setExistingFiles({
        land_location_file: activeItem?.land_location_file || [],
        land_survey_number_file: activeItem?.land_survey_number_file || [],
        land_key_plan_file: activeItem?.land_key_plan_file || [],
        land_attach_approval_report_file: activeItem?.land_attach_approval_report_file || [],
        land_approach_road_file: activeItem?.land_approach_road_file || [],
        land_co_ordinates_file: activeItem?.land_co_ordinates_file || [],
        land_lease_deed_file: activeItem?.land_lease_deed_file || [],
        land_transmission_line_file: activeItem?.land_transmission_line_file || [],
      });

      setCurrentKeypoint("");
    }
  }, [activeItem, open]);

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      transition: "border 0.2s ease-in-out",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15",
        borderBottom: "4px solid #FACC15",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15",
        borderWidth: "2px",
        borderBottom: "4px solid #FACC15",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "land_type") {
      setFormData({
        ...formData,
        [name]: value,
        sale_deed_date: "",
        sale_deed_number: "",
        lease_deed_date: "",
        lease_deed_number: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: Array.from(e.target.files) });
  };

  const removeExistingFile = (fileKey, fileId) => {
    setExistingFiles({
      ...existingFiles,
      [fileKey]: existingFiles[fileKey].filter(file => file.id !== fileId)
    });
  };

  // Keypoints handlers
  const addKeypoint = () => {
    if (currentKeypoint.trim() && !formData.keypoints.includes(currentKeypoint.trim())) {
      setFormData({
        ...formData,
        keypoints: [...formData.keypoints, currentKeypoint.trim()]
      });
      setCurrentKeypoint("");
    }
  };

  const removeKeypoint = (indexToRemove) => {
    setFormData({
      ...formData,
      keypoints: formData.keypoints.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleKeypointKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeypoint();
    }
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { key: "land_bank_id", label: "Land Bank ID" },
      { key: "land_name", label: "Land Bank Name" },
      { key: "block_number", label: "Block Number" },
      { key: "survey_number", label: "Survey Number" },
      { key: "village_name", label: "Village Name" },
      { key: "district_name", label: "District Name" },
      { key: "taluka_tahshil_name", label: "Taluka/Tahshil Name" },
      { key: "land_co_ordinates", label: "Land Coordinates" },
      { key: "area_meters", label: "Area (Meters)" },
      { key: "area_acres", label: "Area (Acres)" },
      { key: "seller_name", label: "Seller Name" },
      { key: "buyer_name", label: "Buyer Name" },
    ];

    const missingFields = requiredFields.filter(field => !formData[field.key]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required data.");
      return;
    }

    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (key === 'keypoints') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append(key, file);
          }
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add existing files to be retained
    Object.keys(existingFiles).forEach((key) => {
      if (existingFiles[key] && existingFiles[key].length > 0) {
        formDataToSend.append(`existing_${key}`, JSON.stringify(existingFiles[key].map(f => f.id)));
      }
    });

    try {
      await updateLandBank({ 
        id: formData.land_bank_id, 
        formData: formDataToSend 
      }).unwrap();
      toast.success("Land Bank updated successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to update Land Bank. Please try again.");
    }
  };

  const FileUploadComponent = ({ field, label, newFiles, existingFileKey }) => (
    <div className="col-span-full sm:col-span-1 my-4">
      <label className="block mb-3 text-[#29346B] text-base sm:text-lg font-semibold">
        {label}
      </label>

      {/* Existing Files */}
      {existingFiles[existingFileKey] && existingFiles[existingFileKey].length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Existing Files ({existingFiles[existingFileKey].length}):
          </p>
          <div className="space-y-2">
            {existingFiles[existingFileKey].map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded border border-blue-100">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 flex-1"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span className="text-xs truncate">{file.url.split('/').pop()}</span>
                </a>
                <IconButton
                  size="small"
                  onClick={() => removeExistingFile(existingFileKey, file.id)}
                  sx={{ color: '#EF4444' }}
                >
                  <DeleteIcon className="w-4 h-4" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New File Upload */}
      <div className="relative">
        <input
          type="file"
          id={field.name}
          className="hidden"
          multiple
          onChange={(e) => handleFileChange(e, field.name)}
        />
        <label
          htmlFor={field.name}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-yellow-300 rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-8 h-8 mb-2 text-yellow-500" />
            <p className="mb-2 text-sm text-gray-600 text-center px-2">
              <span className="font-semibold">Click to upload new files</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Multiple files allowed</p>
          </div>
        </label>
      </div>

      {/* New Files Preview */}
      {newFiles.length > 0 && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-900 mb-2">
            New files to upload ({newFiles.length}):
          </p>
          <div className="space-y-1">
            {newFiles.slice(0, 3).map((file, index) => (
              <p key={index} className="text-xs text-green-700 truncate">
                • {file.name}
              </p>
            ))}
            {newFiles.length > 3 && (
              <p className="text-xs text-green-600">
                ...and {newFiles.length - 3} more files
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="lg"
      PaperProps={{
        sx: { 
          margin: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'auto' },
          maxHeight: { xs: 'calc(100% - 16px)', sm: 'auto' }
        }
      }}
    >
      <div className="px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl text-center my-4 sm:my-5 font-semibold text-[#29346B]">
          Update Land Bank
        </h2>
      </div>

      <DialogContent className="px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
          {/* Basic Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Land Bank Name <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="land_name" 
              value={formData.land_name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Block Number <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="block_number" 
              value={formData.block_number} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Land Type */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Land Type
            </label>
            <TextField
              name="land_type"
              select
              value={formData.land_type}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={inputStyles}
              size="small"
            >
              <MenuItem value="buy">Buy</MenuItem>
              <MenuItem value="lease">Lease</MenuItem>
            </TextField>
          </div>

          {/* Conditional fields based on Land Type */}
          {formData.land_type === "buy" && (
            <>
              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Sale Deed Date
                </label>
                <TextField 
                  type="date" 
                  name="sale_deed_date" 
                  value={formData.sale_deed_date} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={inputStyles}
                  size="small"
                />
              </div>

              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Sale Deed Number
                </label>
                <TextField 
                  name="sale_deed_number" 
                  value={formData.sale_deed_number} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={inputStyles}
                  size="small"
                />
              </div>
            </>
          )}

          {formData.land_type === "lease" && (
            <>
              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Lease Deed Date
                </label>
                <TextField 
                  type="date" 
                  name="lease_deed_date" 
                  value={formData.lease_deed_date} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={inputStyles}
                  size="small"
                />
              </div>

              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Lease Deed Number
                </label>
                <TextField 
                  name="lease_deed_number" 
                  value={formData.lease_deed_number} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={inputStyles}
                  size="small"
                />
              </div>
            </>
          )}

          {/* TSR Field */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              TSR
            </label>
            <TextField
              name="tsr"
              select
              value={formData.tsr}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={inputStyles}
              size="small"
            >
              <MenuItem value="clear">Clear</MenuItem>
              <MenuItem value="not_clear">Not Clear</MenuItem>
            </TextField>
          </div>

          {/* Location Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Survey Number <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="survey_number" 
              value={formData.survey_number} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Village Name <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="village_name" 
              value={formData.village_name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              District Name <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="district_name" 
              value={formData.district_name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Taluka/Tahshil Name <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="taluka_tahshil_name" 
              value={formData.taluka_tahshil_name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Land Details */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Proposed GSS Number
            </label>
            <TextField 
              name="propose_gss_number" 
              value={formData.propose_gss_number} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Land Coordinates <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="land_co_ordinates" 
              value={formData.land_co_ordinates} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Area Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Area (Meters) <span className="text-red-600">*</span>
            </label>
            <TextField 
              type="number" 
              name="area_meters" 
              value={formData.area_meters} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Area (Acres) <span className="text-red-600">*</span>
            </label>
            <TextField 
              type="number" 
              name="area_acres" 
              value={formData.area_acres} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Additional Information - Optional */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Industrial Jantri
            </label>
            <TextField 
              name="industrial_jantri" 
              value={formData.industrial_jantri} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Jantri Value
            </label>
            <TextField 
              type="number" 
              name="jantri_value" 
              value={formData.jantri_value} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Seller/Buyer Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Seller Name <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="seller_name" 
              value={formData.seller_name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Buyer Name <span className="text-red-600">*</span>
            </label>
            <TextField 
              name="buyer_name" 
              value={formData.buyer_name} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Status and Additional Fields - Optional */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Land Status
            </label>
            <TextField 
              name="land_status" 
              value={formData.land_status} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Mortgaged
            </label>
            <TextField
              name="mort_gaged"
              select
              value={formData.mort_gaged}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={inputStyles}
              size="small"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
          </div>

          {/* Additional Details - Optional */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Actual Bucket
            </label>
            <TextField 
              name="actual_bucket" 
              value={formData.actual_bucket} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Index Number
            </label>
            <TextField 
              name="index_number" 
              value={formData.index_number} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Advocate Name
            </label>
            <TextField 
              name="advocate_name" 
              value={formData.advocate_name} 
              onChange={handleChange}
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Total Land Area
            </label>
            <TextField 
              name="total_land_area" 
              type="number" 
              value={formData.total_land_area} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              sx={inputStyles}
              size="small"
            />
          </div>

          {/* Keypoints Section */}
          {/* <div className="col-span-full">
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Key Points
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <TextField
                value={currentKeypoint}
                onChange={(e) => setCurrentKeypoint(e.target.value)}
                onKeyPress={handleKeypointKeyPress}
                placeholder="Enter a key point"
                fullWidth
                sx={inputStyles}
                size="small"
              />
              <Button
                onClick={addKeypoint}
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!currentKeypoint.trim()}
                sx={{
                  backgroundColor: '#FACC15',
                  color: '#29346B',
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    backgroundColor: '#E6A015',
                  },
                }}
              >
                Add
              </Button>
            </div>
            
            {formData.keypoints.length > 0 && (
              <Box className="mt-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                <p className="text-sm font-medium text-[#29346B] mb-2">
                  Key Points ({formData.keypoints.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.keypoints.map((point, index) => (
                    <Chip
                      key={index}
                      label={point}
                      onDelete={() => removeKeypoint(index)}
                      deleteIcon={<DeleteIcon />}
                      variant="outlined"
                      sx={{
                        borderColor: '#FACC15',
                        color: '#29346B',
                        '& .MuiChip-deleteIcon': {
                          color: '#29346B',
                        },
                      }}
                    />
                  ))}
                </div>
              </Box>
            )}
          </div> */}

          <div className="col-span-full">
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Remarks
            </label>
            <TextField
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              sx={inputStyles}
            />
          </div>

          {/* File Uploads Section */}
          <div className="col-span-full">
            <h3 className="text-lg sm:text-xl font-semibold text-[#29346B] mt-6 mb-4">
              Documents
            </h3>
          </div>

          {[
            { name: "land_location_files", label: "Land Location Files", existingKey: "land_location_file" },
            { name: "land_survey_number_files", label: "Survey Number Files", existingKey: "land_survey_number_file" },
            { name: "land_key_plan_files", label: "Key Plan Files", existingKey: "land_key_plan_file" },
            { name: "land_attach_approval_report_files", label: "Approval Report Files", existingKey: "land_attach_approval_report_file" },
            { name: "land_approach_road_files", label: "Approach Road Files", existingKey: "land_approach_road_file" },
            { name: "land_co_ordinates_files", label: "Co-ordinates Files", existingKey: "land_co_ordinates_file" },
            { name: "land_lease_deed_files", label: "Lease Deed Files", existingKey: "land_lease_deed_file" },
            { name: "land_transmission_line_files", label: "Transmission Line Files", existingKey: "land_transmission_line_file" }
          ].map((file) => (
            <FileUploadComponent
              key={file.name}
              field={file}
              label={file.label}
              newFiles={formData[file.name]}
              existingFileKey={file.existingKey}
              onChange={handleFileChange}
            />
          ))}
        </div>
      </DialogContent>

      <DialogActions className="p-4 flex-col sm:flex-row gap-2">
        <Button
          onClick={handleClose}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: '#FACC15',
            color: '#29346B',
            order: { xs: 2, sm: 1 },
            '&:hover': {
              borderColor: '#E6A015',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          fullWidth
          sx={{
            backgroundColor: '#FACC15',
            color: '#29346B',
            order: { xs: 1, sm: 2 },
            '&:hover': {
              backgroundColor: '#E6A015',
            },
            '&:disabled': {
              backgroundColor: '#FAF0BE',
            },
          }}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateLandBankModal;