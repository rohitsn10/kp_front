import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";

// Import the other modals
import ApprovePermitModal from "./ApprovePermitModal";
import ReceiverPermitModal from "./ReceiverPermitModal";
import { useGetIssuerPermitQuery, useIssuerApprovePermitMutation } from "../../../../api/hse/permitTowork/permitToworkApi";
import { AuthContext } from "../../../../context/AuthContext"; // Update path as needed

// PDF Download Component
const PDFDownloader = ({ src, alt, label = "Download PDF" }) => {
  const handleDownload = async () => {
    try {
      const fullUrl = `${import.meta.env.VITE_API_KEY}${src}`;
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        toast.error("Failed to download PDF");
        return;
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from src or use a default name
      const filename = src.split('/').pop() || `${alt.replace(/\s+/g, '_')}.pdf`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <Tooltip title={label}>
      <IconButton 
        onClick={handleDownload}
        size="small"
        sx={{ 
          color: "#d32f2f",
          "&:hover": {
            backgroundColor: "rgba(211, 47, 47, 0.04)"
          }
        }}
      >
        <DownloadIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

const RevalidateModal = ({ open, onClose, permitId }) => {
  const { user } = useContext(AuthContext);
  
  // Add state for controlling the nested modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [receiverModalOpen, setReceiverModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // API hooks
  const { data: permitData, isLoading: isLoadingGet, refetch } = useGetIssuerPermitQuery(
    permitId, 
    { skip: !open || !permitId }
  );
  const [issuerApprovePermit, { isLoading: isLoadingIssue }] = useIssuerApprovePermitMutation();
  
  // State management
  const [organizedDays, setOrganizedDays] = useState([]);
  const [nextDayNumber, setNextDayNumber] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [canAddNewPtw, setCanAddNewPtw] = useState(true);
  const [pendingPtwExists, setPendingPtwExists] = useState(false);
  
  // Form state - Updated for PDF upload
  const [issuerForm, setIssuerForm] = useState({
    renewal_date: new Date().toISOString().split('T')[0],
    day_number: "1",
    start_time: "08:00",
    end_time: "17:00",
    issuer_name: "",
    issuer_sign: null,
    pdfFileName: "",
    pdfFileSize: 0
  });

  // Auto-populate issuer name when modal opens or user context changes
  useEffect(() => {
    if (user?.name && open) {
      setIssuerForm(prev => ({ ...prev, issuer_name: user.name }));
    }
  }, [user, open]);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Reset modal states when the main modal closes
  useEffect(() => {
    if (!open) {
      setApproveModalOpen(false);
      setReceiverModalOpen(false);
      setSelectedDay(null);
    }
  }, [open]);

  // Refetch when the modal opens
  useEffect(() => {
    if (open && permitId) {
      refetch();
    }
  }, [open, permitId, refetch]);

  // Organize data when it changes
  useEffect(() => {
    if (permitData) {
      organizePermitData();
    }
  }, [permitData]);

  // Organize the permit data into a structured format
  const organizePermitData = () => {
    if (!permitData || !permitData.data) return;
    
    const days = [];
    let maxDayNumber = 0;
    let lastDayStatus = null;
    let hasPendingPtw = false;
    
    // Sort day keys for proper ordering
    const dayKeys = Object.keys(permitData.data).sort((a, b) => {
      const aMatch = a.match(/day(\d+)(?:\.(\d+))?/);
      const bMatch = b.match(/day(\d+)(?:\.(\d+))?/);
      
      if (!aMatch || !bMatch) return 0;
      
      const aDay = parseInt(aMatch[1]);
      const bDay = parseInt(bMatch[1]);
      
      if (aDay !== bDay) return aDay - bDay;
      
      const aSubDay = aMatch[2] ? parseInt(aMatch[2]) : 0;
      const bSubDay = bMatch[2] ? parseInt(bMatch[2]) : 0;
      
      return aSubDay - bSubDay;
    });
    
    dayKeys.forEach(dayKey => {
      const dayData = permitData.data[dayKey];
      
      // Find entries for each role
      const issuerEntry = dayData.find(item => item.type === "issuer");
      const approverEntries = dayData.filter(item => item.type === "approver");
      const receiverEntry = dayData.find(item => item.type === "receiver");
      
      // Get the most recent approver (in case there are multiple)
      const approverEntry = approverEntries.length > 0 
        ? approverEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        : null;
      
      // Extract day number from the key
      const dayMatch = dayKey.match(/day(\d+)(?:\.(\d+))?/);
      if (dayMatch) {
        const dayNumber = parseInt(dayMatch[1]);
        if (dayNumber > maxDayNumber) {
          maxDayNumber = dayNumber;
        }
        
        // Determine status - FIX: Correct status determination logic
        let status;
        if (receiverEntry) {
          status = "complete";
        } else if (approverEntry) {
          // Check approval status properly - convert to lowercase for case-insensitive comparison
          status = approverEntry.approver_status.toLowerCase() === "approved" ? "approved" : "rejected";
        } else if (issuerEntry) {
          status = "issued";
          hasPendingPtw = true; // There's a PTW that's issued but not fully processed
        } else {
          status = "pending";
        }
        
        // If a PTW is approved but not received, it's still in progress
        if (status === "approved" && !receiverEntry) {
          hasPendingPtw = true;
        }
        
        // Save status of the last day
        if (dayNumber === maxDayNumber) {
          lastDayStatus = status;
        }
        
        days.push({
          dayKey,
          dayNumber: dayMatch[1] + (dayMatch[2] ? `.${dayMatch[2]}` : ""),
          issuer: issuerEntry,
          approver: approverEntry,
          approverEntries, // Store all approver entries
          receiver: receiverEntry,
          status
        });
      }
    });
    
    setOrganizedDays(days);
    setPendingPtwExists(hasPendingPtw);
    
    // Determine if we can add a new PTW based on the pending state
    // Can add new PTW if no pending PTWs exist or if the last PTW was rejected or complete
    setCanAddNewPtw(!hasPendingPtw || lastDayStatus === "rejected" || lastDayStatus === "complete");
    
    // Determine next day number based on last day status
    if (maxDayNumber > 0) {
      if (lastDayStatus === "complete" || lastDayStatus === "approved") {
        setNextDayNumber(maxDayNumber + 1);
        setIssuerForm(prev => ({ ...prev, day_number: (maxDayNumber + 1).toString() }));
      } else if (lastDayStatus === "rejected") {
        // For rejected permits, use same day number with incremented decimal
        const lastDayInfo = days[days.length - 1].dayKey.match(/day(\d+)(?:\.(\d+))?/);
        if (lastDayInfo) {
          const subDay = lastDayInfo[2] ? parseInt(lastDayInfo[2]) + 1 : 1;
          const newDayNumberWithSubday = `${maxDayNumber}.${subDay}`;
          setNextDayNumber(maxDayNumber);
          setIssuerForm(prev => ({ ...prev, day_number: newDayNumberWithSubday }));
        }
      } else {
        setNextDayNumber(maxDayNumber);
        setIssuerForm(prev => ({ ...prev, day_number: maxDayNumber.toString() }));
      }
    } else {
      setNextDayNumber(1);
      setIssuerForm(prev => ({ ...prev, day_number: "1" }));
    }
  };

  // Form input handlers
  const handleIssuerFormChange = (e) => {
    const { name, value } = e.target;
    setIssuerForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle PDF upload with validation
  const handleIssuerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's a PDF file
      if (file.type !== 'application/pdf') {
        toast.error("Please upload only PDF files!");
        return;
      }
      
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        toast.error(`File size too large! Please upload a PDF smaller than 20MB. Current size: ${formatFileSize(file.size)}`);
        return;
      }
      
      // If validation passes, set the file
      setIssuerForm(prev => ({
        ...prev,
        issuer_sign: file,
        pdfFileName: file.name,
        pdfFileSize: file.size
      }));
      toast.success(`PDF uploaded successfully! Size: ${formatFileSize(file.size)}`);
    }
  };

  // Remove uploaded PDF
  const handleRemovePdf = () => {
    setIssuerForm(prev => ({
      ...prev,
      issuer_sign: null,
      pdfFileName: "",
      pdfFileSize: 0
    }));
  };

  // Submit a new renewal
  const handleSubmitIssuer = async () => {
    if (!issuerForm.issuer_name || !issuerForm.issuer_sign) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('renewal_date', new Date(issuerForm.renewal_date).toISOString());
      formData.append('day_number', issuerForm.day_number);
      formData.append('issuer_name', issuerForm.issuer_name);
      formData.append('issuer_sign', issuerForm.issuer_sign);
      formData.append('start_time', new Date(`2025-05-20T${issuerForm.start_time}:00`).toISOString());
      formData.append('end_time', new Date(`2025-05-20T${issuerForm.end_time}:00`).toISOString());
      
      const response = await issuerApprovePermit({
        permitId,
        formData
      });
      
      if (response.data && response.data.status) {
        toast.success("Renewal submitted successfully!");
        // Refresh data
        refetch();
        
        // Reset form
        setIssuerForm({
          renewal_date: new Date().toISOString().split('T')[0],
          day_number: (nextDayNumber + 1).toString(),
          start_time: "08:00",
          end_time: "17:00",
          issuer_name: user?.name || "",
          issuer_sign: null,
          pdfFileName: "",
          pdfFileSize: 0
        });
        
        // Hide the form
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error submitting issuer form:", error);
      toast.error("Error submitting renewal. Please try again.");
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      // Handle the case where timeString is already in HH:MM format
      return timeString;
    }
  };

  // Handle modal callbacks
  const handleCloseApproveModal = () => {
    setApproveModalOpen(false);
    refetch(); // Refresh data after approval
  };

  const handleCloseReceiverModal = () => {
    setReceiverModalOpen(false);
    refetch(); // Refresh data after adding receiver
  };

  // Open Approve Modal with the selected day
  const handleApproveClick = (day) => {
    setSelectedDay(day);
    setApproveModalOpen(true);
  };

  // Open Receiver Modal with the selected day
  const handleReceiveClick = (day) => {
    setSelectedDay(day);
    setReceiverModalOpen(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" style={{ fontWeight: "bold", color: "#29346B" }}>
            Revalidate Permit to Work
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Permit ID: {permitId}
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {isLoadingGet ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Renewal History Table */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Renewal History
                </Typography>
                
                {!permitData || !permitData.data || Object.keys(permitData.data).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                    No renewals have been added yet.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell>Day #</TableCell>
                          <TableCell>Valid Period</TableCell>
                          <TableCell>Issuer</TableCell>
                          <TableCell>Approver</TableCell>
                          <TableCell>Receiver</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {organizedDays.map((day) => (
                          <TableRow key={day.dayKey}>
                            <TableCell>{day.dayNumber}</TableCell>
                            <TableCell>
                              {day.issuer ? 
                                `${formatTime(day.issuer.start_time)} - ${formatTime(day.issuer.end_time)}` : 
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {day.issuer ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box>
                                    <Typography variant="body2">{day.issuer.issuer_name}</Typography>
                                    {day.issuer.issuer_sign && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                                        <Typography variant="caption" color="text.secondary">
                                          Signed PDF
                                        </Typography>
                                        <PDFDownloader 
                                          src={day.issuer.issuer_sign} 
                                          alt="Issuer Signature" 
                                          label="Download Issuer PDF"
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              ) : (
                                <Chip 
                                  label="Not Issued" 
                                  size="small" 
                                  color="default" 
                                  variant="outlined" 
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {day.approver ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box>
                                    <Typography variant="body2">{day.approver.approver_name}</Typography>
                                    <Typography 
                                      variant="caption" 
                                      color={day.approver.approver_status.toLowerCase() === "approved" ? "success.main" : "error.main"}
                                    >
                                      {day.approver.approver_status}
                                    </Typography>
                                    {day.approver.approver_sign && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                                        <Typography variant="caption" color="text.secondary">
                                          Signed PDF
                                        </Typography>
                                        <PDFDownloader 
                                          src={day.approver.approver_sign} 
                                          alt="Approver Signature" 
                                          label="Download Approver PDF"
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              ) : day.issuer ? (
                                <Chip 
                                  label="Pending" 
                                  size="small" 
                                  color="warning" 
                                  variant="outlined" 
                                />
                              ) : (
                                <Chip 
                                  label="Not Available" 
                                  size="small" 
                                  color="default" 
                                  variant="outlined" 
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {day.receiver ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box>
                                    <Typography variant="body2">{day.receiver.receiver_name}</Typography>
                                    {day.receiver.receiver_sign && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                                        <Typography variant="caption" color="text.secondary">
                                          Signed PDF
                                        </Typography>
                                        <PDFDownloader 
                                          src={day.receiver.receiver_sign} 
                                          alt="Receiver Signature" 
                                          label="Download Receiver PDF"
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              ) : day.approver && day.approver.approver_status.toLowerCase() === "approved" ? (
                                <Chip 
                                  label="Pending" 
                                  size="small" 
                                  color="warning" 
                                  variant="outlined" 
                                />
                              ) : (
                                <Chip 
                                  label="Not Available" 
                                  size="small" 
                                  color="default" 
                                  variant="outlined" 
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {day.status === "complete" ? (
                                <Chip label="Complete" size="small" color="success" />
                              ) : day.status === "approved" ? (
                                <Chip label="Approved" size="small" color="info" />
                              ) : day.status === "rejected" ? (
                                <Chip label="Rejected" size="small" color="error" />
                              ) : day.status === "issued" ? (
                                <Chip label="Issued" size="small" color="primary" />
                              ) : (
                                <Chip label="Pending" size="small" color="default" />
                              )}
                            </TableCell>
                            <TableCell>
                              {/* Button to trigger Approve Modal */}
                              {day.issuer && !day.approver && (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary"
                                  onClick={() => handleApproveClick(day)}
                                >
                                  Approve
                                </Button>
                              )}
                              
                              {/* Button to trigger Receive Modal */}
                              {day.approver && 
                               day.approver.approver_status.toLowerCase() === "approved" && 
                               !day.receiver && (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary"
                                  onClick={() => handleReceiveClick(day)}
                                  sx={{ ml: 1 }}
                                >
                                  Receive
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
              
              {/* Display status message if there's a pending PTW */}
              {pendingPtwExists && !canAddNewPtw && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  A permit is currently in progress. Please complete the existing workflow before adding a new renewal.
                </Alert>
              )}
              
              {/* Toggle between button and form */}
              {!showAddForm ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  {canAddNewPtw ? (
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => setShowAddForm(true)}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                      }}
                    >
                      Add New Renewal
                    </Button>
                  ) : null}
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Issue New Renewal - Day {issuerForm.day_number}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Renewal Date"
                        type="date"
                        name="renewal_date"
                        value={issuerForm.renewal_date}
                        onChange={handleIssuerFormChange}
                        fullWidth
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        disabled={isLoadingIssue}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Day Number"
                        name="day_number"
                        value={issuerForm.day_number}
                        onChange={handleIssuerFormChange}
                        fullWidth
                        required
                        margin="normal"
                        disabled={isLoadingIssue}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Valid From"
                        type="time"
                        name="start_time"
                        value={issuerForm.start_time}
                        onChange={handleIssuerFormChange}
                        fullWidth
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        disabled={isLoadingIssue}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Valid To"
                        type="time"
                        name="end_time"
                        value={issuerForm.end_time}
                        onChange={handleIssuerFormChange}
                        fullWidth
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        disabled={isLoadingIssue}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Issuer Name"
                        name="issuer_name"
                        value={issuerForm.issuer_name}
                        fullWidth
                        required
                        margin="normal"
                        disabled={true}
                        placeholder={user?.name || "Enter issuer name"}
                        helperText="This field is locked and auto-populated with your logged-in name"
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#000000',
                            opacity: 1,
                          },
                          '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '& .MuiInputLabel-root.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.6)',
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Signed PDF Document*
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        Upload a PDF document that contains digital signatures. Maximum file size: 20MB
                      </Typography>
                      
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<PictureAsPdfIcon />}
                          style={{
                            backgroundColor: "#FF8C00",
                            color: "white",
                            textTransform: "none",
                            height: "48px",
                          }}
                          disabled={isLoadingIssue}
                        >
                          Upload Signed PDF
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            hidden
                            onChange={handleIssuerFileChange}
                            required
                          />
                        </Button>
                        
                        {/* Show uploaded PDF info */}
                        {issuerForm.pdfFileName && (
                          <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 2,
                            padding: 2,
                            backgroundColor: "#f5f5f5",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0"
                          }}>
                            <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 32 }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight="medium">
                                {issuerForm.pdfFileName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Size: {formatFileSize(issuerForm.pdfFileSize)}
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={handleRemovePdf}
                              disabled={isLoadingIssue}
                            >
                              Remove
                            </Button>
                          </Box>
                        )}
                        
                        {!issuerForm.pdfFileName && (
                          <Typography variant="body2" color="text.secondary">
                            No PDF document uploaded
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowAddForm(false)}
                      disabled={isLoadingIssue}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmitIssuer}
                      disabled={isLoadingIssue}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                      }}
                    >
                      {isLoadingIssue ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Renewal"
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={onClose} 
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nested Modals - Now passing the selected day */}
      {selectedDay && (
        <>
          <ApprovePermitModal
            open={approveModalOpen}
            onClose={handleCloseApproveModal}
            permitId={permitId}
            dayInfo={selectedDay}
          />

          <ReceiverPermitModal
            open={receiverModalOpen}
            onClose={handleCloseReceiverModal}
            permitId={permitId}
            dayInfo={selectedDay}
          />
        </>
      )}
    </>
  );
};

export default RevalidateModal;