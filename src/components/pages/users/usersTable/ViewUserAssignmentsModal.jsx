// Enhanced ViewUserAssignmentsModal with User Details - Fixed Layout
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import { toast } from 'react-toastify';
import { useGetUserAllThingsQuery } from '../../../../api/users/usersApi';

const ViewUserAssignmentsModal = ({ 
  open, 
  handleClose, 
  selectedUserId,
  assignUserAllThings,
  onSuccess
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // State for search/filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for assignment removal
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedRowForRemoval, setSelectedRowForRemoval] = useState(null);
  
  // Use the RTK Query hook directly with skip option
  const { 
    data: assignmentResponse, 
    isLoading, 
    error: fetchError, 
    refetch 
  } = useGetUserAllThingsQuery(selectedUserId, { 
    skip: !open || !selectedUserId,
    refetchOnMountOrArgChange: true 
  });
  
  // Extract user data and assignments
  const userData = assignmentResponse?.data;
  
  // Format all assignments into a flat array for the table
  const [tableData, setTableData] = useState([]);
  
  useEffect(() => {
    if (userData) {
      const allAssignments = [];
      
      // Add all assignments to the table
      if (userData.assignments && userData.assignments.length > 0) {
        userData.assignments.forEach((assignment, index) => {
          allAssignments.push({
            id: `assignment-${index}`,
            department_name: assignment.department,
            department_id: assignment.department_id,
            project_name: assignment.project,
            project_id: assignment.project_id,
            group_name: assignment.group,
            group_id: assignment.group_id
          });
        });
      }
      
      setTableData(allAssignments);
    }
  }, [userData]);
  
  // Filter table data based on search term
  const filteredData = tableData.filter(row => 
    row.department_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.group_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get current page data
  const currentPageData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setPage(0);
      setSearchTerm('');
      setIsRemoving(false);
      setSelectedRowForRemoval(null);
    }
  }, [open]);
  
  const handleRemoveAssignment = async (row) => {
    if (!selectedUserId) return;
    
    setIsRemoving(true);
    setSelectedRowForRemoval(row.id);
    
    try {
      const formData = new FormData();
      formData.append('user_id', selectedUserId.toString());
      
      // Add all removal fields for this row
      if (row.department_id) {
        formData.append('remove_department_id', row.department_id.toString());
      }
      
      if (row.project_id) {
        formData.append('remove_project_id', row.project_id.toString());
      }
      
      if (row.group_id) {
        formData.append('remove_group_id', row.group_id.toString());
      }
      
      const response = await assignUserAllThings(formData).unwrap();
      
      if (response?.status) {
        toast.success('Successfully removed assignment');
        refetch(); // Refresh the data
        onSuccess(); // Refresh parent data if needed
      } else {
        toast.error(response?.message || 'Failed to remove assignment');
      }
    } catch (err) {
      console.error('Error removing assignment:', err);
      toast.error('Error removing assignment');
    } finally {
      setIsRemoving(false);
      setSelectedRowForRemoval(null);
    }
  };
  
  // Render user details section - more compact design
  const renderUserDetails = () => {
    if (!userData) return null;
    
    const profileImageUrl = userData.user_profile_image || "profile_image/default_profile.jpeg";
    const fullImageUrl = profileImageUrl.startsWith('http') 
      ? profileImageUrl 
      : `http://127.0.0.1:8000/media/${profileImageUrl}`;
    
    return (
      <Paper 
        elevation={0}
        sx={{ 
          mb: 2, 
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Grid container spacing={0}>
          {/* Profile Image */}
          <Grid item xs={12} sm={3} md={2}>
            <Box 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                borderRight: { xs: 'none', sm: '1px solid #e0e0e0' },
                borderBottom: { xs: '1px solid #e0e0e0', sm: 'none' }
              }}
            >
              <Avatar 
                src={fullImageUrl}
                alt={userData.username}
                sx={{ 
                  width: 80, 
                  height: 80,
                  mb: 1,
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold" align="center">
                {userData.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: '0.8rem' }}>
                {userData.user_designation || 'No Designation'}
              </Typography>
            </Box>
          </Grid>
          
          {/* User Details - More compact */}
          <Grid item xs={12} sm={9} md={10}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <EmailIcon sx={{ color: '#3f51b5', mr: 1, fontSize: '1rem' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {userData.user_mail || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <PhoneIcon sx={{ color: '#3f51b5', mr: 1, fontSize: '1rem' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {userData.user_phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <HomeIcon sx={{ color: '#3f51b5', mr: 1, fontSize: '1rem' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {userData.user_address || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <CalendarTodayIcon sx={{ color: '#3f51b5', mr: 1, fontSize: '1rem' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {userData.user_dob ? new Date(userData.user_dob).toLocaleDateString() : 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };
  
  // Render mobile view
  const renderMobileView = () => {
    return (
      <Box sx={{ p: 0 }}>
        {currentPageData.length > 0 ? (
          currentPageData.map((row, index) => (
            <Paper
              key={row.id}
              elevation={0}
              sx={{ 
                p: 2, 
                mb: 2,
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #e8e8e8'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '24px', 
                  height: '100%', 
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'center',
                  pt: 2
                }}
              >
                <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  {page * rowsPerPage + index + 1}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton 
                  color="error"
                  onClick={() => handleRemoveAssignment(row)}
                  disabled={isRemoving && selectedRowForRemoval === row.id}
                  size="small"
                >
                  {isRemoving && selectedRowForRemoval === row.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <DeleteIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
              
              <Box sx={{ pl: 3 }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {row.department_name || '—'}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Project
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {row.project_name || '—'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Group
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {row.group_name || '—'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? 'No assignments match your search' : 'No assignments found for this user'}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render table view for larger screens
  const renderTableView = () => {
    return (
      <>
        <TableContainer>
          <Table sx={{ minWidth: isTablet ? 500 : 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell width="60px" sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Group</TableCell>
                <TableCell align="center" width="80px" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.length > 0 ? (
                currentPageData.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.department_name || '—'}</TableCell>
                    <TableCell>{row.project_name || '—'}</TableCell>
                    <TableCell>{row.group_name || '—'}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="error"
                        onClick={() => handleRemoveAssignment(row)}
                        disabled={isRemoving}
                        size="small"
                      >
                        {isRemoving && selectedRowForRemoval === row.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm ? 'No assignments match your search' : 'No assignments found for this user'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          width: isMobile ? '95%' : '90%',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          color: '#29346B',
          fontSize: isMobile ? '18px' : '20px',
          fontWeight: '600',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eaeaea',
          gap: isMobile ? 2 : 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" />
          <span>User Details & Assignments</span>
        </Box>
        
        <Box display="flex" alignItems="center" width={isMobile ? '100%' : 'auto'}>
          <TextField
            placeholder="Search assignments"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: isMobile ? '100%' : '250px'
            }}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent 
        sx={{ 
          p: 2, 
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading user data...
            </Typography>
          </Box>
        ) : fetchError ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="400px"
            p={3}
          >
            <Typography variant="body1" color="error" align="center" gutterBottom>
              Failed to load user data. Please try again.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={refetch}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            {/* User Details Section */}
            {renderUserDetails()}
            
            {/* Assignment Section Header - Simple and compact */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                mt: 1
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                Assignment History ({filteredData.length})
              </Typography>
            </Box>
            
            {/* Assignments Table/List */}
            <Paper 
              elevation={0}
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                mb: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ overflowY: 'auto', flex: 1 }}>
                {isMobile ? renderMobileView() : renderTableView()}
              </Box>
              
              {/* Pagination - Always visible */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={filteredData.length > 0 ? page : 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  bgcolor: '#f5f5f5',
                  borderTop: '1px solid #e0e0e0',
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                    fontSize: isMobile ? '0.75rem' : 'inherit',
                  },
                  '.MuiTablePagination-select': {
                    marginRight: isMobile ? '8px' : '32px',
                    marginLeft: isMobile ? '4px' : '8px',
                  }
                }}
              />
            </Paper>
          </>
        )}
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          p: isMobile ? 1.5 : 2, 
          borderTop: '1px solid #eaeaea',
          justifyContent: 'center'
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: isMobile ? '14px' : '16px',
            padding: isMobile ? '6px 16px' : '8px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E66A1F',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserAssignmentsModal;