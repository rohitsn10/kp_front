import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { RiEditFill } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddDocumentModal from "../../components/pages/Documents/add-documents";
import EditDocumentModal from "../../components/pages/Documents/edit-documents";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
} from "../../api/users/documentApi";

function DocumentListing() {
  const [filters, setFilters] = useState({
    documentName: "",
    confidentialLevel: "",
    status: "",
    keywords: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();

  console.log("Edit Select:", selectedDocument);
  
  const rows = data?.data.map((item, index) => ({
    sr: index + 1,
    id: item.id,
    documentName: item.document_name,
    revisionNumber: item.revision_number,
    documentNumber: item.document_number,
    projectName: item.project_name,
    confidentialLevel: item.confidentiallevel,
    createdAt: new Date(item.created_at).toLocaleDateString(),
    createdByFullName: item.created_by_full_name,
    keywords: item.keywords,
    documentStatus: item.status
  }));

  const filteredRows = rows?.filter((row) => {
    const matchesName = row.documentName
      .toLowerCase()
      .includes(filters.documentName.toLowerCase());
    const matchesConfidential = filters.confidentialLevel === "" || 
      row.confidentialLevel === filters.confidentialLevel;
    const matchesStatus = filters.status === "" || 
      row.documentStatus === filters.status;
    const matchesKeywords = filters.keywords === "" || 
      row.keywords.toLowerCase().includes(filters.keywords.toLowerCase());
    
    return matchesName && matchesConfidential && matchesStatus && matchesKeywords;
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const confidentialLevels = [...new Set(rows?.map(row => row.confidentialLevel) || [])];
  const statuses = [...new Set(rows?.map(row => row.documentStatus) || [])];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = filteredRows?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleEditModalClose = () => {
    setOpenEdit(false);
  };

  const handleEditClick = (rowId) => {
    const fullDocument = data?.data.find((item) => item.id === rowId);
    if (fullDocument) {
      setSelectedDocument(fullDocument);
      setOpenEdit(true);
    }
  };

  const handleDeleteClick = (rowId) => {
    const documentToDelete = data?.data.find((item) => item.id === rowId);
    setDocumentToDelete(documentToDelete);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      deleteDocument({ documentId: documentToDelete.id })
        .unwrap()
        .then(() => {
          setOpenDeleteDialog(false);
          toast.success("Document deleted successfully!");
          refetch();
        })
        .catch((error) => {
          console.error("Error deleting document:", error);
          toast.error("Failed to delete document. Please try again.");
        });
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleViewUploadedDocuments = (rowId) => {
    if (!data) {
      console.error("Documents data is not yet available.");
      return;
    }
  
    const fullDocument = data?.data.find((item) => item.id === rowId);
  
    if (fullDocument) {
      navigate(`/uploaded-documents`, {
        state: { documentData: fullDocument },
      });
    } else {
      console.error("Document not found for ID:", rowId);
    }
  };
  
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section - Fully Responsive */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl text-[#29346B] font-semibold">
                  Document Listing
                </h2>
              </div>
              
              <div className="flex justify-center sm:justify-end">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#f6812d",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    textTransform: "none",
                    padding: "10px 20px"
                  }}
                  onClick={() => setOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Add Document
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section - Responsive Grid */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              
              {/* Document Name Filter */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[#29346B] font-semibold text-sm sm:text-base">
                  Filter By Name
                </h3>
                <TextField
                  value={filters.documentName}
                  placeholder="Search Document Name"
                  onChange={(e) => handleFilterChange("documentName", e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>

              {/* Keywords Filter */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[#29346B] font-semibold text-sm sm:text-base">
                  Filter By Keywords
                </h3>
                <TextField
                  value={filters.keywords}
                  placeholder="Search Keywords"
                  onChange={(e) => handleFilterChange("keywords", e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>

              {/* Confidential Level Filter */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[#29346B] font-semibold text-sm sm:text-base">
                  Filter By Confidential Level
                </h3>
                <FormControl size="small" fullWidth>
                  <Select
                    value={filters.confidentialLevel}
                    onChange={(e) => handleFilterChange("confidentialLevel", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All</MenuItem>
                    {confidentialLevels?.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[#29346B] font-semibold text-sm sm:text-base">
                  Filter By Status
                </h3>
                <FormControl size="small" fullWidth>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All</MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Table Section - Fully Responsive */}
          <div className="overflow-x-auto">
            <TableContainer>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#F2EDED" }}>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 80 }}>
                      Sr No.
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 200 }}>
                      Document Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 120 }}>
                      Revision Number
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 120 }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 150 }}>
                      Project Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 150 }}>
                      Confidential Level
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 120 }}>
                      Created At
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 150 }}>
                      Created By
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 120 }}>
                      Keywords
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", color: "#5C5E67", fontSize: { xs: "14px", sm: "16px" }, minWidth: 120 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentRows?.map((row) => (
                    <TableRow key={row.sr} hover>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                        {row.sr}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: { xs: "14px", sm: "16px" },
                          color: "#1D2652",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" }
                        }}
                        onClick={() => handleViewUploadedDocuments(row.id)}
                      >
                        <div className="max-w-[200px] truncate" title={row.documentName}>
                          {row.documentName}
                        </div>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        {row.revisionNumber}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        {row.documentStatus === "Archived" && (
                          <Chip variant="outlined" label="Archived" color="warning" size="small" />
                        )}
                        {row.documentStatus === "Approved" && (
                          <Chip variant="outlined" label="Approved" color="success" size="small" />
                        )}
                        {row.documentStatus === "Draft" && (
                          <Chip variant="outlined" label="Draft" color="primary" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        <div className="max-w-[150px] truncate" title={row.projectName}>
                          {row.projectName}
                        </div>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        {row.confidentialLevel}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        {row.createdAt}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        <div className="max-w-[150px] truncate" title={row.createdByFullName}>
                          {row.createdByFullName}
                        </div>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#1D2652" }}>
                        <div className="max-w-[120px] truncate" title={row.keywords}>
                          {row.keywords}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex flex-row gap-1 sm:gap-2 justify-center">
                          <VisibilityIcon
                            sx={{
                              cursor: "pointer",
                              color: "#0e7bf1",
                              fontSize: { xs: "20px", sm: "25px" },
                              "&:hover": { opacity: 0.7 }
                            }}
                            title="Preview"
                            onClick={() => handleViewUploadedDocuments(row.id)}
                          />
                          <RiEditFill
                            style={{
                              cursor: "pointer",
                              color: "#61D435",
                              fontSize: window.innerWidth < 640 ? "20px" : "25px",
                            }}
                            title="Edit"
                            onClick={() => handleEditClick(row.id)}
                          />
                          <RiDeleteBin6Line
                            style={{
                              cursor: "pointer",
                              color: "#D32F2F",
                              fontSize: window.innerWidth < 640 ? "20px" : "25px",
                            }}
                            title="Delete"
                            onClick={() => handleDeleteClick(row.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredRows?.length || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  "& .MuiTablePagination-toolbar": {
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 }
                  }
                }}
              />
            </TableContainer>
          </div>
        </div>
      </div>

      <EditDocumentModal
        open={openEdit}
        onClose={handleEditModalClose}
        document={selectedDocument}
      />

      <AddDocumentModal open={open} onClose={handleModalClose} />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { margin: { xs: 2, sm: 3 } }
        }}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the document "
          {documentToDelete?.document_name}"?
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DocumentListing;