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
import RemoveLogoutForm from '../../../components/pages/hse/loto/RemoveLoto.jsx';
import CreateLotoRegister from '../../../components/pages/hse/loto/CreateLotoRegister';
import { useParams } from 'react-router-dom';
import { useGetLotoRegistersQuery } from '../../../api/hse/loto/lotoRegisterApi.js';

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

  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useGetLotoRegistersQuery(locationId);
  console.log(data);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const lotoRecords = data?.data || [];

  const filteredLotoRecords = lotoRecords.filter((loto) =>
    loto.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loto.applied_lock_tag_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loto.applied_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

      {isLoading ? (
        <Typography align="center" variant="h6">Loading...</Typography>
      ) : isError ? (
        <Typography align="center" variant="h6" color="error">Error: {error?.message || "Failed to load data"}</Typography>
      ) : (
        <>
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
                {filteredLotoRecords
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((loto, index) => (
                    <TableRow key={loto.id || index}>
                      <TableCell align="center">{loto.site_name}</TableCell>
                      <TableCell align="center">{loto.applied_lock_tag_number}</TableCell>
                      <TableCell align="center">{formatDateTime(loto.applied_datetime)}</TableCell>
                      <TableCell align="center">{loto.applied_by_name}</TableCell>
                      <TableCell align="center">
                        <span className="px-2 py-1 rounded-full text-white bg-yellow-500">
                          Pending
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

                          <Button 
                            variant="contained" 
                            color="error"
                            size="small"
                            onClick={() => openRemoveDialogHandler(loto)}
                          >
                            Remove LOTO
                          </Button>
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
        </>
      )}

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
                <strong>Site:</strong> {selectedLoto.site_name}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> Pending
              </Typography>

              <Typography variant="h6" gutterBottom className="mt-4">
                LOTO Application Details
              </Typography>
              <Typography variant="body1">
                <strong>Applied Date/Time:</strong> {formatDateTime(selectedLoto.applied_datetime)}
              </Typography>
              <Typography variant="body1">
                <strong>Lock/Tag Number:</strong> {selectedLoto.applied_lock_tag_number}
              </Typography>
              <Typography variant="body1">
                <strong>Permit Number:</strong> {selectedLoto.applied_permit_number}
              </Typography>
              <Typography variant="body1">
                <strong>Applied By:</strong> {selectedLoto.applied_by_name}
              </Typography>
              <Typography variant="body1">
                <strong>Applied By Signature:</strong>
              </Typography>
              {selectedLoto.applied_by_signature && (
                <ImageViewer 
                  src={selectedLoto.applied_by_signature} 
                  alt={`${selectedLoto.applied_by_name} Signature`} 
                />
              )}
              
              <Typography variant="body1" className="mt-2">
                <strong>Approved By:</strong> {selectedLoto.applied_approved_by_name}
              </Typography>
              <Typography variant="body1">
                <strong>Approved By Signature:</strong>
              </Typography>
              {selectedLoto.applied_approved_by_signature && (
                <ImageViewer 
                  src={selectedLoto.applied_approved_by_signature} 
                  alt={`${selectedLoto.applied_approved_by_name} Signature`} 
                />
              )}

              <Typography variant="h6" gutterBottom className="mt-4">
                LOTO Removal Details
              </Typography>
              {selectedLoto.removed_datetime ? (
                <>
                  <Typography variant="body1">
                    <strong>Removed Date/Time:</strong> {formatDateTime(selectedLoto.removed_datetime)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Lock/Tag Number:</strong> {selectedLoto.removed_lock_tag_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Permit Number:</strong> {selectedLoto.removed_permit_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Removed By:</strong> {selectedLoto.removed_by_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Removed By Signature:</strong>
                  </Typography>
                  {selectedLoto.removed_by_signature && (
                    <ImageViewer 
                      src={selectedLoto.removed_by_signature} 
                      alt={`${selectedLoto.removed_by_name} Signature`} 
                    />
                  )}
                  
                  <Typography variant="body1" className="mt-2">
                    <strong>Site In Charge:</strong> {selectedLoto.removed_site_in_charge_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Site In Charge Signature:</strong>
                  </Typography>
                  {selectedLoto.removed_approved_by_site_in_charge_signature && (
                    <ImageViewer 
                      src={selectedLoto.removed_approved_by_site_in_charge_signature} 
                      alt={`${selectedLoto.removed_site_in_charge_name} Signature`} 
                    />
                  )}
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