import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCreateDrawingMutation, useGetAllDrawingsQuery, useGetDrawingsByProjectIdQuery } from '../../../../api/masterdesign/masterDesign.js';
import { useFetchUsersQuery } from '../../../../api/users/usersApi';
import { toast } from 'react-toastify';

function CreateMasterDesignModal({ open, onClose }) {
  const { projectId } = useParams();
  const { data: userData } = useFetchUsersQuery();
  const [createDrawing] = useCreateDrawingMutation();
  const { refetch } = useGetDrawingsByProjectIdQuery(projectId);
  
  const [formData, setFormData] = useState({
    client_initials: '',
    project_name: '',
    company_name: '',
    block: '',
    drawing_number: '',
    auto_drawing_number: '',
    name_of_drawing: '',
    drawing_category: '',
    type_of_approval: '',
    approval_status: 'not_submitted',
    discipline: '',
    files: [],
    assign_to_user: null
  });

  // Company name options
  const companyOptions = [
    { label: 'KPI', value: 'KPI' },
    { label: 'Other Company 1', value: 'OC1' },
    { label: 'Other Company 2', value: 'OC2' }
  ];

  useEffect(() => {
    generateAutoDrawingNumber();
  }, [formData.client_initials, formData.project_name, formData.company_name, formData.discipline, formData.drawing_category, formData.drawing_number]);

  const generateAutoDrawingNumber = () => {
    const clientInitials = formData.client_initials.toUpperCase();
    const projectName = formData.project_name;
    const companyName = formData.company_name;
    const discipline = formData.discipline ? formData.discipline.charAt(0) : '';
    const category = formData.drawing_category === 'drawing' ? 'DWG' : 
                    formData.drawing_category === 'document' ? 'DOC' : '';
    const drawingNumber = formData.drawing_number;

    if (clientInitials && projectName && companyName && discipline && category && drawingNumber) {
      const autoNumber = `${clientInitials}-${projectName}-${companyName}-${discipline}-${category}-${drawingNumber}`;
      setFormData(prev => ({
        ...prev,
        auto_drawing_number: autoNumber
      }));
    }
  };

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

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('project_id', projectId);
      submitData.append('assign_to_user', formData.assign_to_user);
      
      Object.keys(formData).forEach(key => {
        if (key !== 'files' && key !== 'assign_to_user') {
          submitData.append(key, formData[key]);
        }
      });

      formData.files.forEach(file => {
        submitData.append('drawing_and_design_attachments', file);
      });

      let response = await createDrawing(submitData).unwrap();
      if(response.status){
        toast.success("Added Successfully.")
        refetch();
      } else {
        toast.error("Something went wrong!")
      }
      onClose();
    } catch (error) {
      console.error('Failed to create drawing:', error);
    }
  };

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
        Create Document/Drawing
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-4">
          {/* New fields for auto-numbering */}
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Client Initials<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="client_initials"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.client_initials}
              placeholder="Enter Client Initials (e.g., CIL)"
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Project Name<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="project_name"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.project_name}
              placeholder="Enter Project Name (e.g., 300 MW)"
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Company Name<span className="text-red-600"> *</span>
            </label>
            <select
              name="company_name"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={formData.company_name}
              onChange={handleInputChange}
            >
              <option value="">Select Company</option>
              {companyOptions.map(company => (
                <option key={company.value} value={company.value}>
                  {company.label}
                </option>
              ))}
            </select>
          </div>

          {/* Existing fields */}
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
              Auto Document/Drawing Number
            </label>
            <input
              type="text"
              name="auto_drawing_number"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none bg-gray-100"
              value={formData.auto_drawing_number}
              readOnly
              placeholder="Auto-generated number will appear here"
            />
          </div>

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
              Attachments<span className="text-red-600"> *</span>
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
      <DialogActions sx={{ margin: '15px auto' }}>
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateMasterDesignModal;