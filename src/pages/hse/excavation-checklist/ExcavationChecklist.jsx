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

  const dummyExcavations = [
    {
      "site": "Construction Site A",
      "permit_no": "EXC-2025-045",
      "date": "2025-04-01",
      "description_of_work": "Excavation",
      "location_area_of_work": "Zone 3, Near Main Road",
      "size_of_excavation": {
        "length": "5m",
        "breadth": "3m",
        "depth": "2m"
      },
      "starting_the_work": {
        "date": "2025-04-02",
        "time": "08:30 AM"
      },
      "expected_duration_of_work": {
        "day": "2",
        "hour": "12"
      },
      "purpose_of_excavation": "Laying underground electrical cables",
      "clearances_for_excavation": {
        "electrical_cables": {
          "status": "Do not exist",
          "name": "John Doe",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-01"
        },
        "water_gas_pipes": {
          "status": "Existing within 2 mtr",
          "name": "Alice Smith",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-01"
        },
        "telephone_it_cables": {
          "status": "Not known",
          "name": "Michael Lee",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-01"
        }
      },
      "precautions_taken_by_acceptor": {
        "road_barricading_done": "Yes",
        "warning_signs_provided": "Yes",
        "barricading_excavated_area": "Yes",
        "shoring_carried_out": "Not Required",
        "other_precautions": "Additional signage placed for public safety",
        "name": "Robert Brown",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      },
      "remarks": "Ensure daily inspection of excavation site for safety compliance.",
      "checked_by": {
        "name": "Emily Davis",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "site": "Industrial Park B",
      "permit_no": "EXC-2025-046",
      "date": "2025-04-03",
      "description_of_work": "Foundation Excavation",
      "location_area_of_work": "Building 7, North Side",
      "size_of_excavation": {
        "length": "8m",
        "breadth": "6m",
        "depth": "3.5m"
      },
      "starting_the_work": {
        "date": "2025-04-05",
        "time": "09:00 AM"
      },
      "expected_duration_of_work": {
        "day": "5",
        "hour": "8"
      },
      "purpose_of_excavation": "Foundational work for equipment installation",
      "clearances_for_excavation": {
        "electrical_cables": {
          "status": "Existing within 2 mtr",
          "name": "Thomas Wilson",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-03"
        },
        "water_gas_pipes": {
          "status": "Do not exist",
          "name": "Sarah Johnson",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-03"
        },
        "telephone_it_cables": {
          "status": "Not existing",
          "name": "James Martin",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-03"
        }
      },
      "precautions_taken_by_acceptor": {
        "road_barricading_done": "Yes",
        "warning_signs_provided": "Yes",
        "barricading_excavated_area": "Yes",
        "shoring_carried_out": "Yes",
        "other_precautions": "Dewatering pumps installed for groundwater management",
        "name": "Karen Thompson",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      },
      "remarks": "Area requires continuous monitoring due to nearby heavy equipment operation.",
      "checked_by": {
        "name": "Daniel Clark",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
    {
      "site": "Residential Project C",
      "permit_no": "EXC-2025-047",
      "date": "2025-04-05",
      "description_of_work": "Trench Excavation",
      "location_area_of_work": "Block D, East Wing",
      "size_of_excavation": {
        "length": "15m",
        "breadth": "0.8m",
        "depth": "1.2m"
      },
      "starting_the_work": {
        "date": "2025-04-06",
        "time": "10:00 AM"
      },
      "expected_duration_of_work": {
        "day": "1",
        "hour": "6"
      },
      "purpose_of_excavation": "Water supply pipeline installation",
      "clearances_for_excavation": {
        "electrical_cables": {
          "status": "Not known",
          "name": "Patricia Adams",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-05"
        },
        "water_gas_pipes": {
          "status": "Existing within 2 mtr",
          "name": "Richard White",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-05"
        },
        "telephone_it_cables": {
          "status": "Existing within 2 mtr",
          "name": "Susan Miller",
          "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature",
          "date": "2025-04-05"
        }
      },
      "precautions_taken_by_acceptor": {
        "road_barricading_done": "Yes",
        "warning_signs_provided": "Yes",
        "barricading_excavated_area": "Yes",
        "shoring_carried_out": "Not Required",
        "other_precautions": "Hand digging near existing utility lines",
        "name": "Joseph Taylor",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      },
      "remarks": "Coordinate with utility companies before trenching near marked utilities.",
      "checked_by": {
        "name": "Jennifer Robinson",
        "signature": "https://dummyimage.com/150x50/000/fff.png&text=Signature"
      }
    },
  ];

  const filteredExcavations = dummyExcavations.filter((excavation) =>
    excavation.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    excavation.permit_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    excavation.description_of_work.toLowerCase().includes(searchTerm.toLowerCase())
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

  const currentRows = filteredExcavations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            {currentRows.map((excavation) => (
              <TableRow key={excavation.permit_no}>
                <TableCell align="center">{excavation.site}</TableCell>
                <TableCell align="center">{excavation.permit_no}</TableCell>
                <TableCell align="center">{excavation.date}</TableCell>
                <TableCell align="center">{excavation.description_of_work}</TableCell>
                <TableCell align="center">{excavation.location_area_of_work}</TableCell>
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
            ))}
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
              <Typography><strong>Length:</strong> {selectedExcavation.size_of_excavation.length}</Typography>
              <Typography><strong>Breadth:</strong> {selectedExcavation.size_of_excavation.breadth}</Typography>
              <Typography><strong>Depth:</strong> {selectedExcavation.size_of_excavation.depth}</Typography>
              <Typography className="mt-4"><strong>Starting Date:</strong> {selectedExcavation.starting_the_work.date}</Typography>
              <Typography><strong>Starting Time:</strong> {selectedExcavation.starting_the_work.time}</Typography>
              <Typography className="mt-4"><strong>Expected Duration:</strong> {selectedExcavation.expected_duration_of_work.day} days, {selectedExcavation.expected_duration_of_work.hour} hours</Typography>
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
                <Typography><strong>Status:</strong> {selectedExcavation.clearances_for_excavation.electrical_cables.status}</Typography>
                <Typography><strong>Cleared By:</strong> {selectedExcavation.clearances_for_excavation.electrical_cables.name}</Typography>
                <Typography><strong>Date:</strong> {selectedExcavation.clearances_for_excavation.electrical_cables.date}</Typography>
                <Typography><strong>Signature:</strong></Typography>
                <img src={selectedExcavation.clearances_for_excavation.electrical_cables.signature} alt="Signature" style={{ maxWidth: '100%' }} />
              </div>

              <Typography variant="h6" className="mt-4">Water/Gas Pipes</Typography>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Status:</strong> {selectedExcavation.clearances_for_excavation.water_gas_pipes.status}</Typography>
                <Typography><strong>Cleared By:</strong> {selectedExcavation.clearances_for_excavation.water_gas_pipes.name}</Typography>
                <Typography><strong>Date:</strong> {selectedExcavation.clearances_for_excavation.water_gas_pipes.date}</Typography>
                <Typography><strong>Signature:</strong></Typography>
                <img src={selectedExcavation.clearances_for_excavation.water_gas_pipes.signature} alt="Signature" style={{ maxWidth: '100%' }} />
              </div>

              <Typography variant="h6" className="mt-4">Telephone/IT Cables</Typography>
              <div className="mb-4 p-3 border rounded">
                <Typography><strong>Status:</strong> {selectedExcavation.clearances_for_excavation.telephone_it_cables.status}</Typography>
                <Typography><strong>Cleared By:</strong> {selectedExcavation.clearances_for_excavation.telephone_it_cables.name}</Typography>
                <Typography><strong>Date:</strong> {selectedExcavation.clearances_for_excavation.telephone_it_cables.date}</Typography>
                <Typography><strong>Signature:</strong></Typography>
                <img src={selectedExcavation.clearances_for_excavation.telephone_it_cables.signature} alt="Signature" style={{ maxWidth: '100%' }} />
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
              <Typography><strong>Road Barricading Done:</strong> {selectedExcavation.precautions_taken_by_acceptor.road_barricading_done}</Typography>
              <Typography><strong>Warning Signs Provided:</strong> {selectedExcavation.precautions_taken_by_acceptor.warning_signs_provided}</Typography>
              <Typography><strong>Barricading Excavated Area:</strong> {selectedExcavation.precautions_taken_by_acceptor.barricading_excavated_area}</Typography>
              <Typography><strong>Shoring Carried Out:</strong> {selectedExcavation.precautions_taken_by_acceptor.shoring_carried_out}</Typography>
              <Typography><strong>Other Precautions:</strong> {selectedExcavation.precautions_taken_by_acceptor.other_precautions}</Typography>
              <Typography className="mt-4"><strong>Name:</strong> {selectedExcavation.precautions_taken_by_acceptor.name}</Typography>
              <Typography><strong>Signature:</strong></Typography>
              <img src={selectedExcavation.precautions_taken_by_acceptor.signature} alt="Signature" style={{ maxWidth: '100%' }} />
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
              <Typography className="mt-4"><strong>Checked By:</strong> {selectedExcavation.checked_by.name}</Typography>
              <Typography><strong>Signature:</strong></Typography>
              <img src={selectedExcavation.checked_by.signature} alt="Signature" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Excavation Modal - Not implemented but would go here */}
      {/* Similar to the MockDrillReportDialog component in the provided code */}
      {/* <ExcavationChecklistDialog
        open={createExcavation}
        setOpen={setCreateExcavation}
      /> */}
      <ExcavationPermitDialog
                open={createExcavation}
                setOpen={setCreateExcavation}
      />
    </div>
  );
}

export default ExcavationChecklist;