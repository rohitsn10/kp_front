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
  TablePagination 
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import ProjectCategoryModal from '../../../components/pages/projects/ProjectCategory/CreateCategoryDialog';

function ProjectCategoryPage() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);  
    const [open,setOpen]=useState(false);
    const [categoryInput, setCategoryInput] = useState('');
  const rows = [
    { sr: 141, id: 1, categoryName: "Category 1" },
    { sr: 294, id: 2, categoryName: "Category 2" },
    { sr: 151, id: 3, categoryName: "Category 3" },
    { sr: 197, id: 4, categoryName: "Category 4" },
    { sr: 141, id: 5, categoryName: "Category 1" },
    { sr: 294, id: 6, categoryName: "Category 2" },
    { sr: 151, id: 7, categoryName: "Category 3" },
    { sr: 197, id: 9, categoryName: "Category 4" },
    { sr: 141, id: 8, categoryName: "Category 1" },
    { sr: 294, id: 211, categoryName: "Category 2" },
    { sr: 151, id: 32, categoryName: "Category 3" },
    { sr: 197, id: 43, categoryName: "Category 4" },
    { sr: 141, id: 14, categoryName: "Category 1" },
    { sr: 294, id: 255, categoryName: "Category 2" },
    { sr: 151, id: 361, categoryName: "Category 3" },
    { sr: 197, id: 40, categoryName: "Category 4" },
  ];
  
  // Filter rows based on search
  const filteredRows = rows.filter((row) =>
    row.categoryName.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page rows
  const currentRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex items-center">
          <TextField
            value={categoryFilter}
            placeholder="Search"
            onChange={(e) => setCategoryFilter(e.target.value)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          />
        </div>
        
        <div className="flex-grow flex justify-center">
          <h2 className="text-3xl text-[#29346B] font-semibold">Category Listing</h2>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="contained"
            style={{ 
              backgroundColor: '#FF8C00', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '16px',
              textTransform: 'none' 
            }}
            onClick={()=>setOpen(!open)}
          >
            Add Category
          </Button>
        </div>
      </div>

      <TableContainer style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Sr No.
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Category Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" style={{ fontSize: '20px' }}>{row.sr}</TableCell>
                <TableCell align="center" style={{ fontSize: '20px', color: '#1D2652' }}>{row.categoryName}</TableCell>
                <TableCell align="center" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <RiEditFill
                    style={{ 
                      cursor: 'pointer', 
                      color: '#61D435', 
                      fontSize: '23px', 
                      textAlign: 'center' 
                    }}
                    title="Edit"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          style={{
            borderTop: '1px solid #e0e0e0'
          }}
        />
      </TableContainer>
      <ProjectCategoryModal
        open={open}
        setOpen={setOpen}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
      />
    </div>
  );
}

export default ProjectCategoryPage;