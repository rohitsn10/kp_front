// First, create the EditCategoryModal component for the dropdown selection

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import { useUpdateQualityItemsMutation } from "../../../../api/quality/qualitySupplyApi";

const EditCategoryModal = ({ open, handleClose, item, projectId, onSuccess }) => {
  const [newCategory, setNewCategory] = useState(item?.item_category || "");
  const [updateQualityItems, { isLoading }] = useUpdateQualityItemsMutation();

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleSubmit = async () => {
    if (!item || !newCategory) return;

    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("item_category", newCategory);

    try {
      await updateQualityItems({ id: item.id, formData });
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating item category:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
        Edit Item Category
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Item: <strong>{item?.item_name || "N/A"}</strong> ({item?.item_number || "N/A"})
        </Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={newCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="category_1">Category 1 - Customer/Owner/EPC witness</MenuItem>
            <MenuItem value="category_2">Category 2 - Customer/Owner/EPC review</MenuItem>
            <MenuItem value="category_3">Category 3 - EPC inspection</MenuItem>
            <MenuItem value="other">Other Items</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading}
          sx={{
            bgcolor: "#FACC15",
            color: "#29346B",
            "&:hover": { bgcolor: "#e5b812" },
          }}
        >
          {isLoading ? "Updating..." : "Update Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryModal;