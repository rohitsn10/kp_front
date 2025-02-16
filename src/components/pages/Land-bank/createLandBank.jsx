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
} from "@mui/material";
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
    old_block_number: "",
    new_block_number: "",
    sale_deed_date: "",
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
    tcr: "",
    advocate_name: "",
    total_land_area: "",
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

  useEffect(() => {
    setFormData({
      land_bank_id: activeItem?.id || "",
      land_category_id: "",
      land_name: "",
      old_block_number: "",
      new_block_number: "",
      sale_deed_date: "",
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
      tcr: "",
      advocate_name: "",
      total_land_area: "",
      land_location_files: [],
      land_survey_number_files: [],
      land_key_plan_files: [],
      land_attach_approval_report_files: [],
      land_approach_road_files: [],
      land_co_ordinates_files: [],
      land_lease_deed_files: [],
      land_transmission_line_files: [],
    });
  }, [activeItem]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: Array.from(e.target.files) });
  };

  const handleSubmit = async () => {
    // Add validation for required fields
    const requiredFields = [
      "land_bank_id",
      "land_category_id",
      "land_name",
      "survey_number",
      "village_name",
      "district_name",
      "taluka_tahshil_name",
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await createLandBank(formDataToSend).unwrap();
      toast.success("Land Bank created successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to create Land Bank. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <h2 className="text-3xl mx-auto my-5 font-semibold text-[#29346B]">Create Land Bank</h2>

      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {/* Basic Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Land Bank Name <span className="text-red-600">*</span>
            </label>
            <TextField name="land_name" value={formData.land_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Land Category <span className="text-red-600">*</span>
            </label>
            <TextField
              name="land_category_id"
              select
              value={formData.land_category_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={inputStyles}
            >
              {isLoadingCategory ? (
                <MenuItem disabled><CircularProgress size={24} /></MenuItem>
              ) : (
                data?.data.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </div>

          {/* Block Numbers */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Old Block Number
            </label>
            <TextField name="old_block_number" value={formData.old_block_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              New Block Number
            </label>
            <TextField name="new_block_number" value={formData.new_block_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Deed Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Sale Deed Date
            </label>
            <TextField type="date" name="sale_deed_date" value={formData.sale_deed_date} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Lease Deed Number
            </label>
            <TextField name="lease_deed_number" value={formData.lease_deed_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Location Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Survey Number <span className="text-red-600">*</span>
            </label>
            <TextField name="survey_number" value={formData.survey_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Village Name <span className="text-red-600">*</span>
            </label>
            <TextField name="village_name" value={formData.village_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              District Name <span className="text-red-600">*</span>
            </label>
            <TextField name="district_name" value={formData.district_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Taluka/Tahshil Name <span className="text-red-600">*</span>
            </label>
            <TextField name="taluka_tahshil_name" value={formData.taluka_tahshil_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Land Details */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Proposed GSS Number
            </label>
            <TextField name="propose_gss_number" value={formData.propose_gss_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Land Coordinates
            </label>
            <TextField name="land_co_ordinates" value={formData.land_co_ordinates} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Area Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Area (Meters)
            </label>
            <TextField type="number" name="area_meters" value={formData.area_meters} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Area (Acres)
            </label>
            <TextField type="number" name="area_acres" value={formData.area_acres} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Additional Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Industrial Jantri
            </label>
            <TextField name="industrial_jantri" value={formData.industrial_jantri} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Jantri Value
            </label>
            <TextField type="number" name="jantri_value" value={formData.jantri_value} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Seller/Buyer Information */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Seller Name
            </label>
            <TextField name="seller_name" value={formData.seller_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Buyer Name
            </label>
            <TextField name="buyer_name" value={formData.buyer_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          {/* Status and Additional Fields */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Land Status
            </label>
            <TextField name="land_status" value={formData.land_status} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
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
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Actual Bucket
            </label>
            <TextField name="actual_bucket" value={formData.actual_bucket} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Index Number
            </label>
            <TextField name="index_number" value={formData.index_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
  <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
    TCR
  </label>
  <select
    name="tcr"
    value={formData.tcr}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded"
  >
    <option value="True">True</option>
    <option value="False">False</option>
  </select>
</div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Advocate Name
            </label>
            <TextField name="advocate_name" value={formData.advocate_name} onChange={handleChange}
            fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Total Land Area
            </label>
            <TextField name="total_land_area" type="number" value={formData.total_land_area} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
          </div>

          <div className="col-span-2">
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
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
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-4">Required Documents</h3>
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
            <div className="col-span-2 my-4" key={file.name}>
              <label className="block mb-3 text-[#29346B] text-lg font-semibold">
                {file.label} <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-lg bg-white-500"
                multiple
                onChange={(e) => handleFileChange(e, file.name)}
              />
              {formData[file.name].length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {formData[file.name].length} file(s) selected
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions className="p-4">
        <Button
          onClick={handleClose}
          variant="outlined"
          className="mr-2"
          sx={{
            borderColor: '#FACC15',
            color: '#29346B',
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
          sx={{
            backgroundColor: '#FACC15',
            color: '#29346B',
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