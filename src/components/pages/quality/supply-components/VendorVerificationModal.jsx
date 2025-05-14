import React, { useState, useEffect } from "react";
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
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  Tooltip,
  Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { 
  useCreateVendorMutation,
  useGetVendorListQuery,
  useVerifyVendorMutation 
} from "../../../../api/quality/qualitySupplyApi"; // Update this path

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vendor-tabpanel-${index}`}
      aria-labelledby={`vendor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VendorManagementModal = ({ open, handleClose, itemDetails, projectId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [vendorName, setVendorName] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // API hooks
  const [createVendor, { isLoading: creating }] = useCreateVendorMutation();
  const [verifyVendor, { isLoading: verifying }] = useVerifyVendorMutation();
  const { 
    data: vendorListData, 
    isLoading: loadingVendors, 
    refetch: refetchVendors 
  } = useGetVendorListQuery(
    { itemId: itemDetails?.id, projectId: projectId },
    { skip: !open || !itemDetails?.id || !projectId }
  );

  // Reset state when modal is closed or opened with a new item
  useEffect(() => {
    if (open) {
      setVendorName("");
      setFiles([]);
      setError("");
      setSuccess(false);
      setTabValue(0);
      setSelectedVendor(null);
    }
  }, [open, itemDetails]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    setError("");
    setSuccess(false);
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCreateVendor = async () => {
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

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('vendor_name', vendorName);
      formData.append('item_id', itemDetails?.id);
      formData.append('project_id', projectId);
      
      // Append all files to the formData
      files.forEach(file => {
        formData.append('file', file);
      });

      // Call the createVendor API
      await createVendor(formData).unwrap();
      
      // Handle successful response
      setSuccess(true);
      setVendorName("");
      setFiles([]);
      
      // Refetch the vendor list
      refetchVendors();
      
      // Switch to vendor list tab after successful creation
      setTimeout(() => {
        setTabValue(1);
        setSuccess(false);
      }, 1000);
      
    } catch (err) {
      // Handle error responses
      console.error("Error creating vendor:", err);
      
      if (err.data?.detail) {
        setError(err.data.detail);
      } else if (err.data?.message) {
        setError(err.data.message);
      } else if (typeof err.data === 'string') {
        setError(err.data);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleVerifyVendorToggle = async (vendorId, currentStatus) => {
    try {
      setError("");
      
      // If trying to unverify, show an error message
      if (currentStatus === true) {
        setError("You cannot unverify a vendor once verified. Please select a different vendor to verify.");
        return;
      }
      
      // Check if there's already a verified vendor
      const verifiedVendor = vendors.find(v => v.is_verified);
      
      // Create form data for the new verification status (always true for verification)
      const formData = new FormData();
      formData.append('is_verified', "True");
      
      // Call API to update verification status
      await verifyVendor({ 
        vendorId: vendorId,
        isVerified: "True" 
      }).unwrap();
      
      // Refetch vendor list
      refetchVendors();
      
      // Show brief success message
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error("Error verifying vendor:", err);
      
      if (err.data?.detail) {
        setError(err.data.detail);
      } else if (err.data?.message) {
        setError(err.data.message);
      } else if (typeof err.data === 'string') {
        setError(err.data);
      } else {
        setError("Failed to update vendor verification status.");
      }
    }
  };

  const handleViewVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setTabValue(2);
  };

  // Determine if we have vendors to display
  const vendors = vendorListData?.data || [];
  const hasVendors = vendors.length > 0;

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
          <BusinessIcon sx={{ mr: 1 }} />
          Vendor Management
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab} 
          aria-label="vendor management tabs"
          variant="fullWidth"
        >
          <Tab 
            icon={<AddIcon />} 
            label="Add Vendor" 
            id="vendor-tab-0" 
            aria-controls="vendor-tabpanel-0" 
          />
          <Tab 
            icon={<BusinessIcon />} 
            label="Vendor List" 
            id="vendor-tab-1" 
            aria-controls="vendor-tabpanel-1" 
          />
          {selectedVendor && (
            <Tab 
              icon={<VerifiedUserIcon />} 
              label="Vendor Details" 
              id="vendor-tab-2" 
              aria-controls="vendor-tabpanel-2" 
            />
          )}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {tabValue === 0 ? "Vendor created successfully!" : "Vendor status updated successfully!"}
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

        {/* Add Vendor Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* Vendor List Tab */}
        <TabPanel value={tabValue} index={1}>
          {loadingVendors ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : !hasVendors ? (
            <Box 
              sx={{ 
                py: 4, 
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No vendors added yet.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setTabValue(0)}
                sx={{ 
                  mt: 2,
                  bgcolor: "#F59E0B",
                  "&:hover": { bgcolor: "#D97706" },
                }}
              >
                Add New Vendor
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {vendors.map((vendor) => (
                <Grid item xs={12} key={vendor.id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      position: 'relative',
                      '&:hover': { 
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        borderColor: '#aaa'
                      },
                      borderColor: vendor.is_verified ? '#4caf50' : undefined,
                      borderWidth: vendor.is_verified ? '2px' : undefined,
                      backgroundColor: vendor.is_verified ? 'rgba(76, 175, 80, 0.05)' : undefined,
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={7} sm={8}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <BusinessIcon sx={{ mr: 1, color: '#29346B' }} />
                            <Typography variant="h6">
                              {vendor.vendor_name}
                            </Typography>
                            {vendor.is_verified && (
                              <Chip 
                                size="small" 
                                icon={<VerifiedUserIcon />} 
                                label="Verified" 
                                color="success" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            ID: {vendor.id} • Added: {new Date(vendor.created_at).toLocaleDateString()}
                          </Typography>
                          
                          <Box mt={1}>
                            <Typography variant="body2">
                              Files: {vendor.vendor_file.length}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={5} sm={4}>
                          <Box display="flex" flexDirection="column" alignItems="flex-end">
                            {vendor.is_verified ? (
                              <Chip 
                                icon={<VerifiedUserIcon />}
                                label="Selected Vendor" 
                                color="success" 
                                sx={{ mb: 1 }}
                              />
                            ) : (
                              <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                disabled={verifying || vendors.some(v => v.is_verified)}
                                onClick={() => handleVerifyVendorToggle(vendor.id, vendor.is_verified)}
                                startIcon={verifying ? <CircularProgress size={16} /> : <VerifiedUserIcon />}
                                sx={{ mb: 1 }}
                              >
                                {vendors.some(v => v.is_verified) ? 'Another Vendor Selected' : 'Verify & Select'}
                              </Button>
                            )}
                            
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewVendorDetails(vendor)}
                              sx={{ mt: 1 }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Vendor Details Tab */}
        <TabPanel value={tabValue} index={2}>
          {selectedVendor && (
            <Box>
              <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {selectedVendor.vendor_name}
                  </Typography>
                  <Chip 
                    label={selectedVendor.is_verified ? "Verified" : "Not Verified"}
                    color={selectedVendor.is_verified ? "success" : "default"}
                    icon={selectedVendor.is_verified ? <VerifiedUserIcon /> : undefined}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Vendor Information
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Vendor ID
                    </Typography>
                    <Typography variant="body1">
                      {selectedVendor.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedVendor.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedVendor.updated_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Verification Status
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedVendor.is_verified}
                            onChange={() => handleVerifyVendorToggle(selectedVendor.id, selectedVendor.is_verified)}
                            color="success"
                            disabled={verifying}
                          />
                        }
                        label=""
                      />
                      <Typography variant="body1">
                        {selectedVendor.is_verified ? "Verified" : "Not Verified"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Documents ({selectedVendor.vendor_file.length})
                </Typography>
                
                {selectedVendor.vendor_file.length > 0 ? (
                  <List dense>
                    {selectedVendor.vendor_file.map((file, index) => (
                      <React.Fragment key={file.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemIcon>
                            <InsertDriveFileIcon sx={{ color: '#3f51b5' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={file.file.split('/').pop()}
                            secondary={`Added: ${new Date(file.created_at).toLocaleDateString()}`}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Download">
                              <IconButton 
                                edge="end" 
                                component={Link}
                                href={`${import.meta.env.VITE_API_KEY}${file.file}`} 
                                target="_blank"
                                download
                              >
                                <FileDownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No documents available
                  </Typography>
                )}
              </Paper>
              
              <Box display="flex" justifyContent="center">
                <Button
                  onClick={() => setTabValue(1)}
                  startIcon={<BusinessIcon />}
                  variant="outlined"
                >
                  Back to Vendor List
                </Button>
              </Box>
            </Box>
          )}
        </TabPanel>
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
          Close
        </Button>
        
        {tabValue === 0 && (
          <Button 
            onClick={handleCreateVendor} 
            variant="contained"
            disabled={creating || success}
            startIcon={creating ? <CircularProgress size={20} /> : null}
            sx={{
              bgcolor: "#F59E0B",
              "&:hover": { bgcolor: "#D97706" },
              color: 'white'
            }}
          >
            {creating ? 'Creating...' : 'Create Vendor'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VendorManagementModal;