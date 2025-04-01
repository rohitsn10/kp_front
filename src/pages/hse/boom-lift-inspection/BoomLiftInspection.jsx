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
import BoomLiftInspectionDialog from "../../../components/pages/hse/boom-lift/CreateBoomLift";

function BoomLiftInspection() {
  const dummyBoomLift = [
    {
      "BoomLiftInspection": {
        "EquipmentName": "Boom Lift 1",
        "IdentificationNumber": "BL-2023-12-001",
        "MakeModel": "JLG 450AJ",
        "InspectionDate": "2023-12-15",
        "Site": "Construction Site A",
        "Location": "Sector 5, Main Yard",
        "Remarks": "Minor hydraulic leak observed.",
        "InspectedBy": "John Doe",
        "Checkpoints": [
          {
            "Checkpoint": "All valid documents are available - Registration, Insurance, form no 10, License & operator authority letter.",
            "Observations": "All documents present and valid.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Operator fitness certificate including eye test.",
            "Observations": "Certificate valid until 2024-06-30.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Main horn / Reverse horn",
            "Observations": "Main horn functional, reverse horn intermittent.",
            "ActionBy": "Maintenance Team",
            "Remarks": "Reverse horn repair required."
          },
          {
            "Checkpoint": "Emergency lowering function properly.",
            "Observations": "Function tested, working correctly.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Tyre pressure & condition",
            "Observations": "Tyre pressure within specifications, slight wear on rear left tyre.",
            "ActionBy": "N/A",
            "Remarks": "Monitor rear left tyre."
          },
          {
            "Checkpoint": "Hydraulic cylinder & any leakage.",
            "Observations": "Minor leakage observed on boom cylinder.",
            "ActionBy": "Maintenance Team",
            "Remarks": "Schedule hydraulic cylinder repair."
          },
          {
            "Checkpoint": "Smooth function of hydraulic boom",
            "Observations": "Boom operation smooth.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Brake for stop & hold.",
            "Observations": "Brakes hold effectively.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Condition of all lever button",
            "Observations": "All buttons functional.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Guard rails are in good condition without any damage on platform",
            "Observations": "Guard rails in good condition.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Toe Guard",
            "Observations": "Toe guard intact and secure.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Condition of Platform",
            "Observations": "Platform surface in good condition.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Door Lock Arrangement for Platform",
            "Observations": "Door lock functional.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "SWL mentioned on boom lift",
            "Observations": "SWL clearly marked.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Over load indicator & cut off devices working properly.",
            "Observations": "Overload indicator and cut-off working.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Battery condition",
            "Observations": "Battery charge level adequate.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Display Authorized operator list",
            "Observations": "Operator list displayed.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "PPE (Safety shoes & helmet)",
            "Observations": "Operator wearing required PPE.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          }
        ]
      }
    },
    {
      "BoomLiftInspection": {
        "EquipmentName": "Boom Lift 2",
        "IdentificationNumber": "BL-2023-12-002",
        "MakeModel": "Genie Z-60/37",
        "InspectionDate": "2023-12-16",
        "Site": "Construction Site B",
        "Location": "Zone 2, North Area",
        "Remarks": "Tire pressure low on front right.",
        "InspectedBy": "Jane Smith",
        "Checkpoints": [
          {
            "Checkpoint": "All valid documents are available - Registration, Insurance, form no 10, License & operator authority letter.",
            "Observations": "Documents verified.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Operator fitness certificate including eye test.",
            "Observations": "Valid certificate present.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Main horn / Reverse horn",
            "Observations": "Both horns working.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Emergency lowering function properly.",
            "Observations": "Function tested and passed.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Tyre pressure & condition",
            "Observations": "Front right tire pressure low.",
            "ActionBy": "Maintenance Team",
            "Remarks": "Inflate front right tire."
          },
          {
            "Checkpoint": "Hydraulic cylinder & any leakage.",
            "Observations": "No leakage detected.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Smooth function of hydraulic boom",
            "Observations": "Smooth operation.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Brake for stop & hold.",
            "Observations": "Brakes effective.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Condition of all lever button",
            "Observations": "All levers working.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Guard rails are in good condition without any damage on platform",
            "Observations": "Good condition.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Toe Guard",
            "Observations": "Toe guard intact.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Condition of Platform",
            "Observations": "Platform good.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Door Lock Arrangement for Platform",
            "Observations": "Door lock working.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "SWL mentioned on boom lift",
            "Observations": "SWL marked.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Over load indicator & cut off devices working properly.",
            "Observations": "Overload indicator working.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Battery condition",
            "Observations": "Battery good.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "Display Authorized operator list",
            "Observations": "List displayed.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          },
          {
            "Checkpoint": "PPE (Safety shoes & helmet)",
            "Observations": "Operator using PPE.",
            "ActionBy": "N/A",
            "Remarks": "N/A"
          }
        ]
      }
    }
  ]

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  const [openDialog,setOpenDialog]=useState(false)
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

  const filteredData = dummyBoomLift.filter((item) =>
    item.BoomLiftInspection.EquipmentName.toLowerCase().includes(
      searchTerm.toLowerCase()
    )
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-4">Boom Lift Inspection</h2>
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
                <TableCell align="center">{item.BoomLiftInspection.EquipmentName}</TableCell>
                <TableCell align="center">{item.BoomLiftInspection.IdentificationNumber}</TableCell>
                <TableCell align="center">{item.BoomLiftInspection.MakeModel}</TableCell>
                <TableCell align="center">{item.BoomLiftInspection.InspectionDate}</TableCell>
                <TableCell align="center">{item.BoomLiftInspection.Site}</TableCell>
                <TableCell align="center">{item.BoomLiftInspection.Location}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDetails(item.BoomLiftInspection)}
                  >
                    View Details
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleOpenChecklist(item.BoomLiftInspection)}
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
            <CloseIcon />
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
            <CloseIcon />

          </IconButton>
        </div>
        <DialogContent className="p-4 space-y-6">
          {selectedInspection && selectedInspection.Checkpoints.map((cp, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <p className="text-sm font-medium text-gray-700">
                <span className="font-bold">Checkpoint:</span> {cp.Checkpoint}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Observations:</span> {cp.Observations}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Action By:</span> {cp.ActionBy}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Remarks:</span> {cp.Remarks}
              </p>
            </div>
          ))}
          {!selectedInspection && (
            <p className="text-center text-gray-500">No checkpoints available</p>
          )}
        </DialogContent>
      </Dialog>
      <BoomLiftInspectionDialog
      open={openDialog}
      setOpen={setOpenDialog}
      />
    </div>
  );
}

export default BoomLiftInspection;
