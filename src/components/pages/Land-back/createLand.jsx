import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete } from '@mui/material';
import { useGetLandCategoriesQuery } from '../../../api/users/categoryApi';
import { useCreateLandBankMasterMutation, useGetLandBankMasterQuery } from '../../../api/users/landbankApi';
import { toast } from 'react-toastify'; 

export default function LandActivityModal({
  open,
  setOpen,
  landActivityInput,
  setLandActivityInput
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [landTitle, setLandTitle] = useState('');
  const { data: categories, isLoading, isError } = useGetLandCategoriesQuery();
    const { data, refetch } = useGetLandBankMasterQuery();
  
  const [files, setFiles] = useState({
    landLocation: [],
    landSurveyNumber: [],
    keyPlan: [],
    approachRoad: [],
    coordinates: [],
    proposedGSS: [],
    transmissionLine: [],
  });

  const [createLandBankMaster] = useCreateLandBankMasterMutation(); 



  const energyOptions = [
    { label: 'Solar', value: 'solar' },
    { label: 'Wind', value: 'wind' },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e, field) => {
    setFiles({
      ...files,
      [field]: [...files[field], ...Array.from(e.target.files)],
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();


    formData.append('land_category_id', selectedCategory?.id || '');
    formData.append('land_name', landTitle);
    formData.append('solar_or_winds', selectedEnergy?.label || '');

    files.landLocation.forEach((file, index) => {
      formData.append('land_location_files', file);
    });

    files.landSurveyNumber.forEach((file, index) => {
      formData.append('land_survey_number_files', file);
    });

    files.keyPlan.forEach((file, index) => {
      formData.append('land_key_plan_files', file);
    });

    files.approachRoad.forEach((file, index) => {
      formData.append('land_approach_road_files', file);
    });

    files.coordinates.forEach((file, index) => {
      formData.append('land_co_ordinates_files', file);
    });

    files.proposedGSS.forEach((file, index) => {
      formData.append('land_proposed_gss_files', file);
    });

    files.transmissionLine.forEach((file, index) => {
      formData.append('land_transmission_line_files', file);
    });

    try {
      const response = await createLandBankMaster(formData).unwrap();
      console.log('Response:', response);
      toast.success('Land bank created successfully!'); 
      refetch()
      handleClose(); 
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create land bank. Please try again.'); 
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: '600px',
          },
        }}
      >
        <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
          Add Land
        </DialogTitle>
        <DialogContent>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Land Title
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={landTitle}
            placeholder="Enter Land Title"
            onChange={(e) => setLandTitle(e.target.value)}
          />

          {/* Select Category Autocomplete */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Category
          </label>
          <Autocomplete
            options={categories?.data || []} // Use categories from the API response
            getOptionLabel={(option) => option.category_name} // Display category_name
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
                className="outline-none"
                {...params}
                variant="outlined"
                placeholder="Search and select a category"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #FACC15', // Yellow border
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px', // Rounded corners
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    border: 'none',
                    borderRadius: '4px',
                  },
                }}
              />
            )}
          />

          {/* Energy Type Autocomplete */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Energy Type
          </label>
          <Autocomplete
            options={energyOptions}
            getOptionLabel={(option) => option.label}
            value={selectedEnergy}
            onChange={(event, newValue) => setSelectedEnergy(newValue)}
            renderInput={(params) => (
              <TextField
                className="outline-none"
                {...params}
                variant="outlined"
                placeholder="Search and select an energy type"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #FACC15', // Yellow border
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px', // Rounded corners
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    border: 'none',
                    borderRadius: '4px',
                  },
                }}
              />
            )}
          />

          {/* File Uploads Section */}
          <div className="mt-6">
            <div className="flex justify-between mb-4">
              {/* Land Location & Land Survey Number Upload */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Land Location (Upload)
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                  onChange={(e) => handleFileChange(e, 'landLocation')}
                />
              </div>
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Land Survey Number (Upload)
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                  onChange={(e) => handleFileChange(e, 'landSurveyNumber')}
                />
              </div>
            </div>

            <div className="flex justify-between mb-4">
              {/* Key Plan & Approach Road Upload */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Key Plan (Upload)
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                  onChange={(e) => handleFileChange(e, 'keyPlan')}
                />
              </div>
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Approach Road (Upload)
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                  onChange={(e) => handleFileChange(e, 'approachRoad')}
                />
              </div>
            </div>

            <div className="flex justify-between mb-4">
              {/* Coordinates & Proposed GSS Upload */}
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Coordinates (Upload)
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                  onChange={(e) => handleFileChange(e, 'coordinates')}
                />
              </div>
              <div className="w-[48%]">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                  Proposed GSS (Upload)
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                  onChange={(e) => handleFileChange(e, 'proposedGSS')}
                />
              </div>
            </div>

            <div className="w-full mb-4">
              {/* Transmission Line Upload */}
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Transmission Line (Upload)
              </label>
              <input
                type="file"
                multiple
                className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                onChange={(e) => handleFileChange(e, 'transmissionLine')}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center', 
            padding: '20px', 
          }}
        >
          <Button
            onClick={handleSubmit}
            type="submit"
            sx={{
              backgroundColor: '#f6812d', 
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}