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
  TextField,
  TablePagination,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import { AiOutlineStop } from "react-icons/ai";
import CreateProjectActivity from '../../../components/pages/projects/ProjectActivity/CreateProjectActivity';
import { useGetActivitiesQuery, useUpdateActivityMutation, useDeleteActivityMutation } from '../../../api/users/projectActivityApi';

function ProjectMainActivityPage() {
    const [activityFilter, setActivityFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [mainActivityInput, setMainActivityInput] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [updatedActivityName, setUpdatedActivityName] = useState('');
    const [updatedActivityType, setUpdatedActivityType] = useState('');

    // Fetch activities using RTK Query
    const { data, error, isLoading, refetch } = useGetActivitiesQuery();
    
    // Update activity mutation hook
    const [updateActivity, { isLoading: isUpdating }] = useUpdateActivityMutation();
    
    // Delete activity mutation hook
    const [deleteActivity, { isLoading: isDeleting }] = useDeleteActivityMutation();

    // Handle delete activity
    const handleDeleteActivity = async (id) => {
        if (!window.confirm("Are you sure you want to delete this activity?")) return;

        try {
            await deleteActivity(id).unwrap();
            refetch(); // Refresh the list after deletion
        } catch (error) {
            console.error("Failed to delete activity:", error);
        }
    };

    // Handle loading & error states
    if (isLoading) return <CircularProgress />;
    if (error) return <p>Error loading activities.</p>;

    // Transform API data to match table format
    const rows = data?.data?.map((item, index) => ({
        sr: index + 1,
        type: item.solar_or_wind,
        activityName: item.activity_name,
        addedDate: item.added_date || "N/A",
        action: item.status || "Pending",
        id: item.id // Ensure you store the activity id
    })) || [];

    // Filter rows based on search input
    const filteredRows = rows.filter((row) =>
        row.activityName?.toLowerCase().includes(activityFilter?.toLowerCase())
    );

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get current page rows
    const currentRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Handle update activity form submission
    const handleUpdateActivity = async () => {
        if (!updatedActivityName.trim() || !updatedActivityType.trim()) return;

        try {
            await updateActivity({
                id: selectedActivity.id,
                activityData: {
                    solarOrWind: updatedActivityType,
                    activityName: updatedActivityName
                }
            }).unwrap();
            setEditModalOpen(false); // Close the modal after successful update
            refetch();
        } catch (error) {
            console.error("Failed to update activity:", error);
        }
    };

    return (
        <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
            <div className="flex flex-row my-6 px-10 items-center justify-between">
                <TextField
                    value={activityFilter}
                    placeholder="Search"
                    onChange={(e) => setActivityFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                />
                <h2 className="text-3xl text-[#29346B] font-semibold">Activity Listing</h2>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
                    onClick={() => setOpen(!open)}
                >
                    Add Activity
                </Button>
            </div>

            <TableContainer style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#F2EDED' }}>
                            <TableCell align="center">Sr No.</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Activity Name</TableCell>
                            <TableCell align="center">Added Date</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {currentRows.map((row) => (
                            <TableRow key={row.sr}>
                                <TableCell align="center">{row.sr}</TableCell>
                                <TableCell align="center">{row.type}</TableCell>
                                <TableCell align="center">{row.activityName}</TableCell>
                                <TableCell align="center">{row.addedDate}</TableCell>
                                <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                                    {/* Edit Icon */}
                                    <RiEditFill
                                        style={{ cursor: 'pointer', color: '#61D435', fontSize: '23px' }}
                                        title="Edit"
                                        onClick={() => {
                                            setSelectedActivity(row);
                                            setUpdatedActivityName(row.activityName);
                                            setUpdatedActivityType(row.type);
                                            setEditModalOpen(true);
                                        }}
                                    />
                                    {/* Delete Icon */}
                                    <AiOutlineStop
                                        style={{ cursor: 'pointer', color: 'red', fontSize: '23px' }}
                                        title="Delete"
                                        onClick={() => handleDeleteActivity(row.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
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
            </TableContainer>

            {/* Modal for Updating Activity */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Update Activity</h2>
                    <TextField
                        label="Activity Name"
                        variant="outlined"
                        fullWidth
                        value={updatedActivityName}
                        onChange={(e) => setUpdatedActivityName(e.target.value)}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Activity Type</InputLabel>
                        <Select
                            value={updatedActivityType}
                            onChange={(e) => setUpdatedActivityType(e.target.value)}
                            label="Activity Type"
                        >
                            <MenuItem value="solar">Solar</MenuItem>
                            <MenuItem value="wind">Wind</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateActivity} color="primary" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectMainActivityPage;
