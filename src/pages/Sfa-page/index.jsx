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
  TablePagination,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { RiEditFill } from "react-icons/ri";
import { AiOutlineStop } from "react-icons/ai";
import { useGetSfaDataQuery } from "../../api/sfa/sfaApi";
import AssessmentFormModal from "../../components/pages/sfa-form/sfa-form";
import AssessmentFormUpdateModal from "../../components/pages/sfa-form/sfaUpdate";
import AssessmentFormApproval from "../../components/pages/sfa-form/sfa-approval";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CreateLandBankModal from "../../components/pages/Land-bank/createLandBank";

const SiteVisitTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState("");
  const { data, isLoading, isError, refetch } = useGetSfaDataQuery();
  const [openCreateSfa, setOpenCreateSpa] = useState(false);
  const [openUpdateSfa, setUpdateSfa] = useState(false);
  const [openApproveSfa, setOpenApproveSfa] = useState(false);
  const [openCreateLandBank, setCreateLandBank] = useState(false);

  const [activeItem, setActiveItem] = useState(null);

  const handleCloseSpa = () => {
    setOpenCreateSpa(!openCreateSfa);
  };
  const handleSfaUpdateClose = () => {
    setActiveItem(null);
    setUpdateSfa(!openUpdateSfa);
  };
  const handleSfaApproveClose = () => {
    setActiveItem(null);
    setOpenApproveSfa(false);
  };

  const handleCreateLandBankClose = () => {
    setActiveItem(null);
    setCreateLandBank(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert severity="error" className="max-w-md">
          Failed to load data. <Button onClick={refetch}>Retry</Button>
        </Alert>
      </div>
    );
  }

  const siteData = data?.data || [];
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
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-7xl mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="mb-6">
        {/* Title - Always on top on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
            SFA Listing
          </h2>
        </div>
        
        {/* Search and Button Container */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <TextField
              value={filter}
              placeholder="Search by SFA name..."
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
          </div>

          {/* Add Button */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={() => {
                setOpenCreateSpa(true);
              }}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#FF8C00",
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: '14px', sm: '16px' },
                textTransform: "none",
                padding: { xs: '10px 16px', sm: '8px 24px' },
                '&:hover': {
                  backgroundColor: '#e67c00'
                }
              }}
            >
              Add SFA
            </Button>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <TableContainer 
          component={Paper} 
          style={{ 
            borderRadius: "8px",
            minWidth: "800px" // Ensure minimum width for wide table
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
                  SFA Name
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Site Visit Date
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Site Visit Status
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Land Category
                </TableCell>
                <TableCell 
                  align="center"
                  style={{ fontWeight: 'normal', color: '#5C5E67' }}
                  sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                  }}
                >
                  Edit
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
                  Create Land Bank
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
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
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                        wordBreak: 'break-word'
                      }}
                    >
                      {row.sfa_name || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      {new Date(row.site_visit_date).toLocaleDateString() || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      {row.status_of_site_visit || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      {row.land_category_name || "N/A"}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <RiEditFill
                          onClick={() => {
                            setActiveItem(row);
                            setUpdateSfa(true);
                          }}
                          style={{
                            cursor: "pointer",
                            color: "#61D435",
                            fontSize: "20px",
                          }}
                          title="Edit"
                        />
                      </div>
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        padding: { xs: '4px', sm: '8px', md: '12px' }
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setActiveItem(row);
                          setOpenApproveSfa(true);
                        }}
                        startIcon={<FactCheckIcon style={{ fontSize: "16px" }} />}
                        sx={{
                          backgroundColor: "#f95406",
                          color: "white",
                          minWidth: { xs: "80px", sm: "90px" },
                          padding: { xs: "4px 8px", sm: "6px 16px" },
                          fontSize: { xs: "11px", sm: "13px" },
                          textTransform: "none",
                          fontWeight: "500",
                          '&:hover': {
                            backgroundColor: '#e04905'
                          },
                          '& .MuiButton-startIcon': {
                            marginRight: { xs: '2px', sm: '8px' }
                          }
                        }}
                      >
                        Approve
                      </Button>
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        padding: { xs: '4px', sm: '8px', md: '12px' }
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setActiveItem(row);
                          setCreateLandBank(true);
                        }}
                        sx={{
                          minWidth: { xs: "70px", sm: "80px" },
                          padding: { xs: "4px 8px", sm: "6px 12px" },
                          fontSize: { xs: "11px", sm: "13px" },
                          textTransform: "none"
                        }}
                      >
                        Create
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={7} 
                    align="center"
                    sx={{
                      padding: { xs: '16px 8px', sm: '24px 16px' },
                      fontSize: { xs: '14px', sm: '16px' },
                      color: '#666'
                    }}
                  >
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

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

      <AssessmentFormModal open={openCreateSfa} handleClose={handleCloseSpa} />
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