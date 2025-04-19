import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from '@mui/material';
import SuggestionFormDialog from '../../../components/pages/hse/suggestion-form/CreateSuggestion';
import { useGetSuggestionSchemeReportsQuery } from '../../../api/hse/suggestionScheme/suggestionSchemeReportApi ';
import { useParams } from 'react-router-dom';

const ImageViewer = ({ src, alt, width = 100, height = 30 }) => {
  const [open, setOpen] = useState(false);
 
  return (
    <>
      <img
        src={`${import.meta.env.VITE_API_KEY}${src}`}
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
            src={`${import.meta.env.VITE_API_KEY}${src}`}
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

function SuggestionScheme() {
  const { locationId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openEvaluationModal, setOpenEvaluationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createSuggestion, setCreateSuggestion] = useState(false);
 
  const skipQuery = !locationId || isNaN(parseInt(locationId));
  const { data, isLoading, error, refetch } = useGetSuggestionSchemeReportsQuery(
    parseInt(locationId), 
    { skip: skipQuery }
  );
  
  // Get suggestions from API response
  const suggestions = data?.data || [];

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.site?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.suggestion_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (suggestion, modalType) => {
    setSelectedSuggestion(suggestion);
    switch(modalType) {
      case 'details':
        setOpenDetailsModal(true);
        break;
      case 'evaluation':
        setOpenEvaluationModal(true);
        break;
    }
  };

  const closeModal = (modalType) => {
    switch(modalType) {
      case 'details':
        setOpenDetailsModal(false);
        break;
      case 'evaluation':
        setOpenEvaluationModal(false);
        break;
    }
    setSelectedSuggestion(null);
  };

  const currentRows = filteredSuggestions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-600 p-8">Error: {error.message}</div>;
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Suggestion Scheme</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Site, Name, or Suggestion"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateSuggestion(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Submit New Suggestion
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Submitted By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((suggestion) => (
              <TableRow key={suggestion.id}>
                <TableCell align="center">{suggestion.id}</TableCell>
                <TableCell align="center">{suggestion.site}</TableCell>
                <TableCell align="center">{suggestion.date}</TableCell>
                <TableCell align="center">{suggestion.name} ({suggestion.designation})</TableCell>
                <TableCell align="center">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => openModal(suggestion, 'details')}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="small"
                      onClick={() => openModal(suggestion, 'evaluation')}
                    >
                      Evaluation
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
        count={filteredSuggestions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Details Modal */}
      <Dialog 
        open={openDetailsModal} 
        onClose={() => closeModal('details')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Suggestion Details</DialogTitle>
        <DialogContent>
          {selectedSuggestion && (
            <div className="flex flex-col gap-4 p-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Typography><strong>Suggestion ID:</strong> {selectedSuggestion.id}</Typography>
                  <Typography><strong>Site:</strong> {selectedSuggestion.site}</Typography>
                  <Typography><strong>Submission Date:</strong> {selectedSuggestion.date}</Typography>
                  <Typography><strong>Location ID:</strong> {selectedSuggestion.location}</Typography>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Submitter Information</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Typography><strong>Name:</strong> {selectedSuggestion.name}</Typography>
                  <Typography><strong>Designation:</strong> {selectedSuggestion.designation}</Typography>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Suggestion</Typography>
                <Typography><strong>Description:</strong></Typography>
                <Typography paragraph>{selectedSuggestion.suggestion_description}</Typography>
                <Typography><strong>Expected Benefits:</strong></Typography>
                <Typography paragraph>{selectedSuggestion.benefits_upon_implementation}</Typography>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Evaluation Modal */}
      <Dialog 
        open={openEvaluationModal} 
        onClose={() => closeModal('evaluation')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Suggestion Evaluation</DialogTitle>
        <DialogContent>
          {selectedSuggestion && (
            <div className="flex flex-col gap-4 p-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Evaluator Information</Typography>
                <Typography><strong>Evaluated By:</strong> {selectedSuggestion.evaluated_by}</Typography>
                <Typography><strong>Name:</strong> {selectedSuggestion.evaluator_name}</Typography>
                <Typography><strong>Designation:</strong> {selectedSuggestion.evaluator_designation}</Typography>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Evaluation Comments</Typography>
                <Typography paragraph>{selectedSuggestion.evaluation_remarks}</Typography>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Signature</Typography>
                {selectedSuggestion.evaluator_signature && (
                  <ImageViewer 
                    src={selectedSuggestion.evaluator_signature} 
                    alt="Evaluator Signature" 
                    width={200} 
                    height={80}
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Suggestion Dialog */}
      <SuggestionFormDialog
        open={createSuggestion}
        setOpen={setCreateSuggestion}
        onSuccess={refetch}
      />
    </div>
  );
}

export default SuggestionScheme;