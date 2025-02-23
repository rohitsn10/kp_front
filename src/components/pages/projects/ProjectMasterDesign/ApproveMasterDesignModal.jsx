import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import { useUpdateDrawingMutation } from '../../../../api/masterdesign/masterDesign.js';

function ApproveMasterDesignModal({ open, onClose, selectedDesign }) {
  const [updateDrawing] = useUpdateDrawingMutation();
  const [approvalStatus, setApprovalStatus] = useState('');

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // formData.append('project_id', selectedDesign.project);
      formData.append('approval_status', approvalStatus);

      await updateDrawing({
        drawingId: selectedDesign.id,
        formData: formData
      }).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to update approval status:', error);
    }
  };

  const renderDetailRow = (label, value) => (
    <div className="grid grid-cols-2 border-b py-3">
      <div className="text-[#29346B] font-semibold">{label}:</div>
      <div>{value || 'N/A'}</div>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          width: "700px",
        },
      }}
    >
      <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
        Approve Document/Drawing
      </DialogTitle>
      <DialogContent>
        <div className="space-y-2">
          {renderDetailRow("Name of Document/Drawing", selectedDesign?.name_of_drawing)}
          {renderDetailRow("Document/Drawing Category", selectedDesign?.drawing_category)}
          {renderDetailRow("Discipline", selectedDesign?.discipline)}
          {renderDetailRow("Block", selectedDesign?.block)}
          {renderDetailRow("Document/Drawing Number", selectedDesign?.drawing_number)}
          {renderDetailRow("Auto Document/Drawing Number", selectedDesign?.auto_drawing_number)}
          {renderDetailRow("Type", selectedDesign?.type_of_approval)}
          {renderDetailRow("Assigned To", selectedDesign?.assign_to_user_full_name)}
          
          <div className="mt-6">
            <div className="text-[#29346B] font-semibold mb-2">Attachments:</div>
            <div className="space-y-2">
              {selectedDesign?.drawing_and_design_attachments?.map((file) => (
                <div key={file.id} className="p-2 border rounded">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.url.split('/').pop()}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-[#29346B] font-semibold">
              Status<span className="text-red-600"> *</span>
            </label>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              className="border p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            >
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="submitted_r0">Submitted R0</option>
              <option value="commented">Commented</option>
            </select>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{
        margin: '15px auto'
      }}>
        <Button
          onClick={handleSubmit}
          disabled={!approvalStatus}
          type="submit"
          sx={{
            backgroundColor: "#f6812d",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "6px 36px",
            width: "200px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#E66A1F",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            }
          }}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApproveMasterDesignModal;