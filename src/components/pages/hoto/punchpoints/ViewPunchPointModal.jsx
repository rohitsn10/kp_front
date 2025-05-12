import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LoopIcon from '@mui/icons-material/Loop';

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon;
  
  const statusLower = status.toLowerCase();
  
  switch(statusLower) {
    case 'completed':
      bgColor = 'success.light';
      textColor = 'success.dark';
      icon = <CheckCircleIcon fontSize="small" />;
      break;
    case 'pending':
    case 'not started':
    case 'not_started':
      bgColor = 'error.light';
      textColor = 'error.dark';
      icon = <ErrorIcon fontSize="small" />;
      break;
    case 'in progress':
    case 'in_progress':
      bgColor = 'warning.light';
      textColor = 'warning.dark';
      icon = <LoopIcon fontSize="small" />;
      break;
    case 'rejected':
      bgColor = 'orange';
      textColor = 'black';
      icon = <ErrorIcon fontSize="small" />;
      break;
    default:
      bgColor = 'grey.200';
      textColor = 'grey.700';
      icon = null;
  }
  
  return (
    <Chip 
      icon={icon}
      label={status} 
      sx={{ 
        backgroundColor: bgColor, 
        color: textColor,
        '& .MuiChip-icon': {
          color: textColor
        }
      }} 
    />
  );
};

// Format date helper
const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ViewPunchPointModal = ({ open, handleClose, punchPointData }) => {
  if (!punchPointData) return null;

  // Function to extract filename from path
  const getFileName = (filePath) => {
    if (!filePath) return 'N/A';
    return filePath.split('/').pop();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#29346B', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        py: 2
      }}>
        <Typography variant="h6" component="div">
          Punch Point Details
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {punchPointData.punch_title}
                </Typography>
                <StatusBadge status={punchPointData.status} />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-word' }}>
                {punchPointData.punch_description || 'No description provided'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Points Raised
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {punchPointData.punch_point_raised || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Balance Points
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      color={parseInt(punchPointData.punch_point_balance) > 0 ? 'warning.main' : 'success.main'}
                    >
                      {punchPointData.punch_point_balance || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" color="primary" gutterBottom>
            Attached Files
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {punchPointData.punch_file && punchPointData.punch_file.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper' }}>
              {punchPointData.punch_file.map((file) => (
                <ListItem key={file.id} sx={{ py: 1, px: 2, border: '1px solid', borderColor: 'divider', borderRadius: '4px', mb: 1 }}>
                  <ListItemIcon>
                    <AttachFileIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={getFileName(file.file)} 
                    secondary={`Uploaded on: ${formatDate(file.created_at)}`}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No files attached
            </Typography>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="h6" color="primary" gutterBottom>
            Additional Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Created By" 
                secondary={punchPointData.created_by_name || `User ID: ${punchPointData.created_by}`} 
              />
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <EventIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Created At" 
                secondary={formatDate(punchPointData.created_at)} 
              />
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <EventIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Last Updated" 
                secondary={formatDate(punchPointData.updated_at)} 
              />
            </ListItem>
          </List>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        <Button 
          onClick={handleClose} 
          variant="contained" 
          sx={{ 
            bgcolor: "#29346B",
            "&:hover": { bgcolor: "#1e2756" },
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: "500"
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPunchPointModal;