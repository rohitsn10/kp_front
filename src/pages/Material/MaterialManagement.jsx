import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, TablePagination } from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import DeleteIcon from '@mui/icons-material/Delete';
import AddMaterialModal from '../../components/pages/Material/addMaterialModal';
import EditMaterialModal from '../../components/pages/Material/editMaterialModel';

function MaterialManagementListing() {
  const [materialFilter, setMaterialFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false); // State for Add Material Modal
  const [openEditModal, setOpenEditModal] = useState(false); // State for Edit Material Modal
  const [selectedMaterial, setSelectedMaterial] = useState(null); // State for selected material

  // Mock data for material management
  const mockData = [
    { 
      id: 1, materialName: "Steel Beam", vendorName: "Vendor A", projectName: "Project X", uom: "Piece", 
      price: "₹50000", prNumber: "PR12345", poNumber: "PO12345", quantity: 100, 
      projectActivityName: "Construction", projectSubActivityName: "Foundation", projectSubSubActivityName: "Excavation" 
    },
    { 
      id: 2, materialName: "Concrete", vendorName: "Vendor B", projectName: "Project Y", uom: "Ton", 
      price: "₹38460", prNumber: "PR12346", poNumber: "PO12346", quantity: 200, 
      projectActivityName: "Construction", projectSubActivityName: "Walls", projectSubSubActivityName: "Concrete Pour" 
    },
    { 
      id: 3, materialName: "Cement", vendorName: "Vendor C", projectName: "Project Z", uom: "Bag", 
      price: "₹37420", prNumber: "PR12347", poNumber: "PO12347", quantity: 500, 
      projectActivityName: "Construction", projectSubActivityName: "Foundation", projectSubSubActivityName: "Mixing" 
    }
  ];

  const rows = mockData.map((item, index) => ({
    sr: index + 1,
    id: item.id, 
    materialName: item.materialName,
    vendorName: item.vendorName,
    projectName: item.projectName,
    uom: item.uom,
    price: item.price,
    prNumber: item.prNumber,
    poNumber: item.poNumber,
    quantity: item.quantity,
    projectActivityName: item.projectActivityName,
    projectSubActivityName: item.projectSubActivityName,
    projectSubSubActivityName: item.projectSubSubActivityName,
  }));

  const filteredRows = rows.filter((row) =>
    row.materialName.toLowerCase().includes(materialFilter.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handler for opening Edit Modal
  const handleEditClick = (material) => {
    setSelectedMaterial(material); 
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    alert(`Delete material with ID: ${id}`);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex items-center">
          <TextField
            value={materialFilter}
            placeholder="Search Material"
            onChange={(e) => setMaterialFilter(e.target.value)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          />
        </div>

        <div className="flex-grow flex justify-center">
          <h2 className="text-2xl text-[#29346B] font-semibold">Material Management</h2>
        </div>
        <div className="flex items-center">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#f6812d",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
            onClick={() => setOpenAddModal(true)} // Open Add Material modal
          >
            Add Material
          </Button>
        </div>
      </div>

      <TableContainer style={{ borderRadius: '8px', overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Sr No.
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Material Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Vendor Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Project Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                UOM
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Price
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                PR Number
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                PO Number
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Quantity
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Project Activity Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Project Sub-Activity Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Project Sub-Sub Activity Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row) => (
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
                <TableCell align="center">{row.projectActivityName}</TableCell>
                <TableCell align="center">{row.projectSubActivityName}</TableCell>
                <TableCell align="center">{row.projectSubSubActivityName}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-center items-center space-x-2">
                    <RiEditFill
                      onClick={() => handleEditClick(row)}
                      className="cursor-pointer text-[#f6812d] text-xl"
                    />
                    <DeleteIcon
                      onClick={() => handleDelete(row.id)}
                      className="cursor-pointer text-red-600 text-xl"
                    />
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

      {/* Add Material Modal */}
      <AddMaterialModal open={openAddModal} setOpen={setOpenAddModal} />

      {/* Edit Material Modal */}
      <EditMaterialModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        materialToEdit={selectedMaterial}
        onClose={() => setOpenEditModal(false)}
      />
    </div>
  );
}

export default MaterialManagementListing;
