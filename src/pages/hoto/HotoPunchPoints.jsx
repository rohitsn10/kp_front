import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VerifiedIcon from "@mui/icons-material/Verified";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HistoryIcon from "@mui/icons-material/History";
import { useParams } from 'react-router-dom';

// Import the modals
// import ClosePointsModal from '../../components/pages/hoto/punchpoints-page/ClosePointsModal';
import CompletedPointsModal from '../../components/pages/hoto/punchpoints/CompletedPointsModal';
import ClosePointsModal from '../../components/pages/hoto/punchpoints/ClosePointsModal';

function HotoPunchPoints() {
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  
  // State for ClosePointsModal
  const [openClosePointsModal, setOpenClosePointsModal] = useState(false);
  const [selectedPunchPoint, setSelectedPunchPoint] = useState(null);
  
  // State for CompletedPointsModal
  const [openCompletedPointsModal, setOpenCompletedPointsModal] = useState(false);

  // Update dummy data to include completed points
  const dummyData = {
    "status": true,
    "message": "Punch points fetched successfully",
    "data": [
      {
        "id": 1,
        "hoto": 1,
        "punch_file_name": "File Name",
        "punch_title": "Cable not terminated properly",
        "punch_description": "The termination of the power cable in panel A is loose and not properly labeled.",
        "punch_point_raised": "100",
        "punch_point_balance": "20",
        "status": "In Progress",
        "closure_date": "2025-06-15",
        "punch_report_file": [
          {
            "id": 5,
            "file_url": "https://yourdomain.com/media/punch_files/initial_image.jpg",
            "uploaded_at": "2025-05-08T10:00:00Z"
          }
        ],
        "completed_points": [
          {
            "id": 101,
            "punch_point_completed": "40",
            "punch_description": "Tightened and labeled power cable in panel A.",
            "status": "Completed",
            "completion_files": [
              {
                "id": 201,
                "file_url": "https://yourdomain.com/media/punch_files/fix_image1.jpg",
                "uploaded_at": "2025-05-08T11:00:00Z"
              }
            ],
            "created_by": 4,
            "created_by_name": "Alice Smith",
            "created_at": "2025-05-08T11:10:00Z",
            "verification": {
              "verification_status": "Accepted",
              "rejection_reason": null,
              "verified_by": 2,
              "verified_by_name": "John Doe",
              "verified_at": "2025-05-08T12:00:00Z"
            }
          },
          {
            "id": 102,
            "punch_point_completed": "40",
            "punch_description": "Reinforced cable terminals with additional supports.",
            "status": "Completed",
            "completion_files": [
              {
                "id": 202,
                "file_url": "https://yourdomain.com/media/punch_files/fix_image2.jpg",
                "uploaded_at": "2025-05-09T09:00:00Z"
              },
              {
                "id": 203,
                "file_url": "https://yourdomain.com/media/punch_files/fix_report.pdf",
                "uploaded_at": "2025-05-09T09:05:00Z"
              }
            ],
            "created_by": 5,
            "created_by_name": "Bob Johnson",
            "created_at": "2025-05-09T09:10:00Z",
            "verification": {
              "verification_status": "Accepted",
              "rejection_reason": null,
              "verified_by": 2,
              "verified_by_name": "John Doe",
              "verified_at": "2025-05-09T10:30:00Z"
            }
          }
        ],
        "created_by": 2,
        "created_by_name": "John Doe",
        "created_at": "2025-05-08T10:00:00Z",
        "updated_by": 2,
        "updated_by_name": "John Doe",
        "updated_at": "2025-05-08T10:00:00Z"
      },
      {
        "id": 2,
        "hoto": 1,
        "punch_file_name": "File Name 2",
        "punch_title": "Punch point issue not 2",
        "punch_description": "The termination of the power cable in panel A is loose and not properly labeled.",
        "punch_point_raised": "100",
        "punch_point_balance": "60",
        "status": "Completed",
        "closure_date": "2025-05-20",
        "punch_file": [
          {
            "id": 5,
            "file_url": "https://yourdomain.com/media/punch_files/initial_image.jpg",
            "uploaded_at": "2025-05-08T10:00:00Z"
          },
          {
            "id": 6,
            "file_url": "https://yourdomain.com/media/punch_files/initial_image.jpg",
            "uploaded_at": "2025-05-08T10:00:00Z"
          }
        ],
        "completed_points": [
          {
            "id": 103,
            "punch_point_completed": "40",
            "punch_description": "Fixed the issue with proper cable termination.",
            "status": "Completed",
            "completion_files": [
              {
                "id": 204,
                "file_url": "https://yourdomain.com/media/punch_files/completion_image.jpg",
                "uploaded_at": "2025-05-10T14:00:00Z"
              }
            ],
            "created_by": 3,
            "created_by_name": "Maria Garcia",
            "created_at": "2025-05-10T14:10:00Z",
            "verification": {
              "verification_status": "Rejected",
              "rejection_reason": "Insufficient documentation. Please provide close-up photos of the termination.",
              "verified_by": 2,
              "verified_by_name": "John Doe",
              "verified_at": "2025-05-10T16:00:00Z"
            }
          }
        ],
        "created_by": 2,
        "created_by_name": "John Doe",
        "created_at": "2025-05-08T10:00:00Z",
        "updated_by": 2,
        "updated_by_name": "John Doe",
        "updated_at": "2025-05-08T10:00:00Z"
      },
      {
        "id": 3,
        "hoto": 1,
        "punch_file_name": "Panel B-23",
        "punch_title": "Missing safety label",
        "punch_description": "Safety warning label is missing from the panel front.",
        "punch_point_raised": "50",
        "punch_point_balance": "0",
        "status": "Completed",
        "closure_date": "2025-05-01",
        "punch_file": [
          {
            "id": 7,
            "file_url": "https://yourdomain.com/media/punch_files/panel_image.jpg",
            "uploaded_at": "2025-05-03T14:30:00Z"
          }
        ],
        "completed_points": [
          {
            "id": 104,
            "punch_point_completed": "50",
            "punch_description": "Safety label installed and verified",
            "status": "Completed",
            "completion_files": [
              {
                "id": 205,
                "file_url": "https://yourdomain.com/media/punch_files/label_installed.jpg",
                "uploaded_at": "2025-05-01T09:00:00Z"
              }
            ],
            "created_by": 4,
            "created_by_name": "Jane Smith",
            "created_at": "2025-05-01T09:15:00Z",
            "verification": {
              "verification_status": "Accepted",
              "rejection_reason": null,
              "verified_by": 2,
              "verified_by_name": "John Doe",
              "verified_at": "2025-05-01T10:30:00Z"
            }
          }
        ],
        "created_by": 3,
        "created_by_name": "Robert Johnson",
        "created_at": "2025-05-03T14:30:00Z",
        "updated_by": 4,
        "updated_by_name": "Jane Smith",
        "updated_at": "2025-05-01T09:15:00Z"
      },
      {
        "id": 4,
        "hoto": 1,
        "punch_file_name": "Duct System 4A",
        "punch_title": "Ventilation not meeting specs",
        "punch_description": "Air flow measurements below specified requirements by 15%",
        "punch_point_raised": "75",
        "punch_point_balance": "30",
        "status": "In Progress",
        "closure_date": "2025-06-30",
        "punch_file": [
          {
            "id": 8,
            "file_url": "https://yourdomain.com/media/punch_files/ventilation_test.pdf",
            "uploaded_at": "2025-04-28T11:20:00Z"
          }
        ],
        "completed_points": [
          {
            "id": 105,
            "punch_point_completed": "35",
            "punch_description": "Replaced damaged damper, flow improved by 10%",
            "status": "Completed",
            "completion_files": [
              {
                "id": 206,
                "file_url": "https://yourdomain.com/media/punch_files/damper_replacement.jpg",
                "uploaded_at": "2025-05-06T16:30:00Z"
              }
            ],
            "created_by": 5,
            "created_by_name": "Tech Team",
            "created_at": "2025-05-06T16:45:00Z",
            "verification": {
              "verification_status": "Pending"
            }
          },
          {
            "id": 106,
            "punch_point_completed": "10",
            "punch_description": "Adjusted ventilation controls for optimal performance",
            "status": "Completed",
            "completion_files": [
              {
                "id": 207,
                "file_url": "https://yourdomain.com/media/punch_files/controls_adjustment.pdf",
                "uploaded_at": "2025-05-07T10:15:00Z"
              }
            ],
            "created_by": 5,
            "created_by_name": "Tech Team",
            "created_at": "2025-05-07T10:30:00Z",
            "verification": {
              "verification_status": "Pending"
            }
          }
        ],
        "created_by": 5,
        "created_by_name": "Maria Garcia",
        "created_at": "2025-04-28T11:20:00Z",
        "updated_by": 5,
        "updated_by_name": "Maria Garcia",
        "updated_at": "2025-05-06T16:45:00Z"
      }
    ]
  };
  // Extract punch points from the response or use dummy data
  const punchPoints = dummyData.data;

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!punchPoints) return;
    
    let result = [...punchPoints];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.punch_file_name && item.punch_file_name.toLowerCase().includes(searchLower)) ||
        (item.punch_title && item.punch_title.toLowerCase().includes(searchLower)) ||
        (item.created_by_name && item.created_by_name.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply sort option
    if (sortOption === "date_asc") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOption === "date_desc") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "title") {
      result.sort((a, b) => a.punch_title.localeCompare(b.punch_title));
    } else if (sortOption === "file_name") {
      result.sort((a, b) => a.punch_file_name.localeCompare(b.punch_file_name));
    } else if (sortOption === "balance_desc") {
      result.sort((a, b) => parseInt(b.punch_point_balance) - parseInt(a.punch_point_balance));
    }

    setFilteredItems(result);
  }, [searchTerm, sortOption, statusFilter, punchPoints]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setStatusFilter("all");
  };
  
  // Handlers for ClosePointsModal
  const handleOpenClosePointsModal = (punchPoint) => {
    setSelectedPunchPoint(punchPoint);
    setOpenClosePointsModal(true);
  };
  
  const handleCloseClosePointsModal = () => {
    setOpenClosePointsModal(false);
    setSelectedPunchPoint(null);
  };
  
  // Handlers for CompletedPointsModal
  const handleOpenCompletedPointsModal = (punchPoint) => {
    setSelectedPunchPoint(punchPoint);
    setOpenCompletedPointsModal(true);
  };
  
  const handleCloseCompletedPointsModal = () => {
    setOpenCompletedPointsModal(false);
    setSelectedPunchPoint(null);
  };
  
  // Handler for close points submission
  const handleSubmitClosePoints = (closePointsData) => {
    console.log('Close points data submitted:', closePointsData);
    // In a real app, this would call an API endpoint
    // For now, we'll just log the data
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
    
    // Convert status to lowercase for consistent comparison
    const statusLower = status.toLowerCase();
    
    switch(statusLower) {
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Completed';
        break;
      case 'not started':
      case 'not_started':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = 'Not Started';
        break;
      case 'in progress':
      case 'in_progress':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'In Progress';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = status;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };

  // Format date string from ISO to local date format
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };
  
  return (
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">HOTO Module (Handover and Takeover)</h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        {projectId ? `Project ID: ${projectId}` : 'No Project Selected'}
      </h3>
      
      {/* Table Section */}
      <div className="mx-auto mt-6">
        <h3 className="text-lg font-semibold text-[#29346B] mb-2">Punch Points:</h3>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-grow max-w-md">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by file name, title or submitter"
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
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value="all">Default Order</MenuItem>
                <MenuItem value="date_asc">Date (Oldest First)</MenuItem>
                <MenuItem value="date_desc">Date (Newest First)</MenuItem>
                <MenuItem value="title">Punch Title</MenuItem>
                <MenuItem value="file_name">File Name</MenuItem>
                <MenuItem value="balance_desc">Balance Points (Highest First)</MenuItem>
              </Select>
            </FormControl>
            
            {/* Status Filter */}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="not started">Not Started</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
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
          
          {/* Action Buttons */}
          {/* <div className="flex gap-2">
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                bgcolor: "#3B82F6", // Blue color
                "&:hover": { bgcolor: "#2563EB" }
              }}
            >
              Print List
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              disabled={!projectId}
              sx={{
                bgcolor: "#FACC15",
                color: "#29346B",
                "&:hover": { bgcolor: "#e5b812" }
              }}
            >
              Add New Punch Point
            </Button>
          </div> */}
        </div>

        {punchPoints && filteredItems.length ? (
          <div className="overflow-x-auto">
            <table id="hoto-punchpoints-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">File Name</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Title</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Points Raised</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Balance</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Status</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Closure Date</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Created By</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-3 border">{index + 1}</td>
                    <td className="py-2 px-3 border">{item.punch_file_name}</td>
                    <td className="py-2 px-3 border">
                      <div className="max-w-xs truncate" title={item.punch_title}>
                        {item.punch_title}
                      </div>
                    </td>
                    <td className="py-2 px-3 border">{item.punch_point_raised}</td>
                    <td className="py-2 px-3 border">{item.punch_point_balance}</td>
                    <td className="py-2 px-3 border">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-2 px-3 border">{formatDate(item.closure_date)}</td>
                    <td className="py-2 px-3 border">{item.created_by_name || `User ID: ${item.created_by}`}</td>
                    <td className="py-2 px-3 border">
                      <div className="flex flex-wrap gap-2">
                        <Tooltip title="View Details">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            sx={{
                              bgcolor: "#29346B",
                              "&:hover": { bgcolor: "#1e2756" },
                              padding: "2px 8px"
                            }}
                          >
                            View
                          </Button>
                        </Tooltip>
                        <Tooltip title="Completion History">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenCompletedPointsModal(item)}
                            startIcon={<HistoryIcon />}
                            sx={{
                              bgcolor: "#8B5CF6", // Purple color
                              "&:hover": { bgcolor: "#7C3AED" },
                              padding: "2px 8px"
                            }}
                          >
                            History
                            {item.completed_points && item.completed_points.length > 0 && (
                              <span className="ml-1 bg-white text-purple-600 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {item.completed_points.length}
                              </span>
                            )}
                          </Button>
                        </Tooltip>
                        {/* <Tooltip title="Upload Files">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<UploadFileIcon />}
                            sx={{
                              bgcolor: "#EC4899", // Pink color
                              "&:hover": { bgcolor: "#DB2777" },
                              padding: "2px 8px"
                            }}
                          >
                            Upload
                          </Button>
                        </Tooltip> */}
                        {/* <Tooltip title="Add Remarks">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CommentIcon />}
                            sx={{
                              bgcolor: "#FACC15",
                              color: "#29346B",
                              "&:hover": { bgcolor: "#e5b812" },
                              padding: "2px 8px"
                            }}
                          >
                            Remarks
                          </Button>
                        </Tooltip> */}
                        {/* <Tooltip title="Verify Punch Point">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<VerifiedIcon />}
                            sx={{
                              bgcolor: "#10B981", // Green color
                              "&:hover": { bgcolor: "#059669" },
                              padding: "2px 8px"
                            }}
                          >
                            Verify
                          </Button>
                        </Tooltip> */}
                        <Tooltip title="Close Points">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenClosePointsModal(item)}
                            startIcon={<DoneAllIcon />}
                            sx={{
                              bgcolor: "#6366F1", // Indigo color
                              "&:hover": { bgcolor: "#4F46E5" },
                              padding: "2px 8px"
                            }}
                          >
                            Close Points
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center p-4 bg-gray-50 border rounded">
            {searchTerm || sortOption !== "all" || statusFilter !== "all" ?
              "No matching punch points found. Try adjusting your filters." :
              "No punch points available for this project."}
          </p>
        )}
      </div>
      
      {/* Close Points Modal */}
      <ClosePointsModal 
        open={openClosePointsModal}
        handleClose={handleCloseClosePointsModal}
        punchPointData={selectedPunchPoint}
        onSubmitClosePoints={handleSubmitClosePoints}
      />
      
      {/* Completed Points History Modal */}
      <CompletedPointsModal
        open={openCompletedPointsModal}
        handleClose={handleCloseCompletedPointsModal}
        punchPointData={selectedPunchPoint}
      />
    </div>
  );
}

export default HotoPunchPoints;