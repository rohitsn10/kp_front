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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

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
            ID: #{punchPoint.id} | Project: #{punchPoint.project}
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
        {/* Status Badges */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label={punchPoint.status || 'Unknown'} 
            color={getStatusColor(punchPoint.status)}
            sx={{ fontWeight: '600', fontSize: '0.875rem' }}
          />
          {punchPoint.is_verified !== null && (
            <Chip 
              label={punchPoint.is_verified ? 'Verified by ONDM' : 'Pending Verification'} 
              color={punchPoint.is_verified ? 'success' : 'warning'}
              variant="outlined"
              size="small"
              icon={punchPoint.is_verified ? <CheckCircleIcon /> : <PendingIcon />}
            />
          )}
          {punchPoint.is_accepted !== null && (
            <Chip 
              label={punchPoint.is_accepted ? 'Accepted by Project Team' : 'Rejected by Project Team'} 
              color={punchPoint.is_accepted ? 'success' : 'error'}
              variant="outlined"
              size="small"
              icon={punchPoint.is_accepted ? <CheckCircleIcon /> : <CancelIcon />}
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

        {/* Created & Updated Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                Created By (ONDM Team)
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
                Last Updated By
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
                Last Updated Date
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {formatDate(punchPoint.updated_at)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Initial Punch Files (Raised by ONDM) */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#eeeeee' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFileIcon sx={{ color: '#29346B', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                Initial Punch Files - Raised by ONDM ({punchPoint.punch_file?.length || 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {punchPoint.punch_file && punchPoint.punch_file.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {punchPoint.punch_file.map((file, index) => (
                  <Box
                    key={file.id || index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      bgcolor: '#fafafa',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ fontWeight: '500' }}
                      >
                        {getFileName(file.file)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Uploaded: {formatDate(file.created_at)} | Status: {file.file_status}
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
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                No files attached
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Accept/Reject Section by Project Team */}
        {(punchPoint.accepted_rejected_point_files?.length > 0 || 
          punchPoint.accepted_rejected_point_descriptions?.length > 0 ||
          punchPoint.accepted_rejected_point_comments?.length > 0) && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: punchPoint.is_accepted ? '#e8f5e9' : '#ffebee',
                '&:hover': { bgcolor: punchPoint.is_accepted ? '#c8e6c9' : '#ffcdd2' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {punchPoint.is_accepted ? (
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                ) : (
                  <CancelIcon sx={{ color: '#f44336', fontSize: '1.2rem' }} />
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                  {punchPoint.is_accepted ? 'Acceptance Details' : 'Rejection Details'} by Project Team
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Comments/Timeline */}
              {punchPoint.accepted_rejected_point_comments && 
               punchPoint.accepted_rejected_point_comments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: '600', mb: 1, color: '#29346B' }}>
                    Tentative Timeline / Comments:
                  </Typography>
                  {punchPoint.accepted_rejected_point_comments.map((comment, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 1.5, 
                        bgcolor: '#f9f9f9', 
                        borderRadius: '6px',
                        mb: 1,
                        borderLeft: '3px solid #29346B'
                      }}
                    >
                      <Typography variant="body2">{comment}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Descriptions */}
              {punchPoint.accepted_rejected_point_descriptions && 
               punchPoint.accepted_rejected_point_descriptions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: '600', mb: 1, color: '#29346B' }}>
                    Descriptions:
                  </Typography>
                  {punchPoint.accepted_rejected_point_descriptions.map((desc, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 1.5, 
                        bgcolor: '#f9f9f9', 
                        borderRadius: '6px',
                        mb: 1,
                        borderLeft: '3px solid #29346B'
                      }}
                    >
                      <Typography variant="body2">{desc}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Attached Files */}
              {punchPoint.accepted_rejected_point_files && 
               punchPoint.accepted_rejected_point_files.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: '600', mb: 1, color: '#29346B' }}>
                    Attached Files ({punchPoint.accepted_rejected_point_files.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {punchPoint.accepted_rejected_point_files.map((file, index) => (
                      <Box
                        key={file.id || index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1.5,
                          bgcolor: '#fafafa',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {getFileName(file.file)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Uploaded: {formatDate(file.created_at)} | Status: {file.file_status}
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
                          }}
                        >
                          Download
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Completed Section by Project Team */}
        {(punchPoint.completed_point_files?.length > 0 || 
          punchPoint.completed_point_remarks?.length > 0) && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#e3f2fd',
                '&:hover': { bgcolor: '#bbdefb' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#2196f3', fontSize: '1.2rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                  Completion History by Project Team ({punchPoint.completed_point_remarks?.length || 0} submissions)
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Remarks */}
              {punchPoint.completed_point_remarks && 
               punchPoint.completed_point_remarks.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: '600', mb: 1, color: '#29346B' }}>
                    Completion Remarks:
                  </Typography>
                  {punchPoint.completed_point_remarks.map((remark, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 1.5, 
                        bgcolor: '#f1f8ff', 
                        borderRadius: '6px',
                        mb: 1,
                        borderLeft: '3px solid #2196f3'
                      }}
                    >
                      <Chip 
                        label={`Submission ${index + 1}`} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">{remark}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Completed Files */}
              {punchPoint.completed_point_files && 
               punchPoint.completed_point_files.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: '600', mb: 1, color: '#29346B' }}>
                    Completion Attachments ({punchPoint.completed_point_files.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {punchPoint.completed_point_files.map((file, index) => (
                      <Box
                        key={file.id || index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1.5,
                          bgcolor: '#fafafa',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {getFileName(file.file)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Uploaded: {formatDate(file.created_at)} | Status: {file.file_status}
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
                          }}
                        >
                          Download
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Verification Section by ONDM Team */}
        {punchPoint.verify_point_descriptions && 
         punchPoint.verify_point_descriptions.length > 0 && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: punchPoint.is_verified ? '#e8f5e9' : '#fff3e0',
                '&:hover': { bgcolor: punchPoint.is_verified ? '#c8e6c9' : '#ffe0b2' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {punchPoint.is_verified ? (
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                ) : (
                  <PendingIcon sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#29346B' }}>
                  ONDM Team Verification
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: '600', mb: 1, color: '#29346B' }}>
                  Verification Comments:
                </Typography>
                {punchPoint.verify_point_descriptions.map((desc, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 1.5, 
                      bgcolor: '#f9f9f9', 
                      borderRadius: '6px',
                      mb: 1,
                      borderLeft: `3px solid ${punchPoint.is_verified ? '#4caf50' : '#ff9800'}`
                    }}
                  >
                    <Typography variant="body2">{desc}</Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
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
