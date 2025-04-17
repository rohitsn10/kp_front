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
  Box,
  CircularProgress
} from '@mui/material';
import { 
  Download as DownloadIcon 
} from '@mui/icons-material';
import ImageViewer from '../../../utils/signatureViewer';
import TrainingInductionDialog from '../../../components/pages/hse/induction-training/CreateTrainingInduction';
import { useGetInductionTrainingsQuery } from '../../../api/hse/induction/inductionApi';
import { useParams } from 'react-router-dom';

function InductionTraining() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [openTopicsModal, setOpenTopicsModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  const { locationId } = useParams();
  
  // Use the updated query hook with locationId parameter
  const { data: inductionTrainingsResponse, isLoading, error } = useGetInductionTrainingsQuery(
    locationId ? parseInt(locationId) : undefined
  );
  const inductionTrainings = inductionTrainingsResponse?.data || [];

  const topicLabels = [
    "1. Site/Plant familiarization.",
    "2. Company Policy and Objectives.",
    "3. Standard operating procedures /Checklists.",
    "4. Use of fire-fighting equipment.",
    "5. Displayed Emergency Contact Details.",
    "6. Assemble Point.",
    "7. Mandatory PPEs.",
    "8. Restricted Area.",
    "9. Location of Drinking Water & Wash Room.",
    "10. No Alcohol Consumption inside Plant/Site.",
    "11. Smoking Zone.",
    "12. Speed Limit.",
    "13. Display ID Card.",
    "14. Other"
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredTrainings = inductionTrainings.filter((training) =>
    training.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.training_topics.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Function to handle file download
  const handleDownloadFile = (filePath) => {
    // Create a link with the file path
    const link = document.createElement('a');
    link.href = filePath;
    link.target = '_blank';
    link.download = filePath.split('/').pop(); // Extract filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare topics array for display
  const getTopicsArray = (training) => {
    if (!training) return [];
    
    const topics = [];
    for (let i = 1; i <= 14; i++) {
      const topicKey = `topic_${i}`;
      if (training[topicKey] && training[topicKey].trim() !== '') {
        topics.push(training[topicKey]);
      }
    }
    return topics;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography color="error">Error loading data. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Induction Training Records</h2>
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
              <TableRow key={training.id}>
                <TableCell align="center">{training.site_name}</TableCell>
                <TableCell align="center">{training.training_topics}</TableCell>
                <TableCell align="center">{training.date}</TableCell>
                <TableCell align="center">{training.faculty_name}</TableCell>
                <TableCell align="center">
                  <ImageViewer 
                    src={`${import.meta.env.VITE_API_KEY}${training.faculty_signature}`}
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
                      onClick={() => handleDownloadFile(training.participants_file)}
                      startIcon={<DownloadIcon />}
                    >
                      Download Participants
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
                Main Topic: {selectedTraining.training_topics}
              </Typography>
              <Typography variant="subtitle1" gutterBottom mb={2}>
                Detailed Topics:
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: 1.5,
                mb: 2 
              }}>
                {topicLabels.map((label, index) => {
                  const topicKey = `topic_${index + 1}`;
                  const topicContent = selectedTraining[topicKey] || '';
                  
                  return (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        borderBottom: '1px solid #e0e0e0',
                        pb: 1 
                      }}
                    >
                      <Typography variant="body1" component="span" fontWeight="bold" width="50%" pr={2}>
                        {label}
                      </Typography>
                      <Typography variant="body1" component="span" width="50%">
                        {topicContent}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Training Dialog */}
      <TrainingInductionDialog
        open={openCreateDialog}
        setOpen={setCreateDialog}
      />
    </div>
  );
}

export default InductionTraining;