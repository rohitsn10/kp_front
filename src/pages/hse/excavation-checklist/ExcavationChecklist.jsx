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
import ExcavationPermitDialog from '../../../components/pages/hse/excavation/CreateExcavation';
import { useParams } from 'react-router-dom';
import { useGetLocationExcavationPermitsQuery } from '../../../api/hse/excavation/excavationPermitApi';

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

function ExcavationChecklist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedExcavation, setSelectedExcavation] = useState(null);
  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [openClearancesModal, setOpenClearancesModal] = useState(false);
  const [openPrecautionsModal, setOpenPrecautionsModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createExcavation, setCreateExcavation] = useState(false);
  const { locationId } = useParams();
  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  
  // Use the query hook with proper skip option
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch
  } = useGetLocationExcavationPermitsQuery(parsedLocationId, {
    skip: parsedLocationId === null || isNaN(parsedLocationId)
  });

  // Extract excavation permits from the response
  const excavations = response?.data || [];

  const filteredExcavations = excavations.filter((excavation) =>
    (excavation.site_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (excavation.permit_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (excavation.description_of_work || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (excavation, modalType) => {
    setSelectedExcavation(excavation);
    switch(modalType) {
      case 'size':
        setOpenSizeModal(true);
        break;
      case 'clearances':
        setOpenClearancesModal(true);
        break;
      case 'precautions':
        setOpenPrecautionsModal(true);
        break;
      case 'details':
        setOpenDetailsModal(true);
        break;
    }
  };

  const closeModal = (modalType) => {
    switch(modalType) {
      case 'size':
        setOpenSizeModal(false);
        break;
      case 'clearances':
        setOpenClearancesModal(false);
        break;
      case 'precautions':
        setOpenPrecautionsModal(false);
        break;
      case 'details':
        setOpenDetailsModal(false);
        break;
    }
    setSelectedExcavation(null);
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const currentRows = filteredExcavations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return <div className="text-center p-8">Loading excavation permits...</div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-red-600">Error loading data: {error?.message || 'Unknown error'}</div>;
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Excavation Checklist</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Site, Permit No, or Description"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateExcavation(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Create Excavation Checklist
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Permit No</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Description of Work</TableCell>
              <TableCell align="center">Location/Area</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((excavation) => (
                <TableRow key={excavation.id}>
                  <TableCell align="center">{excavation.site_name}</TableCell>
                  <TableCell align="center">{excavation.permit_number}</TableCell>
                  <TableCell align="center">{formatDate(excavation.date)}</TableCell>
                  <TableCell align="center">{excavation.description_of_work}</TableCell>
                  <TableCell align="center">{excavation.location_area_work}</TableCell>
                  <TableCell align="center">
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        onClick={() => openModal(excavation, 'size')}
                      >
                        Size Details
                      </Button>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        onClick={() => openModal(excavation, 'clearances')}
                      >
                        Clearances
                      </Button>
                      <Button 
                        variant="contained" 
                        color="info" 
                        size="small"
                        onClick={() => openModal(excavation, 'precautions')}
                      >
                        Precautions
                      </Button>
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small"
                        onClick={() => openModal(excavation, 'details')}
                      >
                        Additional Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No excavation permits found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredExcavations.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Size Details Modal */}
      <Dialog 
        open={openSizeModal} 
        onClose={() => closeModal('size')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Excavation Size Details</DialogTitle>
        <DialogContent>
          {selectedExcavation && (
            <div className="mb-4 p-3 border rounded">
              <Typography><strong>Length:</strong> {selectedExcavation.length}</Typography>
              <Typography><strong>Breadth:</strong> {selectedExcavation.breadth}</Typography>
              <Typography><strong>Depth:</strong> {selectedExcavation.depth}</Typography>
              <Typography className="mt-4"><strong>Starting Date:</strong> {selectedExcavation.start_work_date}</Typography>
              <Typography><strong>Starting Time:</strong> {selectedExcavation.start_work_time}</Typography>
              <Typography className="mt-4"><strong>Expected Duration:</strong> {selectedExcavation.duration_work_day} days</Typography>
              <Typography className="mt-4"><strong>Purpose of Excavation:</strong> {selectedExcavation.purpose_of_excavation}</Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clearances Modal */}
      <Dialog 
        open={openClearancesModal} 
        onClose={() => closeModal('clearances')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Clearances for Excavation</DialogTitle>
        <DialogContent>
          {selectedExcavation && (
            <>
              <Typography variant="h6" className="mt-4">Electrical Cables</Typography>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Description:</strong> {selectedExcavation.electrical_cable_description}</Typography>
                <Typography><strong>Cleared By:</strong> {selectedExcavation.electrical_cable_name}</Typography>
                <Typography><strong>Date:</strong> {formatDate(selectedExcavation.electrical_cable_date)}</Typography>
                <Typography><strong>Signature:</strong></Typography>
                {selectedExcavation.sign_upload && (
                  <ImageViewer
                  src={selectedExcavation.sign_upload}
                  alt="Signature"
                  width={200} 
                  height={70}
                />
                )}
              </div>

              <Typography variant="h6" className="mt-4">Water/Gas Pipes</Typography>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Description:</strong> {selectedExcavation.water_gas_description}</Typography>
                <Typography><strong>Cleared By:</strong> {selectedExcavation.water_gas_name}</Typography>
                <Typography><strong>Date:</strong> {formatDate(selectedExcavation.water_gas_date)}</Typography>
                <Typography><strong>Signature:</strong></Typography>
                {selectedExcavation.water_sign_upload && (
                  <ImageViewer
                  src={selectedExcavation.water_sign_upload}
                  alt="Signature"
                  width={200} 
                  height={70}
                />
                )}
              </div>

              <Typography variant="h6" className="mt-4">Telephone/IT Cables</Typography>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Description:</strong> {selectedExcavation.telephone_description}</Typography>
                <Typography><strong>Cleared By:</strong> {selectedExcavation.telephone_name}</Typography>
                <Typography><strong>Date:</strong> {formatDate(selectedExcavation.telephone_date)}</Typography>
                <Typography><strong>Signature:</strong></Typography>
                {selectedExcavation.telephone_sign_upload && (
                  <ImageViewer
                  src={selectedExcavation.telephone_sign_upload}
                  alt="Signature"
                  width={200} 
                  height={70}
                />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Precautions Modal */}
      <Dialog 
        open={openPrecautionsModal} 
        onClose={() => closeModal('precautions')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Precautions Taken</DialogTitle>
        <DialogContent>
          {selectedExcavation && (
            <div className="mb-4 p-3 border rounded">
              <Typography><strong>Road Barricading Done:</strong> {selectedExcavation.road_barricading ? 'Yes' : 'No'}</Typography>
              <Typography><strong>Warning Signs Provided:</strong> {selectedExcavation.warning_sign ? 'Yes' : 'No'}</Typography>
              <Typography><strong>Barricading Excavated Area:</strong> {selectedExcavation.barricading_excavated_area ? 'Yes' : 'No'}</Typography>
              <Typography><strong>Shoring Carried Out:</strong> {selectedExcavation.shoring_carried ? 'Yes' : 'No'}</Typography>
              <Typography><strong>Other Precautions:</strong> {selectedExcavation.any_other_precaution}</Typography>
              <Typography className="mt-4"><strong>Name:</strong> {selectedExcavation.name_acceptor}</Typography>
              <Typography><strong>Signature:</strong></Typography>
              {selectedExcavation.acceptor_sign_upload && (
                <ImageViewer
                  src={selectedExcavation.acceptor_sign_upload}
                  alt="Signature"
                  width={200} 
                  height={80}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Additional Details Modal */}
      <Dialog 
        open={openDetailsModal} 
        onClose={() => closeModal('details')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Additional Details</DialogTitle>
        <DialogContent sx={{ paddingY: "30px" }}>
          {selectedExcavation && (
            <div className="flex flex-col gap-4">
              <Typography><strong>Remarks:</strong> {selectedExcavation.remarks}</Typography>
              <Typography className="mt-4"><strong>Checked By:</strong> {selectedExcavation.check_by_name}</Typography>
              <Typography><strong>Signature:</strong></Typography>
              {selectedExcavation.check_by_sign && (
                <ImageViewer
                  src={selectedExcavation.check_by_sign}
                  alt="Signature"
                  width={200} 
                  height={80}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ExcavationPermitDialog
        open={createExcavation}
        setOpen={setCreateExcavation}
        onSuccess={refetch}
      />
    </div>
  );
}

export default ExcavationChecklist;