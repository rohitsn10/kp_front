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
} from "@mui/material";
import PermitToWorkDialog from "../../../components/pages/hse/permitTowork/CreatePermitToWork";
import { useGetPermitToWorkQuery } from "../../../api/hse/permitTowork/permitToworkApi";

const PermitToWork = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { data, isLoading, error } = useGetPermitToWorkQuery();

  const filteredPermits = (data?.data || []).filter((permit) =>
    permit.permit_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredPermits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center">
        Permit to Work
      </h2>

      <div className="flex flex-row  flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          placeholder="Search by Permit No."
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            maxWidth: "300px",
          }}
        />
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            style={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
            }}
          >
            Create Permit to Work
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Sr. No.</TableCell>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((permit, index) => (
                <TableRow key={permit.id}>
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">{permit.permit_number}</TableCell>
                  <TableCell align="center">
                    {new Date(permit.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{permit.department}</TableCell>
                  <TableCell align="center">{permit.type_of_permit}</TableCell>
                  <TableCell align="center">
                    {permit.permit_issue_for}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(permit.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">{permit.location_area}</TableCell>
                  <TableCell align="center">
                    {permit.is_active ? "Active" : "Inactive"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredPermits.length}
        page={page}
        onPageChange={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: "1px solid #e0e0e0" }}
      />

      <PermitToWorkDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default PermitToWork;
