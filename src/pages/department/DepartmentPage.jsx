import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import CreateDepartmentModal from '../../components/pages/department/CreateDepartmentModal';
import { useFetchDepartmentQuery } from '../../api/users/usersApi';

function DepartmentPage() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading, error, refetch } = useFetchDepartmentQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load departments. Please try again later.
        </div>
      </div>
    );
  }

  const filteredRows = data?.data?.filter(row =>
    row.department_name.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  const currentRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="mb-6">
        {/* Title - Always on top on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            Department Listing
          </h2>
        </div>
        
      {/* Search and Button Container */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <TextField
            value={filter}
            placeholder="Search departments..."
            onChange={(e) => setFilter(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            style={{ 
              backgroundColor: '#f9f9f9', 
              borderRadius: '8px'
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '14px', sm: '16px' }
              }
            }}
          />
        </div>

        {/* Add Button */}
        <div className="w-full sm:w-auto">
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: '#FF8C00',
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '14px', sm: '16px' },
              textTransform: 'none',
              padding: { xs: '10px 16px', sm: '8px 24px' },
              '&:hover': {
                backgroundColor: '#e67c00'
              }
            }}
          >
            Add Department
          </Button>
        </div>
      </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <TableContainer 
          component={Paper} 
          style={{ 
            borderRadius: '8px', 
            overflow: 'hidden',
            minWidth: '300px'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow style={{ backgroundColor: '#F2EDED' }}>
                <TableCell 
                  align="center" 
                  style={{ 
                    fontWeight: 'normal', 
                    color: '#5C5E67', 
                    fontSize: '14px',
                    padding: '12px 8px'
                  }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Sr No.
                </TableCell>
                <TableCell 
                  align="center" 
                  style={{ 
                    fontWeight: 'normal', 
                    color: '#5C5E67'
                  }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Department Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow 
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '14px', sm: '16px', md: '20px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    style={{ color: '#1D2652' }}
                    sx={{
                      fontSize: { xs: '14px', sm: '16px', md: '20px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                      wordBreak: 'break-word'
                    }}
                  >
                    {row.department_name}
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
            sx={{
              '& .MuiTablePagination-toolbar': {
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '8px', sm: '16px' }
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: { xs: '12px', sm: '14px' }
              }
            }}
          />
        </TableContainer>
      </div>

      <CreateDepartmentModal
        open={open}
        setOpen={setOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        refetch={refetch}
      />
    </div>
  );
}

export default DepartmentPage;