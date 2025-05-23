import React, { useState } from 'react';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { RiDeleteBin6Line } from 'react-icons/ri';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import ViewFileModal from './ViewFileModal';
import { useDeleteUploadedDocumentMutation, useGetDocumentsQuery } from '../../../api/users/documentApi';

function UploadedDocumentListing() {
  const [documentFilter, setDocumentFilter] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);
  
  // Get the data passed via location
  const location = useLocation();
  const data = location.state?.documentData;
  
  // Using the delete mutation hook
  const [deleteUploadedDocument] = useDeleteUploadedDocumentMutation();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <Typography variant="h6" color="error" gutterBottom>
              Error: No data available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please navigate from the document listing page.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter attachments based on search
  const filteredAttachments = data.document_management_attachments?.filter(attachment => {
    const fileName = attachment.url.split('/').pop().toLowerCase();
    return fileName.includes(documentFilter.toLowerCase());
  }) || [];

  // Handle delete click
  const handleDeleteClick = (attachment) => {
    setDocumentToDelete(attachment);
    setOpenDeleteDialog(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      deleteUploadedDocument({ documentId: documentToDelete.id })
        .then(() => {
          console.log('Document deleted successfully');
          setOpenDeleteDialog(false);
          setDocumentToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting document:', error);
        });
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setDocumentToDelete(null);
  };

  // Handle View button click
  const handleViewUploadedDocuments = (attachment) => {
    setSelectedFile(attachment);
    setOpenFileModal(true);
  };

  // Handle Download functionality
  const handleDownloadFile = async (attachment) => {
    try {
      setDownloadingFile(attachment.id);
      
      // Fetch the file
      const response = await fetch(attachment.url);
      if (!response.ok) throw new Error('Download failed');
      
      // Get the file as blob
      const blob = await response.blob();
      
      // Extract filename from URL
      const fileName = attachment.url.split('/').pop();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingFile(null);
    }
  };

  // Get file extension for display
  const getFileExtension = (url) => {
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  // Format file size (if available in future)
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#29346B] to-[#3a4578]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* Search Section */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm min-w-0 lg:max-w-sm">
                <SearchIcon className="text-gray-400 flex-shrink-0" />
                <TextField
                  value={documentFilter}
                  placeholder="Search files..."
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  variant="standard"
                  size="small"
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{ 
                    '& .MuiInput-input': { 
                      padding: '4px 8px',
                      fontSize: '14px'
                    }
                  }}
                />
              </div>

              {/* Title Section */}
              <div className="text-center lg:flex-1">
                <Typography 
                  variant="h4" 
                  component="h1" 
                  className="text-white font-semibold text-xl sm:text-2xl lg:text-3xl"
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem', lg: '1.875rem' },
                    textAlign: { xs: 'center', lg: 'center' }
                  }}
                >
                  {data.document_name || "Document Files"}
                </Typography>
                <Typography variant="body2" className="text-blue-100 mt-1">
                  {filteredAttachments.length} file{filteredAttachments.length !== 1 ? 's' : ''} available
                </Typography>
              </div>

              {/* Document Info (Hidden on mobile) */}
              <div className="hidden lg:block bg-white/10 rounded-lg p-3 min-w-0 lg:max-w-sm">
                <Typography variant="body2" className="text-blue-100">
                  Document ID: {data.document_number}
                </Typography>
                <Typography variant="body2" className="text-blue-100">
                  Status: {data.status}
                </Typography>
              </div>
            </div>
          </div>

          {/* Document Info Card (Visible on mobile) */}
          <div className="block lg:hidden px-4 sm:px-6 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Document ID:</span>
                <p className="text-gray-900">{data.document_number}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="text-gray-900">{data.status}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Project:</span>
                <p className="text-gray-900">{data.project_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Level:</span>
                <p className="text-gray-900">{data.confidentiallevel}</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          {filteredAttachments.length > 0 ? (
            <div className="overflow-x-auto">
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                      <TableCell 
                        align="center" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#374151", 
                          fontSize: { xs: "14px", sm: "16px" },
                          py: 2
                        }}
                      >
                        #
                      </TableCell>
                      <TableCell 
                        align="left" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#374151", 
                          fontSize: { xs: "14px", sm: "16px" },
                          py: 2
                        }}
                      >
                        File Name
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#374151", 
                          fontSize: { xs: "14px", sm: "16px" },
                          py: 2
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#374151", 
                          fontSize: { xs: "14px", sm: "16px" },
                          py: 2
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredAttachments.map((attachment, idx) => (
                      <TableRow 
                        key={attachment.id} 
                        hover
                        sx={{ 
                          '&:hover': { backgroundColor: '#F9FAFB' },
                          borderBottom: '1px solid #E5E7EB'
                        }}
                      >
                        <TableCell 
                          align="center" 
                          sx={{ 
                            fontSize: { xs: "14px", sm: "16px" },
                            py: 2
                          }}
                        >
                          {idx + 1}
                        </TableCell>
                        
                        <TableCell 
                          align="left" 
                          sx={{ 
                            fontSize: { xs: "14px", sm: "16px" }, 
                            color: "#1F2937",
                            py: 2
                          }}
                        >
                          <Box className="flex items-center gap-2">
                            <Box className="flex-1 min-w-0">
                              <Typography 
                                variant="body2" 
                                className="font-medium truncate"
                                title={attachment.url.split('/').pop()}
                              >
                                {attachment.url.split('/').pop()}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Uploaded: {new Date(attachment.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell 
                          align="center" 
                          sx={{ 
                            fontSize: { xs: "14px", sm: "16px" },
                            py: 2
                          }}
                        >
                          <Box className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getFileExtension(attachment.url)}
                          </Box>
                        </TableCell>

                        <TableCell align="center" sx={{ py: 2 }}>
                          <Box className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                            
                            {/* View Button */}
                            <Tooltip title="View File">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewUploadedDocuments(attachment)}
                                sx={{ 
                                  backgroundColor: '#EBF8FF',
                                  '&:hover': { backgroundColor: '#BEE3F8' }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Download Button */}
                            <Tooltip title="Download File">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleDownloadFile(attachment)}
                                disabled={downloadingFile === attachment.id}
                                sx={{ 
                                  backgroundColor: '#F0FDF4',
                                  '&:hover': { backgroundColor: '#DCFCE7' }
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Delete Button (commented out) */}
                            {/* <Tooltip title="Delete File">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(attachment)}
                                sx={{ 
                                  backgroundColor: '#FEF2F2',
                                  '&:hover': { backgroundColor: '#FECACA' }
                                }}
                              >
                                <RiDeleteBin6Line size={16} />
                              </IconButton>
                            </Tooltip> */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="text-center py-12">
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No files found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {documentFilter ? 'Try adjusting your search criteria.' : 'No files have been uploaded for this document.'}
              </Typography>
            </div>
          )}
        </div>
      </div>

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
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the file "
            <strong>{documentToDelete?.url.split('/').pop()}</strong>"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
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