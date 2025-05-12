import React, { useEffect, useState } from 'react';
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
import CompanyModal from '../../../components/pages/General/Company/CreateCompanyDialogue';
import { useGetCompaniesQuery,useDeleteCompanyMutation,useUpdateCompanyMutation } from '../../../api/General/company/companyApi';

function CompanyPage() {
    const [companyFilter, setCompanyFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);  
    const [open, setOpen] = useState(false);
    const [companyInput, setCompanyInput] = useState('');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null); 
    const [updatedCompanyName, setUpdatedCompanyName] = useState(''); 

    const { data, isLoading, error, refetch } = useGetCompaniesQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
    const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);

    const handleUpdateCompany = async () => {
      if (!selectedCompany || !updatedCompanyName.trim()) return;
    
      try {
        await updateCompany({
          id: selectedCompany.id,
          companyData: { company_name: updatedCompanyName },
        }).unwrap();
        refetch();
        setEditModalOpen(false);
      } catch (error) {
        console.error("Failed to update company:", error);
      }
    };

    const handleDeleteCompany = async () => {
      if (!companyToDelete) return;

      try {
        await deleteCompany(companyToDelete.id).unwrap();
        setDeleteConfirmationOpen(false);
        refetch();
      } catch (error) {
        console.error("Failed to delete company:", error);
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
                <Alert severity="error">Failed to load companies. Please try again later.</Alert>
            </div>
        );
    }

    const filteredRows = data?.data?.filter(row =>
        row.company_name.toLowerCase().includes(companyFilter.toLowerCase())
    ) || [];

    const currentRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
            <div className="flex flex-row my-6 px-10 items-center justify-between">
                <TextField
                    value={companyFilter}
                    placeholder="Search"
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                />
                
                <h2 className="text-3xl text-[#29346B] font-semibold">Company Listing</h2>
                
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
                    onClick={() => setOpen(true)}
                >
                    Add Company
                </Button>
            </div>

            <TableContainer component={Paper} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#F2EDED' }}>
                            <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Sr No.</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>Company Name</TableCell>
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
                                    {row.company_name}
                                </TableCell>
                                <TableCell align="center">
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <RiEditFill
                                            style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                                            title="Edit"
                                            onClick={() => {
                                                setSelectedCompany(row);
                                                setUpdatedCompanyName(row.company_name);
                                                setEditModalOpen(true);
                                            }}
                                        />
                                        <DeleteIcon
                                            style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                                            title="Delete"
                                            onClick={() => {
                                                setCompanyToDelete(row);
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

            <CompanyModal
                open={open}
                setOpen={setOpen}
                companyInput={companyInput}
                setCompanyInput={setCompanyInput}
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
                    <p>Are you sure you want to delete this company? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteCompany}
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
                    <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Update Company</h2>
                    <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                        Company Name
                    </label>
                    <input
                        type="text"
                        className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                        value={updatedCompanyName}
                        placeholder="Enter Company Name"
                        onChange={(e) => setUpdatedCompanyName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
                    <Button
                        onClick={handleUpdateCompany}
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
                        {isUpdating ? 'Updating...' : 'Update Company'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CompanyPage;