import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { toast } from 'react-toastify';
import { useUploadMainDocumentMutation } from '../../../../api/hoto/hotoApi';

const AddDocumentModal = ({ open, handleClose, projectId, onSuccess }) => {
  // Form state
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  
  // Use the RTK Query mutation hook
  const [uploadMainDocument, { isLoading }] = useUploadMainDocumentMutation();
  
  // Reset form when modal opens/closes
  const resetForm = () => {
    setDocumentName('');
    setCategory('');
    setSelectedFiles([]);
    setError(null);
  };
  
  // Handle form close
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };
  
  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Check file size (10MB limit per file)
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      toast.error("Some files exceed the 10MB size limit and were removed.");
    }
    
    setSelectedFiles([...selectedFiles, ...validFiles]);
    setError(null); // Clear any previous errors
  };
  
  // Remove a file from the selection
  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get file icon based on file extension
  const getFileIcon = (file) => {
    if (!file) return <InsertDriveFileIcon />;
    
    const extension = file.name.split('.').pop().toLowerCase();
    
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
      default:
        return <InsertDriveFileIcon color="action" />;
    }
  };
  
  // Form validation
  const isFormValid = () => {
    if (!documentName.trim()) {
      setError('Document name is required');
      return false;
    }
    
    if (!category.trim()) {
      setError('Category is required');
      return false;
    }
    
    if (!projectId) {
      setError('Project ID is missing');
      return false;
    }
    
    if (selectedFiles.length === 0) {
      setError('At least one file must be uploaded');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!isFormValid()) {
      return;
    }
    
    try {
      setError(null);
      
      // Create FormData
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('document_name', documentName.trim());
      formData.append('category', category.trim());
      formData.append('status', 'Pending'); // Always set to Pending for new documents
      
      // Append each file to the FormData
      selectedFiles.forEach(file => {
        formData.append('file', file);
      });
      
      // Call the mutation
      const response = await uploadMainDocument(formData).unwrap();
      
      if (response && response.status) {
        toast.success('Document uploaded successfully');
        
        // Call the success callback to update the UI
        if (onSuccess) {
          onSuccess();
        }
        
        // Close the modal
        handleModalClose();
      } else {
        toast.error(response?.message || 'Failed to upload document');
        setError(response?.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.data?.message || 'Failed to upload document. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };
  
  // Category options
  const categoryOptions = [
    'Civil',
    'Electrical',
    'Mechanical',
    'Mech',
    'Documentation',
    'Performance Data',
    'Metering',
    'Module Data',
    'Regulatory',
    'Civil Documentation',
    'Layout Documentation',
    'Foundation Documentation',
    'Water System Documentation'
  ];
  
  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
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
          Upload New Document
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Document Information
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Document Name"
              variant="outlined"
              fullWidth
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter document name"
              error={!documentName.trim() && error}
              helperText={!documentName.trim() && error ? "Document name is required" : ""}
            />
            
            <FormControl fullWidth required disabled={isLoading} error={!category.trim() && error}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {!category.trim() && error && (
                <Typography variant="caption" color="error">
                  Category is required
                </Typography>
              )}
            </FormControl>
            
            <Typography variant="caption" sx={{ gridColumn: { xs: '1', md: '1 / span 2' }, color: 'text.secondary' }}>
              Project ID: {projectId} | Status will be set to "Pending"
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Upload Files
          </Typography>
          
          <Box
            sx={{
              border: '2px dashed #29346B',
              borderRadius: '8px',
              p: 3,
              mb: 2,
              textAlign: 'center',
              bgcolor: '#f8f9fa',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#ebedf0'
              }
            }}
            onClick={() => document.getElementById('file-upload-input').click()}
          >
            <input
              id="file-upload-input"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: '#29346B', mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Drag & Drop files here or click to browse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported file types: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB per file)
            </Typography>
          </Box>
          
          {selectedFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Selected Files ({selectedFiles.length})
              </Typography>
              <List sx={{
                bgcolor: '#f5f5f5',
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {selectedFiles.map((file, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemIcon>
                        {getFileIcon(file)}
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={formatFileSize(file.size)}
                        primaryTypographyProps={{
                          sx: { fontWeight: 500, color: '#29346B' }
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFile(index)}
                          disabled={isLoading}
                          sx={{ color: '#EF4444' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
              {selectedFiles.length === 0 && error && (
                <Typography variant="caption" color="error">
                  At least one file must be uploaded
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleModalClose}
          variant="outlined"
          disabled={isLoading}
          sx={{
            color: "#29346B",
            borderColor: "#29346B",
            '&:hover': {
              borderColor: "#1e2756",
              backgroundColor: 'rgba(41, 52, 107, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{
            bgcolor: "#FACC15",
            color: "#29346B",
            "&:hover": { bgcolor: "#e5b812" }
          }}
        >
          {isLoading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocumentModal;