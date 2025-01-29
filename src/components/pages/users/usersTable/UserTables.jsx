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
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { AiOutlineStop } from "react-icons/ai";
import { useCreateUserMutation, useFetchUsersQuery, useUpdateUserMutation } from '../../../../api/users/usersApi';

function UserTable() {
  // User Data fetch
  const { data: users, error, isLoading } = useFetchUsersQuery();
  console.log(users)
  // State for User filter
    const [userFilter, setUserFilter] = useState('');
    // State for page 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
        
    // State for Input fields:
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // New state to handle add/edit mode
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState([1]); 

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const handleOpenModal = (user = null) => {
      if (user) {
        setIsEditMode(true);
        setEmail(user?.email || '');
        setFullName(user?.full_name || '');
        setPhone(user?.phone || '');
        setAddress(user?.address || '');
        setPassword(''); // Do not pre-fill password in edit mode
        setUserRole(user.user_role || [1]); // Assume user role is passed as an array
      } else {
        setIsEditMode(false);
        setEmail('');
        setFullName('');
        setPhone('');
        setAddress('');
        setPassword('');
        setUserRole([1]);
      }
      setOpen(true);
    };

    const handleCloseModal = () => setOpen(false);

    const handleSaveUser = async () => {
      const userPayload = { email, full_name: fullName, phone, address, password, user_role: userRole };
  
      if (isEditMode) {
        await updateUser(userPayload); // Edit existing user
      } else {
        await createUser(userPayload); // Create new user
      }
  
      handleCloseModal();
    };

    const filteredRows = isLoading ? [] : users.filter((row) =>
      row.full_name.toLowerCase().includes(userFilter.toLowerCase())
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
              value={userFilter}
              placeholder="Search Name"
              onChange={(e) => setUserFilter(e.target.value)}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
            />
          </div>
          
          <div className="flex-grow flex justify-center">
            <h2 className="text-3xl text-[#29346B] font-semibold">User Table</h2>
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
              onClick={()=>handleOpenModal()}
            >
              Add User
            </Button>
          </div>
        </div>
              
        <TableContainer style={{ borderRadius: '8px', overflow: 'hidden' }}>
                {/* Show Loading or Error Message */}
                {isLoading && (
          <div className="loading-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            color: '#1D2652', 
            fontSize: '18px' 
          }}>
            <CircularProgress style={{ marginRight: '10px' }} size={24} />
            Loading User Data...
          </div>
        )}

        {error && (
          <div className="error-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100px', 
            backgroundColor: '#f8d7da', 
            borderRadius: '8px', 
            color: '#721c24', 
            fontSize: '18px' 
          }}>
            <AiOutlineStop style={{ marginRight: '10px', fontSize: '24px' }} />
            Error Fetching User Data.
          </div>
        )}

        {users && !isLoading && !error && (
          <div>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#F2EDED' }}>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Sr No.
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                 Employee ID
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Name
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  User Role
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Department
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Email
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Contact no.
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {currentRows?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center" style={{ fontSize: '16px' }}>1</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.id}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.full_name}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>--</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>--</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.email}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.phone}</TableCell>
                  <TableCell align="center" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap:20
                  }}>
                    <RiEditFill
                      style={{ 
                        cursor: 'pointer', 
                        color: '#61D435', 
                        fontSize: '23px', 
                        textAlign: 'center' 
                      }}
                      title="Edit"
                      onClick={()=>{
                        handleOpenModal({
                          email: row.email,
                          full_name: row.full_name,
                          phone: row.phone,
                          address: row,
                          user_role: [1],
                        })
                      }} 
                    />
                    <AiOutlineStop
                      style={{ 
                        cursor: 'pointer', 
                        color: 'red', 
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
          </div>)}
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
            {/* Dialog */}
            <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
        <input
  type="text"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  placeholder="Full Name"
  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
/>

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
/>

<input
  type="text"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone"
  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
/>

<input
  type="text"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  placeholder="Address"
  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
/>

{!isEditMode && (
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
  />
)}

          {/* Role Selection */}
          <FormControlLabel
            control={
              <Checkbox
                checked={userRole.includes(1)}
                onChange={(e) => {
                  const updatedRoles = e.target.checked
                    ? [...userRole, 1]
                    : userRole.filter((role) => role !== 1);
                  setUserRole(updatedRoles);
                }}
              />
            }
            label="Role 1"
          />
        </DialogContent>
        <DialogActions 
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center'
          }}
        > 
          {/* <Button onClick={handleCloseModal} color="secondary">Cancel</Button> */}
          <Button 
            onClick={handleSaveUser} 
            color="primary" 
            // disabled={isCreating || isUpdating} 
            variant="contained"
            type="submit"
            sx={{
                  backgroundColor: '#F6812D', // Orange background color
                  color: '#FFFFFF', // White text color
                  fontSize: '16px', // Slightly larger text
                  padding: '6px 36px', // Makes the button bigger (adjust width here)
                  width: '200px', // Explicit width for larger button
                  borderRadius: '8px', // Rounded corners
                  textTransform: 'none', // Disables uppercase transformation
                  fontWeight: 'bold', // Makes the text bold
                  '&:hover': {
                    backgroundColor: '#E66A1F', // Slightly darker orange on hover
                  },
                }}
          >
            {isCreating || isUpdating ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create User')}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
}

export default UserTable