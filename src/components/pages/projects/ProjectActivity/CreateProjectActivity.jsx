import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Autocomplete } from '@mui/material';
import { useCreateActivityMutation } from '../../../../api/users/projectActivityApi';
import { toast } from 'react-toastify';
// import { useCreateActivityMutation } from '../../../store/api/activityApi';
// useCreateActivityMutation
export default function CreateProjectActivity({
  open,
  setOpen,
  mainActivityInput,
  setMainActivityInput,
  refetch
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [createActivity, { isLoading }] = useCreateActivityMutation(); // RTK mutation

  const categoryOptions = [
    { label: 'Solar', value: 'solar' },
    { label: 'Wind', value: 'wind' },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!mainActivityInput || !selectedCategory) {
      // alert('Please fill in all fields.');
      toast.error("Please fill all fields")
      return;
    }

    try {
      await createActivity({
        solarOrWind: selectedCategory.value,
        activityName: mainActivityInput,
      }).unwrap();

      // alert('Activity added successfully!');
      toast.success("Activity added successfully!")
      setMainActivityInput('');
      setSelectedCategory(null);
      setOpen(false);
      refetch()
    } catch (error) {
      console.error('Failed to add activity:', error);
      // alert('Error adding activity. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { width: '600px' } }}
    >
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Project Main Activity</h2>

        <label className="block mb-1 text-[#29346B] text-lg font-semibold">Activity Name</label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={mainActivityInput}
          placeholder="Enter Activity Name"
          onChange={(e) => setMainActivityInput(e.target.value)}
        />

        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Select Category</label>
        <Autocomplete
          options={categoryOptions}
          getOptionLabel={(option) => option.label}
          value={selectedCategory}
          onChange={(event, newValue) => setSelectedCategory(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select a Activity Type"
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
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
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
            '&:hover': { backgroundColor: '#E66A1F' },
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
