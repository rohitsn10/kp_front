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
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography,
  TablePagination,
  TextField
} from '@mui/material';
import IncidentReportDialog from '../../../components/pages/hse/first-aid/CreateFirstAid';

function FirstAidRecord() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirstAid, setSelectedFirstAid] = useState(null);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openCreateDialog,setCreateDialog]=useState(false)
  const dummyFirstAid = [
    {
      "date": "2025-03-27",
      "name": "John Doe",
      "designation": "Safety Officer",
      "employee_of": "KP",
      "description": "Minor cut on left hand treated with antiseptic and bandage."
    },
    {
      "date": "2025-03-27",
      "name": "Alice Johnson",
      "designation": "Project Manager",
      "employee_of": "KP",
      "description": "Mild dehydration, provided with electrolyte solution."
    },
    {
      "date": "2025-03-27",
      "name": "Robert Smith",
      "designation": "Engineer",
      "employee_of": "Contractor",
      "description": "Bruise on right arm due to minor fall, ice pack applied."
    },
    {
      "date": "2025-03-27",
      "name": "Emily Brown",
      "designation": "Technician",
      "employee_of": "Contractor",
      "description": "Dust irritation in eyes, flushed with clean water."
    },
    {
      "date": "2025-03-27",
      "name": "Michael Lee",
      "designation": "Supervisor",
      "employee_of": "KP",
      "description": "Twisted ankle, provided with first aid and recommended rest."
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtering logic
  const filteredFirstAidRecords = dummyFirstAid.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employee_of.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredFirstAidRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openDescriptionModalHandler = (record) => {
    setSelectedFirstAid(record);
    setOpenDescriptionModal(true);
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">First Aid Records</h2>
      
      <div className="flex flex-row flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name, Designation, or Employee Of"
          variant="outlined"
          
        />
        <Button
          variant="contained"
          style={{ 
            backgroundColor: '#FF8C00', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            textTransform: 'none', 
            minHeight: 'auto' 
          }}
          onClick={()=>setCreateDialog(true)}
        >
          Add First Aid Record
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Designation</TableCell>
              <TableCell align="center">Employee Of</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((record, index) => (
              <TableRow key={index}>
                <TableCell align="center">{record.date}</TableCell>
                <TableCell align="center">{record.name}</TableCell>
                <TableCell align="center">{record.designation}</TableCell>
                <TableCell align="center">{record.employee_of}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => openDescriptionModalHandler(record)}
                  >
                    View Description
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredFirstAidRecords.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />

      {/* Description Modal */}
      <Dialog 
        open={openDescriptionModal} 
        onClose={() => setOpenDescriptionModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>First Aid Record Details</DialogTitle>
        <DialogContent>
          {selectedFirstAid && (
            <>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedFirstAid.name}
              </Typography>
              <Typography variant="body1">
                <strong>Designation:</strong> {selectedFirstAid.designation}
              </Typography>
              <Typography variant="body1">
                <strong>Employee Of:</strong> {selectedFirstAid.employee_of}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {selectedFirstAid.date}
              </Typography>
              
              <Typography variant="h6" gutterBottom className="mt-4">
                Description
              </Typography>
              <Typography variant="body1">
                {selectedFirstAid.description}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
      <IncidentReportDialog
        open={openCreateDialog}
        setOpen={setCreateDialog}
      />
    </div>
  );
}

export default FirstAidRecord;