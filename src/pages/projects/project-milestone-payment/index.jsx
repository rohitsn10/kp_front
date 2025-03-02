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
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { useGetMilestonePaymentQuery } from '../../../api/milestonePayment/milestonePaymentApi';
import AddInvoiceModal from '../../../components/pages/milestones-payment/MilestonePaymentCreate';
import EditPaymentModal from '../../../components/pages/milestones-payment/MilestonePaymentUpdate';
// import { useGetMilestonePaymentQuery } from '../../../api/milestone/milestonePaymentApi';

function ProjectMilestonePayment() {
  const { milestoneId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error,refetch } = useGetMilestonePaymentQuery(milestoneId);
  const [createModalOpen,setCreateModal]=useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleCreateModalClose = ()=>{
    setCreateModal(false)
  }
  const handleEditModalOpen = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedPayment(null);
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
        <Alert severity="error">Failed to load milestone payments. Please try again later.</Alert>
      </div>
    );
  }

  const paymentRows = data?.data || [];

  // Filter payments based on the search query
  const filteredRows = paymentRows.filter((row) =>
    row.party_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[80%] mx-auto my-8 rounded-md">
      <div className="flex flex-row justify-around items-center py-6 mx-10">
        <TextField
          label="Search Payment"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-4"
        />

        <h2 className="text-3xl text-[#29346B] font-semibold text-center">
          Milestone Payments
        </h2>
        <Button
          onClick={() => setCreateModal(true)}
          style={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontWeight: 'bold',
            padding: '10px'
          }}
        >
          Add Milestone
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Party Name</TableCell>
              <TableCell align="center">Invoice Number</TableCell>
              <TableCell align="center">Total Amount</TableCell>
              <TableCell align="center">GST Amount</TableCell>
              <TableCell align="center">Paid Amount</TableCell>
              <TableCell align="center">Pending Amount</TableCell>
              <TableCell align="center">Payment Date</TableCell>
              <TableCell align="center">Notes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{row.party_name}</TableCell>
                  <TableCell align="center">{row.invoice_number}</TableCell>
                  <TableCell align="center">{row.total_amount}</TableCell>
                  <TableCell align="center">{row.gst_amount}</TableCell>
                  <TableCell align="center">{row.paid_amount}</TableCell>
                  <TableCell align="center">{row.pending_amount}</TableCell>
                  <TableCell align="center">{new Date(row.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{row.notes}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Payment">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditModalOpen(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No payments found
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
        <AddInvoiceModal
          open={createModalOpen}
          handleClose={handleCreateModalClose}
          milestoneId={milestoneId}
          refetch={refetch}  
        />
        {selectedPayment && (
          <EditPaymentModal
            open={editModalOpen}
            handleClose={handleEditModalClose}
            paymentData={selectedPayment}
            refetch={refetch}
          />
        )}
      </TableContainer>
    </div>
  );
}

export default ProjectMilestonePayment;
