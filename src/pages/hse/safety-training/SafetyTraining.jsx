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
  Box,
} from "@mui/material";
import { Download } from "@mui/icons-material"; // Add this import for download icon
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
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const { locationId } = useParams();
  const { data, isLoading, error } = useGetSafetyTrainingAttendanceQuery(
    locationId ? parseInt(locationId) : undefined
  );
  const [openCreateDialog, setCreateDialog] = useState(false);

  // Function to handle file download
  const handleDownloadAttendance = (fileUrl, siteName, date) => {
    if (!fileUrl) {
      alert("No attendance file available for download");
      return;
    }

    // Create full URL for download using VITE_API_KEY
    const fullUrl = `${import.meta.env.VITE_API_KEY}${fileUrl}`;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = fullUrl;
    
    // Extract filename from URL or create a meaningful name
    const fileName = fileUrl.split('/').pop() || `attendance_${siteName}_${date}.docx`;
    link.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const filteredTrainings = data?.data
    ? data.data.filter(
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

  const openDetailsModalHandler = (training) => {
    setSelectedTraining(training);
    setOpenDetailsModal(true);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">
        Safety Training Records
      </h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
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
              <TableRow key={training.id || index}>
                <TableCell align="center">{training.site_name}</TableCell>
                <TableCell align="center">{training.training_topic}</TableCell>
                <TableCell align="center">{training.date}</TableCell>
                <TableCell align="center">
                  {training.faculty_name || "N/A"}
                </TableCell>
                <TableCell align="center">
                  {training.faculty_signature ? (
                    <ImageViewer
                      src={`${import.meta.env.VITE_API_KEY}${training.faculty_signature}`}
                      alt={`${training.faculty_name || "Faculty"} Signature`}
                    />
                  ) : (
                    "No Signature"
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openDetailsModalHandler(training)}
                      size="small"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleDownloadAttendance(
                        training.file_upload, 
                        training.site_name, 
                        training.date
                      )}
                      size="small"
                      startIcon={<Download />}
                      disabled={!training.file_upload}
                    >
                      Download Attendance
                    </Button>
                  </Box>
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

      {/* Training Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#29346B", color: "white", textAlign: "center" }}>
          Safety Training Details
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          {selectedTraining && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#29346B', mb: 1 }}>
                    Basic Information
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Site Name:</strong> {selectedTraining.site_name || "N/A"}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Location ID:</strong> {selectedTraining.location || "N/A"}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Training Date:</strong> {selectedTraining.date || "N/A"}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Training Topic:</strong> {selectedTraining.training_topic || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#29346B', mb: 1 }}>
                    Faculty Information
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Faculty Name:</strong> {selectedTraining.faculty_name || "Not Assigned"}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Faculty Signature:</strong>
                  </Typography>
                  {selectedTraining.faculty_signature ? (
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', p: 1, display: 'inline-block' }}>
                      <ImageViewer
                        src={`${import.meta.env.VITE_API_KEY}${selectedTraining.faculty_signature}`}
                        alt="Faculty Signature"
                        width={150}
                        height={50}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
                      No signature available
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#29346B', mb: 1 }}>
                  Additional Details
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Remarks:</strong> {selectedTraining.remarks || "No remarks"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Created At:</strong> {new Date(selectedTraining.created_at).toLocaleString() || "N/A"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Training ID:</strong> {selectedTraining.id || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#29346B', mb: 1 }}>
                  Attendance File
                </Typography>
                {selectedTraining.file_upload ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography>
                      <strong>File:</strong> {selectedTraining.file_upload.split('/').pop()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleDownloadAttendance(
                        selectedTraining.file_upload, 
                        selectedTraining.site_name, 
                        selectedTraining.date
                      )}
                      startIcon={<Download />}
                      size="small"
                    >
                      Download
                    </Button>
                  </Box>
                ) : (
                  <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
                    No attendance file available
                  </Typography>
                )}
              </Box>
            </Box>
          )}
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