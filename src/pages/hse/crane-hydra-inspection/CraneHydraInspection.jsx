 
import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CraneHydraInspectionDialog from "../../../components/pages/hse/crane-hydra-inspecton/CreateCraneHydra.jsx";

function CraneHydraInspection() {
  const dummyCraneData = [
    {
      "code": "CRANE / HYDRA INSPECTION CHECKLIST",
      "equipment_name": "Hydraulic Crane X200",
      "identification_number": "CRN-2025-001",
      "make_model": "XYZ Heavy Industries / X200",
      "inspection_date": "2025-03-27",
      "site": "Construction Site A",
      "location": "Sector 5, Zone B",
      "remarks": "Overall condition satisfactory with minor issues noted.",
      "inspected_by": "John Doe",
      "checkpoints": [
        {
          "checkpoint": "All valid documents are available - Registration, Insurance, form no 10, License & operator authority letter",
          "observations": "Insurance expired last month.",
          "action_by": "Fleet Manager",
          "remarks": "Renewal in progress."
        },
        {
          "checkpoint": "Driver fitness certificate including eye test",
          "observations": "Certificate valid until next year.",
          "action_by": "HSE Officer",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Main horn / Reverse horn",
          "observations": "Reverse horn not functioning.",
          "action_by": "Maintenance Team",
          "remarks": "To be repaired by end of the day."
        },
        {
          "checkpoint": "Clutch & Brake",
          "observations": "Brakes slightly loose.",
          "action_by": "Mechanical Supervisor",
          "remarks": "Adjustment scheduled for tomorrow."
        },
        {
          "checkpoint": "Tyre pressure & condition",
          "observations": "Rear left tyre pressure low.",
          "action_by": "Tyre Maintenance Team",
          "remarks": "Pressure corrected, monitoring required."
        },
        {
          "checkpoint": "Head Light & Indicators",
          "observations": "All functional.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Seat belt",
          "observations": "Seat belt operational.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Wiper blade",
          "observations": "Worn out, needs replacement.",
          "action_by": "Maintenance Team",
          "remarks": "Replaced during next maintenance."
        },
        {
          "checkpoint": "Door / Door lock",
          "observations": "Locks working fine.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Battery condition",
          "observations": "Battery charge slightly low.",
          "action_by": "Electrician",
          "remarks": "Scheduled for charging."
        },
        {
          "checkpoint": "Hand brake",
          "observations": "Operational.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "SWL mentioned on boom lift",
          "observations": "Clearly visible.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Condition of hydraulic cylinder & any leakage",
          "observations": "Minor oil seepage observed.",
          "action_by": "Hydraulic Technician",
          "remarks": "Scheduled for repair next week."
        },
        {
          "checkpoint": "Speedometer & Gauges",
          "observations": "All gauges functional.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Guard for moving parts",
          "observations": "Guards intact.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Display Authorized operator list",
          "observations": "List displayed properly.",
          "action_by": "HSE Officer",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "PPE (Safety shoes & helmet)",
          "observations": "Operator wearing full PPE.",
          "action_by": "Safety Officer",
          "remarks": "No issues noted."
        }
      ]
    },
    {
      "code": "CRANE / HYDRA INSPECTION CHECKLIST",
      "equipment_name": "Hydraulic Crane X200",
      "identification_number": "CRN-2025-001",
      "make_model": "XYZ Heavy Industries / X200",
      "inspection_date": "2025-03-27",
      "site": "Construction Site A",
      "location": "Sector 5, Zone B",
      "remarks": "Overall condition satisfactory with minor issues noted.",
      "inspected_by": "John Doe",
      "checkpoints": [
        {
          "checkpoint": "All valid documents are available - Registration, Insurance, form no 10, License & operator authority letter",
          "observations": "Insurance expired last month.",
          "action_by": "Fleet Manager",
          "remarks": "Renewal in progress."
        },
        {
          "checkpoint": "Driver fitness certificate including eye test",
          "observations": "Certificate valid until next year.",
          "action_by": "HSE Officer",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Main horn / Reverse horn",
          "observations": "Reverse horn not functioning.",
          "action_by": "Maintenance Team",
          "remarks": "To be repaired by end of the day."
        },
        {
          "checkpoint": "Clutch & Brake",
          "observations": "Brakes slightly loose.",
          "action_by": "Mechanical Supervisor",
          "remarks": "Adjustment scheduled for tomorrow."
        },
        {
          "checkpoint": "Tyre pressure & condition",
          "observations": "Rear left tyre pressure low.",
          "action_by": "Tyre Maintenance Team",
          "remarks": "Pressure corrected, monitoring required."
        },
        {
          "checkpoint": "Head Light & Indicators",
          "observations": "All functional.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Seat belt",
          "observations": "Seat belt operational.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Wiper blade",
          "observations": "Worn out, needs replacement.",
          "action_by": "Maintenance Team",
          "remarks": "Replaced during next maintenance."
        },
        {
          "checkpoint": "Door / Door lock",
          "observations": "Locks working fine.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Battery condition",
          "observations": "Battery charge slightly low.",
          "action_by": "Electrician",
          "remarks": "Scheduled for charging."
        },
        {
          "checkpoint": "Hand brake",
          "observations": "Operational.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "SWL mentioned on boom lift",
          "observations": "Clearly visible.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Condition of hydraulic cylinder & any leakage",
          "observations": "Minor oil seepage observed.",
          "action_by": "Hydraulic Technician",
          "remarks": "Scheduled for repair next week."
        },
        {
          "checkpoint": "Speedometer & Gauges",
          "observations": "All gauges functional.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Guard for moving parts",
          "observations": "Guards intact.",
          "action_by": "Inspector",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "Display Authorized operator list",
          "observations": "List displayed properly.",
          "action_by": "HSE Officer",
          "remarks": "No issues noted."
        },
        {
          "checkpoint": "PPE (Safety shoes & helmet)",
          "observations": "Operator wearing full PPE.",
          "action_by": "Safety Officer",
          "remarks": "No issues noted."
        }
      ]
    }
    
  ]

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

    const [openCreateDialog,setOpenDialog]=useState(false);
  // const [createDialog,setCreateDialog] = useState(false);

  const handleOpenDetails = (inspection) => {
    setSelectedInspection(inspection);
    setOpenDetails(true);
  };

  const handleOpenChecklist = (inspection) => {
    setSelectedInspection(inspection);
    setOpenChecklist(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
    setOpenChecklist(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = dummyCraneData.filter((item) =>
    item.equipment_name.toLowerCase().includes(
      searchTerm.toLowerCase()
    )
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-4">Crane Hydra Inspection</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">

      <TextField
        value={searchTerm}
        placeholder="Search by Equipment Name"
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        className="mb-4"
      />
              <div className="flex justify-end">
                <Button
                onClick={()=>setOpenDialog(true)}
                  variant="contained"
                  style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
                >
                  Add Inspection
                </Button>
              </div>
            </div>

      <TableContainer component={Paper} className="my-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Equipment Name</TableCell>
              <TableCell align="center">Identification Number</TableCell>
              <TableCell align="center">Make / Model</TableCell>
              <TableCell align="center">Inspection Date</TableCell>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Checklist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">{item.equipment_name}</TableCell>
                <TableCell align="center">{item.identification_number}</TableCell>
                <TableCell align="center">{item.make_model}</TableCell>
                <TableCell align="center">{item.inspection_date}</TableCell>
                <TableCell align="center">{item.site}</TableCell>
                <TableCell align="center">{item.location}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDetails(item)}
                  >
                    View Details
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleOpenChecklist(item)}
                  >
                    View Checklist
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
      />
          <CraneHydraInspectionDialog
        open={openCreateDialog}
        setOpen={setOpenDialog}
    />

      {/* Details Dialog */}
      <Dialog 
      open={openDetails} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      className="p-4"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <DialogTitle className="text-lg font-semibold">Inspection Details</DialogTitle>
        <IconButton onClick={handleClose}>
        <CloseIcon/>
        </IconButton>
        
        {/* <h2 className="text-lg font-semibold">Inspection Details</h2> */}
      </div>

      <DialogContent className="p-6 space-y-4 bg-gray-50">
        {selectedInspection ? (
          <div className="p-4 border rounded-lg shadow-sm">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Remarks:</span> {selectedInspection.Remarks}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Inspected By:</span> {selectedInspection.InspectedBy}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">No inspection details available</p>
        )}
      </DialogContent>
    </Dialog>

      {/* Checklist Dialog */}
      <Dialog 
      open={openChecklist} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm" 
      className="p-1 sm:p-4"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <DialogTitle className="text-lg font-semibold">Checklist</DialogTitle>
        <IconButton onClick={handleClose}>
          {/* <X className="w-5 h-5" /> */}
          <CloseIcon/>

        </IconButton>
      </div>
      <DialogContent className="p-4 space-y-6">
        {selectedInspection && selectedInspection?.checkpoints.map((cp, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <p className="text-sm font-medium text-gray-700">
              <span className="font-bold">Checkpoint:</span> {cp.checkpoint}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Observations:</span> {cp.observations}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Action By:</span> {cp.action_by}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Remarks:</span> {cp.remarks}
            </p>
          </div>
        ))}
        {!selectedInspection && (
          <p className="text-center text-gray-500">No checkpoints available</p>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}

export default CraneHydraInspection;
