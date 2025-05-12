import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Link,
  TextField,
  CircularProgress,
  Alert,
  Dialog as NestedDialog,
  DialogTitle as NestedDialogTitle,
  DialogContent as NestedDialogContent,
  DialogActions as NestedDialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useVerifyCompletedPunchPointMutation } from '../../../../api/hoto/punchPointApi';

// Import the RTK Query mutation hook
// import { useVerifyCompletedPunchPointMutation } from '../../services/api'; // Adjust path based on your project structure

const CompletedPointsModal = ({ open, handleClose, punchPointData }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedCompletedPoint, setSelectedCompletedPoint] = useState(null);
  const [verificationFormData, setVerificationFormData] = useState({
    status: 'Completed', // Default to 'Completed' (Approved)
    verify_description: ''
  });
  const [alertMessage, setAlertMessage] = useState(null);

  // Initialize the verify mutation hook
  const [verifyCompletedPunchPoint, { isLoading: isVerifying }] = useVerifyCompletedPunchPointMutation();

  if (!punchPointData) {
    return null;
  }

  // Get completed points from the punchPointData
  const completedPoints = punchPointData.completed_points || [];
  
  // Process completed points to connect with their verifications
  const processedCompletedPoints = completedPoints.map(completedPoint => {
    // Check if the completedPoint already has a verified property from the API
    const verification = completedPoint.verified ? {
      id: completedPoint.verified.id,
      verification_status: completedPoint.verified.status === "Completed" ? "Accepted" : completedPoint.verified.status,
      verified_by: completedPoint.verified.created_by,
      verified_by_name: completedPoint.verified.created_by_name || `User ID: ${completedPoint.verified.created_by}`,
      verified_at: completedPoint.verified.created_at,
      rejection_reason: completedPoint.verified.verify_description
    } : null;
    
    // Get the filename from the first file in the punch_file array if it exists
    return {
      ...completedPoint,
      verification,
      // Process the punch_file array to match the completion_files structure
      completion_files: completedPoint.punch_file ? completedPoint.punch_file.map(file => ({
        id: file.id,
        file_url: file.file,
        uploaded_at: file.created_at
      })) : []
    };
  });
  
  // Filter completed points based on selected tab
  const getFilteredPoints = () => {
    if (tabValue === 0) {
      return processedCompletedPoints;
    } else if (tabValue === 1) {
      return processedCompletedPoints.filter(point => 
        point.verification && point.verification.verification_status === 'Accepted'
      );
    } else if (tabValue === 2) {
      return processedCompletedPoints.filter(point => 
        point.verification && point.verification.verification_status === 'Rejected'
      );
    } else {
      return processedCompletedPoints.filter(point => 
        !point.verification || point.verification.verification_status === 'Pending'
      );
    }
  };

  const filteredPoints = getFilteredPoints();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file icon based on file extension
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <InsertDriveFileIcon />;
    
    const extension = fileUrl.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <ImageIcon />;
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'doc':
      case 'docx':
      case 'txt':
        return <DescriptionIcon />;
      case 'xls':
      case 'xlsx':
        return <InsertDriveFileIcon color="success" />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  // Get file name from URL
  const getFileName = (fileUrl) => {
    if (!fileUrl) return 'Unknown File';
    return fileUrl.split('/').pop();
  };

  // Get status chip
  const getStatusChip = (status) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Accepted" 
            size="small"
            color="success"
          />
        );
      case 'rejected':
        return (
          <Chip 
            icon={<CancelIcon />} 
            label="Rejected" 
            size="small"
            color="error"
          />
        );
      default:
        return (
          <Chip 
            icon={<PendingIcon />} 
            label="Pending" 
            size="small"
            color="warning"
          />
        );
    }
  };

  // Check if a point can be verified
  const canVerifyPoint = (point) => {
    // If no verification exists, it can be verified
    if (!point.verification) return true;
    
    // If verification exists, check if it's not already in a final state
    const status = point.verification.verification_status.toLowerCase();
    return status !== 'accepted' && status !== 'rejected' && status !== 'completed';
  };

  // Handle expand/collapse
  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open verification dialog
  const handleOpenVerifyDialog = (point) => {
    setSelectedCompletedPoint(point);
    setVerificationFormData({
      status: 'Completed', // Default to 'Completed' (Approved)
      verify_description: ''
    });
    setVerifyDialogOpen(true);
  };

  // Close verification dialog
  const handleCloseVerifyDialog = () => {
    setVerifyDialogOpen(false);
    setSelectedCompletedPoint(null);
  };

  // Handle verification form change
  const handleVerificationFormChange = (e) => {
    const { name, value } = e.target;
    setVerificationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit verification
  const handleSubmitVerification = async () => {
    if (!selectedCompletedPoint) return;
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('verify_description', verificationFormData.verify_description);
      formData.append('status', verificationFormData.status);
      
      // Call the mutation
      await verifyCompletedPunchPoint({
        id: selectedCompletedPoint.id,
        formData
      }).unwrap();
      
      // Show success message
      setAlertMessage({
        type: 'success',
        message: `Successfully ${verificationFormData.status === 'Completed' ? 'approved' : 'rejected'} the completion request`
      });
      
      // Close the dialog
      handleCloseVerifyDialog();
      
      // You might want to refetch the data here or handle optimistic updates
      
    } catch (error) {
      // Show error message
      setAlertMessage({
        type: 'error',
        message: error.data?.message || 'Failed to verify completion request'
      });
    }
  };

  // Calculate accepted points total
  const acceptedPointsTotal = processedCompletedPoints
    .filter(p => p.verification && 
      (p.verification.verification_status === 'Accepted' || p.verification.verification_status === 'Completed'))
    .reduce((sum, point) => sum + parseInt(point.punch_point_completed || 0, 10), 0);

  // Count points by status
  const acceptedPointsCount = processedCompletedPoints.filter(p => 
    p.verification && 
    (p.verification.verification_status === 'Accepted' || p.verification.verification_status === 'Completed')
  ).length;
  
  const rejectedPointsCount = processedCompletedPoints.filter(p => 
    p.verification && p.verification.verification_status === 'Rejected'
  ).length;
  
  const pendingPointsCount = processedCompletedPoints.filter(p => 
    !p.verification || 
    (p.verification.verification_status !== 'Accepted' && 
     p.verification.verification_status !== 'Rejected' && 
     p.verification.verification_status !== 'Completed')
  ).length;

  // Extract the punch file name
  const punchFileName = punchPointData.punch_file && punchPointData.punch_file.length > 0
    ? getFileName(punchPointData.punch_file[0].file)
    : 'N/A';

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Typography variant="h6" component="div" color="#29346B">
          Completed Points History
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Alert Messages */}
        {alertMessage && (
          <Alert 
            severity={alertMessage.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlertMessage(null)}
          >
            {alertMessage.message}
          </Alert>
        )}

        {/* Punch Point Info */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            {punchPointData.punch_title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {punchPointData.punch_description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Points Raised:</strong> {punchPointData.punch_point_raised}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Balance Points:</strong> {punchPointData.punch_point_balance || 
                  (parseInt(punchPointData.punch_point_raised) - acceptedPointsTotal)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Current Status:</strong> {punchPointData.status}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Filter Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={`All (${processedCompletedPoints.length})`} />
            <Tab label={`Accepted (${acceptedPointsCount})`} />
            <Tab label={`Rejected (${rejectedPointsCount})`} />
            <Tab label={`Pending (${pendingPointsCount})`} />
          </Tabs>
        </Paper>

        {/* Completed Points List */}
        {filteredPoints.length > 0 ? (
          <Box>
            {filteredPoints.map((point) => (
              <Card 
                key={point.id} 
                variant="outlined" 
                sx={{ mb: 2, borderColor: 
                  point.verification && 
                  (point.verification.verification_status === 'Accepted' || 
                   point.verification.verification_status === 'Completed') ? '#10B981' :
                  point.verification && point.verification.verification_status === 'Rejected' ? '#EF4444' : 
                  '#F59E0B'
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="subtitle2" gutterBottom>
                        {point.punch_point_completed} Points Completed
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {point.punch_description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {getStatusChip(point.verification ? point.verification.verification_status : 'Pending')}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Created: {formatDate(point.created_at)}
                      </Typography>
                      
                      {/* Verify Action Button - Only show for items that can be verified */}
                      {canVerifyPoint(point) && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VerifiedUserIcon />}
                          onClick={() => handleOpenVerifyDialog(point)}
                          sx={{ 
                            mt: 1,
                            borderColor: '#29346B',
                            color: '#29346B',
                            '&:hover': { borderColor: '#1e2756', backgroundColor: '#f0f0f0' }
                          }}
                        >
                          Verify
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        fontSize: '0.875rem',
                        bgcolor: '#29346B',
                        mr: 1
                      }}
                    >
                      {point.created_by_name ? point.created_by_name.charAt(0) : 
                       point.created_by ? point.created_by.toString().charAt(0) : '?'}
                    </Avatar>
                    <Typography variant="body2">
                      {point.created_by_name || `User ID: ${point.created_by}`}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => handleExpandClick(point.id)}
                    endIcon={expandedId === point.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ color: '#475569' }}
                  >
                    {expandedId === point.id ? 'Show Less' : 'Show Details'}
                  </Button>
                </CardActions>
                
                <Collapse in={expandedId === point.id} timeout="auto" unmountOnExit>
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Completion Files */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Attached Files
                        </Typography>
                        {point.punch_file && point.punch_file.length > 0 ? (
                          <List dense>
                            {point.punch_file.map((file) => (
                              <ListItem 
                                key={file.id}
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    component="a"
                                    href={file.file}
                                    target="_blank"
                                    download
                                  >
                                    <FileDownloadIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemIcon>
                                  {getFileIcon(file.file)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={getFileName(file.file)}
                                  secondary={`Uploaded: ${formatDate(file.created_at)}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No files attached
                          </Typography>
                        )}
                      </Grid>

                      {/* Verification Details */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Verification Details
                        </Typography>
                        {point.verification ? (
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <VerifiedUserIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Verification Status"
                                secondary={point.verification.verification_status || 'Pending'}
                              />
                            </ListItem>
                            {point.verification.rejection_reason && (
                              <ListItem>
                                <ListItemIcon>
                                  {point.verification.verification_status === 'Accepted' || 
                                   point.verification.verification_status === 'Completed' ? 
                                    <CheckCircleIcon /> : <CancelIcon />}
                                </ListItemIcon>
                                <ListItemText
                                  primary="Verification Comments"
                                  secondary={point.verification.rejection_reason}
                                />
                              </ListItem>
                            )}
                            {point.verification.verified_by_name && (
                              <ListItem>
                                <ListItemIcon>
                                  <PersonIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Verified By"
                                  secondary={point.verification.verified_by_name}
                                />
                              </ListItem>
                            )}
                            {point.verification.verified_at && (
                              <ListItem>
                                <ListItemIcon>
                                  <CalendarTodayIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Verified At"
                                  secondary={formatDate(point.verification.verified_at)}
                                />
                              </ListItem>
                            )}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No verification data available
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </Box>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f9fafb' }}>
            <Typography variant="body1" color="text.secondary">
              No completed points found in this category
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>

      {/* Verification Dialog */}
      <NestedDialog open={verifyDialogOpen} onClose={!isVerifying ? handleCloseVerifyDialog : undefined} maxWidth="sm" fullWidth>
        <NestedDialogTitle sx={{ bgcolor: '#f8fafc' }}>
          <Typography variant="h6" component="div" color="#29346B">
            Verify Completion
          </Typography>
        </NestedDialogTitle>
        
        <NestedDialogContent dividers>
          {selectedCompletedPoint && (
            <>
              <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Completion Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Points Completed:</strong> {selectedCompletedPoint.punch_point_completed}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {selectedCompletedPoint.punch_description}
                </Typography>
                <Typography variant="body2">
                  <strong>Submitted By:</strong> {selectedCompletedPoint.created_by_name || `User ID: ${selectedCompletedPoint.created_by}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Verification Status</FormLabel>
                <RadioGroup
                  name="status"
                  value={verificationFormData.status}
                  onChange={handleVerificationFormChange}
                  row
                >
                  <FormControlLabel 
                    value="Completed" 
                    control={<Radio />} 
                    label={
                      <Box display="flex" alignItems="center">
                        <ThumbUpIcon color="success" sx={{ mr: 0.5 }} fontSize="small" />
                        Approve
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="Rejected" 
                    control={<Radio />} 
                    label={
                      <Box display="flex" alignItems="center">
                        <ThumbDownIcon color="error" sx={{ mr: 0.5 }} fontSize="small" />
                        Reject
                      </Box>
                    } 
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                name="verify_description"
                label="Verification Comments"
                value={verificationFormData.verify_description}
                onChange={handleVerificationFormChange}
                multiline
                rows={3}
                placeholder={
                  verificationFormData.status === 'Completed' 
                    ? "Add any comments about the approval" 
                    : "Please provide a reason for rejection"
                }
                variant="outlined"
                required={verificationFormData.status === 'Rejected'}
                helperText={
                  verificationFormData.status === 'Rejected' 
                    ? "Reason is required when rejecting" 
                    : "Optional comments"
                }
              />
            </>
          )}
        </NestedDialogContent>
        
        <NestedDialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseVerifyDialog} 
            variant="outlined"
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitVerification}
            variant="contained"
            color={verificationFormData.status === 'Completed' ? 'success' : 'error'}
            startIcon={verificationFormData.status === 'Completed' ? <CheckCircleIcon /> : <CancelIcon />}
            disabled={
              isVerifying || 
              (verificationFormData.status === 'Rejected' && !verificationFormData.verify_description)
            }
          >
            {isVerifying ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              verificationFormData.status === 'Completed' ? 'Approve' : 'Reject'
            )}
          </Button>
        </NestedDialogActions>
      </NestedDialog>
    </Dialog>
  );
};

export default CompletedPointsModal;