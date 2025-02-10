import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
// import { Pencil } from 'lucide-react';
import { useGetExpensesQuery } from '../../../api/expense/expenseApi';
import ExpenseModal from '../../../components/pages/expense/ExpenseModal';
import ExpenseUpdateModal from '../../../components/pages/expense/UpdateExpenseModal';

function ProjectExpensePage() {
  const { projectId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const { data, isLoading, error, refetch } = useGetExpensesQuery(projectId);

  const handleOpenUpdateModal = (expense) => {
    setSelectedExpense(expense);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedExpense(null);
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
        <Alert severity="error">Failed to load expenses. Please try again later.</Alert>
      </div>
    );
  }

  const expenseRows = data?.data || [];

  // Filter expenses based on the search query
  const filteredRows = expenseRows.filter((row) =>
    row.expense_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row justify-between items-center py-6 mx-10">
        <TextField
          label="Search Expense"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-4"
        />

        <h2 className="text-3xl text-[#29346B] font-semibold text-center">
          Project Expenses
        </h2>

        <Button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
            padding: '10px'
          }}
        >
          Add Expense
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Expense Name</TableCell>
              <TableCell align="center">Project Name</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{row.expense_name}</TableCell>
                  <TableCell align="center">{row.project_name}</TableCell>
                  <TableCell align="center">{row.expense_amount}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Expense">
                      <IconButton
                        onClick={() => handleOpenUpdateModal(row)}
                        size="small"
                        style={{ color: '#29346B' }}
                      >
                        {/* <Pencil className="h-5 w-5" /> */}
                        Edit
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No expenses found
                </TableCell>
              </TableRow>
            )}
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
        />
      </TableContainer>

      <ExpenseModal 
        open={open} 
        setOpen={setOpen} 
        refetch={refetch} 
        id={projectId} 
      />
      
      <ExpenseUpdateModal
        open={isUpdateModalOpen}
        setOpen={handleCloseUpdateModal}
        refetch={refetch}
        expenseData={selectedExpense}
      />
    </div>
  );
}

export default ProjectExpensePage;