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
  FormControl,
  Alert
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import { AiOutlineStop } from "react-icons/ai";
import CreateProjectActivity from '../../../components/pages/projects/ProjectActivity/CreateProjectActivity';
import { useGetActivitiesQuery, useUpdateActivityMutation, useDeleteActivityMutation } from '../../../api/users/projectActivityApi';
import DeleteIcon from '@mui/icons-material/Delete';

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
                    Error loading activities. Please try again later.
                </Alert>
            </div>
        );
    }

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
        <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
            {/* Responsive Header */}
            <div className="mb-6">
                {/* Title - Always on top on mobile */}
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
                        Activity Listing
                    </h2>
                </div>
                
                {/* Search and Button Container */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
                        <TextField
                            value={activityFilter}
                            placeholder="Search activities..."
                            onChange={(e) => setActivityFilter(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
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
                            variant="contained"
                            fullWidth
                            onClick={() => setOpen(!open)}
                            sx={{
                                backgroundColor: '#FF8C00',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: { xs: '14px', sm: '16px' },
                                textTransform: 'none',
                                padding: { xs: '10px 16px', sm: '8px 24px' },
                                '&:hover': {
                                    backgroundColor: '#e67c00'
                                }
                            }}
                        >
                            Add Activity
                        </Button>
                    </div>
                </div>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
                <TableContainer 
                    component={Paper}
                    style={{ 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        minWidth: '300px'
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#F2EDED' }}>
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
                                    Type
                                </TableCell>
                                <TableCell 
                                    align="center"
                                    style={{ fontWeight: 'normal', color: '#5C5E67' }}
                                    sx={{
                                        fontSize: { xs: '12px', sm: '14px', md: '16px' },
                                        padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                    }}
                                >
                                    Activity Name
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
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {currentRows.map((row) => (
                                <TableRow 
                                    key={row.sr}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                >
                                    <TableCell 
                                        align="center"
                                        sx={{
                                            fontSize: { xs: '14px', sm: '16px', md: '20px' },
                                            padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                        }}
                                    >
                                        {row.sr}
                                    </TableCell>
                                    <TableCell 
                                        align="center"
                                        sx={{
                                            fontSize: { xs: '14px', sm: '16px', md: '20px' },
                                            padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {row.type}
                                    </TableCell>
                                    <TableCell 
                                        align="center" 
                                        style={{ color: '#1D2652' }}
                                        sx={{
                                            fontSize: { xs: '14px', sm: '16px', md: '20px' },
                                            padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' },
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {row.activityName}
                                    </TableCell>
                                    <TableCell 
                                        align="center"
                                        sx={{
                                            padding: { xs: '8px 4px', sm: '12px 8px', md: '16px' }
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                            {/* Edit Icon */}
                                            <RiEditFill
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    color: '#61D435', 
                                                    fontSize: '20px'
                                                }}
                                                title="Edit"
                                                onClick={() => {
                                                    setSelectedActivity(row);
                                                    setUpdatedActivityName(row.activityName);
                                                    setUpdatedActivityType(row.type);
                                                    setEditModalOpen(true);
                                                }}
                                            />
                                            {/* Delete Icon */}
                                            <DeleteIcon
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    color: 'red', 
                                                    fontSize: '20px'
                                                }}
                                                title="Delete"
                                                onClick={() => handleDeleteActivity(row.id)}
                                            />
                                        </div>
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
                    <p className="text-gray-500 text-lg">No activities found matching your search.</p>
                </div>
            )}

            {/* Modal for Updating Activity */}
            <Dialog 
                open={editModalOpen} 
                onClose={() => setEditModalOpen(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        margin: { xs: '16px', sm: '32px' },
                        width: { xs: 'calc(100% - 32px)', sm: 'auto' }
                    }
                }}
            >
                <DialogContent sx={{ padding: { xs: '16px', sm: '24px' } }}>
                    <h2 className="text-[#29346B] text-lg sm:text-2xl font-semibold mb-3 sm:mb-5">
                        Update Activity
                    </h2>
                    <TextField
                        label="Activity Name"
                        variant="outlined"
                        fullWidth
                        value={updatedActivityName}
                        onChange={(e) => setUpdatedActivityName(e.target.value)}
                        margin="normal"
                        sx={{
                            '& .MuiInputLabel-root': {
                                fontSize: { xs: '14px', sm: '16px' }
                            },
                            '& .MuiInputBase-input': {
                                fontSize: { xs: '14px', sm: '16px' }
                            }
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel 
                            sx={{
                                fontSize: { xs: '14px', sm: '16px' }
                            }}
                        >
                            Activity Type
                        </InputLabel>
                        <Select
                            value={updatedActivityType}
                            onChange={(e) => setUpdatedActivityType(e.target.value)}
                            label="Activity Type"
                            sx={{
                                '& .MuiSelect-select': {
                                    fontSize: { xs: '14px', sm: '16px' }
                                }
                            }}
                        >
                            <MenuItem value="solar">Solar</MenuItem>
                            <MenuItem value="wind">Wind</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ 
                    padding: { xs: '8px 16px 16px', sm: '8px 24px 24px' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0 }
                }}>
                    <Button 
                        onClick={() => setEditModalOpen(false)} 
                        color="secondary"
                        sx={{ 
                            fontSize: { xs: '14px', sm: '16px' },
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateActivity} 
                        color="primary" 
                        disabled={isUpdating}
                        variant="contained"
                        sx={{ 
                            fontSize: { xs: '14px', sm: '16px' },
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>

            <CreateProjectActivity
                open={open}
                setOpen={setOpen}
                mainActivityInput={mainActivityInput}
                setMainActivityInput={setMainActivityInput}
                refetch={refetch}
            />
        </div>
    );
}

export default ProjectMainActivityPage;