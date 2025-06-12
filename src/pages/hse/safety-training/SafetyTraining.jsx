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
import { Download, PictureAsPdf } from "@mui/icons-material";
import TrainingAttendanceDialog from "../../../components/pages/hse/safety-training/CreateSafetyTraining";
import { useGetSafetyTrainingAttendanceQuery } from "../../../api/hse/safetyTraining/safetyTrainingApi";
import { useParams } from "react-router-dom";

const PDFViewer = ({ src, fileName, width = 120, height = 35 }) => {
  const handleDownload = () => {
    const fullUrl = `${import.meta.env.VITE_API_KEY}${src}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName || 'signature.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Truncate filename if too long
  const truncateFileName = (name, maxLength = 15) => {
    if (!name) return 'signature.pdf';
    const cleanName = name.replace(/\.[^/.]+$/, ""); // Remove extension
    if (cleanName.length <= maxLength) return name;
    return cleanName.substring(0, maxLength) + '...pdf';
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "4px 8px",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
        width: `${width}px`,
        height: `${height}px`,
        justifyContent: "center",
        overflow: "hidden",
      }}
      onClick={handleDownload}
      title={fileName || 'signature.pdf'} // Show full name on hover
    >
      <PictureAsPdf color="error" fontSize="small" />
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '80px'
        }}
      >
        {truncateFileName(fileName)}
      </Typography>
    </Box>
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

    const fullUrl = `${import.meta.env.VITE_API_KEY}${fileUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    const fileName = fileUrl.split('/').pop() || `attendance_${siteName}_${date}.docx`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle signature download
  const handleDownloadSignature = (signatureUrl, facultyName) => {
    if (!signatureUrl) {
      alert("No signature file available for download");
      return;
    }

    const fullUrl = `${import.meta.env.VITE_API_KEY}${signatureUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    const fileName = signatureUrl.split('/').pop() || `signature_${facultyName?.replace(/\s+/g, '_')}.pdf`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to check if file is PDF
  const isPDF = (fileUrl) => {
    return fileUrl && (fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.toLowerCase().includes('.pdf'));
  };

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
              {/* <TableCell align="center">Faculty Signature</TableCell> */}
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
                {/* <TableCell align="center">
                  {training.faculty_signature ? (
                    <PDFViewer
                      src={training.faculty_signature}
                      fileName={`signature_${training.faculty_name?.replace(/\s+/g, '_')}.pdf`}
                    />
                  ) : (
                    "No Signature"
                  )}
                </TableCell> */}
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
                  <Typography sx={{ mb: 2 }}>
                    <strong>Faculty Signature:</strong>
                  </Typography>
                  {selectedTraining.faculty_signature ? (
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', p: 2, display: 'inline-block' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            padding: "8px 16px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            backgroundColor: "#f5f5f5",
                            minWidth: "200px",
                            maxWidth: "250px",
                          }}
                        >
                          <PictureAsPdf color="error" />
                          <Typography 
                            variant="body2"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              flex: 1
                            }}
                            title={selectedTraining.faculty_signature.split('/').pop() || 'signature.pdf'}
                          >
                            {selectedTraining.faculty_signature.split('/').pop() || 'signature.pdf'}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownloadSignature(
                            selectedTraining.faculty_signature,
                            selectedTraining.faculty_name
                          )}
                          startIcon={<Download />}
                          size="small"
                        >
                          Download Signature PDF
                        </Button>
                      </Box>
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
                {selectedTraining?.file_upload ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong>File:</strong> <p className="max-w-24">{selectedTraining.file_upload.split('/').pop()}</p>
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