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
  Alert,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import DeleteIcon from '@mui/icons-material/Delete';
import ElectricityLineModal from '../../../components/pages/General/Electricity-line/CreateElectricityLineDialogue';
import {
  useGetElectricityLinesQuery,
  useCreateElectricityLineMutation,
  useUpdateElectricityLineMutation,
  useDeleteElectricityLineMutation
} from '../../../api/General/Electricity-line/ElectricityLineApi';

// Helper function to normalize electricity_line field
const normalizeElectricityLine = (line) => {
  if (!line) return '';
  try {
    const parsed = JSON.parse(line.replace(/'/g, '"')); // Handle single quotes
    return parsed.name || line;
  } catch {
    return line;
  }
};

function ElectricityLinePage() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { data, isLoading, error, refetch } = useGetElectricityLinesQuery();
  const [updateElectricityLine, { isLoading: isUpdating }] = useUpdateElectricityLineMutation();
  const [deleteElectricityLine, { isLoading: isDeleting }] = useDeleteElectricityLineMutation();

  const handleUpdateItem = async () => {
    if (!selectedItem || !updatedName.trim()) return;
    try {
      await updateElectricityLine({
        id: selectedItem.id,
        line: updatedName
      }).unwrap();
      refetch();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update electricity line:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await deleteElectricityLine(itemToDelete.id).unwrap();
      setDeleteConfirmationOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to delete electricity line:", error);
    }
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
        <Alert severity="error">Failed to load electricity lines. Please try again later.</Alert>
      </div>
    );
  }

  const filteredRows = data?.data?.filter(row =>
    normalizeElectricityLine(row.electricity_line).toLowerCase().includes(filter.toLowerCase())
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

        <h2 className="text-3xl text-[#29346B] font-semibold">Electricity Line Listing</h2>

        <Button
          variant="contained"
          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          onClick={() => setOpen(true)}
        >
          Add Electricity Line
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Sr No.</TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Electricity Line Name</TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center" style={{ fontSize: '20px' }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center" style={{ fontSize: '20px', color: '#1D2652' }}>
                  {normalizeElectricityLine(row.electricity_line)}
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <RiEditFill
                      style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                      title="Edit"
                      onClick={() => {
                        setSelectedItem(row);
                        setUpdatedName(normalizeElectricityLine(row.electricity_line));
                        setEditModalOpen(true);
                      }}
                    />
                    <DeleteIcon
                      style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                      title="Delete"
                      onClick={() => {
                        setItemToDelete(row);
                        setDeleteConfirmationOpen(true);
                      }}
                    />
                  </div>
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

      <ElectricityLineModal
        open={open}
        setOpen={setOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        refetch={refetch}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Confirm Deletion</h2>
          <p>Are you sure you want to delete this electricity line? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteItem}
            color="secondary"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: '600px',
          },
        }}
      >
        <DialogContent>
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Update Electricity Line</h2>
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Electricity Line Name
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={updatedName}
            placeholder="Enter Electricity Line Name"
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
          <Button
            onClick={handleUpdateItem}
            disabled={isUpdating}
            sx={{
              backgroundColor: '#F6812D',
              color: '#FFFFFF',
              fontSize: '16px',
              padding: '6px 36px',
              width: '250px',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#E66A1F',
              },
            }}
          >
            {isUpdating ? 'Updating...' : 'Update Electricity Line'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ElectricityLinePage;
