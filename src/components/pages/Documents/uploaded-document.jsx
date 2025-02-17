import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom'; // Import useLocation
import ViewFileModal from './ViewFileModal';
import { useDeleteUploadedDocumentMutation, useGetDocumentsQuery } from '../../../api/users/documentApi';

function UploadedDocumentListing() {
  const [documentFilter, setDocumentFilter] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Get the data passed via location
  const location = useLocation();
  const data = location.state?.documentData; // Single document
  console.log("State dataa:",data)
  if (!data) {
    return <div>Error: No data available.</div>;
  }

  // Extract file name from URL
  const fileName = data.document_management_attachments?.[0]?.url?.split('/').pop() || "No file";

  // Using the delete mutation hook
  const [deleteUploadedDocument] = useDeleteUploadedDocumentMutation();


  // Handle delete click
  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setOpenDeleteDialog(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    console.log()
    setOpenDeleteDialog(false);
    // Use the delete mutation to delete the document
    deleteUploadedDocument({ documentId: documentToDelete.id });
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  // Handle View button click for each attachment
  const handleViewUploadedDocuments = (material) => {
    setSelectedFile(material);
    setOpenFileModal(true); // Open the modal
  };


  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex items-center">
          <TextField
            value={documentFilter}
            placeholder="Search"
            onChange={(e) => setDocumentFilter(e.target.value)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
          />
        </div>

        <div className="flex-grow flex justify-center">
          <h2 className="text-2xl text-[#29346B] font-semibold">
            {data.document_name || "Document Listing"} {/* Dynamically show document_name */}
          </h2>
        </div>
      </div>

      <TableContainer style={{ borderRadius: "8px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center" style={{ fontWeight: "normal", color: "#5C5E67", fontSize: "16px" }}>
                Sr No.
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "normal", color: "#5C5E67", fontSize: "16px" }}>
                File Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "normal", color: "#5C5E67", fontSize: "16px" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.document_management_attachments.map((attachment, idx) => (
              <TableRow key={attachment.id}>
                <TableCell align="center" style={{ fontSize: "16px" }}>
                  {idx + 1} {/* Sr No. dynamically based on index */}
                </TableCell>
                <TableCell align="center" style={{ fontSize: "16px", color: "#1D2652", cursor: "pointer" }}>
                  {attachment.url.split('/').pop()} {/* Display the file name */}
                </TableCell>
                <TableCell align="center">
                  <div className="flex flex-row gap-2 justify-center">
                    <Button
                      variant="contained"
                      color='primary'
                      onClick={() => handleViewUploadedDocuments(attachment)} 
                    >
                      View
                    </Button>
                    {/* <RiDeleteBin6Line
                      style={{
                        cursor: "pointer",
                        color: "#D32F2F",
                        fontSize: "23px",
                        textAlign: "center",
                        marginTop:"5px"
                      }}
                      title="Delete"
                      onClick={() => handleDeleteClick(attachment)} // Pass the current document to delete
                    /> */}
                    <Button
      variant="contained"
      color="error"
      // startIcon={<RiDeleteBin6Line />}
      onClick={() => handleDeleteClick(attachment)}
    >
      Delete
    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the document "{documentToDelete?.url.split('/').pop()}"?
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

      {/* View File Modal */}
      <ViewFileModal
        open={openFileModal}
        handleClose={() => setOpenFileModal(false)}
        material={selectedFile}
      />
    </div>
  );
}

export default UploadedDocumentListing;
