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

function InductionTraining() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [openTopicsModal, setOpenTopicsModal] = useState(false);
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false);

  const dummyInduction = [
    {
      "site": "Training Facility A",
      "date": "2025-03-27",
      "faculty_name": "Dr. Jane Smith",
      "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
      "topic": "Workplace Safety and Hazard Prevention",
      "topics_discussed": [
        "Site/Plant familiarization",
        "Company Policy and Objectives",
        "Standard operating procedures / Checklists",
        "Use of fire-fighting equipment",
        "Displayed Emergency Contact Details"
      ],
      "participants": [
        {
          "name": "John Doe",
          "designation": "Safety Officer",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
        },
        {
          "name": "David Martinez",
          "designation": "Operations Manager",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
        },
        {
          "name": "Sophia Wilson",
          "designation": "HR Coordinator",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
        },
        {
          "name": "James Anderson",
          "designation": "Logistics Officer",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
        },
        {
          "name": "Olivia Taylor",
          "designation": "Quality Assurance Specialist",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
        },
        {
          "name": "William Harris",
          "designation": "Field Technician",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
        }
        // ... other participants
      ],
      "remarks": "Training session was well received. Participants engaged actively and provided positive feedback."
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
  const filteredTrainings = dummyInduction.filter((training) =>
    training.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredTrainings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openTopicsModalHandler = (training) => {
    setSelectedTraining(training);
    setOpenTopicsModal(true);
  };

  const openParticipantsModalHandler = (training) => {
    setSelectedTraining(training);
    setOpenParticipantsModal(true);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Induction Training Records</h2>
      <div className="flex flex-row  flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">

      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by Site, Topic, or Faculty"
        variant="outlined"
      />
              <Button
                variant="contained"
                style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
              >
                Add Induction Training
              </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Topic</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Faculty Name</TableCell>
              <TableCell align="center">Faculty Signature</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((training) => (
              <TableRow key={training.site}>
                <TableCell align="center">{training.site}</TableCell>
                <TableCell align="center">{training.topic}</TableCell>
                <TableCell align="center">{training.date}</TableCell>
                <TableCell align="center">{training.faculty_name}</TableCell>
                <TableCell align="center">
                  <ImageViewer 
                    src={training.signature} 
                    alt={`${training.faculty_name} Signature`} 
                  />
                </TableCell>
                <TableCell align="center">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => openTopicsModalHandler(training)}
                    >
                      View Topics
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => openParticipantsModalHandler(training)}
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
        count={filteredTrainings.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Topics Discussed Modal */}
      <Dialog 
        open={openTopicsModal} 
        onClose={() => setOpenTopicsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Topics Discussed</DialogTitle>
        <DialogContent>
          {selectedTraining && (
            <>
              <Typography variant="h6" gutterBottom>
                Main Topic: {selectedTraining.topic}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Detailed Topics:
              </Typography>
              {selectedTraining.topics_discussed.map((topic, index) => (
                <Typography key={index} variant="body1" gutterBottom>
                  • {topic}
                </Typography>
              ))}
              {selectedTraining.remarks && (
                <>
                  <Typography variant="subtitle1" gutterBottom className="mt-4">
                    Remarks:
                  </Typography>
                  <Typography variant="body1">
                    {selectedTraining.remarks}
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
          {selectedTraining && selectedTraining.participants.map((participant, index) => (
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
    </div>
  );
}

export default InductionTraining;