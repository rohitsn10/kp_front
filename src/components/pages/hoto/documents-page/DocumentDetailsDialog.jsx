import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { useParams } from 'react-router-dom';
import { useDeleteDocumentMutation } from '../../../../api/hoto/hotoApi';

// Component for document details view
const DocumentDetailsDialog = ({ open, handleClose, documentData, onDeleteSuccess }) => {
  const { projectId } = useParams();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  if (!documentData) return null;
  
  let fileBackEndPath = import.meta.env.VITE_API_KEY;

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Function to get file icon based on file extension
  const getFileIcon = (filePath) => {
    if (!filePath) return <InsertDriveFileIcon />;
    
    const extension = filePath.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon color="primary" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <ImageIcon color="success" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <ArticleIcon color="warning" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FolderZipIcon color="secondary" />;
      default:
        return <InsertDriveFileIcon color="action" />;
    }
  };

  // Function to extract file name from file path
  const getFileName = (filePath) => {
    if (!filePath) return 'Unknown File';
    return filePath.split('/').pop();
  };

  // Function to handle individual file download
  const handleDownloadFile = (filePath) => {
    const baseUrl = fileBackEndPath || 'http://localhost:8000';
    const downloadUrl = `${filePath}`;    
    window.open(downloadUrl, '_blank');
  };

  // Function to handle delete individual file
  const handleDeleteFile = async (fileId) => {
    if (!fileId) {
      setSnackbar({ 
        open: true, 
        message: 'Invalid file ID', 
        severity: 'error' 
      });
      return;
    }

    try {
      const result = await deleteDocument({
        projectId: parseInt(projectId),
        documentIds: [fileId]
      }).unwrap();

      setSnackbar({ 
        open: true, 
        message: result.message || 'File deleted successfully', 
        severity: 'success' 
      });

      // Call the callback to refresh the parent component
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Close the dialog after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Error deleting file:', error);
      setSnackbar({ 
        open: true, 
        message: error?.data?.message || 'Failed to delete file', 
        severity: 'error' 
      });
    }
  };

  // Function to handle delete multiple selected files
  const handleDeleteSelectedFiles = async () => {
    if (selectedFileIds.length === 0) {
      setSnackbar({ 
        open: true, 
        message: 'No files selected', 
        severity: 'warning' 
      });
      return;
    }

    try {
      const result = await deleteDocument({
        projectId: parseInt(projectId),
        documentIds: selectedFileIds
      }).unwrap();

      setSnackbar({ 
        open: true, 
        message: result.message || `${selectedFileIds.length} file(s) deleted successfully`, 
        severity: 'success' 
      });

      // Reset selected files
      setSelectedFileIds([]);

      // Call the callback to refresh the parent component
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Close the dialog after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Error deleting files:', error);
      setSnackbar({ 
        open: true, 
        message: error?.data?.message || 'Failed to delete files', 
        severity: 'error' 
      });
    }
  };

  // Function to toggle file selection
  const toggleFileSelection = (fileId) => {
    setSelectedFileIds(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  // Function to handle download all files
  const handleDownloadAllFiles = () => {
    if (!documentData.files || documentData.files.length === 0) {
      return;
    }
    
    documentData.files.forEach(file => {
      handleDownloadFile(file.file_url);
    });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    if (!status) return { color: 'default', textColor: 'text.primary' };
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return { color: 'success', textColor: 'success.main' };
      case 'rejected':
        return { color: 'error', textColor: 'error.main' };
      case 'needs revision':
      case 'needs_revision':
        return { color: 'warning', textColor: 'warning.main' };
      case 'pending':
      default:
        return { color: 'warning', textColor: 'warning.dark' };
    }
  };

  const statusStyles = getStatusColor(documentData.status);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '8px' }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#29346B', 
          color: 'white',
          py: 2
        }}>
          <Typography variant="h6">
            Document Details: {documentData.document_name}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Document Information Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Document Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Document ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {documentData.id}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Category
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {documentData.category || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Status
                      </Typography>
                      <Box>
                        <Chip 
                          size="small" 
                          label={documentData.status || 'Pending'} 
                          color={statusStyles.color}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Created By
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {documentData.created_by_name || `User ID: ${documentData.created_by}` || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Created At
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(documentData.created_at)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Last Updated
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(documentData.updated_at)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Remarks and Verification Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Remarks & Verification
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Remarks
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        backgroundColor: 'white', 
                        p: 1.5, 
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0'
                      }}>
                        {documentData.remarks || "No remarks added yet."}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Verification Comments
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        backgroundColor: 'white', 
                        p: 1.5, 
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0'
                      }}>
                        {documentData.verify_comment || "No verification comments yet."}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Uploaded Files Section */}
            {documentData.files && documentData.files.length > 0 && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Uploaded Files ({documentData.files.length})
                    </Typography>
                    {selectedFileIds.length > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
                        onClick={handleDeleteSelectedFiles}
                        disabled={isDeleting}
                      >
                        Delete Selected ({selectedFileIds.length})
                      </Button>
                    )}
                  </Box>
                  
                  <List sx={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '4px'
                  }}>
                    {documentData.files.map((file, index) => (
                      <React.Fragment key={file.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem
                          sx={{
                            backgroundColor: selectedFileIds.includes(file.id) 
                              ? 'rgba(41, 52, 107, 0.08)' 
                              : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(41, 52, 107, 0.04)'
                            }
                          }}
                        >
                          <ListItemIcon
                            onClick={() => toggleFileSelection(file.id)}
                            sx={{ cursor: 'pointer', minWidth: '40px' }}
                          >
                            {getFileIcon(file.file_url)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={getFileName(file.file_url)}
                            secondary={`Uploaded: ${formatDate(file.created_at)}`}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontWeight: 500,
                                color: '#29346B'
                              }
                            }}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Download File">
                              <IconButton 
                                edge="end" 
                                onClick={() => handleDownloadFile(file.file_url)}
                                sx={{ color: '#29346B', mr: 1 }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete File">
                              <IconButton 
                                edge="end" 
                                onClick={() => handleDeleteFile(file.id)}
                                sx={{ color: '#d32f2f' }}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            sx={{ 
              color: "#29346B",
              borderColor: "#29346B",
              '&:hover': {
                borderColor: "#1e2756",
                backgroundColor: 'rgba(41, 52, 107, 0.04)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentDetailsDialog;
