import React, { useState, useEffect, useMemo } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VerifiedIcon from "@mui/icons-material/Verified";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from 'react-router-dom';
import DocumentDetailsDialog from '../../components/pages/hoto/documents-page/DocumentDetailsDialog';
import RemarksDialog from '../../components/pages/hoto/documents-page/RemarksDialog';
import FileUploadModal from '../../components/pages/hoto/documents-page/FileUploadModal';
import VerifyDocumentDialog from '../../components/pages/hoto/documents-page/VerifyDocumentDialog';
import { useFetchallHotoDocumentsQuery, useGetDocumentsByProjectIdQuery } from '../../api/hoto/hotoApi';
import AddDocumentModal from '../../components/pages/hoto/documents-page/AddDocumentModal';
import CertificateGenerationForm from '../../components/pages/hoto/hoto-certificate/CertificateGenerationForm';


function HotoDocuments() {
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();
  
  // State for dialogs
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false);
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false);
  const [openCertificateForm, setOpenCertificateForm] = useState(false);
  
  // Fetch documents using the new API
  const { 
    data: HotoListData, 
    isLoading: HotoListLoading, 
    isError: HotoListErr, 
    error: HotoListError,
    refetch
  } = useFetchallHotoDocumentsQuery({projectId});

  console.log(HotoListData);
  
  // Extract categories from the response
  const categories = HotoListData?.data || [];

  // Flatten documents with category information for filtering
  const allDocuments = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    return categories.flatMap(category => 
      category.documents.map(doc => ({
        ...doc,
        categoryId: category.id,
        categoryName: category.name, // ✅ Fixed: Changed from category.category
        created_at: doc.created_at || new Date().toISOString(),
        created_by_name: doc.created_by_name || 'N/A',
        status: doc.status || 'pending',
        punch_point_balance: doc.punch_point_balance || 0,
        remarks: doc.remarks || '',
      }))
    );
  }, [categories]);

  // Filter and sort documents
  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    let filteredCats = [...categories];

    // Apply category filter
    if (categoryFilter !== "all") {
      filteredCats = filteredCats.filter(cat => cat.id === parseInt(categoryFilter));
    }

    // Apply search and sorting to documents within each category
    filteredCats = filteredCats.map(category => {
      let docs = [...category.documents];

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        docs = docs.filter(doc =>
          (doc.name && doc.name.toLowerCase().includes(searchLower)) ||
          (category.name && category.name.toLowerCase().includes(searchLower)) // ✅ Fixed: Changed from category.category
        );
      }

      // Apply sort option
      if (sortOption === "name") {
        docs.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === "id") {
        docs.sort((a, b) => a.id - b.id);
      }

      return {
        ...category,
        documents: docs
      };
    }).filter(cat => cat.documents.length > 0); // Remove empty categories

    return filteredCats;
  }, [searchTerm, sortOption, categoryFilter, categories]);

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

  const handleOpenCertificateForm = () => {
    setOpenCertificateForm(true);
  };
  
  const handleCertificateSuccess = () => {
    // Additional handling if needed
  };
  
  const handleCloseCertificateForm = () => {
    setOpenCertificateForm(false);
  };
  
  const handleOpenPunchPoints = (item) => {
    window.location.href = `/hoto-page/punchpoints/${projectId}/${item.id}`;
  }
  
  const handleDocumentUploadSuccess = () => {
    refetch();
  };

  const handleSaveRemarks = (documentId, remarks) => {
    refetch();
  };

  const handleVerifyDocument = (documentId, status, comment) => {
    refetch();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setCategoryFilter("all");
  };

  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
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
                placeholder="Search by document name or category"
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
                <MenuItem value="name">Document Name</MenuItem>
                <MenuItem value="id">Document ID</MenuItem>
              </Select>
            </FormControl>
            
            {/* Category Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id.toString()}>
                    {cat.name} {/* ✅ Fixed: Changed from cat.category */}
                  </MenuItem>
                ))}
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
              onClick={handleOpenCertificateForm}
              sx={{
                bgcolor: "#3B82F6",
                "&:hover": { bgcolor: "#2563EB" }
              }}
            >
              Generate Certificate
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

        {HotoListLoading ? (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        ) : HotoListErr ? (
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">Error loading documents: {HotoListError?.message || 'Unknown error'}</p>
            <Button 
              variant="contained" 
              onClick={refetch}
              sx={{ mt: 2, bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }}
            >
              Retry
            </Button>
          </div>
        ) : categories && filteredCategories.length ? (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <Accordion key={category.id} defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: "#f3f4f6",
                    "&:hover": { bgcolor: "#e5e7eb" }
                  }}
                >
                  <Typography variant="h6" className="text-[#29346B] font-semibold">
                    {category.name} ({category.documents.length} documents) {/* ✅ Fixed: Changed from category.category */}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-3 text-[#29346B] border text-left">Sr</th>
                          <th className="py-2 px-3 text-[#29346B] border text-left">Document ID</th>
                          <th className="py-2 px-3 text-[#29346B] border text-left">Document Name</th>
                          <th className="py-2 px-3 text-[#29346B] border text-left">Status</th>
                          <th className="py-2 px-3 text-[#29346B] border text-left">Remarks</th>
                          <th className="py-2 px-3 text-[#29346B] border text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.documents.map((doc, index) => {
                          const fullDoc = {
                            ...doc,
                            categoryId: category.id,
                            categoryName: category.name, // ✅ Fixed: Changed from category.category
                            created_at: doc.created_at || new Date().toISOString(),
                            created_by_name: doc.created_by_name || 'N/A',
                            status: doc.status || 'pending',
                            remarks: doc.remarks || '',
                          };
                          
                          return (
                            <tr key={doc.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="py-2 px-3 border">{index + 1}</td>
                              <td className="py-2 px-3 border">{doc.id}</td>
                              <td className="py-2 px-3 border">{doc.name}</td>
                              <td className="py-2 px-3 border">
                                {doc.is_verified ? "Verified" : "Pending Verification"}
                              </td>
                              <td className="py-2 px-3 border">
                                <div className="max-w-xs truncate">
                                  {fullDoc.remarks || "No remarks"}
                                </div>
                              </td>
                              <td className="py-2 px-3 border">
                                <div className="flex flex-wrap gap-2">
                                  <Tooltip title="View Details">
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() => handleOpenDetailsDialog(fullDoc)}
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
                                      onClick={() => handleFileUpload(fullDoc)}
                                      startIcon={<UploadFileIcon />}
                                      sx={{
                                        bgcolor: "#EC4899",
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
                                      onClick={() => handleOpenRemarksDialog(fullDoc)}
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
                                      onClick={() => handleOpenVerifyDialog(fullDoc)}
                                      startIcon={<VerifiedIcon />}
                                      sx={{
                                        bgcolor: "#10B981",
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
                                      onClick={() => handleOpenPunchPoints(fullDoc)}
                                      startIcon={<VerifiedIcon />}
                                      sx={{
                                        bgcolor: "#10B981",
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
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        ) : (
          <p className="text-center p-4 bg-gray-50 border rounded">
            {searchTerm || sortOption !== "all" || categoryFilter !== "all" ?
              "No matching documents found. Try adjusting your filters." :
              "No documents available."}
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
        onDeleteSuccess={()=>{console.log("")}}
      />
      <AddDocumentModal 
        open={openAddDocumentModal}
        handleClose={handleCloseAddDocumentModal}
        projectId={projectId}
        onSuccess={handleDocumentUploadSuccess}
      />
      <CertificateGenerationForm
        open={openCertificateForm}
        handleClose={handleCloseCertificateForm}
        projectId={projectId}
        onSuccess={handleCertificateSuccess}
      />
    </div>
  );
}

export default HotoDocuments;