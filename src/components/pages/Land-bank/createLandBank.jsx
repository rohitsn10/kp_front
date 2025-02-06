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

const CreateLandBankModal = ({ open, handleClose,activeItem }) => {
    console.log(activeItem)
    const [createLandBank, { isLoading, isError, error }] = useCreateLandBankMasterMutation();
    const { data, isLoading:isLoadingCategory, error:isErrorCategory, refetch } = useGetLandCategoriesQuery();
    // console.log("Land Category",data)

  const [formData, setFormData] = useState({
    land_bank_id:activeItem?.id || "",
    land_category_id:"",
    land_name: "",
    survey_number: "",
    village_name: "",
    taluka_name: "",
    tahshil_name: "",
    total_land_area: "",
    solar_or_winds: "",
    land_attach_approval_report_files: [],
    land_location_files: [],
    land_survey_number_files: [],
    land_key_plan_files: [],
    land_approach_road_files: [],
    land_co_ordinates_files: [],
    land_proposed_gss_files: [],
    land_transmission_line_files: [],
  });

  useEffect(() => {
    // Reset all fields to their initial values when `activeItem` changes
    setFormData({
      land_bank_id:activeItem?.id || "",
      land_category_id: "",
      land_name: "",
      survey_number: "",
      village_name: "",
      taluka_name: "",
      tahshil_name: "",
      total_land_area: "",
      solar_or_winds: "",
      land_attach_approval_report_files: [],
      land_location_files: [],
      land_survey_number_files: [],
      land_key_plan_files: [],
      land_approach_road_files: [],
      land_co_ordinates_files: [],
      land_proposed_gss_files: [],
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
    if (!formData.land_bank_id || !formData.land_category_id || !formData.land_name || !formData.survey_number || !formData.village_name || !formData.taluka_name || !formData.tahshil_name || !formData.total_land_area || !formData.solar_or_winds) {

      toast.error("Please fill in all required fields.");
      return;
    }
    const requiredFileFields = [
        "land_key_plan_files",
        "land_approach_road_files",
        "land_co_ordinates_files",
        "land_proposed_gss_files",
      ];
  
      for (const field of requiredFileFields) {
        if (formData[field].length === 0) {
          toast.error(`Please upload files for ${field.replace(/_/g, " ")}`);
          return;
        }
      }
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    console.log(formData);
    
    try {
        // Call the API to create the Land Bank
        await createLandBank(formDataToSend).unwrap();
  
        toast.success("Land Bank created successfully!");
        handleClose();
      } catch (error) {
        toast.error("Failed to create Land Bank. Please try again.");
      }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <h2 className="text-3xl mx-auto my-5 font-semibold text-[#29346B]"> Create Land Bank</h2>  

      <DialogContent>
      <div className="grid grid-cols-1  md:grid-cols-2 gap-x-4">
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Land Bank Name <span className="text-red-600"> *</span>
        </label>
            <TextField placeholder="Land Name" name="land_name" value={formData.land_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} />
        </div>
          <div>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Select Land Bank <span className="text-red-600"> *</span>
        </label>
        <TextField
        //   label="Land Category"
        label="Land Category"
          placeholder="Land Category"
          name="land_category_id"
          select
          value={formData.land_category_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={inputStyles}
        >
          {isLoading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : error ? (
            <MenuItem disabled>
              <Typography color="error">Failed to load categories</Typography>
            </MenuItem>
          ) : data?.data.length === 0 ? (
            <MenuItem disabled>No categories available</MenuItem>
          ) : (
            data?.data.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.category_name}
              </MenuItem>
            ))
          )}
        </TextField>
</div>  
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Survey Number <span className="text-red-600"> *</span>
        </label>
            <TextField  placeholder="Survey Number" name="survey_number" value={formData.survey_number} onChange={handleChange} fullWidth margin="normal" sx={inputStyles}  />
        </div>
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Village Name <span className="text-red-600"> *</span>
        </label>
            <TextField placeholder="Village Name" name="village_name" value={formData.village_name} onChange={handleChange} fullWidth margin="normal"  sx={inputStyles} />
        </div>
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Taluka Name <span className="text-red-600"> *</span>
        </label>
            <TextField placeholder="Taluka Name" name="taluka_name" value={formData.taluka_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles}  />
        </div>
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Tashil Name <span className="text-red-600"> *</span>
        </label>
            <TextField placeholder="Tashil Name" name="tahshil_name" value={formData.tahshil_name} onChange={handleChange} fullWidth margin="normal" sx={inputStyles}  />
        </div>
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Total Land Area <span className="text-red-600"> *</span>
        </label>
            <TextField  placeholder="Total Land area" name="total_land_area" type="number" value={formData.total_land_area} onChange={handleChange} fullWidth margin="normal" sx={inputStyles}  />
        </div>
        <div>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Solar or Wind <span className="text-red-600"> *</span>
        </label>
            <TextField label="Solar or Wind" name="solar_or_winds" select value={formData.solar_or_winds} onChange={handleChange} fullWidth margin="normal" sx={inputStyles} >
            <MenuItem value="Solar">Solar</MenuItem>
            <MenuItem value="Wind">Wind</MenuItem>
            </TextField>
        </div>
        {/* Required Files */}
        {[
            "land_key_plan_files",
        "land_approach_road_files",
        "land_co_ordinates_files",
        "land_proposed_gss_files",
        ].map((field) => (
          <div className="my-4" key={field}>
            <label className="block mb-3 text-[#29346B] text-lg font-semibold">
              {field.replace(/_/g, " ").toUpperCase()} 
              <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-lg bg-white-500"
              multiple
              onChange={(e) => handleFileChange(e, field)}
            />
          </div>

        ))}
        {/* Non Required Files */}
        {[
          "land_attach_approval_report_files",
          "land_location_files",
          "land_survey_number_files",
          "land_transmission_line_files",
        ].map((field) => (
          <div className="my-4" key={field}>
            <label className="block mb-3 text-[#29346B] text-lg font-semibold">
              {field.replace(/_/g, " ").toUpperCase()} 
              {/* <span className="text-red-600">*</span> */}
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-lg bg-white-500"
              multiple
              onChange={(e) => handleFileChange(e, field)}
            />
          </div>

        ))}

    </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {/* <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button> */}

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading} // Disable button when API call is in progress
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLandBankModal;
