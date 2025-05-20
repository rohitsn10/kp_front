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
// import CreateDepartmentModal from '../../../components/pages/Department/CreateDepartmentModal';
// import {
//   useFetchDepartmentQuery
// } from '../../../api/userApi';
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
        <CircularProgress size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">Failed to load departments. Please try again later.</Alert>
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

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <TextField
          value={filter}
          placeholder="Search"
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
        />

        <h2 className="text-3xl text-[#29346B] font-semibold">Department Listing</h2>

        <Button
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          onClick={() => setOpen(true)}
        >
          Add Department
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Sr No.</TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Department Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center" style={{ fontSize: '20px' }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center" style={{ fontSize: '20px', color: '#1D2652' }}>
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
        />
      </TableContainer>

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
