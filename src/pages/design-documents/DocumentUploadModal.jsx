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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
// import { useUploadDrawingDocumentsMutation } from '../../api/masterdesign/masterDesign';

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

const DrawingDocumentUploadDialog = ({ open, handleClose, drawingDetails }) => {
  const [mainDocument, setMainDocument] = useState(null);
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  
  // Replace with actual mutation when backend is ready
//   const [uploadDocuments, { isLoading }] = useUploadDrawingDocumentsMutation || [() => {}, { isLoading: false }];
const isLoading = false;

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

    // This is just a placeholder for when the backend is ready
    try {
      const formData = new FormData();
      formData.append('main_document', mainDocument);
      formData.append('drawing_id', drawingDetails.id);
      
      // Append all supporting documents
      supportingDocuments.forEach((doc, index) => {
        formData.append(`supporting_document_${index}`, doc);
      });
      
      // Uncomment when backend is ready
      /* 
      const response = await uploadDocuments(formData).unwrap();
      
      if (response.status === true) {
        setSuccessMessage(response.message || 'Documents uploaded successfully!');
        setShowSuccessSnackbar(true);
        
        // Close dialog after small delay
        setTimeout(() => {
          handleDialogClose();
        }, 1500);
      } else {
        setError(response.message || 'Failed to upload documents. Please try again.');
      }
      */

      // Temporary success message for demonstration
      setSuccessMessage('Documents uploaded successfully! (Backend implementation pending)');
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#29346B' }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {mainDocument.name}
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    startIcon={<DeleteIcon />} 
                    color="error"
                    onClick={handleRemoveMainDocument}
                  >
                    Remove
                  </Button>
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon sx={{ mr: 1, color: '#29346B' }} />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {doc.name}
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        startIcon={<DeleteIcon />} 
                        color="error"
                        onClick={() => handleRemoveSupportingDocument(index)}
                      >
                        Remove
                      </Button>
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