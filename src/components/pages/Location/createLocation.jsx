import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function LocationModal({
  open,
  setOpen,
  locationInput,
  setLocationInput,
}) {
  const [nearbyArea, setNearbyArea] = useState(''); // State for Nearby Area
  const [landArea, setLandArea] = useState(''); // State for Land Area

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("Location Name:", locationInput);
    console.log("Nearby Area:", nearbyArea);
    console.log("Land Area:", landArea);
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
          Add Location
        </DialogTitle>
        <DialogContent>
          {/* Location Name Input */}
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Location Name
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={locationInput}
            placeholder="Enter Location Name"
            onChange={(e) => setLocationInput(e.target.value)}
          />

          {/* Nearby Area Input */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Nearby Area
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={nearbyArea}
            placeholder="Enter Nearby Area"
            onChange={(e) => setNearbyArea(e.target.value)}
          />

          {/* Land Area Input */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Land Area
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={landArea}
            placeholder="Enter Land Area"
            onChange={(e) => setLandArea(e.target.value)}
          />
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
              backgroundColor: '#F6812D', // Orange background color
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