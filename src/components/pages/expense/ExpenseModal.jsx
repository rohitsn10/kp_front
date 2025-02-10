import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useCreateExpenseMutation } from '../../../api/expense/expenseApi';
import { Dialog, DialogActions, DialogContent, TextField, Autocomplete, CircularProgress } from '@mui/material';
import { useGetLandCategoriesQuery } from '../../../api/users/categoryApi';

export default function ExpenseModal({ open, setOpen, refetch, id }) {
  const [projectID, setProjectID] = useState(id);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [files, setFiles] = useState([]);
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const { data: categories } = useGetLandCategoriesQuery();

  const handleClose = () => {
    setOpen(false);
    // Reset form when closing
    resetForm();
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const resetForm = () => {
    setExpenseName('');
    setExpenseAmount('');
    setNotes('');
    setSelectedCategoryId(null);
    setSelectedCategoryLabel('');
    setFiles([]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!projectID || !expenseName || !expenseAmount || !selectedCategoryId || files.length === 0) {
      alert("All fields are required, including at least one file.");
      return;
    }

    try {
      // Create FormData instance
      const formData = new FormData();
      
      // Append all text fields
      formData.append('project_id', projectID);
      formData.append('expense_name', expenseName);
      formData.append('expense_amount', expenseAmount);
      formData.append('notes', notes);
      formData.append('category_id', selectedCategoryId);
      
      // Append files
      files.forEach(file => {
        formData.append('expense_document_attachments', file);
      });

      // Submit the form
      await createExpense(formData).unwrap();
      
      // On success
      refetch();
      resetForm();
      setOpen(false);
      
    } catch (err) {
      console.error("Error creating expense:", err);
      alert("Failed to create expense. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Expense</h2>
        <div className='flex flex-col gap-3'>
          {/* Expense Name */}
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">Expense Name</label>
          <TextField
            label="Expense Name"
            variant="outlined"
            fullWidth
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="mb-4"
            required
          />

          <label className="block mb-1 text-[#29346B] text-lg font-semibold">Expense Amount</label>
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

          <label className="block mb-1 text-[#29346B] text-lg font-semibold">Expense Notes</label>
          <TextField
            label="Notes"
            variant="outlined"
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
          
          {/* Category Dropdown */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Category
            </label>
            <Autocomplete
              options={categories?.data?.map((category) => ({
                id: category.id,
                label: category.category_name,
              })) || []}
              value={selectedCategoryLabel ? { label: selectedCategoryLabel } : null}
              onChange={(_, value) => {
                setSelectedCategoryLabel(value?.label || '');
                setSelectedCategoryId(value?.id || null);
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
              accept=".pdf,.doc,.docx,.xlsx,.xls"
            />
            <div className="text-sm text-[#FF0000] mt-1">
              {files.length === 0 && "At least one file is required."}
            </div>
            {files.length > 0 && (
              <div className="text-sm text-green-600 mt-1">
                {files.length} file(s) selected
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !expenseName || !expenseAmount || !selectedCategoryId || files.length === 0}
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}