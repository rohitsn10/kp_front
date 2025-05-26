import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Box,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetMainProjectsQuery } from "../../api/users/projectApi";
import { useGetDrawingsByProjectIdQuery } from "../../api/masterdesign/masterDesign";
import FormatDateAndTime from "../../utils/dateUtils";
import DrawingDocumentUploadDialog from "./DocumentUploadModal";
import DrawingDocumentViewModal from "./DesignViewModal";
import DrawingApprovalModal from "./DesignApproveModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AssignUserModal from "../../components/pages/design/AssignUserModal";
import UserNotiModal from "../../components/pages/design/UserNotiModal";
import ViewUserModal from "../../components/pages/design/ViewUserModal";
import DesignDocumentsGraph from "./DesignDocumentsGraph";

function DesignDocumentsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false);
  const [filteredDrawings, setFilteredDrawings] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [notiModalOpen, setNotiModalOpen] = useState(false);
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);

  // Fetch projects
  const { data: projects, error: projectsError, isLoading: isLoadingProjects } = useGetMainProjectsQuery();
  // Fetch drawings based on selected project ID
  const { data: drawings, error: drawingsError, isLoading: isLoadingDrawings, refetch } = useGetDrawingsByProjectIdQuery(selectedProjectId, {
    skip: !selectedProjectId, // Prevents fetching until a project is selected
  });

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!drawings?.data) {
      setFilteredDrawings([]);
      return;
    }

    let result = [...drawings.data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(drawing =>
        drawing.drawing_number.toLowerCase().includes(searchLower) ||
        drawing.name_of_drawing.toLowerCase().includes(searchLower)
      );
    }

    // Apply approval status filter
    if (filterStatus !== "all") {
      result = result.filter(drawing => drawing.approval_status === filterStatus);
    }

    // Apply sort option
    if (sortOption === "upload") {
      result.sort((a, b) => {
        if ((!a.drawing_and_design_attachments || a.drawing_and_design_attachments.length === 0) &&
          (b.drawing_and_design_attachments && b.drawing_and_design_attachments.length > 0)) {
          return -1;
        }
        if ((!b.drawing_and_design_attachments || b.drawing_and_design_attachments.length === 0) &&
          (a.drawing_and_design_attachments && a.drawing_and_design_attachments.length > 0)) {
          return 1;
        }
        return 0;
      });
    } else if (sortOption === "view") {
      result.sort((a, b) => {
        if ((a.drawing_and_design_attachments && a.drawing_and_design_attachments.length > 0) &&
          (!b.drawing_and_design_attachments || b.drawing_and_design_attachments.length === 0)) {
          return -1;
        }
        if ((b.drawing_and_design_attachments && b.drawing_and_design_attachments.length > 0) &&
          (!a.drawing_and_design_attachments || a.drawing_and_design_attachments.length === 0)) {
          return 1;
        }
        return 0;
      });
    }

    setFilteredDrawings(result);
  }, [drawings, searchTerm, sortOption, filterStatus]);

  const handleUpload = (drawing) => {
    setSelectedDrawing(drawing);
    setUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setSelectedDrawing(null);
    setUploadModalOpen(false);
  };

  // Project-level user action handlers
  const handleProjectAssignUser = () => {
    setAssignUserModalOpen(true);
  };

  const handleCloseAssignUserModal = () => {
    setAssignUserModalOpen(false);
  };

  const handleProjectViewAssignedUsers = () => {
    setViewUserModalOpen(true);
  };

  const handleCloseViewAssignedModal = () => {
    setViewUserModalOpen(false);
  };

  const handleProjectSendNotification = () => {
    setNotiModalOpen(true);
  };

  const handleCloseSendNotification = () => {
    setNotiModalOpen(false);
  };

  const handleOpenViewModal = () => {
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleView = (drawing) => {
    setSelectedDrawing(drawing);
    handleOpenViewModal();
  };

  const handleOpenApprovalModal = (drawing) => {
    setSelectedDrawing(drawing);
    setApprovalModalOpen(true);
  };

  const handleCloseApprovalModal = () => {
    setApprovalModalOpen(false);
    setSelectedDrawing(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return FormatDateAndTime(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setFilterStatus("all");
  };

  // Get selected project details for project-level actions
  const selectedProject = projects?.data?.find((project) => project.id === selectedProjectId);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section - Simple and Responsive */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 text-center border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl text-[#29346B] font-semibold">
              Design Documents Section
            </h2>
          </div>

          {/* Project Selection Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-2xl mx-auto">
              <label className="block mb-3 text-[#29346B] text-base sm:text-lg font-semibold">
                Select Project <span className="text-red-600">*</span>
              </label>
              {isLoadingProjects ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} />
                  <span className="text-sm text-gray-600">Loading projects...</span>
                </div>
              ) : projectsError ? (
                <Alert severity="error">Error fetching projects</Alert>
              ) : (
                <Autocomplete
                  options={projects?.data || []}
                  getOptionLabel={(option) => option.project_name}
                  value={projects?.data?.find((project) => project.id === selectedProjectId) || null}
                  onChange={(event, newValue) => {
                    setSelectedProjectId(newValue?.id || "");
                    clearFilters();
                  }}
                  fullWidth
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select Project"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          border: "1px solid #FACC15",
                          borderBottom: "4px solid #FACC15",
                          borderRadius: "6px",
                        },
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          border: "2px solid #FACC15",
                          borderRadius: "4px",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: '14px', sm: '16px' }
                        }
                      }}
                    />
                  )}
                />
              )}
            </div>
          </div>

          {/* Content Section */}
          {selectedProjectId && (
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
              {/* Graph Component */}
              <div className="mb-6">
                <DesignDocumentsGraph projectID={selectedProjectId}/>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-[#29346B] mb-4">
                List of Drawings:
              </h3>

              {/* Search and Filter Controls */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                {/* Search Bar */}
                <div className="mb-4">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by drawing number or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "white"
                      },
                      "& .MuiInputBase-input": {
                        fontSize: { xs: '14px', sm: '16px' }
                      }
                    }}
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Sort Option */}
                  <FormControl fullWidth>
                    <InputLabel 
                      id="sort-label"
                      sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    >
                      Sort By
                    </InputLabel>
                    <Select
                      labelId="sort-label"
                      value={sortOption}
                      label="Sort By"
                      onChange={(e) => setSortOption(e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiSelect-select": {
                          fontSize: { xs: '14px', sm: '16px' }
                        }
                      }}
                    >
                      <MenuItem value="all">All Drawings</MenuItem>
                      <MenuItem value="upload">Need Upload First</MenuItem>
                      <MenuItem value="view">Can View First</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Filter by Status */}
                  <FormControl fullWidth>
                    <InputLabel 
                      id="status-filter-label"
                      sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    >
                      Filter Status
                    </InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={filterStatus}
                      label="Filter Status"
                      onChange={(e) => setFilterStatus(e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiSelect-select": {
                          fontSize: { xs: '14px', sm: '16px' }
                        }
                      }}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="commented">Commented</MenuItem>
                      <MenuItem value="N">New</MenuItem>
                      <MenuItem value="submitted">Submitted</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Clear Filters Button */}
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    fullWidth
                    sx={{
                      borderColor: "#29346B",
                      color: "#29346B",
                      fontSize: { xs: '14px', sm: '16px' },
                      padding: { xs: '8px 16px', sm: '6px 16px' },
                      "&:hover": { 
                        borderColor: "#1e2756", 
                        backgroundColor: "#f0f0f0" 
                      }
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>

                {/* Project-Level User Actions */}
                <Box sx={{ 
                  borderTop: '1px solid #e5e7eb', 
                  paddingTop: 3,
                  marginTop: 2
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: '#29346B', 
                      fontWeight: 600, 
                      marginBottom: 2,
                      fontSize: { xs: '14px', sm: '16px' }
                    }}
                  >
                    Project Actions: {selectedProject?.project_name}
                  </Typography>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {/* Assign User to Project */}
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={handleProjectAssignUser}
                      sx={{ 
                        bgcolor: "#4F46E5", 
                        "&:hover": { bgcolor: "#4338CA" },
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '6px 12px', sm: '8px 16px' }
                      }}
                    >
                      Assign Users
                    </Button>

                    {/* View Project Users */}
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={handleProjectViewAssignedUsers}
                      sx={{ 
                        bgcolor: "#2563EB", 
                        "&:hover": { bgcolor: "#1D4ED8" },
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '6px 12px', sm: '8px 16px' }
                      }}
                    >
                      View Users
                    </Button>

                    {/* Send Project Notification */}
                    <Button
                      variant="contained"
                      startIcon={<NotificationsActiveIcon />}
                      onClick={handleProjectSendNotification}
                      sx={{ 
                        bgcolor: "#F97316", 
                        "&:hover": { bgcolor: "#EA580C" },
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '6px 12px', sm: '8px 16px' }
                      }}
                    >
                      Send Notification
                    </Button>
                  </div>
                </Box>
              </div>

              {/* Loading/Error/Content */}
              {isLoadingDrawings ? (
                <div className="flex justify-center py-8">
                  <CircularProgress />
                </div>
              ) : drawingsError ? (
                <Alert severity="error">Error fetching drawings</Alert>
              ) : filteredDrawings.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Sr</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Drawing Number</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Name of Drawing</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Discipline</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Block</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Category</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Updated At</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Status</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Action</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrawings?.map((drawing, index) => (
                        <tr key={drawing.id} className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-50"}>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{index + 1}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm break-words max-w-32">{drawing.drawing_number}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm break-words max-w-40">{drawing.name_of_drawing}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{drawing.discipline}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{drawing.block}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{drawing.drawing_category}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{formatDate(drawing.updated_at)}</td>
                          <td className="py-2 px-2 sm:px-3 border">
                            <span
                              className={`px-1 sm:px-2 py-1 rounded text-xs font-semibold ${
                                drawing.approval_status === "A" ? "bg-green-100 text-green-800" :
                                drawing.approval_status === "C" ? "bg-orange-100 text-orange-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {drawing.approval_status === "A" ? "Approved" :
                               drawing.approval_status === "C" ? "Commented" :
                               drawing.approval_status === "N" ? "New" : drawing.approval_status}
                            </span>
                          </td>
                          <td className="py-2 px-2 sm:px-3 border">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              {/* View button */}
                              {drawing.drawing_and_design_attachments && drawing.drawing_and_design_attachments.length > 0 && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleView(drawing)}
                                  sx={{
                                    bgcolor: "#29346B",
                                    fontSize: { xs: '10px', sm: '12px' },
                                    padding: { xs: '2px 6px', sm: '4px 8px' },
                                    minWidth: { xs: '50px', sm: '60px' },
                                    "&:hover": { bgcolor: "#1e2756" }
                                  }}
                                >
                                  View
                                </Button>
                              )}

                              {/* Upload button */}
                              {(!drawing.drawing_and_design_attachments || drawing.drawing_and_design_attachments.length === 0 ||
                                drawing.approval_status === "commented") && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleUpload(drawing)}
                                  sx={{
                                    bgcolor: "#FACC15",
                                    color: "#29346B",
                                    fontSize: { xs: '10px', sm: '12px' },
                                    padding: { xs: '2px 6px', sm: '4px 8px' },
                                    minWidth: { xs: '50px', sm: '60px' },
                                    "&:hover": { bgcolor: "#e5b812" }
                                  }}
                                >
                                  Upload
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2 sm:px-3 border">
                            <Button
                              variant="contained"
                              size="small"
                              disabled={drawing.is_approved}
                              onClick={() => handleOpenApprovalModal(drawing)}
                              sx={{
                                bgcolor: drawing.is_approved ? "#d1d5db" : "#10B981",
                                fontSize: { xs: '10px', sm: '12px' },
                                padding: { xs: '2px 6px', sm: '4px 8px' },
                                minWidth: { xs: '60px', sm: '70px' },
                                "&:hover": { bgcolor: drawing.is_approved ? "#d1d5db" : "#0ea271" }
                              }}
                            >
                              {drawing.is_approved ? "Approved" : "Approve"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                    <div className="text-4xl sm:text-5xl mb-4">📋</div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">No Drawings Found</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {searchTerm || filterStatus !== "all" || sortOption !== "all" ?
                        "No matching drawings found. Try adjusting your filters." :
                        "No drawings available for this project."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State for No Project Selected */}
          {!selectedProjectId && (
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                  <div className="text-4xl sm:text-5xl mb-4">📄</div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
                    Ready to Start
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Please select a project from the dropdown above to view design documents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Modals - Updated to work with project-level data */}
      <DrawingDocumentUploadDialog
        open={uploadModalOpen}
        handleClose={handleUploadClose}
        drawingDetails={selectedDrawing}
        refetchDrawings={refetch}
      />
      <DrawingDocumentViewModal
        open={viewModalOpen}
        handleClose={handleCloseViewModal}
        drawingDetails={selectedDrawing}
      />
      <DrawingApprovalModal
        open={approvalModalOpen}
        handleClose={handleCloseApprovalModal}
        drawingDetails={selectedDrawing}
        refetchDrawings={refetch}
      />
      {/* Project-level modals - pass project details instead of drawing details */}
      <AssignUserModal
        open={assignUserModalOpen}
        handleClose={handleCloseAssignUserModal}
        projectDetails={selectedProject} // Changed from drawingDetails
      />
      <UserNotiModal
        open={notiModalOpen}
        handleClose={handleCloseSendNotification}
        projectDetails={selectedProject} // Changed from drawingDetails
      />
      <ViewUserModal
        open={viewUserModalOpen}
        handleClose={handleCloseViewAssignedModal}
        projectDetails={selectedProject} // Changed from drawingDetails
      />
    </div>
  );
}

export default DesignDocumentsPage;