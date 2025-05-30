import React, { useState, useEffect } from "react";
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
import CloseIcon from '@mui/icons-material/Close';
import BoomLiftInspectionDialog from "../../../components/pages/hse/boom-lift/CreateBoomLift";
import { useGetBoomLiftInspectionQuery } from "../../../api/hse/boomLift/boomLiftApi.js";
import { useParams } from "react-router-dom";
// import ImageViewer from "../../../utils/signatureViewer";
// import ImageViewer from "../../../components/common/ImageViewer"; // Import the ImageViewer component

function BoomLiftInspection() {
  const { locationId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDetails, setOpenDetails] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Ensure locationId is valid before querying
  const skipQuery = !locationId || isNaN(parseInt(locationId));
  const { data, isLoading, error, refetch } = useGetBoomLiftInspectionQuery(
    parseInt(locationId), 
    { skip: skipQuery }
  );
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
      // Use the src directly since it already includes the base URL
      window.open(src, '_blank');
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
  // Debug logs to help identify API call issues
  useEffect(() => {
    console.log("Location ID:", locationId);
    console.log("Skip Query:", skipQuery);
    console.log("API Loading:", isLoading);
    console.log("API Error:", error);
    console.log("API Data:", data);
  }, [locationId, skipQuery, isLoading, error, data]);

  const transformResponseData = (apiData) => {
    if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
      return [];
    }
  
    // Define human-readable names for each checkpoint prefix
    const checkpointReadableNames = {
      "all_valid_document": "All valid documents are available - Registration, Insurance, form no 10, License & operator authority letter.",
      "operator_fitness_certificate": "Operator Fitness Certificate",
      "main_horn_reverse_horn": "Main Horn & Reverse Horn",
      "emergency_lowering": "Emergency Lowering",
      "tyre_pressure_condition": "Tyre Pressure & Condition",
      "any_leakage": "Any Leakage",
      "smooth_function": "Smooth Function",
      "brake_stop_hold": "Brake Stop & Hold",
      "condition_of_all": "Condition of All Controls",
      "guard_rails_without_damage": "Guard Rails Without Damage",
      "toe_guard": "Toe Guard",
      "platform_condition": "Platform Condition",
      "door_lock_platform": "Door Lock Platform",
      "swl": "SWL (Safe Working Load)",
      "over_load_indicator_cut_off_devices": "Over Load Indicator & Cut Off Devices",
      "battery_condition": "Battery Condition",
      "operator_list": "Operator List",
      "ppe": "PPE (Safety shoes & helmet)"
    };
  
    return apiData.data.map((item) => {
      // Extract checkpoint prefixes from the item
      const checkpointPrefixes = new Set();
      
      for (const key of Object.keys(item)) {
        if (key.endsWith('_observations')) {
          const prefix = key.substring(0, key.lastIndexOf('_observations'));
          checkpointPrefixes.add(prefix);
        }
      }
      
      // Build checkpoints array
      const checkpoints = Array.from(checkpointPrefixes).map(prefix => {
        return {
          Checkpoint: checkpointReadableNames[prefix] || prefix.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          Observations: item[`${prefix}_observations`] || "",
          ActionBy: item[`${prefix}_action_by`] || "",
          Remarks: item[`${prefix}_remarks`] || ""
        };
      });
  
      // Build the inspection object
      const inspection = {
        EquipmentName: item.equipment_name || "",
        IdentificationNumber: item.identification_number || "",
        MakeModel: item.make_model || "",
        InspectionDate: item.inspection_date ? item.inspection_date.split("T")[0] : '',
        Site: item.site_name || "",
        Location: item.location || "",
        Remarks: "", // No direct field for this in the API
        InspectedBy: item.inspected_name || "",
        InspectedSignature: item.inspected_sign || "", // Add signature image URL
        Checkpoints: checkpoints
      };
      
      return { BoomLiftInspection: inspection };
    });
  };

  // Only use transformed API data, no fallback to dummy data
  const transformedData = transformResponseData(data);

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

  // Filter data by search term
  const filteredData = transformedData.filter((item) =>
    item.BoomLiftInspection.EquipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate data
  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle dialog close with refetch
  const handleDialogClose = () => {
    setOpenDialog(false);
    refetch(); // Refresh data after adding a new inspection
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-4">Boom Lift Inspection</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Equipment Name"
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          className="mb-4"
        />
        <div className="flex justify-end">
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          >
            Add Inspection
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center my-10">
          <CircularProgress />
          <span className="ml-3">Loading inspection data...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600 my-10 border border-red-300 rounded">
          Error loading data: {error.message || "Failed to load inspections"}
          <Button 
            onClick={refetch} 
            variant="outlined" 
            color="primary"
            className="mt-3 ml-2"
          >
            Try Again
          </Button>
        </div>
      ) : transformedData.length === 0 ? (
        <div className="p-4 text-center text-gray-600 my-10 border border-gray-300 rounded">
          No inspection data available. Please add a new inspection.
        </div>
      ) : (
        <>
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
                {currentRows.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{item.BoomLiftInspection.EquipmentName}</TableCell>
                    <TableCell align="center">{item.BoomLiftInspection.IdentificationNumber}</TableCell>
                    <TableCell align="center">{item.BoomLiftInspection.MakeModel}</TableCell>
                    <TableCell align="center">{item.BoomLiftInspection.InspectionDate}</TableCell>
                    <TableCell align="center">{item.BoomLiftInspection.Site}</TableCell>
                    <TableCell align="center">{item.BoomLiftInspection.Location}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDetails(item.BoomLiftInspection)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleOpenChecklist(item.BoomLiftInspection)}
                      >
                        View Checklist
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
        </>
      )}

      {/* Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        className="p-4"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DialogTitle className="text-lg font-semibold">Inspection Details</DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent className="p-6 space-y-4 bg-gray-50">
          {selectedInspection ? (
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Equipment Name:</span> {selectedInspection.EquipmentName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Identification Number:</span> {selectedInspection.IdentificationNumber}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Make/Model:</span> {selectedInspection.MakeModel}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Inspection Date:</span> {selectedInspection.InspectionDate}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Site:</span> {selectedInspection.Site}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Location:</span> {selectedInspection.Location}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Inspected By:</span> {selectedInspection.InspectedBy}
              </p>
{selectedInspection.InspectedSignature && (
  <div className="mt-3">
    <p className="text-sm font-bold text-gray-700 mb-1">Signature:</p>
    <PDFDownloader 
      src={`${import.meta.env.VITE_API_KEY}${selectedInspection.InspectedSignature}`}
      fileName="inspector_signature.pdf"
    />
  </div>
)}
            </div>
          ) : (
            <p className="text-center text-gray-500">No inspection details available</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Checklist Dialog */}
      <Dialog
        open={openChecklist}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        className="p-1 sm:p-4"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DialogTitle className="text-lg font-semibold">Checklist</DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent className="p-4 space-y-6">
          {selectedInspection && selectedInspection.Checkpoints.map((cp, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <p className="text-sm font-medium text-gray-700">
                <span className="font-bold">Checkpoint:</span> {cp.Checkpoint}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Observations:</span> {cp.Observations}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Action By:</span> {cp.ActionBy}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Remarks:</span> {cp.Remarks}
              </p>
            </div>
          ))}
          {!selectedInspection && (
            <p className="text-center text-gray-500">No checkpoints available</p>
          )}
        </DialogContent>
      </Dialog>
      
      <BoomLiftInspectionDialog
        open={openDialog}
        setOpen={handleDialogClose}
      />
    </div>
  );
}

export default BoomLiftInspection;