import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { useGetSfaDataQuery, useAddSfaDataToLandBankMutation } from "../../../api/sfa/sfaApi";

const AssessmentFormModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    // Existing fields
    sfa_name: "",
    land_sfa_file: [],
    sfa_for_transmission_line_gss_files: [],
    timeline: "",
    solar_or_winds: "",
    date_of_assessment: "",
    site_visit_date: "",

    // New fields from CURL request
    land_address: "",
    client_consultant: "",
    palnt_capacity: "",
    land_owner: "",
    sfa_available_area_acres: "",
    distance_from_main_road: "",
    road_highway_details: "",
    land_title: "",
    sfa_land_category: "",
    sfa_land_profile: "",
    sfa_land_orientation: "",
    sfa_land_soil_testing_availability: "",
    any_shadow_casting_buildings_or_hill: "",
    any_water_ponds_or_nalas_within_the_proposed_location: "",
    any_roads_or_bridge_within_the_proposed_location: "",
    any_railway_lane_within_the_proposed_location: "",
    is_the_proposed_site_is_of_natural_contour_or_filled_up_area: "",
    geo_graphical_cordinates: "",
    land_co_ordinates: "",
    substation_cordinates: "",
    solar_isolation_data: "",
    rain_fall_pattern: "",
    communication_network_availability: "",
    permission_required_for_power_generation: "",
    transmission_network_availabilty_above_400_220_33kv: "",
    distance_of_supply_point_from_proposed_site: "",
    distance_of_nearest_substation_from_proposed_site: "",
    transmission_line_load_carrying_or_evacuation_capacity: "",
    right_of_way_requirement_up_to_the_delivery_point: "",
    construction_power_availability_and_identify_source_distance: "",
    grid_availability_data_outage_pattern: "",
    substation_capacity_mva: "",
    substation_load_side_voltage_level_kv: "",
    kv_grid_voltage_variation: "",
    hz_grid_voltage_variation: "",
    check_space_availability_in_substation_to_conct_power_by_area: "",
    transformer_rating_in_substation: "",
    check_protection_system_details_of_substation: "",
    any_future_plan_for_expansion_of_substation: "",
    is_there_any_power_export_happening_at_substation: "",
    any_specific_requirements_of_eb_for_double_pole_structure: "",
    any_transmission_communication_line_passing_through_site: "",
    neighboring_area_or_vicinity_details: "",
    nearest_industry_category_and_distance: "",
    nearest_village_or_district_name_and_distance: "",
    nearest_highway_or_airport_name_and_distance: "",
    availability_of_labor_and_cost_of_labor: "",
    logistics: "",
    is_there_an_approach_road_available_to_the_site: "",
    can_truck_of_Multi_axel_with_40_foot_container_reach_site: "",
    availability_of_vehicle_for_hiring_or_cost_per_km: "",
    list_the_risks_including_journey: "",
    nearest_police_station_and_distance: "",
    nearest_hospital_and_distance: "",
    nearest_fire_station_and_distance: "",
    nearest_seashore_and_distance: "",
    availability_of_accommodation_to_site_approximate_cost: "",
    provide_near_by_civil_electrical_contractors: "",
    availability_of_construction_material_nearby: "",
    any_weather_station_nearby: "",
    water_belt_profile_of_the_area: "",
    water_availability: "",
    construction_water_availability: "",
    details_of_local_drainage_scheme: "",
    availability_of_potable_water: "",
    any_other_general_observation: "",
  });

  const [addSfaDataToLandBank] = useAddSfaDataToLandBankMutation();
  const { refetch } = useGetSfaDataQuery();

  // Validate form with comprehensive checks
  const validateForm = () => {
    const requiredFields = [
      'sfa_name', 'timeline', 'solar_or_winds', 
      'date_of_assessment', 'site_visit_date'
    ];
    
    // Check required fields
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/_/g, ' ')} field.`);
        return false;
      }
    }
    
    // Check file uploads
    if (formData.land_sfa_file.length === 0 || 
        formData.sfa_for_transmission_line_gss_files.length === 0) {
      toast.error("Please upload files for both land SFA and transmission line GSS.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'land_sfa_file' || key === 'sfa_for_transmission_line_gss_files') {
        // Handle file uploads
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        // Append other fields
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await addSfaDataToLandBank(formDataToSend);
      toast.success("SFA data added successfully!");
      refetch();
      handleClose();
    } catch (error) {
      toast.error("Failed to add SFA data. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    setFormData({ ...formData, [field]: Array.from(files) });
  };

  // Dropdown options
  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
  ];

  const landCategoryOptions = [
    { value: "Agricultural", label: "Agricultural" },
    { value: "Residential", label: "Residential" },
    { value: "Industrial", label: "Industrial" }
  ];

  const landProfileOptions = [
    { value: "Flat", label: "Flat" },
    { value: "Slightly Sloped", label: "Slightly Sloped" },
    { value: "Hilly", label: "Hilly" }
  ];

  // Reusable dropdown rendering functions
  const renderYesNoDropdown = (name, label) => (
    <TextField
      label={label}
      name={name}
      select
      value={formData[name]}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      margin="normal"
      sx={{
        "& .MuiOutlinedInput-root": {
          border: "1px solid #FACC15",
          borderBottom: "4px solid #FACC15",
          borderRadius: "6px",
        }
      }}
    >
      {yesNoOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );

  const renderCustomDropdown = (name, label, options) => (
    <TextField
      label={label}
      name={name}
      select
      value={formData[name]}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      margin="normal"
      sx={{
        "& .MuiOutlinedInput-root": {
          border: "1px solid #FACC15",
          borderBottom: "4px solid #FACC15",
          borderRadius: "6px",
        }
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
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
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <TextField
            label="SFA Name"
            name="sfa_name"
            value={formData.sfa_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Land Address"
            name="land_address"
            value={formData.land_address}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* File Uploads */}
          <div className="col-span-2 flex justify-between">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Land SFA File
              </label>
              <input
                type="file"
                name="land_sfa_file"
                multiple
                onChange={(e) => handleFileChange(e, "land_sfa_file")}
                style={{ marginBottom: "10px", marginTop: "10px" }}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                SFA For Transmission Line GSS Files
              </label>
              <input
                type="file"
                name="sfa_for_transmission_line_gss_files"
                multiple
                onChange={(e) => handleFileChange(e, "sfa_for_transmission_line_gss_files")}
                style={{ marginBottom: "10px", marginTop: "10px" }}
              />
            </div>
          </div>

          {/* Dates and Basic Fields */}
          <TextField
            label="Timeline"
            name="timeline"
            type="date"
            value={formData.timeline}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Solar or Wind"
            name="solar_or_winds"
            select
            value={formData.solar_or_winds}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="Solar">Solar</MenuItem>
            <MenuItem value="Wind">Wind</MenuItem>
          </TextField>
          <TextField
            label="Date of Assessment"
            name="date_of_assessment"
            type="date"
            value={formData.date_of_assessment}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Site Visit Date"
            name="site_visit_date"
            type="date"
            value={formData.site_visit_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          {/* Land Details */}
          {renderCustomDropdown(
            "sfa_land_category", 
            "Land Category", 
            landCategoryOptions
          )}
          {renderCustomDropdown(
            "sfa_land_profile", 
            "Land Profile", 
            landProfileOptions
          )}
          {renderYesNoDropdown(
            "sfa_land_soil_testing_availability", 
            "SFA Land Soil Testing Availability"
          )}
          {renderYesNoDropdown(
            "any_shadow_casting_buildings_or_hill", 
            "Any Shadow Casting Buildings or Hill"
          )}

          {/* Coordinates and Geographical Information */}
          <TextField
            label="Geographical Coordinates"
            name="geo_graphical_cordinates"
            value={formData.geo_graphical_cordinates}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Land Coordinates"
            name="land_co_ordinates"
            value={formData.land_co_ordinates}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* Additional Dropdowns */}
          {renderYesNoDropdown(
            "permission_required_for_power_generation", 
            "Permission Required for Power Generation"
          )}
          {renderYesNoDropdown(
            "right_of_way_requirement_up_to_the_delivery_point", 
            "Right of Way Requirement to Delivery Point"
          )}

          {/* More fields can be added similarly */}
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