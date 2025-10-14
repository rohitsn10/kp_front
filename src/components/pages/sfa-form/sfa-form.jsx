import React, { useState, useCallback, useMemo } from "react";
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

// Memoized coordinate format options to prevent recreation on every render
const COORDINATE_FORMAT_OPTIONS = [
  { value: "decimal_degree", label: "Decimal Degree" },
  { value: "degrees_minutes_seconds", label: "Degrees, Minutes, Seconds" },
  { value: "degrees_decimal_minutes", label: "Degrees, Decimal Minutes" },
  { value: "universal_transverse_mercator", label: "Universal Transverse Mercator (UTM)" },
  { value: "military_grid_reference", label: "Military Grid Reference System (MGRS)" }
];

// Memoized helper functions
const getPlaceholderForFormat = (format) => {
  const placeholders = {
    "decimal_degree": "e.g., 28.6139, 77.2090",
    "degrees_minutes_seconds": "e.g., 28°36'50.04\"N, 77°12'32.4\"E",
    "degrees_decimal_minutes": "e.g., 28°36.834'N, 77°12.54'E",
    "universal_transverse_mercator": "e.g., 43T 345678 1234567",
    "military_grid_reference": "e.g., 43TBE4567834567"
  };
  return placeholders[format] || "";
};

const getHelperTextForFormat = (format) => {
  const helpTexts = {
    "decimal_degree": "Enter latitude and longitude in decimal degrees",
    "degrees_minutes_seconds": "Enter in DMS format",
    "degrees_decimal_minutes": "Enter in DDM format",
    "universal_transverse_mercator": "Enter UTM coordinates (Zone Easting Northing)",
    "military_grid_reference": "Enter MGRS coordinates"
  };
  return helpTexts[format] || "";
};

// Memoized coordinate input group component
const CoordinateInputGroup = React.memo(({ 
  prefix, 
  label, 
  formData, 
  handleChange 
}) => {
  const coordinateFormat = formData[`${prefix}_coordinate_format`];
  const coordinateValue = formData[`${prefix}_cordinates`];
  const eastingValue = formData[`${prefix}_easting`];
  const northingValue = formData[`${prefix}_northing`];
  const zoneValue = formData[`${prefix}_zone`];

  return (
    <div className="col-span-1 md:col-span-2 border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-[#29346B] mb-3">{label}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Coordinate Format"
          name={`${prefix}_coordinate_format`}
          select
          value={coordinateFormat}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        >
          {COORDINATE_FORMAT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={`${label} Value`}
          name={`${prefix}_cordinates`}
          value={coordinateValue}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          placeholder={getPlaceholderForFormat(coordinateFormat)}
          helperText={getHelperTextForFormat(coordinateFormat)}
        />

        <TextField
          label="Easting"
          name={`${prefix}_easting`}
          value={eastingValue}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          placeholder="e.g., 345678.12"
        />

        <TextField
          label="Northing"
          name={`${prefix}_northing`}
          value={northingValue}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          placeholder="e.g., 1234567.89"
        />

        <TextField
          label="Zone"
          name={`${prefix}_zone`}
          value={zoneValue}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          placeholder="e.g., 43N, 17R"
        />
      </div>
    </div>
  );
});

// Memoized text field component to prevent unnecessary re-renders
const MemoizedTextField = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text",
  select = false,
  children,
  required = false,
  placeholder,
  helperText,
  InputLabelProps,
  ...props 
}) => (
  <TextField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    select={select}
    fullWidth
    variant="outlined"
    margin="normal"
    required={required}
    placeholder={placeholder}
    helperText={helperText}
    InputLabelProps={InputLabelProps}
    {...props}
  >
    {children}
  </TextField>
));

const AssessmentFormModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    // Existing fields
    sfa_name: "",
    land_sfa_file: [],
    sfa_for_transmission_line_gss_files: [],
    solar_or_winds: "",
    date_of_assessment: "",
    site_visit_date: "",

    // New fields from CURL request
    land_address: "",
    client_consultant: "",
    palnt_capacity: "",
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
    
    // Land coordinates only (Geographical removed)
    // land_coordinate_format: "decimal_degree", 
    // land_cordinates: "",
    // land_easting: "",
    // land_northing: "",
    // land_zone: "",
    
    substation_cordinates: "",
    substation_coordinate_format: "decimal_degree",
    
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

  // List of optional fields
  const optionalFields = useMemo(() => [
    "client_consultant",
    "land_title",
    "sfa_land_orientation",
    "rain_fall_pattern",
    "solar_isolation_data",
    "transmission_line_load_carrying_or_evacuation_capacity",
    "construction_power_availability_and_identify_source_distance",
    "grid_availability_data_outage_pattern",
    "kv_grid_voltage_variation",
    "hz_grid_voltage_variation",
    "check_protection_system_details_of_substation",
    "any_future_plan_for_expansion_of_substation",
    "is_there_any_power_export_happening_at_substation",
    "any_specific_requirements_of_eb_for_double_pole_structure",
    "nearest_industry_category_and_distance",
    "availability_of_labor_and_cost_of_labor",
    "provide_near_by_civil_electrical_contractors",
    "availability_of_construction_material_nearby",
    "any_weather_station_nearby",
    "water_availability",
    "construction_water_availability",
    "details_of_local_drainage_scheme",
    "availability_of_potable_water",
  ], []);

  const [addSfaDataToLandBank] = useAddSfaDataToLandBankMutation();
  const { refetch } = useGetSfaDataQuery();

  // Memoized change handler to prevent recreation on every render
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoized file change handler
  const handleFileChange = useCallback((e, field) => {
    const files = e.target.files;
    setFormData(prev => ({
      ...prev,
      [field]: Array.from(files)
    }));
  }, []);

  // Memoized validation function
  const validateForm = useCallback(() => {
    for (let [key, value] of Object.entries(formData)) {
      // Skip optional fields and file uploads
      if (
        optionalFields.includes(key) ||
        key === "land_sfa_file" ||
        key === "sfa_for_transmission_line_gss_files"
      ) {
        continue;
      }

      if (!value || value.toString().toLowerCase() === "none") {
        toast.error(`Please fill in the ${key.replace(/_/g, ' ')} field.`);
        return false;
      }
    }
  
    if (formData.land_sfa_file.length === 0 || formData.sfa_for_transmission_line_gss_files.length === 0) {
      toast.error("Please upload files for both land SFA and transmission line GSS.");
      return false;
    }
  
    return true;
  }, [formData, optionalFields]);

  // Memoized submit handler
  const handleSubmit = useCallback(async () => {
    console.log(">>>>>>",formData);

    if (!validateForm()) return;
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'land_sfa_file' || key === 'sfa_for_transmission_line_gss_files') {
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      let response = await addSfaDataToLandBank(formDataToSend).unwrap();
      if (response?.status) {
        toast.success("SFA data added successfully!");
        refetch();
        handleClose();
      } else {
        toast.error("Unexpected response structure.");
        console.error("Response:", response);
      }
    } catch (error) {
      toast.error("Failed to add SFA data. Please try again.");
      console.error("Error:", error);
    }
  }, [formData, validateForm, addSfaDataToLandBank, refetch, handleClose]);

  // Memoized solar/wind options
  const solarWindOptions = useMemo(() => [
    <MenuItem key="Solar" value="Solar">Solar</MenuItem>,
    <MenuItem key="Wind" value="Wind">Wind</MenuItem>
  ], []);

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
          <MemoizedTextField
            label="Land Bank Name"
            name="sfa_name"
            value={formData.sfa_name}
            onChange={handleChange}
            required
          />
          
          <MemoizedTextField
            label="Land Address"
            name="land_address"
            value={formData.land_address}
            onChange={handleChange}
            required
          />

          {/* File Uploads */}
          <div className="col-span-1 md:col-span-2 flex justify-between">
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
          <MemoizedTextField
            label="Solar or Wind"
            name="solar_or_winds"
            select
            value={formData.solar_or_winds}
            onChange={handleChange}
            required
          >
            {solarWindOptions}
          </MemoizedTextField>

          <MemoizedTextField
            label="Date of Assessment"
            name="date_of_assessment"
            type="date"
            value={formData.date_of_assessment}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <MemoizedTextField
            label="Site Visit Date"
            name="site_visit_date"
            type="date"
            value={formData.site_visit_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          {/* Land Coordinate Fields Only */}
          <CoordinateInputGroup
            prefix="land_co"
            label="Land Coordinates"
            formData={formData}
            handleChange={handleChange}
          />

          <CoordinateInputGroup
            prefix="substation"
            label="Substation Coordinates"
            formData={formData}
            handleChange={handleChange}
          />

          {/* Land Details */}
          <MemoizedTextField
            label="Land Category"
            name="sfa_land_category"
            value={formData.sfa_land_category}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Land Profile"
            name="sfa_land_profile"
            value={formData.sfa_land_profile}
            onChange={handleChange}
            required
          />

          {/* Batch 3 */}
          <MemoizedTextField
            label="Client Consultant"
            name="client_consultant"
            value={formData.client_consultant}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Plant Capacity"
            name="palnt_capacity"
            value={formData.palnt_capacity}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="SFA available area acres"
            name="sfa_available_area_acres"
            value={formData.sfa_available_area_acres}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Distance from Main road"
            name="distance_from_main_road"
            value={formData.distance_from_main_road}
            onChange={handleChange}
            required
          />

          {/* Batch 4 */}
          <MemoizedTextField
            label="Road Highway Details"
            name="road_highway_details"
            value={formData.road_highway_details}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Land Title"
            name="land_title"
            value={formData.land_title}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="SFA Land Orientation"
            name="sfa_land_orientation"
            value={formData.sfa_land_orientation}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="SFA Land Soil Testing Availability"
            name="sfa_land_soil_testing_availability"
            value={formData.sfa_land_soil_testing_availability}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Any Shadow casting buildings or hill"
            name="any_shadow_casting_buildings_or_hill"
            value={formData.any_shadow_casting_buildings_or_hill}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Water Ponds or Nalas within proposed location"
            name="any_water_ponds_or_nalas_within_the_proposed_location"
            value={formData.any_water_ponds_or_nalas_within_the_proposed_location}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Any roads or Bridge within Proposed location"
            name="any_roads_or_bridge_within_the_proposed_location"
            value={formData.any_roads_or_bridge_within_the_proposed_location}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Any railway lane within proposed location"
            name="any_railway_lane_within_the_proposed_location"
            value={formData.any_railway_lane_within_the_proposed_location}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Is proposed site of natural contour or filled up area"
            name="is_the_proposed_site_is_of_natural_contour_or_filled_up_area"
            value={formData.is_the_proposed_site_is_of_natural_contour_or_filled_up_area}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Solar isolation data"
            name="solar_isolation_data"
            value={formData.solar_isolation_data}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Rain fall Pattern"
            name="rain_fall_pattern"
            value={formData.rain_fall_pattern}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Communication Network Availability"
            name="communication_network_availability"
            value={formData.communication_network_availability}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Permission Required for Power Generation"
            name="permission_required_for_power_generation"
            value={formData.permission_required_for_power_generation}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Transmission network availabilty above 400 220 33kv"
            name="transmission_network_availabilty_above_400_220_33kv"
            value={formData.transmission_network_availabilty_above_400_220_33kv}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Distance of Supply Point from Proposed Site"
            name="distance_of_supply_point_from_proposed_site"
            value={formData.distance_of_supply_point_from_proposed_site}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Distance of Nearest Substation from Proposed Site"
            name="distance_of_nearest_substation_from_proposed_site"
            value={formData.distance_of_nearest_substation_from_proposed_site}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Transmission Line Load Carrying or Evacuation Capacity"
            name="transmission_line_load_carrying_or_evacuation_capacity"
            value={formData.transmission_line_load_carrying_or_evacuation_capacity}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Right of Way Requirement up to the Delivery Point"
            name="right_of_way_requirement_up_to_the_delivery_point"
            value={formData.right_of_way_requirement_up_to_the_delivery_point}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Construction Power Availability and Identify Source Distance"
            name="construction_power_availability_and_identify_source_distance"
            value={formData.construction_power_availability_and_identify_source_distance}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Grid Availability Data & Outage Pattern"
            name="grid_availability_data_outage_pattern"
            value={formData.grid_availability_data_outage_pattern}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Substation Capacity (MVA)"
            name="substation_capacity_mva"
            value={formData.substation_capacity_mva}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Substation Load Side Voltage Level (kV)"
            name="substation_load_side_voltage_level_kv"
            value={formData.substation_load_side_voltage_level_kv}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="kV Grid Voltage Variation"
            name="kv_grid_voltage_variation"
            value={formData.kv_grid_voltage_variation}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Hz Grid Voltage Variation"
            name="hz_grid_voltage_variation"
            value={formData.hz_grid_voltage_variation}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Check Space Availability in Substation to Connect Power by Area"
            name="check_space_availability_in_substation_to_conct_power_by_area"
            value={formData.check_space_availability_in_substation_to_conct_power_by_area}
            onChange={handleChange}
            required
          />

          {/* Batch 9 */}
          <MemoizedTextField
            label="Transformer Rating in Substation"
            name="transformer_rating_in_substation"
            value={formData.transformer_rating_in_substation}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Check Protection System Details of Substation"
            name="check_protection_system_details_of_substation"
            value={formData.check_protection_system_details_of_substation}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Any Future Plan for Expansion of Substation"
            name="any_future_plan_for_expansion_of_substation"
            value={formData.any_future_plan_for_expansion_of_substation}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Is There Any Power Export Happening at Substation?"
            name="is_there_any_power_export_happening_at_substation"
            value={formData.is_there_any_power_export_happening_at_substation}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Any Specific Requirements of EB for Double Pole Structure"
            name="any_specific_requirements_of_eb_for_double_pole_structure"
            value={formData.any_specific_requirements_of_eb_for_double_pole_structure}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Any Transmission Communication Line Passing Through Site"
            name="any_transmission_communication_line_passing_through_site"
            value={formData.any_transmission_communication_line_passing_through_site}
            onChange={handleChange}
            required
          />

          {/* Batch 10 */}
          <MemoizedTextField
            label="Neighboring Area or Vicinity Details"
            name="neighboring_area_or_vicinity_details"
            value={formData.neighboring_area_or_vicinity_details}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Nearest Industry Category and Distance"
            name="nearest_industry_category_and_distance"
            value={formData.nearest_industry_category_and_distance}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Nearest Village or District Name and Distance"
            name="nearest_village_or_district_name_and_distance"
            value={formData.nearest_village_or_district_name_and_distance}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Nearest Highway or Airport Name and Distance"
            name="nearest_highway_or_airport_name_and_distance"
            value={formData.nearest_highway_or_airport_name_and_distance}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Availability of Labor and Cost of Labor"
            name="availability_of_labor_and_cost_of_labor"
            value={formData.availability_of_labor_and_cost_of_labor}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Logistics"
            name="logistics"
            value={formData.logistics}
            onChange={handleChange}
            required
          />

          {/* Batch 11 */}
          <MemoizedTextField
            label="Is There an Approach Road Available to the Site?"
            name="is_there_an_approach_road_available_to_the_site"
            value={formData.is_there_an_approach_road_available_to_the_site}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Can a Truck of Multi-Axel with 40-Foot Container Reach Site?"
            name="can_truck_of_Multi_axel_with_40_foot_container_reach_site"
            value={formData.can_truck_of_Multi_axel_with_40_foot_container_reach_site}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Availability of Vehicle for Hiring or Cost per Km"
            name="availability_of_vehicle_for_hiring_or_cost_per_km"
            value={formData.availability_of_vehicle_for_hiring_or_cost_per_km}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="List the Risks Including Journey"
            name="list_the_risks_including_journey"
            value={formData.list_the_risks_including_journey}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Nearest Police Station and Distance"
            name="nearest_police_station_and_distance"
            value={formData.nearest_police_station_and_distance}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Nearest Hospital and Distance"
            name="nearest_hospital_and_distance"
            value={formData.nearest_hospital_and_distance}
            onChange={handleChange}
            required
          />

          {/* Batch 12 */}
          <MemoizedTextField
            label="Nearest Fire Station and Distance"
            name="nearest_fire_station_and_distance"
            value={formData.nearest_fire_station_and_distance}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Nearest Seashore and Distance"
            name="nearest_seashore_and_distance"
            value={formData.nearest_seashore_and_distance}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Availability of Accommodation to Site (Approximate Cost)"
            name="availability_of_accommodation_to_site_approximate_cost"
            value={formData.availability_of_accommodation_to_site_approximate_cost}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Provide Nearby Civil & Electrical Contractors"
            name="provide_near_by_civil_electrical_contractors"
            value={formData.provide_near_by_civil_electrical_contractors}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Availability of Construction Material Nearby"
            name="availability_of_construction_material_nearby"
            value={formData.availability_of_construction_material_nearby}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Any Weather Station Nearby"
            name="any_weather_station_nearby"
            value={formData.any_weather_station_nearby}
            onChange={handleChange}
          />

          {/* Batch 13 */}
          <MemoizedTextField
            label="Water Belt Profile of the Area"
            name="water_belt_profile_of_the_area"
            value={formData.water_belt_profile_of_the_area}
            onChange={handleChange}
            required
          />

          <MemoizedTextField
            label="Water Availability"
            name="water_availability"
            value={formData.water_availability}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Construction Water Availability"
            name="construction_water_availability"
            value={formData.construction_water_availability}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Details of Local Drainage Scheme"
            name="details_of_local_drainage_scheme"
            value={formData.details_of_local_drainage_scheme}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Availability of Potable Water"
            name="availability_of_potable_water"
            value={formData.availability_of_potable_water}
            onChange={handleChange}
          />

          <MemoizedTextField
            label="Any Other General Observation"
            name="any_other_general_observation"
            value={formData.any_other_general_observation}
            onChange={handleChange}
            required
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