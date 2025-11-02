import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from "@mui/material";
import { toast } from "react-toastify";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUploadDocumentMutation } from '../../../../api/hoto/hotoApi';
import { useParams } from 'react-router-dom';

// Component for file upload modal
const FileUploadModal = ({ open, handleClose, documentData }) => {
  const { projectId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  console.log("Project ID:", projectId);
  console.log("Document Data:", documentData);
  
  // Use the RTK Query mutation hook
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  
  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Check file size (10MB limit per file)
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      toast.error("Some files exceed the 10MB size limit and were removed.");
    }
    
    setSelectedFiles(validFiles);
    setUploadError(null); // Clear any previous errors
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
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast.warn("Please select at least one file to upload");
      return;
    }
    
    // Validate required data
    if (!documentData?.id) {
      toast.error("Missing document ID");
      return;
    }
    
    if (!documentData?.categoryId) {
      toast.error("Missing category ID");
      return;
    }
    
    if (!projectId) {
      toast.error("Missing project ID");
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      
      // Append each file to the formData
      selectedFiles.forEach(file => {
        formData.append('file', file);
      });
      
      // Call the mutation with all required parameters
      const response = await uploadDocument({
        projectId: projectId,
        categoryId: documentData.categoryId,
        documentId: documentData.id,
        formData: formData
      }).unwrap();
      
      if (response && response.status) {
        toast.success("Files uploaded successfully");
        setSelectedFiles([]);
        handleClose(); // Close the modal after successful upload
      } else {
        toast.error(response?.message || "Upload failed");
        setUploadError(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.data?.message || "Failed to upload files. Please try again.";
      toast.error(errorMessage);
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6">
          Upload Files for {documentData?.name || documentData?.document_name}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}
        
        {/* Document Info Display */}
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: '4px' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Project ID:</strong> {projectId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Category:</strong> {documentData?.categoryName || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Document ID:</strong> {documentData?.id}
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            border: '2px dashed #29346B', 
            margin:'20px',
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
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: '#29346B', mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Drag & Drop files here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported file types: PDF, JPEG, PNG, DWG, XLS, DOCX (Max 10MB per file)
          </Typography>
        </Box>
        
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Selected Files ({selectedFiles.length})
            </Typography>
            <List dense sx={{ bgcolor: '#f5f5f5', borderRadius: '4px' }}>
              {selectedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleRemoveFile(index)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ 
                    borderBottom: index !== selectedFiles.length - 1 ? '1px solid #e0e0e0' : 'none',
                    py: 1
                  }}
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={file.name} 
                    secondary={formatFileSize(file.size)} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: "#29346B",
            '&:hover': {
              bgcolor: 'rgba(41, 52, 107, 0.04)'
            }
          }}
          disabled={isLoading || isUploading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpload}
          variant="contained"
          disabled={selectedFiles.length === 0 || isLoading || isUploading}
          startIcon={isLoading || isUploading ? <CircularProgress size={20} /> : null}
          sx={{ 
            bgcolor: "#29346B", 
            color: "white", 
            "&:hover": { bgcolor: "#1e2756" } 
          }}
        >
          {isLoading || isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadModal;