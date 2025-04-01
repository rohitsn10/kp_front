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
import ToolboxAttendanceDialog from '../../../components/pages/hse/toolbox-talks';

function ToolboxTalk() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToolboxTalk, setSelectedToolboxTalk] = useState(null);
  const [openPointsModal, setOpenPointsModal] = useState(false);
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
  const [openCreateDialog,setCreateDialog] =useState(false);

  const dummyToolboxData = [{
    "site": "Construction Site B",
    "date": "2025-03-27",
    "time": "10:00 AM",
    "tbt_permit_no": "TBT-2025-0012",
    "permit_date": "2025-03-26",
    "tbt_conducted_by": "Mark Robinson",
    "contractor_name": "ABC Constructions Ltd.",
    "points_discussed": {
      "use_of_ppe": "Yes",
      "use_of_tools": "Yes",
      "hazards_at_workplace": "Yes",
      "action_in_emergency": "Yes",
      "health_status": "Yes",
      "custom_points": "No"
    },
    "job_activity_details": "Installation of scaffolding for structural reinforcement.",
    "participants": [
      {
        "name": "John Doe",
        "designation": "Safety Officer",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      },
      {
        "name": "Alice Johnson",
        "designation": "Project Manager",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      },
      {
        "name": "Robert Smith",
        "designation": "Engineer",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      },
    ],
    "remarks": "The toolbox talk was successfully conducted. All participants acknowledged the safety measures and actively engaged in discussions."
  }];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredToolboxTalks = dummyToolboxData.filter((talk) =>
    talk.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talk.tbt_conducted_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talk.tbt_permit_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        onClick={()=>setCreateDialog(true)}
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
            {currentRows.map((talk) => (
              <TableRow key={talk.tbt_permit_no}>
                <TableCell align="center">{talk.site}</TableCell>
                <TableCell align="center">{talk.permit_date}</TableCell>
                <TableCell align="center">{talk.tbt_conducted_by}</TableCell>
                <TableCell align="center">{talk.tbt_permit_no}</TableCell>
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
            ))}
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
                Job Activity: {selectedToolboxTalk.job_activity_details}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Detailed Points:
              </Typography>
              {Object.entries(selectedToolboxTalk.points_discussed).map(([key, value]) => (
                <Typography key={key} variant="body1" gutterBottom>
                  • {key.replace(/_/g, ' ').toUpperCase()}: {value}
                </Typography>
              ))}
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
          {selectedToolboxTalk && selectedToolboxTalk.participants.map((participant, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <Typography><strong>Name:</strong> {participant.name}</Typography>
              <Typography><strong>Designation:</strong> {participant.designation}</Typography>
              <Typography><strong>Signature:</strong></Typography>
              <ImageViewer 
                src={participant.signature} 
                alt={`${participant.name} Signature`} 
              />
            </div>
          ))}
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