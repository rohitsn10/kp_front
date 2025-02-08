import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useCreateExpenseMutation } from '../../../api/expense/expenseApi'; // Import your createExpense hook
import { Dialog, DialogActions, DialogContent, TextField, Autocomplete, CircularProgress } from '@mui/material';
import { useGetLandCategoriesQuery } from '../../../api/users/categoryApi'; // Import the category API hook

export default function ExpenseModal({ open, setOpen, refetch,id }) {

  const [projectID,setProjectID] = useState(id);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State to store selected category ID
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState(''); // State to store the selected category label
  const [files, setFiles] = useState([]); // State to store uploaded files
  const [createExpense, { isLoading, error, isSuccess }] = useCreateExpenseMutation();

  const { data: categories } = useGetLandCategoriesQuery(); // Fetch categories

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async () => {
    // Validation before submission
    if (!projectID || !expenseName || !expenseAmount || !selectedCategoryId || files.length === 0) {
      alert("All fields are required, including at least one file.");
      return;
    }

    const expenseData = {
      project_id:projectID,
      expense_name: expenseName,
      expense_amount: expenseAmount,
      notes: notes,
      category_id: selectedCategoryId, // Add the selected category ID
      expense_document_attachments: Array.from(files), // Convert FileList to an array
    };

    try {
      // Call createExpense mutation with expenseData
      await createExpense(expenseData).unwrap();
      // Reset form fields after successful submission
      setExpenseName('');
      setExpenseAmount('');
      setNotes('');
      setSelectedCategoryId(null); // Clear the category after submission
      setSelectedCategoryLabel(''); // Clear the category label after submission
      setFiles([]); // Clear the files after submission
      refetch(); // Refresh the data after adding an expense
      setOpen(false); // Close the modal after submission
    } catch (err) {
      console.error("Error creating expense:", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Expense</h2>
        
        {/* Expense Name */}
        <TextField
          label="Expense Name"
          variant="outlined"
          fullWidth
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="mb-4"
          required
        />
        
        {/* Expense Amount */}
        <TextField
          label="Expense Amount"
          type="number"
          variant="outlined"
          fullWidth
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="mb-4"
          required
        />
        
        {/* Notes */}
        <TextField
          label="Notes"
          variant="outlined"
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mb-4"
        />
        
        {/* Category Dropdown (Autocomplete) */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Category
          </label>
          <Autocomplete
            options={categories?.data?.map((category) => ({
              id: category.id,
              label: category.category_name, // Display category name
            })) || []}
            value={selectedCategoryLabel ? { label: selectedCategoryLabel } : null} // Display selected label
            onChange={(_, value) => {
              setSelectedCategoryLabel(value?.label || ''); // Set the label value for display
              setSelectedCategoryId(value?.id || null); // Set the ID of the selected category
            }} 
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                placeholder="Select Category"
              />
            )}
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Upload Documents
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border p-2"
            required
          />
          <div className="text-sm text-[#FF0000] mt-1">
            {files.length === 0 && "At least one file is required."}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !expenseName || !expenseAmount || !selectedCategoryId || files.length === 0} // Disable if fields are empty
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? 'Adding...' : 'Add Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
