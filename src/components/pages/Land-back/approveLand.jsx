import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

export default function LandActivityModal({
  open,
  setOpen,
  landActivityInput,
  setLandActivityInput,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [landTitle, setLandTitle] = useState('Sample Land Title'); // Mock data for land title
  const [solarWindType, setSolarWindType] = useState(''); // State for Solar/Wind dropdown
  const [files, setFiles] = useState({
    landLocation: [],
    landSurveyNumber: [],
    keyPlan: [],
    approachRoad: [],
    coordinates: [],
    proposedGSS: [],
    transmissionLine: [],
    approvalReport: [], // New field for approval report
  });

  const categoryOptions = [
    { label: 'Agricultural', value: 'agricultural' },
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Industrial', value: 'industrial' },
  ];

  const solarWindOptions = ['Solar', 'Wind']; // Options for Solar/Wind dropdown

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e, field) => {
    setFiles({
      ...files,
      [field]: [...files[field], ...Array.from(e.target.files)],
    });
  };

  const handleSubmit = () => {
    console.log("Land Title:", landTitle);
    console.log("Selected Category:", selectedCategory);
    console.log("Solar/Wind Type:", solarWindType);
    console.log("Files:", files);
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
          Add Land Activity
        </DialogTitle>
        <DialogContent>
          {/* Land Title */}
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

          {/* Select Category */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Category
          </label>
          <Autocomplete
            options={categoryOptions}
            getOptionLabel={(option) => option.label}
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

          {/* Solar/Wind Dropdown and Approval Report Upload */}
          <div className="flex justify-between mt-6 mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Solar/Wind
              </label>
              <FormControl fullWidth>
                <Select
                  value={solarWindType}
                  onChange={(e) => setSolarWindType(e.target.value)}
                  sx={{
                    border: '1px solid #FACC15',
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px',
                  }}
                >
                  {solarWindOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Attach Approval Report
              </label>
              <input
                type="file"
                multiple
                className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
                onChange={(e) => handleFileChange(e, 'approvalReport')}
              />
            </div>
          </div>

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
            justifyContent: 'center', // Centers the button horizontally
            padding: '20px', // Adds spacing around the button
          }}
        >
          <Button
            onClick={handleSubmit}
            type="submit"
            sx={{
              backgroundColor: '#f6812d', // Orange background color
              color: '#FFFFFF', // White text color
              fontSize: '16px', // Slightly larger text
              padding: '6px 36px', // Makes the button bigger (adjust width here)
              width: '200px', // Explicit width for larger button
              borderRadius: '8px', // Rounded corners
              textTransform: 'none', // Disables uppercase transformation
              fontWeight: 'bold', // Makes the text bold
              '&:hover': {
                backgroundColor: '#E66A1F', // Slightly darker orange on hover
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