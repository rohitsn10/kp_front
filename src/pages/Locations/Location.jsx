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
import EditLocationModal from '../../components/pages/Location/editLocation'; // Import the EditLocationModal
import { useDeleteLandBankLocationMutation, useGetLandBankLocationsQuery } from '../../api/users/locationApi';
import DeleteIcon from '@mui/icons-material/Delete';

function LocationListing() {
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State for EditLocationModal
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selected location
  const [deleteLandBankLocation] = useDeleteLandBankLocationMutation();

  // Use the hook to fetch data
  const { data, error, isLoading, refetch } = useGetLandBankLocationsQuery();
  const handleDelete = async (id) => {
    try {
      await deleteLandBankLocation(id).unwrap(); // Perform the deletion
      alert("Land location deleted successfully!");
      refetch(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting land location:", error);
      alert("Failed to delete land location!");
    }
  };
  
  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const rows = data?.data?.map((item, index) => ({
    sr: index + 1,
    id: item.id, // Include the id for editing
    locationName: item.land_bank_name,
    totalArea: item.total_land_area,
    addedDate: new Date(item.created_at).toLocaleDateString(),
    nearByArea: item.near_by_area, // Include near_by_area for editing
    landBankId: item.land_bank_id, // Include land_bank_id for editing
  })) || [];

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

  const handleModalClose = () => {
    setOpen(false);
    refetch();  
  };

  // Handler for opening EditLocationModal
  const handleEditClick = (location) => {
    setSelectedLocation(location); // Set the selected location data
    setOpenEditModal(true); // Open the EditLocationModal
  };

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
                    onClick={() => handleEditClick(row)} // Open EditLocationModal on click
                  />
                          {/* <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(row.id)} // Delete the location
        >
          Delete
        </Button> */}
        <DeleteIcon
                      style={{ cursor: "pointer", color: "#df3d34", fontSize: "20px" }}
                      title="Delete"
                      onClick={() => handleDelete(row.id)} // Trigger delete on click
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

      {/* Add Location Modal */}
      <LocationModal
        open={open}
        setOpen={setOpen}
        locationInput={locationInput}
        setLocationInput={setLocationInput}
        onClose={handleModalClose}
      />

      {/* Edit Location Modal */}
      <EditLocationModal
        open={openEditModal} // State to control the modal
        setOpen={setOpenEditModal} // Function to close the modal
        locationToEdit={selectedLocation} // Pass the selected location data
        onClose={() => {
          setOpenEditModal(false); // Close the modal
          refetch(); // Refetch data after editing
        }}
      />
    </div>
  );
}

export default LocationListing;