import React from 'react';
import { TextField, Button } from '@mui/material';

const UserTableHeader = ({ userFilter, setUserFilter, handleOpenModal, handleGroupRedirect }) => {
  return (
    <div className="mb-6">
      {/* Title - Always on top on mobile */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
          User Table
        </h2>
      </div>
      
      {/* Search and Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <TextField
            value={userFilter}
            placeholder="Search users..."
            onChange={(e) => setUserFilter(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            style={{ 
              backgroundColor: '#f9f9f9', 
              borderRadius: '8px'
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '14px', sm: '16px' }
              }
            }}
          />
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleOpenModal()}
            sx={{
              backgroundColor: '#FF8C00',
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '14px', sm: '16px' },
              textTransform: 'none',
              padding: { xs: '10px 16px', sm: '8px 24px' },
              '&:hover': {
                backgroundColor: '#e67c00'
              }
            }}
          >
            Add User
          </Button>
          
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleGroupRedirect()}
            sx={{
              backgroundColor: '#FF8C00',
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '14px', sm: '16px' },
              textTransform: 'none',
              padding: { xs: '10px 16px', sm: '8px 24px' },
              '&:hover': {
                backgroundColor: '#e67c00'
              }
            }}
          >
            Group List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTableHeader;