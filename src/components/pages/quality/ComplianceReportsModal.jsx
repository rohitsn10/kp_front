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
  Divider,
  Paper,
  CircularProgress
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
import DownloadIcon from '@mui/icons-material/Download';
import { 
  useCreateQualityInspectionObservationReportMutation,
  useGetQualityInspectionObservationReportQuery 
} from '../../../api/quality/qualitySupplyApi';
import { useParams } from 'react-router-dom';
import PdfViewerDialog from '../../../utils/pdfViewer';
// import PdfViewerDialog from '../../../components/PdfViewerDialog'; // Import the PdfViewerDialog component

function ComplianceReportsModal({ open, handleClose, itemDetails, qualityInspectionId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [observationTitle, setObservationTitle] = useState('');
  const [observationDescription, setObservationDescription] = useState('');
  const [complianceStatus, setComplianceStatus] = useState('under_review');
  const { projectId } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_KEY;
  
  // State for PDF viewer dialog
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [selectedPdfName, setSelectedPdfName] = useState('');
  
  // RTK Query hook for getting observation reports
  const { 
    data: observationReportResponse, 
    isLoading: isLoadingReports, 
    error: reportsError,
    refetch: refetchReports
  } = useGetQualityInspectionObservationReportQuery(
    { itemId: itemDetails?.id, projectId },
    { skip: !itemDetails?.id || !projectId }
  );

  // RTK Query hook for creating observation reports
  const [createObservationReport, { isLoading: isSubmitting }] = useCreateQualityInspectionObservationReportMutation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      // Convert FileList to array and append to existing files
      const newFiles = Array.from(event.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  
  const handleStatusChange = (event) => {
    setComplianceStatus(event.target.value);
  };

  // Function to open PDF viewer
  const openPdfViewer = (fileUrl, fileName) => {
    const fullUrl = `${apiBaseUrl}${fileUrl}`;
    setSelectedPdfUrl(fullUrl);
    setSelectedPdfName(fileName);
    setPdfViewerOpen(true);
  };

  // Function to close PDF viewer
  const closePdfViewer = () => {
    setPdfViewerOpen(false);
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
      case 'open':
        return <Chip 
          icon={<ErrorOutlineIcon />} 
          label="Open" 
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
        return <Chip label={status?.charAt(0).toUpperCase() + status?.slice(1)} size="small" />;
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <InsertDriveFileIcon />;
    
    if (fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon color="error" />;
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return <DescriptionIcon color="primary" />;
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return <InsertDriveFileIcon color="success" />;
    }
    return <InsertDriveFileIcon />;
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

  const handleSubmitReport = async () => {
    try {
      const formData = new FormData();
      
      // Add the form fields corresponding to the API requirements
      formData.append("project_id", projectId);
      formData.append("items_id", itemDetails.id);
      formData.append("observation_title", observationTitle);
      formData.append("observation_status", complianceStatus);
      formData.append("observation_text_report", observationDescription);
      
      // Add all selected files
      for (const file of selectedFiles) {
        formData.append("observation_report_document", file);
      }
      
      // Submit the report using RTK Query mutation
      const response = await createObservationReport(formData).unwrap();
      
      // Reset form and switch to reports tab on success
      setObservationTitle('');
      setObservationDescription('');
      setComplianceStatus('under_review');
      setSelectedFiles([]);
      setActiveTab(0);
      
      // Refetch the reports list to get the latest data
      refetchReports();
      
      console.log("Report submitted successfully", response);
      
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const isSubmitDisabled = !observationTitle.trim() || !observationDescription.trim() || isSubmitting;

  // Extract observation reports from API response
  const observationReports = observationReportResponse?.data || [];

  return (
    <>
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
            <Tab label={`Compliance Reports (${observationReports.length})`} />
            <Tab label="Add New Report" />
          </Tabs>

          {activeTab === 0 && (
            <div>
              {isLoadingReports ? (
                <div className="p-8 text-center">
                  <CircularProgress size={40} sx={{ color: "#29346B" }} />
                  <Typography variant="body1" className="mt-3">
                    Loading compliance reports...
                  </Typography>
                </div>
              ) : reportsError ? (
                <div className="p-8 text-center bg-red-50 rounded-md">
                  <ErrorOutlineIcon color="error" style={{ fontSize: 48 }} className="mb-2" />
                  <Typography variant="body1" color="error">
                    Error loading reports. Please try again.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => refetchReports()}
                    className="mt-3"
                  >
                    Retry
                  </Button>
                </div>
              ) : observationReports.length > 0 ? (
                <div>
                  {observationReports.map((report, index) => (
                    <Paper 
                      elevation={1} 
                      className="mb-4 p-4 border-l-4 rounded-md" 
                      key={report.id}
                      style={{ 
                        borderLeftColor: report.observation_status === 'closed' ? '#10B981' : 
                                        report.observation_status === 'open' ? '#EF4444' : '#3B82F6' 
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle1" className="font-semibold">
                          {report.observation_title}
                        </Typography>
                        {getStatusChip(report.observation_status)}
                      </div>
                      
                      <Typography variant="body1" className="mb-2">
                        {report.observation_text_report}
                      </Typography>
                      
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                        <span>Created at: {formatDate(report.created_at)}</span>
                        {report.created_by_name && (
                          <>
                            <span>•</span>
                            <span>Created by: {report.created_by_name}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="mb-2">
                        <Typography variant="body2" className="font-semibold mb-1">
                          Attachments:
                        </Typography>
                        {report.observation_report_document && report.observation_report_document.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {report.observation_report_document.map((file) => {
                              const fileName = getFileName(file.file);
                              return (
                                <Chip
                                  key={file.id}
                                  icon={getFileIcon(fileName)}
                                  label={fileName}
                                  onClick={() => {
                                    // If it's a PDF, use the PDF viewer
                                    if (fileName.endsWith('.pdf')) {
                                      openPdfViewer(file.file, fileName);
                                    } else {
                                      // For other file types, open in a new tab
                                      window.open(`${apiBaseUrl}${file.file}`, '_blank');
                                    }
                                  }}
                                  clickable
                                  variant="outlined"
                                  size="small"
                                  className="mb-1"
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No attachments
                          </Typography>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-2">
                        {report.observation_report_document && report.observation_report_document.length > 0 && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleFileDownload(report.observation_report_document[0].file)}
                          >
                            Download
                          </Button>
                        )}
                        
                        {report.observation_report_document && 
                         report.observation_report_document.length > 0 && 
                         getFileName(report.observation_report_document[0].file).endsWith('.pdf') && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => openPdfViewer(
                              report.observation_report_document[0].file, 
                              getFileName(report.observation_report_document[0].file)
                            )}
                          >
                            View PDF
                          </Button>
                        )}
                        
                        {report.observation_status !== 'closed' && (
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
                      
                      {index < observationReports.length - 1 && <Divider className="mt-4" />}
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
                label="Observation Title"
                value={observationTitle}
                onChange={(e) => setObservationTitle(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter a title for this observation..."
                required
              />
              
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
                required
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
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
              
              <Box className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-4 mb-4">
                <Typography variant="body1" className="mb-2 font-semibold">
                  Supporting Documentation
                </Typography>
                
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <Typography variant="body2" className="mb-2 text-gray-600">
                      Selected Files:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => handleRemoveFile(index)}
                          variant="outlined"
                          icon={getFileIcon(file.name.split('.').pop().toLowerCase())}
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col items-center py-4">
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
                      multiple
                    />
                  </Button>
                </div>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-50">
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          {activeTab === 1 && (
            <Button 
              variant="contained" 
              color="primary"
              disabled={isSubmitDisabled}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <AssignmentIcon />}
              onClick={handleSubmitReport}
              sx={{ bgcolor: "#29346B", "&:hover": { bgcolor: "#1e2756" } }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Compliance Report'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* PDF Viewer Dialog */}
      <PdfViewerDialog 
        open={pdfViewerOpen}
        handleClose={closePdfViewer}
        pdfUrl={selectedPdfUrl}
        fileName={selectedPdfName}
      />
    </>
  );
}

export default ComplianceReportsModal;