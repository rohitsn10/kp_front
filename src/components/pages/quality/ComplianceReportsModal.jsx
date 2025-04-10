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
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function ComplianceReportsModal({ open, handleClose, itemDetails }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [observationDescription, setObservationDescription] = useState('');
  const [complianceStatus, setComplianceStatus] = useState('under_review');

  // Dummy data for compliance reports
  const complianceReports = [
    {
      id: 1,
      observation: "Material thickness does not comply with specification 123-XYZ. Required: 12mm, Actual: 10mm.",
      date_created: "2025-03-15",
      status: "closed",
      created_by: "Maria Rodriguez",
      resolution: "Vendor provided material certificates proving the 10mm thickness meets design requirements due to higher grade material used. Accepted with engineering approval.",
      closure_date: "2025-03-25",
      files: [
        { name: "Material_Certificate.pdf", date: "2025-03-20", user: "Vendor", type: "pdf" },
        { name: "Engineering_Approval.docx", date: "2025-03-24", user: "Engineering", type: "docx" }
      ]
    },
    {
      id: 2,
      observation: "Surface finish on connection flanges exceeds roughness requirements.",
      date_created: "2025-03-18",
      status: "resubmit",
      created_by: "John Smith",
      resolution: "Vendor provided rework plan, but surface finish still exceeds requirements. Additional machining required.",
      files: [
        { name: "Rework_Plan.pdf", date: "2025-03-22", user: "Vendor", type: "pdf" },
        { name: "Inspection_Report.xlsx", date: "2025-03-24", user: "QC Inspector", type: "xlsx" }
      ]
    },
    {
      id: 3,
      observation: "Documentation for welding procedures missing required WPS qualification records.",
      date_created: "2025-04-01",
      status: "under_review",
      created_by: "David Kim",
      files: [
        { name: "Partial_WPS_Records.pdf", date: "2025-04-05", user: "Vendor", type: "pdf" }
      ]
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const handleStatusChange = (event) => {
    setComplianceStatus(event.target.value);
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'under_review':
        return <Chip 
          icon={<WarningAmberIcon />} 
          label="Under Review" 
          color="primary" 
          size="small" 
        />;
      case 'resubmit':
        return <Chip 
          icon={<ErrorOutlineIcon />} 
          label="Resubmit Required" 
          color="error" 
          size="small" 
        />;
      case 'closed':
        return <Chip 
          icon={<CheckCircleIcon />} 
          label="Closed" 
          color="success" 
          size="small" 
        />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'docx':
      case 'doc':
        return <DescriptionIcon color="primary" />;
      case 'xlsx':
      case 'xls':
        return <InsertDriveFileIcon color="success" />;
      default:
        return <InsertDriveFileIcon />;
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
        <span>Compliance Reports - {itemDetails ? itemDetails.item_name : ''}</span>
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
                <Typography variant="body1">{itemDetails.status}</Typography>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onChange={handleTabChange} className="mb-4">
          <Tab label="Compliance Reports" />
          <Tab label="Add New Report" />
        </Tabs>

        {activeTab === 0 && (
          <div>
            {complianceReports.length > 0 ? (
              <div>
                {complianceReports.map((report, index) => (
                  <Paper 
                    elevation={1} 
                    className="mb-4 p-4 border-l-4 rounded-md" 
                    key={report.id}
                    style={{ 
                      borderLeftColor: report.status === 'closed' ? '#10B981' : 
                                      report.status === 'resubmit' ? '#EF4444' : '#3B82F6' 
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Typography variant="subtitle1" className="font-semibold">
                        Observation #{report.id}
                      </Typography>
                      {getStatusChip(report.status)}
                    </div>
                    
                    <Typography variant="body1" className="mb-2">
                      {report.observation}
                    </Typography>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                      <span>Created by: {report.created_by}</span>
                      <span>•</span>
                      <span>Date: {report.date_created}</span>
                      {report.closure_date && (
                        <>
                          <span>•</span>
                          <span>Closed: {report.closure_date}</span>
                        </>
                      )}
                    </div>
                    
                    {report.resolution && (
                      <div className="mb-3 p-2 bg-gray-50 rounded-md">
                        <Typography variant="body2" className="font-semibold mb-1">
                          Resolution:
                        </Typography>
                        <Typography variant="body2">
                          {report.resolution}
                        </Typography>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <Typography variant="body2" className="font-semibold mb-1">
                        Attachments:
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {report.files.map((file, fileIndex) => (
                          <Chip
                            key={fileIndex}
                            icon={getFileIcon(file.type)}
                            label={file.name}
                            onClick={() => console.log("View file:", file.name)}
                            clickable
                            variant="outlined"
                            size="small"
                            className="mb-1"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                      >
                        View Details
                      </Button>
                      
                      {report.status !== 'closed' && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<UploadFileIcon />}
                          sx={{ bgcolor: "#29346B", "&:hover": { bgcolor: "#1e2756" } }}
                        >
                          Upload Response
                        </Button>
                      )}
                    </div>
                    
                    {index < complianceReports.length - 1 && <Divider className="mt-4" />}
                  </Paper>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-md">
                <AssignmentIcon color="disabled" style={{ fontSize: 48 }} className="mb-2" />
                <Typography variant="body1" color="textSecondary">
                  No compliance reports have been created yet.
                </Typography>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <Typography variant="subtitle1" className="mb-3">
              Create New Compliance Report
            </Typography>
            
            <TextField
              label="Observation Description"
              value={observationDescription}
              onChange={(e) => setObservationDescription(e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              placeholder="Describe the non-compliance observation in detail..."
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="compliance-status-label">Compliance Status</InputLabel>
              <Select
                labelId="compliance-status-label"
                value={complianceStatus}
                label="Compliance Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="resubmit">Resubmit Required</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            
            <Box className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-4 mb-4 text-center">
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
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <CloudUploadIcon className="text-gray-400" style={{ fontSize: 48 }} />
                  <Typography variant="body1" className="mt-2">
                    Attach supporting evidence (optional)
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mt-1">
                    Supports PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
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
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                  </Button>
                </div>
              )}
            </Box>
          </div>
        )}
      </DialogContent>
      <DialogActions className="bg-gray-50">
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        {activeTab === 1 && (
          <Button 
            variant="contained" 
            color="primary"
            disabled={!observationDescription.trim()}
            startIcon={<AssignmentIcon />}
            sx={{ bgcolor: "#29346B", "&:hover": { bgcolor: "#1e2756" } }}
          >
            Submit Compliance Report
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ComplianceReportsModal;