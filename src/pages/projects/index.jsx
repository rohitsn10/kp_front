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
  TablePagination,
  CircularProgress,
  TextField,
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import { AiOutlineStop } from 'react-icons/ai';
import ProjectCreate from '../../components/pages/projects/ProjectMain/ProjectCreate';
import ProjectUpdate from '../../components/pages/projects/ProjectMain/ProjectUpdate';
import { useGetMainProjectsQuery } from '../../api/users/projectApi';
import { useNavigate } from 'react-router-dom';
import ProjectWpo from '../../components/pages/projects/ProjectWPO/ProjectWpo';

const dummyProjects = [
  { id: 1, name: "Project Alpha", activity: "Design", deadline: "2025-03-01", estimatedCompletion: "2 months", contactPerson: "John Doe", status: "Ongoing" },
  { id: 2, name: "Project Beta", activity: "Development", deadline: "2025-06-15", estimatedCompletion: "4 months", contactPerson: "Jane Smith", status: "Pending" },
  { id: 3, name: "Project Gamma", activity: "Testing", deadline: "2025-09-30", estimatedCompletion: "1 month", contactPerson: "Alice Brown", status: "Completed" },
];

const ProjectListingTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projectFilter,setProjectFilter] = useState("");
  const [createModal,setCreateModal] = useState(false);
  const [updateModal,setUpdateModal] = useState(false);
  const [openWpoModal,setOpenWpoModal]=useState(false);
  const [activeProject,setActiveProject]=useState();
  const {data:projectData,isLoading:ProjectLoading,error:ProjectError,refetch} = useGetMainProjectsQuery()
  // console.log(projectData?.data)
const navigate = useNavigate();
  const handleCloseCreateModal = ()=>{
    setCreateModal(false)
  }
  const handleCloseUpdateModal = ()=>{
    setCreateModal(false)
  }
  const handleCloseWpoModal = ()=>{
    setOpenWpoModal(false)
    setActiveProject(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const currentRows = projectData?.data?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[80%] mx-auto my-8 rounded-md pt-5">
      <div className="grid grid-cols-3 items-center p-4 mb-5">
      <TextField
  value={projectFilter}
  placeholder="Search"
  onChange={(e) => setProjectFilter(e.target.value?.toLowerCase())}  // Ensure lowercase search
  variant="outlined"
  size="small"
  style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '200px' }}
/>

        <h2 className="text-3xl text-[#29346B] font-semibold text-center">Project Listing</h2>
        <div className="flex justify-end">
          <Button
            variant="contained"
            style={{ backgroundColor: '#FF8C00', maxWidth: '200px', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
            onClick={() => setCreateModal(!createModal)}
          >
            Add Project
          </Button>
        </div>
      </div>
  
      {/* Show loading state */}
      {ProjectLoading && (
        <div className="flex justify-center my-10">
          <CircularProgress />
        </div>
      )}
  
      {/* Show error state */}
      {ProjectError && (
        <div className="text-red-500 text-center my-5">
          <p>Failed to load projects. Please try again later.</p>
        </div>
      )}
  
      {/* Show table only when data is available */}
      {!ProjectLoading && !ProjectError && projectData?.data?.length > 0 && (
        <>
          <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#F2EDED' }}>
                <TableCell align="center" width={50}>Sr No.</TableCell>
        <TableCell align="center" width={180}>Project Name</TableCell>
        <TableCell align="center" width={150}>Activity</TableCell>
        <TableCell align="center" width={130}>Deadline</TableCell>
        <TableCell align="center" width={150}>Alloted Land Area</TableCell>
        <TableCell align="center" width={180}>LandBank Name</TableCell>
        <TableCell align="center" width={120}>Action</TableCell>
        <TableCell align="center" width={220}>Expense</TableCell>
        <TableCell align="center" width={220}>Add Client Details</TableCell>
        <TableCell align="center" width={220}>View Client Details</TableCell>
        <TableCell align="center" width={220}>Add WO PO</TableCell>
        <TableCell align="center" width={220}>View WO PO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows?.map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell align="center">{project.project_name}</TableCell>
                    <TableCell align="center" sx={{minWidth: '100px'}}>{project.project_activity_name}</TableCell>
                    <TableCell align="center">{project.end_date}</TableCell>
                    <TableCell align="center" sx={{minWidth: '100px'}}>{project.alloted_land_area}</TableCell>
                    <TableCell align="center">{project.landbank_name}</TableCell>
                    {/* <TableCell align="center">{project.status}</TableCell> */}
                    <TableCell align="center" 
                    style={{ display: 'flex', justifyContent: 'center',alignItems:'center', gap: 10 }}
                    >
                      <RiEditFill
                        style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                        title="Edit"
                      />
                      <AiOutlineStop
                        style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                        title="Delete"
                      />
                    </TableCell>
                    <TableCell align="center">
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: '100px' }}
          size="small"
          onClick={() => {
            navigate(`/project/expense/${project?.id}`)
            }}
        >
          Expense
        </Button>
      </TableCell>

      {/* Client Details Button */}
      <TableCell align="center">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          sx={{
            fontSize:'11px',
            padding:'4px',
            minWidth: '100px'
          }}
          onClick={() => {
            navigate(`/project/client_details/${project?.id}`)
            }}        >
        Add Client Details
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          sx={{
            fontSize:'11px',
            padding:'4px',
            minWidth: '100px'
          }}
          onClick={() => {
            navigate(`/project/client_details/${project?.id}`)
            }}        >
        View Client Details
        </Button>
      </TableCell>

      {/* WO PO Button */}
      <TableCell align="center">
        <Button
          variant="contained"
          style={{ backgroundColor: '#FF8C00',
           color: 'white',minWidth: '100px' }}
          size="small"
          onClick={() => {
            setOpenWpoModal(true)
            setActiveProject(project?.id)
          }}
        >
         Add WOPO
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white',minWidth: '110px' }}
          size="small"
          onClick={() => {
            setOpenWpoModal(true)
            setActiveProject(project?.id)
          }}
        >
         View WOPO
        </Button>
      </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={projectData?.data?.length || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            style={{ borderTop: '1px solid #e0e0e0' }}
          />
        </>
      )}
  
      <ProjectCreate open={createModal} handleClose={handleCloseCreateModal} />
      <ProjectUpdate open={updateModal} handleClose={handleCloseUpdateModal} />
      <ProjectWpo open={openWpoModal} 
      projectId={activeProject}
      handleClose={handleCloseWpoModal}
        refetch={refetch}
      />
    </div>
  );
  
};

export default ProjectListingTable;
