import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAllDrawingsQuery, useGetDrawingsByProjectIdQuery, useUpdateDrawingMutation } from '../../../../api/masterdesign/masterDesign.js';
import { useFetchUsersQuery } from '../../../../api/users/usersApi';
import { toast } from 'react-toastify';
// import { X } from 'lucide-react';

function EditMasterDesignModal({ open, onClose, selectedDesign }) {
  const { projectId } = useParams();
  const { data: userData } = useFetchUsersQuery();
  const [updateDrawing] = useUpdateDrawingMutation();
  const { refetch } = useGetDrawingsByProjectIdQuery(projectId);
  const [formData, setFormData] = useState({
    block: '',
    drawing_number: '',
    auto_drawing_number: '',
    name_of_drawing: '',
    drawing_category: '',
    type_of_approval: '',
    discipline: '',
    files: [],
    assign_to_user: null
  });

  const [filesToRemove, setFilesToRemove] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    if (selectedDesign) {
      setFormData({
        block: selectedDesign.block || '',
        drawing_number: selectedDesign.drawing_number || '',
        auto_drawing_number: selectedDesign.auto_drawing_number || '',
        name_of_drawing: selectedDesign.name_of_drawing || '',
        drawing_category: selectedDesign.drawing_category || '',
        type_of_approval: selectedDesign.type_of_approval || '',
        discipline: selectedDesign.discipline || '',
        assign_to_user: selectedDesign.assign_to_user || null,
        files: []
      });
      setExistingFiles(selectedDesign.drawing_and_design_attachments || []);
    }
  }, [selectedDesign]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      files: Array.from(e.target.files)
    }));
  };

  const handleRemoveExistingFile = (fileId) => {
    setFilesToRemove(prev => [...prev, fileId]);
    setExistingFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('project_id', projectId);
      submitData.append('assign_to_user', formData.assign_to_user);
      
      // Append all other form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'files' && key !== 'assign_to_user') {
          submitData.append(key, formData[key]);
        }
      });

      // Append new files
      formData.files.forEach(file => {
        submitData.append('drawing_and_design_attachments', file);
      });

      // Append file IDs to remove
      if (filesToRemove.length > 0) {
        submitData.append('remove_drawing_and_design_attachments_id', filesToRemove.join(','));
      }

      let response = await updateDrawing({ 
        drawingId: selectedDesign.id, 
        formData: submitData 
      }).unwrap();
      if(response.status){
        toast.success("Drawing Updated Successfully.")
        refetch();
      }else{
        toast.error("Something went wrong.")
      }
      onClose();
    } catch (error) {
      console.error('Failed to update drawing:', error);
    }
  };

  // Common styles for input fields
  const commonInputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      '& fieldset': {
        borderColor: '#FCD34D',
        borderBottomWidth: '4px',
      },
      '&:hover fieldset': {
        borderColor: '#FCD34D',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F6B128',
      },
    },
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
      <DialogTitle className="text-[#29346B] text-3xl text-center font-semibold mb-5">
        Edit Document/Drawing
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Name of Document/Drawing<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="name_of_drawing"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.name_of_drawing}
              placeholder="Enter Drawing Name"
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Document/Drawing Category<span className="text-red-600"> *</span>
            </label>
            <select
              name="drawing_category"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.drawing_category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="drawing">Drawing</option>
              <option value="document">Document</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Discipline<span className="text-red-600"> *</span>
            </label>
            <select
              name="discipline"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.discipline}
              onChange={handleInputChange}
            >
              <option value="">Select Discipline</option>
              <option value="CIV">CIV</option>
              <option value="ELE">ELE</option>
              <option value="MEC">MEC</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Block<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="block"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.block}
              placeholder="Enter Block"
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Document/Drawing Number<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="drawing_number"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.drawing_number}
              placeholder="Enter Drawing Number"
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Auto Document/Drawing Number<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="auto_drawing_number"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.auto_drawing_number}
              placeholder="Enter Auto Drawing Number"
              onChange={handleInputChange}
            />
          </div>

          {/* <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Type<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="type_of_approval"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.type_of_approval}
              placeholder="Enter Type(Approval or Information)"
              onChange={handleInputChange}
            />
          </div> */}

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Type<span className="text-red-600"> *</span>
            </label>
            <select
              name="type_of_approval"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.type_of_approval}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="approval">Approval</option>
              <option value="information">Information</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Assign To User<span className="text-red-600"> *</span>
            </label>
            <Autocomplete
              options={userData || []}
              getOptionLabel={(option) => option.full_name}
              value={userData?.find(user => user.id === formData.assign_to_user) || null}
              onChange={(event, value) => {
                setFormData(prev => ({
                  ...prev,
                  assign_to_user: value ? value.id : null
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select User"
                  sx={commonInputStyles}
                />
              )}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Existing Attachments
            </label>
            <div className="space-y-2">
              {existingFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {file.url.split('/').pop()}
                  </a>
                  <button
                    onClick={() => handleRemoveExistingFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Add New Attachments
            </label>
            <input
              type="file"
              multiple
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              onChange={handleFileChange}
            />
          </div>
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
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditMasterDesignModal;