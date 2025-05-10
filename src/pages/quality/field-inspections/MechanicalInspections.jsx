import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import { useParams } from 'react-router-dom';
import CreateRfiForm from '../../../components/pages/quality/field-inspection/CreateRfiForm';
import RfiOutcomeForm from './RfiOutcomeForm';
import { 
  useGetMechanicalRfiQuery,
  useGetCreatePhysicalFormRfiQuery
} from '../../../api/quality/qualityApi';
import FileUploadModal from '../../../components/pages/quality/field-inspection/FileUploadModal';
import InspectionViewModal from '../../../components/pages/quality/field-inspection/InspectionViewModal';
// import InspectionViewModal from './InspectionViewModal';

function MechanicalInspections() {
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openRfiForm, setOpenRfiForm] = useState(false); // State for RFI form dialog
  const [openOutcomeForm, setOpenOutcomeForm] = useState(false);
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false); // State for file upload modal
  const [openViewModal, setOpenViewModal] = useState(false); // New state for view modal
  const [selectedRfi, setSelectedRfi] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [currentRfiForPhysicalForm, setCurrentRfiForPhysicalForm] = useState(null);
  
  // Fetch mechanical RFI data from API
  const { data: mechanicalRfiResponse, isLoading: isLoadingRfi, error } = useGetMechanicalRfiQuery(projectId);
  
  // Physical form PDF generation query
  const {
    data: physicalFormData,
    isLoading: isLoadingPhysicalForm,
    error: physicalFormError, 
    refetch: refetchPhysicalForm
  } = useGetCreatePhysicalFormRfiQuery(currentRfiForPhysicalForm?.id, {
    skip: !currentRfiForPhysicalForm,
    refetchOnMountOrArgChange: true
  });

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!mechanicalRfiResponse) return;
    
    setIsLoading(true);
    
    // Short delay for better UX
    setTimeout(() => {
      let result = [...mechanicalRfiResponse.data];

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(item =>
          (item.rfi_number && item.rfi_number.toLowerCase().includes(searchLower)) ||
          (item.epc_name && item.epc_name.toLowerCase().includes(searchLower)) ||
          (item.block_number && item.block_number.toLowerCase().includes(searchLower)) ||
          (item.location_name && item.location_name.toLowerCase().includes(searchLower))
        );
      }

      // Apply sort option
      if (sortOption === "date_asc") {
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (sortOption === "date_desc") {
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortOption === "epc_name") {
        result.sort((a, b) => a.epc_name.localeCompare(b.epc_name));
      }

      setFilteredItems(result);
      setIsLoading(false);
    }, 300);
  }, [searchTerm, sortOption, mechanicalRfiResponse]);

  // Effect to handle download when physical form data is available
  useEffect(() => {
    if (physicalFormData && physicalFormData.data && generating) {
      // Download the PDF
      window.open(physicalFormData.data, '_blank');
      // Reset states
      setGenerating(false);
      setCurrentRfiForPhysicalForm(null);
    }
  }, [physicalFormData, generating]);

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

  // Handler for viewing inspection details
  const handleViewInspection = (rfi) => {
    setSelectedRfi(rfi);
    setOpenViewModal(true);
  };

  // Handler for closing view modal
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedRfi(null);
  };

  // Updated file upload handler
  const handleFileUpload = (rfi) => {
    setSelectedRfi(rfi);
    setOpenFileUploadModal(true);
  };

  // Handler for closing file upload modal
  const handleCloseFileUploadModal = () => {
    setOpenFileUploadModal(false);
    setSelectedRfi(null);
  };

  // Handler for generating physical form
  const handleGeneratePhysicalForm = (rfi) => {
    setGenerating(true);
    setCurrentRfiForPhysicalForm(rfi);
    
    // If we already have the RFI loaded previously, we need to refetch
    if (currentRfiForPhysicalForm?.id === rfi.id) {
      refetchPhysicalForm();
    }
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
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                bgcolor: "#3B82F6", // Blue color
                "&:hover": { bgcolor: "#2563EB" }
              }}
            >
              Print
            </Button> */}
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

        {isLoadingRfi || isLoading ? (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        ) : error ? (
          <p className="text-center p-4 bg-red-50 border rounded text-red-600">
            Error loading RFI data. Please try again later.
          </p>
        ) : mechanicalRfiResponse && filteredItems.length ? (
          <div className="overflow-x-auto">
            <table id="mechanical-rfi-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">RFI Number</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Date Created</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">EPC Name</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Offered Date</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Location</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-3 border">{index + 1}</td>
                    <td className="py-2 px-3 border">{item.rfi_number || 'N/A'}</td>
                    <td className="py-2 px-3 border">{formatDate(item.created_at)}</td>
                    <td className="py-2 px-3 border">{item.epc_name}</td>
                    <td className="py-2 px-3 border">{formatDate(item.offered_date)}</td>
                    <td className="py-2 px-3 border">{`${item.block_number || ''} ${item.location_name || ''}`}</td>
                    <td className="py-2 px-3 border">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleViewInspection(item)}
                          sx={{
                            bgcolor: "#29346B",
                            "&:hover": { bgcolor: "#1e2756" },
                            padding: "2px 8px"
                          }}
                        >
                          View
                        </Button>
                        {/* <Button
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
                        </Button> */}
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
                        {/* Generate Physical Form button */}
                        <Tooltip title="Generate Physical Form">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleGeneratePhysicalForm(item)}
                            startIcon={<DescriptionIcon />}
                            disabled={isLoadingPhysicalForm && currentRfiForPhysicalForm?.id === item.id}
                            sx={{
                              bgcolor: "#8B5CF6", // Purple color
                              "&:hover": { bgcolor: "#7C3AED" },
                              padding: "2px 8px"
                            }}
                          >
                            {isLoadingPhysicalForm && currentRfiForPhysicalForm?.id === item.id ? (
                              <>
                                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                                Generating...
                              </>
                            ) : (
                              "Physical Form"
                            )}
                          </Button>
                        </Tooltip>
                        {/* File Upload button - now properly connected */}
                        <Tooltip title="Upload Files">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleFileUpload(item)}
                            startIcon={<UploadFileIcon />}
                            sx={{
                              bgcolor: "#EC4899", // Pink color
                              "&:hover": { bgcolor: "#DB2777" },
                              padding: "2px 8px"
                            }}
                          >
                            Upload
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
            {searchTerm || sortOption !== "all" ?
              "No matching RFIs found. Try adjusting your filters." :
              "No RFIs available for this project."}
          </p>
        )}
      </div>
      
      {/* All modal components */}
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
      {/* File Upload Modal */}
      <FileUploadModal 
        open={openFileUploadModal}
        handleClose={handleCloseFileUploadModal}
        rfiData={selectedRfi}
      />
      {/* New Inspection View Modal */}
      <InspectionViewModal
        open={openViewModal}
        handleClose={handleCloseViewModal}
        rfiData={selectedRfi}
      />
    </div>
  );
}

export default MechanicalInspections;