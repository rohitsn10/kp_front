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
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import DeleteIcon from '@mui/icons-material/Delete';
import AddMaterialModal from '../../components/pages/Material/addMaterialModal';
import EditMaterialModal from '../../components/pages/Material/editMaterialModel';
import { useGetMaterialsQuery, useDeleteMaterialMutation } from '../../api/users/materialApi';

function MaterialManagementListing() {
  const [materialFilter, setMaterialFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const { data: materialsData, isLoading, isError, refetch } = useGetMaterialsQuery();
  const [deleteMaterial] = useDeleteMaterialMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching materials data</div>;

  const rows = materialsData?.data?.map((item, index) => ({
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
  })) || [];

  const filteredRows = rows.filter((row) =>
    row.materialName && row.materialName.toLowerCase().includes(materialFilter.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (material) => {
    setSelectedMaterial(material);
    setOpenEditModal(true);
  };

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
    <div className="bg-white p-4 md:w-[90%] lg:w-[80%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <TextField
          value={materialFilter}
          placeholder="Search Material"
          onChange={(e) => setMaterialFilter(e.target.value)}
          variant="outlined"
          size="small"
        />
        <h2 className="text-2xl text-[#29346B] font-semibold">Material Management</h2>
        <Button variant="contained" style={{ backgroundColor: "#f6812d", color: "white" }} onClick={() => setOpenAddModal(true)}>
          Add Material
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Material Name</TableCell>
              <TableCell align="center">Vendor Name</TableCell>
              <TableCell align="center">Project Name</TableCell>
              <TableCell align="center">UOM</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">PR Number</TableCell>
              <TableCell align="center">PO Number</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.sr}</TableCell>
                <TableCell align="center">{row.materialName}</TableCell>
                <TableCell align="center">{row.vendorName}</TableCell>
                <TableCell align="center">{row.projectName}</TableCell>
                <TableCell align="center">{row.uom}</TableCell>
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">{row.prNumber}</TableCell>
                <TableCell align="center">{row.poNumber}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-center items-center space-x-2">
                    <RiEditFill onClick={() => handleEditClick(row)} className="cursor-pointer text-[#f6812d] text-xl" />
                    <DeleteIcon onClick={() => handleDeleteClick(row.id)} className="cursor-pointer text-red-600 text-xl" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddMaterialModal open={openAddModal} setOpen={setOpenAddModal} />
      <EditMaterialModal open={openEditModal} setOpen={setOpenEditModal} materialToEdit={selectedMaterial} />

      <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this material?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModal(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MaterialManagementListing;
