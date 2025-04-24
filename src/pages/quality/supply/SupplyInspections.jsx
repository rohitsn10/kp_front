SupplyInspections 

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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ComplianceReportsModal from "../../../components/pages/quality/ComplianceReportsModal";
import { UploadDocumentsModal, ViewDocumentsModal } from "../../../components/pages/quality/ViewDocumentsModal";
// import { UploadDocumentsModal, ViewDocumentsModal } from "../../components/pages/quality/ViewDocumentsModal";
// import ComplianceReportsModal from "../../components/pages/quality/ComplianceReportsModal";

const mockProjects = {
  data: [
    { id: "1", project_name: "Power Plant Expansion" },
    { id: "2", project_name: "Oil Refinery Modernization" },
    { id: "3", project_name: "Chemical Plant Construction" }
  ]
};

// Mock data for items
const mockItems = {
  "1": {
    data: [
      {
        id: "1",
        item_number: "PPE-TRB-001",
        item_name: "Steam Turbine Generator",
        category: "1", // Category 1: Customer/Owner/EPC witness at OEM facilities
        discipline: "Mechanical",
        vendor: "Vendor 1",
        inspection_date: "2025-05-15",
        inspector: "John Smith",
        status: "pending_inspection",
        has_mqap: true,
        has_quality_dossier: false,
        has_mdcc: false,
        updated_at: "2025-04-01T10:30:00Z"
      },
      {
        id: "2",
        item_number: "PPE-HEX-002",
        item_name: "Heat Exchanger",
        category: "2", // Category 2: Customer/Owner/EPC review quality dossier
        discipline: "Mechanical",
        vendor: "Vendor 2",
        inspection_date: "2025-05-20",
        inspector: "Maria Rodriguez",
        status: "inspection_scheduled",
        has_mqap: true,
        has_quality_dossier: true,
        has_mdcc: false,
        updated_at: "2025-04-02T14:45:00Z"
      },
      {
        id: "3",
        item_number: "PPE-PMP-003",
        item_name: "Cooling Water Pump",
        category: "3", // Category 3: EPC conducts inspection and clears material
        discipline: "Mechanical",
        vendor: "Vendor 3",
        inspection_date: "2025-05-10",
        inspector: "Robert Johnson",
        status: "approved",
        has_mqap: true,
        has_quality_dossier: true,
        has_mdcc: true,
        updated_at: "2025-04-03T09:15:00Z"
      },
      {
        id: "4",
        item_number: "PPE-VLV-004",
        item_name: "Control Valves",
        category: "1",
        discipline: "Instrumentation",
        vendor: "Vendor 4",
        inspection_date: "2025-05-25",
        inspector: "Patricia Lee",
        status: "pending_inspection",
        has_mqap: false,
        has_quality_dossier: false,
        has_mdcc: false,
        updated_at: "2025-04-04T11:20:00Z"
      },
      {
        id: "5",
        item_number: "PPE-TRF-005",
        item_name: "Power Transformer",
        category: "2",
        discipline: "Electrical",
        vendor: "Vendor 5",
        inspection_date: "2025-06-05",
        inspector: "David Kim",
        status: "inspection_scheduled",
        has_mqap: true,
        has_quality_dossier: false,
        has_mdcc: false,
        updated_at: "2025-04-05T16:30:00Z"
      },
      
    ]
  },
  "2": {
    data: [
      {
        id: "6",
        item_number: "ORM-RCT-001",
        item_name: "Reactor Vessel",
        category: "1",
        discipline: "Process",
        vendor: "ThyssenKrupp",
        inspection_date: "2025-06-10",
        inspector: "Sarah Chen",
        status: "pending_inspection",
        has_mqap: true,
        has_quality_dossier: false,
        has_mdcc: false,
        updated_at: "2025-04-01T13:45:00Z"
      },
      {
        id: "7",
        item_number: "ORM-COL-002",
        item_name: "Distillation Column",
        category: "1",
        discipline: "Process",
        vendor: "Koch-Glitsch",
        inspection_date: "2025-06-15",
        inspector: "Michael Brown",
        status: "observations_pending",
        has_mqap: true,
        has_quality_dossier: true,
        has_mdcc: false,
        updated_at: "2025-04-02T10:20:00Z"
      }
    ]
  },
  "3": {
    data: [
      {
        id: "8",
        item_number: "CPC-TNK-001",
        item_name: "Storage Tank",
        category: "3",
        discipline: "Civil",
        vendor: "McDermott",
        inspection_date: "2025-05-30",
        inspector: "Jessica Wilson",
        status: "approved",
        has_mqap: true,
        has_quality_dossier: true,
        has_mdcc: true,
        updated_at: "2025-04-03T15:10:00Z"
      }
    ]
  }
};

function SupplyInspections() {
  // Set default project ID to "1" (Power Plant Expansion)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Add Item Modal state
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("1");
  
  // Simulate API loading state for items
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  // Use default project ID "1"
  const selectedProjectId = "1";
  const items = mockItems[selectedProjectId];

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!items?.data) {
      setFilteredItems([]);
      return;
    }

    let result = [...items.data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.item_number.toLowerCase().includes(searchLower) ||
        item.item_name.toLowerCase().includes(searchLower) ||
        item.vendor.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter(item => item.category === filterCategory);
    }

    // Apply sort option
    if (sortOption === "pending") {
      // Sort by status - pending first
      result.sort((a, b) => {
        if (a.status === "pending_inspection" && b.status !== "pending_inspection") return -1;
        if (b.status === "pending_inspection" && a.status !== "pending_inspection") return 1;
        return 0;
      });
    } else if (sortOption === "scheduled") {
      // Sort by scheduled inspections first
      result.sort((a, b) => {
        if (a.status === "inspection_scheduled" && b.status !== "inspection_scheduled") return -1;
        if (b.status === "inspection_scheduled" && a.status !== "inspection_scheduled") return 1;
        return 0;
      });
    } else if (sortOption === "date") {
      // Sort by inspection date (ascending)
      result.sort((a, b) => new Date(a.inspection_date) - new Date(b.inspection_date));
    }

    setFilteredItems(result);
  }, [items, searchTerm, sortOption, filterCategory]);

  // Handler for Add Item modal
  const handleOpenAddItemModal = () => {
    setAddItemModalOpen(true);
  };

  const handleCloseAddItemModal = () => {
    setAddItemModalOpen(false);
    setNewItemName("");
    setNewItemCategory("1");
  };

  const handleAddItem = () => {
    // This would actually add the item in a real implementation
    console.log("Adding new item:", { name: newItemName, category: newItemCategory });
    handleCloseAddItemModal();
  };

  // Handlers for various button actions
  const handleUploadDocuments = (item) => {
    console.log("Upload documents for:", item);
    setSelectedItem(item);
    setUploadModalOpen(true);
  };

  const handleViewDetails = (item) => {
    console.log("View details for:", item);
    setSelectedItem(item);
    setViewModalOpen(true);
  };
  
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
  };
  
  // Compliance Report modal state
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  
  const handleObservations = (item) => {
    console.log("Manage observations for:", item);
    setSelectedItem(item);
    setComplianceModalOpen(true);
  };
  
  const handleCloseComplianceModal = () => {
    setComplianceModalOpen(false);
    setSelectedItem(null);
  };

  const handleScheduleInspection = (item) => {
    console.log("Schedule inspection for:", item);
    // This would open a scheduling modal in a real implementation
  };

  const handleRaiseInspectionCall = (item) => {
    console.log("Raise inspection call for:", item);
    // This would trigger a notification process in a real implementation
  };

  const handleRecordObservations = (item) => {
    console.log("Record observations for:", item);
    // This would open an observations form in a real implementation
  };

  const handleUploadMDCC = (item) => {
    console.log("Upload MDCC for:", item);
    // This would open an MDCC upload modal in a real implementation
  };

  const handleViewHistory = (item) => {
    console.log("View history for:", item);
    // This would open a history view in a real implementation
  };

  const handleVerifyVendor = (item) => {
    console.log("Verify vendor for:", item);
    // This would handle vendor verification in a real implementation
  };

  const handleGenerateInspection = (item) => {
    console.log("Generate inspection for:", item);
    // This would handle inspection generation in a real implementation
  };

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

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending_inspection":
        return { label: "Pending Inspection", color: "bg-yellow-100 text-yellow-800" };
      case "inspection_scheduled":
        return { label: "Inspection Scheduled", color: "bg-blue-100 text-blue-800" };
      case "observations_pending":
        return { label: "Observations Pending", color: "bg-orange-100 text-orange-800" };
      case "approved":
        return { label: "Approved", color: "bg-green-100 text-green-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Get category display
  const getCategoryDisplay = (category) => {
    switch (category) {
      case "1":
        return { label: "Category 1", description: "Customer/Owner/EPC witness" };
      case "2":
        return { label: "Category 2", description: "Customer/Owner/EPC review" };
      case "3":
        return { label: "Category 3", description: "EPC inspection" };
      default:
        return { label: `Category ${category}`, description: "" };
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setFilterCategory("all");
  };

  return (
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">Quality Inspection Management</h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">Power Plant Expansion Project</h3>

      {/* Items Table */}
      {(
        <div className="mx-auto mt-6">
          <h3 className="text-lg font-semibold text-[#29346B] mb-2">List of Items:</h3>

          {/* Search and Filter Controls with Additional Buttons */}
          <div className="flex flex-wrap gap-4 mb-4 justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-grow max-w-md">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by item number, name or vendor"
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
                  <MenuItem value="all">All Items</MenuItem>
                  <MenuItem value="pending">Pending Inspection First</MenuItem>
                  <MenuItem value="scheduled">Scheduled Inspections First</MenuItem>
                  <MenuItem value="date">Inspection Date (Earliest)</MenuItem>
                </Select>
              </FormControl>

              {/* Filter by Category */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="category-filter-label">Filter Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={filterCategory}
                  label="Filter Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="1">Category 1</MenuItem>
                  <MenuItem value="2">Category 2</MenuItem>
                  <MenuItem value="3">Category 3</MenuItem>
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
            
            {/* Add Item and Generate Categorization Document buttons */}
            <div className="flex gap-2">
              <Button
                variant="contained"
                onClick={handleOpenAddItemModal}
                sx={{
                  bgcolor: "#FACC15",
                  color: "#29346B",
                  "&:hover": { bgcolor: "#e5b812" }
                }}
              >
                Add Item
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#29346B",
                  "&:hover": { bgcolor: "#1e2756" }
                }}
              >
                Generate Categorization Document
              </Button>
            </div>
          </div>

          {isLoadingItems ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : !items?.data ? (
            <p className="text-red-600">Error fetching items</p>
          ) : filteredItems.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Item Number</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Item Name</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Category</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Discipline</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Vendor</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Inspection Date</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Status</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Documents</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Inspection</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">MDCC</th>
                    <th className="py-2 px-3 text-[#29346B] border text-left">Vendor Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems?.map((item, index) => {
                    const statusInfo = getStatusDisplay(item.status);
                    const categoryInfo = getCategoryDisplay(item.category);
                    
                    return (
                      <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-2 px-3 border">{index + 1}</td>
                        <td className="py-2 px-3 border">{item.item_number}</td>
                        <td className="py-2 px-3 border">{item.item_name}</td>
                        <td className="py-2 px-3 border">
                          <div>
                            <span className="font-semibold">{categoryInfo.label}</span>
                            <p className="text-xs text-gray-600">{categoryInfo.description}</p>
                          </div>
                        </td>
                        <td className="py-2 px-3 border">{item.discipline}</td>
                        <td className="py-2 px-3 border">{item.vendor}</td>
                        <td className="py-2 px-3 border">{formatDate(item.inspection_date)}</td>
                        <td className="py-2 px-3 border">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-2 px-3 border">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleUploadDocuments(item)}
                                sx={{
                                  bgcolor: "#FACC15",
                                  color: "#29346B",
                                  "&:hover": { bgcolor: "#e5b812" },
                                  marginRight: "6px",
                                  padding: "2px 8px"
                                }}
                                startIcon={<UploadFileIcon />}
                              >
                                Upload
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleViewDetails(item)}
                                sx={{
                                  bgcolor: "#29346B",
                                  "&:hover": { bgcolor: "#1e2756" },
                                  padding: "2px 8px"
                                }}
                                startIcon={<VisibilityIcon />}
                              >
                                View
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.has_mqap && <Chip size="small" label="MQAP" color="primary" variant="outlined" />}
                              {item.has_quality_dossier && <Chip size="small" label="Dossier" color="success" variant="outlined" />}
                              {item.has_mdcc && <Chip size="small" label="MDCC" color="secondary" variant="outlined" />}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 border">
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleObservations(item)}
                              sx={{
                                bgcolor: "#A855F7",
                                "&:hover": { bgcolor: "#9333EA" },
                                padding: "2px 8px",
                                marginBottom: "4px"
                              }}
                              startIcon={<AssignmentIcon />}
                            >
                              Observations
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleGenerateInspection(item)}
                              sx={{
                                bgcolor: "#3B82F6",
                                "&:hover": { bgcolor: "#2563EB" },
                                padding: "2px 8px"
                              }}
                              startIcon={<AssessmentIcon />}
                            >
                              Generate Inspection Call
                            </Button>
                          </div>
                        </td>
                        <td className="py-2 px-3 border">
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleUploadMDCC(item)}
                              sx={{
                                bgcolor: "#10B981",
                                "&:hover": { bgcolor: "#0ea271" },
                                marginBottom: "4px",
                                padding: "2px 8px"
                              }}
                              startIcon={<CheckCircleOutlineIcon />}
                            >
                              Generate MDCC
                            </Button>
                          </div>
                        </td>
                        <td className="py-2 px-3 border">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleVerifyVendor(item)}
                            sx={{
                              bgcolor: "#F59E0B",
                              "&:hover": { bgcolor: "#D97706" },
                              padding: "2px 8px"
                            }}
                            startIcon={<VerifiedUserIcon />}
                          >
                            Verify Vendor
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center p-4 bg-gray-50 border rounded">
              {searchTerm || filterCategory !== "all" || sortOption !== "all" ?
                "No matching items found. Try adjusting your filters." :
                "No items available for this project."}
            </p>
          )}
        </div>
      )}
      
      {/* Document Modals */}
      <UploadDocumentsModal
        open={uploadModalOpen}
        handleClose={handleCloseUploadModal}
        itemDetails={selectedItem}
      />
      <ViewDocumentsModal
        open={viewModalOpen}
        handleClose={handleCloseViewModal}
        itemDetails={selectedItem}
      />
      <ComplianceReportsModal
        open={complianceModalOpen}
        handleClose={handleCloseComplianceModal}
        itemDetails={selectedItem}
      />

      {/* Add Item Modal */}
      <Dialog open={addItemModalOpen} onClose={handleCloseAddItemModal}>
        <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>Add New Item</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: "400px" }}>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the details for the new item.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="item-name"
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={newItemCategory}
              label="Category"
              onChange={(e) => setNewItemCategory(e.target.value)}
            >
              <MenuItem value="1">Category 1</MenuItem>
              <MenuItem value="2">Category 2</MenuItem>
              <MenuItem value="3">Category 3</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseAddItemModal}
            sx={{ color: "#29346B" }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddItem}
            variant="contained"
            sx={{
              bgcolor: "#FACC15",
              color: "#29346B",
              "&:hover": { bgcolor: "#e5b812" }
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SupplyInspections;