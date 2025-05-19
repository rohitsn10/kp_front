import React from 'react';
import { TablePagination } from '@mui/material';

const UserTablePagination = ({ 
  filteredRowsLength, 
  page, 
  rowsPerPage, 
  handleChangePage, 
  handleChangeRowsPerPage 
}) => {
  return (
    <TablePagination
      component="div"
      count={filteredRowsLength}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      style={{
        borderTop: '1px solid #e0e0e0'
      }}
    />
  );
};

export default UserTablePagination;