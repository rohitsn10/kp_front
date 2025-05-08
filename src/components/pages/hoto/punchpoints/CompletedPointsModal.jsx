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

const CompletedPointsModal = ({ open, handleClose, punchPointData }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  if (!punchPointData) {
    return null;
  }

  // Get completed points
  const completedPoints = punchPointData.completed_points || [];
  
  // Filter completed points based on selected tab
  const getFilteredPoints = () => {
    if (tabValue === 0) {
      return completedPoints;
    } else if (tabValue === 1) {
      return completedPoints.filter(point => 
        point.verification && point.verification.verification_status === 'Accepted'
      );
    } else if (tabValue === 2) {
      return completedPoints.filter(point => 
        point.verification && point.verification.verification_status === 'Rejected'
      );
    } else {
      return completedPoints.filter(point => 
        !point.verification || !point.verification.verification_status
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

  // Get file icon based on file type
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
      default:
        return <InsertDriveFileIcon />;
    }
  };

  // Get status chip
  const getStatusChip = (status) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'accepted':
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

  // Handle expand/collapse
  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
                <strong>Balance Points:</strong> {punchPointData.punch_point_balance}
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
            <Tab label={`All (${completedPoints.length})`} />
            <Tab 
              label={`Accepted (${completedPoints.filter(p => 
                p.verification && p.verification.verification_status === 'Accepted'
              ).length})`} 
            />
            <Tab 
              label={`Rejected (${completedPoints.filter(p => 
                p.verification && p.verification.verification_status === 'Rejected'
              ).length})`} 
            />
            <Tab 
              label={`Pending (${completedPoints.filter(p => 
                !p.verification || !p.verification.verification_status
              ).length})`} 
            />
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
                  point.verification && point.verification.verification_status === 'Accepted' ? '#10B981' :
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
                      {point.verification && (
                        getStatusChip(point.verification.verification_status)
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Created: {formatDate(point.created_at)}
                      </Typography>
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
                      {point.created_by_name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {point.created_by_name}
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
                        {point.completion_files && point.completion_files.length > 0 ? (
                          <List dense>
                            {point.completion_files.map((file) => (
                              <ListItem 
                                key={file.id}
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    component="a"
                                    href={file.file_url}
                                    target="_blank"
                                    download
                                  >
                                    <FileDownloadIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemIcon>
                                  {getFileIcon(file.file_url)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={`File #${file.id}`}
                                  secondary={`Uploaded: ${formatDate(file.uploaded_at)}`}
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
                                  <CancelIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Rejection Reason"
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
        {/* <Button 
          variant="contained" 
          sx={{ 
            bgcolor: '#29346B', 
            '&:hover': { bgcolor: '#1e2756' } 
          }}
        >
          Print Report
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default CompletedPointsModal;