import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  IconButton,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import { useUpdateLandBankStatusMutation } from '../../../api/sfa/sfaApi';

const AssessmentFormApproval = ({
  open,
  handleClose,
  activeItem,
  refetch
}) => {
  const [landBankStatus, setLandBankStatus] = useState('');
  const [approvedReportFiles, setApprovedReportFiles] = useState([]);
  const [updateLandBankStatus, { isLoading, isError }] = useUpdateLandBankStatusMutation();
  
  useEffect(() => {
    if (activeItem) {
      setLandBankStatus(''); // Reset the status when activeItem changes
      setApprovedReportFiles([]); // Reset the files when activeItem changes
    }
  }, [activeItem]);
  
  const handleLandBankStatusChange = (event) => {
    setLandBankStatus(event.target.value);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setApprovedReportFiles(Array.from(files)); // Convert FileList to an array
  };

  const handleSubmit = async () => {
    // Check if Land Bank Status and Files are selected
    if (!landBankStatus || approvedReportFiles.length === 0) {
      toast.error("Please select the land bank status and upload the approved report files.");
      return;
    }

    const land_sfa_data_id = activeItem.id;
    const formData = new FormData();
    formData.append('status_of_site_visit', landBankStatus);

    // Append files to FormData
    approvedReportFiles.forEach((file) => {
      formData.append('approved_report_files', file);
    });

    try {
      // Make API call to update status
      await updateLandBankStatus({ land_bank_id: land_sfa_data_id, formData });
      toast.success("SFA Status updated successfully!");
      refetch();
      handleClose(); // Close the modal on success
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update SFA status. Please try again.");
    }
  };

  // Format dates for better display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper function to render file list with view/download buttons
  const renderFileList = (files) => {
    if (!files || files.length === 0) return <Typography variant="body2">No files available</Typography>;
    
    return files.map((file, index) => (
      <Box display="flex" alignItems="center" mb={1} key={index}>
        <Typography variant="body2" color="textSecondary" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {file.url.split('/').pop()} {/* Extract file name */}
        </Typography>
        <IconButton
          color="primary"
          component="a"
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          title="View File"
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          color="secondary"
          component="a"
          href={file.url}
          download
          title="Download File"
          size="small"
        >
          <DownloadIcon />
        </IconButton>
      </Box>
    ));
  };

  // Helper function to render boolean values
  const renderBooleanValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    return value === true ? "Yes" : "No";
  };

  // Helper function to render detail items
  const renderDetailItem = (label, value) => {
    return (
      <Box mb={1}>
        <Typography variant="subtitle2" color="primary">{label}</Typography>
        <Typography variant="body2">
          {value === null || value === undefined || value === "" ? "N/A" : value}
        </Typography>
      </Box>
    );
  };

  if (!activeItem) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle
        sx={{
          color: "#29346B",
          fontSize: "27px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        SFA Form Details and Approval
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Land Information
                </Typography>
                <Box mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {renderDetailItem("Land Name", activeItem.land_name)}
                      {renderDetailItem("Land Category", activeItem.land_category_name)}
                      {renderDetailItem("Solar/Wind", activeItem.solar_or_winds)}
                      {renderDetailItem("SFA Name", activeItem.sfa_name)}
                      {renderDetailItem("SFA Approved By", activeItem.sfa_approved_by_user_full_name)}
                      {renderDetailItem("Village Name", activeItem.village_name)}
                      {renderDetailItem("District Name", activeItem.district_name)}
                      {renderDetailItem("Taluka/Tahshil", activeItem.taluka_tahshil_name)}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderDetailItem("Total Land Area", activeItem.total_land_area)}
                      {renderDetailItem("Remaining Land Area", activeItem.remaining_land_area)}
                      {renderDetailItem("Area (meters)", activeItem.area_meters)}
                      {renderDetailItem("Area (acres)", activeItem.area_acres)}
                      {renderDetailItem("Survey Number", activeItem.survey_number)}
                      {renderDetailItem("Old Block Number", activeItem.old_block_number)}
                      {renderDetailItem("New Block Number", activeItem.new_block_number)}
                      {renderDetailItem("Land Status", activeItem.land_status)}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Status Information
                </Typography>
                <Box mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box mb={1}>
                        <Typography variant="subtitle2" color="primary">Current Status</Typography>
                        <Chip 
                          label={activeItem.land_bank_status || "Pending"} 
                          color={activeItem.land_bank_status === "Approved" ? "success" : activeItem.land_bank_status === "Rejected" ? "error" : "warning"}
                          size="small"
                        />
                      </Box>
                      {renderDetailItem("Status of Site Visit", activeItem.status_of_site_visit)}
                      {renderDetailItem("Site Visit Date", formatDate(activeItem.site_visit_date))}
                      {renderDetailItem("Date of Assessment", formatDate(activeItem.date_of_assessment))}
                      {renderDetailItem("Created At", formatDate(activeItem.created_at))}
                      {renderDetailItem("Updated At", formatDate(activeItem.updated_at))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderDetailItem("Timeline", formatDate(activeItem.timeline))}
                      {renderDetailItem("Mort Gaged", activeItem.mort_gaged)}
                      {renderDetailItem("TCR", renderBooleanValue(activeItem.tcr))}
                      {renderDetailItem("Sale Deed Date", formatDate(activeItem.sale_deed_date))}
                      {renderDetailItem("Lease Deed Number", activeItem.lease_deed_number)}
                      {renderDetailItem("Jantri Value", activeItem.jantri_value)}
                      {renderDetailItem("Industrial Jantri", activeItem.industrial_jantri)}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Owner and Additional Information */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Owner Information
                </Typography>
                {/* Commented out as requested
                {renderDetailItem("Land Owner", activeItem.land_owner)}
                {renderDetailItem("Seller Name", activeItem.seller_name)}
                {renderDetailItem("Buyer Name", activeItem.buyer_name)}
                {renderDetailItem("Advocate Name", activeItem.advocate_name)}
                */}
                {renderDetailItem("Land Address", activeItem.land_address)}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Additional Information
                </Typography>
                {renderDetailItem("Land Title", activeItem.land_title)}
                {/* Commented out as requested
                {renderDetailItem("Index Number", activeItem.index_number)}
                */}
                {renderDetailItem("Client Consultant", activeItem.client_consultant)}
                {renderDetailItem("Plant Capacity", activeItem.palnt_capacity)}
                {/* Commented out as requested
                {renderDetailItem("Actual Bucket", activeItem.actual_bucket)}
                {renderDetailItem("Remarks", activeItem.remarks)}
                */}
              </Grid>
            </Grid>
          </Paper>

          {/* File Documents Section with Accordions */}
          <Typography variant="h6" color="primary" gutterBottom>
            Document Files
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">SFA Files</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>Land SFA Files</Typography>
                  {renderFileList(activeItem.land_sfa_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    SFA Transmission Line GSS Files
                  </Typography>
                  {renderFileList(activeItem.sfa_for_transmission_line_gss_files)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Approved Report Files
                  </Typography>
                  {renderFileList(activeItem.approved_report_file)}
                </AccordionDetails>
              </Accordion>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Land Documentation Files</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Commented out as requested
                  <Typography variant="subtitle2" color="secondary" gutterBottom>Land Location Files</Typography>
                  {renderFileList(activeItem.land_location_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Survey Number Files
                  </Typography>
                  {renderFileList(activeItem.land_survey_number_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Key Plan Files
                  </Typography>
                  {renderFileList(activeItem.land_key_plan_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Approach Road Files
                  </Typography>
                  {renderFileList(activeItem.land_approach_road_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Co-ordinates Files
                  </Typography>
                  {renderFileList(activeItem.land_co_ordinates_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Transmission Line Files
                  </Typography>
                  {renderFileList(activeItem.land_transmission_line_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Lease Deed Files
                  </Typography>
                  {renderFileList(activeItem.land_lease_deed_file)}
                  
                  <Typography variant="subtitle2" color="secondary" gutterBottom mt={2}>
                    Land Attach Approval Report Files
                  </Typography>
                  {renderFileList(activeItem.land_attach_approval_report_file)}
                  */}
                  <Typography variant="body2" color="textSecondary">Additional land documentation files are available but not displayed in this view.</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          {/* Technical Details */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="primary">Technical Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>Land Profile</Typography>
                  {renderDetailItem("SFA Land Category", activeItem.sfa_land_category)}
                  {renderDetailItem("SFA Land Profile", activeItem.sfa_land_profile)}
                  {renderDetailItem("SFA Land Orientation", activeItem.sfa_land_orientation)}
                  {renderDetailItem("SFA Available Area (acres)", activeItem.sfa_available_area_acres)}
                  {renderDetailItem("Soil Testing Available", renderBooleanValue(activeItem.sfa_land_soil_testing_availability))}
                  {renderDetailItem("Shadow Casting Buildings/Hills", renderBooleanValue(activeItem.any_shadow_casting_buildings_or_hill))}
                  {renderDetailItem("Water Ponds/Nalas", activeItem.any_water_ponds_or_nalas_within_the_proposed_location)}
                  {renderDetailItem("Roads/Bridges", activeItem.any_roads_or_bridge_within_the_proposed_location)}
                  {renderDetailItem("Railway Lane", activeItem.any_railway_lane_within_the_proposed_location)}
                  {renderDetailItem("Natural Contour/Filled Area", renderBooleanValue(activeItem.is_the_proposed_site_is_of_natural_contour_or_filled_up_area))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>Location & Connectivity</Typography>
                  {renderDetailItem("Geographical Coordinates", activeItem.geo_graphical_cordinates)}
                  {renderDetailItem("Land Co-ordinates", activeItem.land_co_ordinates)}
                  {renderDetailItem("Substation Coordinates", activeItem.substation_cordinates)}
                  
                  {/* New coordinate fields */}
                  <Typography variant="subtitle" color="primary" sx={{ mt: 2, mb: 2 }}>
                    Geo Coordinates Details
                  </Typography>
                  {renderDetailItem("Geo Coordinate Format", activeItem.geo_coordinate_format)}
                  {renderDetailItem("Geo Easting", activeItem.geo_easting)}
                  {renderDetailItem("Geo Northing", activeItem.geo_northing)}
                  {renderDetailItem("Geo Zone", activeItem.geo_zone)}
                  
                  <Typography variant="subtitle" color="primary" sx={{ mt: 2, mb: 2 }}>
                    Land Coordinates Details
                  </Typography>
                  {renderDetailItem("Land Coordinate Format", activeItem.land_coordinate_format)}
                  {renderDetailItem("Land Easting", activeItem.land_easting)}
                  {renderDetailItem("Land Northing", activeItem.land_northing)}
                  {renderDetailItem("Land Zone", activeItem.land_zone)}
                  
                  <Typography variant="subtitle" color="primary" sx={{ mt: 2, mb: 2 }}>
                    Substation Coordinates Details
                  </Typography>
                  {renderDetailItem("Substation Coordinate Format", activeItem.substation_coordinate_format)}
                  {renderDetailItem("Substation Easting", activeItem.substation_easting)}
                  {renderDetailItem("Substation Northing", activeItem.substation_northing)}
                  {renderDetailItem("Substation Zone", activeItem.substation_zone)}
                  
                  <Typography variant="subtitle2" color="primary" sx={{ mt: 2, mb: 1 }}>
                    Road & Transportation
                  </Typography>
                  {renderDetailItem("Distance from Main Road", activeItem.distance_from_main_road)}
                  {renderDetailItem("Road/Highway Details", activeItem.road_highway_details)}
                  {renderDetailItem("Approach Road Available", activeItem.is_there_an_approach_road_available_to_the_site)}
                  {renderDetailItem("Multi-axel Truck Access", activeItem.can_truck_of_Multi_axel_with_40_foot_container_reach_site)}
                  {renderDetailItem("Logistics", activeItem.logistics)}
                  {renderDetailItem("Vehicle Hiring Availability", activeItem.availability_of_vehicle_for_hiring_or_cost_per_km)}
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>Environmental & Climate</Typography>
                  {renderDetailItem("Solar Isolation Data", activeItem.solar_isolation_data)}
                  {renderDetailItem("Rainfall Pattern", activeItem.rain_fall_pattern)}
                  {renderDetailItem("Water Belt Profile", activeItem.water_belt_profile_of_the_area)}
                  {renderDetailItem("Water Availability", activeItem.water_availability)}
                  {renderDetailItem("Construction Water Availability", activeItem.construction_water_availability)}
                  {renderDetailItem("Potable Water Availability", activeItem.availability_of_potable_water)}
                  {renderDetailItem("Local Drainage Scheme", activeItem.details_of_local_drainage_scheme)}
                  {renderDetailItem("Weather Station Nearby", activeItem.any_weather_station_nearby)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>Power & Substation</Typography>
                  {renderDetailItem("Permission Required for Power Generation", renderBooleanValue(activeItem.permission_required_for_power_generation))}
                  {renderDetailItem("Transmission Network Availability", activeItem.transmission_network_availabilty_above_400_220_33kv)}
                  {renderDetailItem("Proposed GSS Number", activeItem.propose_gss_number)}
                  {renderDetailItem("Distance to Supply Point", activeItem.distance_of_supply_point_from_proposed_site)}
                  {renderDetailItem("Distance to Nearest Substation", activeItem.distance_of_nearest_substation_from_proposed_site)}
                  {renderDetailItem("Transmission Line Capacity", activeItem.transmission_line_load_carrying_or_evacuation_capacity)}
                  {renderDetailItem("Right of Way Requirement", activeItem.right_of_way_requirement_up_to_the_delivery_point)}
                  {renderDetailItem("Construction Power Availability", activeItem.construction_power_availability_and_identify_source_distance)}
                  {renderDetailItem("Grid Availability Data", activeItem.grid_availability_data_outage_pattern)}
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>Substation Details</Typography>
                  {renderDetailItem("Substation Capacity (MVA)", activeItem.substation_capacity_mva)}
                  {renderDetailItem("Load Side Voltage Level (kV)", activeItem.substation_load_side_voltage_level_kv)}
                  {renderDetailItem("kV Grid Voltage Variation", activeItem.kv_grid_voltage_variation)}
                  {renderDetailItem("Hz Grid Voltage Variation", activeItem.hz_grid_voltage_variation)}
                  {renderDetailItem("Space Availability in Substation", activeItem.check_space_availability_in_substation_to_conct_power_by_area)}
                  {renderDetailItem("Transformer Rating", activeItem.transformer_rating_in_substation)}
                  {renderDetailItem("Protection System Details", activeItem.check_protection_system_details_of_substation)}
                  {renderDetailItem("Future Expansion Plans", activeItem.any_future_plan_for_expansion_of_substation)}
                  {renderDetailItem("Power Export at Substation", activeItem.is_there_any_power_export_happening_at_substation)}
                  {renderDetailItem("EB Requirements for Double Pole", activeItem.any_specific_requirements_of_eb_for_double_pole_structure)}
                  {renderDetailItem("Transmission Lines Through Site", activeItem.any_transmission_communication_line_passing_through_site)}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>Vicinity & Services</Typography>
                  {renderDetailItem("Neighboring Area Details", activeItem.neighboring_area_or_vicinity_details)}
                  {renderDetailItem("Nearest Industry", activeItem.nearest_industry_category_and_distance)}
                  {renderDetailItem("Nearest Village/District", activeItem.nearest_village_or_district_name_and_distance)}
                  {renderDetailItem("Nearest Highway/Airport", activeItem.nearest_highway_or_airport_name_and_distance)}
                  {renderDetailItem("Labor Availability & Cost", activeItem.availability_of_labor_and_cost_of_labor)}
                  {renderDetailItem("Journey Risks", activeItem.list_the_risks_including_journey)}
                  {renderDetailItem("Nearest Police Station", activeItem.nearest_police_station_and_distance)}
                  {renderDetailItem("Nearest Hospital", activeItem.nearest_hospital_and_distance)}
                  {renderDetailItem("Nearest Fire Station", activeItem.nearest_fire_station_and_distance)}
                  {renderDetailItem("Nearest Seashore", activeItem.nearest_seashore_and_distance)}
                  {renderDetailItem("Accommodation Availability", activeItem.availability_of_accommodation_to_site_approximate_cost)}
                  {renderDetailItem("Civil/Electrical Contractors", activeItem.provide_near_by_civil_electrical_contractors)}
                  {renderDetailItem("Construction Material Availability", activeItem.availability_of_construction_material_nearby || "N/A")}
                </Grid>
              </Grid>
              
              <Box mt={2}>
                {renderDetailItem("Any Other Observations", activeItem.any_other_general_observation)}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Approval Section */}
        <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Update SFA Status
          </Typography>
          
          {/* Land Bank Status */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Land Bank Status</InputLabel>
            <Select
              value={landBankStatus}
              onChange={handleLandBankStatusChange}
              label="Land Bank Status"
              fullWidth
            >
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
            </Select>
          </FormControl>

          {/* Approved Report File Upload */}
          <Box mb={2} mt={2}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Approved Report Files
            </Typography>
            <input
              type="file"
              name="approved_report_file"
              multiple
              onChange={handleFileChange}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            />
            <Typography variant="caption" color="textSecondary">
              Upload relevant approval documents
            </Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "#e0e0e0",
            color: "#333333",
            fontSize: "16px",
            padding: "6px 36px",
            width: "150px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            marginRight: "10px",
            "&:hover": { backgroundColor: "#d0d0d0" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading}
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
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentFormApproval;