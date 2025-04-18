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
  CircularProgress,
  Alert
} from '@mui/material';
import HarnessInspectionDialog from '../../../components/pages/hse/body-harness/CreateHarnessChecklist';
import { useGetAllHarnessInspectionsQuery } from '../../../api/hse/harness/harnessApi';
import { useParams } from 'react-router-dom';
// import { useGetAllHarnessInspectionsQuery } from '../../../path/to/your/api'; // Adjust the import path as needed

function FullBodyHarnessChecklist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedHarness, setSelectedHarness] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createHarnessChecklist, setCreateHarnessChecklist] = useState(false);
  const { locationId } = useParams();
  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  const { 
    data: harnessResponse, 
    error, 
    isLoading,
    refetch 
  } = useGetAllHarnessInspectionsQuery(parsedLocationId, {
    // Skip the query if locationId is invalid
    skip: parsedLocationId === null || isNaN(parsedLocationId)
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (harness) => {
    setSelectedHarness(harness);
    setOpenDetailsModal(true);
  };

  const closeModal = () => {
    setOpenDetailsModal(false);
    setSelectedHarness(null);
  };

  // Filter harness data based on search term
  const filteredHarness = harnessResponse?.data 
    ? harnessResponse.data.filter((harness) =>
        harness.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        harness.make_model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  // Get current page data
  const currentRows = filteredHarness.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate overall status for a harness inspection
  const calculateStatus = (harness) => {
    // Create an array of all status fields (they all end with _status)
    const statusFields = Object.keys(harness).filter(key => key.endsWith('_status'));
    const failedChecks = statusFields.filter(field => !harness[field]).length;
    const totalChecks = statusFields.length;
    
    return {
      failedChecks,
      totalChecks,
      statusText: failedChecks > 0 ? `${failedChecks} issues found` : 'All checks passed'
    };
  };

  // Prepare inspection checks for detail view
  const prepareChecksForDetailView = (harness) => {
    if (!harness) return [];

    // Map of status field keys to their display names
    const checkNamesMap = {
      'wear_or_twisted_strap': 'Wear or twisted strap',
      'waist_buckle': 'Waist buckle',
      'both_leg_strap_buckle': 'Both leg strap buckle',
      'waist_buckle_2': 'Waist buckle (secondary)',
      'metal_d_ring': 'Metal D ring at back for lanyard',
      'buckle_working': 'Buckle working (inserting and pulling)',
      'harness_shelf_life': 'Harness shelf life (valid for three years)',
      'lanyard_wear_twist': 'No fissures, wear or twisted strap of lanyard rope',
      'lanyard_two_ropes': 'Lanyard with two ropes',
      'sleeve_fissures': 'No fissures in the sleeve',
      'shock_absorber': 'Shock absorber, lanyard & hooks are intact',
      'snap_hooks': 'Snap hooks mouth opening & closing'
    };

    // Create check items array
    const checks = [];
    Object.keys(harness)
      .filter(key => key.endsWith('_status'))
      .forEach(statusKey => {
        // Get the base key without '_status'
        const baseKey = statusKey.replace('_status', '');
        // Get remarks key
        const remarksKey = `${baseKey}_remarks`;
        
        // Only add if both status and remarks exist
        if (harness[statusKey] !== undefined && harness[remarksKey] !== undefined) {
          checks.push({
            check: checkNamesMap[baseKey] || baseKey, // Use mapped name or base key if not mapped
            status: harness[statusKey] ? 'OK' : 'Not Ok',
            remarks: harness[remarksKey]
          });
        }
      });

    return checks;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircularProgress />
        <Typography variant="body1" className="mt-4">Loading harness inspection data...</Typography>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Alert severity="error">
          Error loading harness inspection data: {error.message || "Failed to fetch data"}
        </Alert>
      </div>
    );
  }

  // Show empty state
  if (!harnessResponse?.data || harnessResponse.data.length === 0) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Full Body Harness Checklist</h2>
        <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
          <Button
            onClick={() => setCreateHarnessChecklist(true)}
            variant="contained"
            style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
          >
            Create Harness Checklist
          </Button>
        </div>
        <Alert severity="info" className="my-4">
          No harness inspection records found. Create a new harness inspection checklist to get started.
        </Alert>
        <HarnessInspectionDialog open={createHarnessChecklist} setOpen={setCreateHarnessChecklist} />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Full Body Harness Checklist</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Site or Model"
          variant="outlined"
        />

        <Button
          onClick={() => setCreateHarnessChecklist(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Create Harness Checklist
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Make/Model</TableCell>
              <TableCell align="center">Manufacturing Date</TableCell>
              <TableCell align="center">Inspection Date</TableCell>
              <TableCell align="center">Overall Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((harness) => {
                // Calculate overall status
                const { failedChecks, statusText } = calculateStatus(harness);
                
                return (
                  <TableRow key={harness.id}>
                    <TableCell align="center">{harness.site_name}</TableCell>
                    <TableCell align="center">{harness.make_model}</TableCell>
                    <TableCell align="center">{harness.manufacturing_date}</TableCell>
                    <TableCell align="center">{harness.date_of_inspection}</TableCell>
                    <TableCell align="center">
                      <span style={{ color: failedChecks > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                        {statusText}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => openModal(harness)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1">No results found for your search.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredHarness.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Inspection Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <span>Harness Inspection Details</span>
            <Button onClick={closeModal} color="primary">Close</Button>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedHarness && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Typography><strong>Site:</strong> {selectedHarness.site_name}</Typography>
                <Typography><strong>Make/Model:</strong> {selectedHarness.make_model}</Typography>
                <Typography><strong>Manufacturing Date:</strong> {selectedHarness.manufacturing_date}</Typography>
                <Typography><strong>Inspection Date:</strong> {selectedHarness.date_of_inspection}</Typography>
                <Typography><strong>Inspector:</strong> {selectedHarness.inspector_name}</Typography>
                <Typography><strong>Report:</strong> {selectedHarness.report}</Typography>
              </div>
              
              <Typography variant="h6" className="mt-4 mb-3">Inspection Checklist</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#F2EDED' }}>
                      <TableCell>Check Item</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prepareChecksForDetailView(selectedHarness).map((check, index) => (
                      <TableRow key={index}>
                        <TableCell>{check.check}</TableCell>
                        <TableCell align="center">
                          <span style={{ 
                            color: check.status === 'OK' ? 'green' : 'red',
                            fontWeight: 'bold'
                          }}>
                            {check.status}
                          </span>
                        </TableCell>
                        <TableCell>{check.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <div className="mt-6">
                <Typography><strong>Summary:</strong></Typography>
                <Typography>
                  {calculateStatus(selectedHarness).failedChecks} issues found out of {calculateStatus(selectedHarness).totalChecks} checks.
                </Typography>
                {selectedHarness.inspector_signature && (
                  <div className="mt-4">
                    <Typography><strong>Inspector Signature:</strong></Typography>
                    <img 
                      src={selectedHarness.inspector_signature} 
                      alt="Inspector Signature" 
                      style={{ maxWidth: '200px', marginTop: '8px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Harness Checklist Dialog */}
      <HarnessInspectionDialog open={createHarnessChecklist} setOpen={setCreateHarnessChecklist} onSuccess={refetch}/>
    </div>
  );
}

export default FullBodyHarnessChecklist;