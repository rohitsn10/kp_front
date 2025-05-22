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
  Alert
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

  const handleAssignUser = (drawing) => {
    setSelectedDrawing(drawing);
    setAssignUserModalOpen(true);
  };

  const handleCloseAssignUserModal = () => {
    setAssignUserModalOpen(false);
    setSelectedDrawing(null);
  };

  const handleViewAssignedUsers = (drawing) => {
    setSelectedDrawing(drawing);
    setViewUserModalOpen(true);
  };

  const handleCloseViewAssignedModal = () => {
    setViewUserModalOpen(false);
    setSelectedDrawing(null);
  };

  const handleSendNotification = (drawing) => {
    setNotiModalOpen(true);
    setSelectedDrawing(drawing);
  };

  const handleCloseSendNotification = () => {
    setNotiModalOpen(false);
    setSelectedDrawing(null);
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

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-white m-1 sm:m-2 md:m-4 lg:m-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#29346B]">
          Design Documents Section
        </h2>
      </div>

      {/* Responsive Project Selection */}
      <div className="mb-6">
        <div className="w-full max-w-2xl mx-auto">
          <label className="block mb-2 text-[#29346B] text-base sm:text-lg font-semibold">
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

      {/* Drawings Table Section */}
      {selectedProjectId && (
        <div className="w-full">
            <DesignDocumentsGraph />
          <h3 className="text-base sm:text-lg font-semibold text-[#29346B] mb-4">
            List of Drawings:
          </h3>

          {/* Responsive Search and Filter Controls */}
          <div className="mb-6">
            {/* Search Bar - Full width on mobile */}
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
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: '14px', sm: '16px' }
                  }
                }}
              />
            </div>

            {/* Filter Controls - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              {/* Sort Option */}
              <FormControl fullWidth sm={{ maxWidth: 200 }}>
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
              <FormControl fullWidth sm={{ maxWidth: 200 }}>
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
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Sr</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Drawing Number</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Name of Drawing</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Discipline</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Block</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Category</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Updated At</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Status</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Action</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">Approval</th>
                    <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm">User Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrawings?.map((drawing, index) => (
                    <tr key={drawing.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
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
                      <td className="py-2 px-2 sm:px-3 border">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          {/* Assign User */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAssignUser(drawing)}
                            sx={{ 
                              bgcolor: "#4F46E5", 
                              "&:hover": { bgcolor: "#4338CA" }, 
                              minWidth: { xs: "30px", sm: "40px" }, 
                              padding: { xs: "4px", sm: "6px" }
                            }}
                          >
                            <PersonAddIcon sx={{ fontSize: { xs: '14px', sm: '18px' } }} />
                          </Button>

                          {/* View Assigned Users */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleViewAssignedUsers(drawing)}
                            sx={{ 
                              bgcolor: "#2563EB", 
                              "&:hover": { bgcolor: "#1D4ED8" }, 
                              minWidth: { xs: "30px", sm: "40px" }, 
                              padding: { xs: "4px", sm: "6px" }
                            }}
                          >
                            <VisibilityIcon sx={{ fontSize: { xs: '14px', sm: '18px' } }} />
                          </Button>

                          {/* Send Notification */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSendNotification(drawing)}
                            sx={{ 
                              bgcolor: "#F97316", 
                              "&:hover": { bgcolor: "#EA580C" }, 
                              minWidth: { xs: "30px", sm: "40px" }, 
                              padding: { xs: "4px", sm: "6px" }
                            }}
                          >
                            <NotificationsActiveIcon sx={{ fontSize: { xs: '14px', sm: '18px' } }} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 border rounded-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Drawings Found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all" || sortOption !== "all" ?
                  "No matching drawings found. Try adjusting your filters." :
                  "No drawings available for this project."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* All Modals */}
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
      <AssignUserModal
        open={assignUserModalOpen}
        handleClose={handleCloseAssignUserModal}
        drawingDetails={selectedDrawing}
      />
      <UserNotiModal
        open={notiModalOpen}
        handleClose={handleCloseSendNotification}
        drawingDetails={selectedDrawing}
      />
      <ViewUserModal
        open={viewUserModalOpen}
        handleClose={handleCloseViewAssignedModal}
        drawingDetails={selectedDrawing}
      />
    </div>
  );
}

export default DesignDocumentsPage;