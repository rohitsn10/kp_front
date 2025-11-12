import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGetMilestoneQuery } from '../../../api/milestone/milestoneApi';
import MilestoneModal from '../../../components/pages/milestones/addMilestone';

function ProjectMilestonePage() {
  const { projectId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  
  // New state for activities modal
  const [activitiesModalOpen, setActivitiesModalOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const { data, isLoading, error, refetch } = useGetMilestoneQuery(projectId);
  const navigate = useNavigate();

  // Function to open activities modal
  const handleViewActivities = (progressDetails) => {
    setSelectedActivities(progressDetails);
    setActivitiesModalOpen(true);
  };

  // Function to close activities modal
  const handleCloseActivities = () => {
    setActivitiesModalOpen(false);
    setSelectedActivities([]);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">Failed to load milestones. Please try again later.</Alert>
      </div>
    );
  }

  const milestoneRows = data?.data || [];
  const filteredRows = milestoneRows.filter((row) =>
    row.milestone_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleViewMilestone = (id) => {
    navigate(`/milestone-view/${id}`);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[80%] mx-auto my-8 rounded-md">
      <div className="flex flex-row justify-around items-center py-6 mx-10">
        <TextField
          label="Search Milestone"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-4"
        />

        <h2 className="text-3xl text-[#29346B] font-semibold text-center">
          Project Milestones
        </h2>
        <Button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
            padding: '10px'
          }}
        >
          Add Milestone
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Milestone Name</TableCell>
              <TableCell align="center">Milestone Description</TableCell>
              <TableCell align="center">Project Activity</TableCell>
              <TableCell align="center">Sub Activity</TableCell>
              <TableCell align="center">Start Date</TableCell>
              <TableCell align="center">End Date</TableCell>
              <TableCell align="center">Milestone Status</TableCell>
              <TableCell align="center">Activities</TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Payment</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{row.milestone_name}</TableCell>
                  <TableCell align="center">{row.milestone_description}</TableCell>
                  <TableCell align="center">{row.project_main_activity_name || 'N/A'}</TableCell>
                  <TableCell align="center">Sub Activity 1</TableCell>
                  <TableCell align="center">{new Date(row.start_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{new Date(row.end_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    {row.milestone_status === "pending" && (
                      <Chip variant="outlined" label="Pending" color="warning" />
                    )}
                    {row.milestone_status === "completed" && (
                      <Chip variant="outlined" label="Success" color="success" />
                    )}
                    {row.milestone_status === "in_progress" && (
                      <Chip variant="outlined" label="Draft" color="primary" />
                    )}
                  </TableCell>
                  
                  {/* New Activities Column */}
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleViewActivities(row.project_progress_details)}
                      disabled={!row.project_progress_details || row.project_progress_details.length === 0}
                    >
                      View Activities ({row.project_progress_details?.length || 0})
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/project/milestone-view/${row.id}`)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                  <TableCell align='center'>
                    <Chip 
                      onClick={() => {
                        console.log(row)
                        navigate(`/project/milestone-view/payment/${row.id}`)
                      }} 
                      variant="filled" 
                      label="Payment" 
                      color="success" 
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No milestones found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Activities Modal */}
      <Dialog
        open={activitiesModalOpen}
        onClose={handleCloseActivities}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Project Progress Activities
          <IconButton
            aria-label="close"
            onClick={handleCloseActivities}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow style={{ backgroundColor: '#F2EDED' }}>
                  <TableCell><strong>Sr No.</strong></TableCell>
                  <TableCell><strong>Particulars</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>UOM</strong></TableCell>
                  <TableCell><strong>Qty</strong></TableCell>
                  <TableCell><strong>Cumulative</strong></TableCell>
                  <TableCell><strong>Today Qty</strong></TableCell>
                  <TableCell><strong>% Complete</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>Target Date</strong></TableCell>
                  <TableCell><strong>Days to Deadline</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedActivities.map((activity, index) => (
                  <TableRow key={activity.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{activity.particulars}</TableCell>
                    <TableCell>
                      <Chip 
                        label={activity.status} 
                        color={getStatusColor(activity.status)} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{activity.uom}</TableCell>
                    <TableCell>{activity.qty}</TableCell>
                    <TableCell>{activity.cumulative_completed}</TableCell>
                    <TableCell>{activity.today_qty}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${activity.percent_completion}%`} 
                        color={activity.percent_completion === 100 ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{activity.scheduled_start_date}</TableCell>
                    <TableCell>{activity.targeted_end_date}</TableCell>
                    <TableCell>
                      <span style={{ color: parseInt(activity.days_to_deadline) < 0 ? 'red' : 'green' }}>
                        {activity.days_to_deadline} days
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActivities} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <MilestoneModal
        open={open}
        setOpen={setOpen}
        refetch={refetch}
        projectId={projectId}
      />
    </div>
  );
}

export default ProjectMilestonePage;
