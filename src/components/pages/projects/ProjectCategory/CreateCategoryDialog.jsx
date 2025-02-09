import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useCreateLandCategoryMutation } from '../../../../api/users/categoryApi';
import { Dialog, DialogActions, DialogContent } from '@mui/material';

export default function ProjectCategoryModal({
  open,
  setOpen,
  categoryInput,
  setCategoryInput,
  refetch
}) {
  const [createLandCategory, { isLoading, error, isSuccess }] = useCreateLandCategoryMutation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
     const categoryData = {
      name: categoryInput, // Assuming the API expects a 'name' field
    };

    try {
      await createLandCategory(categoryData).unwrap(); // .unwrap() gives you the result directly or throws an error
      setCategoryInput(''); // Clear input on success
      refetch();
      setOpen(false); // Close the modal on success
      
    } catch (err) {
      console.error("Error creating category:", err);
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
        <DialogContent>
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Category</h2>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Category Name
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none "
            value={categoryInput}
            placeholder="Enter Category Name"
            onChange={(e) => setCategoryInput(e.target.value)}
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
            disabled={isLoading} // Disable button while loading
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
            {isLoading ? 'Adding...' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}