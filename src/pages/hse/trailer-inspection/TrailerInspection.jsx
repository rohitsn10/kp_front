import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrailerInspectionDialog from "../../../components/pages/hse/trailer-inspection/CreateTrailerInspection";
import { useGetTrailerInspectionQuery } from "../../../api/hse/trailerInspection/trailerInspectionApi";
import { useParams } from "react-router-dom";

const PDFDownloader = ({ src, fileName = "signature.pdf" }) => {
  const [downloadError, setDownloadError] = useState(false);

  // Check if src is valid
  const isValidSrc = src && typeof src === 'string' && src.trim() !== '';
  
  const handleDownload = () => {
    if (!isValidSrc) {
      setDownloadError(true);
      return;
    }
    
    try {
      // If src already includes the base URL, use it directly, otherwise prepend the API base
      const downloadUrl = src.startsWith('http') ? src : `${import.meta.env.VITE_API_KEY}${src}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setDownloadError(true);
    }
  };

  if (!isValidSrc || downloadError) {
    return (
      <div 
        style={{ 
          padding: '8px 12px',
          border: '1px dashed #ccc',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}
      >
        No PDF available
      </div>
    );
  }

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleDownload}
      style={{
        textTransform: 'none',
        color: '#29346B',
        borderColor: '#29346B'
      }}
    >
      📄 Download PDF
    </Button>
  );
};

function TrailerInspection() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const { locationId } = useParams();
  
  // Skip the query if locationId is not available or not a valid number
  const skipQuery = !locationId || isNaN(parseInt(locationId));  
  const { data, isLoading, error, refetch } = useGetTrailerInspectionQuery(
    parseInt(locationId), 
    { skip: skipQuery }
  );
  
  const [openCreateDialog, setOpenDialog] = useState(false);

  // Function to safely parse date and return formatted date string
  const safeFormatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error parsing date:", error);
      return "-";
    }
  };

  // Function to convert API data into the format needed for our table
  const formatApiData = (apiData) => {
    if (!apiData || !apiData.data) return [];
    
    // If data is an array
    if (Array.isArray(apiData.data)) {
      return apiData.data.map(item => ({
        id: item.id || 0,
        equipment_name: item.equipment_name || "Unnamed Equipment",
        identification_number: item.identification_number || "-",
        make_model: item.make_model || "-",
        inspection_date: safeFormatDate(item.inspection_date),
        site_name: item.site_name || "-",
        location: item.location || "-",
        inspected_name: item.inspected_name || "-",
        inspected_sign: item.inspected_sign || null,
        // Mapping checkpoints from API response
        checkpoints: [
          {
            checkpoint: "All valid documents",
            observations: item.all_valid_document_observations,
            action_by: item.all_valid_document_action_by,
            remarks: item.all_valid_document_remarks,
          },
          {
            checkpoint: "Driver fitness certificate",
            observations: item.driver_fitness_certificate_observations,
            action_by: item.driver_fitness_certificate_action_by,
            remarks: item.driver_fitness_certificate_remarks,
          },
          {
            checkpoint: "Main horn / Reverse horn",
            observations: item.main_horn_reverse_horn_observations,
            action_by: item.main_horn_reverse_horn_action_by,
            remarks: item.main_horn_reverse_horn_remarks,
          },
          {
            checkpoint: "Clutch & Brake",
            observations: item.cutch_brake_observations,
            action_by: item.cutch_brake_action_by,
            remarks: item.cutch_brake_remarks,
          },
          {
            checkpoint: "Tyre pressure & condition",
            observations: item.tyre_pressure_condition_observations,
            action_by: item.tyre_pressure_condition_action_by,
            remarks: item.tyre_pressure_condition_remarks,
          },
          {
            checkpoint: "Head Light & Indicators",
            observations: item.head_light_indicator_observations,
            action_by: item.head_light_indicator_action_by,
            remarks: item.head_light_indicator_remarks,
          },
          {
            checkpoint: "Seat belt",
            observations: item.seat_belt_observations,
            action_by: item.seat_belt_action_by,
            remarks: item.seat_belt_remarks,
          },
          {
            checkpoint: "Wiper blade",
            observations: item.wiper_blade_observations,
            action_by: item.wiper_blade_action_by,
            remarks: item.wiper_blade_remarks,
          },
          {
            checkpoint: "Side view mirror",
            observations: item.side_mirror_observations,
            action_by: item.side_mirror_action_by,
            remarks: item.side_mirror_remarks,
          },
          {
            checkpoint: "Wind screen",
            observations: item.wind_screen_observations,
            action_by: item.wind_screen_action_by,
            remarks: item.wind_screen_remarks,
          },
          {
            checkpoint: "Door / Door lock",
            observations: item.door_lock_observations,
            action_by: item.door_lock_action_by,
            remarks: item.door_lock_remarks,
          },
          {
            checkpoint: "Battery condition",
            observations: item.battery_condition_observations,
            action_by: item.battery_condition_action_by,
            remarks: item.battery_condition_remarks,
          },
          {
            checkpoint: "Hand brake",
            observations: item.hand_brake_observations,
            action_by: item.hand_brake_action_by,
            remarks: item.hand_brake_remarks,
          },
          {
            checkpoint: "Any leakage",
            observations: item.any_leakage_observations,
            action_by: item.any_leakage_action_by,
            remarks: item.any_leakage_remarks,
          },
          {
            checkpoint: "Speedometer & Gauges",
            observations: item.speedometere_observations,
            action_by: item.speedometere_action_by,
            remarks: item.speedometere_remarks,
          },
          {
            checkpoint: "Guard for moving parts",
            observations: item.guard_parts_observations,
            action_by: item.guard_parts_action_by,
            remarks: item.guard_parts_remarks,
          },
          {
            checkpoint: "PPE (Safety shoes & helmet)",
            observations: item.ppe_observations,
            action_by: item.ppe_action_by,
            remarks: item.ppe_remarks,
          },
        ]
      }));
    } 
    // If data is a single object (not array)
    else {
      return [{
        id: apiData.data.id || 0,
        equipment_name: apiData.data.equipment_name || "Unnamed Equipment",
        identification_number: apiData.data.identification_number || "-",
        make_model: apiData.data.make_model || "-",
        inspection_date: safeFormatDate(apiData.data.inspection_date),
        site_name: apiData.data.site_name || "-",
        location: apiData.data.location || "-",
        inspected_name: apiData.data.inspected_name || "-",
        inspected_sign: apiData.data.inspected_sign || null,
        // Mapping checkpoints from API response
        checkpoints: [
          {
            checkpoint: "All valid documents",
            observations: apiData.data.all_valid_document_observations,
            action_by: apiData.data.all_valid_document_action_by,
            remarks: apiData.data.all_valid_document_remarks,
          },
          {
            checkpoint: "Driver fitness certificate",
            observations: apiData.data.driver_fitness_certificate_observations,
            action_by: apiData.data.driver_fitness_certificate_action_by,
            remarks: apiData.data.driver_fitness_certificate_remarks,
          },
          {
            checkpoint: "Main horn / Reverse horn",
            observations: apiData.data.main_horn_reverse_horn_observations,
            action_by: apiData.data.main_horn_reverse_horn_action_by,
            remarks: apiData.data.main_horn_reverse_horn_remarks,
          },
          {
            checkpoint: "Clutch & Brake",
            observations: apiData.data.cutch_brake_observations,
            action_by: apiData.data.cutch_brake_action_by,
            remarks: apiData.data.cutch_brake_remarks,
          },
          {
            checkpoint: "Tyre pressure & condition",
            observations: apiData.data.tyre_pressure_condition_observations,
            action_by: apiData.data.tyre_pressure_condition_action_by,
            remarks: apiData.data.tyre_pressure_condition_remarks,
          },
          {
            checkpoint: "Head Light & Indicators",
            observations: apiData.data.head_light_indicator_observations,
            action_by: apiData.data.head_light_indicator_action_by,
            remarks: apiData.data.head_light_indicator_remarks,
          },
          {
            checkpoint: "Seat belt",
            observations: apiData.data.seat_belt_observations,
            action_by: apiData.data.seat_belt_action_by,
            remarks: apiData.data.seat_belt_remarks,
          },
          {
            checkpoint: "Wiper blade",
            observations: apiData.data.wiper_blade_observations,
            action_by: apiData.data.wiper_blade_action_by,
            remarks: apiData.data.wiper_blade_remarks,
          },
          {
            checkpoint: "Side view mirror",
            observations: apiData.data.side_mirror_observations,
            action_by: apiData.data.side_mirror_action_by,
            remarks: apiData.data.side_mirror_remarks,
          },
          {
            checkpoint: "Wind screen",
            observations: apiData.data.wind_screen_observations,
            action_by: apiData.data.wind_screen_action_by,
            remarks: apiData.data.wind_screen_remarks,
          },
          {
            checkpoint: "Door / Door lock",
            observations: apiData.data.door_lock_observations,
            action_by: apiData.data.door_lock_action_by,
            remarks: apiData.data.door_lock_remarks,
          },
          {
            checkpoint: "Battery condition",
            observations: apiData.data.battery_condition_observations,
            action_by: apiData.data.battery_condition_action_by,
            remarks: apiData.data.battery_condition_remarks,
          },
          {
            checkpoint: "Hand brake",
            observations: apiData.data.hand_brake_observations,
            action_by: apiData.data.hand_brake_action_by,
            remarks: apiData.data.hand_brake_remarks,
          },
          {
            checkpoint: "Any leakage",
            observations: apiData.data.any_leakage_observations,
            action_by: apiData.data.any_leakage_action_by,
            remarks: apiData.data.any_leakage_remarks,
          },
          {
            checkpoint: "Speedometer & Gauges",
            observations: apiData.data.speedometere_observations,
            action_by: apiData.data.speedometere_action_by,
            remarks: apiData.data.speedometere_remarks,
          },
          {
            checkpoint: "Guard for moving parts",
            observations: apiData.data.guard_parts_observations,
            action_by: apiData.data.guard_parts_action_by,
            remarks: apiData.data.guard_parts_remarks,
          },
          {
            checkpoint: "PPE (Safety shoes & helmet)",
            observations: apiData.data.ppe_observations,
            action_by: apiData.data.ppe_action_by,
            remarks: apiData.data.ppe_remarks,
          },
        ]
      }];
    }
  };

  // Format the API data, handling various scenarios
  const formattedData = useMemo(() => {
    // Handle case when data is null/undefined
    if (!data) return [];
    
    // Handle case when API returns success:false
    if (data.status === false) return [];
    
    // Handle case when data exists but data property is empty or null
    if (!data.data) return [];
    
    return formatApiData(data);
  }, [data]);

  const handleOpenDetails = (inspection) => {
    setSelectedInspection(inspection);
    setOpenDetails(true);
  };

  const handleOpenChecklist = (inspection) => {
    setSelectedInspection(inspection);
    setOpenChecklist(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
    setOpenChecklist(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  const filteredData = formattedData.filter((item) =>
    item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the data
  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Use useEffect to show a notification when error occurs
  useEffect(() => {
    if (error) {
      // If you have a notification system, you can use it here
      console.error("Error fetching trailer inspection data:", error);
      // Example: toast.error("Failed to load inspection data. Please try again later.");
    }
  }, [error]);
  
  // Loading state handler - show loading indicator but keep UI structure
  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>
  );
  
  // Error state handler - show error message but keep the UI structure
  const renderError = () => (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
      <p className="font-medium">Error loading inspection data</p>
      <p className="text-sm">{error?.message || "Unknown error occurred. Please try again later."}</p>
      <Button 
        variant="outlined" 
        color="error" 
        size="small" 
        onClick={() => refetch()}
        className="mt-2"
      >
        Retry
      </Button>
    </div>
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-4">
        Trailer Inspection
      </h2>
      
      {/* Show error message if there's an error */}
      {error && renderError()}
      
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Equipment Name"
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          className="mb-4"
          disabled={isLoading} // Disable search during loading
        />
        <div className="flex justify-end">
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            style={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
            disabled={isLoading} // Disable button during loading
          >
            Add Inspection
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} className="my-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Equipment Name</TableCell>
              <TableCell align="center">Identification Number</TableCell>
              <TableCell align="center">Make / Model</TableCell>
              <TableCell align="center">Inspection Date</TableCell>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Checklist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Show skeleton loading rows when loading
              Array(3).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {Array(8).fill(0).map((_, cellIndex) => (
                    <TableCell key={`loading-cell-${cellIndex}`} align="center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentRows.length > 0 ? (
              // Show actual data rows when available
              currentRows.map((item, index) => (
                <TableRow key={`data-${index}`}>
                  <TableCell align="center">{item.equipment_name || '-'}</TableCell>
                  <TableCell align="center">
                    {item.identification_number || '-'}
                  </TableCell>
                  <TableCell align="center">{item.make_model || '-'}</TableCell>
                  <TableCell align="center">{item.inspection_date || '-'}</TableCell>
                  <TableCell align="center">{item.site_name || '-'}</TableCell>
                  <TableCell align="center">{item.location || '-'}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDetails(item)}
                      disabled={isLoading}
                    >
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleOpenChecklist(item)}
                      disabled={isLoading}
                    >
                      View Checklist
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Show empty state message when no data
              <TableRow>
                <TableCell colSpan={8} align="center" className="py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <span className="material-icons text-4xl mb-2">
                      Something went wrong.
                    </span>
                    <p>No inspection data available</p>
                    {!isLoading && locationId && (
                      <Button 
                        variant="text" 
                        color="primary" 
                        className="mt-2"
                        onClick={() => refetch()}
                      >
                        Refresh
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        className="p-4"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DialogTitle className="text-lg font-semibold">
            Inspection Details
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent className="p-6 space-y-4 bg-gray-50">
          {isLoading ? (
            // Loading state
            <div className="p-4 border rounded-lg shadow-sm flex justify-center">
              <CircularProgress size={40} />
            </div>
          ) : selectedInspection ? (
            <div className="p-4 border rounded-lg shadow-sm">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Equipment Name:</span>{" "}
                  {selectedInspection.equipment_name || "-"}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Identification Number:</span>{" "}
                  {selectedInspection.identification_number || "-"}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Make/Model:</span>{" "}
                  {selectedInspection.make_model || "-"}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Inspection Date:</span>{" "}
                  {selectedInspection.inspection_date || "-"}
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-bold">Inspected By:</span>{" "}
                {selectedInspection.inspected_name || "-"}
              </p>
              
<div className="mt-4">
  <p className="text-sm font-bold text-gray-700 mb-2">Signature:</p>
  <PDFDownloader 
    src={selectedInspection.inspected_sign} 
    fileName="inspector_signature.pdf"
  />
</div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No inspection details available
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Checklist Dialog */}
      <Dialog
        open={openChecklist}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        className="p-1 sm:p-4"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DialogTitle className="text-lg font-semibold">Checklist</DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent className="p-4 space-y-6">
          {isLoading ? (
            // Loading state for checkpoints
            Array(3).fill(0).map((_, index) => (
              <div key={`checkpoint-loading-${index}`} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))
          ) : selectedInspection && selectedInspection.checkpoints && selectedInspection.checkpoints.length > 0 ? (
            // Show checkpoints when available
            selectedInspection.checkpoints.map((cp, index) => (
              <div
                key={`checkpoint-${index}`}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-bold">Checkpoint:</span> {cp.checkpoint || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Observations:</span>{" "}
                  {cp.observations || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Action By:</span> {cp.action_by || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Remarks:</span> {cp.remarks || "-"}
                </p>
              </div>
            ))
          ) : (
            // No checkpoints available
            <div className="text-center p-8">
              <div className="material-icons text-gray-400 text-4xl mb-2">
                assignment_late
              </div>
              <p className="text-gray-500">
                No checkpoints available for this inspection
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <TrailerInspectionDialog
        open={openCreateDialog}
        setOpen={setOpenDialog}
        onSuccess={() => {
          // Refresh data after successful creation
          refetch();
          // Show success message (if you have a notification system)
          // Example: toast.success("Trailer inspection created successfully");
        }}
        onError={(error) => {
          // Handle error from create operation
          console.error("Error creating trailer inspection:", error);
          // Example: toast.error("Failed to create trailer inspection. Please try again.");
        }}
      />
    </div>
  );
}

export default TrailerInspection;