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

function MockDrillReport() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [openRecommendationsModal, setOpenRecommendationsModal] = useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openHeadCountModal, setOpenHeadCountModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dummyDrill = [
    {
      "site_plant": "Main Refinery Unit",
      "emergency_scenario": "Fire outbreak in storage area",
      "type_of_mock_drill": "Physical Practice Drill",
      "mock_drill_date": "2025-03-27",
      "mock_drill_time": "10:00 AM",
      "mock_drill_completed_time": "10:30 AM",
      "time_taken_to_complete_drill": "30 minutes",
      "drill_team_observers": {
        "team_leader_incident_controller": "John Doe",
        "performance_om_control": "Alice Johnson",
        "traffic_evacuation_assembly_point_head_count": "Robert Smith",
        "rescue_first_aid_ambulance_ppe": "Emily Brown",
        "team_member": "Michael Lee"
      },
      "table_top_records": {
        "table_top_scenario_conducted": "Fire response strategy discussion",
        "required_participation_ensured": true,
        "observers_participation": true
      },
      "control_mitigation_measures": "Fire extinguishers and emergency exits verified, response team activation tested.",
      "head_count_at_assembly_point": {
        "people_present_as_per_record": {
          "kpi_employee": 50,
          "contractor_employee": 30,
          "visitors_external_agencies": 5
        },
        "actual_participants_in_drill": {
          "kpi_employee": 45,
          "contractor_employee": 28,
          "visitors_external_agencies": 4
        },
        "people_not_participated": {
          "kpi_employee": 5,
          "contractor_employee": 2,
          "visitors_external_agencies": 1
        }
      },
      "rating_of_emergency_team_members": {
        "operation_process_control": "Very Good",
        "performance_om_control": "Excellent",
        "first_aid_ambulance_response": "Good",
        "traffic_evacuation_assembly": "Very Good",
        "communication_during_drill": "Excellent",
        "fire_fighting_team_response": "Good",
        "rescue_team_response": "Very Good"
      },
      "overall_rating": "Very Good",
      "observation": "The drill was well-coordinated, but response time for first aid could be improved.",
      "recommendations": [
        {
          "recommendation": "Improve first aid response time.",
          "responsibility": "Medical Team",
          "target_date": "2025-04-10",
          "status": "Pending",
          "action_remarks": "Scheduled additional training."
        },
        {
          "recommendation": "Enhance fire evacuation routes signage.",
          "responsibility": "Safety Team",
          "target_date": "2025-04-15",
          "status": "In Progress",
          "action_remarks": "Signage installation ongoing."
        }
      ]
    },
    {
      "site_plant": "Main Refinery Unit",
      "emergency_scenario": "Fire outbreak in storage area",
      "type_of_mock_drill": "Physical Practice Drill",
      "mock_drill_date": "2025-03-27",
      "mock_drill_time": "10:00 AM",
      "mock_drill_completed_time": "10:30 AM",
      "time_taken_to_complete_drill": "30 minutes",
      "drill_team_observers": {
        "team_leader_incident_controller": "John Doe",
        "performance_om_control": "Alice Johnson",
        "traffic_evacuation_assembly_point_head_count": "Robert Smith",
        "rescue_first_aid_ambulance_ppe": "Emily Brown",
        "team_member": "Michael Lee"
      },
      "table_top_records": {
        "table_top_scenario_conducted": "Fire response strategy discussion",
        "required_participation_ensured": true,
        "observers_participation": true
      },
      "control_mitigation_measures": "Fire extinguishers and emergency exits verified, response team activation tested.",
      "head_count_at_assembly_point": {
        "people_present_as_per_record": {
          "kpi_employee": 50,
          "contractor_employee": 30,
          "visitors_external_agencies": 5
        },
        "actual_participants_in_drill": {
          "kpi_employee": 45,
          "contractor_employee": 28,
          "visitors_external_agencies": 4
        },
        "people_not_participated": {
          "kpi_employee": 5,
          "contractor_employee": 2,
          "visitors_external_agencies": 1
        }
      },
      "rating_of_emergency_team_members": {
        "operation_process_control": "Very Good",
        "performance_om_control": "Excellent",
        "first_aid_ambulance_response": "Good",
        "traffic_evacuation_assembly": "Very Good",
        "communication_during_drill": "Excellent",
        "fire_fighting_team_response": "Good",
        "rescue_team_response": "Very Good"
      },
      "overall_rating": "Very Good",
      "observation": "The drill was well-coordinated, but response time for first aid could be improved.",
      "recommendations": [
        {
          "recommendation": "Improve first aid response time.",
          "responsibility": "Medical Team",
          "target_date": "2025-04-10",
          "status": "Pending",
          "action_remarks": "Scheduled additional training."
        },
        {
          "recommendation": "Enhance fire evacuation routes signage.",
          "responsibility": "Safety Team",
          "target_date": "2025-04-15",
          "status": "In Progress",
          "action_remarks": "Signage installation ongoing."
        }
      ]
    },
  ];
  const filteredDrills = dummyDrill.filter((drill) =>
    drill.emergency_scenario.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (drill, modalType) => {
    setSelectedDrill(drill);
    switch(modalType) {
      case 'recommendations':
        setOpenRecommendationsModal(true);
        break;
      case 'rating':
        setOpenRatingModal(true);
        break;
      case 'headCount':
        setOpenHeadCountModal(true);
        break;
      case 'details':
        setOpenDetailsModal(true);
        break;
    }
  };

  const closeModal = (modalType) => {
    switch(modalType) {
      case 'recommendations':
        setOpenRecommendationsModal(false);
        break;
      case 'rating':
        setOpenRatingModal(false);
        break;
      case 'headCount':
        setOpenHeadCountModal(false);
        break;
      case 'details':
        setOpenDetailsModal(false);
        break;
    }
    setSelectedDrill(null);
  };

  const currentRows = filteredDrills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">Mock Drill Report</h2>
      <div className="flex flex-row  flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Emergency Scenario"
            variant="outlined"
                      />
                 
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none', minHeight: 'auto' }}
                    >
                      Create Mock Drill Report
                    </Button>
                  
      </div>
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Site Plant</TableCell>
              <TableCell align="center">Emergency Scenario</TableCell>
              <TableCell align="center">Mock Drill Date</TableCell>
              <TableCell align="center">Type of Mock Drill</TableCell>
              <TableCell align="center">Overall Rating</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((drill) => (
              <TableRow key={drill.site_plant}>
                <TableCell align="center">{drill.site_plant}</TableCell>
                <TableCell align="center">{drill.emergency_scenario}</TableCell>
                <TableCell align="center">{drill.mock_drill_date}</TableCell>
                <TableCell align="center">{drill.type_of_mock_drill}</TableCell>
                <TableCell align="center">{drill.overall_rating}</TableCell>
                <TableCell align="center">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => openModal(drill, 'recommendations')}
                    >
                      Recommendations
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="small"
                      onClick={() => openModal(drill, 'rating')}
                    >
                      Team Ratings
                    </Button>
                    <Button 
                      variant="contained" 
                      color="info" 
                      size="small"
                      onClick={() => openModal(drill, 'headCount')}
                    >
                      Head Count
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small"
                      onClick={() => openModal(drill, 'details')}
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
        count={filteredDrills.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Recommendations Modal */}
      <Dialog 
        open={openRecommendationsModal} 
        onClose={() => closeModal('recommendations')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Recommendations</DialogTitle>
        <DialogContent>
          {selectedDrill && selectedDrill.recommendations.map((rec, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <Typography><strong>Recommendation:</strong> {rec.recommendation}</Typography>
              <Typography><strong>Responsibility:</strong> {rec.responsibility}</Typography>
              <Typography><strong>Target Date:</strong> {rec.target_date}</Typography>
              <Typography><strong>Status:</strong> {rec.status}</Typography>
              <Typography><strong>Action Remarks:</strong> {rec.action_remarks}</Typography>
            </div>
          ))}
        </DialogContent>
      </Dialog>

      {/* Team Ratings Modal */}
      <Dialog 
        open={openRatingModal} 
        onClose={() => closeModal('rating')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Emergency Team Members Ratings</DialogTitle>
        <DialogContent>
          {selectedDrill && Object.entries(selectedDrill.rating_of_emergency_team_members).map(([key, value]) => (
            <Typography key={key}>
              <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
            </Typography>
          ))}
        </DialogContent>
      </Dialog>

      {/* Head Count Modal */}
      <Dialog 
        open={openHeadCountModal} 
        onClose={() => closeModal('headCount')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Head Count at Assembly Point</DialogTitle>
        <DialogContent>
          {selectedDrill && (
            <>
              <Typography variant="h6">People Present as per Record</Typography>
              {Object.entries(selectedDrill.head_count_at_assembly_point.people_present_as_per_record).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                </Typography>
              ))}
              <Typography variant="h6" className="mt-4">Actual Participants</Typography>
              {Object.entries(selectedDrill.head_count_at_assembly_point.actual_participants_in_drill).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                </Typography>
              ))}
              <Typography variant="h6" className="mt-4">People Not Participated</Typography>
              {Object.entries(selectedDrill.head_count_at_assembly_point.people_not_participated).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                </Typography>
              ))}
            </>
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
        <DialogContent sx={
          {
            paddingY:"30px"
          }
        }>
          {selectedDrill && (
            <>  
              <div className='flex flex-col gap-4'>
                <div>
                  <Typography><strong>Mock Drill Time:</strong> {selectedDrill.mock_drill_time}</Typography>
                  <Typography><strong>Completed Time:</strong> {selectedDrill.mock_drill_completed_time}</Typography>
                  <Typography><strong>Time Taken:</strong> {selectedDrill.time_taken_to_complete_drill}</Typography>
                  <Typography><strong>Observation:</strong> {selectedDrill.observation}</Typography>
                </div>
                <div>
                <Typography variant="h6" className="mt-4">Drill Team Observers</Typography>
                {Object.entries(selectedDrill.drill_team_observers).map(([key, value]) => (
                  <Typography key={key}>
                    <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                  </Typography>
                ))}
                </div>
                <div>
                <Typography variant="h6" className="mt-4">Table Top Records</Typography>
                {Object.entries(selectedDrill.table_top_records).map(([key, value]) => (
                  <Typography key={key}>
                    <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value.toString()}
                  </Typography>
                ))}
                </div>
                <div>
                <Typography><strong>Control Mitigation Measures:</strong> 
                {selectedDrill.control_mitigation_measures}</Typography>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MockDrillReport;