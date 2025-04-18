import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import IncidentReportDialog from "../../../components/pages/hse/first-aid/CreateFirstAid";
import { useGetAllFirstAidRecordsQuery, useGetLocationWiseFirstAidRecordsQuery } from "../../../api/hse/firstAidRecord/firstAidRecordApi";
import { useParams } from "react-router-dom";

function FirstAidRecord() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirstAid, setSelectedFirstAid] = useState(null);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  
  // Get locationId from URL params and parse it properly
  const { locationId } = useParams();
  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  
  // Log for debugging
  console.log('Location ID from URL:', locationId);
  console.log('Parsed Location ID:', parsedLocationId);
  
  // Use the query with proper skip option
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetLocationWiseFirstAidRecordsQuery(parsedLocationId, {
    // Skip the query if location ID is not valid
    skip: parsedLocationId === null || isNaN(parsedLocationId),
  });

  const firstAidRecords = response?.data || [];

  // Log the response for debugging
  useEffect(() => {
    console.log('First Aid Records Response:', response);
  }, [response]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredFirstAidRecords = firstAidRecords.filter(
    (record) =>
      (record.first_aid_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (record.designation?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (record.employee_of?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (record.site_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredFirstAidRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openDescriptionModalHandler = (record) => {
    setSelectedFirstAid(record);
    setOpenDescriptionModal(true);
  };

  // Handle creation of new record
  const handleCreateSuccess = () => {
    refetch(); // Refresh the data after creating a new record
    setCreateDialog(false);
  };

  // Display error if locationId is missing or invalid
  if (!parsedLocationId || isNaN(parsedLocationId)) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Typography variant="h6" color="error" align="center">
          Invalid location ID. Please check the URL and try again.
        </Typography>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
        <Typography variant="h6" color="error" align="center">
          Error loading first aid records. Please try again later.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => refetch()}
          className="mt-4 mx-auto block"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">
        First Aid Records
      </h2>

      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name, Designation, or Employee Of"
          variant="outlined"
        />
        <Button
          variant="contained"
          style={{
            backgroundColor: "#FF8C00",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            minHeight: "auto",
          }}
          onClick={() => setCreateDialog(true)}
        >
          Add First Aid Record
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Site Name</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Designation</TableCell>
              <TableCell align="center">Employee Of</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((record) => (
                <TableRow key={record.id}>
                  <TableCell align="center">{record.date}</TableCell>
                  <TableCell align="center">{record.site_name}</TableCell>
                  <TableCell align="center">{record.first_aid_name}</TableCell>
                  <TableCell align="center">{record.designation}</TableCell>
                  <TableCell align="center">{record.employee_of}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openDescriptionModalHandler(record)}
                    >
                      View Description
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredFirstAidRecords.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: "1px solid #e0e0e0" }}
      />

      {/* Description Modal */}
      <Dialog
        open={openDescriptionModal}
        onClose={() => setOpenDescriptionModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>First Aid Record Details</DialogTitle>
        <DialogContent>
          {selectedFirstAid && (
            <>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedFirstAid.first_aid_name}
              </Typography>
              <Typography variant="body1">
                <strong>Designation:</strong> {selectedFirstAid.designation}
              </Typography>
              <Typography variant="body1">
                <strong>Employee Of:</strong> {selectedFirstAid.employee_of}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {selectedFirstAid.date}
              </Typography>
              <Typography variant="body1">
                <strong>Site:</strong> {selectedFirstAid.site_name}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedFirstAid.location_name}
              </Typography>

              <Typography variant="h6" gutterBottom className="mt-4">
                Description
              </Typography>
              <Typography variant="body1">
                {selectedFirstAid.description}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
      <IncidentReportDialog
        open={openCreateDialog}
        setOpen={setCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

export default FirstAidRecord;