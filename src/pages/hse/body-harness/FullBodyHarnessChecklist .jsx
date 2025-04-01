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
  TextField
} from '@mui/material';
import HarnessInspectionDialog from '../../../components/pages/hse/body-harness/CreateHarnessChecklist';

function FullBodyHarnessChecklist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedHarness, setSelectedHarness] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createHarnessChecklist, setCreateHarnessChecklist] = useState(false);

  const dummyHarness = [
    {
      "site": "Construction Site A",
      "make_model": "SafetyFirst Pro",
      "manufacturing_date": "2023-01-10",
      "date_of_inspection": "2025-03-15",
      "visual_physical_checks": [
        {
          "check": "Visual / Physical Checks",
          "status": "OK",
          "remarks": "No visible defects detected."
        },
        {
          "check": "Waist buckle",
          "status": "OK",
          "remarks": "Buckle securely fastens."
        },
        {
          "check": "Metal D ring at back for lanyard",
          "status": "OK",
          "remarks": "Ring is firmly attached."
        },
        {
          "check": "Buckle working (inserting and pulling)",
          "status": "OK",
          "remarks": "Buckle works properly."
        },
        {
          "check": "Harness shelf life (valid-for three years)",
          "status": "OK",
          "remarks": "Still within valid usage period."
        }
      ]
    },
    {
      "site": "Construction Site B",
      "make_model": "Guardian Elite",
      "manufacturing_date": "2022-11-05",
      "date_of_inspection": "2025-03-20",
      "visual_physical_checks": [
        {
          "check": "Visual / Physical Checks",
          "status": "OK",
          "remarks": "No issues detected."
        },
        {
          "check": "Waist buckle",
          "status": "Not Ok",
          "remarks": "Buckle requires replacement."
        },
        {
          "check": "Metal D ring at back for lanyard",
          "status": "OK",
          "remarks": "Ring is secure."
        },
        {
          "check": "Buckle working (inserting and pulling)",
          "status": "Not Ok",
          "remarks": "Buckle needs maintenance."
        },
        {
          "check": "Harness shelf life (valid-for three years)",
          "status": "OK",
          "remarks": "Within shelf life."
        }
      ]
    },
    {
      "site": "Construction Site C",
      "make_model": "XYZ Harness Pro V2",
      "manufacturing_date": "2023-06-15",
      "date_of_inspection": "2025-04-01",
      "visual_physical_checks": [
        {
          "check": "Visual / Physical Checks",
          "status": "OK",
          "remarks": "No visible defects detected."
        },
        {
          "check": "Waist buckle",
          "status": "OK",
          "remarks": "Buckle securely fastens."
        },
        {
          "check": "Metal D ring at back for lanyard",
          "status": "OK",
          "remarks": "Ring is firmly attached."
        },
        {
          "check": "Buckle working (inserting and pulling)",
          "status": "Not Ok",
          "remarks": "Buckle slightly loose, requires adjustment."
        },
        {
          "check": "Harness shelf life (valid-for three years)",
          "status": "OK",
          "remarks": "Still within valid usage period."
        },
        {
          "check": "No fissures, wear or twisted strap of lanyard rope",
          "status": "OK",
          "remarks": "Straps in good condition."
        },
        {
          "check": "Lanyard with two ropes",
          "status": "OK",
          "remarks": "Both ropes present and intact."
        },
        {
          "check": "No fissures in the sleeve",
          "status": "Not Ok",
          "remarks": "Minor wear detected, needs further inspection."
        },
        {
          "check": "Shock absorber, lanyard & hooks are intact",
          "status": "OK",
          "remarks": "All components in proper working order."
        },
        {
          "check": "Snap hooks mouth opening & closing",
          "status": "OK",
          "remarks": "Snap hooks operate smoothly."
        }
      ]
    }
  ];

  const filteredHarness = dummyHarness.filter((harness) =>
    harness.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    harness.make_model.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const currentRows = filteredHarness.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            {currentRows.map((harness) => {
              // Calculate overall status
              const failedChecks = harness.visual_physical_checks.filter(check => check.status === "Not Ok").length;
              const totalChecks = harness.visual_physical_checks.length;
              const statusColor = failedChecks > 0 ? 'error' : 'success';
              const statusText = failedChecks > 0 ? `${failedChecks} issues found` : 'All checks passed';
              
              return (
                <TableRow key={`${harness.site}-${harness.make_model}`}>
                  <TableCell align="center">{harness.site}</TableCell>
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
            })}
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
                <Typography><strong>Site:</strong> {selectedHarness.site}</Typography>
                <Typography><strong>Make/Model:</strong> {selectedHarness.make_model}</Typography>
                <Typography><strong>Manufacturing Date:</strong> {selectedHarness.manufacturing_date}</Typography>
                <Typography><strong>Inspection Date:</strong> {selectedHarness.date_of_inspection}</Typography>
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
                    {selectedHarness.visual_physical_checks.map((check, index) => (
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
                  {selectedHarness.visual_physical_checks.filter(check => check.status === "Not Ok").length} issues found out of {selectedHarness.visual_physical_checks.length} checks.
                </Typography>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Harness Checklist Dialog would go here */}
      {/* Similar to your MockDrillReportDialog component */}
      <HarnessInspectionDialog open={createHarnessChecklist} setOpen={setCreateHarnessChecklist} />
    </div>
  );
}

export default FullBodyHarnessChecklist;