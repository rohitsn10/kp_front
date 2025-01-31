// EditCategoryModal.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useUpdateLandCategoryMutation } from '../../../api/users/categoryApi';

const EditCategoryModal = ({ open, setOpen, selectedCategory, setSelectedCategory }) => {
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const [updateCategory, { isLoading, error }] = useUpdateLandCategoryMutation();

  // Populate the input field when the modal is opened
  useEffect(() => {
    if (selectedCategory) {
      setUpdatedCategoryName(selectedCategory.category_name);
    }
  }, [selectedCategory, open]);

  const handleUpdateCategory = async () => {
    try {
      if (!updatedCategoryName) return;  // Prevent submitting if the name is empty

      await updateCategory({
        id: selectedCategory.id,
        categoryData: { name: updatedCategoryName },
      }).unwrap();

      // After success, close the modal and reset state
      setOpen(false);
      setSelectedCategory(null);
      setUpdatedCategoryName('');
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <TextField
          label="Category Name"
          value={updatedCategoryName}
          onChange={(e) => setUpdatedCategoryName(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
        <Button onClick={handleUpdateCategory} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
      {error && <Alert severity="error">Failed to update the category. Please try again.</Alert>}
    </Dialog>
  );
};

export default EditCategoryModal;
