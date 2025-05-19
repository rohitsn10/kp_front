import React from 'react';
import { TextField, Button } from '@mui/material';

const UserTableHeader = ({ userFilter, setUserFilter, handleOpenModal, handleGroupRedirect }) => {
  return (
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
          onClick={() => handleOpenModal()}
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
          onClick={() => handleGroupRedirect()}
        >
          Group List
        </Button>
      </div>
    </div>
  );
};

export default UserTableHeader;