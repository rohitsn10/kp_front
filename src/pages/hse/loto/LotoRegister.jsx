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
  TextField,
  Stack
} from '@mui/material';
import ImageViewer from '../../../utils/signatureViewer';
// import CreateLotoRegister from '../../../components/pages/hse/loto-register/CreateLotoRegister';
import RemoveLogoutForm from '../../../components/pages/hse/loto/RemoveLoto.jsx';
import CreateLotoRegister from '../../../components/pages/hse/loto/CreateLotoRegister';
import { useParams } from 'react-router-dom';
import { useGetLotoRegistersQuery } from '../../../api/hse/loto/lotoRegisterApi.js';

function LotoRegister() {
    const { locationId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoto, setSelectedLoto] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [lotoToRemove, setLotoToRemove] = useState(null);

  const dummyLogout = [
    {
      "Site": "Unit 4 - Maintenance Bay",
      "applied-date-time": "2025-04-02T08:15:00",
      "applied-lock-tag-number": "TAG-LOCK-456",
      "applied-permit-number": "PERMIT-9921",
      "applied-by-name": "Anil Mehta",
      "applied-by-signature": "https://dummyimage.com/150x50/000/fff.png&text=Anil+Sign",
      "applied-approvedBy-name": "Sandeep Rathi",
      "applied-approvedBy-signature": "https://dummyimage.com/150x50/000/fff.png&text=Sandeep+Sign",
      "removed-date-time": "2025-04-02T16:50:00",
      "removed-lock-tag-number": "TAG-LOCK-456",
      "removed-permit-number": "PERMIT-9921",
      "removed-by-name": "Anil Mehta",
      "removed-by-signature": "https://dummyimage.com/150x50/000/fff.png&text=Anil+Sign",
      "removed-siteInCharge-name": "Naveen Joshi",
      "removed-approvedBySiteInCharge-signature": "https://dummyimage.com/150x50/000/fff.png&text=Naveen+Sign",
      "status": "Completed"
    },
    {
      "Site": "Unit 4 - Maintenance Bay",
      "applied-date-time": "2025-04-02T08:15:00",
      "applied-lock-tag-number": "TAG-LOCK-456",
      "applied-permit-number": "PERMIT-9921",
      "applied-by-name": "Anil Mehta",
      "applied-by-signature": "https://dummyimage.com/150x50/000/fff.png&text=Anil+Sign",
      "applied-approvedBy-name": "Sandeep Rathi",
      "applied-approvedBy-signature": "https://dummyimage.com/150x50/000/fff.png&text=Sandeep+Sign",
      "removed-date-time": "",
      "removed-lock-tag-number": "",
      "removed-permit-number": "",
      "removed-by-name": "",
      "removed-by-signature": "",
      "removed-siteInCharge-name": "",
      "removed-approvedBySiteInCharge-signature": "",
      "status": "Pending"
    }
  ];
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useGetLotoRegistersQuery(locationId);
console.log(data)
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredLotoRecords = dummyLogout.filter((loto) =>
    loto.Site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loto["applied-lock-tag-number"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    loto["applied-by-name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    loto.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredLotoRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openDetailsModalHandler = (loto) => {
    setSelectedLoto(loto);
    setOpenDetailsModal(true);
  };

  const openRemoveDialogHandler = (loto) => {
    setLotoToRemove(loto);
    setOpenRemoveDialog(true);
  };

  // Format date function
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">LOTO Register</h2>
      
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site, Tag Number, Name or Status"
          variant="outlined"
          className=""
        />
        <Button
          variant="contained"
          style={{ 
            backgroundColor: '#FF8C00', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            textTransform: 'none', 
            minHeight: 'auto' 
          }}
          onClick={() => setCreateDialog(true)}
        >
          Add LOTO Record
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Lock/Tag Number</TableCell>
              <TableCell align="center">Applied Date</TableCell>
              <TableCell align="center">Applied By</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((loto, index) => (
              <TableRow key={index}>
                <TableCell align="center">{loto.Site}</TableCell>
                <TableCell align="center">{loto["applied-lock-tag-number"]}</TableCell>
                <TableCell align="center">{formatDateTime(loto["applied-date-time"])}</TableCell>
                <TableCell align="center">{loto["applied-by-name"]}</TableCell>
                <TableCell align="center">
                  <span className={`px-2 py-1 rounded-full text-white ${loto.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {loto.status}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      onClick={() => openDetailsModalHandler(loto)}
                    >
                      View Details
                    </Button>
                    
                    {loto.status === 'Pending' && (
                      <Button 
                        variant="contained" 
                        color="error"
                        size="small"
                        onClick={() => openRemoveDialogHandler(loto)}
                      >
                        Remove LOTO
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredLotoRecords.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* LOTO Details Modal */}
      <Dialog 
        open={openDetailsModal} 
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>LOTO Record Details</DialogTitle>
        <DialogContent>
          {selectedLoto && (
            <>
              <Typography variant="h6" gutterBottom className="mt-2">
                Site Information
              </Typography>
              <Typography variant="body1">
                <strong>Site:</strong> {selectedLoto.Site}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedLoto.status}
              </Typography>

              <Typography variant="h6" gutterBottom className="mt-4">
                LOTO Application Details
              </Typography>
              <Typography variant="body1">
                <strong>Applied Date/Time:</strong> {formatDateTime(selectedLoto["applied-date-time"])}
              </Typography>
              <Typography variant="body1">
                <strong>Lock/Tag Number:</strong> {selectedLoto["applied-lock-tag-number"]}
              </Typography>
              <Typography variant="body1">
                <strong>Permit Number:</strong> {selectedLoto["applied-permit-number"]}
              </Typography>
              <Typography variant="body1">
                <strong>Applied By:</strong> {selectedLoto["applied-by-name"]}
              </Typography>
              <Typography variant="body1">
                <strong>Applied By Signature:</strong>
              </Typography>
              <ImageViewer 
                src={selectedLoto["applied-by-signature"]} 
                alt={`${selectedLoto["applied-by-name"]} Signature`} 
              />
              
              <Typography variant="body1" className="mt-2">
                <strong>Approved By:</strong> {selectedLoto["applied-approvedBy-name"]}
              </Typography>
              <Typography variant="body1">
                <strong>Approved By Signature:</strong>
              </Typography>
              <ImageViewer 
                src={selectedLoto["applied-approvedBy-signature"]} 
                alt={`${selectedLoto["applied-approvedBy-name"]} Signature`} 
              />

              <Typography variant="h6" gutterBottom className="mt-4">
                LOTO Removal Details
              </Typography>
              {selectedLoto.status === "Completed" ? (
                <>
                  <Typography variant="body1">
                    <strong>Removed Date/Time:</strong> {formatDateTime(selectedLoto["removed-date-time"])}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Lock/Tag Number:</strong> {selectedLoto["removed-lock-tag-number"]}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Permit Number:</strong> {selectedLoto["removed-permit-number"]}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Removed By:</strong> {selectedLoto["removed-by-name"]}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Removed By Signature:</strong>
                  </Typography>
                  <ImageViewer 
                    src={selectedLoto["removed-by-signature"]} 
                    alt={`${selectedLoto["removed-by-name"]} Signature`} 
                  />
                  
                  <Typography variant="body1" className="mt-2">
                    <strong>Site In Charge:</strong> {selectedLoto["removed-siteInCharge-name"]}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Site In Charge Signature:</strong>
                  </Typography>
                  <ImageViewer 
                    src={selectedLoto["removed-approvedBySiteInCharge-signature"]} 
                    alt={`${selectedLoto["removed-siteInCharge-name"]} Signature`} 
                  />
                </>
              ) : (
                <Typography variant="body1" color="warning.main">
                  LOTO removal pending
                </Typography>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create LOTO Dialog */}
      <CreateLotoRegister
        open={openCreateDialog} 
        setOpen={setCreateDialog}
      />

      {/* Remove LOTO Dialog */}
      {lotoToRemove && (
        <RemoveLogoutForm
          open={openRemoveDialog} 
          setOpen={setOpenRemoveDialog}
          lotoData={lotoToRemove}
        />
      )}
    </div>
  );
}

export default LotoRegister;