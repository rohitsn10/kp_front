import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useCreateLandBankLocationMutation } from '../../../api/users/locationApi';
import { useGetLandBankMasterQuery } from '../../../api/users/landbankApi';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function LocationModal({
  open,
  setOpen,
  locationInput,
  onClose ,
  setLocationInput,
}) {
  const [nearbyArea, setNearbyArea] = useState('');
  const [landArea, setLandArea] = useState('');  // keep as string for input handling
  const [selectedLandBank, setSelectedLandBank] = useState(null); // State for selected land bank

  // Fetch land bank data
  const { data: landBankData, isLoading, error ,refetch} = useGetLandBankMasterQuery();

  // Using the mutation hook
  const [createLandBankLocation] = useCreateLandBankLocationMutation();

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = async () => {
    if (!selectedLandBank) {
      toast.error('Please select a land bank!');
      return;
    }

    if (!landArea) {
      toast.error('Please mention Land Area!');
      return;
    }
    const formData = {
      land_bank_id: selectedLandBank.id, 
      land_bank_location_name: locationInput,
      total_land_area: parseFloat(landArea),  // Convert to number here
      near_by_area: nearbyArea,
    };

    try {
      await createLandBankLocation(formData).unwrap(); 
      toast.success('Location added successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to add location!');
      console.error('Error creating location:', error);
    }
  };

  const landBankOptions = landBankData?.data?.map((landBank) => ({
    id: landBank.id,
    land_name: landBank.land_name,
  })) || [];

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
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Select Land Bank <span className="text-red-600"> *</span>
          </label>
          <Autocomplete
            options={landBankOptions}
            getOptionLabel={(option) => option.land_name}
            value={selectedLandBank}
            onChange={(event, newValue) => setSelectedLandBank(newValue)}
            loading={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select a land bank"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid #FACC15",
                    borderBottom: "4px solid #FACC15",
                    borderRadius: "6px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    border: "none",
                    borderRadius: "4px",
                  },
                }}
              />
            )}
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
            Land Area <span className="text-red-600"> *</span>
          </label>
          <input
            type="number"  // Change input type to number
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={landArea}
            placeholder="Enter Land Area"
            onChange={(e) => setLandArea(e.target.value)}  // This will now be a string
          />
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
