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
import CreateHSEMeetingMinutes from '../../../components/pages/hse/create-safety-meeting-minutes/CreateSafetyMOM';
import { useGetMinutesOfSafetyTrainingQuery } from '../../../api/hse/safetyTrainingMinutes/safetyTrainingMinutes';
import { useParams } from 'react-router-dom';

// Reusable Image Viewer Component
const ImageViewer = ({ src, alt, width = 100, height = 30 }) => {
  const [open, setOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_API_KEY || '';
  const fullImageUrl = src && !src.startsWith('http') ? `${baseUrl}${src}` : src;

  return (
    <>
      <img
        src={fullImageUrl}
        alt={alt}
        onClick={() => setOpen(true)}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: 'pointer'
        }}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img
            src={fullImageUrl}
            alt={alt}
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

function SafetyMeeting() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  const { locationId } = useParams();
  
  // RTK Query hook integration
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useGetMinutesOfSafetyTrainingQuery(locationId);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic with real data
  const filteredMeetings = data?.data ? data.data.filter((meeting) =>
    meeting.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.chairman_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.mom_recorded_by.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const currentRows = filteredMeetings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openDetailsModalHandler = (meeting) => {
    setSelectedMeeting(meeting);
    setOpenDetailsModal(true);
  };

  // Helper function to render table sections
  const renderSectionTable = (title, data, columns) => {
    if (!data || data.length === 0) {
      return (
        <div className="mt-6">
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" className="mt-2">No data available</Typography>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <Typography variant="h6">{title}</Typography>
        <TableContainer component={Paper} style={{ marginTop: '10px', borderRadius: '8px' }}>
          <Table size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: '#F2EDED' }}>
                {columns.map((col, index) => (
                  <TableCell key={index} align="center">{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((col, idx) => {
                    // Map column names to object keys
                    const key = Object.keys(item)[idx];
                    return <TableCell key={idx} align="center">{item[key]}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5 flex justify-center items-center" style={{ minHeight: '300px' }}>
        <CircularProgress />
        <Typography variant="h6" className="ml-3">Loading safety meeting data...</Typography>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Alert severity="error">
          Error loading safety meeting data: {error?.message || 'Unknown error occurred'}
        </Alert>
      </div>
    );
  }

  // Show empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Safety Meeting Records</h2>
        <div className="flex justify-end mb-5">
          <Button
            onClick={() => setCreateDialog(true)}
            variant="contained"
            style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
          >
            Add Safety Meeting
          </Button>
        </div>
        <Alert severity="info">No safety meeting records found. Create a new meeting to get started.</Alert>
        <CreateHSEMeetingMinutes
          open={openCreateDialog}
          setOpen={setCreateDialog}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Safety Meeting Records</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site, Chairman, or Recorder"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateDialog(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Add Safety Meeting
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Meeting Date</TableCell>
              <TableCell align="center">Meeting Time</TableCell>
              <TableCell align="center">Chairman</TableCell>
              <TableCell align="center">Recorded By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((meeting, index) => (
              <TableRow key={meeting.id}>
                <TableCell align="center">{meeting.site_name}</TableCell>
                <TableCell align="center">{new Date(meeting.mom_issue_date).toLocaleDateString()}</TableCell>
                <TableCell align="center">{meeting.time}</TableCell>
                <TableCell align="center">{meeting.chairman_name}</TableCell>
                <TableCell align="center">{meeting.mom_recorded_by}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openDetailsModalHandler(meeting)}
                  >
                    View MOM
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredMeetings.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* MOM Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Minutes of Meeting</DialogTitle>
        <DialogContent>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Typography><strong>Site:</strong> {selectedMeeting.site_name}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedMeeting.mom_issue_date).toLocaleDateString()}</Typography>
                <Typography><strong>Time:</strong> {selectedMeeting.time}</Typography>
                <Typography><strong>Chairman:</strong> {selectedMeeting.chairman_name}</Typography>
                <Typography><strong>Recorded By:</strong> {selectedMeeting.mom_recorded_by}</Typography>
              </div>
              
              {/* HSE Performance Data */}
              {renderSectionTable("HSE Performance Data", selectedMeeting.hse_performance_data, [
                "Parameter", "Month", "Year to Date"
              ])}
              
              {/* Incident Investigation */}
              {renderSectionTable("Incident Investigation", selectedMeeting.incident_investigation, [
                "Action Item", "Responsibility", "Target Date"
              ])}
              
              {/* Safety Training */}
              {renderSectionTable("Safety Training", selectedMeeting.safety_training, [
                "Topics", "Conducted By", "Participations"
              ])}
              
              {/* Internal Audit */}
              {renderSectionTable("Internal Audit", selectedMeeting.internal_audit, [
                "Action Item", "Responsibility", "Target Date"
              ])}
              
              {/* Mock Drill */}
              {renderSectionTable("Mock Drill", selectedMeeting.mock_drill, [
                "Action Item", "Responsibility", "Target Date"
              ])}
              
              {/* Procedure Checklist Update */}
              {renderSectionTable("Procedure & Checklist Update", selectedMeeting.procedure_checklist_update, [
                "Description", "Procedure", "Checklist"
              ])}
              
              {/* Review of Last Meeting */}
              {renderSectionTable("Review of Last Meeting", selectedMeeting.review_last_meeting, [
                "Topic", "Action By", "Target Date", "Review Status"
              ])}
              
              {/* New Points Discussed */}
              {renderSectionTable("New Points Discussed", selectedMeeting.new_points_discussed, [
                "Topic", "Action By", "Target Date", "Remarks"
              ])}
              
              {/* Signatures */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-3 border rounded">
                  <Typography><strong>Minutes Prepared By:</strong> {selectedMeeting.minutes_prepared_by}</Typography>
                  <Typography className="mt-2"><strong>Signature:</strong></Typography>
                  {selectedMeeting.signature_prepared_by ? (
                    <ImageViewer
                      src={selectedMeeting.signature_prepared_by}
                      alt="Preparer's Signature"
                    />
                  ) : (
                    <Typography variant="body2">No signature available</Typography>
                  )}
                </div>
                
                <div className="p-3 border rounded">
                  <Typography><strong>Chairman:</strong> {selectedMeeting.chairman_name}</Typography>
                  <Typography className="mt-2"><strong>Signature:</strong></Typography>
                  {selectedMeeting.signature_chairman ? (
                    <ImageViewer
                      src={selectedMeeting.signature_chairman}
                      alt="Chairman's Signature"
                    />
                  ) : (
                    <Typography variant="body2">No signature available</Typography>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CreateHSEMeetingMinutes
        open={openCreateDialog}
        setOpen={setCreateDialog}
      />
    </div>
  );
}

export default SafetyMeeting;