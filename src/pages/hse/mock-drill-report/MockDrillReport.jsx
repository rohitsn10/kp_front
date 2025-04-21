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
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TablePagination,
  TextField,
} from "@mui/material";
import MockDrillReportDialog from "../../../components/pages/hse/mock-drill-report/CreateMockDrill";
import { useParams } from "react-router-dom";
import { useGetMockDrillReportQuery } from "../../../api/hse/mockdrill/mockDrillApi";

function MockDrillReport() {
  const { locationId } = useParams();
  const skipQuery = !locationId || isNaN(parseInt(locationId));
  // const { data, isLoading, isError, error,refetch } =
  //   useGetMockDrillReportQuery(locationId);
     const { data, isLoading, error, refetch } = useGetMockDrillReportQuery(
        parseInt(locationId), 
        { skip: skipQuery }
      );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [openRecommendationsModal, setOpenRecommendationsModal] =
    useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openHeadCountModal, setOpenHeadCountModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // console.log(data);
  const [createMockDrill, setCreateMockDrill] = useState(false);
  const drills = data?.data || [];
  const filteredDrills = drills.filter((drill) =>
    drill.emergncy_scenario_mock_drill
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (drill, modalType) => {
    setSelectedDrill(drill);
    switch (modalType) {
      case "recommendations":
        setOpenRecommendationsModal(true);
        break;
      case "rating":
        setOpenRatingModal(true);
        break;
      case "headCount":
        setOpenHeadCountModal(true);
        break;
      case "details":
        setOpenDetailsModal(true);
        break;
    }
  };

  const closeModal = (modalType) => {
    switch (modalType) {
      case "recommendations":
        setOpenRecommendationsModal(false);
        break;
      case "rating":
        setOpenRatingModal(false);
        break;
      case "headCount":
        setOpenHeadCountModal(false);
        break;
      case "details":
        setOpenDetailsModal(false);
        break;
    }
    setSelectedDrill(null);
  };

  const currentRows = filteredDrills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[90%] mx-auto my-8 rounded-md pt-5">
      <h2 className="text-3xl text-[#29346B] font-semibold text-center mb-6">
        Mock Drill Report
      </h2>
      <div className="flex flex-row  flex-wrap gap-4 justify-between p-6 md:p-4 mb-5">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Emergency Scenario"
          variant="outlined"
        />

        <Button
          onClick={() => setCreateMockDrill(true)}
          variant="contained"
          style={{
            backgroundColor: "#FF8C00",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            minHeight: "auto",
          }}
        >
          Create Mock Drill Report
        </Button>
      </div>
      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2EDED" }}>
              <TableCell align="center">Site Plant</TableCell>
              <TableCell align="center">Emergency Scenario</TableCell>
              <TableCell align="center">Mock Drill Date</TableCell>
              <TableCell align="center">Type of Mock Drill</TableCell>
              <TableCell align="center">Overall Rating</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((drill) => (
              <TableRow key={drill.id}>
                <TableCell align="center">{drill.site_plant_name}</TableCell>
                <TableCell align="center">
                  {drill.emergncy_scenario_mock_drill}
                </TableCell>
                <TableCell align="center">{drill.mock_drill_date}</TableCell>
                <TableCell align="center">{drill.type_of_mock_drill}</TableCell>
                <TableCell align="center">{drill.overall_rating}</TableCell>
                <TableCell align="center">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => openModal(drill, "recommendations")}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Recommendations
                    </Button>
                    <Button
                      onClick={() => openModal(drill, "rating")}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Team Ratings
                    </Button>
                    <Button
                      onClick={() => openModal(drill, "headCount")}
                      variant="contained"
                      color="info"
                      size="small"
                    >
                      Head Count
                    </Button>
                    <Button
                      onClick={() => openModal(drill, "details")}
                      variant="contained"
                      color="success"
                      size="small"
                    >
                      Additional Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredDrills.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        style={{ borderTop: "1px solid #e0e0e0" }}
      />

      {/* Recommendations Modal */}
      <Dialog
        open={openRecommendationsModal}
        onClose={() => closeModal("recommendations")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Recommendations</DialogTitle>
        <DialogContent>
          {selectedDrill?.recommendations?.short_term?.length > 0 && (
            <>
              <Typography variant="h6" className="mt-2">
                Short Term Recommendations
              </Typography>
              {selectedDrill.recommendations.short_term.map((rec, index) => (
                <div key={`short-${index}`} className="mb-3 p-3 border rounded">
                  <Typography>{rec}</Typography>
                </div>
              ))}
            </>
          )}

          {selectedDrill?.recommendations?.long_term?.length > 0 && (
            <>
              <Typography variant="h6" className="mt-4">
                Long Term Recommendations
              </Typography>
              {selectedDrill.recommendations.long_term.map((rec, index) => (
                <div key={`long-${index}`} className="mb-3 p-3 border rounded">
                  <Typography>{rec}</Typography>
                </div>
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Ratings Modal */}
      <Dialog
        open={openRatingModal}
        onClose={() => closeModal("rating")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Emergency Team Members Ratings</DialogTitle>
        <DialogContent>
          {selectedDrill && (
            <Typography>
              <strong>Rating:</strong>{" "}
              {selectedDrill.rating_of_emergency_team_members}
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Head Count Modal */}
      <Dialog
        open={openHeadCountModal}
        onClose={() => closeModal("headCount")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Head Count at Assembly Point</DialogTitle>
        <DialogContent>
          {selectedDrill?.head_count_at_assembly_point
            ?.people_present_as_per_record && (
            <>
              <Typography variant="h6">People Present as per Record</Typography>
              {Object.entries(
                selectedDrill.head_count_at_assembly_point
                  .people_present_as_per_record
              ).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {value}
                </Typography>
              ))}
            </>
          )}

          {selectedDrill?.head_count_at_assembly_point
            ?.actual_participants_participate_in_drill && (
            <>
              <Typography variant="h6" className="mt-4">
                Actual Participants
              </Typography>
              {Object.entries(
                selectedDrill.head_count_at_assembly_point
                  .actual_participants_participate_in_drill
              ).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {value}
                </Typography>
              ))}
            </>
          )}

          {selectedDrill?.head_count_at_assembly_point
            ?.no_of_people_not_participated_in_drill && (
            <>
              <Typography variant="h6" className="mt-4">
                People Not Participated
              </Typography>
              {Object.entries(
                selectedDrill.head_count_at_assembly_point
                  .no_of_people_not_participated_in_drill
              ).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {value}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Additional Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={() => closeModal("details")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Additional Details</DialogTitle>
        <DialogContent
          sx={{
            paddingY: "30px",
          }}
        >
          {selectedDrill?.head_count_at_assembly_point
            ?.people_present_as_per_record && (
            <>
              <Typography variant="h6">People Present as per Record</Typography>
              {Object.entries(
                selectedDrill.head_count_at_assembly_point
                  .people_present_as_per_record
              ).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {value}
                </Typography>
              ))}
            </>
          )}

          {selectedDrill?.head_count_at_assembly_point
            ?.actual_participants_participate_in_drill && (
            <>
              <Typography variant="h6" className="mt-4">
                Actual Participants
              </Typography>
              {Object.entries(
                selectedDrill.head_count_at_assembly_point
                  .actual_participants_participate_in_drill
              ).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {value}
                </Typography>
              ))}
            </>
          )}

          {selectedDrill?.head_count_at_assembly_point
            ?.no_of_people_not_participated_in_drill && (
            <>
              <Typography variant="h6" className="mt-4">
                People Not Participated
              </Typography>
              {Object.entries(
                selectedDrill.head_count_at_assembly_point
                  .no_of_people_not_participated_in_drill
              ).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {value}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>
      <MockDrillReportDialog
        open={createMockDrill}
        setOpen={setCreateMockDrill}
        onSuccess={refetch}
      />
    </div>
  );
}

export default MockDrillReport;
