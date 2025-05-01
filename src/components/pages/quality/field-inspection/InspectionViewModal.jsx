import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import { 
  useGetRfiInspectionOutcomeQuery,
  useGetFilesUploadInspectionOutcomeQuery
} from '../../../../api/quality/qualityApi';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PdfViewerDialog from '../../../../utils/pdfViewer';
// import PdfViewerDialog from './PdfViewerDialog';

function InspectionViewModal({ open, handleClose, rfiData }) {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  
  // Only fetch data when modal is open and we have valid rfiData
  const { 
    data: inspectionResponse, 
    isLoading: isLoadingInspection, 
    error: inspectionError 
  } = useGetRfiInspectionOutcomeQuery(
    rfiData?.id, 
    { skip: !open || !rfiData }
  );

  const { 
    data: filesResponse, 
    isLoading: isLoadingFiles, 
    error: filesError 
  } = useGetFilesUploadInspectionOutcomeQuery(
    rfiData?.id, 
    { skip: !open || !rfiData }
  );

  // Extract actual data from the response
  const inspectionData = inspectionResponse?.data || [];
  const filesData = filesResponse?.data || [];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.slice(0, 5); // Extract HH:MM from HH:MM:SS
  };

  // Get file name from path
  const getFileName = (path) => {
    if (!path) return 'Unknown File';
    // Extract filename from path
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  // Get file extension
  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Open PDF viewer
  const handleOpenPdf = (document) => {
    // Construct full URL - adjust this based on your API base URL
    const baseUrl = import.meta.env.VITE_API_KEY || 'http://localhost';
    const fullUrl = `${baseUrl}${document}`;
    
    setSelectedPdf({
      url: fullUrl,
      name: getFileName(document)
    });
    setPdfViewerOpen(true);
  };

  // Close PDF viewer
  const handleClosePdf = () => {
    setPdfViewerOpen(false);
  };

  // Get disposition status chip
  const getDispositionChip = (status) => {
    if (!status) return <Chip label="N/A" />;
    
    switch(status.toLowerCase()) {
      case 'sort':
        return <Chip 
          label="Sort" 
          color="warning" 
          sx={{ fontWeight: 'bold' }}
        />;
      case 'rework':
        return <Chip 
          label="Rework" 
          color="error" 
          sx={{ fontWeight: 'bold' }}
        />;
      case 'accept':
        return <Chip 
          label="Accept" 
          color="success" 
          sx={{ fontWeight: 'bold' }}
        />;
      case 'reject':
        return <Chip 
          label="Reject" 
          color="error" 
          sx={{ fontWeight: 'bold' }}
        />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white' }}>
          Inspection Details
          {rfiData && (
            <Typography variant="subtitle1">
              RFI Number: {rfiData.rfi_number || 'N/A'}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {(!rfiData) ? (
            <Typography variant="body1" color="textSecondary" sx={{ my: 2 }}>
              No RFI data selected.
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {/* Basic RFI Information */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#29346B', display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  RFI Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>EPC Name:</strong> {rfiData.epc_name || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Created:</strong> {formatDate(rfiData.created_at)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Offered Date:</strong> {formatDate(rfiData.offered_date)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Location:</strong> {`${rfiData.block_number || ''} ${rfiData.location_name || ''}` || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Inspection Outcome Data */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#29346B', display: 'flex', alignItems: 'center' }}>
                  <EventNoteIcon sx={{ mr: 1 }} />
                  Inspection Outcome
                </Typography>
                
                {isLoadingInspection ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : inspectionError ? (
                  <Typography color="error" sx={{ my: 2 }}>
                    Error loading inspection data. {inspectionError.message || ''}
                  </Typography>
                ) : inspectionData.length === 0 ? (
                  <Typography color="textSecondary" sx={{ my: 2 }}>
                    No inspection outcomes found for this RFI.
                  </Typography>
                ) : (
                  <Box>
                    {inspectionData.map((inspection, index) => (
                      <Box key={inspection.id || index} sx={{ mb: index < inspectionData.length - 1 ? 3 : 0 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Disposition Status:</strong> {getDispositionChip(inspection.disposition_status)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Created:</strong> {formatDate(inspection.created_at)}
                            </Typography>
                          </Grid>
                          
                          {/* Time-related information */}
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTimeIcon sx={{ mr: 1, color: '#666' }} />
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                Inspection Times:
                              </Typography>
                            </Box>
                            <Grid container spacing={2} sx={{ pl: 4 }}>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="body2"><strong>Offered:</strong> {formatTime(inspection.offered_time)}</Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="body2"><strong>Reaching:</strong> {formatTime(inspection.reaching_time)}</Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="body2"><strong>Started:</strong> {formatTime(inspection.inspection_start_time)}</Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="body2"><strong>Ended:</strong> {formatTime(inspection.inspection_end_time)}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          
                          {/* Additional details */}
                          <Grid item xs={12}>
                            <Typography variant="body2"><strong>Actions:</strong> {inspection.actions || 'None'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2"><strong>Responsibility:</strong> {inspection.responsibility || 'None'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2"><strong>Timelines:</strong> {inspection.timelines || 'None'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2"><strong>Remarks:</strong> {inspection.remarks || 'None'}</Typography>
                          </Grid>
                          
                          {/* Observations */}
                          {inspection.observation && inspection.observation.length > 0 && (
                            <Grid item xs={12}>
                              <Typography variant="body2">
                                <strong>Observations:</strong> {inspection.observation.join(', ')}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>

              {/* Uploaded Files */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#29346B', display: 'flex', alignItems: 'center' }}>
                  <PictureAsPdfIcon sx={{ mr: 1 }} />
                  Uploaded Documents
                </Typography>
                
                {isLoadingFiles ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : filesError ? (
                  <Typography color="error" sx={{ my: 2 }}>
                    Error loading files data. {filesError.message || ''}
                  </Typography>
                ) : filesData.length === 0 ? (
                  <Typography color="textSecondary" sx={{ my: 2 }}>
                    No files uploaded for this RFI.
                  </Typography>
                ) : (
                  <List>
                    {filesData.map((file, index) => {
                      const fileName = getFileName(file.document);
                      const fileExtension = getFileExtension(fileName);
                      const isPdf = fileExtension === 'pdf';
                      const isHtml = fileExtension === 'html';
                      const canPreview = isPdf || isHtml;
                      
                      return (
                        <ListItem 
                          key={file.id || index}
                          secondaryAction={
                            canPreview && (
                              <IconButton 
                                edge="end" 
                                onClick={() => handleOpenPdf(file.document)}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            )
                          }
                          sx={{ border: '1px solid #eee', borderRadius: '4px', mb: 1 }}
                        >
                          <ListItemIcon>
                            <InsertDriveFileIcon color={isPdf ? "error" : isHtml ? "primary" : "action"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={fileName}
                            secondary={`Uploaded: ${formatDate(file.created_at)}`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
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
      {selectedPdf && (
        <PdfViewerDialog
          open={pdfViewerOpen}
          handleClose={handleClosePdf}
          pdfUrl={selectedPdf.url}
          fileName={selectedPdf.name}
        />
      )}
    </>
  );
}

export default InspectionViewModal;