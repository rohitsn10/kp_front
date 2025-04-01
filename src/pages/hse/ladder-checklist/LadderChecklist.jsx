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
import ImageViewer from '../../../utils/signatureViewer';
import LadderInspectionDialog from '../../../components/pages/hse/ladder-inspection/CreateLadderInspection';

function LadderChecklist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLadderChecklist, setSelectedLadderChecklist] = useState(null);
  const [openChecksModal, setOpenChecksModal] = useState(false);
  const [openCreateDialog,setCreateDialog] =useState(false);

  const dummyLadder = [
    {
      "site": "Construction Site A",
      "ladder_no": "LDR-2025-001",
      "date_of_inspection": "2025-03-27",
      "visual_physical_checks": {
        "rail_strings_damaged": "No",
        "rung_missing": "No",
        "rung_broken": "No",
        "rung_distance_uneven": "No",
        "rungs_loose": "Yes",
        "top_hook_missing_damaged": "No",
        "bottom_non_skid_pad_missing_damaged": "Yes",
        "non_slip_bases": "Yes",
        "custom_check": "No additional issues detected"
      },
      "remarks": "Loose rungs and missing non-skid pad require immediate repair. Ensure periodic checks for safety.",
      "inspected_checked_by": {
        "name": "John Doe",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "site": "Construction Site B",
      "ladder_no": "LDR-2025-002",
      "date_of_inspection": "2025-03-27",
      "visual_physical_checks": {
        "rail_strings_damaged": "No",
        "rung_missing": "No",
        "rung_broken": "No",
        "rung_distance_uneven": "No",
        "rungs_loose": "Yes",
        "top_hook_missing_damaged": "No",
        "bottom_non_skid_pad_missing_damaged": "Yes",
        "non_slip_bases": "Yes",
        "custom_check": "No additional issues detected"
      },
      "remarks": "Loose rungs and missing non-skid pad require immediate repair. Ensure periodic checks for safety.",
      "inspected_checked_by": {
        "name": "John Doe",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "site": "Construction Site C",
      "ladder_no": "LDR-2025-001",
      "date_of_inspection": "2025-03-27",
      "visual_physical_checks": {
        "rail_strings_damaged": "No",
        "rung_missing": "No",
        "rung_broken": "No",
        "rung_distance_uneven": "No",
        "rungs_loose": "Yes",
        "top_hook_missing_damaged": "No",
        "bottom_non_skid_pad_missing_damaged": "Yes",
        "non_slip_bases": "Yes",
        "custom_check": "No additional issues detected"
      },
      "remarks": "Loose rungs and missing non-skid pad require immediate repair. Ensure periodic checks for safety.",
      "inspected_checked_by": {
        "name": "John Doe",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredLadderChecklists = dummyLadder.filter((ladder) =>
    ladder.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ladder.ladder_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ladder.inspected_checked_by.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredLadderChecklists.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openChecksModalHandler = (ladder) => {
    setSelectedLadderChecklist(ladder);
    setOpenChecksModal(true);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Ladder Checklist</h2>
      
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site, Ladder No, or Inspector"
          variant="outlined"
          className=""
        />
        <Button
          variant="contained"
          style={{ 
            backgroundColor: '#FF8C00', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            textTransform: 'none', 
            minHeight: 'auto' 
          }}
          onClick={()=>setCreateDialog(true)}
        >
          Add Ladder Checklist
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Ladder No</TableCell>
              <TableCell align="center">Date of Inspection</TableCell>
              <TableCell align="center">Inspected By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((ladder, index) => (
              <TableRow key={index}>
                <TableCell align="center">{ladder.site}</TableCell>
                <TableCell align="center">{ladder.ladder_no}</TableCell>
                <TableCell align="center">{ladder.date_of_inspection}</TableCell>
                <TableCell align="center">{ladder.inspected_checked_by.name}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => openChecksModalHandler(ladder)}
                  >
                    View Checks
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredLadderChecklists.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Visual Physical Checks Modal */}
      <Dialog 
        open={openChecksModal} 
        onClose={() => setOpenChecksModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ladder Inspection Details</DialogTitle>
        <DialogContent>
          {selectedLadderChecklist && (
            <>
              <Typography variant="h6" gutterBottom>
                Inspection Information
              </Typography>
              <Typography variant="body1">
                <strong>Site:</strong> {selectedLadderChecklist.site}
              </Typography>
              <Typography variant="body1">
                <strong>Ladder No:</strong> {selectedLadderChecklist.ladder_no}
              </Typography>
              <Typography variant="body1">
                <strong>Date of Inspection:</strong> {selectedLadderChecklist.date_of_inspection}
              </Typography>

              <Typography variant="h6" gutterBottom className="mt-4">
                Visual Physical Checks
              </Typography>
              {Object.entries(selectedLadderChecklist.visual_physical_checks).map(([key, value]) => (
                <Typography key={key} variant="body1">
                  • {key.replace(/_/g, ' ').toUpperCase()}: {value}
                </Typography>
              ))}

              {selectedLadderChecklist.remarks && (
                <>
                  <Typography variant="h6" gutterBottom className="mt-4">
                    Remarks
                  </Typography>
                  <Typography variant="body1">
                    {selectedLadderChecklist.remarks}
                  </Typography>
                </>
              )}

              <Typography variant="h6" gutterBottom className="mt-4">
                Inspected By
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedLadderChecklist.inspected_checked_by.name}
              </Typography>
              <Typography variant="body1">
                <strong>Signature:</strong>
              </Typography>
              <ImageViewer 
                src={selectedLadderChecklist.inspected_checked_by.signature} 
                alt={`${selectedLadderChecklist.inspected_checked_by.name} Signature`} 
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      <LadderInspectionDialog
open={openCreateDialog} setOpen={setCreateDialog}
      />
    </div>
  );
}

export default LadderChecklist;