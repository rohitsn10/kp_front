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
  TablePagination,
  TextField,
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import { AiOutlineStop } from 'react-icons/ai';
import { useGetSfaDataQuery } from '../../api/sfa/sfaApi';

const dummyData = [
  { id: 1, sfaName: "John Doe", siteVisitDate: "2025-02-01", visitStatus: "Completed", approvalStatus: "Approved", landTitle: "Yes", approveStatus: "Verified" },
  { id: 2, sfaName: "Jane Smith", siteVisitDate: "2025-02-05", visitStatus: "Pending", approvalStatus: "Under Review", landTitle: "No", approveStatus: "Pending" },
  { id: 3, sfaName: "Alice Brown", siteVisitDate: "2025-02-10", visitStatus: "Ongoing", approvalStatus: "Rejected", landTitle: "Yes", approveStatus: "Declined" },
];

const SiteVisitTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState("");
  const { data, isLoading, error, refetch } = useGetSfaDataQuery();
    console.log(data)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = dummyData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 w-[90%] mx-auto my-8 rounded-md">
      <div className="grid grid-cols-3 items-center p-4 mb-5">
        <TextField
          value={filter}
          placeholder="Search"
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '200px' }}
        />
        <h2 className="text-3xl text-[#29346B] font-semibold text-center">Site Visit Table</h2>
        <div className="flex justify-end">
          <Button
            variant="contained"
            style={{ backgroundColor: '#FF8C00', maxWidth: '200px', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          >
            Add Entry
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">SFA Name</TableCell>
              <TableCell align="center">Site Visit Date</TableCell>
              <TableCell align="center">Status of Site Visit</TableCell>
              <TableCell align="center">Approval Status</TableCell>
              <TableCell align="center">Land Title</TableCell>
              <TableCell align="center">Approve Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.sfaName}</TableCell>
                <TableCell align="center">{row.siteVisitDate}</TableCell>
                <TableCell align="center">{row.visitStatus}</TableCell>
                <TableCell align="center">{row.approvalStatus}</TableCell>
                <TableCell align="center">{row.landTitle}</TableCell>
                <TableCell align="center">{row.approveStatus}</TableCell>
                <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <RiEditFill style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }} title="Edit" />
                  <AiOutlineStop style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }} title="Delete" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={dummyData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />
    </div>
  );
};

export default SiteVisitTable;
