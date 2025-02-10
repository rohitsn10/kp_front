import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useUpdateExpenseMutation } from '../../../api/expense/expenseApi';
import { Dialog, DialogActions, DialogContent, TextField, Autocomplete, CircularProgress, IconButton } from '@mui/material';
import { useGetLandCategoriesQuery } from '../../../api/users/categoryApi';

const ExpenseUpdateModal = ({ open, setOpen, refetch, expenseData }) => {
  const [updateExpense, { isLoading }] = useUpdateExpenseMutation();
  const { data: categories } = useGetLandCategoriesQuery();

  // Form state
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  
  // File handling state
  const [newFiles, setNewFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [removedFileIds, setRemovedFileIds] = useState([]);
    console.log("Expensesese",expenseData)
  // Initialize form with expense data
  useEffect(() => {
    if (expenseData) {
      setExpenseName(expenseData.expense_name || '');
      setExpenseAmount(expenseData.expense_amount || '');
      setNotes(expenseData.notes || '');
      setSelectedCategoryId('');
      setSelectedCategoryLabel('');
      setExistingFiles(expenseData.expense_document_attachments || []);
      setRemovedFileIds([]);
    }
  }, [expenseData]);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setExpenseName('');
    setExpenseAmount('');
    setNotes('');
    setSelectedCategoryId(null);
    setSelectedCategoryLabel('');
    setNewFiles([]);
    setExistingFiles([]);
    setRemovedFileIds([]);
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleRemoveExistingFile = (fileId) => {
    // Add file ID to removedFileIds array if not already present
    if (!removedFileIds.includes(fileId)) {
      setRemovedFileIds(prev => [...prev, fileId]);
    }
    // Remove file from existingFiles display
    setExistingFiles(prev => prev.filter(file => file.id !== fileId));
  };

//   const handleSubmit = async () => {
//     if (!expenseData?.id || !expenseName || !expenseAmount || !selectedCategoryId) {
//       alert("Required fields must be filled out.");
//       return;
//     }

//     if (existingFiles.length === 0 && newFiles.length === 0) {
//       alert("At least one file is required.");
//       return;
//     }

//     try {
//       const formData = new FormData();
      
//       // Append basic fields
//       formData.append('project_id', expenseData.project);
//       formData.append('expense_name', expenseName);
//       formData.append('expense_amount', expenseAmount);
//       formData.append('notes', notes);
//       formData.append('category_id', selectedCategoryId);
      
//       // Append new files
//       newFiles.forEach(file => {
//         formData.append('expense_document_attachments', file);
//       });

//       // Append all removed file IDs as a single array
//       if (removedFileIds.length > 0) {
//         removedFileIds.forEach(id => {
//           formData.append('remove_expense_document_attachments', id);
//         });
//       }

//       await updateExpense({ 
//         id: expenseData.id, 
//         data: formData 
//       }).unwrap();
      
//       refetch();
//       resetForm();
//       setOpen(false);
//     } catch (err) {
//       console.error("Error updating expense:", err);
//       alert("Failed to update expense. Please try again.");
//     }
//   };

const handleSubmit = async () => {
    if (!expenseData?.id || !expenseName || !expenseAmount || !selectedCategoryId) {
      alert("Required fields must be filled out.");
      return;
    }

    if (existingFiles.length === 0 && newFiles.length === 0) {
      alert("At least one file is required.");
      return;
    }

    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('project_id', expenseData.project);
      formData.append('expense_name', expenseName);
      formData.append('expense_amount', expenseAmount);
      formData.append('notes', notes);
      formData.append('category_id', selectedCategoryId);
      
      // Append new files
      newFiles.forEach(file => {
        formData.append('expense_document_attachments', file);
      });

      // Append removed file IDs as a single comma-separated string
      if (removedFileIds.length > 0) {
        formData.append('remove_expense_document_attachments', removedFileIds.join(','));
      }

      await updateExpense({ 
        id: expenseData.id, 
        data: formData 
      }).unwrap();
      
      refetch();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Failed to update expense. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Update Expense</h2>
        <div className="flex flex-col gap-3">
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
          
          <div className="flex flex-col gap-2 mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">Category</label>
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
                <TextField {...params} fullWidth placeholder="Select Category" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Existing Files {removedFileIds.length > 0 && `(${removedFileIds.length} marked for removal)`}
            </label>
            <div className="flex flex-col gap-2">
              {existingFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {file.url.split('/').pop()}
                  </a>
                  <IconButton onClick={() => handleRemoveExistingFile(file.id)} size="small">
                    X
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">Upload New Documents</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2"
              accept=".pdf,.doc,.docx,.xlsx,.xls"
            />
            {newFiles.length > 0 && (
              <div className="text-sm text-green-600 mt-1">
                {newFiles.length} new file(s) selected
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
          disabled={isLoading || !expenseName || !expenseAmount || !selectedCategoryId || (existingFiles.length === 0 && newFiles.length === 0)}
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseUpdateModal;