import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CommentIcon from '@mui/icons-material/Comment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import PdfViewerDialog from '../../utils/pdfViewer';
import { useApprovalOrCommentOnDrawingMutation } from '../../api/masterdesign/masterDesign';
import { toast } from 'react-toastify';

// Styled components (reusing from your original component)
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

const DrawingApprovalModal = ({ open, handleClose, drawingDetails,refetchDrawings }) => {
  // State for approval status and comments
  const [mainDocumentStatus, setMainDocumentStatus] = useState('');
  const [mainDocumentComment, setMainDocumentComment] = useState('');
//   const [supportingDocumentStatus, setSupportingDocumentStatus] = useState('');
  const [supportingDocumentComment, setSupportingDocumentComment] = useState('');
  const [approvalOrCommentOnDrawing] = useApprovalOrCommentOnDrawingMutation();
  
  // PDF viewer states (reused from your original component)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: '', name: '' });

  const handleOpenPdf = (url, name) => {
    setSelectedPdf({ url, name });
    setPdfViewerOpen(true);
  };

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false);
  };

  // Helper function to get filename from URL (reused from your original component)
  const getFileName = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const handleSubmit = async () => {
    // Gather the approval data
    const approvalData = {
      mainDocuments: {
        status: mainDocumentStatus,
        comment: mainDocumentComment,
        supporting_document:supportingDocumentComment
      }
    };
    const formData = new FormData();
    formData.append('approval_status',mainDocumentStatus);
    formData.append('remarks',mainDocumentComment)
    // This is where you would integrate with your API
    console.log("Approval Data:", approvalData);
    let response = await approvalOrCommentOnDrawing({
      drawingId:drawingDetails.id,
      formData:formData
    }).unwrap();
    if(response.status){
      toast.success("Status Updated");
    }else{
      toast.error(response.message)
    }
    // Close the modal
    refetchDrawings();
    handleClose();

  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Review Drawing Documents
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, mt: 1 }}>
          {/* Drawing Basic Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#29346B', fontWeight: 500 }}>
              {drawingDetails?.name_of_drawing || 'Drawing Name'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Drawing Number: {drawingDetails?.drawing_number || 'N/A'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Main Documents Approval Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#29346B', display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Main Documents Review
            </Typography>
            
            {/* Display Main Documents */}
            {drawingDetails?.drawing_and_design_attachments && drawingDetails.drawing_and_design_attachments.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                {drawingDetails.drawing_and_design_attachments.map((attachment) => (
                  <FileCard key={attachment.id} elevation={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PictureAsPdfIcon sx={{ color: '#29346B', mr: 2 }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {getFileName(attachment.url)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Added on 
                          {/* {moment(attachment.created_at).format('MMM DD, YYYY')} */}
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
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                No main documents attached
              </Typography>
            )}
            
            {/* Approval Controls for Main Documents */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="main-document-status-label">Status</InputLabel>
                  <Select
                    labelId="main-document-status-label"
                    id="main-document-status"
                    value={mainDocumentStatus}
                    label="Status"
                    onChange={(e) => setMainDocumentStatus(e.target.value)}
                  >
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="commented">Commented</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  id="main-document-comment"
                  label="Comments/Remarks"
                  multiline
                  rows={4}
                  fullWidth
                  value={mainDocumentComment}
                  onChange={(e) => setMainDocumentComment(e.target.value)}
                  placeholder="Add your comments or remarks here..."
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Supporting Documents Approval Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#29346B', display: 'flex', alignItems: 'center' }}>
              <CommentIcon sx={{ mr: 1 }} /> Supporting Documents Review
            </Typography>
            
            {/* Display Supporting Documents */}
            {drawingDetails?.other_drawing_and_design_attachments && drawingDetails.other_drawing_and_design_attachments.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                {drawingDetails.other_drawing_and_design_attachments.map((attachment) => (
                  <FileCard key={attachment.id} elevation={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PictureAsPdfIcon sx={{ color: '#29346B', mr: 2 }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {getFileName(attachment.url)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Added on 
                          {/* {moment(attachment.created_at).format('MMM DD, YYYY')} */}
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
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                No supporting documents attached
              </Typography>
            )}
            
            {/* Approval Controls for Supporting Documents */}
            <Grid container spacing={3}>
              {/* <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="supporting-document-status-label">Status</InputLabel>
                  <Select
                    labelId="supporting-document-status-label"
                    id="supporting-document-status"
                    value={supportingDocumentStatus}
                    label="Status"
                    onChange={(e) => setSupportingDocumentStatus(e.target.value)}
                  >
                    <MenuItem value="A">Approved</MenuItem>
                    <MenuItem value="C">Commented</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              
              <Grid item xs={12}>
                <TextField
                  id="supporting-document-comment"
                  label="Comments/Remarks"
                  multiline
                  rows={4}
                  fullWidth
                  value={supportingDocumentComment}
                  onChange={(e) => setSupportingDocumentComment(e.target.value)}
                  placeholder="Add your comments or remarks here..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#29346B', '&:hover': { bgcolor: '#1e2756' } }}
          >
            Submit Review
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

export default DrawingApprovalModal;