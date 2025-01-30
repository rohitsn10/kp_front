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
  DialogActions,
  Switch
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { AiOutlineStop } from "react-icons/ai";
import { useCreateUserMutation, useFetchUsersQuery, useUpdateUserMutation, useUpdateUserStatusMutation } from '../../../../api/users/usersApi';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

function UserTable() {
  // User Data fetch
  const { data: users, error, isLoading,refetch } = useFetchUsersQuery();
  console.log(users)
  // State for User filter
    const [userFilter, setUserFilter] = useState('');
    // State for page 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
    
    // State for Input fields:
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState([1]); 

    // Edit State:
    const [dob, setDob] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [updateUserStatus] = useUpdateUserStatusMutation();

    const handleOpenModal = (user = null) => {
      if (user) {
        console.log("User Editset",user)
        setIsEditMode(true);
        setEmail(user?.email || '');
        setFullName(user?.full_name || '');
        setPhone(user?.phone || '');
        setAddress(user?.address || '');
        setPassword('');
        setDob(user?.dob || '');
        setDepartment(user?.department || '');
        setDesignation(user?.designation || '');
        setProfileImage(null);
        setSelectedUserId(user?.id);
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
        let editPayload = { email, full_name: fullName, phone, address, user_role: userRole,dob,department,designation,profileImage };
        console.log("Edit payload",editPayload)
        const formData = new FormData();
        
        // Append all the text fields
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('user_role', JSON.stringify(userRole));
        formData.append('dob', dob);
        formData.append('department', department);
        formData.append('designation', designation);
        if (profileImage) {
          formData.append('profile_image', profileImage);
        }
        await updateUser({userId:selectedUserId,formData:formData}); 

        refetch();
      } else {

        await createUser(userPayload);
        refetch();
      }
      handleCloseModal();
    };

    const filteredRows = isLoading || !users ? [] : users.filter((row) =>
      row.full_name.toLowerCase().includes(userFilter.toLowerCase())
    );
    const handleUpdateStatus = async(id)=>{
      try{
        console.log("User ID: status  ",id)
        await updateUserStatus({userId:id});
        console.log("Status update success.")
        refetch();
      }catch(error){
        console.log(error)
      }
    }
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
      <div className="bg-white p-4 md:w-[90%] lg:w-[80%] mx-auto my-8 rounded-md">
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
            <h2 className="text-lg md:text-2xl lg:text-3xl text-[#29346B] font-semibold">User Table</h2>
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
              
        <TableContainer style={{ borderRadius: '8px', overflowX: 'auto' }}>
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
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {currentRows?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center" style={{ fontSize: '16px' }}>1</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.id}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row.full_name}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>--</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>--</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row?.email}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row?.phone}</TableCell>
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
                        handleOpenModal(
                          row
                        )
                        setSelectedUserId(row?.id)
                      }} 
                    />
                    {/* <AiOutlineStop
                      style={{ 
                        cursor: 'pointer', 
                        color: 'red', 
                        fontSize: '23px', 
                        textAlign: 'center' 
                      }}
                      title="Inactive"
                      onClick={()=>{
                        handleUpdateStatus(row.id)
                      }}
                    /> */}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>
                  <Switch
                    checked={row.is_active} // controls the state of the switch
                    onChange={(e) => handleUpdateStatus(row.id, e.target.checked)} // calls the update function with the new state
                    color="primary" // You can customize the color
                    inputProps={{ 'aria-label': 'User status toggle' }} // Optional: for accessibility
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
            <Dialog 
            open={open} 
            onClose={handleCloseModal}
            sx={{
    '& .MuiDialog-paper': {
      width: '60%',
      maxWidth: '800px',
    }
  }}
            >
        <DialogTitle
          sx={{
            color:'#29346B',
            fontSize: '24px',
            fontWeight: '600',
            paddingTop:'30px'
            }}
        >{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-lg font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
              />
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block text-lg font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
              />
            </div>

            {!isEditMode && (
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
                />
              </div>
            )}

            {/* Department ID */}
            {isEditMode && (
              <div>
                <label htmlFor="department" className="block text-lg font-medium text-gray-700">
                Department
                </label>
                <input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department"
                  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
                />
              </div>
            )}
            {/* Designation */}
            {isEditMode && (
              <div>
                <label htmlFor="designation" className="block text-lg font-medium text-gray-700">
                  Designation
                </label>
                <input
                  id="designation"
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Designation"
                  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
                />
              </div>
            )}
            {/* Date of Birth */}
            {isEditMode && (
              <div>
                <label htmlFor="date" className="block text-lg font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Date of Birth"
                  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
                />
              </div>
            )}

            {isEditMode && (
              <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />)
            }

            {/* Role Selection */}
            <div className="col-span-2">
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
                label="Admin 1"
              />
                            {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={userRole.includes(1)}
                    onChange={(e) => {
                      const updatedRoles = e.target.checked
                        ? [...userRole, 2]
                        : userRole.filter((role) => role !== 1);
                      setUserRole(updatedRoles);
                    }}
                  />
                }
                label="Manager"
              /> */}
            </div>

          </div>
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
                          backgroundColor: '#F6812D',
                          color: '#FFFFFF', 
                          fontSize: '16px',
                          padding: '6px 36px',
                          width: '200px',                           
                          borderRadius: '8px', 
                          textTransform: 'none', 
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: '#E66A1F',
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