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
} from "@mui/material";
import CreateIncidentNearMiss from "../../../components/pages/hse/incidentNearMiss/CreateIncidentNearMiss";
import { useParams } from "react-router-dom";
import { useGetIncidentNearMissInvestigationQuery } from "../../../api/hse/incidentNearmissInvestigation/incidentNearmissInvestigationApi";

const ImageViewer = ({ src, alt, width = 100, height = 30 }) => {
  const [open, setOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_API_KEY || '';
  const fullImageUrl = src && !src.startsWith('http') ? `${baseUrl}${src}` : src;

  return (
    <>
      <img
        src={fullImageUrl}
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
            src={fullImageUrl}
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

const IncidentInvestigation = () => {
  const { locationId } = useParams();
  const parsedLocationId = locationId ? parseInt(locationId, 10) : null;
  
  const { 
    data: apiResponse, 
    isLoading, 
    isError,
    refetch 
  } = useGetIncidentNearMissInvestigationQuery(parsedLocationId, {
    // Skip the query if locationId is null/invalid
    skip: parsedLocationId === null || isNaN(parsedLocationId),
  });

  const incidentData = apiResponse?.data || [];
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [openPreventiveActionDialog, setOpenPreventiveActionDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openCommitteeMembersDialog, setOpenCommitteeMembersDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);

  const handleOpenPreventiveActionDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenPreventiveActionDialog(true);
  };

  const handleOpenDetailsDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenDetailsDialog(true);
  };

  const handleOpenCommitteeMembersDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenCommitteeMembersDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedIncident(null);
    setOpenPreventiveActionDialog(false);
    setOpenDetailsDialog(false);
    setOpenCommitteeMembersDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredIncidents = incidentData.filter((incident) =>
    incident.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredIncidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format the date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center">
        Incident Investigation
      </h2>

      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Site Name or Description"
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            maxWidth: "300px",
          }}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => setCreateDialog(true)}
            variant="contained"
            style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          >
            Add Incident Investigation
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : isError ? (
        <div className="text-center py-4 text-red-500">Error loading data. Please try again.</div>
      ) : (
        <>
          <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#F2EDED" }}>
                  <TableCell align="center">Sr No</TableCell>
                  <TableCell align="center">Site Name</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Date of Occurrence</TableCell>
                  <TableCell align="center">Date of Report</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Preventive Actions</TableCell>
                  <TableCell align="center">Committee Members</TableCell>
                  <TableCell align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((incident, index) => (
                    <TableRow key={incident.id}>
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="center">{incident.site_name}</TableCell>
                      <TableCell align="center">{incident.category}</TableCell>
                      <TableCell align="center">
                        {formatDate(incident.date_of_occurrence)}
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(incident.date_of_report)}
                      </TableCell>
                      <TableCell align="center">
                        <span 
                          className={`px-2 py-1 rounded-md text-white ${
                            incident.user_status === 'under review' 
                              ? 'bg-yellow-500' 
                              : incident.user_status === 'approved' 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}
                        >
                          {incident.user_status}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenPreventiveActionDialog(incident)}
                        >
                          View Actions
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={() => handleOpenCommitteeMembersDialog(incident)}
                        >
                          View Members
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleOpenDetailsDialog(incident)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No incidents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredIncidents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            style={{ borderTop: "1px solid #e0e0e0" }}
          />
        </>
      )}

      {/* Preventive Actions Dialog */}
      <Dialog open={openPreventiveActionDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Preventive Actions</DialogTitle>
        <DialogContent>
          {selectedIncident?.recommendation_for_preventive_action && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Responsibility</TableCell>
                  <TableCell>Target Date</TableCell>
                  <TableCell>Close Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(selectedIncident.recommendation_for_preventive_action).map(([key, action]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{action.description}</TableCell>
                    <TableCell>{action.responsibility}</TableCell>
                    <TableCell>{formatDate(action.target_date)}</TableCell>
                    <TableCell>{formatDate(action.close_date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Committee Members Dialog */}
      <Dialog open={openCommitteeMembersDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Committee Members</DialogTitle>
        <DialogContent>
          {selectedIncident?.committee_members && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Rank</TableCell>
                  <TableCell>Signature</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedIncident.committee_members.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.rank}</TableCell>
                    <TableCell>
                      <ImageViewer 
                        src={member.signature} 
                        alt={`${member.name}'s signature`} 
                        width={100} 
                        height={40}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Incident Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Incident Details</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <p><strong>Description:</strong> {selectedIncident?.description}</p>
            <p><strong>Investigation Findings:</strong> {selectedIncident?.investigation_findings}</p>
            <p><strong>Physical Factor:</strong> {selectedIncident?.physical_factor}</p>
            <p><strong>Human Factor:</strong> {selectedIncident?.human_factor}</p>
            <p><strong>System Factor:</strong> {selectedIncident?.system_factor}</p>
            <p><strong>Created At:</strong> {formatDate(selectedIncident?.created_at)}</p>
            <p><strong>Updated At:</strong> {formatDate(selectedIncident?.updated_at)}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <CreateIncidentNearMiss
        open={createDialog}
        setOpen={setCreateDialog}
        onSuccess={refetch}
      />
    </div>
  );
};

export default IncidentInvestigation;