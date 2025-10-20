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
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useCreateLandBankMasterMutation } from "../../../api/users/landbankApi";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";

const CreateLandBankModal = ({ open, handleClose, activeItem }) => {
  const [createLandBank, { isLoading }] = useCreateLandBankMasterMutation();
  const { data, isLoading: isLoadingCategory } = useGetLandCategoriesQuery();

  const [formData, setFormData] = useState({
    land_bank_id: activeItem?.id || "",
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
    land_location_files: [],
    land_survey_number_files: [],
    land_key_plan_files: [],
    land_attach_approval_report_files: [],
    land_approach_road_files: [],
    land_co_ordinates_files: [],
    land_lease_deed_files: [],
    land_transmission_line_files: [],
  });

  const [currentKeypoint, setCurrentKeypoint] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setFormData({
      land_bank_id: activeItem?.id || "",
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
      land_location_files: [],
      land_survey_number_files: [],
      land_key_plan_files: [],
      land_attach_approval_report_files: [],
      land_approach_road_files: [],
      land_co_ordinates_files: [],
      land_lease_deed_files: [],
      land_transmission_line_files: [],
    });
    setCurrentKeypoint("");
    setValidationErrors({});
  }, [activeItem]);

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

  const errorInputStyles = {
    ...inputStyles,
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #ef4444",
      borderBottom: "4px solid #ef4444",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear conditional fields when land_type changes
    if (name === "land_type") {
      setFormData({
        ...formData,
        [name]: value,
        sale_deed_date: "",
        sale_deed_number: "",
        lease_deed_date: "",
        lease_deed_number: "",
      });
      // Clear conditional field errors
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.sale_deed_date;
        delete newErrors.sale_deed_number;
        delete newErrors.lease_deed_date;
        delete newErrors.lease_deed_number;
        return newErrors;
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: Array.from(e.target.files) });
    // Clear validation error for file field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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

  const validateForm = () => {
    const errors = {};
    
    // Base required fields
    const baseRequiredFields = [
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
      { key: "mort_gaged", label: "Mortgaged" },
    ];

    // Validate base required fields
    baseRequiredFields.forEach(field => {
      if (!formData[field.key] || formData[field.key].toString().trim() === "") {
        errors[field.key] = `${field.label} is required`;
      }
    });

    // Conditional validation based on land_type
    if (formData.land_type === "buy") {
      if (!formData.sale_deed_date) {
        errors.sale_deed_date = "Sale Deed Date is required for Buy type";
      }
      if (!formData.sale_deed_number || formData.sale_deed_number.trim() === "") {
        errors.sale_deed_number = "Sale Deed Number is required for Buy type";
      }
    } else if (formData.land_type === "lease") {
      if (!formData.lease_deed_date) {
        errors.lease_deed_date = "Lease Deed Date is required for Lease type";
      }
      if (!formData.lease_deed_number || formData.lease_deed_number.trim() === "") {
        errors.lease_deed_number = "Lease Deed Number is required for Lease type";
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      
      // Show first error in toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'keypoints') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await createLandBank(formDataToSend).unwrap();
      
      // Check response status
      if (response.status === false) {
        toast.error(response.message || "Failed to create Land Bank");
        return;
      }
      
      toast.success(response.message || "Land Bank created successfully!");
      handleClose();
    } catch (error) {
      // Handle API errors
      console.error("API Error:", error);
      
      let errorMessage = "Failed to create Land Bank. Please try again.";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    }
  };

  const FileUploadComponent = ({ field, label, files, onChange }) => (
    <div className="col-span-full sm:col-span-1 my-4">
      <label className="block mb-3 text-[#29346B] text-base sm:text-lg font-semibold">
        {label} <span className="text-red-600">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          id={field.name}
          className="hidden"
          multiple
          onChange={(e) => onChange(e, field.name)}
        />
        <label
          htmlFor={field.name}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-yellow-300 rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-8 h-8 mb-2 text-yellow-500" />
            <p className="mb-2 text-sm text-gray-600 text-center px-2">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Multiple files allowed</p>
          </div>
        </label>
      </div>
      {files.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {files.length} file(s) selected:
          </p>
          <div className="space-y-1">
            {files.slice(0, 3).map((file, index) => (
              <p key={index} className="text-xs text-gray-600 truncate">
                • {file.name}
              </p>
            ))}
            {files.length > 3 && (
              <p className="text-xs text-gray-500">
                ...and {files.length - 3} more files
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
          Create Land Bank
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
              sx={validationErrors.land_name ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.land_name}
              helperText={validationErrors.land_name}
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
              sx={validationErrors.block_number ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.block_number}
              helperText={validationErrors.block_number}
            />
          </div>

          {/* Land Type */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
              Land Type <span className="text-red-600">*</span>
            </label>
            <TextField
              name="land_type"
              select
              value={formData.land_type}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={validationErrors.land_type ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.land_type}
              helperText={validationErrors.land_type}
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
                  Sale Deed Date <span className="text-red-600">*</span>
                </label>
                <TextField 
                  type="date" 
                  name="sale_deed_date" 
                  value={formData.sale_deed_date} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={validationErrors.sale_deed_date ? errorInputStyles : inputStyles}
                  size="small"
                  error={!!validationErrors.sale_deed_date}
                  helperText={validationErrors.sale_deed_date}
                />
              </div>

              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Sale Deed Number <span className="text-red-600">*</span>
                </label>
                <TextField 
                  name="sale_deed_number" 
                  value={formData.sale_deed_number} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={validationErrors.sale_deed_number ? errorInputStyles : inputStyles}
                  size="small"
                  error={!!validationErrors.sale_deed_number}
                  helperText={validationErrors.sale_deed_number}
                />
              </div>
            </>
          )}

          {formData.land_type === "lease" && (
            <>
              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Lease Deed Date <span className="text-red-600">*</span>
                </label>
                <TextField 
                  type="date" 
                  name="lease_deed_date" 
                  value={formData.lease_deed_date} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={validationErrors.lease_deed_date ? errorInputStyles : inputStyles}
                  size="small"
                  error={!!validationErrors.lease_deed_date}
                  helperText={validationErrors.lease_deed_date}
                />
              </div>

              <div>
                <label className="block mt-4 mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                  Lease Deed Number <span className="text-red-600">*</span>
                </label>
                <TextField 
                  name="lease_deed_number" 
                  value={formData.lease_deed_number} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  sx={validationErrors.lease_deed_number ? errorInputStyles : inputStyles}
                  size="small"
                  error={!!validationErrors.lease_deed_number}
                  helperText={validationErrors.lease_deed_number}
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
              sx={validationErrors.survey_number ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.survey_number}
              helperText={validationErrors.survey_number}
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
              sx={validationErrors.village_name ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.village_name}
              helperText={validationErrors.village_name}
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
              sx={validationErrors.district_name ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.district_name}
              helperText={validationErrors.district_name}
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
              sx={validationErrors.taluka_tahshil_name ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.taluka_tahshil_name}
              helperText={validationErrors.taluka_tahshil_name}
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
              sx={validationErrors.land_co_ordinates ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.land_co_ordinates}
              helperText={validationErrors.land_co_ordinates}
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
              sx={validationErrors.area_meters ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.area_meters}
              helperText={validationErrors.area_meters}
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
              sx={validationErrors.area_acres ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.area_acres}
              helperText={validationErrors.area_acres}
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
              sx={validationErrors.seller_name ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.seller_name}
              helperText={validationErrors.seller_name}
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
              sx={validationErrors.buyer_name ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.buyer_name}
              helperText={validationErrors.buyer_name}
            />
          </div>

          {/* Status and Additional Fields */}
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
              Mortgaged <span className="text-red-600">*</span>
            </label>
            <TextField
              name="mort_gaged"
              select
              value={formData.mort_gaged}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={validationErrors.mort_gaged ? errorInputStyles : inputStyles}
              size="small"
              error={!!validationErrors.mort_gaged}
              helperText={validationErrors.mort_gaged}
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
          <div className="col-span-full">
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
                  Added Key Points ({formData.keypoints.length}):
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
          </div>

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

          {/* Required File Uploads */}
          <div className="col-span-full">
            <h3 className="text-lg sm:text-xl font-semibold text-[#29346B] mt-6 mb-4">
              Required Documents
            </h3>
          </div>

          {[
            { name: "land_location_files", label: "Land Location Files" },
            { name: "land_survey_number_files", label: "Survey Number Files" },
            { name: "land_key_plan_files", label: "Key Plan Files" },
            { name: "land_attach_approval_report_files", label: "Approval Report Files" },
            { name: "land_approach_road_files", label: "Approach Road Files" },
            { name: "land_co_ordinates_files", label: "Co-ordinates Files" },
            { name: "land_lease_deed_files", label: "Lease Deed Files" },
            { name: "land_transmission_line_files", label: "Transmission Line Files" }
          ].map((file) => (
            <FileUploadComponent
              key={file.name}
              field={file}
              label={file.label}
              files={formData[file.name]}
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
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLandBankModal;