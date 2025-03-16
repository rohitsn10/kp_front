import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
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
      'sfa_name',
      'timeline',
       'solar_or_winds', 
      'date_of_assessment',
       'site_visit_date'
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
      let response = await addSfaDataToLandBank(formDataToSend).unwrap();
      if (response?.status) {
        toast.success("SFA data added successfully!");
        refetch();
        handleClose();
      }else{
        toast.error("Unexpected response structure.");
        console.error("Response:", response);
      }
      // console.log(formDataToSend)
      // console.log(formData)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <TextField
            label="SFA Name"
            name="sfa_name"
            value={formData.sfa_name}
            onChange={handleChange}
            fullWidth
            required
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
            required
          />

          {/* File Uploads */}
          <div className="col-span-1 md:col-span-2 flex justify-between">
            {/* <div className="w-[48%]">
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
            </div> */}
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Land SFA File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="land_sfa_file"
                multiple
                onChange={(e) => handleFileChange(e, "land_sfa_file")}
                style={{ marginBottom: "10px", marginTop: "10px" }}
              />
              {!formData.land_sfa_file && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                SFA For Transmission Line GSS Files <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="sfa_for_transmission_line_gss_files"
                multiple
                onChange={(e) => handleFileChange(e, "sfa_for_transmission_line_gss_files")}
                style={{ marginBottom: "10px", marginTop: "10px" }}
              />
              {!formData.sfa_for_transmission_line_gss_files && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
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
            required
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
            required
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
            required
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
            required
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
          {/* {renderYesNoDropdown(
            "sfa_land_soil_testing_availability",
            "SFA Land Soil Testing Availability"
          )}
          {renderYesNoDropdown(
            "any_shadow_casting_buildings_or_hill",
            "Any Shadow Casting Buildings or Hill"
          )} */}

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
          {/* Batch 3 */}
          <TextField
            label="Client Consultant"
            name="client_consultant"
            value={formData.client_consultant}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Plant Capacity"
            name="palnt_capacity"
            value={formData.palnt_capacity}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="SFA available area acres"
            name="sfa_available_area_acres"
            value={formData.sfa_available_area_acres}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Distance from Main road"
            name="distance_from_main_road"
            value={formData.distance_from_main_road}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {/* Batch 4 */}
          <TextField
            label="Road Highway Details"
            name="road_highway_details"
            value={formData.road_highway_details}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Land Title"
            name="land_title"
            value={formData.land_title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Land Title"
            name="land_title"
            value={formData.land_title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="SFA Land Category"
            name="sfa_land_category"
            value={formData.sfa_land_category}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="SFA Land Profile"
            name="sfa_land_profile"
            value={formData.sfa_land_profile}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="SFA Land Orientation"
            name="sfa_land_orientation"
            value={formData.sfa_land_orientation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
 {/* Batch 4
          <TextField
            label="SFA Land Soil Testing Availability"
            name="sfa_land_soil_testing_availability"
            value={formData.sfa_land_soil_testing_availability}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
 */}
 <FormControl fullWidth margin="normal" variant="outlined">
  <InputLabel>SFA Land Soil Testing Availability</InputLabel>
  <Select
    name="sfa_land_soil_testing_availability"
    value={formData.sfa_land_soil_testing_availability}
    onChange={handleChange}
    label="SFA Land Soil Testing Availability"
  >
    <MenuItem value="True">Yes</MenuItem>
    <MenuItem value="False">No</MenuItem>
  </Select>
</FormControl>
          {/* <TextField
            label="Any Shadow casting buildings or hill"
            name="any_shadow_casting_buildings_or_hill"
            value={formData.any_shadow_casting_buildings_or_hill}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          /> */}

          <FormControl fullWidth margin="normal" variant="outlined">
  <InputLabel>Any Shadow Casting Buildings or Hill</InputLabel>
  <Select
    name="any_shadow_casting_buildings_or_hill"
    value={formData.any_shadow_casting_buildings_or_hill}
    onChange={handleChange}
    label="Any Shadow Casting Buildings or Hill"
  >
    <MenuItem value="True">Yes</MenuItem>
    <MenuItem value="False">No</MenuItem>
  </Select>
</FormControl>

          <TextField
            label="Water Ponds or Nalas within proposed location"
            name="any_water_ponds_or_nalas_within_the_proposed_location"
            value={formData.any_water_ponds_or_nalas_within_the_proposed_location}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Any roads or Bridge within Proposed location"
            name="any_roads_or_bridge_within_the_proposed_location"
            value={formData.any_roads_or_bridge_within_the_proposed_location}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Any railway lane within proposed location"
            name="any_railway_lane_within_the_proposed_location"
            value={formData.any_railway_lane_within_the_proposed_location}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* <TextField
            label="Is proposed site of naturalcontour or filled up area"
            name="is_the_proposed_site_is_of_natural_contour_or_filled_up_area"
            value={formData.is_the_proposed_site_is_of_natural_contour_or_filled_up_area}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          /> */}
          <FormControl fullWidth margin="normal" variant="outlined">
  <InputLabel>Is Proposed Site of Natural Contour or Filled-Up Area</InputLabel>
  <Select
    name="is_the_proposed_site_is_of_natural_contour_or_filled_up_area"
    value={formData.is_the_proposed_site_is_of_natural_contour_or_filled_up_area}
    onChange={handleChange}
    label="Is Proposed Site of Natural Contour or Filled-Up Area"
  >
    <MenuItem value="True">Yes</MenuItem>
    <MenuItem value="False">No</MenuItem>
  </Select>
</FormControl>

          <TextField
            label="Geo Graphical Coordinates"
            name="geo_graphical_cordinates"
            value={formData.geo_graphical_cordinates}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* Batch 6 */}
          <TextField
            label="Land Coordinates"
            name="land_co_ordinates"
            value={formData.land_co_ordinates}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Substation Coordinates"
            name="substation_cordinates"
            value={formData.substation_cordinates}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Solar isolation data"
            name="solar_isolation_data"
            value={formData.solar_isolation_data}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Rain fall Pattern"
            name="rain_fall_pattern"
            value={formData.rain_fall_pattern}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Communication Network Availability"
            name="communication_network_availability"
            value={formData.communication_network_availability}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {/* {renderYesNoDropdown(
            "permission_required_for_power_generation",
            "Permission Required for Power Generation"
          )} */}

          {/* {renderYesNoDropdown(
            "right_of_way_requirement_up_to_the_delivery_point", 
            "Right of Way Requirement to Delivery Point"
          )} */}
          {/* Batch 7 */}
          <FormControl fullWidth margin="normal" variant="outlined">
  <InputLabel>Permission Required for Power Generation</InputLabel>
  <Select
    name="permission_required_for_power_generation"
    value={formData.permission_required_for_power_generation}
    onChange={handleChange}
    label="Permission Required for Power Generation"
  >
    <MenuItem value="True">Yes</MenuItem>
    <MenuItem value="False">No</MenuItem>
  </Select>
</FormControl>

          <TextField
            label="Transmission network availabilty above 400 220 33kv"
            name="transmission_network_availabilty_above_400_220_33kv"
            value={formData.transmission_network_availabilty_above_400_220_33kv}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Distance of Supply Point from Proposed Site"
            name="distance_of_supply_point_from_proposed_site"
            value={formData.distance_of_supply_point_from_proposed_site}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Distance of Nearest Substation from Proposed Site"
            name="distance_of_nearest_substation_from_proposed_site"
            value={formData.distance_of_nearest_substation_from_proposed_site}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Transmission Line Load Carrying or Evacuation Capacity"
            name="transmission_line_load_carrying_or_evacuation_capacity"
            value={formData.transmission_line_load_carrying_or_evacuation_capacity}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Right of Way Requirement up to the Delivery Point"
            name="right_of_way_requirement_up_to_the_delivery_point"
            value={formData.right_of_way_requirement_up_to_the_delivery_point}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Construction Power Availability and Identify Source Distance"
            name="construction_power_availability_and_identify_source_distance"
            value={formData.construction_power_availability_and_identify_source_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Grid Availability Data & Outage Pattern"
            name="grid_availability_data_outage_pattern"
            value={formData.grid_availability_data_outage_pattern}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Substation Capacity (MVA)"
            name="substation_capacity_mva"
            value={formData.substation_capacity_mva}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Substation Load Side Voltage Level (kV)"
            name="substation_load_side_voltage_level_kv"
            value={formData.substation_load_side_voltage_level_kv}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="kV Grid Voltage Variation"
            name="kv_grid_voltage_variation"
            value={formData.kv_grid_voltage_variation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Hz Grid Voltage Variation"
            name="hz_grid_voltage_variation"
            value={formData.hz_grid_voltage_variation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Check Space Availability in Substation to Connect Power by Area"
            name="check_space_availability_in_substation_to_conct_power_by_area"
            value={formData.check_space_availability_in_substation_to_conct_power_by_area}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {/* Batch 9 */}
          <TextField
            label="Transformer Rating in Substation"
            name="transformer_rating_in_substation"
            value={formData.transformer_rating_in_substation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Check Protection System Details of Substation"
            name="check_protection_system_details_of_substation"
            value={formData.check_protection_system_details_of_substation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Any Future Plan for Expansion of Substation"
            name="any_future_plan_for_expansion_of_substation"
            value={formData.any_future_plan_for_expansion_of_substation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Is There Any Power Export Happening at Substation?"
            name="is_there_any_power_export_happening_at_substation"
            value={formData.is_there_any_power_export_happening_at_substation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Any Specific Requirements of EB for Double Pole Structure"
            name="any_specific_requirements_of_eb_for_double_pole_structure"
            value={formData.any_specific_requirements_of_eb_for_double_pole_structure}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Any Transmission Communication Line Passing Through Site"
            name="any_transmission_communication_line_passing_through_site"
            value={formData.any_transmission_communication_line_passing_through_site}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {/* Batch 10 */}

          <TextField
            label="Neighboring Area or Vicinity Details"
            name="neighboring_area_or_vicinity_details"
            value={formData.neighboring_area_or_vicinity_details}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Nearest Industry Category and Distance"
            name="nearest_industry_category_and_distance"
            value={formData.nearest_industry_category_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Nearest Village or District Name and Distance"
            name="nearest_village_or_district_name_and_distance"
            value={formData.nearest_village_or_district_name_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Nearest Highway or Airport Name and Distance"
            name="nearest_highway_or_airport_name_and_distance"
            value={formData.nearest_highway_or_airport_name_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Availability of Labor and Cost of Labor"
            name="availability_of_labor_and_cost_of_labor"
            value={formData.availability_of_labor_and_cost_of_labor}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Logistics"
            name="logistics"
            value={formData.logistics}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {/* Batch 11 */}
          <TextField
            label="Is There an Approach Road Available to the Site?"
            name="is_there_an_approach_road_available_to_the_site"
            value={formData.is_there_an_approach_road_available_to_the_site}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Can a Truck of Multi-Axel with 40-Foot Container Reach Site?"
            name="can_truck_of_Multi_axel_with_40_foot_container_reach_site"
            value={formData.can_truck_of_Multi_axel_with_40_foot_container_reach_site}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Availability of Vehicle for Hiring or Cost per Km"
            name="availability_of_vehicle_for_hiring_or_cost_per_km"
            value={formData.availability_of_vehicle_for_hiring_or_cost_per_km}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="List the Risks Including Journey"
            name="list_the_risks_including_journey"
            value={formData.list_the_risks_including_journey}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Nearest Police Station and Distance"
            name="nearest_police_station_and_distance"
            value={formData.nearest_police_station_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Nearest Hospital and Distance"
            name="nearest_hospital_and_distance"
            value={formData.nearest_hospital_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {/* Batch 12 */}
          <TextField
            label="Nearest Fire Station and Distance"
            name="nearest_fire_station_and_distance"
            value={formData.nearest_fire_station_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Nearest Seashore and Distance"
            name="nearest_seashore_and_distance"
            value={formData.nearest_seashore_and_distance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Availability of Accommodation to Site (Approximate Cost)"
            name="availability_of_accommodation_to_site_approximate_cost"
            value={formData.availability_of_accommodation_to_site_approximate_cost}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Provide Nearby Civil & Electrical Contractors"
            name="provide_near_by_civil_electrical_contractors"
            value={formData.provide_near_by_civil_electrical_contractors}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

<FormControl fullWidth margin="normal" variant="outlined">
  <InputLabel>Availability of Construction Material Nearby</InputLabel>
  <Select
    name="availability_of_construction_material_nearby"
    value={formData.availability_of_construction_material_nearby}
    onChange={handleChange}
    label="Availability of Construction Material Nearby"
  >
    <MenuItem value="True">Yes</MenuItem>
    <MenuItem value="False">No</MenuItem>
  </Select>
</FormControl>

          <TextField
            label="Any Weather Station Nearby"
            name="any_weather_station_nearby"
            value={formData.any_weather_station_nearby}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* Batch 13 */}
          <TextField
            label="Water Belt Profile of the Area"
            name="water_belt_profile_of_the_area"
            value={formData.water_belt_profile_of_the_area}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Water Availability"
            name="water_availability"
            value={formData.water_availability}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Construction Water Availability"
            name="construction_water_availability"
            value={formData.construction_water_availability}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Details of Local Drainage Scheme"
            name="details_of_local_drainage_scheme"
            value={formData.details_of_local_drainage_scheme}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Availability of Potable Water"
            name="availability_of_potable_water"
            value={formData.availability_of_potable_water}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Any Other General Observation"
            name="any_other_general_observation"
            value={formData.any_other_general_observation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
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