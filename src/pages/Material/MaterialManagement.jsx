import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddMaterialModal from '../../components/pages/Material/addMaterialModal.jsx';
import EditMaterialModal from '../../components/pages/Material/editMaterialModel.jsx';
import { useGetMaterialsQuery, useDeleteMaterialMutation } from '../../api/material/materialApi.js';
import InspectionModal from '../../components/pages/Material/addInspectionModal.jsx';
import { useNavigate } from 'react-router-dom';

function MaterialManagementListing() {
  const [materialFilter, setMaterialFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Handle Material Create & Edit Modal
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  // Handle Inspection Modal
  const [openAddInspectionModal, setOpenAddInspectionModal] = useState(false);
  const [openEditInspectionModal, setOpenEditInspectionModal] = useState(false);
  const navigate = useNavigate();
  // Select Material
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const { data: materialsData, refetch, isLoading, isError } = useGetMaterialsQuery();
  const [deleteMaterial] = useDeleteMaterialMutation();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Typography>Loading...</Typography>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Typography color="error">Error fetching materials data</Typography>
    </div>
  );

  const rows = materialsData?.map((item, index) => ({
    sr: index + 1,
    id: item.id,
    materialName: item.material_name,
    vendorName: item.vendor_name,
    projectName: item.project_name,
    uom: item.uom,
    price: item.price,
    prNumber: item.PR_number,
    poNumber: item.PO_number,
    quantity: item.quantity,
    status: item.status,
    materialRequiredDate: item.material_required_date,
    prDate: item.pr_date,
    poDate: item.po_date,
    paymentStatus: item.payment_status,
  })) || [];

  const filteredRows = rows.filter((row) => {
    const searchText = materialFilter.toLowerCase();
    return Object.values(row).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(searchText)
    );
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (material) => {
    setSelectedMaterial(material);
    setOpenEditModal(true);
  };

  const handleInspectionAdd = (material) => {
    setSelectedMaterial(material);
    setOpenAddInspectionModal(true);
  };

  const handleInspectionAddClose = (material) => {
    setSelectedMaterial(null);
    setOpenAddInspectionModal(false);
  };

  const handleInspectionEdit = (material) => {
    setSelectedMaterial(material);
    setOpenEditInspectionModal(true);
  };

  const handleViewInspection = (row) => {
    navigate(`/material-management/view-inspection/${row?.id}`)
  }

  const handleDeleteClick = (id) => {
    setMaterialToDelete(id);
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (materialToDelete) {
      await deleteMaterial(materialToDelete);
      refetch();
      setOpenConfirmModal(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section - Simple and Responsive */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Search Field */}
              <div className="order-2 sm:order-1">
                <TextField
                  value={materialFilter}
                  placeholder="Search Material"
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  variant="outlined"
                  size="small"
                  className="w-full sm:w-64"
                />
              </div>

              {/* Title */}
              <div className="order-1 sm:order-2 text-center">
                <h2 className="text-xl sm:text-2xl text-[#29346B] font-semibold">
                  Material Management
                </h2>
              </div>

              {/* Add Button */}
              <div className="order-3 flex justify-center sm:justify-end">
                <Button 
                  variant="contained" 
                  onClick={() => setOpenAddModal(true)}
                  sx={{
                    backgroundColor: "#f6812d", 
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    '&:hover': {
                      backgroundColor: "#e5711a"
                    }
                  }}
                  className="w-full sm:w-auto"
                >
                  Add Material
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section - Optional, remove if you don't want it */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Typography variant="h6" className="font-bold text-[#29346B]">
                  {filteredRows.length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Total Materials
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h6" className="font-bold text-green-600">
                  {filteredRows.filter(row => row.status === 'Active').length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Active
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h6" className="font-bold text-orange-600">
                  {filteredRows.filter(row => row.paymentStatus === 'Pending').length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Pending Payment
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h6" className="font-bold text-blue-600">
                  {new Set(filteredRows.map(row => row.vendorName)).size}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Vendors
                </Typography>
              </div>
            </div>
          </div>

          {/* Table Section - Responsive */}
          <div className="overflow-x-auto">
            <TableContainer>
              <Table sx={{ minWidth: 1400 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 60 }}>
                      Sr No.
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 150 }}>
                      Material Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 130 }}>
                      Vendor Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 130 }}>
                      Project Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 80 }}>
                      UOM
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 100 }}>
                      Price
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 120 }}>
                      PR Number
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 120 }}>
                      PO Number
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 80 }}>
                      Quantity
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 100 }}>
                      Actions
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 120 }}>
                      Inspection
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: { xs: "12px", sm: "14px" }, py: 2, minWidth: 120 }}>
                      View Inspection
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        {row.sr}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        <Box className="max-w-[150px]">
                          <Typography variant="body2" className="font-medium truncate" title={row.materialName}>
                            {row.materialName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        <Box className="max-w-[130px]">
                          <Typography variant="body2" className="truncate" title={row.vendorName}>
                            {row.vendorName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        <Box className="max-w-[130px]">
                          <Typography variant="body2" className="truncate" title={row.projectName}>
                            {row.projectName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        {row.uom}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        <Typography variant="body2" className="font-medium">
                          ${row.price}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        {row.prNumber}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        {row.poNumber}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 2 }}>
                        <Typography variant="body2" className="font-medium">
                          {row.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Box className="flex justify-center items-center gap-1">
                          <Tooltip title="Edit Material">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(row)}
                              sx={{
                                backgroundColor: '#FFF7ED',
                                '&:hover': { backgroundColor: '#FFEDD5' }
                              }}
                            >
                              <RiEditFill className="text-[#f6812d] text-sm" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Material">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(row.id)}
                              sx={{
                                backgroundColor: '#FEF2F2',
                                '&:hover': { backgroundColor: '#FECACA' }
                              }}
                            >
                              <DeleteIcon className="text-red-600 text-sm" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AssignmentIcon />}
                          onClick={() => handleInspectionAdd(row)}
                          sx={{
                            backgroundColor: '#FF8C00',
                            color: 'white',
                            minWidth: '110px',
                            fontSize: { xs: '10px', sm: '12px' },
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#FF7700'
                            }
                          }}
                        >
                          Add Inspection
                        </Button>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewInspection(row)}
                          sx={{
                            minWidth: '110px',
                            fontSize: { xs: '10px', sm: '12px' },
                            textTransform: 'none'
                          }}
                        >
                          View Inspection
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid #e0e0e0",
              "& .MuiTablePagination-toolbar": {
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
                padding: { xs: 2, sm: 1 }
              }
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <AddMaterialModal open={openAddModal} setOpen={setOpenAddModal} />
      <EditMaterialModal open={openEditModal} setOpen={setOpenEditModal} materialToEdit={selectedMaterial} />

      <InspectionModal
        open={openAddInspectionModal}
        handleClose={handleInspectionAddClose}
        refetch={refetch}
        materialToEdit={selectedMaterial}
      />

      <Dialog 
        open={openConfirmModal} 
        onClose={() => setOpenConfirmModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { margin: { xs: 2, sm: 3 } }
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this material? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <Button onClick={() => setOpenConfirmModal(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MaterialManagementListing;