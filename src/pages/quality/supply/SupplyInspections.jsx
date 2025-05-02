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
  DialogActions,
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
import {
  UploadDocumentsModal,
  ViewDocumentsModal,
} from "../../../components/pages/quality/ViewDocumentsModal";
import InspectionCallForm from "../../../components/pages/quality/InspectionCallform/InspectionCall";
// Change the import to use the new hook
import { useGetItemsByProjectQuery } from "../../../api/quality/qualitySupplyApi";
import SelectItemsModal from "../../../components/pages/quality/supply-add-items/SelectItemsModal";
import { useParams } from "react-router-dom";
import MDCCForm from "../../../components/pages/quality/mdccform/mdccForm";
function SupplyInspections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { projectId } = useParams();
  const [mdccOpen, setMdccOpen] = useState(false);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Replace Add Item Modal state with Select Items Modal state
  const [selectItemsModalOpen, setSelectItemsModalOpen] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Use the new RTK Query hook with projectId
  const {
    data: itemsResponse,
    isLoading: isLoadingItems,
    isError: isErrorItems,
    error: itemsError,
    refetch: refetchItems,
  } = useGetItemsByProjectQuery(projectId);

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!itemsResponse?.data || itemsResponse.data.length === 0) {
      setFilteredItems([]);
      return;
    }

    let result = [...itemsResponse.data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.item_number &&
            item.item_number.toLowerCase().includes(searchLower)) ||
          (item.item_name &&
            item.item_name.toLowerCase().includes(searchLower)) ||
          (item.dicipline && item.dicipline.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter((item) => item.item_category === filterCategory);
    }

    // Apply sort option
    if (sortOption === "pending") {
      // Sort by status - pending first
      result.sort((a, b) => {
        if (
          a.status === "pending_inspection" &&
          b.status !== "pending_inspection"
        )
          return -1;
        if (
          b.status === "pending_inspection" &&
          a.status !== "pending_inspection"
        )
          return 1;
        return 0;
      });
    } else if (sortOption === "scheduled") {
      // Sort by scheduled inspections first
      result.sort((a, b) => {
        if (
          a.status === "inspection_scheduled" &&
          b.status !== "inspection_scheduled"
        )
          return -1;
        if (
          b.status === "inspection_scheduled" &&
          a.status !== "inspection_scheduled"
        )
          return 1;
        return 0;
      });
    } else if (sortOption === "date") {
      // Sort by inspection date (ascending)
      result.sort(
        (a, b) =>
          new Date(a.inspection_date || "") - new Date(b.inspection_date || "")
      );
    }

    setFilteredItems(result);
  }, [itemsResponse, searchTerm, sortOption, filterCategory]);

  // Handler for Select Items modal
  const handleOpenSelectItemsModal = () => {
    setSelectItemsModalOpen(true);
  };

  const handleCloseSelectItemsModal = () => {
    setSelectItemsModalOpen(false);
  };

  const handleItemsSelected = async (itemIds) => {
    try {
      // Store the selected item IDs
      setSelectedItemIds(itemIds);

      // Here you could make an API call to send these IDs to the backend
      console.log("Selected item IDs:", itemIds);

      // You can add your API call here like:
      // await addSelectedItems({ itemIds });

      // After successful addition, refetch the items list
      refetchItems();
    } catch (err) {
      console.error("Error handling selected items:", err);
      // Handle error (show notification, etc.)
    }
  };

  // Handlers for various button actions
  const handleUploadDocuments = (item) => {
    setSelectedItem(item);
    setUploadModalOpen(true);
  };

  const handleViewDetails = (item) => {
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
    setSelectedItem(item);
    setComplianceModalOpen(true);
  };

  const handleCloseComplianceModal = () => {
    setComplianceModalOpen(false);
    setSelectedItem(null);
  };

  const handleScheduleInspection = async (item) => {
    // Implement your API call
  };

  const handleRaiseInspectionCall = async (item) => {
    // Implement your API call
  };

  const handleRecordObservations = async (item) => {
    // Implement your API call
  };

  const handleUploadMDCC = async (item) => {
    setSelectedItem(item);
    setMdccOpen(true);
  };

  const handleViewHistory = async (item) => {
    // Implement your API call
  };

  const handleVerifyVendor = async (item) => {
    // Implement your API call
  };

  const handleGenerateInspection = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    if (!status)
      return { label: "Not Set", color: "bg-gray-100 text-gray-800" };

    switch (status) {
      case "pending_inspection":
        return {
          label: "Pending Inspection",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "inspection_scheduled":
        return {
          label: "Inspection Scheduled",
          color: "bg-blue-100 text-blue-800",
        };
      case "observations_pending":
        return {
          label: "Observations Pending",
          color: "bg-orange-100 text-orange-800",
        };
      case "approved":
        return { label: "Approved", color: "bg-green-100 text-green-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Get category display
  const getCategoryDisplay = (category) => {
    if (!category) return { label: "Not Set", description: "" };

    switch (category) {
      case "category_1":
        return {
          label: "Category 1",
          description: "Customer/Owner/EPC witness",
        };
      case "category_2":
        return {
          label: "Category 2",
          description: "Customer/Owner/EPC review",
        };
      case "category_3":
        return { label: "Category 3", description: "EPC inspection" };
      default:
        return { label: category, description: "" };
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
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">
        Quality Inspection Management
      </h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        Project Management
      </h3>

      {/* Items Table */}
      <div className="mx-auto mt-6">
        <h3 className="text-lg font-semibold text-[#29346B] mb-2">
          List of Items:
        </h3>

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
                <MenuItem value="scheduled">
                  Scheduled Inspections First
                </MenuItem>
                <MenuItem value="date">Inspection Date (Earliest)</MenuItem>
              </Select>
            </FormControl>

            {/* Filter by Category */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-filter-label">
                Filter Category
              </InputLabel>
              <Select
                labelId="category-filter-label"
                value={filterCategory}
                label="Filter Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="category_1">Category 1</MenuItem>
                <MenuItem value="category_2">Category 2</MenuItem>
                <MenuItem value="category_3">Category 3</MenuItem>
              </Select>
            </FormControl>

            {/* Clear Filters Button */}
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{
                borderColor: "#29346B",
                color: "#29346B",
                "&:hover": {
                  borderColor: "#1e2756",
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Replace Add Item button with Select Items button */}
          <div className="flex gap-2">
            <Button
              variant="contained"
              onClick={handleOpenSelectItemsModal}
              sx={{
                bgcolor: "#FACC15",
                color: "#29346B",
                "&:hover": { bgcolor: "#e5b812" },
              }}
            >
              Select Items
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#29346B",
                "&:hover": { bgcolor: "#1e2756" },
              }}
            >
              Generate Categorization Document
            </Button>
            <Button
              variant="outlined"
              onClick={refetchItems}
              sx={{
                borderColor: "#29346B",
                color: "#29346B",
                "&:hover": {
                  borderColor: "#1e2756",
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {isLoadingItems ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : isErrorItems ? (
          <p className="text-red-600">
            {itemsError?.data?.message || "Error loading items"}
          </p>
        ) : filteredItems.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Sr
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Item Number
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Item Name
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Category
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Discipline
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Inspection Date
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Status
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Documents
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Inspection
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    MDCC
                  </th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">
                    Vendor Approval
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems?.map((item, index) => {
                  const statusInfo = getStatusDisplay(item.status);
                  const categoryInfo = getCategoryDisplay(item.item_category);

                  return (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-2 px-3 border">{index + 1}</td>
                      <td className="py-2 px-3 border">
                        {item.item_number || "N/A"}
                      </td>
                      <td className="py-2 px-3 border">
                        {item.item_name || "N/A"}
                      </td>
                      <td className="py-2 px-3 border">
                        <div>
                          <span className="font-semibold">
                            {categoryInfo.label}
                          </span>
                          <p className="text-xs text-gray-600">
                            {categoryInfo.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 px-3 border">
                        {item.dicipline || "N/A"}
                      </td>
                      <td className="py-2 px-3 border">
                        {item.inspection_date
                          ? formatDate(item.inspection_date)
                          : "Not Scheduled"}
                      </td>
                      <td className="py-2 px-3 border">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}
                        >
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
                                padding: "2px 8px",
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
                                padding: "2px 8px",
                              }}
                              startIcon={<VisibilityIcon />}
                            >
                              View
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.has_mqap && (
                              <Chip
                                size="small"
                                label="MQAP"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                            {item.has_quality_dossier && (
                              <Chip
                                size="small"
                                label="Dossier"
                                color="success"
                                variant="outlined"
                              />
                            )}
                            {item.has_mdcc && (
                              <Chip
                                size="small"
                                label="MDCC"
                                color="secondary"
                                variant="outlined"
                              />
                            )}
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
                              marginBottom: "4px",
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
                              padding: "2px 8px",
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
                              padding: "2px 8px",
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
                            padding: "2px 8px",
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
            {searchTerm || filterCategory !== "all" || sortOption !== "all"
              ? "No matching items found. Try adjusting your filters."
              : "No items available for this project."}
          </p>
        )}
      </div>

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
      <MDCCForm
        open={mdccOpen}
        handleClose={() => setMdccOpen(false)}
        selectedItem={selectedItem}
      />

      {isDialogOpen && (
        <InspectionCallForm
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedItem={selectedItem}
          projectId={projectId}
        />
      )}

      {/* Replace Add Item Modal with Select Items Modal */}
      <SelectItemsModal
        open={selectItemsModalOpen}
        handleClose={handleCloseSelectItemsModal}
        onItemsSelected={handleItemsSelected}
        selectedItem={selectedItem}
        projectId={projectId} // Pass the projectId to the modal if needed
      />
    </div>
  );
}

export default SupplyInspections;
