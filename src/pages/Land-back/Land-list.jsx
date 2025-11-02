import React, { useContext, useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { MdApproval } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LandActivityModal from "../../components/pages/Land-back/createLand";
import { useGetLandBankMasterQuery } from "../../api/users/landbankApi";
import LandApproveModal from "../../components/pages/Land-back/approveLand";
import EditLandModal from "../../components/pages/Land-back/edit-land";
import { useNavigate } from "react-router-dom";
import { useDeleteLandBankLocationMutation } from "../../api/users/landbankApi";
import { AuthContext } from "../../context/AuthContext";
import HodApprovalModal from "../../components/pages/Land-back/HodApprovalModal.jsx";


function LandListing() {
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetLandBankMasterQuery();
  const [deleteLandBankLocation] = useDeleteLandBankLocationMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddLandModal, setOpenAddLandModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openSfaModal, setOpenSfaModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openHodApprovalModal, setOpenHodApprovalModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const { permissions } = useContext(AuthContext);


  useEffect(() => {
    const userGroups = permissions?.groups;
    const allowedGroups = [
      'ADMIN',
      'LAND_HOD_FULL',
      'LAND_MANAGER_FULL', 
      'LAND_SPOC_FULL',
      'LAND_AM_FULL',
      'LAND_EXECUTIVE_FULL',
      'PROJECT_HOD_FULL',
      'PROJECT_MANAGER_FULL',
      'PROJECT_ENGINEER_FULL',
    ];
    
    // Check if user has at least one allowed group
    const hasAllowedGroup = userGroups?.some(group => 
      allowedGroups.includes(group.name)
    );
    
    if (permissions && !hasAllowedGroup) {
      navigate('/');
    }
  }, [permissions, navigate]);

  // Check if user has LAND permissions
  const hasLandPermissions = () => {
    const userGroups = permissions?.groups;
    const landGroups = [
      'LAND_HOD_FULL',
      'LAND_MANAGER_FULL',
      'LAND_SPOC_FULL',
      'LAND_AM_FULL'
    ];
    
    return userGroups?.some(group => landGroups.includes(group.name));
  };


  const hasProjectApprovalPermissions = () => {
    const userGroups = permissions?.groups;
    const projectGroups = [
      'PROJECT_HOD_FULL',
      'ADMIN',
    ];
    
    return userGroups?.some(group => projectGroups.includes(group.name));
  };


  const hasProjectViewPermissions = () => {
    const userGroups = permissions?.groups;
    const projectGroups = [
      'PROJECT_HOD_FULL',
      'PROJECT_MANAGER_FULL',
      'PROJECT_ENGINEER_FULL',
      'ADMIN',
    ];
    
    return userGroups?.some(group => projectGroups.includes(group.name));
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  useEffect(() => {
    if (!open) {
      refetch();
    }
  }, [open, refetch]);



  const handleCloseModal = () => {
    setOpenEditModal(false);
  };



  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const handleApproveClick = (land) => {
    setSelectedLand(land);
    setOpenApproveModal(true);
  };



  const handleHodApprovalClick = (land) => {
    setSelectedLand(land);
    setOpenHodApprovalModal(true);
  };



  const handleSfaModalClose = () => {
    setOpenSfaModal(false);
  };



  const handleSfaClick = (land) => {
    setSelectedLand(land);
    setOpenSfaModal(true);
  };



  const handleEditClick = (land) => {
    setSelectedLand(land);
    setOpenEditModal(true);
  };



  const handleDeleteClick = async (landId) => {
    try {
      await deleteLandBankLocation(landId).unwrap();
      alert("Land location deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting land location:", error);
      alert("Failed to delete land location!");
    }
  };



  const handleHodApprovalSuccess = () => {
    refetch();
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size={50} />
      </div>
    );
  }



  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert severity="error">
          Error occurred while loading land data. Please try again.
        </Alert>
      </div>
    );
  }



  const filteredRows =
    data?.data?.filter((row) =>
      (row?.land_name || "").toLowerCase().includes(searchQuery?.toLowerCase())
    ) || [];



  const currentRows = filteredRows?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );



  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-none mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="mb-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            Land Listing
          </h2>
        </div>



        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <TextField
              placeholder="Search by land name..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
          </div>



          <div className="w-full sm:w-auto text-center sm:text-right">
            <h3 className="text-lg sm:text-xl md:text-2xl text-[#29346B] font-medium">
              {/* Filters */}
            </h3>
          </div>
        </div>
      </div>



      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <TableContainer
          component={Paper}
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            minWidth: "1300px"
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow style={{ backgroundColor: "#F2EDED" }}>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Sr No.</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Land Name</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Category</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Created By</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Status</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Create Date</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Edit Land</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Add Documents</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Edit Documents</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>View Documents</TableCell>
                <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>Approve</TableCell>
                {hasProjectApprovalPermissions() && (
                  <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67' }}>HOD Approval</TableCell>
                )}
              </TableRow>
            </TableHead>



            <TableBody>
              {currentRows?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{row?.land_name}</TableCell>
                  <TableCell align="center">{row?.land_category_name}</TableCell>
                  <TableCell align="center">{row.user_full_name || "N/A"}</TableCell>
                  <TableCell align="center">{row?.land_bank_status}</TableCell>
                  <TableCell align="center">
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  
                  {/* Edit Land and Delete */}
<TableCell align="center">
  {!hasProjectViewPermissions() || hasLandPermissions() ? (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<EditIcon />}
        onClick={() => handleEditClick(row)}
        disabled={row.is_land_bank_approved_by_project_hod === true}
        sx={{
          color: "#61D435",
          borderColor: "#61D435",
          textTransform: "none",
          fontSize: "11px",
          padding: "4px 10px",
          minWidth: "70px",
          "&:hover": {
            borderColor: "#4CAF50",
            backgroundColor: "rgba(97, 212, 53, 0.04)"
          },
          "&.Mui-disabled": {
            borderColor: "#e0e0e0",
            color: "#9e9e9e"
          }
        }}
      >
        Edit
      </Button>
      
      {hasLandPermissions() && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteClick(row.id)}
          disabled={row.is_land_bank_approved_by_project_hod === true}
          sx={{
            color: "#df3d34",
            borderColor: "#df3d34",
            textTransform: "none",
            fontSize: "11px",
            padding: "4px 10px",
            minWidth: "80px",
            "&:hover": {
              borderColor: "#c62828",
              backgroundColor: "rgba(223, 61, 52, 0.04)"
            },
            "&.Mui-disabled": {
              borderColor: "#e0e0e0",
              color: "#9e9e9e"
            }
          }}
        >
          Delete
        </Button>
      )}
    </div>
  ) : (
    <span style={{ color: "#999", fontStyle: "italic" }}>-</span>
  )}
</TableCell>


{/* Add Documents */}
<TableCell align="center">
  {(!row.is_land_bank_added_attachment && (!hasProjectViewPermissions() || hasLandPermissions())) ? (
    <Button
      variant="contained"
      size="small"
      startIcon={<AttachFileIcon />}
      onClick={() => navigate("/add-land-doc", { state: { landData: row } })}
      disabled={row.is_land_bank_approved_by_project_hod === true}
      sx={{
        backgroundColor: "#F6812D",
        color: "white",
        textTransform: "none",
        fontSize: "11px",
        padding: "4px 12px",
        "&:hover": {
          backgroundColor: "#E57320"
        },
        "&.Mui-disabled": {
          backgroundColor: "#e0e0e0",
          color: "#9e9e9e"
        }
      }}
    >
      Add
    </Button>
  ) : (
    <span style={{ color: "#999", fontStyle: "italic" }}>-</span>
  )}
</TableCell>


{/* Edit Documents */}
<TableCell align="center">
  {(row.is_land_bank_added_attachment && (!hasProjectViewPermissions() || hasLandPermissions())) ? (
    <Button
      variant="contained"
      size="small"
      startIcon={<EditIcon />}
      onClick={() => navigate(`/edit-land-doc/${row.id}`, { state: { landData: row } })}
      disabled={row.is_land_bank_approved_by_project_hod === true}
      sx={{
        backgroundColor: "#F6812D",
        color: "white",
        textTransform: "none",
        fontSize: "11px",
        padding: "4px 12px",
        "&:hover": {
          backgroundColor: "#E57320"
        },
        "&.Mui-disabled": {
          backgroundColor: "#e0e0e0",
          color: "#9e9e9e"
        }
      }}
    >
      Edit
    </Button>
  ) : (
    <span style={{ color: "#999", fontStyle: "italic" }}>-</span>
  )}
</TableCell>


{/* View Documents - Always available for all users */}
<TableCell align="center">
  <Button
    variant="contained"
    size="small"
    startIcon={<VisibilityIcon />}
    onClick={() => navigate(`/view-landbank-docs/${row.id}`, { state: { landData: row } })}
    sx={{
      backgroundColor: "#F6812D",
      color: "white",
      textTransform: "none",
      fontSize: "11px",
      padding: "4px 12px",
      "&:hover": {
        backgroundColor: "#E57320"
      }
    }}
  >
    View
  </Button>
</TableCell>


{/* Approve Button */}
<TableCell align="center">
  {( hasLandPermissions()) ? (
    <Button
      variant="contained"
      size="small"
      startIcon={<CheckCircleIcon />}
      onClick={() => handleApproveClick(row)}
      disabled={row.land_bank_status === "Approved" || row.is_land_bank_approved_by_project_hod === true || row.is_land_bank_added_attachment==false}
      sx={{
        backgroundColor: "#4CAF50",
        color: "white",
        textTransform: "none",
        fontSize: "11px",
        padding: "4px 12px",
        "&:hover": {
          backgroundColor: "#45a049"
        },
        "&.Mui-disabled": {
          backgroundColor: "#e0e0e0",
          color: "#9e9e9e"
        }
      }}
    >
      Approve
    </Button>
  ) : (
    <span style={{ color: "#999", fontStyle: "italic" }}>-</span>
  )}
</TableCell>


                  {/* HOD Approval Button */}
                  {hasProjectApprovalPermissions() && (
                    <TableCell align="center">
                      {row.land_bank_status === "Approved" ? (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<MdApproval />}
                          onClick={() => handleHodApprovalClick(row)}
                          disabled={row.is_land_bank_approved_by_project_hod === true}
                          sx={{
                            backgroundColor: "#29346B",
                            color: "white",
                            textTransform: "none",
                            fontSize: "11px",
                            padding: "4px 12px",
                            minWidth: "auto",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              backgroundColor: "#1f2654"
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "#e0e0e0",
                              color: "#9e9e9e"
                            }
                          }}
                        >
                          HOD Approval
                        </Button>
                      ) : (
                        <span style={{ color: "#999", fontStyle: "italic" }}>-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>



          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            style={{ borderTop: "1px solid #e0e0e0" }}
          />
        </TableContainer>
      </div>



      {!isLoading && filteredRows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No land records found matching your search.</p>
        </div>
      )}



      {/* Modals */}
      <LandActivityModal open={openAddLandModal} setOpen={setOpenAddLandModal} />
      <LandApproveModal open={openApproveModal} setOpen={setOpenApproveModal} selectedLand={selectedLand} refetch={refetch} />
      <EditLandModal open={openEditModal} setOpen={setOpenEditModal} activeItem={selectedLand} handleClose={handleCloseModal} />
      
      <HodApprovalModal
        open={openHodApprovalModal}
        setOpen={setOpenHodApprovalModal}
        selectedLand={selectedLand}
        onSuccess={handleHodApprovalSuccess}
      />
    </div>
  );
}



export default LandListing;
