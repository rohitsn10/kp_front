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
import CreateAuditForm from '../../../components/pages/hse/internal-audit/CreateAuditForm';
import CorrectionForm from '../../../components/pages/hse/internal-audit/CorrectionForm';
import VerificationForm from '../../../components/pages/hse/internal-audit/VerificationForm';
import ClosureReportForm from '../../../components/pages/hse/internal-audit/ClosureReportForm';
import { useParams } from 'react-router-dom';
import { useGetInternalAuditReportsQuery } from '../../../api/hse/internalAudit/internalAuditReportApi ';

// Reusable Image Viewer Component
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
            src={src}
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

function InternalAuditReport() {
  const [page, setPage] = useState(0);
  const { locationId } = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [modalView, setModalView] = useState('observations'); // 'observations', 'correction', 'verification'
  const [createAudit, setCreateAudit] = useState(false);

  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  
  // Use the hook with skip option to prevent API call when locationId is missing
  const { 
    data: response, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetInternalAuditReportsQuery(parsedLocationId, {
    skip: parsedLocationId === null || isNaN(parsedLocationId)
  });

  // New state for the additional forms
  const [addCorrectionForm, setAddCorrectionForm] = useState(false);
  const [addVerificationForm, setAddVerificationForm] = useState(false);
  const [addClosureForm, setAddClosureForm] = useState(false);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get the actual data from the API response
  const audits = response?.data || [];

  // Filtering logic
  const filteredAudits = audits.filter((audit) =>
    audit.site_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredAudits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openAuditDetailsHandler = (audit, view) => {
    setSelectedAudit(audit);
    setModalView(view);
    setOpenDetailsModal(true);
  };

  // Handlers for opening the different forms with the selected audit ID
  const openCorrectionHandler = (audit) => {
    setSelectedAudit(audit);
    setAddCorrectionForm(true);
  };

  const openVerificationHandler = (audit) => {
    setSelectedAudit(audit);
    setAddVerificationForm(true);
  };

  const openClosureHandler = (audit) => {
    setSelectedAudit(audit);
    setAddClosureForm(true);
  };

  const renderModalContent = () => {
    if (!selectedAudit) return null;
  
    switch (modalView) {
      case 'observations':
        return (
          <>
            <DialogTitle>Audit Observations</DialogTitle>
            <DialogContent>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Observer Details:</strong> {selectedAudit.observer_details}</Typography>
                <Typography><strong>Observer Name:</strong> {selectedAudit.observer_name}</Typography>
                <Typography><strong>Observer Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.observer_sign}
                  alt="Observer Signature"
                />
                <Typography><strong>Auditee Name:</strong> {selectedAudit.auditee_name}</Typography>
                <Typography><strong>Auditee Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.auditee_sign}
                  alt="Auditee Signature"
                />
                <Typography><strong>Agreed Completion Date:</strong> {selectedAudit.agreed_completion_date}</Typography>
              </div>
            </DialogContent>
          </>
        );
      case 'correction':
        return (
          <>
            <DialogTitle>Correction Details</DialogTitle>
            <DialogContent>
              {selectedAudit.corrections && selectedAudit.corrections.length > 0 ? (
                <div className="mb-4 p-3 border rounded">
                  <Typography><strong>Root Cause:</strong> {selectedAudit.corrections[0].root_cause}</Typography>
                  <Typography><strong>Corrective Action:</strong> {selectedAudit.corrections[0].corrective_action}</Typography>
                  <Typography><strong>Auditee Name:</strong> {selectedAudit.corrections[0].correction_auditee_name}</Typography>
                  <Typography><strong>Date:</strong> {selectedAudit.corrections[0].correction_auditee_date}</Typography>
                  <Typography><strong>Auditee Signature:</strong></Typography>
                  <ImageViewer
                    src={selectedAudit.corrections[0].correction_auditee_sign}
                    alt="Correction Auditee Signature"
                  />
                </div>
              ) : (
                <Typography>Correction details are not available for this audit.</Typography>
              )}
            </DialogContent>
          </>
        );
      case 'verification':
        return (
          <>
            <DialogTitle>Verification of Corrective Action</DialogTitle>
            <DialogContent>
              {selectedAudit.verifications && selectedAudit.verifications.length > 0 ? (
                <div className="mb-4 p-3 border rounded">
                  <Typography><strong>Auditor Name:</strong> {selectedAudit.verifications[0].verification_auditor_name}</Typography>
                  <Typography><strong>Date:</strong> {selectedAudit.verifications[0].verification_auditor_date}</Typography>
                  <Typography><strong>Auditor Signature:</strong></Typography>
                  <ImageViewer
                    src={selectedAudit.verifications[0].verification_auditor_sign}
                    alt="Verification Auditor Signature"
                  />
                </div>
              ) : (
                <Typography>Verification details are not available for this audit.</Typography>
              )}
            </DialogContent>
          </>
        );
      case 'closure':
        return (
          <>
            <DialogTitle>Closure Report</DialogTitle>
            <DialogContent>
              {selectedAudit.closures && selectedAudit.closures.length > 0 ? (
                <div className="mb-4 p-3 border rounded">
                  <Typography><strong>Closure Report:</strong> {selectedAudit.closures[0].report_closure}</Typography>
                  <Typography><strong>Site Incharge Name:</strong> {selectedAudit.closures[0].siteincharge_name}</Typography>
                  <Typography><strong>Date:</strong> {selectedAudit.closures[0].siteincharge_date}</Typography>
                  <Typography><strong>Site Incharge Signature:</strong></Typography>
                  <ImageViewer
                    src={selectedAudit.closures[0].siteincharge_sign}
                    alt="Site Incharge Signature"
                  />
                </div>
              ) : (
                <Typography>Closure details are not available for this audit.</Typography>
              )}
            </DialogContent>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading audit reports...</div>;
  }

  if (isError) {
    return <div className="text-center p-4 text-red-500">Error loading audit reports: {error?.message || 'Unknown error'}</div>;
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Internal Audit Reports</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateAudit(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Add New Audit
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Agreed Completion Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">View Details</TableCell>
              <TableCell align="center">Add Information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell align="center">{audit.site_name}</TableCell>
                <TableCell align="center">{audit.date}</TableCell>
                <TableCell align="center">{audit.agreed_completion_date}</TableCell>
                <TableCell align="center">
                  {audit.is_closure_done ? "Closed" : 
                   audit.is_verification_done ? "Verified" : 
                   audit.is_correction_done ? "Corrected" : "Open"}
                </TableCell>
                {/* <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openAuditDetailsHandler(audit, 'observations')}
                    >
                      Observations
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => openAuditDetailsHandler(audit, 'correction')}
                      disabled={!audit.is_correction_done}
                    >
                      Correction
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => openAuditDetailsHandler(audit, 'verification')}
                      disabled={!audit.is_verification_done}
                    >
                      Verification
                    </Button>
                  </div>
                </TableCell> */}
                <TableCell align="center">
  <div className="flex justify-center gap-2">
    <Button
      variant="contained"
      size="small"
      onClick={() => openAuditDetailsHandler(audit, 'observations')}
    >
      Observations
    </Button>
    <Button
      variant="contained"
      size="small"
      color="secondary"
      onClick={() => openAuditDetailsHandler(audit, 'correction')}
      disabled={!audit.is_correction_done}
    >
      Correction
    </Button>
    <Button
      variant="contained"
      size="small"
      color="success"
      onClick={() => openAuditDetailsHandler(audit, 'verification')}
      disabled={!audit.is_verification_done}
    >
      Verification
    </Button>
    <Button
      variant="contained"
      size="small"
      color="info"
      onClick={() => openAuditDetailsHandler(audit, 'closure')}
      disabled={!audit.is_closure_done}
    >
      Closure
    </Button>
  </div>
</TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => openCorrectionHandler(audit)}
                      disabled={audit.is_correction_done}
                    >
                      Add Correction
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => openVerificationHandler(audit)}
                      disabled={!audit.is_correction_done || audit.is_verification_done}
                    >
                      Add Verification
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="success"
                      onClick={() => openClosureHandler(audit)}
                      disabled={!audit.is_verification_done || audit.is_closure_done}
                    >
                      Add Closure
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
        count={filteredAudits.length}
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
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        {renderModalContent()}
      </Dialog>

      {/* All the form components */}
      <CreateAuditForm
        open={createAudit}
        setOpen={setCreateAudit}
        onSuccess={() => refetch()}
      />
      
      {/* Add the new forms with audit ID passed */}
      {selectedAudit && (
        <>
          <CorrectionForm
            open={addCorrectionForm}
            setOpen={setAddCorrectionForm}
            auditId={selectedAudit.id}
            onSuccess={() => refetch()}
          />
          
          <VerificationForm
            open={addVerificationForm}
            setOpen={setAddVerificationForm}
            auditId={selectedAudit.id}
            onSuccess={() => refetch()}
          />
          
          <ClosureReportForm
            open={addClosureForm}
            setOpen={setAddClosureForm}
            auditId={selectedAudit.id}
            onSuccess={() => refetch()}
          />
        </>
      )}
    </div>
  );
}

export default InternalAuditReport;