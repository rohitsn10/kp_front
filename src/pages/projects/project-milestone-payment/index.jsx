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
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';

import { useGetMilestonePaymentQuery } from '../../../api/milestonePayment/milestonePaymentApi';
import AddInvoiceModal from '../../../components/pages/milestones-payment/MilestonePaymentCreate';
import EditPaymentModal from '../../../components/pages/milestones-payment/MilestonePaymentUpdate';
import RecordPaymentModal from '../../../components/pages/milestones-payment/RecordPaymentModal';

function ProjectMilestonePayment() {
  const { milestoneId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error, refetch } = useGetMilestonePaymentQuery(milestoneId);
  const [createModalOpen, setCreateModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleCreateModalClose = () => {
    setCreateModal(false);
  };

  const handleEditModalOpen = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedPayment(null);
  };

  const handleRecordPaymentOpen = (payment) => {
    setSelectedPayment(payment);
    setRecordPaymentModalOpen(true);
  };

  const handleRecordPaymentClose = () => {
    setRecordPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  // Calculate total paid and pending amount
  const calculatePaymentStatus = (payment) => {
    const totalAmount = parseFloat(payment.total_amount);
    const totalPaid = payment.payment_history?.reduce(
      (sum, history) => sum + parseFloat(history.amount_paid || 0), 
      0
    ) || 0;
    const pending = totalAmount - totalPaid;
    
    return {
      totalPaid: totalPaid.toFixed(2),
      pending: pending.toFixed(2),
      isFullyPaid: pending <= 0
    };
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

  const filteredRows = paymentRows.filter((row) =>
    row.party_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.project_name.toLowerCase().includes(searchQuery.toLowerCase())
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
          Add Invoice
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Project Name</TableCell>
              <TableCell align="center">Milestone Name</TableCell>
              <TableCell align="center">Party Name</TableCell>
              <TableCell align="center">Invoice Number</TableCell>
              <TableCell align="center">Total Amount</TableCell>
              <TableCell align="center">Amount Paid</TableCell>
              <TableCell align="center">Pending</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">GST Amount</TableCell>
              <TableCell align="center">Notes</TableCell>
              <TableCell align="center">Created Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                const paymentStatus = calculatePaymentStatus(row);
                return (
                  <TableRow key={row.id}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{row.project_name}</TableCell>
                    <TableCell align="center">{row.milestone_name}</TableCell>
                    <TableCell align="center">{row.party_name}</TableCell>
                    <TableCell align="center">{row.invoice_number}</TableCell>
                    <TableCell align="center">₹{parseFloat(row.total_amount).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        ₹{paymentStatus.totalPaid}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span style={{ color: paymentStatus.pending > 0 ? '#f44336' : '#4CAF50', fontWeight: 'bold' }}>
                        ₹{paymentStatus.pending}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {paymentStatus.isFullyPaid ? (
                        <Chip label="Paid" color="success" size="small" />
                      ) : paymentStatus.totalPaid > 0 ? (
                        <Chip label="Partial" color="warning" size="small" />
                      ) : (
                        <Chip label="Unpaid" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">₹{parseFloat(row.gst_amount).toFixed(2)}</TableCell>
                    <TableCell align="center">{row.notes || '-'}</TableCell>
                    <TableCell align="center">{new Date(row.created_at).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Invoice">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditModalOpen(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Record Payment">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleRecordPaymentOpen(row)}
                          disabled={paymentStatus.isFullyPaid}
                        >
                          <PaymentIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">
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
      </TableContainer>

      <AddInvoiceModal
        open={createModalOpen}
        handleClose={handleCreateModalClose}
        milestoneId={milestoneId}
        refetch={refetch}  
      />
      {selectedPayment && (
        <>
          <EditPaymentModal
            open={editModalOpen}
            handleClose={handleEditModalClose}
            paymentData={selectedPayment}
            refetch={refetch}
          />
          <RecordPaymentModal
            open={recordPaymentModalOpen}
            handleClose={handleRecordPaymentClose}
            invoiceData={selectedPayment}
            refetch={refetch}
          />
        </>
      )}
    </div>
  );
}

export default ProjectMilestonePayment;
