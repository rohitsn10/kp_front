import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import BlockIcon from '@mui/icons-material/ViewModule';
import NumbersIcon from '@mui/icons-material/Numbers';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import PdfViewerDialog from '../../utils/pdfViewer';

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
}));

const InfoIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  color: '#29346B',
  display: 'flex',
  alignItems: 'center',
}));

const FileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f0f7ff',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

// Main Drawing Document View Modal Component
const DrawingDocumentViewModal = ({ open, handleClose, drawingDetails }) => {
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: '', name: '' });
  console.log("Drawing details>>", drawingDetails);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [versionData, setVersionData] = useState(null);
  const [versions, setVersions] = useState([]);
  const baseURL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (drawingDetails) {
      // Get all commented actions from the main object (outside) - this is the correct source
      const allCommentedActions = drawingDetails.commented_actions || [];
      
      // Prepare versions list - starting with "main"
      const versionsList = [
        {
          version_number: 'main',
          label: 'Main Document Version 1',
          created_at: drawingDetails.updated_at,
          submitted_by: {
            id: drawingDetails.user,
            name: drawingDetails.user_full_name
          },
          documents: {
            drawing_and_design_attachments: drawingDetails.drawing_and_design_attachments || [],
            other_drawing_and_design_attachments: drawingDetails.other_drawing_and_design_attachments || []
          },
          // For main version (Version 1), show the first comment that was made on it
          commented_actions: allCommentedActions.length > 0 
            ? allCommentedActions[0]  // "Issue 1" - first comment made on Version 1
            : null
        }
      ];
      
      // Add versions from resubmitted_actions
      if (drawingDetails.resubmitted_actions && drawingDetails.resubmitted_actions.length > 0) {
        drawingDetails.resubmitted_actions.forEach((version, index) => {
          versionsList.push({
            ...version,
            label: `Version ${version.version_number}`,
            documents: {
              drawing_and_design_attachments: version.documents?.drawing_and_design_attachments?.map(doc => ({
                ...doc,
                url: doc.url.startsWith('http') ? doc.url : `${baseURL}${doc.url}`
              })) || [],
              other_drawing_and_design_attachments: version.documents?.other_drawing_and_design_attachments?.map(doc => ({
                ...doc,
                url: doc.url.startsWith('http') ? doc.url : `${baseURL}${doc.url}`
              })) || []
            },
            // Use the correct comment from the main commented_actions array
            // Version 2 should show comment at index 1, Version 3 should show comment at index 2, etc.
            commented_actions: allCommentedActions[index + 1] || null
          });
        });
      }
      
      setVersions(versionsList);
      
      // Set default to main version
      setSelectedVersion('main');
      setVersionData(versionsList[0]);
    }
  }, [drawingDetails]);

  const handleVersionChange = (event) => {
    const versionNumber = event.target.value;
    setSelectedVersion(versionNumber);
    
    // Find the corresponding version data
    const newVersionData = versions.find(
      version => version.version_number === versionNumber
    );
    
    if (newVersionData) {
      setVersionData(newVersionData);
    } 
  };

  const handleOpenPdf = (url, name) => {
    setSelectedPdf({ url, name });
    setPdfViewerOpen(true);
  };

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false);
  };

  // Helper function to get filename from URL
  const getFileName = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // Helper function to get approval status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'A':
      case 'approved':
        return { bg: '#4caf50', text: 'white', label: 'Approved' };
      case 'C':
      case 'commented':
        return { bg: '#ff9800', text: 'black', label: 'Commented' };
      case 'S':
      case 'submitted':
        return { bg: '#2196f3', text: 'white', label: 'Submitted' };
      case 'N':
      case 'New':
        return { bg: '#f44336', text: 'white', label: 'New' };
      default:
        return { bg: '#9e9e9e', text: 'white', label: 'Unknown' };
    }
  };

  // Get status details
  const statusInfo = getStatusColor(drawingDetails?.approval_status);
  
  // Format date helper function (as a replacement for moment.js)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Function to get document attachments from the selected version
  const getDrawingAttachments = () => {
    if (versionData?.documents?.drawing_and_design_attachments) {
      return versionData.documents.drawing_and_design_attachments;
    }
    return [];
  };

  // Function to get supporting document attachments from the selected version
  const getSupportingAttachments = () => {
    if (versionData?.documents?.other_drawing_and_design_attachments) {
      return versionData.documents.other_drawing_and_design_attachments;
    }
    return [];
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Drawing Document Details
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, mt: 4 }}>
          {/* Version Selector */}
          {versions && versions.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="version-select-label">Version</InputLabel>
                <Select
                  labelId="version-select-label"
                  id="version-select"
                  value={selectedVersion || 'main'}
                  onChange={handleVersionChange}
                  label="Version"
                >
                  {versions.map((version) => (
                    <MenuItem key={version.version_number} value={version.version_number}>
                      {version.label} - Created on {formatDate(version.created_at)} by {version.submitted_by.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          
          {/* Drawing Details Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#29346B', fontWeight: 500 }}>
              {drawingDetails?.name_of_drawing}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <InfoItem>
                  <InfoIcon>
                    <NumbersIcon />
                  </InfoIcon>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Drawing Number</Typography>
                    <Typography variant="body1">{drawingDetails?.drawing_number || 'N/A'}</Typography>
                  </Box>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <CategoryIcon />
                  </InfoIcon>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Discipline</Typography>
                    <Typography variant="body1">{drawingDetails?.discipline || 'N/A'}</Typography>
                  </Box>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <BlockIcon />
                  </InfoIcon>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Block</Typography>
                    <Typography variant="body1">{drawingDetails?.block || 'N/A'}</Typography>
                  </Box>
                </InfoItem>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <InfoItem>
                  <InfoIcon>
                    <ArticleIcon />
                  </InfoIcon>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Drawing Category</Typography>
                    <Typography variant="body1">{drawingDetails?.drawing_category || 'N/A'}</Typography>
                  </Box>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <AssignmentIcon />
                  </InfoIcon>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Type of Approval</Typography>
                    <Typography variant="body1">{drawingDetails?.type_of_approval || 'N/A'}</Typography>
                  </Box>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <PersonIcon />
                  </InfoIcon>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Created By</Typography>
                    <Typography variant="body1">{drawingDetails?.user_full_name || 'N/A'}</Typography>
                  </Box>
                </InfoItem>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
              <Box>
                <Chip 
                  label={statusInfo.label}
                  sx={{ 
                    bgcolor: statusInfo.bg, 
                    color: statusInfo.text, 
                    fontWeight: 'bold',
                    px: 1
                  }} 
                />
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Last Updated: {formatDate(versionData?.created_at)}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Main Attachments Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#29346B' }}>
              Main Documents
            </Typography>
            
            {getDrawingAttachments().length > 0 ? (
              getDrawingAttachments().map((attachment) => (
                <FileCard key={attachment.id} elevation={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdfIcon sx={{ color: '#29346B', mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {getFileName(attachment.url)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Added on {formatDate(attachment.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="View Document">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenPdf(attachment.url, getFileName(attachment.url))}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton 
                        color="primary"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </FileCard>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                No main documents attached
              </Typography>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Supporting Attachments Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#29346B', display: 'flex', alignItems: 'center' }}>
              Supporting Documents
              {getSupportingAttachments().length > 0 && (
                <Badge 
                  badgeContent={getSupportingAttachments().length} 
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            
            {getSupportingAttachments().length > 0 ? (
              getSupportingAttachments().map((attachment) => (
                <FileCard key={attachment.id} elevation={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdfIcon sx={{ color: '#29346B', mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {getFileName(attachment.url)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Added on {formatDate(attachment.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="View Document">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenPdf(attachment.url, getFileName(attachment.url))}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton 
                        color="primary"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </FileCard>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                No supporting documents attached
              </Typography>
            )}
          </Box>
          
          {/* Commented Actions Section (if present in selected version) */}
          {versionData?.commented_actions && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#29346B' }}>
                  Review Comments
                </Typography>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Reviewed by:</strong> {versionData.commented_actions.user_full_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Date:</strong> {formatDate(versionData.commented_actions.created_at)}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {versionData.commented_actions.remarks || 'No comments provided'}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose}
            variant="contained"
            sx={{ bgcolor: '#29346B', '&:hover': { bgcolor: '#1e2756' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* PDF Viewer Dialog */}
      <PdfViewerDialog 
        open={pdfViewerOpen}
        handleClose={handleClosePdfViewer}
        pdfUrl={selectedPdf.url}
        fileName={selectedPdf.name}
      />
    </>
  );
};

export default DrawingDocumentViewModal;