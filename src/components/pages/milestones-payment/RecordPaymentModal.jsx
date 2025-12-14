import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  InputAdornment,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAddPaymentOnMilestoneMutation } from '../../../api/milestonePayment/milestonePaymentApi';

function RecordPaymentModal({ open, handleClose, invoiceData, refetch }) {
  const [addPayment, { isLoading }] = useAddPaymentOnMilestoneMutation();
  
  const [formData, setFormData] = useState({
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    transaction_reference: '',
    notes: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Calculate payment status
  const totalAmount = parseFloat(invoiceData?.total_amount || 0);
  const totalPaid = invoiceData?.payment_history?.reduce(
    (sum, history) => sum + parseFloat(history.amount_paid || 0), 
    0
  ) || 0;
  const pendingAmount = totalAmount - totalPaid;

  useEffect(() => {
    // Auto-fill with pending amount
    if (open && pendingAmount > 0) {
      setFormData(prev => ({
        ...prev,
        amount_paid: pendingAmount.toFixed(2)
      }));
    }
  }, [open, pendingAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate each file
    const validFiles = [];
    const fileErrors = [];

    files.forEach((file) => {
      // Check file size (max 5MB per file)
      if (file.size > 5 * 1024 * 1024) {
        fileErrors.push(`${file.name} exceeds 5MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (fileErrors.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        files: fileErrors.join(', ')
      }));
    } else {
      setErrors(prev => ({ ...prev, files: '' }));
    }

    // Add valid files to existing files
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setErrors(prev => ({ ...prev, files: '' }));
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
    setErrors(prev => ({ ...prev, files: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount_paid) {
      newErrors.amount_paid = 'Payment amount is required';
    } else if (isNaN(formData.amount_paid) || parseFloat(formData.amount_paid) <= 0) {
      newErrors.amount_paid = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount_paid) > pendingAmount) {
      newErrors.amount_paid = `Amount cannot exceed pending amount of ₹${pendingAmount.toFixed(2)}`;
    }

    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }

    if (!formData.payment_method.trim()) {
      newErrors.payment_method = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) {
      return;
    }

    const paymentFormData = new FormData();
    paymentFormData.append('inflow_payment', invoiceData.id);
    paymentFormData.append('amount_paid', formData.amount_paid);
    paymentFormData.append('payment_date', formData.payment_date);
    paymentFormData.append('payment_method', formData.payment_method);
    paymentFormData.append('transaction_reference', formData.transaction_reference || '');
    paymentFormData.append('notes', formData.notes || '');
    
    // Append multiple files with the field name 'attachments'
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        paymentFormData.append('attachments', file);
      });
    }

    try {
      const result = await addPayment(paymentFormData).unwrap();
      setSubmitSuccess('Payment recorded successfully!');
      
      if (refetch) {
        refetch();
      }

      setTimeout(() => {
        resetForm();
        handleClose();
      }, 1500);
    } catch (err) {
      setSubmitError(err?.data?.message || 'Failed to record payment. Please try again.');
      console.error('Error recording payment:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      amount_paid: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      transaction_reference: '',
      notes: ''
    });
    setSelectedFiles([]);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Calculate total size of all selected files
  const totalFileSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <Dialog 
      open={open} 
      onClose={handleModalClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { borderRadius: '12px' }
      }}
    >
      <DialogTitle style={{ backgroundColor: '#29346B', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Record Payment</span>
          <IconButton onClick={handleModalClose} size="small" style={{ color: '#FFFFFF' }}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers style={{ padding: '24px' }}>
          {submitSuccess && (
            <Alert severity="success" style={{ marginBottom: '16px' }}>
              {submitSuccess}
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {submitError}
            </Alert>
          )}

          {/* Invoice Summary */}
          <Box style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Invoice Number</Typography>
                <Typography variant="body1" fontWeight="bold">{invoiceData?.invoice_number}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Party Name</Typography>
                <Typography variant="body1" fontWeight="bold">{invoiceData?.party_name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">Total Amount</Typography>
                <Typography variant="h6" color="primary">₹{totalAmount.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">Amount Paid</Typography>
                <Typography variant="h6" style={{ color: '#4CAF50' }}>₹{totalPaid.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">Pending Amount</Typography>
                <Typography variant="h6" style={{ color: '#f44336' }}>₹{pendingAmount.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Payment History */}
          {invoiceData?.payment_history && invoiceData.payment_history.length > 0 && (
            <Box style={{ marginBottom: '24px' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Payment History
              </Typography>
              <List dense style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '8px' }}>
                {invoiceData.payment_history.map((payment, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`₹${parseFloat(payment.amount_paid).toFixed(2)} - ${payment.payment_method || 'N/A'}`}
                      secondary={`Date: ${new Date(payment.payment_date).toLocaleDateString('en-IN')} | Ref: ${payment.transaction_reference || 'N/A'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Divider style={{ marginBottom: '24px' }} />

          <Typography variant="h6" gutterBottom>Record New Payment</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount to Pay"
                name="amount_paid"
                type="number"
                value={formData.amount_paid}
                onChange={handleInputChange}
                error={!!errors.amount_paid}
                helperText={errors.amount_paid}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{
                  step: '0.01',
                  min: '0',
                  max: pendingAmount
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Date"
                name="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={handleInputChange}
                error={!!errors.payment_date}
                helperText={errors.payment_date}
                variant="outlined"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                error={!!errors.payment_method}
                helperText={errors.payment_method}
                variant="outlined"
                required
                placeholder="e.g., Bank Transfer, Cash, Cheque"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transaction Reference"
                name="transaction_reference"
                value={formData.transaction_reference}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="e.g., TXN123456, Cheque No."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Add any additional notes..."
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<AttachFileIcon />}
                style={{
                  padding: '12px',
                  borderColor: errors.files ? '#d32f2f' : '#c4c4c4',
                  color: errors.files ? '#d32f2f' : '#29346B'
                }}
              >
                Upload Attachments (Multiple Files)
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                />
              </Button>
              {errors.files && (
                <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px', marginLeft: '14px' }}>
                  {errors.files}
                </p>
              )}
            </Grid>

            {/* Display Selected Files */}
            {selectedFiles.length > 0 && (
              <Grid item xs={12}>
                <Box style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Selected Files ({selectedFiles.length})
                    </Typography>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={handleRemoveAllFiles}
                      startIcon={<DeleteIcon />}
                    >
                      Remove All
                    </Button>
                  </Stack>
                  
                  <Stack spacing={1}>
                    {selectedFiles.map((file, index) => (
                      <Box 
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#ffffff',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <Box style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <AttachFileIcon style={{ marginRight: '8px', color: '#666' }} fontSize="small" />
                          <Box>
                            <Typography variant="body2" style={{ fontWeight: 500 }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  
                  <Typography variant="caption" color="textSecondary" style={{ marginTop: '8px', display: 'block' }}>
                    Total size: {(totalFileSize / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions style={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleModalClose} 
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#cccccc' : '#4CAF50',
              color: '#FFFFFF',
              minWidth: '120px'
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Record Payment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RecordPaymentModal;
