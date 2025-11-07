import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useParams } from 'react-router-dom';

// Import the API hook and modals
import AddPunchPointForm from '../../components/pages/hoto/punchpoints/AddPunchPointForm';
import AcceptRejectPunchPointModal from '../../components/pages/hoto/punchpoints/AcceptRejectPunchPointModal';
import ViewPunchPointModal from '../../components/pages/hoto/punchpoints/ViewPunchPointModal';
import MarkCompletedModal from '../../components/pages/hoto/punchpoints/MarkCompletedModal';
import VerifyCompletedModal from '../../components/pages/hoto/punchpoints/VerifyCompletedModal';
import { useGetAllProjectPunchPointsQuery } from '../../api/hoto/punchPointApi';
// import { useGetAllProjectPunchPointsQuery } from '../../api/hoto/punchPointApi';

function HotoPunchPoints() {
  const { projectId } = useParams();
  
  const { data, isLoading, isError, error, refetch } = useGetAllProjectPunchPointsQuery(projectId, {
    skip: !projectId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Modal states
  const [openAddPunchPointModal, setOpenAddPunchPointModal] = useState(false);
  const [openAcceptRejectModal, setOpenAcceptRejectModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openMarkCompletedModal, setOpenMarkCompletedModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [selectedPunchPoint, setSelectedPunchPoint] = useState(null);
  const [selectedCompletedPunchPoint, setSelectedCompletedPunchPoint] = useState(null);

  // Process and filter data when it changes
  useEffect(() => {
    if (data?.status && data?.data?.punch_points) {
      let items = [...data.data.punch_points];
      
      // Apply search filter
      if (searchTerm) {
        items = items.filter(item => 
          item.punch_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.punch_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.created_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        items = items.filter(item => 
          item.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }
      
      // Apply sorting
      switch(sortOption) {
        case "date_asc":
          items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case "date_desc":
          items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case "title":
          items.sort((a, b) => a.punch_title.localeCompare(b.punch_title));
          break;
        default:
          break;
      }
      
      setFilteredItems(items);
    } else {
      setFilteredItems([]);
    }
  }, [data, searchTerm, sortOption, statusFilter]);

  // Add Punch Point modal handlers
  const handleOpenAddPunchPointModal = () => {
    setOpenAddPunchPointModal(true);
  };
  
  const handleCloseAddPunchPointModal = () => {
    setOpenAddPunchPointModal(false);
  };

  // Accept/Reject modal handlers
  const handleOpenAcceptRejectModal = (punchPoint) => {
    setSelectedPunchPoint(punchPoint);
    setOpenAcceptRejectModal(true);
  };

  const handleCloseAcceptRejectModal = () => {
    setOpenAcceptRejectModal(false);
    setSelectedPunchPoint(null);
  };

  // View modal handlers
  const handleOpenViewModal = (punchPoint) => {
    setSelectedPunchPoint(punchPoint);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedPunchPoint(null);
  };

  // Mark Completed modal handlers
  const handleOpenMarkCompletedModal = (punchPoint) => {
    if (punchPoint.accepted_rejected_points && punchPoint.accepted_rejected_points.length > 0) {
      setSelectedCompletedPunchPoint(punchPoint.accepted_rejected_points[0]);
    } else {
      setSelectedCompletedPunchPoint({
        id: punchPoint.id,
        punch_description: punchPoint.punch_description,
        status: punchPoint.status
      });
    }
    setOpenMarkCompletedModal(true);
  };

  const handleCloseMarkCompletedModal = () => {
    setOpenMarkCompletedModal(false);
    setSelectedCompletedPunchPoint(null);
  };

  // Verify modal handlers
  const handleOpenVerifyModal = (punchPoint) => {
    if (punchPoint.accepted_rejected_points && punchPoint.accepted_rejected_points.length > 0) {
      setSelectedCompletedPunchPoint(punchPoint.accepted_rejected_points[0]);
    } else {
      setSelectedCompletedPunchPoint({
        id: punchPoint.id,
        punch_description: punchPoint.punch_description,
        status: punchPoint.status
      });
    }
    setOpenVerifyModal(true);
  };

  const handleCloseVerifyModal = () => {
    setOpenVerifyModal(false);
    setSelectedCompletedPunchPoint(null);
  };

  // Success handlers
  const handlePunchPointAdded = () => {
    refetch();
  };

  const handleAcceptRejectSuccess = () => {
    refetch();
  };

  const handleMarkCompletedSuccess = () => {
    refetch();
  };

  const handleVerifySuccess = () => {
    refetch();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setStatusFilter("all");
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
    
    const statusLower = status?.toLowerCase() || '';
    
    switch(statusLower) {
      case 'completed':
      case 'closed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Completed';
        break;
      case 'open':
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'Open';
        break;
      case 'in progress':
      case 'in_progress':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        label = 'In Progress';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = 'Rejected';
        break;
      case 'accepted':
        bgColor = 'bg-teal-100';
        textColor = 'text-teal-800';
        label = 'Accepted';
        break;
      case 'verified':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        label = 'Verified';
        break;
      case 'rework':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        label = 'Rework';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = status || 'Unknown';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };

  // Format date
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB');
  };
  
  // Check if punch point can be accepted/rejected (only Open status)
  const canAcceptReject = (punchPoint) => {
    return punchPoint.status?.toLowerCase() === 'open';
  };

  // Check if punch point can be marked as completed (only Accepted status)
  const canMarkCompleted = (punchPoint) => {
  const status = punchPoint.status?.toLowerCase();
  return status === 'accepted' || status === 'rework';
  };

  // Check if punch point can be verified (only Completed status)
  const canVerify = (punchPoint) => {
    return punchPoint.status?.toLowerCase() === 'completed';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md flex items-center justify-center">
        <CircularProgress size={60} sx={{ color: '#29346B' }} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.data?.message || 'Failed to load punch points. Please try again.'}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => refetch()}
          sx={{ bgcolor: '#29346B', '&:hover': { bgcolor: '#1e2756' } }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">
        HOTO Module (Handover and Takeover)
      </h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        Punch Points Management
      </h3>
      
      {/* Table Section */}
      <div className="mx-auto mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-[#29346B]">
            Punch Points: 
            <span className="ml-2 text-gray-600 font-normal">
              ({filteredItems.length} total)
            </span>
          </h3>
          
          {/* Add Punch Point Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddPunchPointModal}
            sx={{
              bgcolor: "#29346B",
              "&:hover": { bgcolor: "#1e2756" },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: "500"
            }}
          >
            Add Punch Point
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-grow max-w-md">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title or description"
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
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rework">Rework</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
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
        </div>

        {/* Data display */}
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table id="hoto-punchpoints-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Title</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Description</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Status</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Created Date</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Created By</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems?.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-3 border">{index + 1}</td>
                    <td className="py-2 px-3 border">
                      <div className="max-w-xs truncate" title={item.punch_title}>
                        {item.punch_title}
                      </div>
                    </td>
                    <td className="py-2 px-3 border">
                      <div className="max-w-xs truncate" title={item.punch_description}>
                        {item.punch_description}
                      </div>
                    </td>
                    <td className="py-2 px-3 border">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-2 px-3 border">{formatDate(item.created_at)}</td>
                    <td className="py-2 px-3 border">
                      {item.created_by_name || `User ${item.created_by}`}
                    </td>
                    <td className="py-2 px-3 border">
                      <div className="flex flex-wrap gap-2">
                        {/* View Button */}
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenViewModal(item)}
                          sx={{ 
                            borderColor: '#29346B', 
                            color: '#29346B',
                            '&:hover': { borderColor: '#1e2756', bgcolor: '#f0f0f0' }
                          }}
                        >
                          View
                        </Button>
                        
                        {/* Accept/Reject Button - only show for Open status */}
                        {canAcceptReject(item) && (
                          <Button 
                            size="small" 
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleOpenAcceptRejectModal(item)}
                            sx={{ 
                              bgcolor: '#4caf50',
                              color: 'white',
                              '&:hover': { bgcolor: '#45a049' }
                            }}
                          >
                            Accept/Reject
                          </Button>
                        )}

                        {/* Mark Completed Button - only show for Accepted status */}
                        {canMarkCompleted(item) && (
                          <Button 
                            size="small" 
                            variant="contained"
                            startIcon={<TaskAltIcon />}
                            onClick={() => handleOpenMarkCompletedModal(item)}
                            sx={{ 
                              bgcolor: '#2196f3',
                              color: 'white',
                              '&:hover': { bgcolor: '#1976d2' }
                            }}
                          >
                            Mark Completed
                          </Button>
                        )}

                        {/* Verify Button - only show for Completed status */}
                        {canVerify(item) && (
                          <Button 
                            size="small" 
                            variant="contained"
                            startIcon={<VerifiedIcon />}
                            onClick={() => handleOpenVerifyModal(item)}
                            sx={{ 
                              bgcolor: '#9c27b0',
                              color: 'white',
                              '&:hover': { bgcolor: '#7b1fa2' }
                            }}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 border rounded">
            <p className="text-gray-600 text-lg">
              {searchTerm || sortOption !== "all" || statusFilter !== "all" ?
                "No matching punch points found. Try adjusting your filters." :
                "No punch points available. Add a new punch point to get started."}
            </p>
          </div>
        )}
      </div>
      
      {/* All Modals */}
      <AddPunchPointForm
        open={openAddPunchPointModal}
        handleClose={handleCloseAddPunchPointModal}
        onSuccess={handlePunchPointAdded}
      />

      <AcceptRejectPunchPointModal
        open={openAcceptRejectModal}
        handleClose={handleCloseAcceptRejectModal}
        punchPoint={selectedPunchPoint}
        projectId={projectId}
        onSuccess={handleAcceptRejectSuccess}
      />

      <ViewPunchPointModal
        open={openViewModal}
        handleClose={handleCloseViewModal}
        punchPoint={selectedPunchPoint}
      />

      <MarkCompletedModal
        open={openMarkCompletedModal}
        handleClose={handleCloseMarkCompletedModal}
        completedPunchPoint={selectedCompletedPunchPoint}
        projectId={projectId}
        onSuccess={handleMarkCompletedSuccess}
      />

      <VerifyCompletedModal
        open={openVerifyModal}
        handleClose={handleCloseVerifyModal}
        completedPunchPoint={selectedCompletedPunchPoint}
        projectId={projectId}
        onSuccess={handleVerifySuccess}
      />
    </div>
  );
}

export default HotoPunchPoints;
