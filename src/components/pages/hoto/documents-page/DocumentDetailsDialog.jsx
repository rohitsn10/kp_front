import React from 'react';
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
  Grid
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';

// Component for document details view
const DocumentDetailsDialog = ({ open, handleClose, documentData }) => {
  if (!documentData) return null;
  let fileBackEndPath = import.meta.env.VITE_API_KEY
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
    // This is a simplified example that assumes the file paths are directly accessible
    const baseUrl = fileBackEndPath || 'http://localhost:8000';
    const downloadUrl = `${baseUrl}${filePath}`;
    
    window.open(downloadUrl, '_blank');
  };

  // Function to handle download all files
  const handleDownloadAllFiles = () => {
    if (!documentData.document || documentData.document.length === 0) {
      return;
    }
    
    // In a real application, you might want to create a backend endpoint 
    // that zips all files and returns a single download link
    // For now, we'll just open all files in new tabs
    documentData.document.forEach(doc => {
      handleDownloadFile(doc.file);
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

  return (
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
          {documentData.document && documentData.document.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <Box mb={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Uploaded Files ({documentData.document.length})
                  </Typography>
                </Box>
                
                <List sx={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '4px'
                }}>
                  {documentData.document.map((file, index) => (
                    <React.Fragment key={file.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem>
                        <ListItemIcon>
                          {getFileIcon(file.file)}
                        </ListItemIcon>
                        <ListItemText 
                          primary={getFileName(file.file)}
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
                              onClick={() => handleDownloadFile(file.file)}
                              sx={{ color: '#29346B' }}
                            >
                              <DownloadIcon />
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
  );
};

export default DocumentDetailsDialog;