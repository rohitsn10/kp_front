import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const CategorizationDocumentModal = ({ open, handleClose, projectId }) => {
  // Form state
  const [formData, setFormData] = useState({
    projectName: "",
    docNumber: "",
    customer: "",
    loaRef: "",
    epcContractor: "",
    governmentBody: "",
    submittedByName: ""
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would add the API call to generate the document
      // const response = await generateCategorizationDocument(projectId, formData);
      
      // Simulating API response time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      setNotification({
        open: true,
        message: "Categorization document generated successfully!",
        severity: "success"
      });
      
      // Close modal after success (optional)
      // handleClose();
    } catch (error) {
      console.error("Error generating document:", error);
      setNotification({
        open: true,
        message: "Failed to generate document. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 700,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "90vh",
    overflow: "auto"
  };

  return (
    <>
      <Modal
        open={open}
        onClose={loading ? null : handleClose}
        aria-labelledby="categorization-document-modal"
        aria-describedby="categorization-document-form"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" color="#29346B" fontWeight="bold">
              Generate Categorization Document
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="projectName"
                  variant="outlined"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Doc Number"
                  name="docNumber"
                  variant="outlined"
                  value={formData.docNumber}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer"
                  name="customer"
                  variant="outlined"
                  value={formData.customer}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LOA Reference"
                  name="loaRef"
                  variant="outlined"
                  value={formData.loaRef}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="EPC Contractor"
                  name="epcContractor"
                  variant="outlined"
                  value={formData.epcContractor}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Government Body"
                  name="governmentBody"
                  variant="outlined"
                  value={formData.governmentBody}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Submitted By"
                  name="submittedByName"
                  variant="outlined"
                  value={formData.submittedByName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
                sx={{
                  borderColor: "#29346B",
                  color: "#29346B",
                  "&:hover": {
                    borderColor: "#1e2756",
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
                sx={{
                  bgcolor: "#29346B",
                  "&:hover": { bgcolor: "#1e2756" },
                }}
              >
                {loading ? "Generating..." : "Generate Document"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategorizationDocumentModal;