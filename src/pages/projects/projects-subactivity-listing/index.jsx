import React, { useState } from "react";
import { 
  Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Button, Dialog, 
  DialogActions, DialogContent, DialogTitle, TextField, Pagination, Grid, Paper, CircularProgress, Alert 
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetSubActivitiesQuery, useUpdateSubActivityMutation, useDeleteSubActivityMutation } from "../../../api/users/subActivityApi";
import ProjectSubActivityModal from "../../../components/pages/projects/ProjectSubActivity/ProjectSubActivityModal";

function ProjectSubActivityPage() {
  const { data, isLoading, error, refetch } = useGetSubActivitiesQuery();
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSubActivity, setSelectedSubActivity] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [updateSubActivity] = useUpdateSubActivityMutation();
  const [subActivityInput, setSubActivityInput] = useState('');
  const [deleteSubActivity] = useDeleteSubActivityMutation();

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
          Error loading sub-activities data. Please try again later.
        </Alert>
      </div>
    );
  }

  const handleOpen = (sub) => {
    setSelectedSubActivity(sub);
    setUpdatedName(sub.sub_activity_name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSubActivity(null);
  };

  const handleUpdate = async () => {
    if (selectedSubActivity) {
      await updateSubActivity({ id: selectedSubActivity.sub_activity_id, subActivityNames: updatedName });
      refetch();
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-activity?")) return;
    
    try {
      await deleteSubActivity(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete sub-activity:", error);
    }
  };

  const filteredProjects = data?.data?.filter((project) =>
    project.project_activity_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjects = filteredProjects?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 w-full max-w-4xl mx-auto my-4 sm:my-6 md:my-8 rounded-lg shadow-sm">
      {/* Responsive Header */}
      <div className="mb-6">
        {/* Title - Always on top on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-bold">
            Project Sub Activities
          </h1>
        </div>
        
        {/* Search and Button Container */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
            <TextField
              fullWidth
              label="Search by Project Name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '14px', sm: '16px' }
                },
                '& .MuiInputBase-input': {
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
              onClick={() => setCreateModalOpen(true)}
              sx={{
                bgcolor: "#FF8C00",
                fontWeight: "bold",
                fontSize: { xs: '14px', sm: '16px' },
                textTransform: 'none',
                padding: { xs: '10px 16px', sm: '8px 24px' },
                '&:hover': {
                  bgcolor: "#e67c00"
                }
              }}
            >
              Add Sub Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Accordions Container */}
      <div className="space-y-3 sm:space-y-4">
        {paginatedProjects?.map((project) => (
          <Accordion 
            key={project.project_activity_id} 
            sx={{ 
              borderRadius: "8px", 
              boxShadow: 2,
              '&:before': {
                display: 'none',
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{
                padding: { xs: '8px 16px', sm: '16px 24px' }
              }}
            >
              <div className="w-full">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Main Activity</p>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 break-words">
                  {project.project_activity_name}
                </h3>
              </div>
            </AccordionSummary>
            
            <AccordionDetails
              sx={{
                padding: { xs: '8px 16px 16px', sm: '16px 24px 24px' }
              }}
            >
              <h2 className="text-gray-600 font-semibold text-sm sm:text-base mb-3">
                Project Sub Activities
              </h2>
              
              <List sx={{ padding: 0 }}>
                {project.sub_activity.map((sub) => (
                  <ListItem 
                    key={sub.sub_activity_id}
                    sx={{
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      gap: { xs: 2, sm: 0 },
                      padding: { xs: '12px 0', sm: '8px 0' },
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <ListItemText 
                        primary={
                          <Typography 
                            variant="body1" 
                            color="#29346B" 
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: '14px', sm: '16px' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {sub.sub_activity_name}
                          </Typography>
                        } 
                        secondary={
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{
                              fontSize: { xs: '11px', sm: '12px' }
                            }}
                          >
                            {new Date(sub.created_at).toLocaleString()}
                          </Typography>
                        } 
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpen(sub)}
                        sx={{ 
                          borderRadius: "20px",
                          fontSize: { xs: '12px', sm: '14px' },
                          padding: { xs: '4px 12px', sm: '6px 16px' },
                          flex: { xs: 1, sm: 'none' },
                          minWidth: { xs: 'auto', sm: '64px' }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(sub.sub_activity_id)}
                        sx={{ 
                          borderRadius: "20px",
                          fontSize: { xs: '12px', sm: '14px' },
                          padding: { xs: '4px 12px', sm: '6px 16px' },
                          flex: { xs: 1, sm: 'none' },
                          minWidth: { xs: 'auto', sm: '64px' }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* No Data Message */}
      {!isLoading && (!paginatedProjects || paginatedProjects.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-base sm:text-lg">
            {searchTerm ? 'No projects found matching your search.' : 'No sub-activities available.'}
          </p>
        </div>
      )}
      
      {/* Responsive Pagination */}
      {filteredProjects && filteredProjects.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination 
            count={Math.ceil((filteredProjects?.length || 0) / itemsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '12px', sm: '14px' }
              }
            }}
          />
        </div>
      )}
      
      {/* Edit Modal */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            margin: { xs: '16px', sm: '32px' },
            width: { xs: 'calc(100% - 32px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: "bold",
            fontSize: { xs: '18px', sm: '20px' },
            padding: { xs: '16px', sm: '24px' }
          }}
        >
          Edit Sub-Activity
        </DialogTitle>
        <DialogContent sx={{ padding: { xs: '8px 16px', sm: '8px 24px' } }}>
          <TextField 
            fullWidth 
            label="Sub-Activity Name" 
            value={updatedName} 
            onChange={(e) => setUpdatedName(e.target.value)} 
            margin="dense" 
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: { xs: '14px', sm: '16px' }
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '14px', sm: '16px' }
              }
            }}
          />
        </DialogContent>
        <DialogActions 
          sx={{ 
            padding: { xs: '8px 16px 16px', sm: '8px 24px 24px' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            color="secondary" 
            sx={{ 
              borderRadius: "20px",
              fontSize: { xs: '14px', sm: '16px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained" 
            color="primary" 
            sx={{ 
              borderRadius: "20px",
              fontSize: { xs: '14px', sm: '16px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ProjectSubActivityModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        subActivityInput={subActivityInput}
        setSubActivityInput={setSubActivityInput}
        refetch={refetch}
      />
    </div>
  );
}

export default ProjectSubActivityPage;