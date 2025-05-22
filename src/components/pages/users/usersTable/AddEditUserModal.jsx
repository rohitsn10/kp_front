import React, { useState, useEffect } from 'react';
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
  Checkbox,
  IconButton,
  InputAdornment,
  Chip,
  Box,
  OutlinedInput,
  ListItemText
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    score: 0
  });

  // Password validation function
  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    
    const score = [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    setPasswordStrength({
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      score
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isEditMode) {
      validatePassword(newPassword);
    }
  };

  // Handle user role change for multi-select
  const handleUserRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setUserRole(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',').map(Number) : value,
    );
  };

  // Get selected group names for display
  const getSelectedGroupNames = () => {
    if (!groupData?.data || !userRole.length) return [];
    return groupData.data
      .filter(group => userRole.includes(group.id))
      .map(group => group.name);
  };

  // Get password strength color and text
  const getPasswordStrengthInfo = () => {
    if (passwordStrength.score === 0) return { color: 'text-gray-400', text: 'Enter password' };
    if (passwordStrength.score <= 2) return { color: 'text-red-500', text: 'Weak' };
    if (passwordStrength.score <= 3) return { color: 'text-yellow-500', text: 'Fair' };
    if (passwordStrength.score <= 4) return { color: 'text-blue-500', text: 'Good' };
    return { color: 'text-green-500', text: 'Strong' };
  };

  const strengthInfo = getPasswordStrengthInfo();

  // Password requirement component
  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <CheckCircleIcon className="w-4 h-4 text-green-500" />
      ) : (
        <CancelIcon className="w-4 h-4 text-red-500" />
      )}
      <span className={met ? 'text-green-600' : 'text-red-600'}>{text}</span>
    </div>
  );

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

          {/* Enhanced Password Input */}
          {!isEditMode && (
            <div className='col-span-2'>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Password <span className="text-red-600"> *</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a secure password"
                  className="border m-1 p-3 pr-12 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 mb-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                    <span className={`text-sm font-semibold ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </span>
                  </div>
                  
                  {/* Strength Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2 ? 'bg-red-500' :
                        passwordStrength.score <= 3 ? 'bg-yellow-500' :
                        passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <PasswordRequirement 
                      met={passwordStrength.minLength} 
                      text="At least 8 characters" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasUppercase} 
                      text="One uppercase letter" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasLowercase} 
                      text="One lowercase letter" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasNumber} 
                      text="One number" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.hasSpecialChar} 
                      text="One special character" 
                    />
                  </div>
                </div>
              )}
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

          {/* Multi-Select Groups/Roles */}
          <div className="col-span-2">
            <FormControl fullWidth>
              <label htmlFor="userRole" className="block text-lg font-medium text-gray-700 mb-2">
                User Groups/Roles <span className="text-red-600"> *</span>
              </label>
              {GroupLoading && <p>Loading groups...</p>}
              {GroupError && <p className="text-red-500">Failed to load groups</p>}
              {!GroupLoading && !GroupError && (
                <Select
                  id="userRole"
                  multiple
                  value={userRole}
                  onChange={handleUserRoleChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getSelectedGroupNames().map((name) => (
                        <Chip 
                          key={name} 
                          label={name} 
                          size="small"
                          sx={{
                            backgroundColor: '#F6812D',
                            color: 'white',
                            '& .MuiChip-deleteIcon': {
                              color: 'white'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  className="border rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
                  sx={{
                    minHeight: '50px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  }}
                >
                  {groupData?.data?.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      <Checkbox checked={userRole.indexOf(group.id) > -1} />
                      <ListItemText primary={group.name} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
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
          disabled={isCreating || isUpdating || (!isEditMode && passwordStrength.score < 4) || userRole.length === 0} 
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