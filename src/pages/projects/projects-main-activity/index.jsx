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
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { AiOutlineStop } from "react-icons/ai";
import CreateProjectActivity from '../../../components/pages/projects/ProjectActivity/CreateProjectActivity';

function ProjectMainActivityPage() {
    const [activityFilter, setActivityFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
    
    const [open,setOpen]=useState(false);
    const [mainActivityInput, setMainActivityInput] = useState('');
    
    const rows = [
        { sr: 1, type: "Solar", activityName: "Activity 1", addedDate: "2024-01-01", action: "Completed" },
        { sr: 2, type: "Wind", activityName: "Activity 2", addedDate: "2024-01-05", action: "Pending" },
        { sr: 3, type: "Solar", activityName: "Activity 3", addedDate: "2024-01-10", action: "Completed" },
        { sr: 4, type: "Wind", activityName: "Activity 4", addedDate: "2024-01-15", action: "Pending" },
        { sr: 5, type: "Solar", activityName: "Activity 5", addedDate: "2024-01-20", action: "Completed" },
        { sr: 6, type: "Wind", activityName: "Activity 6", addedDate: "2024-01-25", action: "Pending" },
        { sr: 7, type: "Solar", activityName: "Activity 7", addedDate: "2024-02-01", action: "Completed" },
        { sr: 8, type: "Wind", activityName: "Activity 8", addedDate: "2024-02-05", action: "Pending" },
        { sr: 9, type: "Solar", activityName: "Activity 9", addedDate: "2024-02-10", action: "Completed" },
        { sr: 10, type: "Wind", activityName: "Activity 10", addedDate: "2024-02-15", action: "Pending" },
        { sr: 11, type: "Solar", activityName: "Activity 11", addedDate: "2024-03-01", action: "Completed" },
        { sr: 12, type: "Wind", activityName: "Activity 12", addedDate: "2024-03-05", action: "Pending" },
        { sr: 13, type: "Solar", activityName: "Activity 13", addedDate: "2024-03-10", action: "Completed" },
        { sr: 14, type: "Wind", activityName: "Activity 14", addedDate: "2024-03-15", action: "Pending" },
        { sr: 15, type: "Solar", activityName: "Activity 15", addedDate: "2024-03-20", action: "Completed" },
      ];
    // Filter rows based on search
    const filteredRows = rows.filter((row) =>
      row.activityName.toLowerCase().includes(activityFilter.toLowerCase())
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
              value={activityFilter}
              placeholder="Search"
              onChange={(e) => setActivityFilter(e.target.value)}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
            />
          </div>
          
          <div className="flex-grow flex justify-center">
            <h2 className="text-3xl text-[#29346B] font-semibold">Activity Listing</h2>
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
              onClick={()=>setOpen(!open)}
            >
              Add Activity
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
                  Type
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Activity Name
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Added Date
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {currentRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center" style={{ fontSize: '16px' }}>{row.sr}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.type}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.activityName}</TableCell>
                  <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.addedDate}</TableCell>
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
              <CreateProjectActivity
                open={open}
                setOpen={setOpen}
                mainActivityInput={mainActivityInput}
                setMainActivityInput={setMainActivityInput}
              />
      </div>
    );
}

export default ProjectMainActivityPage