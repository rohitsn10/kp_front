// Solution 1: Fix the hook usage with better parameter handling

import React, { useState, useEffect } from 'react';
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
  Link
} from '@mui/material';
import ImageViewer from '../../../utils/signatureViewer';
import ToolboxAttendanceDialog from '../../../components/pages/hse/toolbox-talks';
import { useGetToolTalkAttendanceQuery } from '../../../api/hse/toolbox/toolBoxApi';
import { useParams } from 'react-router-dom';

function ToolboxTalk() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToolboxTalk, setSelectedToolboxTalk] = useState(null);
  const [openPointsModal, setOpenPointsModal] = useState(false);
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  
  // Get locationId from URL params
  const { locationId } = useParams();
  
  // Make sure locationId is a valid number before passing to the query
  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  
  // Use the query hook with proper skip option to prevent invalid requests
  const { 
    data: toolboxTalkData, 
    isLoading, 
    isError,
    refetch 
  } = useGetToolTalkAttendanceQuery(parsedLocationId, {
    // Skip the query if locationId is null/invalid
    skip: parsedLocationId === null || isNaN(parsedLocationId),
  });

  // Rest of your component code...
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileDownload = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  // Filtering logic
  const filteredToolboxTalks = toolboxTalkData?.data 
    ? toolboxTalkData.data.filter((talk) => 
        talk.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talk.tbt_conducted_by_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talk.tbt_against_permit_no.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const currentRows = filteredToolboxTalks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openPointsModalHandler = (talk) => {
    setSelectedToolboxTalk(talk);
    setOpenPointsModal(true);
  };

  const openParticipantsModalHandler = (talk) => {
    setSelectedToolboxTalk(talk);
    setOpenParticipantsModal(true);
  };

  // Display error if locationId is missing
  if (!parsedLocationId || isNaN(parsedLocationId)) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Typography variant="h6" color="error" align="center">
          Invalid location ID. Please check the URL and try again.
        </Typography>
      </div>
    );
  }

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Display error state
  if (isError) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Typography variant="h6" color="error" align="center">
          Error fetching toolbox talk data. Please try again later.
        </Typography>
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
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Toolbox Talk Records</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site, Conducted By, or Permit No"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateDialog(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Add Toolbox Talk
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Permit Date</TableCell>
              <TableCell align="center">TBT Conducted By</TableCell>
              <TableCell align="center">TBT Permit No</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((talk) => (
                <TableRow key={talk.id}>
                  <TableCell align="center">{talk.site_name}</TableCell>
                  <TableCell align="center">{talk.permit_date}</TableCell>
                  <TableCell align="center">{talk.tbt_conducted_by_name}</TableCell>
                  <TableCell align="center">{talk.tbt_against_permit_no}</TableCell>
                  <TableCell align="center">
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => openPointsModalHandler(talk)}
                      >
                        View Points
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => openParticipantsModalHandler(talk)}
                      >
                        View Participants
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredToolboxTalks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Modals remain the same */}
      {/* Points Discussed Modal */}
      <Dialog 
        open={openPointsModal} 
        onClose={() => setOpenPointsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Points Discussed</DialogTitle>
        <DialogContent>
          {selectedToolboxTalk && (
            <>
              <Typography variant="h6" gutterBottom>
                Job Activity: {selectedToolboxTalk.job_activity_in_detail}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Detailed Points:
              </Typography>
              <Typography variant="body1" gutterBottom>
                • USE OF PPEs: {selectedToolboxTalk.use_of_ppes_topic_discussed}
              </Typography>
              <Typography variant="body1" gutterBottom>
                • USE OF TOOLS: {selectedToolboxTalk.use_of_tools_topic_discussed}
              </Typography>
              <Typography variant="body1" gutterBottom>
                • HAZARD AT WORK PLACE: {selectedToolboxTalk.hazard_at_work_place_topic_discussed}
              </Typography>
              <Typography variant="body1" gutterBottom>
                • USE OF ACTION IN AN EMERGENCY: {selectedToolboxTalk.use_of_action_in_an_emergency_topic_discussed}
              </Typography>
              <Typography variant="body1" gutterBottom>
                • HEALTH STATUS: {selectedToolboxTalk.use_of_health_status_topic_discussed}
              </Typography>
              <Typography variant="body1" gutterBottom>
                • OTHERS: {selectedToolboxTalk.use_of_others_topic_discussed}
              </Typography>
              {selectedToolboxTalk.remarks && (
                <>
                  <Typography variant="subtitle1" gutterBottom className="mt-4">
                    Remarks:
                  </Typography>
                  <Typography variant="body1">
                    {selectedToolboxTalk.remarks}
                  </Typography>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Participants Modal */}
      <Dialog 
        open={openParticipantsModal} 
        onClose={() => setOpenParticipantsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Participants Details</DialogTitle>
        <DialogContent>
          {selectedToolboxTalk && (
            <div className="mb-4 p-3 border rounded">
              <Typography variant="h6" gutterBottom>Contractor Information</Typography>
              <Typography><strong>Name of Contractor:</strong> {selectedToolboxTalk.name_of_contractor}</Typography>
              
              <Typography variant="h6" gutterBottom className="mt-4">TBT Conducted By</Typography>
              <Typography><strong>Name:</strong> {selectedToolboxTalk.tbt_conducted_by_name}</Typography>
              <Typography><strong>Signature:</strong></Typography>
              <ImageViewer 
                src={selectedToolboxTalk.tbt_conducted_by_signature} 
                alt={`${selectedToolboxTalk.tbt_conducted_by_name} Signature`} 
              />
              
              {selectedToolboxTalk.participant_upload_attachments && (
                <div className="mt-4">
                  <Typography variant="h6" gutterBottom>Participant Attachments</Typography>
                  <div className="flex items-center gap-2">
                    <Typography>
                      <strong>File:</strong> {selectedToolboxTalk.participant_upload_attachments.split('/').pop()}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => handleFileDownload(selectedToolboxTalk.participant_upload_attachments)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <ToolboxAttendanceDialog
        open={openCreateDialog}
        setOpen={setCreateDialog}
      />
    </div>
  );
}

export default ToolboxTalk;