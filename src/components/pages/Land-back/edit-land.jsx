import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete } from '@mui/material';
import { useGetLandCategoriesQuery } from '../../../api/users/categoryApi';
import { useUpdateLandBankMasterMutation } from '../../../api/users/landbankApi';
import { toast } from 'react-toastify';

export default function EditLandModal({
  open,
  setOpen,
  selectedLand, // Pass the selected land data to pre-fill the form
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [landTitle, setLandTitle] = useState('');
  const { data: categories, isLoading, isError } = useGetLandCategoriesQuery();
  const [files, setFiles] = useState({
    landLocation: [],
    landSurveyNumber: [],
    keyPlan: [],
    approachRoad: [],
    coordinates: [],
    proposedGSS: [],
    transmissionLine: [],
  });

  const [updateLandBankMaster] = useUpdateLandBankMasterMutation(); // Use update mutation

  const energyOptions = [
    { label: 'Solar', value: 'solar' },
    { label: 'Wind', value: 'wind' },
  ];

  // Pre-fill the form when selectedLand changes
  useEffect(() => {
    if (selectedLand) {
      setLandTitle(selectedLand.land_name);
      setSelectedCategory(
        categories?.data.find((cat) => cat.id === selectedLand.land_category_id) || null
      );
      setSelectedEnergy(
        energyOptions.find(
          (energy) => energy.value === selectedLand.solar_or_winds?.toLowerCase()
        ) || null
      );

      // Set files from selectedLand (if files are already uploaded)
      setFiles({
        landLocation: selectedLand.land_location_files || [],
        landSurveyNumber: selectedLand.land_survey_number_files || [],
        keyPlan: selectedLand.land_key_plan_files || [],
        approachRoad: selectedLand.land_approach_road_files || [],
        coordinates: selectedLand.land_co_ordinates_files || [],
        proposedGSS: selectedLand.land_proposed_gss_files || [],
        transmissionLine: selectedLand.land_transmission_line_files || [],
      });
    }
  }, [selectedLand, categories]);

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

    // Append text fields
    formData.append('land_category_id', selectedCategory?.id || '');
    formData.append('land_name', landTitle);
    formData.append('solar_or_winds', selectedEnergy?.label || '');

    // Append files
    Object.entries(files).forEach(([field, fileList]) => {
      fileList.forEach((file) => {
        formData.append(`${field}_files`, file);
      });
    });

    try {
      const response = await updateLandBankMaster({
        id: selectedLand.id, // Pass the land bank ID for updating
        formData, // Pass the form data
      }).unwrap();

      console.log('Response:', response);
      toast.success('Land bank updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update land bank. Please try again.');
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
          Edit Land 
        </DialogTitle>
        <DialogContent>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Land Title <span className="text-red-600"> *</span>
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
            Select Category <span className="text-red-600"> *</span>
          </label>
          <Autocomplete
            options={categories?.data || []}
            getOptionLabel={(option) => option.category_name}
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
                    border: '1px solid #FACC15',
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px',
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
            Select Energy Type <span className="text-red-600"> *</span>
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
                    border: '1px solid #FACC15',
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px',
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}