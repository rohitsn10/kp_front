import React, { useState, useEffect } from "react";
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  MenuItem, 
  Select, 
  FormControl,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  Paper
} from "@mui/material";
import { useApproveRejectLandBankStatusMutation } from "../../../api/users/landbankApi";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`land-tabpanel-${index}`}
      aria-labelledby={`land-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export default function LandApproveModal({ open, setOpen, selectedLand }) {
  const [files, setFiles] = useState({});
  const [landBankStatus, setLandBankStatus] = useState("pending");
  const [approveRejectLandBankStatus, { isLoading, error }] = useApproveRejectLandBankStatusMutation();
  const [tabValue, setTabValue] = useState(0);
  console.log(">>>>>>>>",selectedLand)
  useEffect(() => {
    if (selectedLand) {
      const fileKeys = Object.keys(selectedLand).filter((key) => key.includes("file"));
      const fileData = {};
  
      fileKeys.forEach((key) => {
        const value = selectedLand[key];
        fileData[key] = Array.isArray(value) ? value : value ? [value] : [];
      });
  
      setFiles(fileData);
  
      if (selectedLand.land_bank_status) {
        setLandBankStatus(selectedLand.land_bank_status);
      }
    }
  }, [selectedLand]);
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleFilePreview = (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const handleSubmit = async () => {
    if (selectedLand?.id) {
      try {
        await approveRejectLandBankStatus({ id: selectedLand.id, land_bank_status: landBankStatus }).unwrap();
        console.log("Status updated successfully");
        setOpen(false);
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Helper function to display data fields
  const InfoField = ({ label, value }) => (
    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
      <Typography 
        variant="subtitle2" 
        color="text.secondary" 
        sx={{ 
          fontWeight: 500,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body1"
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
          wordBreak: 'break-word'
        }}
      >
        {value === "" || value === null || value === undefined ? "N/A" : 
          typeof value === 'boolean' ? (value ? "Yes" : "No") : value}
      </Typography>
    </Box>
  );

  if (!selectedLand) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="lg"
      PaperProps={{
        sx: {
          margin: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
          maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' }
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          p: { xs: 2, sm: 3 }
        }}
      >
        <Box>
          <Typography 
            variant="h6"
            sx={{
              fontSize: { xs: '1.125rem', sm: '1.25rem' }
            }}
          >
            Land Details: {selectedLand.land_name || "Unnamed"}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            ID: {selectedLand.id} | Created: {formatDate(selectedLand.created_at)}
          </Typography>
        </Box>
        <Chip 
          label={selectedLand.land_bank_status || "Pending"} 
          color={
            selectedLand.land_bank_status === "Approved" ? "success" : 
            selectedLand.land_bank_status === "Rejected" ? "error" : "warning"
          }
          size="small"
        />
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="land details tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minWidth: { xs: 'auto', sm: 160 },
              padding: { xs: '8px 12px', sm: '12px 16px' }
            }
          }}
        >
          <Tab label="Basic Info" />
          <Tab label="Technical" />
          <Tab label="Location" />
          <Tab label="Infrastructure" />
          <Tab label="Documents" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Land Information
                </Typography>
                <InfoField label="Land Name" value={selectedLand.land_name} />
                <InfoField label="Land Category" value={selectedLand.land_category_name} />
                <InfoField label="SFA Name" value={selectedLand.sfa_name} />
                <InfoField label="Solar/Wind Type" value={selectedLand.solar_or_winds} />
                <InfoField label="Land Status" value={selectedLand.land_status} />
                <InfoField label="Land Title" value={selectedLand.land_title} />
                
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Area Details
                </Typography>
                <InfoField label="Total Land Area" value={selectedLand.total_land_area} />
                <InfoField label="Remaining Land Area" value={selectedLand.remaining_land_area} />
                <InfoField label="Area (meters)" value={selectedLand.area_meters} />
                <InfoField label="Area (acres)" value={selectedLand.area_acres} />
                <InfoField label="SFA Available Area (acres)" value={selectedLand.sfa_available_area_acres} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Owner Information
                </Typography>
                <InfoField label="User Full Name" value={selectedLand.user_full_name} />
                <InfoField label="Land Owner" value={selectedLand.land_owner} />
                <InfoField label="Seller Name" value={selectedLand.seller_name} />
                <InfoField label="Buyer Name" value={selectedLand.buyer_name} />
                <InfoField label="Advocate Name" value={selectedLand.advocate_name} />
                
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Status & Dates
                </Typography>
                <InfoField label="Status of Site Visit" value={selectedLand.status_of_site_visit} />
                <InfoField label="Date of Assessment" value={formatDate(selectedLand.date_of_assessment)} />
                <InfoField label="Site Visit Date" value={formatDate(selectedLand.site_visit_date)} />
                <InfoField label="Timeline" value={formatDate(selectedLand.timeline)} />
                <InfoField label="Sale Deed Date" value={formatDate(selectedLand.sale_deed_date)} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Technical Specifications
                </Typography>
                <InfoField label="Survey Number" value={selectedLand.survey_number} />
                <InfoField label="Old Block Number" value={selectedLand.old_block_number} />
                <InfoField label="New Block Number" value={selectedLand.new_block_number} />
                <InfoField label="Lease Deed Number" value={selectedLand.lease_deed_number} />
                <InfoField label="Propose GSS Number" value={selectedLand.propose_gss_number} />
                <InfoField label="Land Co-ordinates" value={selectedLand.land_co_ordinates} />
                <InfoField label="Geo-graphical Coordinates" value={selectedLand.geo_graphical_cordinates} />
                <InfoField label="Substation Coordinates" value={selectedLand.substation_cordinates} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Financial & Capacity
                </Typography>
                <InfoField label="Industrial Jantri" value={selectedLand.industrial_jantri} />
                <InfoField label="Jantri Value" value={selectedLand.jantri_value} />
                <InfoField label="Mortgaged" value={selectedLand.mort_gaged} />
                <InfoField label="Client Consultant" value={selectedLand.client_consultant} />
                <InfoField label="Plant Capacity" value={selectedLand.palnt_capacity} />
                <InfoField label="Index Number" value={selectedLand.index_number} />
                <InfoField label="TCR" value={selectedLand.tcr} />
                <InfoField label="Actual Bucket" value={selectedLand.actual_bucket} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Location Details
                </Typography>
                <InfoField label="Land Address" value={selectedLand.land_address} />
                <InfoField label="Village Name" value={selectedLand.village_name} />
                <InfoField label="Taluka/Tahshil Name" value={selectedLand.taluka_tahshil_name} />
                <InfoField label="District Name" value={selectedLand.district_name} />
                <InfoField label="Distance from Main Road" value={selectedLand.distance_from_main_road} />
                <InfoField label="Road/Highway Details" value={selectedLand.road_highway_details} />
                <InfoField label="Nearest Village/District Name and Distance" value={selectedLand.nearest_village_or_district_name_and_distance} />
                <InfoField label="Nearest Highway/Airport Name and Distance" value={selectedLand.nearest_highway_or_airport_name_and_distance} />
                <InfoField label="Nearest Industry Category and Distance" value={selectedLand.nearest_industry_category_and_distance} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Environmental Factors
                </Typography>
                <InfoField label="SFA Land Profile" value={selectedLand.sfa_land_profile} />
                <InfoField label="SFA Land Orientation" value={selectedLand.sfa_land_orientation} />
                <InfoField label="SFA Land Category" value={selectedLand.sfa_land_category} />
                <InfoField label="SFA Land Soil Testing Availability" value={selectedLand.sfa_land_soil_testing_availability} />
                <InfoField label="Natural Contour or Filled-up Area" value={selectedLand.is_the_proposed_site_is_of_natural_contour_or_filled_up_area} />
                <InfoField label="Any Shadow Casting Buildings or Hill" value={selectedLand.any_shadow_casting_buildings_or_hill} />
                <InfoField label="Water Ponds or Nalas" value={selectedLand.any_water_ponds_or_nalas_within_the_proposed_location} />
                <InfoField label="Roads or Bridge" value={selectedLand.any_roads_or_bridge_within_the_proposed_location} />
                <InfoField label="Railway Lane" value={selectedLand.any_railway_lane_within_the_proposed_location} />
                <InfoField label="Solar Isolation Data" value={selectedLand.solar_isolation_data} />
                <InfoField label="Rain Fall Pattern" value={selectedLand.rain_fall_pattern} />
                <InfoField label="Water Belt Profile" value={selectedLand.water_belt_profile_of_the_area} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Power & Transmission
                </Typography>
                <InfoField label="Communication Network Availability" value={selectedLand.communication_network_availability} />
                <InfoField label="Permission Required for Power Generation" value={selectedLand.permission_required_for_power_generation} />
                <InfoField label="Transmission Network Availability" value={selectedLand.transmission_network_availabilty_above_400_220_33kv} />
                <InfoField label="Distance of Supply Point" value={selectedLand.distance_of_supply_point_from_proposed_site} />
                <InfoField label="Distance of Nearest Substation" value={selectedLand.distance_of_nearest_substation_from_proposed_site} />
                <InfoField label="Transmission Line Load Capacity" value={selectedLand.transmission_line_load_carrying_or_evacuation_capacity} />
                <InfoField label="Right of Way Requirement" value={selectedLand.right_of_way_requirement_up_to_the_delivery_point} />
                <InfoField label="Construction Power Availability" value={selectedLand.construction_power_availability_and_identify_source_distance} />
                <InfoField label="Grid Availability Data" value={selectedLand.grid_availability_data_outage_pattern} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Facilities & Emergency Services
                </Typography>
                <InfoField label="Approach Road Available" value={selectedLand.is_there_an_approach_road_available_to_the_site} />
                <InfoField label="Multi-Axel Truck Access" value={selectedLand.can_truck_of_Multi_axel_with_40_foot_container_reach_site} />
                <InfoField label="Vehicle Availability for Hiring" value={selectedLand.availability_of_vehicle_for_hiring_or_cost_per_km} />
                <InfoField label="Nearest Police Station" value={selectedLand.nearest_police_station_and_distance} />
                <InfoField label="Nearest Hospital" value={selectedLand.nearest_hospital_and_distance} />
                <InfoField label="Nearest Fire Station" value={selectedLand.nearest_fire_station_and_distance} />
                <InfoField label="Nearest Seashore" value={selectedLand.nearest_seashore_and_distance} />
                <InfoField label="Accommodation Availability" value={selectedLand.availability_of_accommodation_to_site_approximate_cost} />
                <InfoField label="Water Availability" value={selectedLand.water_availability} />
                <InfoField label="Construction Water Availability" value={selectedLand.construction_water_availability} />
                <InfoField label="Availability of Potable Water" value={selectedLand.availability_of_potable_water} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}
          >
            Documents
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {Object.entries(files).map(([category, fileList]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    variant="subtitle1" 
                    className="text-[#29346B] font-semibold" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {category.replace(/_/g, " ").replace(/file/g, "").trim()}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {fileList?.length > 0 ? (
                      fileList?.map((file, index) => (
                        <Button 
                          key={index} 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleFilePreview(file)}
                          size="small"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            padding: { xs: '4px 8px', sm: '6px 16px' }
                          }}
                        >
                          View File {index + 1}
                        </Button>
                      ))
                    ) : (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        No files available
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Box sx={{ 
          flex: 1, 
          width: { xs: '100%', sm: 'auto' },
          order: { xs: 2, sm: 1 }
        }}>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Land Bank Status
            </Typography>
            <Select 
              value={landBankStatus} 
              onChange={(e) => setLandBankStatus(e.target.value)} 
              disabled={isLoading}
              size="small"
            >
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mt: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Error updating status. Try again.
            </Typography>
          )}
        </Box>
        
        <Box sx={{
          display: 'flex',
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
          order: { xs: 1, sm: 2 }
        }}>
          <Button 
            onClick={handleClose} 
            color="secondary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              flex: { xs: 1, sm: 'none' }
            }}
          >
            Close
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained" 
            disabled={isLoading}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              flex: { xs: 1, sm: 'none' }
            }}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}