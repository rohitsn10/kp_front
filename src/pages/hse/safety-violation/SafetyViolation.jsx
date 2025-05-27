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
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import CreateSafetyViolation from '../../../components/pages/hse/safetyViolation/CreateSafetyViolation';
import { useGetSafetyViolationReportQuery } from '../../../api/hse/safetyViolation/safetyViolatioApi';
import { useParams } from 'react-router-dom';

const SafetyViolation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [createDialog, setCreateDialog] = useState(false);
  const { locationId } = useParams();
  
  const skipQuery = !locationId || isNaN(parseInt(locationId));
  const { data, isLoading, error, refetch } = useGetSafetyViolationReportQuery(
    parseInt(locationId), 
    { skip: skipQuery }
  );
  
  const safetyViolations = data?.data || [];

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = safetyViolations.filter((violation) =>
    violation.site_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewFullDetails = (violation) => {
    setSelectedViolation(violation);
    setOpenDetailDialog(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const DetailRow = ({ label, value, fullWidth = false }) => (
    <Grid item xs={fullWidth ? 12 : 6}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
          {label}:
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
          {value || 'N/A'}
        </Typography>
      </Box>
    </Grid>
  );

  const SignatureSection = ({ title, name, designation, department, signPath }) => (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f9f9f9' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#29346B', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <DetailRow label="Name" value={name} />
        <DetailRow label="Designation" value={designation} />
        <DetailRow label="Department" value={department} />
        {signPath && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Signature:
            </Typography>
            <img 
              src={signPath} 
              alt={`${title} Signature`} 
              style={{ maxWidth: '150px', maxHeight: '75px', border: '1px solid #ddd' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );

  if (isLoading) {
    return (
      <div className="text-center my-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" className="my-10">
        Failed to load safety violation reports.
      </Typography>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center">Safety Violations</h2>

      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Site Name"
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '300px' }}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => setCreateDialog(true)}
            variant="contained"
            style={{
              backgroundColor: '#FF8C00',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            Add Safety Violation
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No</TableCell>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Violator</TableCell>
              <TableCell align="center">Contractors</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((violation, index) => (
              <TableRow key={violation.id}>
                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="center">{violation.site_name}</TableCell>
                <TableCell align="center">
                  {new Date(violation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">{violation.issued_to_violator_name || 'N/A'}</TableCell>
                <TableCell align="center">{violation.contractors_name || 'N/A'}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleViewFullDetails(violation)}
                    sx={{ textTransform: 'none' }}
                  >
                    View Full Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Enhanced Detail Modal */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white', textAlign: 'center' }}>
          <Typography variant="h5" component="div">
            Safety Violation Report - #{selectedViolation?.id}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedViolation && (
            <Box>
              {/* Basic Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#29346B', fontWeight: 'bold' }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <DetailRow label="Site Name" value={selectedViolation.site_name} />
                  <DetailRow label="Contractors Name" value={selectedViolation.contractors_name} />
                  <DetailRow label="Created Date" value={formatDate(selectedViolation.created_at)} />
                  <DetailRow label="Updated Date" value={formatDate(selectedViolation.updated_at)} />
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Violation Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#29346B', fontWeight: 'bold' }}>
                  Violation Details
                </Typography>
                <Grid container spacing={2}>
                  <DetailRow 
                    label="Description of Safety Violation" 
                    value={selectedViolation.description_safety_violation} 
                    fullWidth 
                  />
                  <DetailRow 
                    label="Action Taken" 
                    value={selectedViolation.action_taken} 
                    fullWidth 
                  />
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Issued To (Violator) Information */}
              <SignatureSection
                title="Issued To (Violator)"
                name={selectedViolation.issued_to_violator_name}
                designation={selectedViolation.issued_to_designation}
                department={selectedViolation.issued_to_department}
                signPath={selectedViolation.issued_to_sign}
              />

              {/* Issued By Information */}
              <SignatureSection
                title="Issued By"
                name={selectedViolation.issued_by_name}
                designation={selectedViolation.issued_by_designation}
                department={selectedViolation.issued_by_department}
                signPath={selectedViolation.issued_by_sign}
              />

              {/* HSEO Information */}
              <SignatureSection
                title="HSEO (Health, Safety, Environment Officer)"
                name={selectedViolation.hseo_name}
                designation="HSEO"
                department="Health & Safety"
                signPath={selectedViolation.hseo_sign}
              />

              {/* Site Incharge Information */}
              <SignatureSection
                title="Site Incharge"
                name={selectedViolation.site_incharge_name}
                designation="Site Incharge"
                department="Operations"
                signPath={selectedViolation.site_incharge_sign}
              />

              {/* Manager Information */}
              <SignatureSection
                title="Manager"
                name={selectedViolation.manager_name}
                designation="Manager"
                department="Management"
                signPath={selectedViolation.manager_sign}
              />

              {/* Status Indicator */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Chip 
                  label="Active Violation Report" 
                  color="error" 
                  variant="outlined"
                  sx={{ fontSize: '16px', p: 2 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={() => setOpenDetailDialog(false)} 
            variant="contained"
            sx={{ 
              bgcolor: '#29346B', 
              '&:hover': { bgcolor: '#1e2555' },
              px: 4,
              py: 1,
              textTransform: 'none'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <CreateSafetyViolation open={createDialog} setOpen={setCreateDialog} onSuccess={refetch}/>
    </div>
  );
};

export default SafetyViolation;