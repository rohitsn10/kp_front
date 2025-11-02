import { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

// Import only the Add modal
import AddPunchPointForm from '../../components/pages/hoto/punchpoints/AddPunchPointForm';

function HotoPunchPoints() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Modal state - only for Add Punch Point
  const [openAddPunchPointModal, setOpenAddPunchPointModal] = useState(false);

  // Add Punch Point modal handlers
  const handleOpenAddPunchPointModal = () => {
    setOpenAddPunchPointModal(true);
  };
  
  const handleCloseAddPunchPointModal = () => {
    setOpenAddPunchPointModal(false);
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
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">
        HOTO Module (Handover and Takeover)
      </h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        Punch Points Management
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

        {/* Data display - Empty state for now */}
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table id="hoto-punchpoints-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
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
                {filteredItems?.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-3 border">{index + 1}</td>
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
                        {/* Actions will be implemented later */}
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
              "No punch points available. Add a new punch point to get started."}
          </p>
        )}
      </div>
      
      {/* Add Punch Point Modal - Only this modal remains */}
      <AddPunchPointForm
        open={openAddPunchPointModal}
        handleClose={handleCloseAddPunchPointModal}
      />
    </div>
  );
}

export default HotoPunchPoints;
