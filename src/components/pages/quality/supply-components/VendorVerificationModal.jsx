// src/components/pages/quality/VendorVerificationModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const VendorVerificationModal = ({ open, handleClose, itemDetails }) => {
  const [vendorName, setVendorName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset state when modal is closed or opened with a new item
  React.useEffect(() => {
    if (open) {
      // Pre-fill vendor name if available in itemDetails
      setVendorName(itemDetails?.vendor_name || "");
      setFiles([]);
      setError("");
      setSuccess(false);
    }
  }, [open, itemDetails]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleVerify = () => {
    // Validation
    if (!vendorName.trim()) {
      setError("Vendor name is required");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one file");
      return;
    }

    setError("");
    setUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    }, 1000);

    // In a real implementation, you would create FormData and send it to your API
    // const formData = new FormData();
    // formData.append('vendorName', vendorName);
    // files.forEach(file => formData.append('files', file));
    // await yourApiCall(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#29346B', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Box display="flex" alignItems="center">
          <VerifiedUserIcon sx={{ mr: 1 }} />
          Vendor Verification
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Vendor verification files uploaded successfully!
          </Alert>
        )}

        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Item Details
        </Typography>
        
        <Box 
          sx={{ 
            backgroundColor: 'rgba(41, 52, 107, 0.05)', 
            p: 2, 
            borderRadius: '4px',
            mb: 3
          }}
        >
          <Typography variant="body2">
            <strong>Item Number:</strong> {itemDetails?.item_number || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Item Name:</strong> {itemDetails?.item_name || 'N/A'}
          </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Vendor Information
        </Typography>
        
        <TextField
          autoFocus
          margin="dense"
          id="vendorName"
          label="Vendor Name"
          type="text"
          fullWidth
          variant="outlined"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Vendor Documentation
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            component="label"
            sx={{
              borderColor: "#29346B",
              color: "#29346B",
              "&:hover": {
                borderColor: "#1e2756",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Select Files
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
            Upload vendor qualification documents, certifications, and compliance records
          </Typography>
        </Box>

        {files.length > 0 && (
          <Box 
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '4px',
              mt: 2
            }}
          >
            <List dense>
              {files.map((file, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleRemoveFile(index)}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon sx={{ color: '#3f51b5' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#29346B",
            color: "#29346B",
            "&:hover": {
              borderColor: "#1e2756",
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleVerify} 
          variant="contained"
          disabled={uploading || success}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
          sx={{
            bgcolor: "#F59E0B",
            "&:hover": { bgcolor: "#D97706" },
            color: 'white'
          }}
        >
          {uploading ? 'Uploading...' : 'Verify Vendor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendorVerificationModal;