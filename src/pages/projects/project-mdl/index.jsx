import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Button,
} from "@mui/material";
import ApproveMasterDesignModal from "../../../components/pages/projects/ProjectMasterDesign/ApproveMasterDesignModal";
import CreateMasterDesignModal from "../../../components/pages/projects/ProjectMasterDesign/CreateMasterDesignModal";
import EditMasterDesignModal from "../../../components/pages/projects/ProjectMasterDesign/EditMasterDesignModal";
import { useGetAllDrawingsQuery } from "../../../api/masterdesign/masterDesign";
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';


function MasterDesignListing() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allDrawings, isLoading } = useGetAllDrawingsQuery();
  console.log(allDrawings?.data);
  // const [data, setData] = useState([]); // Placeholder for fetched data

//   Modal States.
  const [openCreateDesign,setOpenCreateDesign]=useState(false);
  const [openEditMasterDesign,setEditMasterDesign]=useState(false);
  const [openApproveDesign,setOpenApproveDesign]=useState(false);

//   State to manage selectedDesign
  const [selectedDesign,setSelectedDesign]=useState(null)
  
//   Close 
  const handleCloseCreateDesign = ()=>{
    setOpenCreateDesign(false)
  } 

  const handleClosEditeDesign = ()=>{
    setEditMasterDesign(false)
    setSelectedDesign(null)
  } 
  
  const handleCloseApproveDesign = ()=>{
    setOpenApproveDesign(false)
    setSelectedDesign(null)
  } 
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = allDrawings?.data?.filter((row) =>
    row?.name_of_drawing?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const currentRows = filteredRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // console.log(currentRows)
  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <TextField
          placeholder="Search by Drawing Number"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
        />
        <h2 className="text-2xl text-[#29346B] font-semibold">Document & Drawing Listing</h2>
        <Button variant="contained" style={{ backgroundColor: "#f6812d", color: "white" }} onClick={() => setOpenCreateDesign(true)}>
          Add Design
        </Button>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: "10px", overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Discipline</TableCell>
              <TableCell align="center">Block</TableCell>
              <TableCell align="center">Drawing / Document Number</TableCell>
              <TableCell align="center">Name of the Drawing / Document</TableCell>
              <TableCell align="center">Document Category</TableCell>
              <TableCell align="center">Type - Approval / Information</TableCell>
              <TableCell align="center">Approval Status</TableCell>
              <TableCell align="center">Action</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows?.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row.discipline}</TableCell>
                <TableCell align="center">{row.block}</TableCell>
                {/* <TableCell align="center">{row.drawingNumber}</TableCell>
                <TableCell align="center">{row.drawingName}</TableCell>
                <TableCell align="center">{row.documentCategory}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.approvalStatus}</TableCell> */}
                <TableCell align="center">{row.drawing_number}</TableCell>
                <TableCell align="center">{row.name_of_drawing}</TableCell>
                <TableCell align="center">{row.drawing_category}</TableCell>
                <TableCell align="center">{row.type_of_approval}</TableCell>
                <TableCell align="center">{row.approval_status}</TableCell>
                <TableCell align="center">
                  <div className="flex flex-row gap-1">
                  <EditIcon
                  onClick={()=>{
                    setEditMasterDesign(true);
                    setSelectedDesign(row)
                  }}
                   sx={{
                    color:"orange",
                    cursor:'pointer'
                  }}/>
                  <PreviewIcon
                  onClick={()=>{
                    setOpenApproveDesign(true);
                    setSelectedDesign(row)
                  }}
                   sx={{
                    color:"#2a902b",
                    cursor:'pointer'
                  }}/>
                  </div>
                </TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredRows?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
       <CreateMasterDesignModal
        open={openCreateDesign}
        onClose={handleCloseCreateDesign}
       />
       <EditMasterDesignModal
        open={openEditMasterDesign}
        onClose={handleClosEditeDesign}
        selectedDesign={selectedDesign}
       />
       <ApproveMasterDesignModal
        open={openApproveDesign}
        onClose={handleCloseApproveDesign}
        selectedDesign={selectedDesign}
       /> 
      </TableContainer>
    </div>
  );
}

export default MasterDesignListing;
