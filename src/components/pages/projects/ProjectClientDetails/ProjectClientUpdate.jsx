import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, TextField, CircularProgress, IconButton } from '@mui/material';
import { useUpdateClientMutation } from '../../../api/client/clientApi';

const UpdateClientDetails = ({ open, setOpen, refetch, clientData }) => {
  const [updateClient, { isLoading }] = useUpdateClientMutation();

  // Basic form state
  const [clientName, setClientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gst, setGst] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [captiveRecNonrecRpo, setCaptiveRecNonrecRpo] = useState('');
  const [declarationGetco, setDeclarationGetco] = useState('');
  const [undertakingGeda, setUndertakingGeda] = useState('');
  const [authorizationEpc, setAuthorizationEpc] = useState('');
  const [turnOverDetails, setTurnOverDetails] = useState('');
  const [factoryEnd, setFactoryEnd] = useState('');
  const [cin, setCin] = useState('');
  const [moaPartnership, setMoaPartnership] = useState('');
  const [boardAuthority, setBoardAuthority] = useState('');

  // File handling state for each file type
  const [fileStates, setFileStates] = useState({
    msme_certificate: { new: [], existing: [], removed: [] },
    adhar_card: { new: [], existing: [], removed: [] },
    pan_card: { new: [], existing: [], removed: [] },
    third_authority_adhar_card: { new: [], existing: [], removed: [] },
    third_authority_pan_card: { new: [], existing: [], removed: [] }
  });

  // Initialize form with client data
  useEffect(() => {
    if (clientData) {
      setClientName(clientData.client_name || '');
      setContactNumber(clientData.contact_number || '');
      setEmail(clientData.email || '');
      setGst(clientData.gst || '');
      setPanNumber(clientData.pan_number || '');
      setCaptiveRecNonrecRpo(clientData.captive_rec_nonrec_rpo || '');
      setDeclarationGetco(clientData.declaration_of_getco || '');
      setUndertakingGeda(clientData.undertaking_geda || '');
      setAuthorizationEpc(clientData.authorization_to_epc || '');
      setTurnOverDetails(clientData.last_3_year_turn_over_details || '');
      setFactoryEnd(clientData.factory_end || '');
      setCin(clientData.cin || '');
      setMoaPartnership(clientData.moa_partnership || '');
      setBoardAuthority(clientData.board_authority_signing || '');

      // Initialize file states
      setFileStates({
        msme_certificate: { 
          new: [], 
          existing: clientData.msme_certificate_attachments || [],
          removed: []
        },
        adhar_card: {
          new: [],
          existing: clientData.adhar_card_attachments || [],
          removed: []
        },
        pan_card: {
          new: [],
          existing: clientData.pan_card_attachments || [],
          removed: []
        },
        third_authority_adhar_card: {
          new: [],
          existing: clientData.third_authority_adhar_card_attachments || [],
          removed: []
        },
        third_authority_pan_card: {
          new: [],
          existing: clientData.third_authority_pan_card_attachments || [],
          removed: []
        }
      });
    }
  }, [clientData]);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setClientName('');
    setContactNumber('');
    setEmail('');
    setGst('');
    setPanNumber('');
    setCaptiveRecNonrecRpo('');
    setDeclarationGetco('');
    setUndertakingGeda('');
    setAuthorizationEpc('');
    setTurnOverDetails('');
    setFactoryEnd('');
    setCin('');
    setMoaPartnership('');
    setBoardAuthority('');
    setFileStates({
      msme_certificate: { new: [], existing: [], removed: [] },
      adhar_card: { new: [], existing: [], removed: [] },
      pan_card: { new: [], existing: [], removed: [] },
      third_authority_adhar_card: { new: [], existing: [], removed: [] },
      third_authority_pan_card: { new: [], existing: [], removed: [] }
    });
  };

  const handleFileChange = (fileType, e) => {
    setFileStates(prev => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        new: Array.from(e.target.files)
      }
    }));
  };

  const handleRemoveExistingFile = (fileType, fileId) => {
    setFileStates(prev => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        existing: prev[fileType].existing.filter(file => file.id !== fileId),
        removed: [...prev[fileType].removed, fileId]
      }
    }));
  };

  const handleSubmit = async () => {
    if (!clientData?.id || !clientName || !email) {
      alert("Required fields must be filled out.");
      return;
    }

    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('project_id', clientData.project);
      formData.append('client_name', clientName);
      formData.append('contact_number', contactNumber);
      formData.append('email', email);
      formData.append('gst', gst);
      formData.append('pan_number', panNumber);
      formData.append('captive_rec_nonrec_rpo', captiveRecNonrecRpo);
      formData.append('declaration_of_getco', declarationGetco);
      formData.append('undertaking_geda', undertakingGeda);
      formData.append('authorization_to_epc', authorizationEpc);
      formData.append('last_3_year_turn_over_details', turnOverDetails);
      formData.append('factory_end', factoryEnd);
      formData.append('cin', cin);
      formData.append('moa_partnership', moaPartnership);
      formData.append('board_authority_signing', boardAuthority);

      // Append new files for each type
      Object.entries(fileStates).forEach(([fileType, state]) => {
        state.new.forEach(file => {
          formData.append(`${fileType}_attachments`, file);
        });
        
        // Append removed file IDs as comma-separated string
        if (state.removed.length > 0) {
          formData.append(`remove_${fileType}_attachments`, state.removed.join(','));
        }
      });

      await updateClient({ 
        id: clientData.id, 
        data: formData 
      }).unwrap();
      
      refetch();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error updating client:", err);
      alert("Failed to update client details. Please try again.");
    }
  };

  const renderFileUploadSection = (fileType, label) => (
    <div className="flex flex-col gap-2 mb-4">
      <label className="block mb-1 text-[#29346B] text-lg font-semibold">{label}</label>
      <div className="flex flex-col gap-2">
        {fileStates[fileType].existing.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {file.url.split('/').pop()}
            </a>
            <IconButton onClick={() => handleRemoveExistingFile(fileType, file.id)} size="small">
              X
            </IconButton>
          </div>
        ))}
      </div>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileChange(fileType, e)}
        className="border p-2"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      {fileStates[fileType].new.length > 0 && (
        <div className="text-sm text-green-600 mt-1">
          {fileStates[fileType].new.length} new file(s) selected
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Update Client Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="GST"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
            fullWidth
          />
          <TextField
            label="PAN Number"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            fullWidth
          />
          <TextField
            label="Captive REC/Non-REC RPO"
            value={captiveRecNonrecRpo}
            onChange={(e) => setCaptiveRecNonrecRpo(e.target.value)}
            fullWidth
          />
          <TextField
            label="Declaration of GETCO"
            value={declarationGetco}
            onChange={(e) => setDeclarationGetco(e.target.value)}
            fullWidth
          />
          <TextField
            label="Undertaking GEDA"
            value={undertakingGeda}
            onChange={(e) => setUndertakingGeda(e.target.value)}
            fullWidth
          />
          <TextField
            label="Authorization to EPC"
            value={authorizationEpc}
            onChange={(e) => setAuthorizationEpc(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last 3 Year Turn Over Details"
            value={turnOverDetails}
            onChange={(e) => setTurnOverDetails(e.target.value)}
            fullWidth
          />
          <TextField
            label="Factory End"
            value={factoryEnd}
            onChange={(e) => setFactoryEnd(e.target.value)}
            fullWidth
          />
          <TextField
            label="CIN"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            fullWidth
          />
          <TextField
            label="MOA Partnership"
            value={moaPartnership}
            onChange={(e) => setMoaPartnership(e.target.value)}
            fullWidth
          />
          <TextField
            label="Board Authority Signing"
            value={boardAuthority}
            onChange={(e) => setBoardAuthority(e.target.value)}
            fullWidth
          />
        </div>

        <div className="mt-6">
          {renderFileUploadSection('msme_certificate', 'MSME Certificate')}
          {renderFileUploadSection('adhar_card', 'Aadhar Card')}
          {renderFileUploadSection('pan_card', 'PAN Card')}
          {renderFileUploadSection('third_authority_adhar_card', 'Third Authority Aadhar Card')}
          {renderFileUploadSection('third_authority_pan_card', 'Third Authority PAN Card')}
        </div>
      </DialogContent>
      <DialogActions sx={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !clientName || !email}
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Client'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateClientDetails;