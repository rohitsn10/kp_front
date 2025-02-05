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

  const handleCloseCreateModal = ()=>{
    setCreateModal(false)
  }
  const handleCloseUpdateModal = ()=>{
    setCreateModal(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = dummyProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md pt-5">
      {/* <div className='grid grid-cols-3 col- p-4 '>
                        <TextField
                            value={projectFilter}
                            placeholder="Search"
                            onChange={(e) => setProjectFilter(e.target.value)}
                            variant="outlined"
                            size="small"
                            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px',maxWidth:'200px' , }}
                        />
        <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-4">Project Listing</h2>
            <Button
                          variant="contained"
                          style={{ backgroundColor: '#FF8C00', maxWidth:'200px' ,color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
                          onClick={() => setOpen(!open)}
                      >
              Add Projects
          </Button>
      </div> */}
      <div className="grid grid-cols-3 items-center p-4 mb-5">
        <TextField
          value={projectFilter}
          placeholder="Search"
          onChange={(e) => setProjectFilter(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '200px' }}
        />
        <h2 className="text-3xl text-[#29346B] font-semibold text-center">Project Listing</h2>
        <div className="flex justify-end">
          <Button
            variant="contained"
            style={{ backgroundColor: '#FF8C00', maxWidth: '200px', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
            onClick={()=>setCreateModal(!createModal)}
          >
            Add Project
          </Button>
        </div>
      </div>


      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Project Name</TableCell>
              <TableCell align="center">Activity</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Est. time of Completion</TableCell>
              <TableCell align="center">Contact Person</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell align="center">{project.name}</TableCell>
                <TableCell align="center">{project.activity}</TableCell>
                <TableCell align="center">{project.deadline}</TableCell>
                <TableCell align="center">{project.estimatedCompletion}</TableCell>
                <TableCell align="center">{project.contactPerson}</TableCell>
                <TableCell align="center">{project.status}</TableCell>
                <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <RiEditFill
                    style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                    title="Edit"
                  />
                  <AiOutlineStop
                    style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                    title="Delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={dummyProjects.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />
      <ProjectCreate  open={createModal} handleClose={handleCloseCreateModal}/>
      <ProjectUpdate open={updateModal} handleClose={handleCloseUpdateModal}/>
      
    </div>
  );
};

export default ProjectListingTable;
