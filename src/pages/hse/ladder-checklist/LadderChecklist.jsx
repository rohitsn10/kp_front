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
import ImageViewer from '../../../utils/signatureViewer';
import LadderInspectionDialog from '../../../components/pages/hse/ladder-inspection/CreateLadderInspection';
import { useParams } from 'react-router-dom';
import { useGetLadderInspectionsQuery } from '../../../api/hse/ladder/ladderInspectionApi';

function LadderChecklist() {
  const [page, setPage] = useState(0);
  const { locationId } = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLadderChecklist, setSelectedLadderChecklist] = useState(null);
  const [openChecksModal, setOpenChecksModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  
  const {
    data: ladderInspectionsResponse,
    isLoading,
    isFetching,
    refetch,
    error
  } = useGetLadderInspectionsQuery(locationId, {
    skip: !locationId, // Skip fetching if locationId is not available
    refetchOnMountOrArgChange: true, // Refetch when component mounts or locationId changes
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get ladder inspections from API response if available
  const ladderInspections = ladderInspectionsResponse?.data || [];

  // Filtering logic
  const filteredLadderChecklists = ladderInspections.filter((ladder) =>
    ladder.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ladder.ladder_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ladder.inspected_by_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredLadderChecklists.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openChecksModalHandler = (ladder) => {
    setSelectedLadderChecklist(ladder);
    setOpenChecksModal(true);
  };

  // Format the date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render loading state
  if (isLoading || isFetching) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5 flex justify-center items-center" style={{ minHeight: '300px' }}>
        <CircularProgress />
        <Typography variant="h6" className="ml-3">Loading ladder inspections...</Typography>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Alert severity="error" className="mb-4">
          Error loading ladder inspections: {error.message || 'An unknown error occurred'}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={refetch}
          className="mt-3"
        >
          Try Again
        </Button>
      </div>
    );
  }

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
          onClick={() => setCreateDialog(true)}
        >
          Add Ladder Checklist
        </Button>
      </div>

      {/* Empty state */}
      {ladderInspections.length === 0 ? (
        <Alert severity="info" className="mb-4">
          No ladder inspections found. Click "Add Ladder Checklist" to create one.
        </Alert>
      ) : (
        <>
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
                {currentRows.map((ladder) => (
                  <TableRow key={ladder.id}>
                    <TableCell align="center">{ladder.site_name}</TableCell>
                    <TableCell align="center">{ladder.ladder_no}</TableCell>
                    <TableCell align="center">{formatDate(ladder.date_of_inspection)}</TableCell>
                    <TableCell align="center">{ladder.inspected_by_name}</TableCell>
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
        </>
      )}

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
                <strong>Site:</strong> {selectedLadderChecklist.site_name}
              </Typography>
              <Typography variant="body1">
                <strong>Ladder No:</strong> {selectedLadderChecklist.ladder_no}
              </Typography>
              <Typography variant="body1">
                <strong>Date of Inspection:</strong> {formatDate(selectedLadderChecklist.date_of_inspection)}
              </Typography>

              <Typography variant="h6" gutterBottom className="mt-4">
                Visual Physical Checks
              </Typography>
              <Typography variant="body1">
                • RAIL STRINGS DAMAGED: {selectedLadderChecklist.rail_strings_damaged}
              </Typography>
              <Typography variant="body1">
                • RUNG MISSING: {selectedLadderChecklist.rung_missing}
              </Typography>
              <Typography variant="body1">
                • RUNG BROKEN: {selectedLadderChecklist.rung_broken}
              </Typography>
              <Typography variant="body1">
                • RUNG DISTANCE UNEVEN: {selectedLadderChecklist.rung_distance_uneven}
              </Typography>
              <Typography variant="body1">
                • RUNGS LOOSE: {selectedLadderChecklist.rungs_loose}
              </Typography>
              <Typography variant="body1">
                • TOP HOOK MISSING DAMAGED: {selectedLadderChecklist.top_hook_missing_damaged}
              </Typography>
              <Typography variant="body1">
                • BOTTOM NON SKID PAD MISSING DAMAGED: {selectedLadderChecklist.bottom_non_skid_pad_missing_damaged}
              </Typography>
              <Typography variant="body1">
                • NON SLIP BASES: {selectedLadderChecklist.non_slip_bases}
              </Typography>
              <Typography variant="body1">
                • CUSTOM CHECK: {selectedLadderChecklist.custom_check}
              </Typography>

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
                <strong>Name:</strong> {selectedLadderChecklist.inspected_by_name}
              </Typography>
              <Typography variant="body1">
                <strong>Signature:</strong>
              </Typography>
              <ImageViewer 
                src={selectedLadderChecklist.inspected_by_signature} 
                alt={`${selectedLadderChecklist.inspected_by_name} Signature`} 
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      <LadderInspectionDialog
        open={openCreateDialog}
        setOpen={setCreateDialog}
        onSuccess={refetch}
      />
    </div>
  );
}

export default LadderChecklist;