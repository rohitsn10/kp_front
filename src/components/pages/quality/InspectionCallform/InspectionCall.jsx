import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';

function InspectionCallForm({ open, handleClose }) {
  const [formData, setFormData] = useState({
    // projectName: '',
    itemDescription: '',
    supplierNameAndAddress: '',
    inspectionPlace: '',
    supplierContact: '',
    proposedInspectionDateTime: '',
    purchaseOrderDetails: '',
    quantityOrdered: '',
    quantityReleased: '',
    quantityBalance: '',
    quantityOffered: '',
    itemCategory: '',
    attachedDocuments: '',
    otherDetails: ''
  });

  const [alertOpen, setAlertOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Inspection Call Form Data:', formData);
    setAlertOpen(true);
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#29346B', color: 'white' }}>
          Format for Inspection Call
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
            //   { label: 'Project Name', name: 'projectName' },
              { label: 'Item Description', name: 'itemDescription' },
              { label: 'Name and complete address of supplier', name: 'supplierNameAndAddress', multiline: true },
              { label: 'Place of inspection', name: 'inspectionPlace' },
              { label: 'Contact person at supplier place', name: 'supplierContact' },
              { label: 'Date and time of proposed inspection', name: 'proposedInspectionDateTime', type: 'datetime-local' },
              { label: 'Purchase order number and date', name: 'purchaseOrderDetails' },
              { label: 'Quantity Ordered', name: 'quantityOrdered' },
              { label: 'Quantity released till date', name: 'quantityReleased' },
              { label: 'Quantity balance for MDCC', name: 'quantityBalance' },
              { label: 'Quantity Offered for Inspection', name: 'quantityOffered' },
              { label: 'Item Category (A/B/C)', name: 'itemCategory' },
              { label: 'Details of approved QAP/drawing/documents', name: 'attachedDocuments', multiline: true },
              { label: 'Any other details', name: 'otherDetails', multiline: true }
            ].map(({ label, name, multiline = false, type = 'text' }) => (
              <Grid item xs={12} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline={multiline}
                  rows={multiline ? 3 : 1}
                  type={type}
                  InputLabelProps={type === 'datetime-local' ? { shrink: true } : undefined}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} sx={{ color: '#29346B' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: '#FACC15',
              color: '#29346B',
              '&:hover': { bgcolor: '#e5b812' }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
        <Alert severity="success" onClose={() => setAlertOpen(false)} sx={{ width: '100%' }}>
          Inspection Call submitted (check console)
        </Alert>
      </Snackbar>
    </>
  );
}

export default InspectionCallForm;
