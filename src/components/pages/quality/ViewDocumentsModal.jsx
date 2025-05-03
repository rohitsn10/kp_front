import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Tab,
  Tabs,
  Box,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from '@mui/icons-material/Download';
import { useParams } from 'react-router-dom';


import { useGetQualityInspectionDocumentListQuery, useUploadQualityInspectionDocumentsMutation } from '../../../api/quality/qualitySupplyApi';
// import { useUploadQualityInspectionDocumentMutation } from 'path/to/your/api'; // Make sure this path is correct

export function UploadDocumentsModal({ open, handleClose, itemDetails }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('mqap');
  const [revisionNumber, setRevisionNumber] = useState('');
  const [revisionStatus, setRevisionStatus] = useState('submit');
  const [remarks, setRemarks] = useState('');
  const [uploadError, setUploadError] = useState(null);

  // Make sure this hook is correctly named based on your API export
  const [uploadDocument, { isLoading: isUploadLoading }] = useUploadQualityInspectionDocumentsMutation();

  const { projectId } = useParams();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };
  
  const handleRevisionStatusChange = (event) => {
    setRevisionStatus(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !itemDetails) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    // Create FormData object
    const formData = new FormData();
    
    // Add common fields
    formData.append("project_id", projectId);
    formData.append("item_id", itemDetails.id);
    formData.append("vendor_id", itemDetails.vendor_id || "3");
    formData.append("remarks", remarks);

    // Map the selected document type to the API's expected fields
    switch (documentType) {
      case 'mqap':
        formData.append("mqap_upload", selectedFile);
        formData.append("mqap_revision_number", revisionNumber);
        formData.append("mqap_revision_status", revisionStatus);
        break;
      case 'quality_dossier':
        formData.append("quality_dossier_upload", selectedFile);
        formData.append("quality_dossier_revision_number", revisionNumber);
        formData.append("quality_dossier_revision_status", revisionStatus);
        break;
      case 'drawings':
        formData.append("drawing_upload", selectedFile);
        formData.append("drawing_revision_number", revisionNumber);
        formData.append("drawing_revision_status", revisionStatus);
        break;
      case 'datasheet':
        formData.append("data_sheet_upload", selectedFile);
        formData.append("data_sheet_revision_number", revisionNumber);
        formData.append("data_sheet_revision_status", revisionStatus);
        break;
      case 'specifications':
        formData.append("specification_upload", selectedFile);
        formData.append("specification_revision_number", revisionNumber);
        formData.append("specification_revision_status", revisionStatus);
        break;
      case 'mdcc':
        formData.append("mdcc_upload", selectedFile);
        formData.append("mdcc_revision_number", revisionNumber);
        formData.append("mdcc_revision_status", revisionStatus);
        break;
      default:
        setIsUploading(false);
        setUploadError("Invalid document type selected");
        return;
    }

    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prevProgress + 10;
      });
    }, 300);

    try {
      const response = await uploadDocument(formData).unwrap();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setRevisionNumber('');
        setRevisionStatus('submit');
        setRemarks('');
        setActiveTab(1);
      }, 1000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadError(error.message || "Failed to upload document. Please try again.");
      console.error("Upload error:", error);
    }
  };

  const getDocumentTypeName = () => {
    switch (documentType) {
      case 'mqap':
        return 'Manufacturing Quality Assurance Plan (MQAP)';
      case 'quality_dossier':
        return 'Quality Dossier';
      case 'drawings':
        return 'Approved Drawings';
      case 'datasheet':
        return 'Data Sheet';
      case 'specifications':
        return 'Specifications';
      case 'mdcc':
        return 'Material Dispatch Clearance Certificate (MDCC)';
      default:
        return 'Document';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isUploading ? null : handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="bg-[#29346B] text-white flex justify-between items-center">
        <span>Upload Documents - {itemDetails ? itemDetails.item_name : ''}</span>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          disabled={isUploading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {itemDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <Typography variant="subtitle1" className="font-bold text-[#29346B] mb-2">
              Item Details:
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <Typography variant="body2" className="text-gray-600">Item Number:</Typography>
                <Typography variant="body1">{itemDetails.item_number}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Category:</Typography>
                <Typography variant="body1">Category {itemDetails.category}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Vendor:</Typography>
                <Typography variant="body1">{itemDetails.vendor}</Typography>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onChange={handleTabChange} className="mb-4">
          <Tab label="Upload Document" />
          <Tab label="Upload History" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <FormControl component="fieldset" fullWidth className="mb-4">
              <FormLabel component="legend">Document Type</FormLabel>
              <RadioGroup
                row
                name="documentType"
                value={documentType}
                onChange={handleDocumentTypeChange}
              >
                <FormControlLabel value="mqap" control={<Radio />} label="MQAP" />
                <FormControlLabel value="quality_dossier" control={<Radio />} label="Quality Dossier" />
                <FormControlLabel value="drawings" control={<Radio />} label="Drawings" />
                <FormControlLabel value="datasheet" control={<Radio />} label="Data Sheet" />
                <FormControlLabel value="specifications" control={<Radio />} label="Specifications" />
                <FormControlLabel value="mdcc" control={<Radio />} label="MDCC" />
              </RadioGroup>
            </FormControl>

            <Box className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4 text-center">
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <InsertDriveFileIcon className="text-blue-600" style={{ fontSize: 48 }} />
                  <Typography variant="body1" className="mt-2">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    className="mt-2"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <CloudUploadIcon className="text-gray-400" style={{ fontSize: 48 }} />
                  <Typography variant="body1" className="mt-2">
                    Drag and drop file here or click to browse
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mt-1">
                    Supports PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    className="mt-3"
                    startIcon={<UploadFileIcon />}
                  >
                    Browse Files
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                  </Button>
                </div>
              )}
            </Box>
            
            {uploadError && (
              <Alert severity="error" className="mb-4">{uploadError}</Alert>
            )}

            {isUploading && (
              <div className="mb-4">
                <Typography variant="body2" className="mb-1">
                  Uploading: {uploadProgress}%
                </Typography>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <TextField
              label="Revision Number"
              value={revisionNumber}
              onChange={(e) => setRevisionNumber(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              disabled={isUploading}
            />
            
            <FormControl fullWidth margin="normal" disabled={isUploading}>
              <InputLabel id="revision-status-label">Revision Status</InputLabel>
              <Select
                labelId="revision-status-label"
                id="revision-status"
                value={revisionStatus}
                label="Revision Status"
                onChange={handleRevisionStatusChange}
              >
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="submit">Submit</MenuItem>
                <MenuItem value="commented">Commented</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              disabled={isUploading}
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" className="mb-2">
              Previous Document Uploads
            </Typography>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <PictureAsPdfIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="MQAP_Rev2.pdf" 
                  secondary="Uploaded on 02/04/2025 by John Davis (Rev 2)" 
                />
                <Chip label="MQAP" color="primary" size="small" className="mr-2" />
                <Chip label="Under Review" color="default" size="small" />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <InsertDriveFileIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Datasheet_SteamTurbine.xlsx" 
                  secondary="Uploaded on 28/03/2025 by Maria Garcia (Rev 1)" 
                />
                <Chip label="Data Sheet" color="info" size="small" className="mr-2" />
                <Chip label="Submit" color="success" size="small" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="QualityDossier_Initial.docx" 
                  secondary="Uploaded on 20/03/2025 by Robert Chen (Rev 0)" 
                />
                <Chip label="Quality Dossier" color="success" size="small" className="mr-2" />
                <Chip label="Approved" color="success" size="small" />
              </ListItem>
            </List>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions className="bg-gray-50">
        <Button 
          onClick={handleClose} 
          color="inherit" 
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          disabled={!selectedFile || isUploading} 
          startIcon={isUploading ? <CircularProgress size={16} /> : <UploadFileIcon />}
          onClick={handleUpload}
          sx={{ bgcolor: "#29346B", "&:hover": { bgcolor: "#1e2756" } }}
        >
          {isUploading ? 'Uploading...' : `Upload ${getDocumentTypeName()}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// View Documents Modal
export function ViewDocumentsModal({ open, handleClose, itemDetails }) {
  const [activeTab, setActiveTab] = useState(0);
  const { projectId } = useParams();
  const itemId = itemDetails?.id;
  const apiBaseUrl = import.meta.env.VITE_API_KEY;

  // Use the new hook to fetch documents
  const { 
    data: documentResponse, 
    isLoading, 
    error 
  } = useGetQualityInspectionDocumentListQuery(
    { itemId, projectId },
    { skip: !itemId || !projectId } // Skip query if itemId or projectId is not available
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Define document types structure
  const documentTypes = [
    { id: 'mqap', label: 'MQAP', filesKey: 'mqap_upload' },
    { id: 'quality_dossier', label: 'Quality Dossier', filesKey: 'quality_dossier_upload' },
    { id: 'drawings', label: 'Drawings', filesKey: 'drawing_upload' },
    { id: 'datasheet', label: 'Data Sheets', filesKey: 'data_sheet_upload' },
    { id: 'specifications', label: 'Specifications', filesKey: 'specification_upload' },
    { id: 'mdcc', label: 'MDCC', filesKey: 'mdcc_upload' },
  ];

  const getFileIcon = (fileName) => {
    if (fileName && fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon color="error" />;
    } else if (fileName && (fileName.endsWith('.docx') || fileName.endsWith('.doc'))) {
      return <DescriptionIcon color="primary" />;
    } else if (fileName && (fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      return <InsertDriveFileIcon color="success" />;
    }
    return <InsertDriveFileIcon />;
  };

  // Get color for status chip
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return 'success';
      case 'under_review':
        return 'warning';
      case 'submit':
        return 'info';
      case 'commented':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format the status text for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get file name from path
  const getFileName = (filePath) => {
    if (!filePath) return '';
    return filePath.split('/').pop();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Handle file download
  const handleFileDownload = (filePath) => {
    if (!filePath) return;
    
    // Construct the full URL using the base URL from environment variables
    const fullUrl = `${apiBaseUrl}${filePath}`;
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = fullUrl;
    link.setAttribute('download', getFileName(filePath));
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="bg-[#29346B] text-white flex justify-between items-center">
        <span>View Documents - {itemDetails ? itemDetails.item_name : ''}</span>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {itemDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <Typography variant="subtitle1" className="font-bold text-[#29346B] mb-2">
              Item Details:
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <Typography variant="body2" className="text-gray-600">Item Number:</Typography>
                <Typography variant="body1">{itemDetails.item_number}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Category:</Typography>
                <Typography variant="body1">Category {itemDetails.category}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Vendor:</Typography>
                <Typography variant="body1">{itemDetails.vendor}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Status:</Typography>
                <Chip 
                  size="small" 
                  label={itemDetails.status === 'approved' ? 'Approved' : 
                         itemDetails.status === 'pending_inspection' ? 'Pending Inspection' : 
                         itemDetails.status === 'inspection_scheduled' ? 'Inspection Scheduled' : 
                         itemDetails.status === 'observations_pending' ? 'Observations Pending' : 
                         itemDetails.status}
                  color={itemDetails.status === 'approved' ? 'success' : 
                         itemDetails.status === 'pending_inspection' ? 'warning' : 
                         itemDetails.status === 'inspection_scheduled' ? 'info' : 
                         itemDetails.status === 'observations_pending' ? 'error' : 
                         'default'}
                />
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center">
            <Typography variant="body1">Loading documents...</Typography>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 rounded-md">
            <Typography variant="body1" color="error">
              Error loading documents. Please try again.
            </Typography>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onChange={handleTabChange} className="mb-4" variant="scrollable" scrollButtons="auto">
              {documentTypes.map((type, index) => {
                const files = documentResponse?.data?.[0]?.[type.filesKey] || [];
                return (
                  <Tab key={type.id} label={`${type.label} (${files.length})`} />
                );
              })}
            </Tabs>

            {documentTypes.map((type, index) => {
              const files = documentResponse?.data?.[0]?.[type.filesKey] || [];
              return (
                <div key={type.id} className={activeTab !== index ? 'hidden' : ''}>
                  {files.length > 0 ? (
                    <List>
                      {files.map((file, fileIndex) => {
                        const fileName = getFileName(file.file);
                        const revisionNumber = file[`${type.id === 'drawings' ? 'drawing' : type.id}_revision_number`];
                        const revisionStatus = file[`${type.id === 'drawings' ? 'drawing' : type.id}_revision_status`];
                        const uploadDate = formatDate(file.created_at);
                        
                        return (
                          <ListItem 
                            key={file.id}
                            divider={fileIndex < files.length - 1}
                            secondaryAction={
                              <div className="flex items-center space-x-2">
                                <Chip 
                                  label={formatStatus(revisionStatus)} 
                                  size="small" 
                                  color={getStatusColor(revisionStatus)} 
                                  variant="outlined" 
                                />
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => window.open(`${apiBaseUrl}${file.file}`, '_blank')}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => handleFileDownload(file.file)}
                                >
                                  Download
                                </Button>
                              </div>
                            }
                          >
                            <ListItemIcon>
                              {getFileIcon(fileName)}
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <span className="font-medium">{fileName}</span>
                              } 
                              secondary={
                                <React.Fragment>
                                  <span>Revision: {revisionNumber}</span>
                                  <br />
                                  <span>Uploaded on {uploadDate}</span>
                                  {file.remarks && (
                                    <>
                                      <br />
                                      <span>Remarks: {file.remarks}</span>
                                    </>
                                  )}
                                </React.Fragment>
                              } 
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-md">
                      <InsertDriveFileIcon color="disabled" style={{ fontSize: 48 }} className="mb-2" />
                      <Typography variant="body1" color="textSecondary">
                        No {type.label} documents have been uploaded yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<UploadFileIcon />}
                        className="mt-3"
                        sx={{ bgcolor: "#29346B", "&:hover": { bgcolor: "#1e2756" } }}
                      >
                        Upload {type.label}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </DialogContent>
      <DialogActions className="bg-gray-50">
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}