import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Link,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useUpdateSfaDataToLandBankMutation } from '../../../api/sfa/sfaApi';

function AssessmentFormUpdateModal({ open, handleClose, activeItem }) {
  const [formData, setFormData] = useState({
    sfa_name: "",
    land_sfa_file: [],
    sfa_for_transmission_line_gss_files: [],
    timeline: "",
    solar_or_winds: "",
    date_of_assessment: "",
    site_visit_date: "",
    // New fields
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
  const [removeLandSfaFiles, setRemoveLandSfaFiles] = useState([]);
  const [removeSfaForTransmissionFiles, setRemoveSfaForTransmissionFiles] = useState([]);
  const [newLandSfaFiles, setNewLandSfaFiles] = useState([]);
  const [newSfaForTransmissionFiles, setNewSfaForTransmissionFiles] = useState([]);

  // Use useEffect to update formData when activeItem changes
  // useEffect(() => {
  //   if (activeItem) {
  //     const formatDate = (date) => {
  //       if (!date) return "";
  //       const newDate = new Date(date);
  //       return newDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  //     };

  //     setFormData({
  //       sfa_name: activeItem.sfa_name || "",
  //       land_sfa_file: activeItem.land_sfa_file || [],
  //       sfa_for_transmission_line_gss_files: activeItem.sfa_for_transmission_line_gss_files || [],
  //       timeline: formatDate(activeItem.timeline), // Convert date
  //       solar_or_winds: activeItem.solar_or_winds || "",
  //       date_of_assessment: formatDate(activeItem.date_of_assessment), // Convert date
  //       site_visit_date: formatDate(activeItem.site_visit_date), // Convert date


  //     });
  //   }
  // }, [activeItem]);
  useEffect(() => {
    if (activeItem) {
      const formatDate = (date) => {
        if (!date) return "";
        const newDate = new Date(date);
        return newDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
      };

      setFormData({
        sfa_name: activeItem.sfa_name || "",
        land_sfa_file: activeItem.land_sfa_file || [],
        sfa_for_transmission_line_gss_files: activeItem.sfa_for_transmission_line_gss_files || [],
        timeline: formatDate(activeItem.timeline),
        solar_or_winds: activeItem.solar_or_winds || "",
        date_of_assessment: formatDate(activeItem.date_of_assessment),
        site_visit_date: formatDate(activeItem.site_visit_date),

        land_address: activeItem.land_address,
        client_consultant: activeItem.client_consultant || "",
        palnt_capacity: activeItem.palnt_capacity || "",
        land_owner: activeItem.land_owner || "",
        sfa_available_area_acres: activeItem.sfa_available_area_acres || "",
        distance_from_main_road: activeItem.distance_from_main_road || "",
        road_highway_details: activeItem.road_highway_details || "",

        land_title: activeItem.land_title || "",
        sfa_land_category: activeItem.sfa_land_category || "",
        sfa_land_profile: activeItem.sfa_land_profile || "",
        sfa_land_orientation: activeItem.sfa_land_orientation || "",
        sfa_land_soil_testing_availability: activeItem.sfa_land_soil_testing_availability || "",
        any_shadow_casting_buildings_or_hill: activeItem.any_shadow_casting_buildings_or_hill || "",
        any_water_ponds_or_nalas_within_the_proposed_location: activeItem.any_water_ponds_or_nalas_within_the_proposed_location || "",
        any_roads_or_bridge_within_the_proposed_location: activeItem.any_roads_or_bridge_within_the_proposed_location || "",
        any_railway_lane_within_the_proposed_location: activeItem.any_railway_lane_within_the_proposed_location || "",
        is_the_proposed_site_is_of_natural_contour_or_filled_up_area: activeItem.is_the_proposed_site_is_of_natural_contour_or_filled_up_area || "",
        geo_graphical_cordinates: activeItem.geo_graphical_cordinates || "",
        land_co_ordinates: activeItem.land_co_ordinates || "",
        substation_cordinates: activeItem.substation_cordinates || "",
        solar_isolation_data: activeItem.solar_isolation_data || "",
        rain_fall_pattern: activeItem.rain_fall_pattern || "",
        communication_network_availability: activeItem.communication_network_availability || "",
        permission_required_for_power_generation: activeItem.permission_required_for_power_generation || "",
        transmission_network_availabilty_above_400_220_33kv: activeItem.transmission_network_availabilty_above_400_220_33kv || "",
        distance_of_supply_point_from_proposed_site: activeItem.distance_of_supply_point_from_proposed_site || "",
        distance_of_nearest_substation_from_proposed_site: activeItem.distance_of_nearest_substation_from_proposed_site || "",
        transmission_line_load_carrying_or_evacuation_capacity: activeItem.transmission_line_load_carrying_or_evacuation_capacity || "",
        right_of_way_requirement_up_to_the_delivery_point: activeItem.right_of_way_requirement_up_to_the_delivery_point || "",
        construction_power_availability_and_identify_source_distance: activeItem.construction_power_availability_and_identify_source_distance || "",
        grid_availability_data_outage_pattern: activeItem.grid_availability_data_outage_pattern || "",
        substation_capacity_mva: activeItem.substation_capacity_mva || "",
        substation_load_side_voltage_level_kv: activeItem.substation_load_side_voltage_level_kv || "",
        kv_grid_voltage_variation: activeItem.kv_grid_voltage_variation || "",
        hz_grid_voltage_variation: activeItem.hz_grid_voltage_variation || "",
        check_space_availability_in_substation_to_conct_power_by_area: activeItem.check_space_availability_in_substation_to_conct_power_by_area || "",
        transformer_rating_in_substation: activeItem.transformer_rating_in_substation || "",
        check_protection_system_details_of_substation: activeItem.check_protection_system_details_of_substation || "",
        any_future_plan_for_expansion_of_substation: activeItem.any_future_plan_for_expansion_of_substation || "",
        is_there_any_power_export_happening_at_substation: activeItem.is_there_any_power_export_happening_at_substation || "",
        any_specific_requirements_of_eb_for_double_pole_structure: activeItem.any_specific_requirements_of_eb_for_double_pole_structure || "",
        any_transmission_communication_line_passing_through_site: activeItem.any_transmission_communication_line_passing_through_site || "",
        neighboring_area_or_vicinity_details: activeItem.neighboring_area_or_vicinity_details || "",
        nearest_industry_category_and_distance: activeItem.nearest_industry_category_and_distance || "",
        nearest_village_or_district_name_and_distance: activeItem.nearest_village_or_district_name_and_distance || "",
        nearest_highway_or_airport_name_and_distance: activeItem.nearest_highway_or_airport_name_and_distance || "",
        availability_of_labor_and_cost_of_labor: activeItem.availability_of_labor_and_cost_of_labor || "",
        logistics: activeItem.logistics || "",
        is_there_an_approach_road_available_to_the_site: activeItem.is_there_an_approach_road_available_to_the_site || "",
        can_truck_of_Multi_axel_with_40_foot_container_reach_site: activeItem.can_truck_of_Multi_axel_with_40_foot_container_reach_site || "",
        availability_of_vehicle_for_hiring_or_cost_per_km: activeItem.availability_of_vehicle_for_hiring_or_cost_per_km || "",
        list_the_risks_including_journey: activeItem.list_the_risks_including_journey || "",
        nearest_police_station_and_distance: activeItem.nearest_police_station_and_distance || "",
        nearest_hospital_and_distance: activeItem.nearest_hospital_and_distance || "",
        nearest_fire_station_and_distance: activeItem.nearest_fire_station_and_distance || "",
        nearest_seashore_and_distance: activeItem.nearest_seashore_and_distance || "",
        availability_of_accommodation_to_site_approximate_cost: activeItem.availability_of_accommodation_to_site_approximate_cost || "",
        provide_near_by_civil_electrical_contractors: activeItem.provide_near_by_civil_electrical_contractors || "",
        availability_of_construction_material_nearby: activeItem.availability_of_construction_material_nearby || "",
        any_weather_station_nearby: activeItem.any_weather_station_nearby || "",
        water_belt_profile_of_the_area: activeItem.water_belt_profile_of_the_area || "",
        water_availability: activeItem.water_availability || "",
        construction_water_availability: activeItem.construction_water_availability || "",
        details_of_local_drainage_scheme: activeItem.details_of_local_drainage_scheme || "",
        availability_of_potable_water: activeItem.availability_of_potable_water || "",
        any_other_general_observation: activeItem.any_other_general_observation || "",
      });
      // console.log(formData)
    }
  }, [activeItem]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const newFiles = Array.from(e.target.files);

    if (field === "land_sfa_file") {
      setNewLandSfaFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files
    } else if (field === "sfa_for_transmission_line_gss_files") {
      setNewSfaForTransmissionFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files
    }
  };

  const handleRemoveFile = (fileId, fileType) => {
    if (fileType === 'land_sfa_file') {
      setRemoveLandSfaFiles((prev) =>
        prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
      );
    } else if (fileType === 'sfa_for_transmission_line_gss_files') {
      setRemoveSfaForTransmissionFiles((prev) =>
        prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
      );
    }
  };

  const [updateSfaDataToLandBank] = useUpdateSfaDataToLandBankMutation();

  const handleSubmit = async () => {
    const land_sfa_data_id = activeItem.id; // Assuming activeItem has the ID

    // Create FormData object
    const formDataToSend = new FormData();

    // Append non-file data to FormData
    Object.keys(formData).forEach((key) => {
      if (key !== 'land_sfa_file' && key !== 'sfa_for_transmission_line_gss_files') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append new files (without old files) to FormData
    newLandSfaFiles.forEach((file) => {
      formDataToSend.append('land_sfa_file', file); // Append each new file to 'land_sfa_file'
    });

    newSfaForTransmissionFiles.forEach((file) => {
      formDataToSend.append('sfa_for_transmission_line_gss_files', file); // Append each new file to 'sfa_for_transmission_line_gss_files'
    });

    if (removeLandSfaFiles.length > 0) {
      formDataToSend.append('remove_land_sfa_file', removeLandSfaFiles.join(',')); // Join array of fileIds into a string
    }

    if (removeSfaForTransmissionFiles.length > 0) {
      formDataToSend.append('remove_sfa_for_transmission_line_gss_files', removeSfaForTransmissionFiles.join(',')); // Join array of fileIds into a string
    }

    try {
      // Now send the FormData to the API using your mutation
      await updateSfaDataToLandBank({ land_sfa_data_id, formData: formDataToSend }).unwrap();

      // Handle success
      handleClose(); // Close the modal
    } catch (error) {
      // Handle error
      console.error('Error updating SFA:', error);
    }
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
      <DialogContent className='grid grid-cols-2 gap-x-5'>
        <div>
          <label className="block mt-4 text-[#29346B] text-lg font-semibold">
            SFA Name
          </label>
          <TextField
            name="sfa_name"
            value={formData.sfa_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
        </div>
        <div>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Timeline
          </label>
          <TextField
            name="timeline"
            type="date"
            value={formData.timeline}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Land SFA file
          </label>
          <input
            type="file"
            name="land_sfa_file"
            multiple
            onChange={(e) => handleFileChange(e, "land_sfa_file")}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
          {formData.land_sfa_file?.length > 0 && (
            <div>
              Current Files:
              {formData.land_sfa_file.map((file, index) => (
                <div key={index}>{file.name}</div>
              ))}
            </div>
          )}

          {activeItem?.land_sfa_file && activeItem.land_sfa_file?.length > 0 && (
            <div>
              <h4>Uploaded Land SFA Files:</h4>
              {activeItem.land_sfa_file.map((file, index) => {
                const isRemoved = removeLandSfaFiles.includes(file.id);
                return (
                  <div key={index} style={{ padding: "5px", borderRadius: "5px", display: "flex", flexDirection: "row", gap: "10px" }}>
                    <Link href={file.url} target="_blank" sx={{ textDecoration: isRemoved ? "line-through" : "none" }} rel="noopener noreferrer">
                      {file.url.split('/').pop()}
                    </Link>
                    <Button
                      onClick={() => handleRemoveFile(file.id, 'land_sfa_file')}
                      color={isRemoved ? "secondary" : "error"}
                      sx={{ backgroundColor: isRemoved ? "transparent" : "#f8d7da" }}
                      size="small"
                    >
                      {isRemoved ? "Undo" : "Remove"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            SFA for transmission line gas files
          </label>
          <input
            type="file"
            name="sfa_for_transmission_line_gss_files"
            multiple
            onChange={(e) => handleFileChange(e, "sfa_for_transmission_line_gss_files")}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />

          {formData.sfa_for_transmission_line_gss_files?.length > 0 && (
            <div>
              Current Files:
              {formData.sfa_for_transmission_line_gss_files.map((file, index) => (
                <div key={index}>{file.name}</div>
              ))}
            </div>
          )}

          {activeItem?.sfa_for_transmission_line_gss_files && activeItem.sfa_for_transmission_line_gss_files?.length > 0 && (
            <div>
              <h4>Uploaded SFA for Transmission Line GSS Files:</h4>
              {activeItem.sfa_for_transmission_line_gss_files.map((file, index) => {
                const isRemoved = removeSfaForTransmissionFiles.includes(file.id);
                return (
                  <div key={index} style={{ padding: "5px", borderRadius: "5px" }}>
                    <Link href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.url.split('/').pop()}
                    </Link>
                    <Button
                      onClick={() => handleRemoveFile(file.id, 'sfa_for_transmission_line_gss_files')}
                      color={isRemoved ? "secondary" : "error"}
                      size="small"
                      sx={{ backgroundColor: isRemoved ? "transparent" : "#f8d7da" }}
                    >
                      {isRemoved ? "Undo" : "Remove"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Solar or Wind
          </label>
          <TextField
            name="solar_or_winds"
            select
            value={formData.solar_or_winds}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          >
            <MenuItem value="Solar">Solar</MenuItem>
            <MenuItem value="Wind">Wind</MenuItem>
          </TextField>
        </div>
        <div>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Date of Assessment
          </label>
          <TextField
            name="date_of_assessment"
            type="date"
            value={formData.date_of_assessment}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div>
          <label className="block mt-4 text-[#29346B] text-lg font-semibold">
            Site visit date
          </label>
          <TextField
            name="site_visit_date"
            type="date"
            value={formData.site_visit_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
            InputLabelProps={{ shrink: true }}
          />
        </div>

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
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            backgroundColor: "#f6812d",
            color: "#FFFFFF",
            fontSize: "18px",
            padding: "6px 16px",
            fontWeight: "600",
            borderRadius: "5px",
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssessmentFormUpdateModal;
