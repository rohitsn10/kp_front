import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useUpdateLandBankLocationMutation } from '../../../api/users/locationApi';
import { useGetLandBankMasterQuery } from '../../../api/users/landbankApi';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function EditLocationModal({
  open,
  setOpen,
  locationToEdit, 
  onClose,
  setLocationInput,
}) {
  const [nearbyArea, setNearbyArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [selectedLandBank, setSelectedLandBank] = useState(null);

  const { data: landBankData, isLoading, error, refetch } = useGetLandBankMasterQuery();

  const [updateLandBankLocation] = useUpdateLandBankLocationMutation();

  useEffect(() => {
    if (locationToEdit) {
      setNearbyArea(locationToEdit.
        nearByArea
        );
      setLandArea(locationToEdit.totalArea);
      setSelectedLandBank(
        landBankData?.data?.find((landBank) => landBank.id === locationToEdit.landBankId) || null
      );
    }
  }, [locationToEdit, landBankData]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = async () => {
    if (!selectedLandBank) {
      toast.error('Please select a land bank!');
      return;
    }

    const formData = {
        land_bank_id: selectedLandBank.id,
      land_bank_location_name: locationToEdit.land_bank_location_name, 
      total_land_area: landArea,
      near_by_area: nearbyArea,
      id: locationToEdit.id, 
    };

    try {
        await updateLandBankLocation(formData).unwrap();
        toast.success('Location updated successfully!');
        handleClose();
      } catch (error) {
        toast.error('Failed to update location!');
        console.error('Error updating location:', error);
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
          Edit Location
        </DialogTitle>
        <DialogContent>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Select Land Bank
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
