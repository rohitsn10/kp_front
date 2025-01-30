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
import { AiOutlineStop } from "react-icons/ai";
import LandActivityModal from '../../components/pages/Land-back/createLand';

function LandListing() {
  const [landFilter, setLandFilter] = useState('');
  const [landActivity, setLandActivity] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [landActivityInput, setLandActivityInput] = useState('');
  
  const rows = [
    { sr: 1, type: "Agricultural", landActivityName: "Activity 1", addedDate: "2024-01-01" },
    { sr: 2, type: "Residential", landActivityName: "Activity 2", addedDate: "2024-01-05" },
    { sr: 3, type: "Commercial", landActivityName: "Activity 3", addedDate: "2024-01-10" },
    { sr: 4, type: "Agricultural", landActivityName: "Activity 4", addedDate: "2024-01-15" },
    { sr: 5, type: "Residential", landActivityName: "Activity 5", addedDate: "2024-01-20" },
    { sr: 6, type: "Commercial", landActivityName: "Activity 6", addedDate: "2024-01-25" },
    { sr: 7, type: "Agricultural", landActivityName: "Activity 7", addedDate: "2024-02-01" },
    { sr: 8, type: "Residential", landActivityName: "Activity 8", addedDate: "2024-02-05" },
    { sr: 9, type: "Commercial", landActivityName: "Activity 9", addedDate: "2024-02-10" },
    { sr: 10, type: "Agricultural", landActivityName: "Activity 10", addedDate: "2024-02-15" },
    { sr: 11, type: "Residential", landActivityName: "Activity 11", addedDate: "2024-03-01" },
    { sr: 12, type: "Commercial", landActivityName: "Activity 12", addedDate: "2024-03-05" },
    { sr: 13, type: "Agricultural", landActivityName: "Activity 13", addedDate: "2024-03-10" },
    { sr: 14, type: "Residential", landActivityName: "Activity 14", addedDate: "2024-03-15" },
    { sr: 15, type: "Commercial", landActivityName: "Activity 15", addedDate: "2024-03-20" },
  ];

  const filteredRows = rows.filter((row) =>
    row.landActivityName.toLowerCase().includes(landActivity.toLowerCase())
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

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex items-center">
          <TextField
            value={landActivity}
            placeholder="Search"
            onChange={(e) => setLandActivity(e.target.value)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          />
        </div>
        
        <div className="flex-grow flex justify-center">
          <h2 className="text-2xl text-[#29346B] font-semibold">Land Listing</h2>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="contained"
            style={{ 
              backgroundColor: '#f6812d', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '16px',
              textTransform: 'none' 
            }}
            onClick={() => setOpen(!open)}
          >
            Add Land Activity
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
                Type
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Land Activity Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Added Date
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" style={{ fontSize: '16px' }}>{row.sr}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.type}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.landActivityName}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.addedDate}</TableCell>
                <TableCell align="center" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 20
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
                  <AiOutlineStop
                    style={{  
                      cursor: 'pointer', 
                      color: 'red', 
                      fontSize: '23px', 
                      textAlign: 'center' 
                    }}
                    title="Delete"
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
      <LandActivityModal
        open={open}
        setOpen={setOpen}
        landActivityInput={landActivityInput}
        setLandActivityInput={setLandActivityInput}
      />
    </div>
  );
}

export default LandListing;
