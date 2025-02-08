import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import { useCreateProjectWpoMutation } from '../../../../api/wpo/wpoApi';
// import { useCreateProjectWpoMutation } from '../../api/projectWpoApi';
// useCreateProjectWpoMutation

function ProjectWpo({ open, projectId, handleClose, refetch }) {
  const [createProjectWpo, { isLoading }] = useCreateProjectWpoMutation();
//   console.log("Project ID",projectId)

  const [formData, setFormData] = useState({
    project_id: projectId || "",
    files: {
      loi_attachments: [],
      loa_po_attachments: [],
      epc_contract_attachments: [],
      omm_contact_attachments: []
    }
  });
//   console.log(formData)

  const handleFileChange = (e, key) => {
    setFormData((prevData) => ({
      ...prevData,
      files: {
        ...prevData.files,
        [key]: Array.from(e.target.files)
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await createProjectWpo(formData).unwrap();
      refetch();
      handleClose();
    } catch (err) {
      console.error("Error submitting project WPO:", err);
    }
  };
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      project_id: projectId || "",
    }));
  }, [projectId]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          width: '700px',
          paddingBottom:'15px'
        },
      }}
    >
      <h2 className="text-2xl my-6 text-center font-semibold text-[#29346B] mb-5">Add WO/PO</h2>
      <DialogContent>
        {Object.keys(formData.files).map((key) => (
          <div key={key} className="mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              {key.replace(/_/g, " ").toUpperCase()} (Upload Multiple)
            </label>
            <input 
              type="file" 
              multiple
              onChange={(e) => handleFileChange(e, key)}
              className="w-full my-1 cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:p-2 file:border-none file:rounded-md" 
            />
            {formData.files[key].length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {formData.files[key].length} file(s) selected
              </div>
            )}
          </div>
        ))}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
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
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
        {/* <Button
          onClick={handleClose}
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
          Close
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

export default ProjectWpo;
