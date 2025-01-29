import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete } from '@mui/material';

export default function ProjectMultipleActivity({
  open,
  setOpen,
  multipleActivityInput,
  setMultipleActInput,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Education', value: 'education' },
    { label: 'Finance', value: 'finance' },
  ];

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit=()=>{
    console.log("Multiple Activity Input:",multipleActivityInput)
    console.log("Dropdown:",selectedCategory)
  }

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
        <DialogContent>
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Multiple Activities</h2>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Activity Name
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none "
            value={multipleActivityInput}
            placeholder="Enter Category Name"
            onChange={(e) =>{setMultipleActInput(e.target.value)}}
          />

          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Sub Activity
          </label>
          <Autocomplete
            options={categoryOptions}
            getOptionLabel={(option) => option.label}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
              className='outline-none'

                {...params}
                variant="outlined"
                placeholder="Search and select a category"
                fullWidth
                sx={{
                '& .MuiOutlinedInput-root': {
                  border: '1px solid #FACC15', // Yellow border
                  borderBottom:'4px solid #FACC15',
                  borderRadius: '6px', // Rounded corners
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    border:'none',
                      borderRadius: '4px'
                    },
              }}
              />
            )}
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
