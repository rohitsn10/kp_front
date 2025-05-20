import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useCreateQualityItemsMutation } from "../../../../api/quality/qualitySupplyApi";

const AddItemForm = ({ open, handleClose, onItemAdded }) => {
  const [formData, setFormData] = useState({
    item_name: "",
    item_category: "",
    item_number: "",
    dicipline: "",
  });
  
  const [errors, setErrors] = useState({});
  const [createQualityItem, { isLoading, isError, error }] = useCreateQualityItemsMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.item_name.trim()) {
      newErrors.item_name = "Item name is required";
    }
    
    if (!formData.item_category) {
      newErrors.item_category = "Category is required";
    }
    
    if (!formData.item_number.trim()) {
      newErrors.item_number = "Item number is required";
    }
    
    if (!formData.dicipline.trim()) {
      newErrors.dicipline = "Discipline is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await createQualityItem(formData).unwrap();
      if (onItemAdded && response) {
        onItemAdded(response);
      }
      handleClose();
      // Reset form
      setFormData({
        item_name: "",
        item_category: "",
        item_number: "",
        dicipline: "",
      });
    } catch (err) {
      console.error("Error creating item:", err);
      // If server returns field-specific errors, display them
      if (err.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
        Add New Item
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {isError && (
              <Grid item xs={12}>
                <Alert severity="error">
                  {error?.data?.message || "Failed to create item. Please try again."}
                </Alert>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                name="item_name"
                label="Item Name"
                fullWidth
                value={formData.item_name}
                onChange={handleChange}
                error={!!errors.item_name}
                helperText={errors.item_name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.item_category} required>
                <InputLabel id="item-category-label">Category</InputLabel>
                <Select
                  labelId="item-category-label"
                  name="item_category"
                  value={formData.item_category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="">Select a category</MenuItem>
                  <MenuItem value="category_1">Category 1 (Customer/Owner/EPC witness)</MenuItem>
                  <MenuItem value="category_2">Category 2 (Customer/Owner/EPC review)</MenuItem>
                  <MenuItem value="category_3">Category 3 (EPC inspection)</MenuItem>
                </Select>
                {errors.item_category && (
                  <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 1.75 }}>
                    {errors.item_category}
                  </Box>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="item_number"
                label="Item Number"
                fullWidth
                value={formData.item_number}
                onChange={handleChange}
                error={!!errors.item_number}
                helperText={errors.item_number}
                required
                placeholder="e.g., PV-1034"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="dicipline"
                label="Discipline"
                fullWidth
                value={formData.dicipline}
                onChange={handleChange}
                error={!!errors.dicipline}
                helperText={errors.dicipline}
                required
                placeholder="e.g., Mechanical"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{ color: "#29346B" }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: "#FACC15",
              color: "#29346B",
              "&:hover": { bgcolor: "#e5b812" },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f5",
                color: "#bdbdbd"
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Item"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddItemForm;