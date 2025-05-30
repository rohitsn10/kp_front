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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Chip,
  Stack,
} from "@mui/material";

// Image viewer component for signatures
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
import PermitToWorkDialog from "../../../components/pages/hse/permitTowork/CreatePermitToWork";
import { useGetPermitToWorkQuery } from "../../../api/hse/permitTowork/permitToworkApi";
import { useParams } from "react-router-dom";
import RevalidateModal from "../../../components/pages/hse/permitTowork/RevalidateModal";
import ApprovePermitModal from "../../../components/pages/hse/permitTowork/ApprovePermitModal";
import ReceiverPermitModal from "../../../components/pages/hse/permitTowork/ReceiverPermitModal";
import ClosurePermitModal from "../../../components/pages/hse/permitTowork/ClosurePermitModal";

const PermitToWork = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [revalidateOpen, setRevalidateOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [receiverOpen, setReceiverOpen] = useState(false);
  const [closureOpen, setClosureOpen] = useState(false);
  const [selectedPermitId, setSelectedPermitId] = useState(null);
  const { locationId } = useParams();
  const { data, isLoading, refetch } = useGetPermitToWorkQuery(
    locationId ? parseInt(locationId) : undefined
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleViewDetails = (permit) => {
    setSelectedPermit(permit);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleRevalidate = (permitId) => {
    setSelectedPermitId(permitId);
    setRevalidateOpen(true);
  };

  const handleCloseRevalidate = () => {
    setRevalidateOpen(false);
  };

  const handleApprovePermit = (permitId) => {
    setSelectedPermitId(permitId);
    setApproveOpen(true);
  };

  const handleCloseApprove = () => {
    setApproveOpen(false);
    refetch(); // Refresh data after approval
  };

  const handleAddReceiver = (permitId) => {
    setSelectedPermitId(permitId);
    setReceiverOpen(true);
  };

  const handleCloseReceiver = () => {
    setReceiverOpen(false);
    refetch(); // Refresh data after adding receiver
  };

  const handleClosurePTW = (permitId) => {
    setSelectedPermitId(permitId);
    setClosureOpen(true);
  };

  const handleCloseClosure = () => {
    setClosureOpen(false);
    refetch(); // Refresh data after closing permit
  };

  const handleRevalidateApprove = (permitId) => {
  setSelectedPermitId(permitId);
  setApproveOpen(true);
};

const handleRevalidateReceive = (permitId) => {
  setSelectedPermitId(permitId);
  setReceiverOpen(true);
};

  // Improved filtering to search across multiple fields
  const filteredPermits = (data?.data || []).filter((permit) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      permit.permit_number.toLowerCase().includes(searchLower) ||
      permit.department.toLowerCase().includes(searchLower) ||
      permit.location_area.toLowerCase().includes(searchLower) ||
      permit.type_of_permit.toLowerCase().includes(searchLower) ||
      (permit.site_name && permit.site_name.toLowerCase().includes(searchLower))
    );
  });

  // Apply pagination after filtering
  const currentRows = filteredPermits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to format time from "HH:MM:00" to "HH:MM AM/PM"
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Function to get status label with color
  const getStatusLabel = (isActive) => {
    return isActive ? (
      <Chip 
        label="Active" 
        color="success" 
        size="small"
        style={{ fontWeight: "bold" }}
      />
    ) : (
      <Chip 
        label="Inactive" 
        color="error" 
        size="small"
        style={{ fontWeight: "bold" }}
      />
    );
  };

  // Function to format permit risk type with color
  const getRiskTypeLabel = (riskType) => {
    if (riskType === "critical") {
      return <Chip label="Critical" color="error" size="small" />;
    } else if (riskType === "general") {
      return <Chip label="General" color="primary" size="small" />;
    }
    return <Chip label={riskType || "N/A"} size="small" />;
  };

  // Function to format list items from comma-separated string
  const formatListItems = (items) => {
    if (!items) return "None";
    return items.split(",").map((item) => item.trim()).join(", ");
  };
const PDFDownloader = ({ src, fileName = "signature.pdf" }) => {
  const handleDownload = () => {
    const fullUrl = `${import.meta.env.VITE_API_KEY}${src}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleDownload}
      style={{
        textTransform: 'none',
        color: '#29346B',
        borderColor: '#29346B'
      }}
    >
      Download PDF
    </Button>
  );
};
  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center">
        Permit to Work
      </h2>

      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search permits..."
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            maxWidth: "300px",
          }}
        />
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            style={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
          >
            Create Permit to Work
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Sr. No.</TableCell>
              <TableCell align="center">Permit No.</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Type of Permit</TableCell>
              <TableCell align="center">Risk Type</TableCell>
              <TableCell align="center">Valid From</TableCell>
              <TableCell align="center">Valid To</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((permit, index) => (
                <TableRow key={permit.id}>
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">{permit.permit_number}</TableCell>
                  <TableCell align="center">
                    {formatDate(permit.permit_date)}
                  </TableCell>
                  <TableCell align="center">
                    {permit.department.toUpperCase()}
                  </TableCell>
                  <TableCell align="center">
                    {permit.type_of_permit === "other" 
                      ? `${permit.type_of_permit} (${permit.other_permit_description})` 
                      : permit.type_of_permit}
                  </TableCell>
                  <TableCell align="center">
                    {getRiskTypeLabel(permit.permit_risk_type)}
                  </TableCell>
                  <TableCell align="center">
                    {formatTime(permit.permit_valid_from)}
                  </TableCell>
                  <TableCell align="center">
                    {formatTime(permit.permit_valid_to)}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusLabel(permit.is_active)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewDetails(permit)}
                      style={{
                        backgroundColor: "#29346B",
                        color: "white",
                        textTransform: "none",
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="column" spacing={1}>
                      {/* Revalidate button - kept as is */}
                      {permit.permit_risk_type === "general" && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleRevalidate(permit.id)}
                          style={{
                            backgroundColor: "#FF8C00",
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Revalidate
                        </Button>
                      )}
                      
                      {/* New Approve Permit button - only visible if issuer_done is true and approver_done is false */}
                      {permit.issuer_done && !permit.approver_done && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleApprovePermit(permit.id)}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Approve Permit
                        </Button>
                      )}
                      
                      {/* Add Receiver PTW button - only visible if approver_done is true */}
                      {permit.approver_done && !permit.receiver_done && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAddReceiver(permit.id)}
                          style={{
                            backgroundColor: "#3F51B5", // Indigo color to differentiate
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Add Receiver PTW
                        </Button>
                      )}
                      
                      {/* Closure of PTW button - only visible if receiver_done is true */}
                      {permit.receiver_done && !permit.closure_done && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleClosurePTW(permit.id)}
                          style={{
                            backgroundColor: "#9C27B0", // Purple color to differentiate
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          Closure of PTW
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredPermits.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: "1px solid #e0e0e0" }}
      />

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedPermit && (
          <>
            <DialogTitle>
              <Typography variant="h6" style={{ fontWeight: "bold", color: "#29346B" }}>
                Permit to Work Details
              </Typography>
              <Typography variant="subtitle1">
                Permit Number: {selectedPermit.permit_number}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: "#FF8C00", fontWeight: "bold" }}>
                    Basic Information
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Location:</Typography>
                  <Typography variant="body2">{selectedPermit.location_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Site Name:</Typography>
                  <Typography variant="body2">{selectedPermit.site_name}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Department:</Typography>
                  <Typography variant="body2">{selectedPermit.department.toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Location/Area:</Typography>
                  <Typography variant="body2">{selectedPermit.location_area}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Date:</Typography>
                  <Typography variant="body2">{formatDate(selectedPermit.permit_date)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Risk Type:</Typography>
                  <Typography variant="body2">
                    {getRiskTypeLabel(selectedPermit.permit_risk_type)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Valid From:</Typography>
                  <Typography variant="body2">{formatTime(selectedPermit.permit_valid_from)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Valid To:</Typography>
                  <Typography variant="body2">{formatTime(selectedPermit.permit_valid_to)}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Type of Permit:</Typography>
                  <Typography variant="body2">
                    {selectedPermit.type_of_permit === "other" 
                      ? selectedPermit.other_permit_description 
                      : selectedPermit.type_of_permit}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">External Agency:</Typography>
                  <Typography variant="body2">{selectedPermit.name_of_external_agency || "N/A"}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Job Activity Details:</Typography>
                  <Typography variant="body2">{selectedPermit.job_activity_details}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Tools & Equipment:</Typography>
                  <Typography variant="body2">{selectedPermit.tools_equipment}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: "#FF8C00", fontWeight: "bold", marginTop: "10px" }}>
                    Safety Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Hazard Considerations:</Typography>
                  <Typography variant="body2">
                    {formatListItems(selectedPermit.hazard_consideration)}
                    {selectedPermit.other_hazard_consideration && (
                      <span>, {selectedPermit.other_hazard_consideration}</span>
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Fire Protection:</Typography>
                  <Typography variant="body2">
                    {formatListItems(selectedPermit.fire_protection)}
                    {selectedPermit.other_fire_protection && (
                      <span>, {selectedPermit.other_fire_protection}</span>
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Job Preparation:</Typography>
                  <Typography variant="body2">
                    {formatListItems(selectedPermit.job_preparation)}
                    {selectedPermit.other_job_preparation && (
                      <span>, {selectedPermit.other_job_preparation}</span>
                    )}
                  </Typography>
                </Grid>
                
                {selectedPermit.risk_assessment_number && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold">Risk Assessment Number:</Typography>
                    <Typography variant="body2">{selectedPermit.risk_assessment_number}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ color: "#FF8C00", fontWeight: "bold", marginTop: "10px" }}>
                    Approval Information
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Issuer Name:</Typography>
                  <Typography variant="body2">{selectedPermit.issuer_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Issuer Status:</Typography>
                  <Typography variant="body2">
                    {selectedPermit.issuer_done ? "Completed" : "Pending"}
                  </Typography>
                </Grid>
<Grid item xs={12}>
  <Typography variant="subtitle2" fontWeight="bold">Issuer Signature:</Typography>
  {selectedPermit.issuer_sign ? (
    <PDFDownloader 
      src={selectedPermit.issuer_sign} 
      fileName="issuer_signature.pdf"
    />
  ) : (
    <Typography variant="body2">Not available</Typography>
  )}
</Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Approver Status:</Typography>
                  <Typography variant="body2">
                    {selectedPermit.approver_done ? "Completed" : "Pending"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" fontWeight="bold">Receiver Status:</Typography>
                  <Typography variant="body2">
                    {selectedPermit.receiver_done ? "Completed" : "Pending"}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Created At:</Typography>
                  <Typography variant="body2">
                    {new Date(selectedPermit.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Last Updated:</Typography>
                  <Typography variant="body2">
                    {new Date(selectedPermit.updated_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDetails} 
                color="primary"
                style={{
                  backgroundColor: "#29346B",
                  color: "white",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <PermitToWorkDialog open={openDialog} setOpen={setOpenDialog} refetch={refetch} />
      
      {/* Revalidate Modal */}
      <RevalidateModal 
        open={revalidateOpen} 
        onClose={handleCloseRevalidate} 
        permitId={selectedPermitId} 
      />

      {/* Approve Permit Modal */}
      <ApprovePermitModal
        open={approveOpen}
        onClose={handleCloseApprove}
        permitId={selectedPermitId}
      />

      {/* Receiver Permit Modal */}
      <ReceiverPermitModal
        open={receiverOpen}
        onClose={handleCloseReceiver}
        permitId={selectedPermitId}
        onApprove={handleApprovePermit}
        onReceive={handleRevalidateReceive}
      />

      {/* Closure Permit Modal */}
      <ClosurePermitModal
        open={closureOpen}
        onClose={handleCloseClosure}
        permitId={selectedPermitId}
      />
    </div>
  );
};

export default PermitToWork;