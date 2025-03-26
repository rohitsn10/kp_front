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
  InputAdornment
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
import ViewUserModal from "../../components/pages/design/viewUserModal";

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
  const { data: drawings, error: drawingsError, isLoading: isLoadingDrawings,refetch } = useGetDrawingsByProjectIdQuery(selectedProjectId, {
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
      // Sort by drawings that need uploads first
      result.sort((a, b) => {
        // If a has no attachments and b has attachments, a comes first
        if ((!a.drawing_and_design_attachments || a.drawing_and_design_attachments.length === 0) &&
          (b.drawing_and_design_attachments && b.drawing_and_design_attachments.length > 0)) {
          return -1;
        }
        // If b has no attachments and a has attachments, b comes first
        if ((!b.drawing_and_design_attachments || b.drawing_and_design_attachments.length === 0) &&
          (a.drawing_and_design_attachments && a.drawing_and_design_attachments.length > 0)) {
          return 1;
        }
        // Otherwise, maintain original order
        return 0;
      });
    } else if (sortOption === "view") {
      // Sort by drawings that can be viewed first
      result.sort((a, b) => {
        // If a has attachments and b has no attachments, a comes first
        if ((a.drawing_and_design_attachments && a.drawing_and_design_attachments.length > 0) &&
          (!b.drawing_and_design_attachments || b.drawing_and_design_attachments.length === 0)) {
          return -1;
        }
        // If b has attachments and a has no attachments, b comes first
        if ((b.drawing_and_design_attachments && b.drawing_and_design_attachments.length > 0) &&
          (!a.drawing_and_design_attachments || a.drawing_and_design_attachments.length === 0)) {
          return 1;
        }
        // Otherwise, maintain original order
        return 0;
      });
    }

    setFilteredDrawings(result);
  }, [drawings, searchTerm, sortOption, filterStatus]);

  const handleUpload = (drawing) => {
    console.log("Upload for drawing ID:", drawing);
    setSelectedDrawing(drawing);
    setUploadModalOpen(true);
  };


  const handleUploadClose = () => {
    setSelectedDrawing(null);
    setUploadModalOpen(false);
  };

  const handleAssignUser = (drawing) => {
    // console.log("Assign user to:", drawing);
    setSelectedDrawing(drawing);
    setAssignUserModalOpen(true);
  };

  const handleCloseAssignUserModal = () => {
    setAssignUserModalOpen(false);
    setSelectedDrawing(null);
  };

  const handleViewAssignedUsers = (drawing) => {
    console.log("View assigned users for:", drawing);
    setSelectedDrawing(drawing);
    setViewUserModalOpen(true);
    // Implement your view logic here
  };
  const handleCloseViewAssignedModal = ()=>{
    setViewUserModalOpen(false);
    setSelectedDrawing(null);
  }

  const handleSendNotification = (drawing) => {
    console.log("Send notification for:", drawing);
    setNotiModalOpen(true);
    setSelectedDrawing(drawing);
    // Implement your notification logic here
  };

  const handleCloseSendNotification = ()=>{
    setNotiModalOpen(false);
    setSelectedDrawing(null);
  }


  const handleOpenViewModal = () => {
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleView = (drawing) => {
    // console.log("View attachments:", attachments);
    setSelectedDrawing(drawing);
    handleOpenViewModal();
    // Implement view functionality here
  };

  const handleApprove = (drawingId) => {
    console.log("Approve drawing ID:", drawingId);
    // Implement approval functionality here
  };

  const handleOpenApprovalModal = (drawing) => {
    setSelectedDrawing(drawing);
    setApprovalModalOpen(true);
  };

  // New function to handle closing the approval modal
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
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">Design Documents Section</h2>

      {/* Project Selection */}
      <div className="mb-4 max-w-lg mx-auto">
        <label className="block mb-1 text-[#29346B] text-lg font-semibold">
          Select Project <span className="text-red-600">*</span>
        </label>
        {isLoadingProjects ? (
          <p>Loading projects...</p>
        ) : projectsError ? (
          <p className="text-red-600">Error fetching projects</p>
        ) : (
          <Autocomplete
            options={projects?.data || []}
            getOptionLabel={(option) => option.project_name}
            value={projects?.data?.find((project) => project.id === selectedProjectId) || null}
            onChange={(event, newValue) => {
              setSelectedProjectId(newValue?.id || "");
              // Reset filters when changing projects
              clearFilters();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select Project"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid #FACC15",
                    borderBottom: "4px solid #FACC15",
                    borderRadius: "6px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    border: "none",
                    borderRadius: "4px",
                  },
                }}
              />
            )}
          />
        )}
      </div>

      {/* Drawings Table */}
      {selectedProjectId && (
        <div className="mx-auto mt-6">
          <h3 className="text-lg font-semibold text-[#29346B] mb-2">List of Drawings:</h3>

          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Search */}
            <div className="flex-grow max-w-md">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by drawing number or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                }}
              />
            </div>

            {/* Sort Option */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value="all">All Drawings</MenuItem>
                <MenuItem value="upload">Need Upload First</MenuItem>
                <MenuItem value="view">Can View First</MenuItem>
              </Select>
            </FormControl>

            {/* Filter by Status */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Filter Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                label="Filter Status"
                onChange={(e) => setFilterStatus(e.target.value)}
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
              sx={{
                borderColor: "#29346B",
                color: "#29346B",
                "&:hover": { borderColor: "#1e2756", backgroundColor: "#f0f0f0" }
              }}
            >
              Clear Filters
            </Button>
          </div>

          {isLoadingDrawings ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : drawingsError ? (
            <p className="text-red-600">Error fetching drawings</p>
          ) : filteredDrawings.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Drawing Number</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Name of Drawing</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Discipline</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Block</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Drawing Category</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Updated At</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Approval Status</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left w-40">Action</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Approval</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">User Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {filteredDrawings?.map((drawing, index) => (
                    <tr key={drawing.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-2 px-3 border">{index + 1}</td>
                      <td className="py-2 px-3 border">{drawing.drawing_number}</td>
                      <td className="py-2 px-3 border">{drawing.name_of_drawing}</td>
                      <td className="py-2 px-3 border">{drawing.discipline}</td>
                      <td className="py-2 px-3 border">{drawing.block}</td>
                      <td className="py-2 px-3 border">{drawing.drawing_category}</td>
                      <td className="py-2 px-3 border">{formatDate(drawing.updated_at)}</td>
                      <td className="py-2 px-3 border">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${drawing.approval_status === "A" ? "bg-green-100 text-green-800" :
                            drawing.approval_status === "C" ? "bg-orange-100 text-orange-800" :
                              "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {drawing.approval_status === "A" ? "Approved" :
                            drawing.approval_status === "C" ? "commented" :
                              drawing.approval_status === "N" ? "New" : drawing.approval_status}
                        </span>
                      </td>
                      <td className="py-2 px-3 border">
                        {/* {drawing.drawing_and_design_attachments && drawing.drawing_and_design_attachments.length > 0 ? (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleView(drawing)}
                            // onClick={() => handleUpload(drawing)}

                            sx={{ 
                              bgcolor: "#29346B", 
                              "&:hover": { bgcolor: "#1e2756" } 
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleUpload(drawing)}
                            sx={{ 
                              bgcolor: "#FACC15", 
                              color: "#29346B", 
                              "&:hover": { bgcolor: "#e5b812" } 
                            }}
                          >
                            Upload
                          </Button>
                        )} */}
                        <div className="flex space-x-2">
                          {/* Always show View button if attachments exist */}
                          {drawing.drawing_and_design_attachments && drawing.drawing_and_design_attachments.length > 0 && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleView(drawing)}
                              sx={{
                                bgcolor: "#29346B",
                                "&:hover": { bgcolor: "#1e2756" }
                              }}
                            >
                              View
                            </Button>
                          )}

                          {/* Show Upload button if no attachments OR if status is Commented */}
                          {(!drawing.drawing_and_design_attachments || drawing.drawing_and_design_attachments.length === 0 ||
                            drawing.approval_status === "commented") && (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleUpload(drawing)}
                                sx={{
                                  bgcolor: "#FACC15",
                                  color: "#29346B",
                                  "&:hover": { bgcolor: "#e5b812" }
                                }}
                              >
                                Upload
                              </Button>
                            )}
                        </div>
                      </td>
                      <td className="py-2 px-3 border">
                        <Button
                          variant="contained"
                          size="small"
                          disabled={drawing.is_approved}
                          onClick={() => handleOpenApprovalModal(drawing)}
                          sx={{
                            bgcolor: drawing.is_approved ? "#d1d5db" : "#10B981",
                            "&:hover": { bgcolor: drawing.is_approved ? "#d1d5db" : "#0ea271" }
                          }}
                        >
                          {drawing.is_approved ? "Approved" : "Approve"}
                        </Button>
                      </td>
                      <td className="py-2 px-3 border">
                        <div className="flex space-x-2">
                          {/* Assign User */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAssignUser(drawing)}
                            sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" }, minWidth: "40px", padding: "6px" }}
                          >
                            <PersonAddIcon />
                          </Button>

                          {/* View Assigned Users */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleViewAssignedUsers(drawing)}
                            sx={{ bgcolor: "#2563EB", "&:hover": { bgcolor: "#1D4ED8" }, minWidth: "40px", padding: "6px" }}
                          >
                            <VisibilityIcon />
                          </Button>

                          {/* Send Notification */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSendNotification(drawing)}
                            sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "#EA580C" }, minWidth: "40px", padding: "6px" }}
                          >
                            <NotificationsActiveIcon />
                          </Button>
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center p-4 bg-gray-50 border rounded">
              {searchTerm || filterStatus !== "all" || sortOption !== "all" ?
                "No matching drawings found. Try adjusting your filters." :
                "No drawings available for this project."}
            </p>
          )}
        </div>
      )}
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