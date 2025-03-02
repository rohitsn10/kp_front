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
} from '@mui/material';
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
  const { data, isLoading, error ,refetch} = useGetMilestoneQuery(projectId);
  const navigate = useNavigate();
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

  // Filter milestones based on the search query
  const filteredRows = milestoneRows.filter((row) =>
    row.milestone_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleViewMilestone = (id)=>{
    navigate(`/milestone-view/${id}`)
  }

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
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Payment</TableCell>
              {/* <TableCell align="center">Manage Milestone</TableCell>
              <TableCell align="center">View Milestone</TableCell> */}
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

                  {/* <TableCell align="center">{row.project_sub_activity.length > 0 ? row.project_sub_activity.join(', ') : 'N/A'}</TableCell> */}
                  <TableCell align="center">{new Date(row.start_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{new Date(row.end_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                  {/* in_progress */}
                  {/* {row.milestone_status} */}
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
                  <TableCell align="center">
                  {row.milestone_status === 'pending' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        // onClick={() => handleUpdateStatus(row.id, 'in_progress')}
                      >
                        Manage
                      </Button>
                    )}
                    {row.milestone_status === 'in_progress' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        // onClick={() => handleUpdateStatus(row.id, 'success')}
                        style={{ marginLeft: '10px' }}
                      >
                        Completed
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    
                    <Chip 
                    onClick={()=>{
                      console.log(row)
                      navigate(`/project/milestone-view/payment/${row.id}`)
                    }} 
                    variant="filled" label="Payment" color="success" />
                    
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
