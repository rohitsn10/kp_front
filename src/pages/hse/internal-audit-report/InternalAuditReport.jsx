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

// Reusable Image Viewer Component
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [modalView, setModalView] = useState('observations'); // 'observations', 'correction', 'verification'
  const [createAudit,setCreateAudit]=useState(false);
  const dummyAudit = [
    {
      "site": "Manufacturing Plant A",
      "date": "2025-04-02",
      "observations": {
        "auditor_observer": {
          "name": "John Doe",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditor_Sign"
        },
        "auditee": {
          "name": "Jane Smith",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditee_Sign"
        },
        "agreed_completion_date": "2025-04-10"
      },
      "correction": {
        "correction_details": "Safety barrier was missing near high-risk area. Installed immediately.",
        "root_cause": "Lack of proper safety inspections before work commencement.",
        "corrective_preventive_action": "Scheduled daily safety inspections and training for workers.",
        "auditee": {
          "name": "Jane Smith",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditee_Sign",
          "date": "2025-04-03"
        }
      },
      "verification_of_root_cause_corrective_action": {
        "auditor": {
          "name": "Robert Brown",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditor_Sign",
          "date": "2025-04-05"
        },
        "report_of_closure": "Corrective action verified. Safety inspections implemented successfully.",
        "site_incharge": {
          "name": "Michael Johnson",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Site_Incharge_Sign",
          "date": "2025-04-06"
        }
      }
    },
    {
      "site": "Manufacturing Plant B",
      "date": "2025-04-02",
      "observations": {
        "auditor_observer": {
          "name": "John Doe",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditor_Sign"
        },
        "auditee": {
          "name": "Jane Smith",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditee_Sign"
        },
        "agreed_completion_date": "2025-04-10"
      },
      "correction": {
        "correction_details": "Safety barrier was missing near high-risk area. Installed immediately.",
        "root_cause": "Lack of proper safety inspections before work commencement.",
        "corrective_preventive_action": "Scheduled daily safety inspections and training for workers.",
        "auditee": {
          "name": "Jane Smith",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditee_Sign",
          "date": "2025-04-03"
        }
      },
      "verification_of_root_cause_corrective_action": {
        "auditor": {
          "name": "Robert Brown",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Auditor_Sign",
          "date": "2025-04-05"
        },
        "report_of_closure": "Corrective action verified. Safety inspections implemented successfully.",
        "site_incharge": {
          "name": "Michael Johnson",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Site_Incharge_Sign",
          "date": "2025-04-06"
        }
      }
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
  const filteredAudits = dummyAudit.filter((audit) =>
    audit.site.toLowerCase().includes(searchTerm.toLowerCase())
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

  const renderModalContent = () => {
    if (!selectedAudit) return null;

    switch (modalView) {
      case 'observations':
        return (
          <>
            <DialogTitle>Audit Observations</DialogTitle>
            <DialogContent>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Auditor Observer:</strong> {selectedAudit.observations.auditor_observer.name}</Typography>
                <Typography><strong>Auditor Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.observations.auditor_observer.signature}
                  alt="Auditor Signature"
                />
                <Typography><strong>Auditee:</strong> {selectedAudit.observations.auditee.name}</Typography>
                <Typography><strong>Auditee Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.observations.auditee.signature}
                  alt="Auditee Signature"
                />
                <Typography><strong>Agreed Completion Date:</strong> {selectedAudit.observations.agreed_completion_date}</Typography>
              </div>
            </DialogContent>
          </>
        );
      case 'correction':
        return (
          <>
            <DialogTitle>Correction Details</DialogTitle>
            <DialogContent>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Correction Details:</strong> {selectedAudit.correction.correction_details}</Typography>
                <Typography><strong>Root Cause:</strong> {selectedAudit.correction.root_cause}</Typography>
                <Typography><strong>Corrective/Preventive Action:</strong> {selectedAudit.correction.corrective_preventive_action}</Typography>
                <Typography><strong>Auditee:</strong> {selectedAudit.correction.auditee.name}</Typography>
                <Typography><strong>Date:</strong> {selectedAudit.correction.auditee.date}</Typography>
                <Typography><strong>Auditee Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.correction.auditee.signature}
                  alt="Auditee Signature"
                />
              </div>
            </DialogContent>
          </>
        );
      case 'verification':
        return (
          <>
            <DialogTitle>Verification of Corrective Action</DialogTitle>
            <DialogContent>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Auditor:</strong> {selectedAudit.verification_of_root_cause_corrective_action.auditor.name}</Typography>
                <Typography><strong>Date:</strong> {selectedAudit.verification_of_root_cause_corrective_action.auditor.date}</Typography>
                <Typography><strong>Auditor Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.verification_of_root_cause_corrective_action.auditor.signature}
                  alt="Auditor Signature"
                />
                <Typography><strong>Report of Closure:</strong> {selectedAudit.verification_of_root_cause_corrective_action.report_of_closure}</Typography>
                <Typography><strong>Site Incharge:</strong> {selectedAudit.verification_of_root_cause_corrective_action.site_incharge.name}</Typography>
                <Typography><strong>Date:</strong> {selectedAudit.verification_of_root_cause_corrective_action.site_incharge.date}</Typography>
                <Typography><strong>Site Incharge Signature:</strong></Typography>
                <ImageViewer
                  src={selectedAudit.verification_of_root_cause_corrective_action.site_incharge.signature}
                  alt="Site Incharge Signature"
                />
              </div>
            </DialogContent>
          </>
        );
      default:
        return null;
    }
  };

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
        onClick={()=>setCreateAudit(true)}
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((audit, index) => (
              <TableRow key={index}>
                <TableCell align="center">{audit.site}</TableCell>
                <TableCell align="center">{audit.date}</TableCell>
                <TableCell align="center">{audit.observations.agreed_completion_date}</TableCell>
                <TableCell align="center">
                  {new Date() > new Date(audit.verification_of_root_cause_corrective_action.site_incharge.date) ? "Closed" : "Open"}
                </TableCell>
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
                    >
                      Correction
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => openAuditDetailsHandler(audit, 'verification')}
                    >
                      Verification
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
      <CreateAuditForm
      open={createAudit}
      setOpen={setCreateAudit}
      />
    </div>
  );
}

export default InternalAuditReport;