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
  TablePagination,
  TextField,
} from '@mui/material';
import PermitToWorkDialog from '../../../components/pages/hse/permitTowork/CreatePermitToWork';

const dummyPermits = [
  { id: 1, permitNo: "PTW-001", date: "2025-03-20", department: "ONM", type: "Cold Work", issuedFor: "Electrical Maintenance", validFrom: "Day (6 AM - 6 PM)", area: "Zone A", status: "Approved" },
  { id: 2, permitNo: "PTW-002", date: "2025-03-21", department: "Project", type: "Hot Work", issuedFor: "Welding", validFrom: "Night (6 PM - 6 AM)", area: "Zone B", status: "Pending" },
  { id: 3, permitNo: "PTW-003", date: "2025-03-22", department: "ONM", type: "Work at Height", issuedFor: "Roof Inspection", validFrom: "Day (6 AM - 6 PM)", area: "Zone C", status: "Completed" },
  { id: 4, permitNo: "PTW-004", date: "2025-03-23", department: "Safety", type: "Confined Space Entry", issuedFor: "Tank Cleaning", validFrom: "24 Hours", area: "Tank Area", status: "Approved" },
  { id: 5, permitNo: "PTW-005", date: "2025-03-24", department: "Maintenance", type: "Excavation", issuedFor: "Pipe Repair", validFrom: "Day (6 AM - 6 PM)", area: "Underground Area", status: "Rejected" },
  { id: 6, permitNo: "PTW-006", date: "2025-03-25", department: "Operations", type: "Electrical Work", issuedFor: "Panel Upgrade", validFrom: "Night (6 PM - 6 AM)", area: "Electrical Room", status: "Approved" },
  { id: 7, permitNo: "PTW-007", date: "2025-03-26", department: "Project", type: "Hot Work", issuedFor: "Cutting", validFrom: "Day (6 AM - 6 PM)", area: "Workshop", status: "Pending" },
  { id: 8, permitNo: "PTW-008", date: "2025-03-27", department: "ONM", type: "Work at Height", issuedFor: "Lighting Repair", validFrom: "Night (6 PM - 6 AM)", area: "High Bay", status: "Completed" },
  { id: 9, permitNo: "PTW-009", date: "2025-03-28", department: "Safety", type: "Confined Space Entry", issuedFor: "Sewer Inspection", validFrom: "24 Hours", area: "Sewer System", status: "Approved" },
  { id: 10, permitNo: "PTW-010", date: "2025-03-29", department: "Maintenance", type: "Excavation", issuedFor: "Cable Laying", validFrom: "Day (6 AM - 6 PM)", area: "External Area", status: "Rejected" },
  { id: 11, permitNo: "PTW-011", date: "2025-03-30", department: "Operations", type: "Electrical Work", issuedFor: "Motor Repair", validFrom: "Night (6 PM - 6 AM)", area: "Pump Room", status: "Approved" },
  { id: 12, permitNo: "PTW-012", date: "2025-03-31", department: "Project", type: "Cold Work", issuedFor: "Assembly", validFrom: "Day (6 AM - 6 PM)", area: "Assembly Line", status: "Pending" },
  { id: 13, permitNo: "PTW-013", date: "2025-04-01", department: "ONM", type: "Hot Work", issuedFor: "Grinding", validFrom: "Night (6 PM - 6 AM)", area: "Metal Shop", status: "Completed" },
  { id: 14, permitNo: "PTW-014", date: "2025-04-02", department: "Safety", type: "Work at Height", issuedFor: "Building Maintenance", validFrom: "Day (6 AM - 6 PM)", area: "Building Facade", status: "Approved" },
  { id: 15, permitNo: "PTW-015", date: "2025-04-03", department: "Maintenance", type: "Confined Space Entry", issuedFor: "Vessel Inspection", validFrom: "24 Hours", area: "Vessel Area", status: "Rejected" },
];

const PermitToWork = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPermits = dummyPermits.filter((permit) =>
    permit.permitNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredPermits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
     <h2 className="text-3xl text-[#29346B] font-semibold text-center">Permit to Work</h2>

      <div className="flex flex-row  flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Permit No."
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '300px' }}
        />
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)} 
            style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          >
            Create Permit to Work
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Permit No.</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Type of Permit</TableCell>
              <TableCell align="center">Permit Issued For</TableCell>
              <TableCell align="center">Valid From</TableCell>
              <TableCell align="center">Area</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((permit) => (
              <TableRow key={permit.id}>
                <TableCell align="center">{permit.permitNo}</TableCell>
                <TableCell align="center">{permit.date}</TableCell>
                <TableCell align="center">{permit.department}</TableCell>
                <TableCell align="center">{permit.type}</TableCell>
                <TableCell align="center">{permit.issuedFor}</TableCell>
                <TableCell align="center">{permit.validFrom}</TableCell>
                <TableCell align="center">{permit.area}</TableCell>
                <TableCell align="center">{permit.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredPermits.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />
            <PermitToWorkDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default PermitToWork;