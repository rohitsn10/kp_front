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
  TextField
} from '@mui/material';
import ImageViewer from '../../../utils/signatureViewer';
import IncidentNearMissReportDialog from '../../../components/pages/hse/incident-report/CreateIncidentReport';
import { useGetIncidentNearmissReportQuery } from '../../../api/hse/incidentReport/incidentReportApi';
import { useParams } from 'react-router-dom';
// import CreateIncidentReport from '../../../components/pages/hse/incident-report/CreateIncidentReport';

// Reusable Image Viewer Component

function IncidentReport() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCreateDialog, setCreateDialog] = useState(false);
  const {locationId} = useParams();
  const skipQuery = !locationId || isNaN(parseInt(locationId));
   const { data, isLoading, error, refetch } = useGetIncidentNearmissReportQuery(
      parseInt(locationId), 
      { skip: skipQuery }
    );
    const incidentReports = data?.data?.map((item) => ({
      name_of_site: item.site_name,
      location: item.location,
      date_of_occurrence: item.date_of_occurrence?.split("T")[0],
      date_of_report: item.date_of_report?.split("T")[0],
      incident_near_miss_reported_by: item.reported_by,
      designation: item.designation,
      employee_code: item.employee_code,
      vendor_name: item.vendor_name,
      category: item.category,
      description_of_incident_near_miss: item.description,
      immediate_action_taken: item.immediate_action_taken,
      apparent_cause: item.apparent_cause,
      preventive_action: item.preventive_action,
      review_by_members: [
        { name: item.member_1, signature: item.member_1_sign },
        { name: item.member_2, signature: item.member_2_sign },
        { name: item.member_3, signature: item.member_3_sign },
      ],
      review_by_site_in_charge: {
        name: item.site_incharge_name,
        designation: item.site_incharge_designation,
        signature: item.site_incharge_sign,
      },
    })) || [];
    

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredIncidents = incidentReports.filter((incident) =>
    incident.name_of_site?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.location?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.incident_near_miss_reported_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const currentRows = filteredIncidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openDetailsModalHandler = (incident) => {
    setSelectedIncident(incident);
    setOpenDetailsModal(true);
  };
  if (isLoading) return <Typography>Loading incident reports...</Typography>;
  if (error) return <Typography color="error">Error fetching data</Typography>;
  
  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Incident Reports</h2>
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Site, Location, Category, or Reporter"
          variant="outlined"
        />
        <Button
          onClick={() => setCreateDialog(true)}
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
        >
          Add Incident Report
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Date of Occurrence</TableCell>
              <TableCell align="center">Reported By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((incident, index) => (
              <TableRow key={index}>
                <TableCell align="center">{incident.name_of_site}</TableCell>
                <TableCell align="center">{incident.location}</TableCell>
                <TableCell align="center">{incident.category}</TableCell>
                <TableCell align="center">{incident.date_of_occurrence}</TableCell>
                <TableCell align="center">{incident.incident_near_miss_reported_by}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openDetailsModalHandler(incident)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Incident Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Incident Report Details</DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Typography><strong>Site:</strong> {selectedIncident.name_of_site}</Typography>
                <Typography><strong>Location:</strong> {selectedIncident.location}</Typography>
                <Typography><strong>Date of Occurrence:</strong> {selectedIncident.date_of_occurrence}</Typography>
                <Typography><strong>Date of Report:</strong> {selectedIncident.date_of_report}</Typography>
                <Typography><strong>Category:</strong> {selectedIncident.category}</Typography>
                <Typography><strong>Reported By:</strong> {selectedIncident.incident_near_miss_reported_by}</Typography>
                <Typography><strong>Designation:</strong> {selectedIncident.designation}</Typography>
                <Typography><strong>Employee Code:</strong> {selectedIncident.employee_code}</Typography>
                <Typography><strong>Vendor:</strong> {selectedIncident.vendor_name}</Typography>
              </div>
              
              <div className="mt-4">
                <Typography variant="h6">Description</Typography>
                <Typography>{selectedIncident.description_of_incident_near_miss}</Typography>
              </div>
              
              <div className="mt-4">
                <Typography variant="h6">Immediate Action Taken</Typography>
                <Typography>{selectedIncident.immediate_action_taken}</Typography>
              </div>
              
              <div className="mt-4">
                <Typography variant="h6">Apparent Cause</Typography>
                <Typography>{selectedIncident.apparent_cause}</Typography>
              </div>
              
              <div className="mt-4">
                <Typography variant="h6">Preventive Action</Typography>
                <Typography>{selectedIncident.preventive_action}</Typography>
              </div>
              
              <div className="mt-6">
                <Typography variant="h6">Review By Members</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {selectedIncident.review_by_members.map((member, idx) => (
                    <div key={idx} className="p-3 border rounded">
                      <Typography><strong>Name:</strong> {member.name}</Typography>
                      <Typography><strong>Signature:</strong></Typography>
                      <ImageViewer
                        src={member.signature}
                        alt={`${member.name} Signature`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Typography variant="h6">Review By Site In-Charge</Typography>
                <div className="p-3 border rounded mt-2">
                  <Typography><strong>Name:</strong> {selectedIncident.review_by_site_in_charge.name}</Typography>
                  <Typography><strong>Designation:</strong> {selectedIncident.review_by_site_in_charge.designation}</Typography>
                  <Typography><strong>Signature:</strong></Typography>
                  <ImageViewer
                    src={selectedIncident.review_by_site_in_charge.signature}
                    alt={`${selectedIncident.review_by_site_in_charge.name} Signature`}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <IncidentNearMissReportDialog
                open={openCreateDialog}
                setOpen={setCreateDialog}
      />
      {/* <CreateIncidentReport
        open={openCreateDialog}
        setOpen={setCreateDialog}
      /> */}
    </div>
  );
}

export default IncidentReport;