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
  Switch,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { RiEditFill, RiLockPasswordLine } from 'react-icons/ri';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { AiOutlineStop } from "react-icons/ai";
import { useCreateUserMutation, useFetchDepartmentQuery, useFetchUsersQuery, useUpdateUserMutation, useUpdateUserPasswordMutation, useUpdateUserStatusMutation } from '../../../../api/users/usersApi';
import { toast } from 'react-toastify';
import { Camera } from '@mui/icons-material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useNavigate } from 'react-router-dom';
import { useGetAllGroupsQuery } from '../../../../api/permission/permissionApi';

function UserTable() {
  // User Data fetch
  const { data: users, error, isLoading,refetch } = useFetchUsersQuery();
      const showSuccessToast = (message) => {
          toast.success(message);
        };
      const showErrorToast = (message)=>{
        toast.error(message)
      }
  // console.log(users)

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
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [group, setGroup] = useState("");
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const navigate = useNavigate();

    const { data:departmentData, error:DepartmentError, isLoading:DepartmentLoading } = useFetchDepartmentQuery();
      const { data: groupData, isLoading:GroupLoading, error:GroupError } = useGetAllGroupsQuery();
    
    // console.log("Department data",departmentData)
    const [updateUserStatus] = useUpdateUserStatusMutation();
    
    const [newPassword,setNewPassword] = useState('');
    const [newPasswordConfirm,setNewPasswordConfirm] = useState('')
    const [passwordModal,setPasswordModal] =useState(false);
    const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);

    const [updateUserPassword] =useUpdateUserPasswordMutation();
    const handleOpenModal = (user = null) => {
      // console.log(user)
      if (user) {
        setIsEditMode(true);
        setEmail(user?.email || '');
        setFullName(user?.full_name || '');
        setPhone(user?.phone || '');
        setAddress(user?.address || '');
        setPassword('');
        setDob(user?.dob || '');
        setDepartment(user?.department || '');
        setDesignation(user?.designation || '');
        // setProfileImage(null);
        setProfileImage(user?.profile_image || null);

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

    const handleGroupRedirect = ()=>{
      navigate('/user-groups')
    }

    const handleOpenPasswordModal = (user) => {
      setSelectedUserForPassword(user);
      setPasswordModal(true);
      setNewPassword('');
      setNewPasswordConfirm('');
    };

    const handleClosePasswordModal = () => {
      setPasswordModal(false);
      setNewPassword('');
      setNewPasswordConfirm('');
      setSelectedUserForPassword(null);
    };

    const handlePasswordReset = async () => {
      if (newPassword !== newPasswordConfirm) {
        // Handle password mismatch error
        showErrorToast("Password don't match.")
        return;
      }
  
      try {
        // Add your password reset API call here
       let response = await updateUserPassword({ userId: selectedUserForPassword.id, password: newPassword });
       if(!response?.data?.status){
        showErrorToast("Something went wrong.")
       }else{
        showSuccessToast("Password Update success.");
       }
        handleClosePasswordModal();
      } catch (error) {
        console.error('Password reset failed:', error);
        showErrorToast("Something went wrong.")
      }
    };

    const handleCloseModal = () => setOpen(false);

    const handleSaveUser = async () => {
      if (!email || !fullName || !phone) {
        toast.error('Please fill in all the required fields (email, full name, phone).');
        return; // Exit the function if any field is missing
      }

      const userPayload = { email, full_name: fullName, phone, address, password, user_role: userRole };
        
      if (isEditMode) {
        let editPayload = { email, full_name: fullName, phone, address, user_role: userRole,dob,department,designation,profileImage };
        // console.log("Edit payload",editPayload)
        const formData = new FormData();
        
        // Append all the text fields
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('user_role', JSON.stringify(userRole));
        formData.append('dob', dob);
        formData.append('department_id', department);
        formData.append('designation', designation);
        if (profileImage) {
          formData.append('profile_image', profileImage);
        }
        formData.append('group_id',group)
        // else{
        //   toast.error('Please select a profile image.');
        //   return;
        // }
        console.log("ProfilePic,",profileImage)
        await updateUser({userId:selectedUserId,formData:formData}); 

        refetch();
      } else {

        let response = await createUser(userPayload);
        // console.log(response);
        if(response?.data?.status){
          toast.success('User created successfully!');
          refetch();
        }else{
          toast.error(response?.data?.message)
        }

      }
      handleCloseModal();
    };

    const filteredRows = isLoading || !users ? [] : users.filter((row) =>
      row.full_name?.toLowerCase().includes(userFilter?.toLowerCase())
    );
    const handleUpdateStatus = async(id)=>{
      try{
        // console.log("User ID: status  ",id)
        await updateUserStatus({userId:id});
        // console.log("Status update success.")
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
          
          <div className="flex items-center gap-4">
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
            <Button
              variant="contained"
              style={{ 
                backgroundColor: '#FF8C00', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '16px',
                textTransform: 'none' 
              }}
              onClick={()=>handleGroupRedirect()}
            >
              Group List
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
                 Designation
                </TableCell>
                {/* <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Department
                </TableCell> */}
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
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Password Reset
              </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {currentRows?.map((row,index) => (
                <TableRow key={row.id}>
                  <TableCell align="center" style={{ fontSize: '16px' }}>{index+1}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.id}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row.full_name}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.designation || '--'}</TableCell>
                  {/* <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.department == 1 ?"Accounts": row?.department == 2?"Finance":'--' || '--'}</TableCell> */}
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row?.email}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row?.phone}</TableCell>
                  <TableCell align="center" style={{
                    // display: 'flex',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // gap:20
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
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>
                  <Switch
                    checked={row.is_active} // controls the state of the switch
                    onChange={(e) => handleUpdateStatus(row.id, e.target.checked)} // calls the update function with the new state
                    color="primary" // You can customize the color
                    inputProps={{ 'aria-label': 'User status toggle' }} // Optional: for accessibility
                  />
                  </TableCell>
                  <TableCell align="center">
                  <RiLockPasswordLine
                    style={{ 
                      cursor: 'pointer', 
                      color: '#29346B', 
                      fontSize: '23px', 
                      textAlign: 'center' 
                    }}
                    title="Reset Password"
                    onClick={() => handleOpenPasswordModal(row)}
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
        width: '70%',
        maxWidth: '800px',
      '@media (max-width: 600px)': {
        width: '90%',       
        maxWidth: 'none',  
      }
    }
  }}
            >
        <DialogTitle
          sx={{
            color:'#29346B',
            fontSize: '24px',
            fontWeight: '600',
            paddingTop:'30px',
            }}
        >{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name Input */}
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">
                Full Name <span className="text-red-600"> *</span>
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

{isEditMode && (
  <div className="flex flex-col items-center space-y-2">
    <label htmlFor="file-upload" className="cursor-pointer">
      {previewImage ? (
        <img
          src={previewImage} // Show new preview if available
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-lg"
        />
      ) : profileImage && profileImage !== "http://127.0.0.1:8000/media/profile_image/default_profile.jpeg" ? (
        <img
          src={typeof profileImage === "string" ? profileImage : URL.createObjectURL(profileImage)} // Show old profile image
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-lg"
        />
      ) : (
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <CameraAltIcon className="w-16 h-16 text-white" />
        </div>
      )}
    </label>
    <input
      id="file-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setProfileImage(file); // Store the actual file for upload
          setPreviewImage(URL.createObjectURL(file)); // Store the preview URL for display
        }
      }}
    />
    <p className="text-blue-900 font-medium text-sm">Upload Photo</p>
  </div>
)}



            {/* Email Input */}
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                Email <span className="text-red-600"> *</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                // disabled={true}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border m-1 p-3 rounded-md w-full  border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
              />
            </div>

            {/* Phone Input */}
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="phone" className="block text-lg font-medium text-gray-700">
                Phone <span className="text-red-600"> *</span>
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

            {!isEditMode && (
              <div className='col-span-2 md:col-span-1'>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                  Password <span className="text-red-600"> *</span>
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

            {isEditMode && (
      <div className='col-span-2 md:col-span-1'>
        <FormControl fullWidth>
          <label htmlFor="department" className="block text-lg font-medium text-gray-700 mb-2">
            Department
          </label>
          <Select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
            displayEmpty
            sx={{
              height: '50px',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
          >
            <MenuItem value="" disabled>
              <em>Select Department</em>
            </MenuItem>
            {departmentData?.data?.map((dept) => (
              <MenuItem key={dept.id} 
                // value={dept.id}>
                value={dept.id}>

                {dept.department_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )}
    {isEditMode &&(
      <div className='col-span-2 md:col-span-1'>
          {/* Group Dropdown */}
    <FormControl fullWidth className="mt-4">
      <label htmlFor="group" className="block text-lg font-medium text-gray-700 mb-2">
        Group
      </label>
      {GroupLoading && <p>Loading groups...</p>}
      {GroupError && <p className="text-red-500">Failed to load groups</p>}
      {!GroupLoading && !GroupError && (
        <Select
          id="group"
          value={group}
          onChange={(event) => setGroup(event.target.value)}
          className="border rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
          displayEmpty
          sx={{
            height: '50px',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
        >
          <MenuItem value="" disabled>
            <em>Select Group</em>
          </MenuItem>
          {groupData?.data?.map((grp) => (
            <MenuItem key={grp.id} value={grp.id}>
              {grp.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
      </div>
    )}

            {/* Designation */}
            {isEditMode && (
              <div className='col-span-2 md:col-span-1'>
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
              <div className='col-span-2 md:col-span-1'>
              <label htmlFor="date" className="block text-lg font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Date of Birth"
                  className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
                />
              </div>
            )}

                        {/* Address Input */}
                        <div className='col-span-2'>
              <label htmlFor="address" className="block text-lg font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="  border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
              />
            </div>

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

            <Dialog 
        open={passwordModal} 
        onClose={handleClosePasswordModal}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            padding: '20px',
          }
        }}
      >
              <DialogTitle
                sx={{
                  color: '#29346B',
                  fontSize: '24px',
                  fontWeight: '600',
                  paddingTop: '20px',
                }}
              >
                Reset Password
              </DialogTitle>
              <DialogContent>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="border p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="border p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <Button
            onClick={handlePasswordReset}
            variant="contained"
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
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
}

export default UserTable