import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import { useGetDrawingsByProjectIdQuery, useUpdateDrawingMutation } from '../../../../api/masterdesign/masterDesign.js';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function SubmitMasterDesignModal({ open, onClose, selectedDesign }) {
  const { projectId } = useParams();
  const [updateDrawing] = useUpdateDrawingMutation();
const { refetch } = useGetDrawingsByProjectIdQuery(projectId);
  

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('project_id', projectId);
      submitData.append('assign_to_user', selectedDesign?.assign_to_user);
      submitData.append('approval_status', 'submitted_r0');
      
      let response = await updateDrawing({
        drawingId: selectedDesign.id,
        formData: submitData
      }).unwrap();
      if(response.status){
        toast.success("Updated Success.");
        refetch();
      }else{
        toast.error("Updated Success.");
      }
      onClose();
    } catch (error) {
      console.error('Failed to update drawing:', error);
    }
  };

  const renderDetailRow = (label, value) => (
    <div className="grid grid-cols-2 border-b py-3">
      <div className="text-[#29346B] font-semibold">{label}:</div>
      <div>{value || 'N/A'}</div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

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
        Submit Document/Drawing
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
          {renderDetailRow("Status", "Will be submitted as R0")}
          
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

          {selectedDesign?.commented_actions && selectedDesign.commented_actions.length > 0 && (
            <div className="mt-6">
              <div className="text-[#29346B] font-semibold mb-4">Comments History:</div>
              <div className="space-y-4">
                {selectedDesign.commented_actions.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-700">{comment.user_full_name}</div>
                      <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
                    </div>
                    <div className="text-gray-600">{comment.remarks}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{
        margin: '15px auto'
      }}>
        <Button
          onClick={handleSubmit}
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
            }
          }}
        >
          Submit Drawing
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubmitMasterDesignModal;