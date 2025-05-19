// Updated UserTableContent.jsx
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Switch,
  Tooltip,
  ButtonGroup
} from '@mui/material';
import { RiEditFill, RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineStop } from "react-icons/ai";
import { MdAssignmentInd, MdVisibility } from "react-icons/md"; // Added visibility icon

const UserTableContent = ({ 
  isLoading, 
  error, 
  currentRows, 
  handleOpenModal, 
  handleUpdateStatus, 
  handleOpenPasswordModal,
  handleOpenAssignModal,
  handleOpenViewAssignmentsModal // New handler for viewing assignments
}) => {
  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <TableContainer style={{ borderRadius: '8px', overflowX: 'auto' }}>
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
            {/* Assignments Column */}
            <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
              Assignments
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currentRows?.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell align="center" style={{ fontSize: '16px' }}>{index + 1}</TableCell>
              <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.id}</TableCell>
              <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row.full_name}</TableCell>
              <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row?.designation || '--'}</TableCell>
              <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row?.email}</TableCell>
              <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>{row?.phone}</TableCell>
              <TableCell align="center">
                <RiEditFill
                  style={{ 
                    cursor: 'pointer', 
                    color: '#61D435', 
                    fontSize: '23px', 
                    textAlign: 'center' 
                  }}
                  title="Edit"
                  onClick={() => handleOpenModal(row)} 
                />
              </TableCell>
              <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652', maxWidth: '200px', overflowX: 'auto' }}>
                <Switch
                  checked={row.is_active}
                  onChange={() => handleUpdateStatus(row.id)}
                  color="primary"
                  inputProps={{ 'aria-label': 'User status toggle' }}
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
              {/* Assignment actions */}
              <TableCell align="center">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <Tooltip title="Assign Department, Project & Group">
                    <MdAssignmentInd
                      style={{ 
                        cursor: 'pointer', 
                        color: '#F6812D', 
                        fontSize: '23px'
                      }}
                      onClick={() => handleOpenAssignModal(row)}
                    />
                  </Tooltip>
                  <Tooltip title="View Assignments">
                    <MdVisibility
                      style={{ 
                        cursor: 'pointer', 
                        color: '#3f51b5', 
                        fontSize: '23px'
                      }}
                      onClick={() => handleOpenViewAssignmentsModal(row.id)}
                    />
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTableContent;