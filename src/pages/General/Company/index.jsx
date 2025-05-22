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
        <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
            {/* Responsive Header */}
            <div className="mb-6">
                {/* Title - Always on top on mobile */}
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
                        Company Listing
                    </h2>
                </div>
                
                {/* Search and Button Container */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
                        <TextField
                            value={companyFilter}
                            placeholder="Search companies..."
                            onChange={(e) => setCompanyFilter(e.target.value)}
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
                            Add Company
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
                                    style={{ fontWeight: 'normal', color: '#5C5E67' }}
                                    sx={{
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                    }}
                                >
                                    Sr No.
                                </TableCell>
                                <TableCell 
                                    align="center" 
                                    style={{ fontWeight: 'normal', color: '#5C5E67' }}
                                    sx={{
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                    }}
                                >
                                    Company Name
                                </TableCell>
                                <TableCell 
                                    align="center" 
                                    style={{ fontWeight: 'normal', color: '#5C5E67' }}
                                    sx={{
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                    }}
                                >
                                    Action
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
                                        {row.company_name}
                                    </TableCell>
                                    <TableCell 
                                        align="center"
                                        sx={{
                                            padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <RiEditFill
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    color: '#61D435', 
                                                    fontSize: '20px'
                                                }}
                                                title="Edit"
                                                onClick={() => {
                                                    setSelectedCompany(row);
                                                    setUpdatedCompanyName(row.company_name);
                                                    setEditModalOpen(true);
                                                }}
                                            />
                                            <DeleteIcon
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    color: 'red', 
                                                    fontSize: '20px'
                                                }}
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
                PaperProps={{
                    sx: {
                        margin: { xs: '16px', sm: '32px' },
                        width: { xs: 'calc(100% - 32px)', sm: 'auto' }
                    }
                }}
            >
                <DialogContent sx={{ padding: { xs: '16px', sm: '24px' } }}>
                    <h2 className="text-[#29346B] text-lg sm:text-2xl font-semibold mb-3 sm:mb-5">
                        Confirm Deletion
                    </h2>
                    <p className="text-sm sm:text-base">
                        Are you sure you want to delete this company? This action cannot be undone.
                    </p>
                </DialogContent>
                <DialogActions sx={{ padding: { xs: '8px 16px 16px', sm: '8px 24px 24px' } }}>
                    <Button 
                        onClick={() => setDeleteConfirmationOpen(false)} 
                        color="primary"
                        sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteCompany}
                        color="secondary"
                        disabled={isDeleting}
                        sx={{ fontSize: { xs: '14px', sm: '16px' } }}
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
                    sx: {
                        width: { xs: 'calc(100% - 32px)', sm: '600px' },
                        margin: { xs: '16px', sm: '32px' }
                    }
                }}
            >
                <DialogContent sx={{ padding: { xs: '16px', sm: '24px' } }}>
                    <h2 className="text-[#29346B] text-lg sm:text-2xl font-semibold mb-3 sm:mb-5">
                        Update Company
                    </h2>
                    <label className="block mb-1 text-[#29346B] text-base sm:text-lg font-semibold">
                        Company Name
                    </label>
                    <input
                        type="text"
                        className="border m-1 p-2 sm:p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none text-sm sm:text-base"
                        value={updatedCompanyName}
                        placeholder="Enter Company Name"
                        onChange={(e) => setUpdatedCompanyName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ 
                    justifyContent: 'center', 
                    padding: { xs: '16px', sm: '20px' },
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Button
                        onClick={handleUpdateCompany}
                        disabled={isUpdating}
                        sx={{
                            backgroundColor: '#F6812D',
                            color: '#FFFFFF',
                            fontSize: { xs: '14px', sm: '16px' },
                            padding: { xs: '8px 24px', sm: '6px 36px' },
                            width: { xs: '100%', sm: '250px' },
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