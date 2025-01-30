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
import LocationModal from '../../components/pages/Location/createLocation';

function LocationListing() {
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  
  const rows = [
    { sr: 1, locationName: "Location 1", totalArea: "100 sq.ft", addedDate: "2024-01-01" },
    { sr: 2, locationName: "Location 2", totalArea: "200 sq.ft", addedDate: "2024-01-05" },
    { sr: 3, locationName: "Location 3", totalArea: "300 sq.ft", addedDate: "2024-01-10" },
    { sr: 4, locationName: "Location 4", totalArea: "400 sq.ft", addedDate: "2024-01-15" },
    { sr: 5, locationName: "Location 5", totalArea: "500 sq.ft", addedDate: "2024-01-20" },
    { sr: 6, locationName: "Location 6", totalArea: "600 sq.ft", addedDate: "2024-01-25" },
    { sr: 7, locationName: "Location 7", totalArea: "700 sq.ft", addedDate: "2024-02-01" },
    { sr: 8, locationName: "Location 8", totalArea: "800 sq.ft", addedDate: "2024-02-05" },
    { sr: 9, locationName: "Location 9", totalArea: "900 sq.ft", addedDate: "2024-02-10" },
    { sr: 10, locationName: "Location 10", totalArea: "1000 sq.ft", addedDate: "2024-02-15" },
    { sr: 11, locationName: "Location 11", totalArea: "1100 sq.ft", addedDate: "2024-03-01" },
    { sr: 12, locationName: "Location 12", totalArea: "1200 sq.ft", addedDate: "2024-03-05" },
    { sr: 13, locationName: "Location 13", totalArea: "1300 sq.ft", addedDate: "2024-03-10" },
    { sr: 14, locationName: "Location 14", totalArea: "1400 sq.ft", addedDate: "2024-03-15" },
    { sr: 15, locationName: "Location 15", totalArea: "1500 sq.ft", addedDate: "2024-03-20" },
  ];

  const filteredRows = rows.filter((row) =>
    row.locationName.toLowerCase().includes(locationFilter.toLowerCase())
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
            value={locationFilter}
            placeholder="Search"
            onChange={(e) => setLocationFilter(e.target.value)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          />
        </div>
        
        <div className="flex-grow flex justify-center">
          <h2 className="text-2xl text-[#29346B] font-semibold">Location Listing</h2>
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
            Add Location
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
                Location Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Total Area
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.sr}>
                <TableCell align="center" style={{ fontSize: '16px' }}>{row.sr}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.locationName}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.totalArea}</TableCell>
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
      <LocationModal
        open={open}
        setOpen={setOpen}
        locationInput={locationInput}
        setLocationInput={setLocationInput}
      />
    </div>
  );
}

export default LocationListing;