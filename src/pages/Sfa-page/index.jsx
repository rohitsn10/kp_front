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
  CircularProgress,
  Alert,
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import { AiOutlineStop } from 'react-icons/ai';
import { useGetSfaDataQuery } from '../../api/sfa/sfaApi';
import AssessmentFormModal from '../../components/pages/sfa-form/sfa-form';
import AssessmentFormUpdateModal from '../../components/pages/sfa-form/sfaUpdate';
import AssessmentFormApproval from '../../components/pages/sfa-form/sfa-approval';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
// import CreateLandBank from '../../components/pages/Land-bank/createLandBank';
import CreateLandBankModal from '../../components/pages/Land-bank/createLandBank';

const SiteVisitTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState("");
  const { data, isLoading, isError, refetch } = useGetSfaDataQuery();
  const [openCreateSfa,setOpenCreateSpa] = useState(false)
  const [openUpdateSfa,setUpdateSfa] = useState(false);
  const [openApproveSfa,setOpenApproveSfa] = useState(false);
  const [openCreateLandBank,setCreateLandBank] =useState(false)

  const [activeItem,setActiveItem]=useState(null);

  const handleCloseSpa = ()=>{
    setOpenCreateSpa(!openCreateSfa)
  }
  const handleSfaUpdateClose = ()=>{
    setActiveItem(null)
    setUpdateSfa(!openUpdateSfa)
  }
  const handleSfaApproveClose=()=>{
    setActiveItem(null)
    setOpenApproveSfa(false)
  }

  const handleCreateLandBankClose = ()=>{
    setActiveItem(null)
    setCreateLandBank(false)
  }
  

  if (isLoading) {
    return <div className="flex justify-center mt-5"><CircularProgress /></div>;
  }

  if (isError) {
    return <Alert severity="error">Failed to load data. <Button onClick={refetch}>Retry</Button></Alert>;
  }

  const siteData = data?.data || [];
  console.log(siteData)
  const filteredRows = siteData?.filter((row) =>
    row.sfa_name?.toLowerCase().includes(filter?.toLowerCase())
  );

  const currentRows = filteredRows?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  return (
    <div className="bg-white p-4 w-[90%] mx-auto my-8 rounded-md">
      <div className="grid grid-cols-3 items-center p-4 mb-5">
        <TextField
          value={filter}
          placeholder="Search by Land Name"
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '200px' }}
        />
        <h2 className="text-3xl text-[#29346B] font-semibold text-center">Site Visit Table</h2>
        <div className="flex justify-end">
          <Button
          onClick={()=>{setOpenCreateSpa(true)}}
            variant="contained"
            style={{ backgroundColor: '#FF8C00', maxWidth: '200px', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
          >
            Add SFA
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center">SFA Name</TableCell>
              <TableCell align="center">Site Visit Date</TableCell>
              {/* <TableCell align="center">Status of Site Visit</TableCell> */}
              <TableCell align="center">Approval Status</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.sfa_name || 'N/A'}</TableCell>
                {/* <TableCell align="center">{row.site_visit_date || 'N/A'}</TableCell> */}
                {/* new Date(row.created_at).toLocaleDateString() */}
                <TableCell align="center">{new Date(row.site_visit_date).toLocaleDateString() || 'N/A'}</TableCell>

                <TableCell align="center">{row.status_of_site_visit || 'N/A'}</TableCell>
                {/* <TableCell align="center">{row.land_bank_status || 'Pending'}</TableCell> */}
                <TableCell align="center">{row.land_category_name || 'N/A'}</TableCell>
                <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <RiEditFill onClick={()=>{
                      setActiveItem(row);
                      setUpdateSfa(true)
                  }} style={{ cursor: 'pointer', color: '#61D435', fontSize: '27px' }} title="Edit" />
                  {/* <AiOutlineStop style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }} title="Delete" /> */}
                  <FactCheckIcon onClick={()=>{
                      setActiveItem(row);
                      setOpenApproveSfa(true)
                      console.log("set approve")
                  }}
                  style={{ cursor: 'pointer', color: '#f95406', fontSize: '27px' }}
                  />
                  <LibraryAddIcon
                    style={{ cursor: 'pointer', color: '#003bff', fontSize: '27px' }}
                    onClick={()=>{
                      setActiveItem(row);
                      // setOpenApproveSfa(true);
                      setCreateLandBank(true);
                      console.log("Add Land bank")
                  }}
                  />

                </TableCell>
                {/* <TableCell align="center">
                  <button onClick={()=>{
                    setActiveItem(row);
                    setApproveSfa(true)
                  }}>Edit</button>
                </TableCell> */}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: '1px solid #e0e0e0' }}
      />
      <AssessmentFormModal
          open={openCreateSfa}
          handleClose={handleCloseSpa}
      />
      <AssessmentFormUpdateModal
        open={openUpdateSfa}
        handleClose={handleSfaUpdateClose}
        activeItem={activeItem}
        refetch={refetch}
      />
      <AssessmentFormApproval
          open={openApproveSfa}
          handleClose={handleSfaApproveClose}
          activeItem={activeItem}
          refetch={refetch}
      />
      <CreateLandBankModal
          open={openCreateLandBank}
          handleClose={handleCreateLandBankClose}
          activeItem={activeItem}
      />

    </div>
  );
};

export default SiteVisitTable;
