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

function SuggestionScheme() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openEvaluationModal, setOpenEvaluationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createSuggestion, setCreateSuggestion] = useState(false);

  const dummySuggestions = [
    {
      "id": "SUG-2025-001",
      "site": "Construction Site B",
      "date": "2025-04-01",
      "name": "John Doe",
      "designation": "Safety Officer",
      "department": "Health & Safety",
      "description_of_suggestion": "Implement a new safety barrier system around excavation sites to prevent unauthorized access.",
      "benefits_upon_implementation": "Reduces risk of accidents, improves compliance with safety regulations, and enhances site security.",
      "evaluation": {
        "status": "Approved",
        "evaluated_by": "Jane Smith",
        "name": "Jane Smith",
        "designation": "Site Manager",
        "date": "2025-04-03",
        "comments": "This suggestion aligns with our goal to improve site safety. Implementation to begin immediately.",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "id": "SUG-2025-002",
      "site": "Industrial Park C",
      "date": "2025-03-28",
      "name": "Sarah Johnson",
      "designation": "Process Engineer",
      "department": "Engineering",
      "description_of_suggestion": "Modify equipment startup procedures to include a mandatory 5-minute warm-up period to reduce mechanical stress.",
      "benefits_upon_implementation": "Extended equipment lifespan, decreased maintenance costs, and reduced risk of critical failures during operation.",
      "evaluation": {
        "status": "Under Review",
        "evaluated_by": "Michael Brown",
        "name": "Michael Brown",
        "designation": "Maintenance Manager",
        "date": "2025-04-01",
        "comments": "Currently testing the procedure on select equipment to verify benefits before full implementation.",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "id": "SUG-2025-003",
      "site": "Warehouse Facility D",
      "date": "2025-03-25",
      "name": "Robert Wilson",
      "designation": "Logistics Coordinator",
      "department": "Supply Chain",
      "description_of_suggestion": "Reorganize storage layout to group frequently accessed items closer to shipping areas.",
      "benefits_upon_implementation": "20% reduction in material handling time, improved worker efficiency, and decreased risk of handling injuries.",
      "evaluation": {
        "status": "Approved",
        "evaluated_by": "Emily Clark",
        "name": "Emily Clark",
        "designation": "Operations Director",
        "date": "2025-03-30",
        "comments": "Cost-benefit analysis confirms significant ROI. Implementation scheduled for next month.",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "id": "SUG-2025-004",
      "site": "Manufacturing Plant E",
      "date": "2025-04-02",
      "name": "Thomas Martinez",
      "designation": "Production Supervisor",
      "department": "Manufacturing",
      "description_of_suggestion": "Install LED indicators on assembly stations to provide real-time quality check status.",
      "benefits_upon_implementation": "Reduction in defect rate by an estimated 15%, improved quality control tracking, and enhanced operator awareness.",
      "evaluation": {
        "status": "Rejected",
        "evaluated_by": "Patricia Adams",
        "name": "Patricia Adams",
        "designation": "Quality Manager",
        "date": "2025-04-05",
        "comments": "Current digital monitoring system provides more comprehensive data. Not cost-effective to implement parallel visual system.",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
  ];

  const filteredSuggestions = dummySuggestions.filter((suggestion) =>
    suggestion.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.description_of_suggestion.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return '#4CAF50'; // Green
      case 'Rejected':
        return '#F44336'; // Red
      case 'Under Review':
        return '#2196F3'; // Blue
      case 'Approved with Modifications':
        return '#FF9800'; // Orange
      default:
        return '#757575'; // Grey
    }
  };

  const currentRows = filteredSuggestions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
              <TableCell align="center">Status</TableCell>
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
                  <span style={{ 
                    backgroundColor: getStatusColor(suggestion.evaluation.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    {suggestion.evaluation.status}
                  </span>
                </TableCell>
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
                  <Typography><strong>Department:</strong> {selectedSuggestion.department}</Typography>
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
                <Typography paragraph>{selectedSuggestion.description_of_suggestion}</Typography>
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
                <Typography variant="h6" gutterBottom>Evaluation Status</Typography>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ 
                    backgroundColor: getStatusColor(selectedSuggestion.evaluation.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    {selectedSuggestion.evaluation.status}
                  </div>
                </div>
                <Typography><strong>Evaluation Date:</strong> {selectedSuggestion.evaluation.date}</Typography>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Evaluator Information</Typography>
                <Typography><strong>Name:</strong> {selectedSuggestion.evaluation.name}</Typography>
                <Typography><strong>Designation:</strong> {selectedSuggestion.evaluation.designation}</Typography>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Evaluation Comments</Typography>
                <Typography paragraph>{selectedSuggestion.evaluation.comments}</Typography>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <Typography variant="h6" gutterBottom>Signature</Typography>
                <img src={selectedSuggestion.evaluation.signature} alt="Evaluator Signature" style={{ maxWidth: '100%' }} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Suggestion Dialog - Not implemented but would go here */}
      <SuggestionFormDialog
        open={createSuggestion}
        setOpen={setCreateSuggestion}
      />
    </div>
  );
}

export default SuggestionScheme;