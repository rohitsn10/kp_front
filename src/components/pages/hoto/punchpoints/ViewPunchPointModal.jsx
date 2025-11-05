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
  Divider,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function ViewPunchPointModal({ open, handleClose, punchPoint }) {
  
  // Format date
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'completed':
      case 'closed':
        return 'success';
      case 'open':
      case 'pending':
        return 'warning';
      case 'in progress':
      case 'in_progress':
        return 'info';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Download file
  const handleDownloadFile = (fileUrl) => {
    window.open(import.meta.env.VITE_API_KEY.replace('/api/', '') + fileUrl, '_blank');
  };

  // Get file name from URL
  const getFileName = (fileUrl) => {
    if (!fileUrl) return 'Unknown file';
    const parts = fileUrl.split('/');
    return parts[parts.length - 1];
  };

  if (!punchPoint) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#29346B', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2
      }}>
        <Box>
          <Typography variant="h6" component="div">
            Punch Point Details
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            ID: #{punchPoint.id}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Status Badge */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label={punchPoint.status || 'Unknown'} 
            color={getStatusColor(punchPoint.status)}
            sx={{ fontWeight: '600', fontSize: '0.875rem' }}
          />
          {punchPoint.is_verified !== null && (
            <Chip 
              label={punchPoint.is_verified ? 'Verified' : 'Not Verified'} 
              color={punchPoint.is_verified ? 'success' : 'default'}
              variant="outlined"
              size="small"
            />
          )}
          {punchPoint.is_accepted !== null && (
            <Chip 
              label={punchPoint.is_accepted ? 'Accepted' : 'Rejected'} 
              color={punchPoint.is_accepted ? 'success' : 'error'}
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="textSecondary" sx={{ fontWeight: '600' }}>
            Punch Title
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.5, color: '#29346B', fontWeight: '600' }}>
            {punchPoint.punch_title}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DescriptionIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
              Description
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ pl: 4, color: 'text.secondary' }}>
            {punchPoint.punch_description || 'No description provided'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Created By & Date Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                Created By
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {punchPoint.created_by_name || `User ${punchPoint.created_by}`}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarTodayIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                Created Date
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {formatDate(punchPoint.created_at)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                Updated By
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {punchPoint.updated_by_name || `User ${punchPoint.updated_by}`}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarTodayIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                Updated Date
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {formatDate(punchPoint.updated_at)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Attached Files */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AttachFileIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
              Attached Files ({punchPoint.punch_file?.length || 0})
            </Typography>
          </Box>
          
          {punchPoint.punch_file && punchPoint.punch_file.length > 0 ? (
            <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {punchPoint.punch_file.map((file, index) => (
                <Box
                  key={file.id || index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: '#f5f5f5',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      bgcolor: '#eeeeee'
                    }
                  }}
                >
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontWeight: '500'
                      }}
                    >
                      {getFileName(file.file)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Uploaded: {formatDate(file.created_at)}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadFile(file.file)}
                    sx={{
                      ml: 2,
                      borderColor: '#29346B',
                      color: '#29346B',
                      '&:hover': {
                        borderColor: '#1e2756',
                        bgcolor: '#f0f0f0'
                      }
                    }}
                  >
                    Download
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ pl: 4, fontStyle: 'italic' }}>
              No files attached
            </Typography>
          )}
        </Box>

        {/* Accepted/Rejected Points */}
        {punchPoint.accepted_rejected_points && punchPoint.accepted_rejected_points.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B', mb: 2 }}>
                Accept/Reject History
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {punchPoint.accepted_rejected_points.map((point, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      bgcolor: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Typography variant="body2">
                      {/* Display accept/reject history details here */}
                      History item {index + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: '#29346B',
            '&:hover': {
              bgcolor: '#1e2756'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewPunchPointModal;
