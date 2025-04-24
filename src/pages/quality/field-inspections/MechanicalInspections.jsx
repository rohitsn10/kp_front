import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from 'react-router-dom';
import CreateRfiForm from '../../../components/pages/quality/field-inspection/CreateRfiForm';
import RfiOutcomeForm from './RfiOutcomeForm';

function MechanicalInspections() {
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openRfiForm, setOpenRfiForm] = useState(false); // State for RFI form dialog
  const [openOutcomeForm, setOpenOutcomeForm] = useState(false);
  const [selectedRfi, setSelectedRfi] = useState(null);
  // Dummy data for mechanical inspections
  const mechanicalInspectionsData = {
    data: [
      {
        id: "1",
        rfi_number: "RFI-MECH-001",
        date: "2025-05-10",
        epc_name: "PowerGen Engineering",
        offered_date: "2025-04-28",
        project_location: "Block A, Level 2, Room 201"
      },
      {
        id: "2",
        rfi_number: "RFI-MECH-002",
        date: "2025-05-15",
        epc_name: "Industrial Systems Ltd",
        offered_date: "2025-05-05",
        project_location: "Block B, Pump House"
      },
      {
        id: "3",
        rfi_number: "RFI-MECH-003",
        date: "2025-05-20",
        epc_name: "PowerGen Engineering",
        offered_date: "2025-05-12",
        project_location: "Turbine Hall, Section 3"
      },
      {
        id: "4",
        rfi_number: "RFI-MECH-004",
        date: "2025-06-01",
        epc_name: "MechWorks Solutions",
        offered_date: "2025-05-20",
        project_location: "Cooling Tower Area"
      },
      {
        id: "5",
        rfi_number: "RFI-MECH-005",
        date: "2025-06-10",
        epc_name: "Industrial Systems Ltd",
        offered_date: "2025-05-30",
        project_location: "Block C, Boiler Room"
      }
    ]
  };

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let result = [...mechanicalInspectionsData.data];

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(item =>
          item.rfi_number.toLowerCase().includes(searchLower) ||
          item.epc_name.toLowerCase().includes(searchLower) ||
          item.project_location.toLowerCase().includes(searchLower)
        );
      }

      // Apply sort option
      if (sortOption === "date_asc") {
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (sortOption === "date_desc") {
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortOption === "epc_name") {
        result.sort((a, b) => a.epc_name.localeCompare(b.epc_name));
      }

      setFilteredItems(result);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, sortOption]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const handleOpenRfiForm = () => {
    setOpenRfiForm(true);
  };

  const handleCloseRfiForm = () => {
    setOpenRfiForm(false);
  };
  const handleOpenOutcomeForm = (rfi) => {
    setSelectedRfi(rfi);
    setOpenOutcomeForm(true);
  };

  const handleCloseOutcomeForm = () => {
    setOpenOutcomeForm(false);
    setSelectedRfi(null);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
  };

  return (
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">Mechanical Inspections</h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        {projectId ? `Project ID: ${projectId}` : 'No Project Selected'}
      </h3>
      <div>
        {/* <Button
          variant="contained"
          onClick={handleOpenRfiForm}
          sx={{
            bgcolor: "#FACC15",
            color: "#29346B",
            "&:hover": { bgcolor: "#e5b812" }
          }}
        >
          Create RFI
        </Button> */}
      </div>
      {/* Table Section */}
      <div className="mx-auto mt-6">
        <h3 className="text-lg font-semibold text-[#29346B] mb-2">RFI Records:</h3>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-grow max-w-md">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by RFI number, EPC name or location"
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
                <MenuItem value="all">Default Order</MenuItem>
                <MenuItem value="date_asc">Date (Oldest First)</MenuItem>
                <MenuItem value="date_desc">Date (Newest First)</MenuItem>
                <MenuItem value="epc_name">EPC Name</MenuItem>
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
          
          {/* Add RFI button */}
          <div>
            <Button
              variant="contained"
              onClick={handleOpenRfiForm}
              sx={{
                bgcolor: "#FACC15",
                color: "#29346B",
                "&:hover": { bgcolor: "#e5b812" }
              }}
            >
               Create RFI
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        ) : filteredItems.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">RFI Number</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Date</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">EPC Name</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Offered Date</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Project Location</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-3 border">{index + 1}</td>
                    <td className="py-2 px-3 border">{item.rfi_number}</td>
                    <td className="py-2 px-3 border">{formatDate(item.date)}</td>
                    <td className="py-2 px-3 border">{item.epc_name}</td>
                    <td className="py-2 px-3 border">{formatDate(item.offered_date)}</td>
                    <td className="py-2 px-3 border">{item.project_location}</td>
                    <td className="py-2 px-3 border">
                      <div className="flex space-x-2">
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: "#29346B",
                            "&:hover": { bgcolor: "#1e2756" },
                            padding: "2px 8px"
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: "#FACC15",
                            color: "#29346B",
                            "&:hover": { bgcolor: "#e5b812" },
                            padding: "2px 8px"
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleOpenOutcomeForm(item)}
                  sx={{
                    bgcolor: "#10B981", // Green color
                    "&:hover": { bgcolor: "#059669" },
                    padding: "2px 8px"
                  }}
                >
                  Add Outcome
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
            {searchTerm || sortOption !== "all" ?
              "No matching RFIs found. Try adjusting your filters." :
              "No RFIs available for this project."}
          </p>
        )}
      </div>
      <CreateRfiForm 
        open={openRfiForm} 
        handleClose={handleCloseRfiForm} 
        projectId={projectId || ''}
        category="mechanical"
      />
            <RfiOutcomeForm 
        open={openOutcomeForm} 
        handleClose={handleCloseOutcomeForm} 
        rfiData={selectedRfi}
        projectId={projectId || ''}
      />
    </div>
  );
}

export default MechanicalInspections;