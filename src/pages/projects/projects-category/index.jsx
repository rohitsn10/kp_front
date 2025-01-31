import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectCategoryModal from '../../../components/pages/projects/ProjectCategory/CreateCategoryDialog';
import { useGetLandCategoriesQuery } from '../../../api/users/categoryApi';
import { useUpdateLandCategoryMutation, useDeleteLandCategoryMutation } from '../../../api/users/categoryApi';

function ProjectCategoryPage() {
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);  
    const [open, setOpen] = useState(false);
    const [categoryInput, setCategoryInput] = useState('');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [updatedCategoryName, setUpdatedCategoryName] = useState(''); 

    const { data, isLoading, error, refetch } = useGetLandCategoriesQuery();
    const [updateLandCategory, { isLoading: isUpdating }] = useUpdateLandCategoryMutation();
    const [deleteLandCategory, { isLoading: isDeleting }] = useDeleteLandCategoryMutation(); // Added hook for delete

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for the delete confirmation dialog
    const [categoryToDelete, setCategoryToDelete] = useState(null); // To hold the category to be deleted

    const handleUpdateCategory = async () => {
      if (!selectedCategory || !updatedCategoryName.trim()) return;
    
      try {
        await updateLandCategory({
          id: selectedCategory.id,
          categoryData: { name: updatedCategoryName },
        }).unwrap();
        refetch();
        setEditModalOpen(false);
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    };

    // Handle delete action
    const handleDeleteCategory = async () => {
      if (!categoryToDelete) return;

      try {
        await deleteLandCategory(categoryToDelete.id).unwrap(); // Perform the delete action
        setDeleteConfirmationOpen(false); // Close the confirmation dialog
        refetch(); // Refresh the category list after deletion
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress size={50} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert severity="error">Failed to load categories. Please try again later.</Alert>
            </div>
        );
    }

    const filteredRows = data?.data?.filter(row =>
        row.category_name.toLowerCase().includes(categoryFilter.toLowerCase())
    ) || [];

    const currentRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
            <div className="flex flex-row my-6 px-10 items-center justify-between">
                <TextField
                    value={categoryFilter}
                    placeholder="Search"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                />
                
                <h2 className="text-3xl text-[#29346B] font-semibold">Category Listing</h2>
                
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
                    onClick={() => setOpen(true)}
                >
                    Add Category
                </Button>
            </div>

            <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#F2EDED' }}>
                            <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Sr No.</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Category Name</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {currentRows.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell align="center" style={{ fontSize: '20px' }}>
                                    {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: '20px', color: '#1D2652' }}>
                                    {row.category_name}
                                </TableCell>
                                <TableCell align="center">
                                    <RiEditFill
                                      style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                                      title="Edit"
                                      onClick={() => {
                                        setSelectedCategory(row); 
                                        setUpdatedCategoryName(row.category_name); 
                                        setEditModalOpen(true);
                                      }}
                                    />
                                    <DeleteIcon style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                                      title="Delete"
                                      onClick={() => {
                                        setCategoryToDelete(row); // Set the category to delete
                                        setDeleteConfirmationOpen(true); // Open confirmation dialog
                                      }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredRows.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    style={{ borderTop: '1px solid #e0e0e0' }}
                />
            </TableContainer>

            <ProjectCategoryModal
                open={open}
                setOpen={setOpen}
                categoryInput={categoryInput}
                setCategoryInput={setCategoryInput}
                refetch={refetch}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogContent>
                    <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Confirm Deletion</h2>
                    <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteCategory}
                        color="secondary"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    style: {
                        width: '600px',
                    },
                }}
            >
                <DialogContent>
                    <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Update Category</h2>
                    <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                        Category Name
                    </label>
                    <input
                        type="text"
                        className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                        value={updatedCategoryName}
                        placeholder="Enter Category Name"
                        onChange={(e) => setUpdatedCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleUpdateCategory}
                        disabled={isUpdating}
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
                        {isUpdating ? 'Updating...' : 'Update Category'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectCategoryPage;
