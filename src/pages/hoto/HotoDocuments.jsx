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
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VerifiedIcon from "@mui/icons-material/Verified";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from 'react-router-dom';
import DocumentDetailsDialog from '../../components/pages/hoto/documents-page/DocumentDetailsDialog';
import RemarksDialog from '../../components/pages/hoto/documents-page/RemarksDialog';
import FileUploadModal from '../../components/pages/hoto/documents-page/FileUploadModal';
import VerifyDocumentDialog from '../../components/pages/hoto/documents-page/VerifyDocumentDialog';
import { useGetDocumentsByProjectIdQuery } from '../../api/hoto/hotoApi';
import AddDocumentModal from '../../components/pages/hoto/documents-page/AddDocumentModal';
// import { useGetDocumentsByProjectIdQuery } from '../../path/to/your/api'; // Update with your actual API path

function HotoDocuments() {
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  // State for dialogs
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false);
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false);
  // Fetch documents using the RTK Query hook
  const { 
    data: documentsResponse, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useGetDocumentsByProjectIdQuery(projectId);

  // Extract documents from the response
  const documents = documentsResponse?.data || [];

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!documents) return;
    
    let result = [...documents];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.document_name && item.document_name.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower)) ||
        (item.created_by_name && item.created_by_name.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(item => item.status.toLowerCase() === statusFilter);
    }

    // Apply sort option
    if (sortOption === "date_asc") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOption === "date_desc") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "name") {
      result.sort((a, b) => a.document_name.localeCompare(b.document_name));
    } else if (sortOption === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredItems(result);
  }, [searchTerm, sortOption, statusFilter, documents]);

  // Handlers for modal actions
  const handleFileUpload = (document) => {
    setSelectedDocument(document);
    setOpenFileUploadModal(true);
  };

  const handleCloseFileUploadModal = () => {
    setOpenFileUploadModal(false);
    setSelectedDocument(null);
  };
  
  const handleOpenRemarksDialog = (document) => {
    setSelectedDocument(document);
    setOpenRemarksDialog(true);
  };

  const handleCloseRemarksDialog = () => {
    setOpenRemarksDialog(false);
    setSelectedDocument(null);
  };
  
  const handleOpenVerifyDialog = (document) => {
    setSelectedDocument(document);
    setOpenVerifyDialog(true);
  };

  const handleCloseVerifyDialog = () => {
    setOpenVerifyDialog(false);
    setSelectedDocument(null);
  };
  
  const handleOpenDetailsDialog = (document) => {
    setSelectedDocument(document);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedDocument(null);
  };
  const handleOpenAddDocumentModal = () => {
    setOpenAddDocumentModal(true);
  };
  
  const handleCloseAddDocumentModal = () => {
    setOpenAddDocumentModal(false);
  };
  
  const handleOpenPunchPoints = (item)=>{
    // navigate(`/hoto-page/add-document/punchpoints/${projectId}/${item.id}`);
    window.location.href = `/hoto-page/punchpoints/${projectId}/${item.id}`;
  }
  // Add a handler for successful document upload
  const handleDocumentUploadSuccess = () => {
    refetch(); // Refresh the documents list
  };

  // Update functions
  const handleSaveRemarks = (documentId, remarks) => {
    refetch();
  };

  const handleVerifyDocument = (documentId, status, comment) => {
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
    
    // Convert status to lowercase for consistent comparison
    const statusLower = status.toLowerCase();
    
    switch(statusLower) {
      case 'approved':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Approved';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = 'Rejected';
        break;
      case 'needs revision':
      case 'needs_revision':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        label = 'Needs Revision';
        break;
      case 'pending':
      default:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'Pending';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };

  // Calculate HOTO process completion percentage

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
        <h3 className="text-lg font-semibold text-[#29346B] mb-2">HOTO Documents:</h3>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-grow max-w-md">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by document name, category or submitter"
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
                <MenuItem value="name">Document Name</MenuItem>
                <MenuItem value="category">Category</MenuItem>
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
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="needs_revision">Needs Revision</MenuItem>
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
  onClick={handleOpenAddDocumentModal}
  disabled={!projectId}
  sx={{
    bgcolor: "#FACC15",
    color: "#29346B",
    "&:hover": { bgcolor: "#e5b812" }
  }}
>
  Upload New Document
</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        ) : isError ? (
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">Error loading documents: {error?.message || 'Unknown error'}</p>
            <Button 
              variant="contained" 
              onClick={refetch}
              sx={{ mt: 2, bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }}
            >
              Retry
            </Button>
          </div>
        ) : documents && filteredItems.length ? (
          <div className="overflow-x-auto">
            <table id="hoto-documents-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Document Name</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Category</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Date Created</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Created By</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Status</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Remarks</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-3 border">{index + 1}</td>
                    <td className="py-2 px-3 border">{item.document_name}</td>
                    <td className="py-2 px-3 border">{item.category}</td>
                    <td className="py-2 px-3 border">{formatDate(item.created_at)}</td>
                    <td className="py-2 px-3 border">{item.created_by_name || `User ID: ${item.created_by}`}</td>
                    <td className="py-2 px-3 border">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-2 px-3 border">
                      <div className="max-w-xs truncate">
                        {item.remarks || "No remarks"}
                      </div>
                    </td>
                    <td className="py-2 px-3 border">
                      <div className="flex flex-wrap gap-2">
                        <Tooltip title="View Details">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenDetailsDialog(item)}
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
                        <Tooltip title="Add Remarks">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenRemarksDialog(item)}
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
                        </Tooltip>
                        <Tooltip title="Verify Document">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenVerifyDialog(item)}
                            startIcon={<VerifiedIcon />}
                            sx={{
                              bgcolor: "#10B981", // Green color
                              "&:hover": { bgcolor: "#059669" },
                              padding: "2px 8px"
                            }}
                          >
                            Verify
                          </Button>
                        </Tooltip>
                        <Tooltip title="Punchpoints">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenPunchPoints(item)}
                            startIcon={<VerifiedIcon />}
                            sx={{
                              bgcolor: "#10B981", // Green color
                              "&:hover": { bgcolor: "#059669" },
                              padding: "2px 8px"
                            }}
                          >
                            Punchpoints
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
              "No matching documents found. Try adjusting your filters." :
              "No documents available for this project."}
          </p>
        )}
      </div>
      
      {/* All modal components */}
      <FileUploadModal 
        open={openFileUploadModal}
        handleClose={handleCloseFileUploadModal}
        documentData={selectedDocument}
      />
      <RemarksDialog 
        open={openRemarksDialog}
        handleClose={handleCloseRemarksDialog}
        documentData={selectedDocument}
        onSaveRemarks={handleSaveRemarks}
      />
      <VerifyDocumentDialog 
        open={openVerifyDialog}
        handleClose={handleCloseVerifyDialog}
        documentData={selectedDocument}
        onVerifyDocument={handleVerifyDocument}
      />
      <DocumentDetailsDialog 
        open={openDetailsDialog}
        handleClose={handleCloseDetailsDialog}
        documentData={selectedDocument}
      />
      <AddDocumentModal 
  open={openAddDocumentModal}
  handleClose={handleCloseAddDocumentModal}
  projectId={projectId}
  onSuccess={handleDocumentUploadSuccess}
/>
    </div>
  );
}

export default HotoDocuments;