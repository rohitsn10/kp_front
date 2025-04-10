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

// Upload Documents Modal
export function UploadDocumentsModal({ open, handleClose, itemDetails }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('mqap');
  const [revisionNumber, setRevisionNumber] = useState('');
  const [revisionStatus, setRevisionStatus] = useState('submit'); // New state for revision status
  const [remarks, setRemarks] = useState('');

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
  
  // Handler for revision status change
  const handleRevisionStatusChange = (event) => {
    setRevisionStatus(event.target.value);
  };

  const simulateUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setSelectedFile(null);
            setRevisionNumber('');
            setRevisionStatus('submit');
            setRemarks('');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
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
            
            {/* New Revision Status Field */}
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
              {/* Dummy upload history */}
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
          onClick={simulateUpload}
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Dummy document data for different types
  const documentTypes = [
    { id: 'mqap', label: 'MQAP', files: [
      { name: 'MQAP_Rev2.pdf', date: '02/04/2025', user: 'John Davis', revision: '2', status: 'Under Review' },
    ]},
    { id: 'quality_dossier', label: 'Quality Dossier', files: [
      { name: 'QualityDossier_Initial.docx', date: '20/03/2025', user: 'Robert Chen', revision: '0', status: 'Approved' },
    ]},
    { id: 'drawings', label: 'Drawings', files: [
      { name: 'Assembly_Drawing_Rev1.pdf', date: '10/03/2025', user: 'Sarah Jones', revision: '1', status: 'Submit' },
      { name: 'Component_Detail.pdf', date: '08/03/2025', user: 'Sarah Jones', revision: '0', status: 'Commented' },
    ]},
    { id: 'datasheet', label: 'Data Sheets', files: [
      { name: 'Datasheet_SteamTurbine.xlsx', date: '28/03/2025', user: 'Maria Garcia', revision: '1', status: 'Submit' },
    ]},
    { id: 'specifications', label: 'Specifications', files: []},
    { id: 'mdcc', label: 'MDCC', files: []},
  ];

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon color="error" />;
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return <DescriptionIcon color="primary" />;
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return <InsertDriveFileIcon color="success" />;
    }
    return <InsertDriveFileIcon />;
  };

  // Get color for status chip
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return 'success';
      case 'Under Review':
        return 'warning';
      case 'Submit':
        return 'info';
      case 'Commented':
        return 'error';
      default:
        return 'default';
    }
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

        <Tabs value={activeTab} onChange={handleTabChange} className="mb-4" variant="scrollable" scrollButtons="auto">
          {documentTypes.map((type) => (
            <Tab key={type.id} label={`${type.label} (${type.files.length})`} />
          ))}
        </Tabs>

        {documentTypes.map((type, index) => (
          <div key={type.id} className={activeTab !== index ? 'hidden' : ''}>
            {type.files.length > 0 ? (
              <List>
                {type.files.map((file, fileIndex) => (
                  <ListItem 
                    key={fileIndex}
                    divider={fileIndex < type.files.length - 1}
                    secondaryAction={
                      <div className="flex items-center space-x-2">
                        <Chip 
                          label={file.status} 
                          size="small" 
                          color={getStatusColor(file.status)} 
                          variant="outlined" 
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
                      </div>
                    }
                  >
                    <ListItemIcon>
                      {getFileIcon(file.name)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <span className="font-medium">{file.name}</span>
                      } 
                      secondary={
                        <React.Fragment>
                          <span>Revision: {file.revision}</span>
                          <br />
                          <span>Uploaded on {file.date} by {file.user}</span>
                        </React.Fragment>
                      } 
                    />
                  </ListItem>
                ))}
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
        ))}
      </DialogContent>
      <DialogActions className="bg-gray-50">
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}