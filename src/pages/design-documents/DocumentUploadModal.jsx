import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Modal
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateDrawingMutation } from '../../api/masterdesign/masterDesign';

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// PDF Preview modal style
const previewModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '85%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'column',
};

const DrawingDocumentUploadDialog = ({ open, handleClose, drawingDetails }) => {
  const [mainDocument, setMainDocument] = useState(null);
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  
  // States for PDF preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFileName, setPreviewFileName] = useState('');
  
  // Use the updateDrawing mutation hook
  const [updateDrawing, { isLoading }] = useUpdateDrawingMutation();

  const validatePdfFile = (file) => {
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
    }
    return null;
  };

  const handleMainDocumentChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const validationError = validatePdfFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setMainDocument(file);
      setError('');
    }
  };

  const handleSupportingDocumentsChange = (event) => {
    const files = Array.from(event.target.files);
    let hasError = false;
    
    // Validate all selected files
    files.forEach(file => {
      const validationError = validatePdfFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
        return;
      }
    });
    
    if (!hasError) {
      setSupportingDocuments(prevDocs => [...prevDocs, ...files]);
      setError('');
    }
  };

  const handleRemoveSupportingDocument = (index) => {
    setSupportingDocuments(prevDocs => 
      prevDocs.filter((_, i) => i !== index)
    );
  };

  const handleRemoveMainDocument = () => {
    setMainDocument(null);
  };

  const handleSubmit = async () => {
    if (!mainDocument) {
      setError('Please select a main document to upload');
      return;
    }

    try {
      // Create FormData according to the API structure
      const formData = new FormData();
      
      // Add drawing ID from drawingDetails
      formData.append('project_id', drawingDetails.project || "");
      
      // Append main document under the correct field name
      if (mainDocument) {
        formData.append('drawing_and_design_attachments', mainDocument);
      }
      
      // Append all supporting documents under the correct field name
      supportingDocuments.forEach((doc) => {
        formData.append('other_drawing_and_design_attachments', doc);
      });
      
      // Keep existing values for other fields
      formData.append('remove_drawing_and_design_attachments_id', "");
      formData.append('remove_other_drawing_and_design_attachments_id', "");
      formData.append('assign_to_user', drawingDetails.assign_to_user || "");
      formData.append('discipline', drawingDetails.discipline || "");
      formData.append('block', drawingDetails.block || "");
      formData.append('drawing_number', drawingDetails.drawing_number || "");
      formData.append('auto_drawing_number', "");
      formData.append('name_of_drawing', drawingDetails.name_of_drawing || "");
      formData.append('drawing_category', drawingDetails.drawing_category || "");
      formData.append('type_of_approval', drawingDetails.type_of_approval || "");
      formData.append('approval_status', drawingDetails.approval_status || "submitted");
      
      // Call the updateDrawing mutation with drawingId and formData
      const response = await updateDrawing({ 
        drawingId: drawingDetails.id, 
        formData 
      }).unwrap();
      
      setSuccessMessage('Documents uploaded successfully!');
      setShowSuccessSnackbar(true);
      
      // Close dialog after small delay
      setTimeout(() => {
        handleDialogClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error uploading documents:', err);
      setError('Failed to upload documents. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setMainDocument(null);
    setSupportingDocuments([]);
    setError('');
    setSuccessMessage('');
    handleClose();
  };

  const handleSnackbarClose = () => {
    setShowSuccessSnackbar(false);
  };

  // Handle preview document
  const handlePreviewDocument = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setPreviewFileName(file.name);
    setPreviewOpen(true);
  };

  // Close preview modal
  const handlePreviewClose = () => {
    setPreviewOpen(false);
    // Revoke the object URL to free memory
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white', fontWeight: 'bold' }}>
          Upload Drawing Documents
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Drawing Details:
            </Typography>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2"><strong>Drawing Number:</strong> {drawingDetails?.drawing_number}</Typography>
              <Typography variant="body2"><strong>Name:</strong> {drawingDetails?.name_of_drawing}</Typography>
              <Typography variant="body2"><strong>Discipline:</strong> {drawingDetails?.discipline}</Typography>
              <Typography variant="body2"><strong>Block:</strong> {drawingDetails?.block}</Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Main Document Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#29346B' }}>
              Main Document (Required)
            </Typography>
            
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                bgcolor: '#f9f9f9'
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ bgcolor: '#FACC15', color: '#29346B', '&:hover': { bgcolor: '#e5b812' } }}
              >
                Select PDF File
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={handleMainDocumentChange}
                  accept="application/pdf"
                />
              </Button>
              
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Accepts PDF files only
              </Typography>
              
              {mainDocument && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: '#e8f4f8', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between' 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#29346B' }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {mainDocument.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', minWidth: 'fit-content' }}>
                    <Tooltip title="Preview Document">
                      <IconButton 
                        color="primary" 
                        onClick={() => handlePreviewDocument(mainDocument)}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Document">
                      <IconButton 
                        color="error"
                        onClick={handleRemoveMainDocument}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Supporting Documents Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#29346B' }}>
              Supporting Documents (Optional)
            </Typography>
            
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                bgcolor: '#f9f9f9'
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ bgcolor: '#29346B', '&:hover': { bgcolor: '#1e2756' } }}
              >
                Select PDF Files
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={handleSupportingDocumentsChange}
                  accept="application/pdf"
                  multiple
                />
              </Button>
              
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                You can select multiple PDF files
              </Typography>
              
              {supportingDocuments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'left' }}>
                    Selected files ({supportingDocuments.length}):
                  </Typography>
                  {supportingDocuments.map((doc, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 2, 
                        mb: 1,
                        bgcolor: '#e8f4f8', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
                        <DescriptionIcon sx={{ mr: 1, color: '#29346B' }} />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {doc.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', minWidth: 'fit-content' }}>
                        <Tooltip title="Preview Document">
                          <IconButton 
                            color="primary" 
                            onClick={() => handlePreviewDocument(doc)}
                            sx={{ mr: 1 }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Document">
                          <IconButton 
                            color="error"
                            onClick={() => handleRemoveSupportingDocument(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDialogClose}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading || !mainDocument}
            sx={{ bgcolor: '#29346B', '&:hover': { bgcolor: '#1e2756' } }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload Documents'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* PDF Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handlePreviewClose}
        aria-labelledby="pdf-preview-modal"
        aria-describedby="modal-to-preview-pdf-documents"
      >
        <Paper sx={previewModalStyle}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: '#29346B',
            color: 'white',
            borderRadius: '4px 4px 0 0'
          }}>
            <Typography variant="h6" component="h2">
              {previewFileName}
            </Typography>
            <IconButton
              onClick={handlePreviewClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ flexGrow: 1, height: 'calc(100% - 64px)', overflow: 'hidden' }}>
            <iframe
              src={`${previewUrl}#toolbar=0`}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
        </Paper>
      </Modal>
      
      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DrawingDocumentUploadDialog;