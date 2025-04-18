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
import CloseIcon from "@mui/icons-material/Close";
import CraneHydraInspectionDialog from "../../../components/pages/hse/crane-hydra-inspecton/CreateCraneHydra.jsx";
import { useGetCraneHydraInspectionQuery } from "../../../api/hse/crane/craneHydraApi.js";
import { useParams } from "react-router-dom";

function CraneHydraInspection() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const {locationId} = useParams();
  const { data } = useGetCraneHydraInspectionQuery(locationId ? parseInt(locationId) : undefined);
  const [openCreateDialog, setOpenDialog] = useState(false);
  
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

  const inspections = data?.data || [];

  const filteredData = inspections.filter((item) =>
    item.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-4">
        Crane Hydra Inspection
      </h2>
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
            onClick={() => setOpenDialog(true)}
            variant="contained"
            style={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
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
                <TableCell align="center">
                  {item.identification_number}
                </TableCell>
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
          <DialogTitle className="text-lg font-semibold">
            Inspection Details
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>

          {/* <h2 className="text-lg font-semibold">Inspection Details</h2> */}
        </div>

        <DialogContent className="p-6 space-y-4 bg-gray-50">
          {selectedInspection ? (
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Remarks:</span>{" "}
                {selectedInspection?.all_valid_document_remarks || ""}
                {selectedInspection.Remarks}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">Inspected By:</span>{" "}
                {selectedInspection?.user || ""}
                {selectedInspection.InspectedBy}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No inspection details available
            </p>
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
          {Object.entries(selectedInspection || {})
            .filter(([key]) => key.includes("observations"))
            .map(([key, obsValue], index) => {
              const baseKey = key.replace("_observations", "");
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <p>
                    <strong>Checkpoint:</strong> {baseKey.replace(/_/g, " ")}
                  </p>
                  <p>
                    <strong>Observations:</strong> {obsValue || ""}
                  </p>
                  <p>
                    <strong>Action By:</strong>{" "}
                    {selectedInspection?.[`${baseKey}_action_by`] || ""}
                  </p>
                  <p>
                    <strong>Remarks:</strong>{" "}
                    {selectedInspection?.[`${baseKey}_remarks`] || ""}
                  </p>
                </div>
              );
            })}

          {!selectedInspection && (
            <p className="text-center text-gray-500">
              No checkpoints available
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CraneHydraInspection;
