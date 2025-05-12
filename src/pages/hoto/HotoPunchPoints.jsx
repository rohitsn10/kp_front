import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from 'react-router-dom';

// Import the RTK Query hook
// import { useGetAllPunchPointDetailsQuery } from '../../services/api'; // Adjust the path based on your project structure

// Import the modals
import CompletedPointsModal from '../../components/pages/hoto/punchpoints/CompletedPointsModal';
import ClosePointsModal from '../../components/pages/hoto/punchpoints/ClosePointsModal';
import AddPunchPointForm from '../../components/pages/hoto/punchpoints/AddPunchPointForm';
import { useGetAllPunchPointDetailsQuery } from '../../api/hoto/punchPointApi';
import ViewPunchPointModal from '../../components/pages/hoto/punchpoints/ViewPunchPointModal';

function HotoPunchPoints() {
  const { projectId, documentId: hotoId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  
  // Modal states
  const [openClosePointsModal, setOpenClosePointsModal] = useState(false);
  const [openCompletedPointsModal, setOpenCompletedPointsModal] = useState(false);
  const [openAddPunchPointModal, setOpenAddPunchPointModal] = useState(false);
  const [selectedPunchPoint, setSelectedPunchPoint] = useState(null);
const [openViewModal, setOpenViewModal] = useState(false);

  // Fetch data using RTK Query hook
  const { data: punchPointsData, error, isLoading } = useGetAllPunchPointDetailsQuery(hotoId);

  // Transform data to connect completed points and verified points to their respective punch points
  useEffect(() => {
    if (punchPointsData?.status && punchPointsData.data) {
      const { punch_points, completed_punch_points } = punchPointsData.data;
      
      // Map and transform the data to connect related points
      const transformed = punch_points.map(punchPoint => {
        // Find all completed points related to this punch point
        const relatedCompletedPoints = completed_punch_points.filter(
          cp => cp.raise_punch === punchPoint.id
        );
        
        // Calculate the balance by subtracting the sum of completed points from the raised points
        const completedPointsSum = relatedCompletedPoints.reduce(
          (sum, cp) => sum + parseInt(cp.punch_point_completed || 0, 10), 
          0
        );
        
        const raisedPoints = parseInt(punchPoint.punch_point_raised || 0, 10);
        const balance = raisedPoints - completedPointsSum;
        
        // Determine the overall status based on completed and verified points
        let status = punchPoint.status || "Pending";
        
        if (relatedCompletedPoints.length > 0) {
          // Check if all completed points are verified and have "Completed" status
          const allCompleted = relatedCompletedPoints.every(cp => 
            cp.verified && cp.verified.status === "Completed"
          );
          
          if (completedPointsSum >= raisedPoints && allCompleted) {
            status = "Completed";
          } else if (completedPointsSum > 0) {
            status = "In Progress";
          }
        }
        
        // Get the filename from the first file in the punch_file array if it exists
        const punch_file_name = punchPoint.punch_file && punchPoint.punch_file.length > 0
          ? punchPoint.punch_file[0].file.split('/').pop()
          : 'N/A';
        
        return {
          ...punchPoint,
          punch_file_name,
          punch_point_balance: balance.toString(),
          completed_points: relatedCompletedPoints,
          status,
          // For the closure date, use the date of the latest verified point if any
          closure_date: relatedCompletedPoints
            .filter(cp => cp.verified && cp.verified.status === "Completed")
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0]?.verified?.updated_at
        };
      });
      
      setTransformedData(transformed);
    }
  }, [punchPointsData]);

  // Filter and sort data
  useEffect(() => {
    if (!transformedData.length) return;
    
    let result = [...transformedData];

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
  }, [searchTerm, sortOption, statusFilter, transformedData]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setStatusFilter("all");
  };
  
  // Modal handlers
  const handleOpenClosePointsModal = (punchPoint) => {
    setSelectedPunchPoint(punchPoint);
    setOpenClosePointsModal(true);
  };
  
  const handleCloseClosePointsModal = () => {
    setOpenClosePointsModal(false);
    setSelectedPunchPoint(null);
  };
  
  const handleOpenCompletedPointsModal = (punchPoint) => {
    setSelectedPunchPoint(punchPoint);
    setOpenCompletedPointsModal(true);
  };
  
  const handleCloseCompletedPointsModal = () => {
    setOpenCompletedPointsModal(false);
    setSelectedPunchPoint(null);
  };
  
  // Add Punch Point modal handlers
  const handleOpenAddPunchPointModal = () => {
    setOpenAddPunchPointModal(true);
  };
  
  const handleCloseAddPunchPointModal = () => {
    setOpenAddPunchPointModal(false);
  };
  
  // Form submission handlers
  const handleSubmitClosePoints = (closePointsData) => {
    console.log('Close points data submitted:', closePointsData);
    handleCloseClosePointsModal();
  };

  const handleOpenViewModal = (punchPoint) => {
  setSelectedPunchPoint(punchPoint);
  setOpenViewModal(true);
};

const handleCloseViewModal = () => {
  setOpenViewModal(false);
  setSelectedPunchPoint(null);
};

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
    
    const statusLower = status.toLowerCase();
    
    switch(statusLower) {
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Completed';
        break;
      case 'pending':
      case 'not started':
      case 'not_started':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = statusLower === 'pending' ? 'Pending' : 'Not Started';
        break;
      case 'in progress':
      case 'in_progress':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'In Progress';
        break;
      case 'rejected':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        label = 'Rejected';
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

  // Format date
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB');
  };
  
  return (
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">HOTO Module (Handover and Takeover)</h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        {projectId ? `Project ID: ${projectId}` : 'No Project Selected'}
        {hotoId ? ` | HOTO ID: ${hotoId}` : ''}
      </h3>
      
      {/* Table Section */}
      <div className="mx-auto mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-[#29346B]">Punch Points:</h3>
          
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
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <CircularProgress color="primary" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded text-red-700 my-4">
            Error loading punch points: {error.message || 'Unknown error occurred'}
          </div>
        )}

        {/* Data display */}
        {!isLoading && !error && filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table id="hoto-punchpoints-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  {/* <th className="py-2 px-3 text-[#29346B] border text-left">File Name</th> */}
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
                    {/* <td className="py-2 px-3 border">{item.punch_file_name}</td> */}
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
    onClick={() => handleOpenViewModal(item)}
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
                              bgcolor: "#8B5CF6",
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
                        <Tooltip title="Close Points">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenClosePointsModal(item)}
                            startIcon={<DoneAllIcon />}
                            disabled={item.status === "Completed" || parseInt(item.punch_point_balance) === 0}
                            sx={{
                              bgcolor: "#6366F1",
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
          !isLoading && (
            <p className="text-center p-4 bg-gray-50 border rounded">
              {searchTerm || sortOption !== "all" || statusFilter !== "all" ?
                "No matching punch points found. Try adjusting your filters." :
                "No punch points available for this project."}
            </p>
          )
        )}
      </div>
      
      {/* Modals */}
      {selectedPunchPoint && (
        <>
          <ClosePointsModal 
            open={openClosePointsModal}
            handleClose={handleCloseClosePointsModal}
            punchPointData={selectedPunchPoint}
          />
          
          <CompletedPointsModal
            open={openCompletedPointsModal}
            handleClose={handleCloseCompletedPointsModal}
            punchPointData={selectedPunchPoint}
          />

              <ViewPunchPointModal
      open={openViewModal}
      handleClose={handleCloseViewModal}
      punchPointData={selectedPunchPoint}
    />

        </>

      )}
      
      {/* Add Punch Point Modal */}
      <AddPunchPointForm
        open={openAddPunchPointModal}
        handleClose={handleCloseAddPunchPointModal}
        hotoId={hotoId}
      />
    </div>
  );
}

export default HotoPunchPoints;