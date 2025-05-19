import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const AddEditUserModal = ({ 
  open, 
  handleCloseModal, 
  handleSaveUser,
  isEditMode,
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  address, setAddress,
  password, setPassword,
  userRole, setUserRole,
  dob, setDob,
  department, setDepartment,
  designation, setDesignation,
  profileImage, setProfileImage,
  previewImage, setPreviewImage,
  group, setGroup,
  departmentData,
  groupData,
  GroupLoading,
  GroupError,
  isCreating,
  isUpdating
}) => {
  return (
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
      >
        {isEditMode ? 'Edit User' : 'Add New User'}
      </DialogTitle>
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
                    src={previewImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                ) : profileImage && profileImage !== "http://127.0.0.1:8000/media/profile_image/default_profile.jpeg" ? (
                  <img
                    src={typeof profileImage === "string" ? profileImage : URL.createObjectURL(profileImage)}
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
                    setProfileImage(file);
                    setPreviewImage(URL.createObjectURL(file));
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
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
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {isEditMode && (
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
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
          disabled={isCreating || isUpdating} 
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
  );
};

export default AddEditUserModal;