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
import { RiDeleteBin6Line } from "react-icons/ri"; // Import the delete icon
import AddDocumentModal from "../../components/pages/Documents/add-documents";
import EditDocumentModal from "../../components/pages/Documents/edit-documents";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Assuming you have the hook useGetDocumentsQuery and useDeleteDocumentMutation imported
import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
} from "../../api/users/documentApi";

function DocumentListing() {
  // const [documentFilter, setDocumentFilter] = useState("");
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
  const [documentToDelete, setDocumentToDelete] = useState(null); // Store the document to be deleted

  const navigate = useNavigate();
  const { data, isLoading, isError,refetch } = useGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation(); // Hook for deleting a document
  // console.log()

  console.log("Edit Select:",selectedDocument)
  const rows = data?.data.map((item, index) => ({
    sr: index + 1,
    id: item.id,
    documentName: item.document_name,
    revisionNumber:item.revision_number,
    documentNumber: item.document_number,
    projectName: item.project_name,
    confidentialLevel: item.confidentiallevel,
    createdAt: new Date(item.created_at).toLocaleDateString(),
    createdByFullName: item.created_by_full_name,
    keywords: item.keywords,
    documentStatus:item.status
  }));
  console.log("Document Rows;::",rows)

  // const filteredRows = rows?.filter((row) =>
  //   row.documentName.toLowerCase().includes(documentFilter.toLowerCase())
  // );

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

  // Get unique values for dropdown filters
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
    console.log(documentToDelete);
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
    // Ensure data is loaded
    if (!data) {
      console.error("Documents data is not yet available.");
      return;
    }
  
    // Find the full document object by its id
    const fullDocument = data?.data.find((item) => item.id === rowId);
  
    if (fullDocument) {
      navigate(`/uploaded-documents`, {
        state: { documentData: fullDocument },  // Pass the full document data
      });
    } else {
      console.error("Document not found for ID:", rowId);
    }
  };
  
  
  
  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex-grow flex justify-center">
          <h2 className="text-3xl text-[#29346B] font-semibold">
            Document Listing
          </h2>
        </div>

        <div className="flex items-center">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#f6812d",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
            onClick={() => setOpen(true)}
          >
            Add Document
          </Button>
        </div>
      </div>
        <div className="flex gap-4 my-8 w-full justify-start">
          <div className="flex flex-col gap-2 justify-center items-start">
          <h2 className="text-[#29346B] font-semibold text-lg">Filter By Name</h2>
              <TextField
                value={filters.documentName}
                placeholder="Search Document Name"
                onChange={(e) => handleFilterChange("documentName", e.target.value)}
                variant="outlined"
                size="small"
                className="min-w-[200px]"
              />
          </div>
          <div className="flex flex-col gap-2 justify-center items-start">
            <h2 className="text-[#29346B] font-semibold text-lg">Filter By Keywords</h2>
          <TextField
            value={filters.keywords}
            placeholder="Search Keywords"
            onChange={(e) => handleFilterChange("keywords", e.target.value)}
            variant="outlined"
            size="small"
            className="min-w-[200px]"
          />
          </div>
          <div className="flex flex-col gap-2 justify-center items-start">
            <h2 className="text-[#29346B] font-semibold text-lg">Filter By Confidential Level</h2>
          <FormControl size="small" style={{width:'200px'}}>
            {/* <InputLabel>Confidential Level</InputLabel> */}
            <Select
              value={filters.confidentialLevel}
              // label="Confidential Level"
              onChange={(e) => handleFilterChange("confidentialLevel", e.target.value)}
              displayEmpty
            >
              <MenuItem  value="">All</MenuItem>
              {confidentialLevels?.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>
          <div className="flex flex-col gap-2 justify-center items-start">
            <h2 className="text-[#29346B] font-semibold text-lg">Filter By Status</h2>
            <FormControl size="small" style={{width:'200px'}}>
              {/* <InputLabel>Status</InputLabel> */}
              <Select
                value={filters.status}
                // label="Status"
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
      <TableContainer style={{ borderRadius: "8px", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Sr No.
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Document Name
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Revision Number
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Project Name
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Confidential Level
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Created At
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Created By
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Keywords
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "normal",
                  color: "#5C5E67",
                  fontSize: "16px",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows?.map((row) => (
              <TableRow key={row.sr}>
                <TableCell align="center" style={{ fontSize: "16px" }}>
                  {row.sr}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontSize: "16px",
                    color: "#1D2652",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewUploadedDocuments(row.id)} // Passing row data
                >
                  {row.documentName}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {row.revisionNumber}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {/* {row.documentStatus =="Archived"? <Chip variant="outlined" label="Archived" color="warning" />:<></>}
                  */}
                  {row.documentStatus === "Archived" && (
                    <Chip variant="outlined" label="Archived" color="warning" />
                  )}
                  {row.documentStatus === "Approved" && (
                    <Chip variant="outlined" label="Approved" color="success" />
                  )}
                  {row.documentStatus === "Draft" && (
                    <Chip variant="outlined" label="Draft" color="primary" />
                  )}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {row.projectName}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {row.confidentialLevel}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {row.createdAt}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {row.createdByFullName}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "16px", color: "#1D2652" }}
                >
                  {row.keywords}
                </TableCell>
                <TableCell align="center">
                  <div className="flex flex-row gap-2">
                  <VisibilityIcon
                                            style={{
                        cursor: "pointer",
                        color: "#0e7bf1",
                        fontSize: "25px",
                        textAlign: "center",
                      }}
                      title="Preview"
                      onClick={() => handleViewUploadedDocuments(row.id)}
                    />
                    <RiEditFill
                      style={{
                        cursor: "pointer",
                        color: "#61D435",
                        fontSize: "25px",
                        textAlign: "center",
                      }}
                      title="Edit"
                      onClick={() => handleEditClick(row.id)}
                    />

                    <RiDeleteBin6Line
                      style={{
                        cursor: "pointer",
                        color: "#D32F2F",
                        fontSize: "25px",
                        textAlign: "center",
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
          style={{
            borderTop: "1px solid #e0e0e0",
          }}
        />
      </TableContainer>

      <EditDocumentModal
        open={openEdit}
        onClose={handleEditModalClose}
        document={selectedDocument}
      />

      <AddDocumentModal open={open} onClose={handleModalClose} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the document"
          {documentToDelete?.document_name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DocumentListing;
