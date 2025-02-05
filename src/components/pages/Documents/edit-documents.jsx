import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Autocomplete, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';

export default function EditDocumentModal({ open, setOpen, onClose, document, onSave }) {
  const [documentName, setDocumentName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [confidentialLevel, setConfidentialLevel] = useState('');
  const [status, setStatus] = useState('');
  const [keywords, setKeywords] = useState('');
  const [comments, setComments] = useState('');
  const [documentAttachments, setDocumentAttachments] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState('');

  useEffect(() => {
    if (document) {
      setDocumentName(document.documentName);
      setDocumentNumber(document.documentNumber);
      setProjectName(document.projectName);
      setConfidentialLevel(document.confidentialLevel);
      setStatus(document.status);
      setKeywords(document.keywords || '');
      setComments(document.comments || '');
      setAssignedUsers(document.assignedUsers || '');
    }
  }, [document]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = () => {
    if (!documentName || !documentNumber || !projectName || !confidentialLevel || !status) {
      toast.error('Please fill all the required fields!');
      return;
    }

    const updatedDocument = {
      documentName,
      documentNumber,
      projectName,
      confidentialLevel,
      status,
      keywords,
      comments,
      documentAttachments,
      assignedUsers
    };

    // Handle the saving logic
    onSave(updatedDocument);
    toast.success('Document updated successfully!');
    handleClose();
  };

  const CONFIDENTIAL_CHOICES = ['Public', 'International', 'Confidential'];
  const STATUS_CHOICES = ['Draft', 'Archived', 'Approved'];
  const PROJECT_CHOICES = ['Project 1', 'Project 2', 'Project 3'];  // Sample data
  const USER_CHOICES = ['User 1', 'User 2', 'User 3'];  // Sample data

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
        Edit Document
      </DialogTitle>
      <DialogContent>
        {/* Document Name */}
        <label className="block mb-1 text-[#29346B] text-lg font-semibold">
          Document Name <span className="text-red-600"> *</span>
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={documentName}
          placeholder="Enter Document Name"
          onChange={(e) => setDocumentName(e.target.value)}
        />

        {/* Document Number */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Document Number <span className="text-red-600"> *</span>
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={documentNumber}
          placeholder="Enter Document Number"
          onChange={(e) => setDocumentNumber(e.target.value)}
        />

        {/* Project Name */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Project Name <span className="text-red-600"> *</span>
        </label>
        <Autocomplete
          options={PROJECT_CHOICES}
          value={projectName}
          onChange={(event, newValue) => setProjectName(newValue)}
          renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Project" fullWidth />}
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "1px solid #FACC15",
              borderBottom: "4px solid #FACC15",
              borderRadius: "6px",
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              border: "none",
              borderRadius: "4px",
            },
          }}
        />

        {/* Confidential Level */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Confidential Level <span className="text-red-600"> *</span>
        </label>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: '15px' }}>
          <InputLabel>Confidential Level</InputLabel>
          <Select
            value={confidentialLevel}
            onChange={(e) => setConfidentialLevel(e.target.value)}
            label="Confidential Level"
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "1px solid #FACC15",
                borderBottom: "4px solid #FACC15",
                borderRadius: "6px",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                border: "none",
                borderRadius: "4px",
              },
            }}
          >
            {CONFIDENTIAL_CHOICES.map((level, index) => (
              <MenuItem key={index} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Status <span className="text-red-600"> *</span>
        </label>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: '15px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            {STATUS_CHOICES.map((statusChoice, index) => (
              <MenuItem key={index} value={statusChoice}>
                {statusChoice}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Keywords */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Keywords
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={keywords}
          placeholder="Enter Keywords"
          onChange={(e) => setKeywords(e.target.value)}
        />

        {/* Comments */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Comments
        </label>
        <textarea
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={comments}
          placeholder="Enter Comments"
          onChange={(e) => setComments(e.target.value)}
        />

        {/* Document Attachments */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Document Attachments
        </label>
        <input
          type="file"
          className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline:none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
          onChange={(e) => setDocumentAttachments(e.target.files[0])}
        />

        {/* Assigned Users */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Assigned Users
        </label>
        <Autocomplete
          options={USER_CHOICES}
          value={assignedUsers}
          onChange={(event, newValue) => setAssignedUsers(newValue)}
          renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Assigned User" fullWidth />}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E66A1F',
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
