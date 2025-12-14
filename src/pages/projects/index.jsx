import React, { useState, useContext, useEffect } from 'react';
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
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

// --- PERMISSION CONFIGURATION ---
const PERMISSIONS = {
  PAGE_ACCESS: [
    'PROJECT_HOD_FULL', 'ADMIN', 'PROJECT_ENGINEER_FULL', 'PROJECT_ENGINEER', 
    'PROJECT_MANAGER_FULL', 'LAND_HOD_FULL'
  ],
  ADD_PROJECT: [
    'PROJECT_HOD_FULL', 'ADMIN', 'PROJECT_ENGINEER_FULL', 
    'PROJECT_ENGINEER', 'PROJECT_MANAGER_FULL'
  ],
  MILESTONE: [
    'PROJECT_HOD_FULL', 'ADMIN', 'PROJECT_ENGINEER_FULL', 
    'PROJECT_ENGINEER', 'PROJECT_MANAGER_FULL', 'LAND_HOD_FULL'
  ],
  CLIENT_ACCESS: [
    'PROJECT_HOD_FULL', 'ADMIN', 'PROJECT_MANAGER_FULL'
  ],
  MDL_ACCESS: [
    'PROJECT_HOD_FULL', 'PROJECT_ENGINEER_FULL', 'PROJECT_ENGINEER', 
    'PROJECT_MANAGER_FULL', 'ADMIN', 'DESIGN_HOD', 'DESIGN_MANAGER', 
    'DESIGN_ASSITANT_MANAGER', 'DESIGN_SENIOR_ENGINEER', 'DESIGN_ENGINEER'
  ],
  ACTIVITY_SHEET: [
    'PROJECT_HOD_FULL', 'PROJECT_ENGINEER_FULL', 'PROJECT_ENGINEER', 
    'PROJECT_MANAGER_FULL', 'ADMIN'
  ],
  ASSIGN_ROLES: [
    'PROJECT_HOD_FULL', 'PROJECT_ENGINEER_FULL', 'PROJECT_ENGINEER', 
    'PROJECT_MANAGER_FULL', 'ADMIN'
  ]
};

const ProjectListingTable = () => {
  const navigate = useNavigate();
  const { permissions } = useContext(AuthContext); // Get permissions from context

  // --- STATE VARIABLES ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projectFilter, setProjectFilter] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [openWpoModal, setOpenWpoModal] = useState(false);
  const [activeProject, setActiveProject] = useState();
  const { data: projectData, isLoading: ProjectLoading, error: ProjectError, refetch } = useGetMainProjectsQuery();
  const [openWpoViewModal, setOpenWpoView] = useState(false);
  const [openDrawingModal, setOpenDrawingModal] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedProjectForRole, setSelectedProjectForRole] = useState(null);
  const [openRoleViewModal, setOpenRoleViewModal] = useState(false);
  const [selectedProjectForRoleView, setSelectedProjectForRoleView] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteActivitySheet, { isLoading: isDeleting }] = useDeleteActivitySheetMutation();

  // --- ACCESS CHECK HELPER ---
  const checkAccess = (allowedRoles) => {
    const userGroups = permissions?.groups || [];
    return userGroups.some(group => allowedRoles.includes(group.name));
  };

  // --- DERIVED PERMISSIONS ---
  const canAddProject = checkAccess(PERMISSIONS.ADD_PROJECT);
  const canViewMilestone = checkAccess(PERMISSIONS.MILESTONE);
  const canManageClient = checkAccess(PERMISSIONS.CLIENT_ACCESS);
  const canAccessMDL = checkAccess(PERMISSIONS.MDL_ACCESS);
  const canManageActivity = checkAccess(PERMISSIONS.ACTIVITY_SHEET);
  const canAssignRoles = checkAccess(PERMISSIONS.ASSIGN_ROLES);

  // --- 0. PAGE LEVEL SECURITY ---
  useEffect(() => {
    if (permissions && !checkAccess(PERMISSIONS.PAGE_ACCESS)) {
      navigate('/'); // Redirect if user doesn't have page access
    }
  }, [permissions, navigate]);

  // --- HANDLERS ---
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
        handleCloseDeleteDialog();
        refetch(); 
        console.log("Activity sheet deleted");
      } catch (error) {
        console.error("Failed to delete activity sheet", error);
        alert("Failed to delete: " + (error?.data?.message || "Unknown error"));
      }
    }
  };

  const handleCloseCreateModal = () => setCreateModal(false);
  const handleCloseUpdateModal = () => setCreateModal(false);
  const handleCloseWpoModal = () => { setOpenWpoModal(false); setActiveProject(null); };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
  const handleCloseWpoViewModal = () => { setOpenWpoView(false); setActiveProject(null); };
  const handleCloseDrawingModal = () => { setOpenDrawingModal(false); setActiveProject(null); };
  const handleCloseActivityModal = () => { setOpenActivityModal(false); setActiveProject(null); };
  
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

  const filteredProjects = projectData?.data?.filter(project =>
    project.project_name.toLowerCase().includes(projectFilter.toLowerCase())
  ) || [];

  const currentRows = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-none mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            Project Listing
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <TextField
              value={projectFilter}
              placeholder="Search projects..."
              onChange={(e) => setProjectFilter(e.target.value?.toLowerCase())}
              variant="outlined"
              size="small"
              fullWidth
              style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
            />
          </div>

          {/* 1. Add Project Button - Restricted Access */}
          {canAddProject && (
            <div className="w-full sm:w-auto">
              <Button
                variant="contained"
                fullWidth
                onClick={() => setCreateModal(!createModal)}
                sx={{
                  backgroundColor: '#FF8C00',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#e67c00' }
                }}
              >
                Add Project
              </Button>
            </div>
          )}
        </div>
      </div>

      {ProjectLoading && (
        <div className="flex justify-center items-center h-64"><CircularProgress size={50} /></div>
      )}

      {ProjectError && (
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Failed to load projects. Please try again later.
          </div>
        </div>
      )}

      {!ProjectLoading && !ProjectError && filteredProjects.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <TableContainer component={Paper} style={{ borderRadius: '8px', minWidth: '1420px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#F2EDED' }}>
                    <TableCell align="center" width={80} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Sr No.</TableCell>
                    <TableCell align="center" width={180} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Project Name</TableCell>
                    <TableCell align="center" width={150} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Activity</TableCell>
                    <TableCell align="center" width={150} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Alloted Land Area</TableCell>
                    <TableCell align="center" width={180} style={{ fontWeight: 'normal', color: '#5C5E67' }}>LandBank Name</TableCell>
                    <TableCell align="center" width={180} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Project Created At</TableCell>
                    <TableCell align="center" width={180} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Project End Date</TableCell>
                    <TableCell align="center" width={120} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Expense</TableCell>
                    
                    {/* 2. View Details - All Access (Implicit in Page Access) */}
                    <TableCell align="center" width={130} style={{ fontWeight: 'normal', color: '#5C5E67' }}>View Details</TableCell>
                    
                    {/* 3. Milestone - Restricted Access */}
                    {canViewMilestone && (
                      <TableCell align="center" width={140} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Project Milestone</TableCell>
                    )}

                    {/* 4. Client Columns - Restricted Access */}
                    {canManageClient && (
                      <>
                        <TableCell align="center" width={140} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Add Client Details</TableCell>
                        <TableCell align="center" width={140} style={{ fontWeight: 'normal', color: '#5C5E67' }}>View Client Details</TableCell>
                      </>
                    )}

                    <TableCell align="center" width={120} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Add WO PO</TableCell>
                    <TableCell align="center" width={120} style={{ fontWeight: 'normal', color: '#5C5E67' }}>View WO PO</TableCell>
                    
                    {/* 5. MDL - Restricted Access */}
                    {canAccessMDL && (
                      <TableCell align="center" width={120} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Manage Drawings</TableCell>
                    )}

                    {/* 6 & 8. Activity Sheet (Upload & Clear) - Restricted Access */}
                    {canManageActivity && (
                      <>
                        <TableCell align="center" width={120} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Upload Activity</TableCell>
                        <TableCell align="center" width={120} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Clear Sheet</TableCell>
                      </>
                    )}

                    {/* 7. Assign Roles - Restricted Access */}
                    {canAssignRoles && (
                      <TableCell align="center" width={130} style={{ fontWeight: 'normal', color: '#5C5E67' }}>Assign Roles</TableCell>
                    )}

                    {/* 9. View Roles - All Access */}
                    <TableCell align="center" width={130} style={{ fontWeight: 'normal', color: '#5C5E67' }}>View Assigned Roles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows?.map((project, index) => (
                    <TableRow key={project.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell align="center">{project.project_name}</TableCell>
                      <TableCell align="center">{project.project_activity_name}</TableCell>
                      <TableCell align="center">{project.alloted_land_area}</TableCell>
                      <TableCell align="center">{project.landbank_name}</TableCell>
                      <TableCell align="center">{new Date(project?.start_date).toLocaleDateString() || 'N/A'}</TableCell>
                      <TableCell align="center">{new Date(project?.end_date).toLocaleDateString() || 'N/A'}</TableCell>
                      
                      <TableCell align="center">
                        <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/project/expense/${project?.id}`)}>
                          Expense
                        </Button>
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: '#27d865', color: 'white', '&:hover': { backgroundColor: '#22c55e' } }}
                          onClick={() => navigate(`/project/view_projects_details/${project?.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>

                      {canViewMilestone && (
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: '#1a01fe', color: 'white', '&:hover': { backgroundColor: '#1501d9' } }}
                            onClick={() => navigate(`/project/milestone-listing/${project?.id}`)}
                          >
                            Milestone
                          </Button>
                        </TableCell>
                      )}

                      {canManageClient && (
                        <>
                          <TableCell align="center">
                            <Button variant="contained" color="secondary" size="small" onClick={() => navigate(`/project/client_details/${project?.id}`)}>
                              Add Client
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button variant="contained" color="secondary" size="small" onClick={() => navigate(`/project/view_client_details/${project?.id}`)}>
                              View Client
                            </Button>
                          </TableCell>
                        </>
                      )}

                      <TableCell align="center">
                        <Button
                          variant="contained" size="small"
                          sx={{ backgroundColor: '#FF8C00', color: 'white', '&:hover': { backgroundColor: '#e67c00' } }}
                          onClick={() => { setOpenWpoModal(true); setActiveProject(project?.id); }}
                        >
                          Add WOPO
                        </Button>
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          variant="contained" size="small"
                          sx={{ backgroundColor: '#FF8C00', color: 'white', '&:hover': { backgroundColor: '#e67c00' } }}
                          onClick={() => { setOpenWpoView(true); setActiveProject(project?.id); }}
                        >
                          View WOPO
                        </Button>
                      </TableCell>

                      {canAccessMDL && (
                        <TableCell align="center">
                          <Button
                            variant="contained" size="small"
                            sx={{ backgroundColor: '#FF8C00', color: 'white', '&:hover': { backgroundColor: '#e67c00' } }}
                            onClick={() => { setOpenDrawingModal(true); setActiveProject(project?.id); }}
                          >
                            MDL
                          </Button>
                        </TableCell>
                      )}

                      {canManageActivity && (
                        <>
                          <TableCell align="center">
                            <Button
                              variant="contained" size="small"
                              sx={{ backgroundColor: '#FF8C00', color: 'white', '&:hover': { backgroundColor: '#e67c00' } }}
                              onClick={() => { setOpenActivityModal(true); setActiveProject(project?.id); }}
                            >
                              Upload Activity Sheet
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained" size="small" color="error"
                              onClick={() => handleOpenDeleteDialog(project.id)}
                            >
                              Clear Activity Sheet
                            </Button>
                          </TableCell>
                        </>
                      )}

                      {canAssignRoles && (
                        <TableCell align="center">
                          <Button
                            variant="contained" size="small"
                            sx={{ backgroundColor: '#29346B', color: 'white', '&:hover': { backgroundColor: '#1E2A5A' } }}
                            onClick={() => handleOpenRoleModal(project)}
                          >
                            Assign Roles
                          </Button>
                        </TableCell>
                      )}

                      <TableCell align="center">
                        <Button
                          variant="contained" size="small"
                          sx={{ backgroundColor: '#27d865', color: 'white', '&:hover': { backgroundColor: '#22c55e' } }}
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
          />
        </>
      )}

      {/* No projects found message */}
      {!ProjectLoading && !ProjectError && filteredProjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No projects found matching your search.</p>
        </div>
      )}

      {/* Modals */}
      <ProjectCreate open={createModal} handleClose={handleCloseCreateModal} refetch={refetch} />
      <ProjectUpdate open={updateModal} handleClose={handleCloseUpdateModal} />
      <ProjectWpo open={openWpoModal} projectId={activeProject} handleClose={handleCloseWpoModal} refetch={refetch} />
      <ProjectWpoViewModal open={openWpoViewModal} projectId={activeProject} handleClose={handleCloseWpoViewModal} refetch={refetch} />
      <ProjectDrawingUploadDialog open={openDrawingModal} handleDrawingClose={handleCloseDrawingModal} projectId={activeProject} />
      <ProjectActivityUploadDialog 
        open={openActivityModal} 
        handleActivityClose={handleCloseActivityModal} 
        projectId={activeProject}
        onSuccess={() => console.log('Activity sheet uploaded successfully')}
      />
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
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the Activity Sheet for this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectListingTable;
