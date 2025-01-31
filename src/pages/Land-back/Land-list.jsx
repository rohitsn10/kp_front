import React, { useState } from "react";
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
  TablePagination,
} from "@mui/material";
import { RiEditFill } from "react-icons/ri";
import { AiOutlineStop, AiOutlineCheck } from "react-icons/ai";
import LandActivityModal from "../../components/pages/Land-back/createLand";
import { useGetLandBankMasterQuery } from "../../api/users/landbankApi";
import LandApproveModal from "../../components/pages/Land-back/approveLand";

function LandListing() {
  const { data, error, isLoading } = useGetLandBankMasterQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddLandModal, setOpenAddLandModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApproveClick = (land) => {
    console.log("--------------------------------", land);
    setSelectedLand(land);
    setOpenApproveModal(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;

  const currentRows =
    data?.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ||
    [];

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex items-center">
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
          />
        </div>

        <div className="flex-grow flex justify-center">
          <h2 className="text-2xl text-[#29346B] font-semibold">
            Land Listing
          </h2>
        </div>

        <div className="flex items-center">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#f6812d",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
            onClick={() => setOpenAddLandModal(true)} // Open Add Land modal
          >
            Add Land
          </Button>
        </div>
      </div>

      <TableContainer style={{ borderRadius: "10px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Sr No.</TableCell>
              <TableCell align="center">Energy Type</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">User Full Name</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Land Name</TableCell>
              <TableCell align="center">Create Date</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row.solar_or_winds}</TableCell>
                <TableCell align="center">{row.land_bank_status}</TableCell>
                <TableCell align="center">
                  {row.user_full_name || "N/A"}
                </TableCell>
                <TableCell align="center">{row.land_category_name}</TableCell>
                <TableCell align="center">{row.land_name}</TableCell>
                <TableCell align="center">
                  {new Date(row.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <AiOutlineCheck
                      style={{ cursor: "pointer", color: "green" }}
                      title="Approve"
                      onClick={() => handleApproveClick(row)}
                    />
                    <RiEditFill
                      style={{ cursor: "pointer", color: "#61D435" }}
                      title="Edit"
                    />
                    <AiOutlineStop
                      style={{ cursor: "pointer", color: "red" }}
                      title="Delete"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={data?.data.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Add Land Modal */}
      <LandActivityModal
        open={openAddLandModal}
        setOpen={setOpenAddLandModal}
        // landActivityInput={landActivityInput}
        // setLandActivityInput={setLandActivityInput}
      />

      <LandApproveModal
        open={openApproveModal}
        setOpen={setOpenApproveModal}
        selectedLand={selectedLand} // Pass the selected land data to the modal
      />
    </div>
  );
}

export default LandListing;
