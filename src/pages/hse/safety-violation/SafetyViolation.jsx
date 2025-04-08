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
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import CreateSafetyViolation from '../../../components/pages/hse/safetyViolation/CreateSafetyViolation';
import { useGetSafetyViolationReportQuery } from '../../../api/hse/safetyViolation/safetyViolatioApi';

const SafetyViolation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [createDialog, setCreateDialog] = useState(false);

  const { data, isLoading, error } = useGetSafetyViolationReportQuery();

  const safetyViolations = data?.data || [];

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = safetyViolations.filter((violation) =>
    violation.site_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <div className="text-center my-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" className="my-10">
        Failed to load safety violation reports.
      </Typography>
    );
  }

  return (
    <div className="bg-white p-4 md:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center">Safety Violations</h2>

      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Site Name"
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '300px' }}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => setCreateDialog(true)}
            variant="contained"
            style={{
              backgroundColor: '#FF8C00',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            Add Safety Violation
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No</TableCell>
              <TableCell align="center">Site</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Violator</TableCell>
              <TableCell align="center">Contractors</TableCell>
              <TableCell align="center">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((violation, index) => (
              <TableRow key={violation.id}>
                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="center">{violation.site_name}</TableCell>
                <TableCell align="center">
                  {new Date(violation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">{violation.issued_to_violator_name || 'N/A'}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleOpenDialog(
                        <div>
                          <h3>Contractors Involved:</h3>
                          <ul>
                            <li>{violation.contractors_name || 'No contractors listed'}</li>
                          </ul>
                        </div>
                      )
                    }
                  >
                    View Contractors
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() =>
                      handleOpenDialog(
                        <div>
                          <h3>Violation Details</h3>
                          <p>
                            <strong>Description:</strong>{' '}
                            {violation.description_safety_violation}
                          </p>
                          <p>
                            <strong>Action Taken:</strong> {violation.action_taken}
                          </p>
                        </div>
                      )
                    }
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
      </Dialog>

      <CreateSafetyViolation open={createDialog} setOpen={setCreateDialog} />
    </div>
  );
};

export default SafetyViolation;
