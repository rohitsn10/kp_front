import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  List,
  ListItem,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useListAllItemsQuery, useSetProjectItemsMutation } from "../../../../api/quality/qualitySupplyApi";
import { useParams } from "react-router-dom";
// import { useListAllItemsQuery } from "../../../api/quality/qualitySupplyApi";

const SelectItemsModal = ({ open, handleClose, onItemsSelected }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
   const [setProjectItems, {isLoading:ItemLoading}]=useSetProjectItemsMutation();
   const {projectId} = useParams();
//    console.log(projectId)
//    console.log(">>>",onItemsSelected)
  // Fetch all items using RTK Query
  const {
    data: itemsResponse,
    isLoading,
    isError,
    error
  } = useListAllItemsQuery();

  // Apply filters and search
  useEffect(() => {
    if (!itemsResponse?.data || itemsResponse.data.length === 0) {
      setFilteredItems([]);
      return;
    }

    let result = [...itemsResponse.data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.item_name && item.item_name.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter((item) => item.item_category === filterCategory);
    }

    setFilteredItems(result);
  }, [itemsResponse, searchTerm, filterCategory]);

  const handleToggleItem = (itemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };

//   const handleConfirm = async() => {
//     // Call the callback with the selected item IDs
//     const SubmitData = {
//         "project_id": projectId,
//         "item_id": selectedItems,
//         "is_active": true
//       }
//    let response =await setProjectItems(SubmitData).unwrap();
//     // onItemsSelected(selectedItems);

//     handleClose();
//   };
const handleConfirm = async () => {
    try {
      const SubmitData = {
        project_id: projectId,
        item_id: selectedItems,
        is_active: true
      };
      await setProjectItems(SubmitData).unwrap();
      if (onItemsSelected) {
        onItemsSelected(selectedItems);
      }
      handleClose();
    } catch (err) {
      console.error("Error submitting items:", err);
    }
  };

  // Get category display
  const getCategoryDisplay = (category) => {
    if (!category) return { label: "Not Set", description: "" };
    
    switch (category) {
      case "category_1":
        return { label: "Category 1", description: "Customer/Owner/EPC witness" };
      case "category_2":
        return { label: "Category 2", description: "Customer/Owner/EPC review" };
      case "category_3":
        return { label: "Category 3", description: "EPC inspection" };
      default:
        return { label: category, description: "" };
    }
  };

  const handleReset = () => {
    setSelectedItems([]);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: "#29346B", color: "white" }}>
        Select Items
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select items to add to your list. You've selected {selectedItems.length} items.
          </Typography>
        </Box>

        {/* Search and Filter Controls */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            variant="outlined"
            placeholder="Search by item name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: "200px" }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-filter-label">Filter Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filterCategory}
              label="Filter Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="category_1">Category 1</MenuItem>
              <MenuItem value="category_2">Category 2</MenuItem>
              <MenuItem value="category_3">Category 3</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
            }}
            sx={{
              borderColor: "#29346B",
              color: "#29346B",
              "&:hover": { borderColor: "#1e2756", backgroundColor: "#f0f0f0" }
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Items List with Checkboxes */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">
            {error?.data?.message || "Error loading items"}
          </Typography>
        ) : filteredItems.length === 0 ? (
          <Typography align="center" color="textSecondary">
            No items found. Try adjusting your filters.
          </Typography>
        ) : (
          <List sx={{ maxHeight: "400px", overflow: "auto" }}>
            {filteredItems.map((item, index) => {
              const categoryInfo = getCategoryDisplay(item.item_category);
              return (
                <React.Fragment key={item.id}>
                  <ListItem disablePadding>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleToggleItem(item.id)}
                          sx={{
                            color: "#29346B",
                            '&.Mui-checked': {
                              color: "#FACC15",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1">{item.item_name || 'Unnamed Item'}</Typography>
                          <Box display="flex" gap={2}>
                            <Typography variant="body2" color="textSecondary">
                              <b>Category:</b> {categoryInfo.label}
                            </Typography>
                            {item.dicipline && (
                              <Typography variant="body2" color="textSecondary">
                                <b>Discipline:</b> {item.dicipline}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            {categoryInfo.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ py: 1, width: '100%' }}
                    />
                  </ListItem>
                  {index < filteredItems.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleReset}
          sx={{ color: "#29346B" }}
        >
          Reset Selection
        </Button>
        <Box flexGrow={1} />
        <Button 
          onClick={handleClose}
          sx={{ color: "#29346B" }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedItems.length === 0}
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
          Select ({selectedItems.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectItemsModal;