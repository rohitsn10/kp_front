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

const IncidentInvestigation = () => {
  const dummyIncidents = [
    {
      "name_of_site": "ABC Construction Site",
      "location": "Downtown, City A",
      "date_of_occurrence": "2025-03-25",
      "date_of_report": "2025-03-26",
      "category": "Incident",
      "title_of_incident_near_miss": "Scaffolding Collapse",
      "description_of_incident_near_miss": "A scaffolding structure collapsed due to high winds, resulting in minor injuries to two workers.",
      "investigation_findings": "The structure was not adequately secured, and safety measures were not fully implemented.",
      "root_causes": [
        {
          "sr": 1,
          "description": "Improper securing of scaffolding",
          "responsibility": "Site Supervisor",
          "target_date": "2025-04-05"
        },
        {
          "sr": 2,
          "description": "Lack of routine safety inspections",
          "responsibility": "Safety Officer",
          "target_date": "2025-04-10"
        }
      ],
      "committee_members": [
        {
          "name": "John Doe",
          "rank": "Site Manager"
        },
        {
          "name": "Jane Smith",
          "rank": "HSE Officer"
        }
      ],
      "remark": "Immediate corrective actions have been implemented, and additional safety training is scheduled."
    },
    {
      "name_of_site": "XYZ Warehouse",
      "location": "Industrial Zone, City B",
      "date_of_occurrence": "2025-03-20",
      "date_of_report": "2025-03-22",
      "category": "Near Miss",
      "title_of_incident_near_miss": "Forklift Collision Avoided",
      "description_of_incident_near_miss": "A worker narrowly avoided being hit by a reversing forklift due to a lack of proper warning signals.",
      "investigation_findings": "The forklift operator did not use the horn, and the pedestrian walkway was not clearly marked.",
      "root_causes": [
        {
          "sr": 1,
          "description": "Lack of warning signals from forklift operator",
          "responsibility": "Warehouse Supervisor",
          "target_date": "2025-04-01"
        },
        {
          "sr": 2,
          "description": "Inadequate pedestrian safety markings",
          "responsibility": "Facility Manager",
          "target_date": "2025-04-07"
        }
      ],
      "committee_members": [
        {
          "name": "Mike Johnson",
          "rank": "Operations Manager"
        },
        {
          "name": "Sara Lee",
          "rank": "Safety Coordinator"
        }
      ],
      "remark": "Improved safety markings and forklift operator training scheduled."
    },
    {
      "name_of_site": "DEF Refinery",
      "location": "Port Area, City C",
      "date_of_occurrence": "2025-03-18",
      "date_of_report": "2025-03-19",
      "category": "Incident",
      "title_of_incident_near_miss": "Gas Leak in Storage Unit",
      "description_of_incident_near_miss": "A minor gas leak was detected in one of the storage tanks. The issue was identified before it could cause harm.",
      "investigation_findings": "Faulty valve detected in routine maintenance check.",
      "root_causes": [
        {
          "sr": 1,
          "description": "Aging equipment with worn-out seals",
          "responsibility": "Maintenance Lead",
          "target_date": "2025-04-12"
        }
      ],
      "committee_members": [
        {
          "name": "Robert Brown",
          "rank": "Plant Supervisor"
        },
        {
          "name": "Emily Clark",
          "rank": "Safety Inspector"
        }
      ],
      "remark": "Scheduled replacement of faulty equipment."
    },
    {
      "name_of_site": "GHI Manufacturing Unit",
      "location": "Tech Park, City D",
      "date_of_occurrence": "2025-03-15",
      "date_of_report": "2025-03-16",
      "category": "Near Miss",
      "title_of_incident_near_miss": "Loose Electrical Wiring",
      "description_of_incident_near_miss": "A worker noticed sparking near an electrical panel, preventing a potential fire hazard.",
      "investigation_findings": "Loose connections in the wiring caused overheating.",
      "root_causes": [
        {
          "sr": 1,
          "description": "Poor electrical maintenance",
          "responsibility": "Electrical Engineer",
          "target_date": "2025-04-03"
        }
      ],
      "committee_members": [
        {
          "name": "David Wilson",
          "rank": "Facility Head"
        },
        {
          "name": "Nancy Adams",
          "rank": "HSE Auditor"
        }
      ],
      "remark": "Inspection and re-tightening of electrical connections completed."
    }
  ]
  const { locationId } = useParams();
    const { 
      data, 
      isLoading, 
      isError, 
      error 
    } = useGetIncidentNearMissInvestigationQuery(locationId);
console.log(data)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [openRootCauseDialog, setOpenRootCauseDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [createDialog,setCreateDialog]=useState(false)

  const handleOpenRootCauseDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenRootCauseDialog(true);
  };

  const handleOpenDetailsDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedIncident(null);
    setOpenRootCauseDialog(false);
    setOpenDetailsDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredIncidents = dummyIncidents.filter((incident) =>
    incident.title_of_incident_near_miss
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredIncidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center">
        Incident Investigation
      </h2>

      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Title"
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
          onClick={()=>setCreateDialog(true)}
            variant="contained"
            style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          >
            Add Incident Investigation
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Sr No</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Name of Site</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Date of Occurrence</TableCell>
              <TableCell align="center">Date of Report</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Root Causes</TableCell>
              <TableCell align="center">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((incident, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center">
                  {incident.title_of_incident_near_miss}
                </TableCell>
                <TableCell align="center">{incident.name_of_site}</TableCell>
                <TableCell align="center">{incident.location}</TableCell>
                <TableCell align="center">
                  {incident.date_of_occurrence}
                </TableCell>
                <TableCell align="center">{incident.date_of_report}</TableCell>
                <TableCell align="center">{incident.category}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenRootCauseDialog(incident)}
                  >
                    View Root Causes
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
        style={{ borderTop: "1px solid #e0e0e0" }}
      />

      {/* Root Causes Dialog */}
      <Dialog open={openRootCauseDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Root Causes</DialogTitle>
        <DialogContent>
          {selectedIncident?.root_causes && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Responsibility</TableCell>
                  <TableCell>Target Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedIncident.root_causes.map((cause) => (
                  <TableRow key={cause.sr}>
                    <TableCell>{cause.sr}</TableCell>
                    <TableCell>{cause.description}</TableCell>
                    <TableCell>{cause.responsibility}</TableCell>
                    <TableCell>{cause.target_date}</TableCell>
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
      <Dialog open={openDetailsDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Incident Details</DialogTitle>
        <DialogContent>
          <p><strong>Description:</strong> {selectedIncident?.description_of_incident_near_miss}</p>
          <p><strong>Findings:</strong> {selectedIncident?.investigation_findings}</p>
          <p><strong>Remarks:</strong> {selectedIncident?.remark}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <CreateIncidentNearMiss
        open={createDialog}
        setOpen={setCreateDialog}
      />
    </div>
  );
};

export default IncidentInvestigation;
