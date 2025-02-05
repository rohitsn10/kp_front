import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { toast } from 'react-toastify'; // Import toast for notifications
import VisibilityIcon from '@mui/icons-material/Visibility'; // For file view button icon
import { useUpdateLandBankStatusMutation } from '../../../api/sfa/sfaApi';

const AssessmentFormApproval = ({
  open,
  handleClose,
  activeItem
}) => {

  const [landBankStatus, setLandBankStatus] = useState('');
  const [approvedReportFiles, setApprovedReportFiles] = useState([]);
  const [updateLandBankStatus, { isLoading, isError }] = useUpdateLandBankStatusMutation();

  useEffect(() => {
    if (activeItem) {
      setLandBankStatus(''); // Reset the status when activeItem changes
      setApprovedReportFiles([]); // Reset the files when activeItem changes
    }
  }, [activeItem]);
  
  const handleLandBankStatusChange = (event) => {
    setLandBankStatus(event.target.value);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setApprovedReportFiles(Array.from(files)); // Convert FileList to an array
  };

  const handleSubmit = async () => {
    // Check if Land Bank Status and Files are selected
    if (!landBankStatus || approvedReportFiles.length === 0) {
      toast.error("Please select the land bank status and upload the approved report files.");
      return;
    }

    const land_sfa_data_id = activeItem.id;
    const formData = new FormData();
    formData.append('status_of_site_visit', landBankStatus);

    // Append files to FormData
    approvedReportFiles.forEach((file) => {
      formData.append('approved_report_files', file);
    });

    try {
      // Make API call to update status
      await updateLandBankStatus({ land_bank_id: land_sfa_data_id, formData });
      toast.success("SFA Status updated successfully!");
      handleClose(); // Close the modal on success
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update SFA status. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          color: "#29346B",
          fontSize: "27px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        SFA Form Approval
      </DialogTitle>
      <DialogContent>
        {/* Document List */}
        <Box mb={3}>
          <Typography variant="h6" color="primary" gutterBottom>
            Documents for Review
          </Typography>
          {activeItem?.sfa_for_transmission_line_gss_files && (
            <Box mb={2}>
              <Typography variant="subtitle1" color="secondary">
                SFA for Transmission Line GSS Files
              </Typography>
              {activeItem.sfa_for_transmission_line_gss_files.map((file, index) => (
                <Box display="flex" alignItems="center" mb={1} key={index}>
                  <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
                    {file.url.split('/').pop()} {/* Extract file name */}
                  </Typography>
                  <IconButton
                    color="primary"
                    component="a"
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {activeItem?.land_sfa_file && (
            <Box>
              <Typography variant="subtitle1" color="secondary">
                Land SFA Files
              </Typography>
              {activeItem.land_sfa_file.map((file, index) => (
                <Box display="flex" alignItems="center" mb={1} key={index}>
                  <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
                    {file.url.split('/').pop()} {/* Extract file name */}
                  </Typography>
                  <IconButton
                    color="primary"
                    component="a"
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Land Bank Status */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Land Bank Status</InputLabel>
          <Select
            value={landBankStatus}
            onChange={handleLandBankStatusChange}
            label="Land Bank Status"
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
          </Select>
        </FormControl>

        {/* Approved Report File Upload */}
        <Box mb={2}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Approved Report Files
          </Typography>
          <input
            type="file"
            name="approved_report_file"
            multiple
            onChange={handleFileChange}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading} // Disable button while loading
          sx={{
            backgroundColor: "#f6812d",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "6px 36px",
            width: "200px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#E66A1F" },
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit'} {/* Show loading text */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentFormApproval;
