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
  CircularProgress,
  Alert,
} from "@mui/material";
import { RiEditFill } from "react-icons/ri";
import { GiConfirmed } from "react-icons/gi";
import {
  AiOutlineStop,
  AiOutlineCheck,
  AiOutlineFileText,
} from "react-icons/ai";
import LandActivityModal from "../../components/pages/Land-back/createLand";
import { useGetLandBankMasterQuery } from "../../api/users/landbankApi";
import LandApproveModal from "../../components/pages/Land-back/approveLand";
import EditLandModal from "../../components/pages/Land-back/edit-land";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteLandBankLocationMutation } from "../../api/users/landbankApi";

function LandListing() {
  const { data, error, isLoading, refetch } = useGetLandBankMasterQuery();
  const [deleteLandBankLocation] = useDeleteLandBankLocationMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddLandModal, setOpenAddLandModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openSfaModal, setOpenSfaModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
        {/* Title - Always on top on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            Land Listing
          </h2>
        </div>
        
        {/* Search and Filters Container */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input */}
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

          {/* Filters/Actions */}
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
            minWidth: "1200px" // Ensure minimum width for very wide table
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow style={{ backgroundColor: "#F2EDED" }}>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Sr No.
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Land Name
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Category
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Energy Type
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  User Full Name
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Status
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Create Date
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Approve
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Action
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Attachments
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Edit Attachments
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  View Attachments
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentRows?.map((row, index) => (
                <TableRow 
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                      wordBreak: 'break-word'
                    }}
                  >
                    {row?.land_name}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {row?.land_category_name}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {row?.solar_or_winds}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {row.user_full_name || "N/A"}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {row?.land_bank_status}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <GiConfirmed 
                        style={{
                          cursor: "pointer",
                          color: "#4CAF50",
                          fontSize: "24px", // Slightly smaller for mobile
                        }}
                        title="Approve Land"
                        onClick={() => handleApproveClick(row)}
                      />
                    </div>
                  </TableCell>
                  
                  {/* Action column (Edit + Delete) */}
                  <TableCell 
                    align="center"
                    sx={{
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <RiEditFill
                        style={{ 
                          cursor: "pointer", 
                          color: "#61D435", 
                          fontSize: "20px" // Smaller for mobile
                        }}
                        title="Edit"
                        onClick={() => handleEditClick(row)}
                      />
                      <DeleteIcon
                        style={{
                          cursor: "pointer",
                          color: "#df3d34",
                          fontSize: "20px", // Smaller for mobile
                        }}
                        title="Delete"
                        onClick={() => handleDeleteClick(row.id)}
                      />
                    </div>
                  </TableCell>

                  {/* Attachment columns */}
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '11px', sm: '13px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
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
                        Add Attachments
                      </span>
                    ) : (
                      <span
                        style={{
                          cursor: "not-allowed",
                          color: "#A0A0A0",
                          fontWeight: "bold",
                        }}
                      >
                        Attachments
                      </span>
                    )}
                  </TableCell>
                  
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '11px', sm: '13px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {row.land_bank_status === "Approved" ? (
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#F6812D",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          navigate(`/edit-land-doc/${row.id}`, {
                            state: { landData: row },
                          })
                        }
                      >
                        Edit Attachments
                      </span>
                    ) : (
                      <span
                        style={{
                          cursor: "not-allowed",
                          color: "#A0A0A0",
                          fontWeight: "bold",
                        }}
                      >
                        Edit Attachments
                      </span>
                    )}
                  </TableCell>
                  
                  <TableCell 
                    align="center"
                    sx={{
                      fontSize: { xs: '11px', sm: '13px', md: '16px' },
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                    }}
                  >
                    {row.land_bank_status === "Approved" ? (
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#F6812D",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          navigate(`/view-landbank-docs/${row.id}`, {
                            state: { landData: row },
                          })
                        }
                      >
                        View Attachments
                      </span>
                    ) : (
                      <></>
                    )}
                  </TableCell>
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
            sx={{
              '& .MuiTablePagination-toolbar': {
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '8px', sm: '16px' }
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: { xs: '12px', sm: '14px' }
              }
            }}
          />
        </TableContainer>
      </div>

      {/* No data message */}
      {!isLoading && filteredRows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No land records found matching your search.</p>
        </div>
      )}

      {/* Add Land Modal */}
      <LandActivityModal
        open={openAddLandModal}
        setOpen={setOpenAddLandModal}
      />

      {/* Approve Land Modal */}
      <LandApproveModal
        open={openApproveModal}
        setOpen={setOpenApproveModal}
        selectedLand={selectedLand}
      />

      {/* Edit Land Modal */}
      <EditLandModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        activeItem={selectedLand}
        handleClose={handleCloseModal}
      />
    </div>
  );
}

export default LandListing;