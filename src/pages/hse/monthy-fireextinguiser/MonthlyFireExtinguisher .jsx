import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TablePagination,
  TextField,
  Chip,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import FireExtinguisherInspectionDialog from '../../../components/pages/hse/monthly-extenguisher/CreateExtinuisherList';
import { useGetAllFireExtinguisherInspectionsQuery } from '../../../api/hse/extinguisher/extinguisherApi';
import { useParams } from 'react-router-dom';

// PDF Download Component
const PDFDownloadButton = ({ src, fileName = "signature.pdf" }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!src) return;
    
    setIsDownloading(true);
    try {
      const fullUrl = `${import.meta.env.VITE_API_KEY}${src}`;
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // You can add a toast notification here if you have one
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      disabled={isDownloading || !src}
      sx={{
        borderColor: '#FF8C00',
        color: '#FF8C00',
        '&:hover': {
          borderColor: '#FF8C00',
          backgroundColor: 'rgba(255, 140, 0, 0.04)'
        }
      }}
    >
      {isDownloading ? 'Downloading...' : 'Download PDF'}
    </Button>
  );
};

function MonthlyFireExtinguisher() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState(null);
  const [openExtinguisherModal, setOpenExtinguisherModal] = useState(false);
  const [openCreateList, setOpenCreateList] = useState(false);
  
  // Get locationId from URL params and parse it properly
  const { locationId } = useParams();
  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  
  console.log('Location ID from URL:', locationId);
  console.log('Parsed Location ID:', parsedLocationId);

  // Using the query hook with proper skip option
  const { 
    data: response, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAllFireExtinguisherInspectionsQuery(parsedLocationId, {
    skip: parsedLocationId === null || isNaN(parsedLocationId)
  });

  // Extract the actual data array from the response
  const inspectionsData = response?.data || [];
  
  console.log('API Response:', response);
  console.log('Inspections Data:', inspectionsData);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredInspections = inspectionsData.filter(
    (inspection) => inspection.site_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredInspections.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openInspectionDetailsHandler = (inspection) => {
    setSelectedInspection(inspection);
    setOpenDetailsModal(true);
  };

  const openExtinguisherDetailsHandler = (extinguisher) => {
    setSelectedExtinguisher(extinguisher);
    setOpenExtinguisherModal(true);
  };

  const getStatusChip = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return <Chip label="Overdue" color="error" size="small" />;
    } else if (daysDiff <= 30) {
      return <Chip label="Due Soon" color="warning" size="small" />;
    } else {
      return <Chip label="Valid" color="success" size="small" />;
    }
  };

  const getConditionColor = (condition) => {
    if (!condition) return 'default';
    
    const conditionStr = String(condition).toLowerCase();
    
    switch (conditionStr) {
      case 'yes':
      case 'ok':
      case 'good':
      case 'normal':
      case 'clear':
      case 'unobstructed':
      case 'true':
        return 'success';
      case 'fair':
      case 'partially blocked':
        return 'warning';
      case 'no':
      case 'needs replacement':
      case 'low':
      case 'high':
      case 'scratched':
      case 'false':
        return 'error';
      default:
        return 'default';
    }
  };

  // Display error if locationId is missing or invalid
  if (!parsedLocationId || isNaN(parsedLocationId)) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          Invalid location ID. Please check the URL and try again.
        </Alert>
      </div>
    );
  }

  // Rendering logic for different states
  if (isLoading) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5 flex justify-center items-center" style={{ minHeight: '400px' }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginLeft: '16px' }}>
          Loading fire extinguisher inspection data...
        </Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          Error loading data: {error?.data?.message || "Failed to fetch inspection records"}
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => refetch()}
          className="mt-4 mx-auto block"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Fire Extinguisher Inspection Records</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site"
          variant="outlined"
        />
        <Button
          onClick={() => setOpenCreateList(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Add New Inspection
        </Button>
      </div>

      {inspectionsData.length === 0 ? (
        <Alert severity="info" style={{ margin: '32px 0' }}>
          No fire extinguisher inspection records found. Create a new inspection using the "Add New Inspection" button.
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#F2EDED' }}>
                  <TableCell align="center">Site</TableCell>
                  <TableCell align="center">Date of Inspection</TableCell>
                  <TableCell align="center">Number of Extinguishers</TableCell>
                  <TableCell align="center">Inspector</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No records found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRows.map((inspection, index) => (
                    <TableRow key={inspection.id || index}>
                      <TableCell align="center">{inspection.site_name}</TableCell>
                      <TableCell align="center">{inspection.date_of_inspection}</TableCell>
                      <TableCell align="center">{inspection.fire_extinguisher_details?.length || 0}</TableCell>
                      <TableCell align="center">{inspection.checked_by_name}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openInspectionDetailsHandler(inspection)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredInspections.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            style={{ borderTop: '1px solid #e0e0e0' }}
          />
        </>
      )}

      {/* Inspection Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Inspection Details: {selectedInspection?.site_name}</Typography>
            <Typography variant="subtitle1">Date: {selectedInspection?.date_of_inspection}</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedInspection && (
            <>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>Inspector Information:</Typography>
                <div className="flex items-center gap-4">
                  <Typography><strong>Name:</strong> {selectedInspection.checked_by_name}</Typography>
                  {selectedInspection.signature && (
                    <div>
                      <Typography><strong>Signature:</strong></Typography>
                      <PDFDownloadButton
                        src={selectedInspection.signature}
                        fileName={`signature_${selectedInspection.site_name}_${selectedInspection.date_of_inspection}.pdf`}
                      />
                    </div>
                  )}
                </div>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Extinguishers ({selectedInspection.fire_extinguisher_details?.length || 0})
              </Typography>
              
              {!selectedInspection.fire_extinguisher_details || selectedInspection.fire_extinguisher_details.length === 0 ? (
                <Alert severity="info">
                  No extinguisher details available for this inspection.
                </Alert>
              ) : (
                <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#F2EDED' }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInspection.fire_extinguisher_details.map((extinguisher, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{extinguisher.extinguisher_no}</TableCell>
                          <TableCell>{extinguisher.extinguisher_type}</TableCell>
                          <TableCell>{extinguisher.weight} kg</TableCell>
                          <TableCell>{extinguisher.location}</TableCell>
                          <TableCell>
                            {getStatusChip(extinguisher.due_date_refilling)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openExtinguisherDetailsHandler(extinguisher)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Extinguisher Details Modal */}
      <Dialog
        open={openExtinguisherModal}
        onClose={() => setOpenExtinguisherModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Extinguisher Details: {selectedExtinguisher?.extinguisher_no}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedExtinguisher && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2">Basic Information</Typography>
                  <Paper className="p-3 mt-2">
                    <Typography><strong>ID:</strong> {selectedExtinguisher.extinguisher_no}</Typography>
                    <Typography><strong>Type:</strong> {selectedExtinguisher.extinguisher_type}</Typography>
                    <Typography><strong>Weight:</strong> {selectedExtinguisher.weight} kg</Typography>
                    <Typography><strong>Location:</strong> {selectedExtinguisher.location}</Typography>
                  </Paper>
                </div>
                
                <div>
                  <Typography variant="subtitle2">Maintenance Dates</Typography>
                  <Paper className="p-3 mt-2">
                    <Typography><strong>Refilling Date:</strong> {selectedExtinguisher.refilling_date}</Typography>
                    <Typography>
                      <strong>Due Date (Refilling):</strong> {selectedExtinguisher.due_date_refilling} {' '}
                      {getStatusChip(selectedExtinguisher.due_date_refilling)}
                    </Typography>
                    <Typography>
                      <strong>Due Date (Hydro Test):</strong> {selectedExtinguisher.due_date_hydro_test} {' '}
                      {getStatusChip(selectedExtinguisher.due_date_hydro_test)}
                    </Typography>
                  </Paper>
                </div>
                
                <div>
                  <Typography variant="subtitle2">Condition</Typography>
                  <Paper className="p-3 mt-2">
                    <Typography>
                      <strong>Seal Intact:</strong> {' '}
                      <Chip 
                        label={selectedExtinguisher.seal_intact ? "Yes" : "No"} 
                        color={getConditionColor(selectedExtinguisher.seal_intact)}
                        size="small"
                      />
                    </Typography>
                    <Typography>
                      <strong>Pressure in Gauge:</strong> {' '}
                      <Chip 
                        label={selectedExtinguisher.pressure_in_gauge} 
                        color={getConditionColor(selectedExtinguisher.pressure_in_gauge)}
                        size="small"
                      />
                    </Typography>
                    <Typography>
                      <strong>Tube/Nozzle:</strong> {' '}
                      <Chip 
                        label={selectedExtinguisher.tube_nozzle} 
                        color={getConditionColor(selectedExtinguisher.tube_nozzle)}
                        size="small"
                      />
                    </Typography>
                    <Typography>
                      <strong>Painting Condition:</strong> {' '}
                      <Chip 
                        label={selectedExtinguisher.painting_condition} 
                        color={getConditionColor(selectedExtinguisher.painting_condition)}
                        size="small"
                      />
                    </Typography>
                    <Typography>
                      <strong>Access:</strong> {' '}
                      <Chip 
                        label={selectedExtinguisher.access} 
                        color={getConditionColor(selectedExtinguisher.access)}
                        size="small"
                      />
                    </Typography>
                  </Paper>
                </div>
                
                <div>
                  <Typography variant="subtitle2">Notes</Typography>
                  <Paper className="p-3 mt-2" style={{ minHeight: "100px" }}>
                    <Typography><strong>Remarks:</strong> {selectedExtinguisher.remarks}</Typography>
                  </Paper>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <FireExtinguisherInspectionDialog
        open={openCreateList}
        setOpen={setOpenCreateList}
        locationId={parsedLocationId}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default MonthlyFireExtinguisher;