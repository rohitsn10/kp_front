import React, { useState } from "react";
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
} from "@mui/material";
import TrainingAttendanceDialog from "../../../components/pages/hse/safety-training/CreateSafetyTraining";
import { useGetSafetyTrainingAttendanceQuery } from "../../../api/hse/safetyTraining/safetyTrainingApi";
import { useParams } from "react-router-dom";
const ImageViewer = ({ src, alt, width = 100, height = 30 }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: "pointer",
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
            src={src}
            alt={alt}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

function SafetyTraining() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
  const{locationId} = useParams();
  const { data, isLoading, error } = useGetSafetyTrainingAttendanceQuery(locationId ? parseInt(locationId) : undefined);
  const [openCreateDialog, setCreateDialog] = useState(false);
  const dummySafetyData = [
    {
      site: "Training Facility A",
      date: "2025-03-27",
      faculty_name: "Dr. Jane Smith",
      signature: "https://dummyimage.com/150x50/000/fff.png&text=Signature",
      topic: "Workplace Safety and Hazard Prevention",
      participants: [
        {
          name: "John Doe",
          designation: "Safety Officer",
          signature: "https://dummyimage.com/150x50/000/fff.png&text=Signature",
        },
        {
          name: "Alice Johnson",
          designation: "Project Manager",
          signature: "https://dummyimage.com/150x50/000/fff.png&text=Signature",
        },
        {
          name: "Robert Smith",
          designation: "Engineer",
          signature: "https://dummyimage.com/150x50/000/fff.png&text=Signature",
        },
      ],
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTrainings = data
    ? [data].filter(
        (training) =>
          (training.site_name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (training.training_topic?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (training.faculty_name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      )
    : [];

  const currentRows = filteredTrainings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openParticipantsModalHandler = (training) => {
    setSelectedTraining(training);
    setOpenParticipantsModal(true);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">
        Safety Training Records
      </h2>
      <div className="flex flex-row  flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site, Topic, or Faculty"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateDialog(true)}
          variant="contained"
          style={{
            backgroundColor: "#FF8C00",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            minHeight: "auto",
          }}
        >
          Add Safety Training
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Topic</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Faculty Name</TableCell>
              <TableCell align="center">Faculty Signature</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((training, index) => (
              <TableRow key={index}>
                <TableCell align="center">{training.site_name}</TableCell>
                <TableCell align="center">{training.training_topic}</TableCell>
                <TableCell align="center">{training.date}</TableCell>
                <TableCell align="center">{training.faculty_name}</TableCell>
                <TableCell align="center">
                  <ImageViewer
                    src={`${import.meta.env.VITE_IMAGE_URL}/${
                      training.faculty_signature
                    }`}
                    alt={`${training.faculty_name} Signature`}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openParticipantsModalHandler(training)}
                  >
                    View Participants
                  </Button>
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
        style={{ borderTop: "1px solid #e0e0e0" }}
      />

      {/* Participants Modal */}
      <Dialog
        open={openParticipantsModal}
        onClose={() => setOpenParticipantsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Participants Details</DialogTitle>
        <DialogContent>
          {selectedTraining?.participants?.map((participant, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <Typography>
                <strong>Name:</strong> {participant.name}
              </Typography>
              <Typography>
                <strong>Designation:</strong> {participant.designation}
              </Typography>
              <Typography>
                <strong>Signature:</strong>
              </Typography>
              <ImageViewer
                src={participant.signature}
                alt={`${participant.name} Signature`}
              />
            </div>
          ))}
        </DialogContent>
      </Dialog>
      <TrainingAttendanceDialog
        open={openCreateDialog}
        setOpen={setCreateDialog}
      />
    </div>
  );
}

export default SafetyTraining;
