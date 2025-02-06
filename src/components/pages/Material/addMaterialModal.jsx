import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete } from '@mui/material';

export default function AddMaterialModal({ open, setOpen }) {
  const [vendorName, setVendorName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [uom, setUom] = useState('');
  const [price, setPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [projectActivityId, setProjectActivityId] = useState(null);
  const [subActivityId, setSubActivityId] = useState(null);
  const [subSubActivityId, setSubSubActivityId] = useState(null);

  const projectOptions = [
    { label: 'Project 1', value: '1' },
    { label: 'Project 2', value: '2' },
  ];

  const projectActivityOptions = [
    { label: 'Activity 1', value: '1' },
    { label: 'Activity 2', value: '2' },
  ];

  const subActivityOptions = [
    { label: 'Sub Activity 1', value: '1' },
    { label: 'Sub Activity 2', value: '2' },
  ];

  const subSubActivityOptions = [
    { label: 'Sub Sub Activity 1', value: '1' },
    { label: 'Sub Sub Activity 2', value: '2' },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      vendorName,
      materialName,
      uom,
      price,
      endDate,
      prNumber,
      poNumber,
      quantity,
      projectId,
      projectActivityId,
      subActivityId,
      subSubActivityId,
    });
    handleClose();
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
          Add Material
        </DialogTitle>
        <DialogContent>
          {/* First Row: Vendor Name and Material Name */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Vendor Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={vendorName}
                placeholder="Enter Vendor Name"
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Material Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={materialName}
                placeholder="Enter Material Name"
                onChange={(e) => setMaterialName(e.target.value)}
              />
            </div>
          </div>

          {/* Second Row: UOM and Price */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                UOM<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={uom}
                placeholder="Enter UOM"
                onChange={(e) => setUom(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Price<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={price}
                placeholder="Enter Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Third Row: End Date and PR Number */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                End Date<span className="text-red-600"> *</span>
              </label>
              <input
                type="date"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                PR Number<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={prNumber}
                placeholder="Enter PR Number"
                onChange={(e) => setPrNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Fourth Row: PO Number and Quantity */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                PO Number<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={poNumber}
                placeholder="Enter PO Number"
                onChange={(e) => setPoNumber(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Quantity<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={quantity}
                placeholder="Enter Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          {/* Dropdowns for Project, Activity, Sub Activity, and Sub Sub Activity */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Project ID<span className="text-red-600"> *</span>
              </label>
              <Autocomplete
                options={projectOptions}
                getOptionLabel={(option) => option.label}
                value={projectId}
                onChange={(event, newValue) => setProjectId(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Project"
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
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Project Activity ID<span className="text-red-600"> *</span>
              </label>
              <Autocomplete
                options={projectActivityOptions}
                getOptionLabel={(option) => option.label}
                value={projectActivityId}
                onChange={(event, newValue) => setProjectActivityId(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Project Activity"
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
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Sub Activity ID<span className="text-red-600"> *</span>
              </label>
              <Autocomplete
                options={subActivityOptions}
                getOptionLabel={(option) => option.label}
                value={subActivityId}
                onChange={(event, newValue) => setSubActivityId(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Sub Activity"
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
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Sub Sub Activity ID<span className="text-red-600"> *</span>
              </label>
              <Autocomplete
                options={subSubActivityOptions}
                getOptionLabel={(option) => option.label}
                value={subSubActivityId}
                onChange={(event, newValue) => setSubSubActivityId(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Sub Sub Activity"
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