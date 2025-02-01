import React, { useEffect, useState } from "react";
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
import {
  AiOutlineStop,
  AiOutlineCheck,
  AiOutlineFileText,
} from "react-icons/ai"; // Added AiOutlineFileText for SFA icon
import LandActivityModal from "../../components/pages/Land-back/createLand";
import { useGetLandBankMasterQuery } from "../../api/users/landbankApi";
import LandApproveModal from "../../components/pages/Land-back/approveLand";
import EditLandModal from "../../components/pages/Land-back/edit-land";
import { useNavigate } from "react-router-dom";
import AssessmentFormModal from "../../components/pages/Land-back/sfa-form";

function LandListing() {
  const { data, error, isLoading, refetch } = useGetLandBankMasterQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddLandModal, setOpenAddLandModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openSfaModal,setOpenSfaModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State for EditLandModal
  const [selectedLand, setSelectedLand] = useState(null);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!open) {
      refetch();
    }
  }, [open, refetch]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApproveClick = (land) => {
    console.log("--------------------------------", land);
    setSelectedLand(land);
    setOpenApproveModal(true);
  };
  const handleSfaModalClose = ()=>{
    setOpenSfaModal(false)
  }
  const handleSfaClick=(land)=>{
    setSelectedLand(land);
    console.log(land)
    setOpenSfaModal(true)
  }
  // Handler for opening EditLandModal
  const handleEditClick = (land) => {
    setSelectedLand(land); // Set the selected land data
    setOpenEditModal(true); // Open the EditLandModal
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
              <TableCell align="center">Approve</TableCell>
              <TableCell align="center">SFA</TableCell> {/* New SFA Column */}
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
                      onClick={() => handleEditClick(row)} // Open EditLandModal on click
                    />
                    <AiOutlineStop
                      style={{ cursor: "pointer", color: "red" }}
                      title="Delete"
                    />
                  </div>
                </TableCell>
                <TableCell align="center">
                  {row.land_bank_status === "Approved" ? (
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#F6812D",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                      onClick={() =>
                        navigate("/add-land-doc", { state: { landData: row } })
                      }
                    >
                      Approve
                    </span>
                  ) : (
                    <span
                      style={{
                        cursor: "not-allowed",
                        color: "#A0A0A0", // Grayed out color for disabled state
                        fontWeight: "bold",
                        textDecoration: "none",
                      }}
                    >
                      Approve
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <AiOutlineFileText
                    style={{ cursor: "pointer", color: "#29346B" }} // SFA icon
                    title="SFA"
                    onClick={() => {
                      handleSfaClick(row)
                      // Add functionality for SFA icon click
                      // console.log("SFA clicked for land:", row);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
            }
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
        // refetch={refetch}
      />

      {/* Approve Land Modal */}
      <LandApproveModal
        open={openApproveModal}
        setOpen={setOpenApproveModal}
        selectedLand={selectedLand} // Pass the selected land data to the modal
      />

      {/* Edit Land Modal */}
      <EditLandModal
        open={openEditModal} // State to control the modal
        setOpen={setOpenEditModal} // Function to close the modal
        selectedLand={selectedLand} // Pass the selected land data
      />
      <AssessmentFormModal
        handleClose={handleSfaModalClose}
        open={openSfaModal}
        selectedLand={selectedLand}
      />
    </div>
  );
}

export default LandListing;