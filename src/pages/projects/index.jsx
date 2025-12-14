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
    Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ProjectCreate from '../../components/pages/projects/ProjectMain/ProjectCreate';
import ProjectUpdate from '../../components/pages/projects/ProjectMain/ProjectUpdate';
import { useGetMainProjectsQuery } from '../../api/users/projectApi';
import { useNavigate } from 'react-router-dom';
import ProjectWpo from '../../components/pages/projects/ProjectWPO/ProjectWpo';
import ProjectWpoViewModal from '../../components/pages/projects/ProjectWPO/ProjectWpoView';
import ProjectDrawingUploadDialog from '../design-documents/DesignUploadModal';
import ProjectRoleAssignmentModal from './project-role-assignment/ProjectRoleAssignmentModal';
import ProjectRoleViewModal from './project-role-view/ProjectRoleViewModal';
import ProjectActivityUploadDialog from '../../components/pages/projects/ProjectActivity/ProjectActivityUploadDialog';
import { useDeleteActivitySheetMutation } from '../../api/users/projectActivityApi';
// import ProjectRoleAssignmentModal from './ProjectRoleAssignmentModal'; // Import the new modal
// ProjectRoleAssignmentModal
const ProjectListingTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projectFilter, setProjectFilter] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [openWpoModal, setOpenWpoModal] = useState(false);
  const [activeProject, setActiveProject] = useState();
  const { data: projectData, isLoading: ProjectLoading, error: ProjectError, refetch } = useGetMainProjectsQuery()
  const [openWpoViewModal, setOpenWpoView] = useState(false);
  const [openDrawingModal, setOpenDrawingModal] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);
  // New state for role assignment modal
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedProjectForRole, setSelectedProjectForRole] = useState(null);

// 2. STATE VARIABLES - Add these to your existing useState declarations
const [openRoleViewModal, setOpenRoleViewModal] = useState(false);
const [selectedProjectForRoleView, setSelectedProjectForRoleView] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteActivitySheet, { isLoading: isDeleting }] = useDeleteActivitySheetMutation();
  // 3. ADD HANDLERS FOR DELETION
  const handleOpenDeleteDialog = (projectId) => {
    setActiveProject(projectId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setActiveProject(null);
  };

    const handleConfirmDelete = async () => {
    if (activeProject) {
      try {
        await deleteActivitySheet(activeProject).unwrap();
        // Close modal
        handleCloseDeleteDialog();
        // Refresh the table data
        refetch(); 
        console.log("Activity sheet deleted");
      } catch (error) {
        console.error("Failed to delete activity sheet", error);
        alert("Failed to delete: " + (error?.data?.message || "Unknown error"));
      }
    }
  };

  const navigate = useNavigate();

  const handleCloseCreateModal = () => {
    setCreateModal(false)
  }
  const handleCloseUpdateModal = () => {
    setCreateModal(false)
  }
  const handleCloseWpoModal = () => {
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

  const handleCloseWpoViewModal = () => {
    setOpenWpoView(false)
    setActiveProject(null)
  }

  const handleCloseDrawingModal = () => {
    setOpenDrawingModal(false);
    setActiveProject(null);
  };

  const handleCloseActivityModal = () => {
  setOpenActivityModal(false);
  setActiveProject(null);
};
  // New handler for role assignment modal
  const handleOpenRoleModal = (project) => {
    setSelectedProjectForRole(project);
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedProjectForRole(null);
  };

  const handleOpenRoleViewModal = (project) => {
  setSelectedProjectForRoleView(project);
  setOpenRoleViewModal(true);
};

const handleCloseRoleViewModal = () => {
  setOpenRoleViewModal(false);
  setSelectedProjectForRoleView(null);
};

  // Filter projects based on search
  const filteredProjects = projectData?.data?.filter(project =>
    project.project_name.toLowerCase().includes(projectFilter.toLowerCase())
  ) || [];

  const currentRows = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-none mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="mb-6">
        {/* Title - Always on top on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            Project Listing
          </h2>
        </div>
        
        {/* Search and Button Container */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <TextField
              value={projectFilter}
              placeholder="Search projects..."
              onChange={(e) => setProjectFilter(e.target.value?.toLowerCase())}
              variant="outlined"
              size="small"
              fullWidth
              style={{ 
                backgroundColor: '#f9f9f9', 
                borderRadius: '8px'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
          </div>

          {/* Add Button */}
          <div className="w-full sm:w-auto">
            <Button
              variant="contained"
              fullWidth
              onClick={() => setCreateModal(!createModal)}
              sx={{
                backgroundColor: '#FF8C00',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '14px', sm: '16px' },
                textTransform: 'none',
                padding: { xs: '10px 16px', sm: '8px 24px' },
                '&:hover': {
                  backgroundColor: '#e67c00'
                }
              }}
            >
              Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* Show loading state */}
      {ProjectLoading && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress size={50} />
        </div>
      )}

      {/* Show error state */}
      {ProjectError && (
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Failed to load projects. Please try again later.
          </div>
        </div>
      )}

      {/* Show table only when data is available */}
      {!ProjectLoading && !ProjectError && filteredProjects.length > 0 && (
        <>
          {/* Responsive Table Container */}
          <div className="overflow-x-auto">
            <TableContainer 
              component={Paper} 
              style={{ 
                borderRadius: '8px',
                minWidth: '1420px' // Increased minimum width for the new column
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#F2EDED' }}>
                    <TableCell 
                      align="center" 
                      width={80}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Sr No.
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={180}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Project Name
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={150}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Activity
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={150}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Alloted Land Area
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={180}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      LandBank Name
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={180}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Project Created At
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={180}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Project End Date
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={120}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Expense
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={130}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      View Details
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={140}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Project Milestone
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={140}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Add Client Details
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={140}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      View Client Details
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={120}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Add WO PO
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={120}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      View WO PO
                    </TableCell>
                    <TableCell 
                      align="center" 
                      width={120}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Manage Drawings
                    </TableCell>
                    <TableCell 
  align="center" 
  width={120}
  style={{ fontWeight: 'normal', color: '#5C5E67' }}
  sx={{
    fontSize: { xs: '12px', sm: '14px', md: '16px' },
    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
  }}
>
  Upload Activity
</TableCell>
<TableCell 
  align="center" 
  width={120}
  style={{ fontWeight: 'normal', color: '#5C5E67' }}
  sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' }, padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }}}
>
  Clear Sheet
</TableCell>
                    {/* New column for Role Assignment */}
                    <TableCell 
                      align="center" 
                      width={130}
                      style={{ fontWeight: 'normal', color: '#5C5E67' }}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      Assign Roles
                    </TableCell>
<TableCell 
  align="center" 
  width={130}
  style={{ fontWeight: 'normal', color: '#5C5E67' }}
  sx={{
    fontSize: { xs: '12px', sm: '14px', md: '16px' },
    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
  }}
>
  View Assigned Roles
</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows?.map((project, index) => (
                    <TableRow 
                      key={project.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <TableCell 
                        align="center"
                        sx={{
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' }
                        }}
                      >
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {project.project_name}
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{
                          minWidth: '100px',
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' }
                        }}
                      >
                        {project.project_activity_name}
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{
                          minWidth: '100px',
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' }
                        }}
                      >
                        {project.alloted_land_area}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' }
                        }}
                      >
                        {project.landbank_name}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' }
                        }}
                      >
                        {new Date(project?.start_date).toLocaleDateString() || 'N/A'}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          fontSize: { xs: '12px', sm: '14px', md: '16px' },
                          padding: { xs: '6px 4px', sm: '8px', md: '12px' }
                        }}
                      >
                        {new Date(project?.end_date).toLocaleDateString() || 'N/A'}
                      </TableCell>
                      
                      {/* Action Buttons */}
                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{
                            minWidth: { xs: '80px', sm: '100px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' }
                          }}
                          onClick={() => {
                            navigate(`/project/expense/${project?.id}`)
                          }}
                        >
                          Expense
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#27d865',
                            color: 'white',
                            minWidth: { xs: '90px', sm: '120px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&:hover': {
                              backgroundColor: '#22c55e'
                            }
                          }}
                          onClick={() => {
                            navigate(`/project/view_projects_details/${project?.id}`)
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#1a01fe',
                            color: 'white',
                            minWidth: { xs: '90px', sm: '120px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&:hover': {
                              backgroundColor: '#1501d9'
                            }
                          }}
                          onClick={() => {
                            navigate(`/project/milestone-listing/${project?.id}`)
                          }}
                        >
                          Milestone
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            fontSize: { xs: '10px', sm: '11px' },
                            padding: { xs: '4px 6px', sm: '4px 8px' },
                            minWidth: { xs: '80px', sm: '100px' }
                          }}
                          onClick={() => {
                            navigate(`/project/client_details/${project?.id}`)
                          }}
                        >
                          Add Client
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            fontSize: { xs: '10px', sm: '11px' },
                            padding: { xs: '4px 6px', sm: '4px 8px' },
                            minWidth: { xs: '80px', sm: '100px' }
                          }}
                          onClick={() => {
                            navigate(`/project/view_client_details/${project?.id}`)
                          }}
                        >
                          View Client
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#FF8C00',
                            color: 'white',
                            minWidth: { xs: '80px', sm: '100px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&:hover': {
                              backgroundColor: '#e67c00'
                            }
                          }}
                          onClick={() => {
                            setOpenWpoModal(true)
                            setActiveProject(project?.id)
                          }}
                        >
                          Add WOPO
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#FF8C00',
                            color: 'white',
                            minWidth: { xs: '80px', sm: '110px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&:hover': {
                              backgroundColor: '#e67c00'
                            }
                          }}
                          onClick={() => {
                            setOpenWpoView(true)
                            setActiveProject(project?.id)
                          }}
                        >
                          View WOPO
                        </Button>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#FF8C00',
                            color: 'white',
                            minWidth: { xs: '60px', sm: '80px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&:hover': {
                              backgroundColor: '#e67c00'
                            }
                          }}
                          onClick={() => {
                            setOpenDrawingModal(true);
                            setActiveProject(project?.id);
                          }}
                        >
                          MDL
                        </Button>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
  <Button
    variant="contained"
    size="small"
    sx={{
      backgroundColor: '#FF8C00',
      color: 'white',
      minWidth: { xs: '60px', sm: '80px' },
      fontSize: { xs: '10px', sm: '12px' },
      padding: { xs: '4px 8px', sm: '6px 12px' },
      '&:hover': {
        backgroundColor: '#e67c00'
      }
    }}
    onClick={() => {
      setOpenActivityModal(true);
      setActiveProject(project?.id);
    }}
  >
   Upload Activity Sheet
  </Button>
</TableCell>
<TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
  <Button
    variant="contained"
    size="small"
    color="error" // Makes the button red
    sx={{
      minWidth: { xs: '60px', sm: '80px' },
      fontSize: { xs: '10px', sm: '12px' },
      padding: { xs: '4px 8px', sm: '6px 12px' },
    }}
    // Only show/enable if you have a flag, otherwise just show it
    // disabled={!project.is_activity_sheet_uploaded} 
    onClick={() => handleOpenDeleteDialog(project.id)}
  >
    Clear Activity Sheet
  </Button>
</TableCell>

                      {/* New Role Assignment Button */}
                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#29346B',
                            color: 'white',
                            minWidth: { xs: '80px', sm: '110px' },
                            fontSize: { xs: '10px', sm: '12px' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                            '&:hover': {
                              backgroundColor: '#1E2A5A'
                            }
                          }}
                          onClick={() => handleOpenRoleModal(project)}
                        >
                          Assign Roles
                        </Button>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: { xs: '4px', sm: '8px' } }}>
  <Button
    variant="contained"
    size="small"
    sx={{
      backgroundColor: '#27d865',
      color: 'white',
      minWidth: { xs: '80px', sm: '120px' },
      fontSize: { xs: '10px', sm: '12px' },
      padding: { xs: '4px 8px', sm: '6px 12px' },
      '&:hover': {
        backgroundColor: '#22c55e'
      }
    }}
    onClick={() => handleOpenRoleViewModal(project)}
  >
    View Roles
  </Button>
</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <TablePagination
            component="div"
            count={filteredProjects.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            style={{ borderTop: '1px solid #e0e0e0' }}
            sx={{
              '& .MuiTablePagination-toolbar': {
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '8px', sm: '16px' }
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: { xs: '12px', sm: '14px' }
              }
            }}
          />
        </>
      )}

      {/* No projects found message */}
      {!ProjectLoading && !ProjectError && filteredProjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No projects found matching your search.</p>
        </div>
      )}

      <ProjectCreate open={createModal} handleClose={handleCloseCreateModal} refetch={refetch} />
      <ProjectUpdate open={updateModal} handleClose={handleCloseUpdateModal} />
      <ProjectWpo 
        open={openWpoModal} 
        projectId={activeProject}
        handleClose={handleCloseWpoModal}
        refetch={refetch}
      />
      <ProjectWpoViewModal 
        open={openWpoViewModal} 
        projectId={activeProject}
        handleClose={handleCloseWpoViewModal}
        refetch={refetch}
      />
      <ProjectDrawingUploadDialog 
        open={openDrawingModal} 
        handleDrawingClose={handleCloseDrawingModal} 
        projectId={activeProject}
      />
<ProjectActivityUploadDialog 
  open={openActivityModal} 
  handleActivityClose={handleCloseActivityModal} 
  projectId={activeProject}
  onSuccess={() => {
    // Add any success callback logic here if needed
    console.log('Activity sheet uploaded successfully');
  }}
/>
      
      {/* Role Assignment Modal */}
      <ProjectRoleAssignmentModal
        open={openRoleModal}
        handleClose={handleCloseRoleModal}
        projectId={selectedProjectForRole?.id}
        projectName={selectedProjectForRole?.project_name}
      />
      <ProjectRoleViewModal
  open={openRoleViewModal}
  handleClose={handleCloseRoleViewModal}
  projectId={selectedProjectForRoleView?.id}
  projectName={selectedProjectForRoleView?.project_name}
/>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the Activity Sheet for this project? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            autoFocus
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default ProjectListingTable;