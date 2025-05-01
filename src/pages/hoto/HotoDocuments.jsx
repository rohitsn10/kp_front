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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedIcon from "@mui/icons-material/Verified";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useParams } from 'react-router-dom';

// Mock component for file upload modal
const FileUploadModal = ({ open, handleClose, documentData }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload Files for {documentData?.document_name}</DialogTitle>
      <DialogContent>
        <div className="mt-4">
          <input
            type="file"
            multiple
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-gray-600 mt-2">
            Supported file types: PDF, JPEG, PNG, DWG, XLS, DOCX (Max 10MB per file)
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#29346B" }}>
          Cancel
        </Button>
        <Button 
          sx={{ 
            bgcolor: "#29346B", 
            color: "white", 
            "&:hover": { bgcolor: "#1e2756" } 
          }}
        >
          Upload Files
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Mock component for remarks dialog
const RemarksDialog = ({ open, handleClose, documentData, onSaveRemarks }) => {
  const [remarks, setRemarks] = useState(documentData?.remarks || "");

  const handleSave = () => {
    onSaveRemarks(documentData.id, remarks);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Remarks for {documentData?.document_name}</DialogTitle>
      <DialogContent>
        <div className="mt-4">
          <TextareaAutosize
            minRows={5}
            placeholder="Enter your remarks here..."
            className="w-full p-2 border border-gray-300 rounded"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#29346B" }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          sx={{ 
            bgcolor: "#29346B", 
            color: "white", 
            "&:hover": { bgcolor: "#1e2756" } 
          }}
        >
          Save Remarks
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Mock component for document verification
const VerifyDocumentDialog = ({ open, handleClose, documentData, onVerifyDocument }) => {
  const [verificationComment, setVerificationComment] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("approved");

  const handleVerify = () => {
    onVerifyDocument(documentData.id, verificationStatus, verificationComment);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Verify Document: {documentData?.document_name}</DialogTitle>
      <DialogContent>
        <div className="mt-4">
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="verification-status-label">Verification Status</InputLabel>
            <Select
              labelId="verification-status-label"
              value={verificationStatus}
              label="Verification Status"
              onChange={(e) => setVerificationStatus(e.target.value)}
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="needs_revision">Needs Revision</MenuItem>
            </Select>
          </FormControl>
          
          <TextareaAutosize
            minRows={5}
            placeholder="Enter verification comments here..."
            className="w-full p-2 border border-gray-300 rounded"
            value={verificationComment}
            onChange={(e) => setVerificationComment(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#29346B" }}>
          Cancel
        </Button>
        <Button 
          onClick={handleVerify}
          sx={{ 
            bgcolor: "#29346B", 
            color: "white", 
            "&:hover": { bgcolor: "#1e2756" } 
          }}
        >
          Submit Verification
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Mock component for document details view
const DocumentDetailsDialog = ({ open, handleClose, documentData }) => {
  if (!documentData) return null;
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Document Details: {documentData?.document_name}</DialogTitle>
      <DialogContent>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Document ID</p>
            <p className="font-semibold">{documentData.id}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Category</p>
            <p className="font-semibold">{documentData.category}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Submitted Date</p>
            <p className="font-semibold">{documentData.date_submitted}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Submitted By</p>
            <p className="font-semibold">{documentData.submitted_by}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="font-semibold">
              {documentData.verification_status === "approved" && 
                <span className="text-green-600">Approved</span>
              }
              {documentData.verification_status === "pending" && 
                <span className="text-yellow-600">Pending</span>
              }
              {documentData.verification_status === "rejected" && 
                <span className="text-red-600">Rejected</span>
              }
              {documentData.verification_status === "needs_revision" && 
                <span className="text-orange-600">Needs Revision</span>
              }
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Last Updated</p>
            <p className="font-semibold">{documentData.last_updated || "N/A"}</p>
          </div>
          <div className="col-span-1 md:col-span-2 border-b pb-2">
            <p className="text-gray-600 text-sm">Remarks</p>
            <p>{documentData.remarks || "No remarks added yet."}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-gray-600 text-sm">Verification Comments</p>
            <p>{documentData.verification_comment || "No verification comments yet."}</p>
          </div>
          
          {documentData.files && documentData.files.length > 0 && (
            <div className="col-span-1 md:col-span-2 mt-4">
              <p className="text-gray-600 text-sm font-semibold">Uploaded Files</p>
              <ul className="list-disc pl-5 mt-2">
                {documentData.files.map((file, index) => (
                  <li key={index} className="mb-1">
                    <a href="#" className="text-blue-600 hover:underline">{file.name}</a>
                    <span className="text-xs text-gray-500 ml-2">({file.size})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#29346B" }}>
          Close
        </Button>
        <Button 
          sx={{ 
            bgcolor: "#FACC15", 
            color: "#29346B", 
            "&:hover": { bgcolor: "#e5b812" } 
          }}
        >
          Download All Files
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Generate dummy HOTO document data based on the provided document names
const generateDummyDocuments = () => {
  const documentNames = [
    "Performance Ratio (PR) measurement data",
    "PLF data for 15 Days (PAT)",
    "Plant ABT meter sealing certificate",
    "Plant ABT meter test report",
    "Module Bar code scanning data / Flash report/Module details",
    "NLDC/SLDC Communication Approval Letter",
    "Civil Drawings- with latest EDL",
    "Plant layout",
    "Individual ICR room layout",
    "MCR room layout",
    "Switch Yard overall Foundation details",
    "Water Tank - Nos, location, capacity, drwg"
  ];

  const categories = [
    "Performance Data",
    "Performance Data",
    "Metering",
    "Metering",
    "Module Data",
    "Regulatory",
    "Civil Documentation",
    "Layout Documentation",
    "Layout Documentation",
    "Layout Documentation",
    "Foundation Documentation",
    "Water System Documentation"
  ];

  // Function to generate a random date in the last 30 days
  const getRandomDate = () => {
    const today = new Date();
    const prevDays = Math.floor(Math.random() * 30);
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() - prevDays);
    return randomDate.toLocaleDateString('en-GB');
  };

  // Generate users
  const users = ["John Smith", "Maria Rodriguez", "Alex Wong", "Priya Patel", "David Johnson"];

  // Generate verification statuses with higher probability of pending
  const getRandomStatus = () => {
    const statuses = ["pending", "approved", "rejected", "needs_revision"];
    const weights = [0.6, 0.2, 0.1, 0.1]; // 60% chance of pending
    
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return statuses[i];
    }
    return statuses[0];
  };

  // Generate sample files for some documents
  const getRandomFiles = () => {
    const filePrefixes = ["Report_", "Drawing_", "Certificate_", "Data_", "Layout_"];
    const fileSuffixes = [".pdf", ".xlsx", ".dwg", ".doc", ".jpg"];
    const fileSizes = ["2.3 MB", "1.7 MB", "5.1 MB", "856 KB", "3.2 MB"];
    
    const numFiles = Math.floor(Math.random() * 4); // 0-3 files
    const files = [];
    
    for (let i = 0; i < numFiles; i++) {
      const prefix = filePrefixes[Math.floor(Math.random() * filePrefixes.length)];
      const suffix = fileSuffixes[Math.floor(Math.random() * fileSuffixes.length)];
      const size = fileSizes[Math.floor(Math.random() * fileSizes.length)];
      
      files.push({
        name: `${prefix}${Math.floor(Math.random() * 1000)}${suffix}`,
        size: size,
        uploaded_date: getRandomDate()
      });
    }
    
    return files;
  };

  // Generate sample remarks for some documents
  const getRandomRemarks = () => {
    const remarkOptions = [
      "",
      "Document needs to be updated with latest measurements",
      "Waiting for final approval from engineering team",
      "Revision required for section 3.2",
      "Missing some data points in the report",
      ""
    ];
    
    return remarkOptions[Math.floor(Math.random() * remarkOptions.length)];
  };

  // Generate documents
  return documentNames.map((name, index) => ({
    id: `DOC-${1000 + index}`,
    document_name: name,
    category: categories[index],
    date_submitted: getRandomDate(),
    submitted_by: users[Math.floor(Math.random() * users.length)],
    verification_status: getRandomStatus(),
    remarks: getRandomRemarks(),
    verification_comment: "",
    last_updated: getRandomDate(),
    files: getRandomFiles()
  }));
};

function HotoDocuments() {
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dialogs
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false);
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  
  // Mock data - in a real application, this would come from an API
  const [documents, setDocuments] = useState(generateDummyDocuments());

  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!documents) return;
    
    setIsLoading(true);
    
    // Short delay for better UX
    setTimeout(() => {
      let result = [...documents];

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(item =>
          (item.document_name && item.document_name.toLowerCase().includes(searchLower)) ||
          (item.category && item.category.toLowerCase().includes(searchLower)) ||
          (item.submitted_by && item.submitted_by.toLowerCase().includes(searchLower))
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        result = result.filter(item => item.verification_status === statusFilter);
      }

      // Apply sort option
      if (sortOption === "date_asc") {
        result.sort((a, b) => new Date(a.date_submitted) - new Date(b.date_submitted));
      } else if (sortOption === "date_desc") {
        result.sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted));
      } else if (sortOption === "name") {
        result.sort((a, b) => a.document_name.localeCompare(b.document_name));
      } else if (sortOption === "category") {
        result.sort((a, b) => a.category.localeCompare(b.category));
      }

      setFilteredItems(result);
      setIsLoading(false);
    }, 300);
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

  // Update functions
  const handleSaveRemarks = (documentId, remarks) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === documentId ? { ...doc, remarks: remarks, last_updated: new Date().toLocaleDateString('en-GB') } : doc
    );
    setDocuments(updatedDocuments);
  };

  const handleVerifyDocument = (documentId, status, comment) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === documentId ? { 
        ...doc, 
        verification_status: status, 
        verification_comment: comment,
        last_updated: new Date().toLocaleDateString('en-GB')
      } : doc
    );
    setDocuments(updatedDocuments);
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
    
    switch(status) {
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
  const calculateCompletionPercentage = () => {
    if (documents.length === 0) return 0;
    const approvedCount = documents.filter(doc => doc.verification_status === 'approved').length;
    return Math.round((approvedCount / documents.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();
  
  return (
    <div className="min-h-screen p-4 bg-white m-1 md:m-8 rounded-md">
      <h2 className="text-2xl font-semibold text-[#29346B] text-center mb-4">HOTO Module (Handover and Takeover)</h2>
      <h3 className="text-lg font-semibold text-[#29346B] mb-4 text-center">
        {projectId ? `Project ID: ${projectId}` : 'No Project Selected'}
      </h3>
      
      {/* Progress Status Card */}
      <div className="bg-gray-50 border rounded-md p-4 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-[#29346B]">HOTO Process Status</h4>
            <p className="text-gray-600">
              {completionPercentage < 100 ? 
                `${completionPercentage}% of documents approved - Handover in progress` : 
                'All documents approved - Handover complete'}
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className="w-full sm:w-64 bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-600 h-4 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          {completionPercentage === 100 && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
                sm: { mt: 0 },
                bgcolor: "#10B981",
                "&:hover": { bgcolor: "#059669" }
              }}
            >
              Generate HOTO Certificate
            </Button>
          )}
        </div>
      </div>
      
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
        ) : documents && filteredItems.length ? (
          <div className="overflow-x-auto">
            <table id="hoto-documents-table" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Document Name</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Category</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Date Submitted</th>
                  <th className="py-2 px-3 text-[#29346B] border text-left">Submitted By</th>
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
                    <td className="py-2 px-3 border">{item.date_submitted}</td>
                    <td className="py-2 px-3 border">{item.submitted_by}</td>
                    <td className="py-2 px-3 border">
                      <StatusBadge status={item.verification_status} />
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
    </div>
  );
}

export default HotoDocuments;