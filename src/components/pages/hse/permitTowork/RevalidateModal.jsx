import React, { useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  IconButton,
  Chip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Sample data for demonstration
const sampleRenewals = [
  {
    renewal_id: 1,
    renewal_date: "2025-04-20",
    day_number: 2,
    valid_from: "08:00",
    valid_to: "17:00",
    issuer: {
      name: "John Smith",
      signature: "data:image/png;base64,jkl012...",
      timestamp: "2025-04-20T08:15:00Z"
    },
    approver: {
      name: "Sarah Johnson",
      signature: "data:image/png;base64,mno345...",
      timestamp: "2025-04-20T08:30:00Z"
    },
    receiver: {
      name: "Mike Williams",
      signature: "data:image/png;base64,pqr678...",
      timestamp: "2025-04-20T08:45:00Z"
    }
  },
  {
    renewal_id: 2,
    renewal_date: "2025-04-21",
    day_number: 3,
    valid_from: "08:00",
    valid_to: "17:00",
    issuer: {
      name: "John Smith",
      signature: "data:image/png;base64,stu901...",
      timestamp: "2025-04-21T08:10:00Z"
    },
    approver: {
      name: "Sarah Johnson",
      signature: "data:image/png;base64,vwx234...",
      timestamp: "2025-04-21T08:25:00Z"
    },
    receiver: {
      name: "Mike Williams",
      signature: "data:image/png;base64,yz0567...",
      timestamp: "2025-04-21T08:40:00Z"
    }
  }
];

// Component to view signatures
const SignatureViewer = ({ name, signature, timestamp }) => {
  const [viewSignature, setViewSignature] = useState(false);
  
  const formattedTimestamp = new Date(timestamp).toLocaleString();
  
  return (
    <Box>
      <Typography variant="body2" fontWeight="bold">{name}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton 
          size="small" 
          onClick={() => setViewSignature(true)}
          color="primary"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <Typography variant="caption">{formattedTimestamp}</Typography>
      </Stack>
      
      {/* Signature Dialog */}
      <Dialog open={viewSignature} onClose={() => setViewSignature(false)}>
        <DialogTitle>{name}'s Signature</DialogTitle>
        <DialogContent>
          <img 
            src="#" // In real app, this would be the signature URL
            alt="Signature Preview" 
            style={{ width: '100%', height: 'auto' }}
          />
          <Typography variant="caption" display="block" mt={1}>
            Signed on: {formattedTimestamp}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewSignature(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const RevalidateModal = ({ open, onClose, permitId }) => {
  const [renewals, setRenewals] = useState(sampleRenewals);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [newRenewal, setNewRenewal] = useState({
    renewal_date: new Date().toISOString().split('T')[0],
    day_number: renewals.length > 0 ? renewals[renewals.length - 1].day_number + 1 : 1,
    valid_from: "08:00",
    valid_to: "17:00",
    issuer_name: "",
    issuer_signature: null,
    issuer_signature_name: "No file chosen",
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRenewal(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file upload for signature
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setNewRenewal(prev => ({
        ...prev,
        issuer_signature: e.target.files[0],
        issuer_signature_name: e.target.files[0].name
      }));
    }
  };
  
  // Add new renewal
  const handleAddRenewal = () => {
    if (!newRenewal.issuer_name || !newRenewal.issuer_signature) {
      alert("Please fill all required fields");
      return;
    }
    
    // In a real app, you would submit to API here
    // For demo purposes, we'll just update the local state
    const newRenewalObj = {
      renewal_id: renewals.length > 0 ? Math.max(...renewals.map(r => r.renewal_id)) + 1 : 1,
      renewal_date: newRenewal.renewal_date,
      day_number: newRenewal.day_number,
      valid_from: newRenewal.valid_from,
      valid_to: newRenewal.valid_to,
      issuer: {
        name: newRenewal.issuer_name,
        signature: "data:image/png;base64,dummy...", // Placeholder
        timestamp: new Date().toISOString()
      },
      // Initially, no approver or receiver
      approver: null,
      receiver: null
    };
    
    setRenewals([...renewals, newRenewalObj]);
    
    // Reset form and hide it
    setNewRenewal({
      renewal_date: new Date().toISOString().split('T')[0],
      day_number: newRenewal.day_number + 1,
      valid_from: "08:00",
      valid_to: "17:00",
      issuer_name: "",
      issuer_signature: null,
      issuer_signature_name: "No file chosen",
    });
    setShowAddForm(false);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: "bold", color: "#29346B" }}>
          Revalidate Permit
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Permit ID: {permitId}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Renewal History
          </Typography>
          
          {renewals.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No renewals have been added yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Day #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Valid Period</TableCell>
                    <TableCell>Issuer</TableCell>
                    <TableCell>Approver</TableCell>
                    <TableCell>Receiver</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renewals.map((renewal) => (
                    <TableRow key={renewal.renewal_id}>
                      <TableCell>{renewal.day_number}</TableCell>
                      <TableCell>{formatDate(renewal.renewal_date)}</TableCell>
                      <TableCell>{`${renewal.valid_from} - ${renewal.valid_to}`}</TableCell>
                      <TableCell>
                        <SignatureViewer 
                          name={renewal.issuer.name}
                          signature={renewal.issuer.signature}
                          timestamp={renewal.issuer.timestamp}
                        />
                      </TableCell>
                      <TableCell>
                        {renewal.approver ? (
                          <SignatureViewer 
                            name={renewal.approver.name}
                            signature={renewal.approver.signature}
                            timestamp={renewal.approver.timestamp}
                          />
                        ) : (
                          <Chip 
                            label="Pending" 
                            size="small" 
                            color="warning" 
                            variant="outlined" 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {renewal.receiver ? (
                          <SignatureViewer 
                            name={renewal.receiver.name}
                            signature={renewal.receiver.signature}
                            timestamp={renewal.receiver.timestamp}
                          />
                        ) : (
                          <Chip 
                            label="Pending" 
                            size="small" 
                            color="warning" 
                            variant="outlined" 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {renewal.receiver ? (
                          <Chip label="Complete" size="small" color="success" />
                        ) : renewal.approver ? (
                          <Chip label="Approved" size="small" color="info" />
                        ) : (
                          <Chip label="Issued" size="small" color="primary" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {!showAddForm ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Add New Renewal
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Renewal Date"
                  type="date"
                  name="renewal_date"
                  value={newRenewal.renewal_date}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Day Number"
                  type="number"
                  name="day_number"
                  value={newRenewal.day_number}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Valid From"
                  type="time"
                  name="valid_from"
                  value={newRenewal.valid_from}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Valid To"
                  type="time"
                  name="valid_to"
                  value={newRenewal.valid_to}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Issuer Name"
                  name="issuer_name"
                  value={newRenewal.issuer_name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Issuer Signature (File Upload)*
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    style={{
                      backgroundColor: "#FF8C00",
                      color: "white",
                      textTransform: "none",
                    }}
                  >
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                      required
                    />
                  </Button>
                  <Typography variant="body2">{newRenewal.issuer_signature_name}</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddRenewal}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                }}
              >
                Add Renewal
              </Button>
            </Box>
          </Box>
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
  );
};

export default RevalidateModal;