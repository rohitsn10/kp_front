import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Pagination, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetSubActivitiesQuery, useUpdateSubActivityMutation,useDeleteSubActivityMutation } from "../../../api/users/subActivityApi";
import ProjectSubActivityModal from "../../../components/pages/projects/ProjectSubActivity/ProjectSubActivityModal";

function ProjectSubActivityPage() {
  const { data, isLoading, error,refetch } = useGetSubActivitiesQuery();
  console.log("Project Sub activity",data)
  const [open, setOpen] = useState(false);
  const [createModalOpen,setCreateModalOpen]=useState(false)
  const [selectedSubActivity, setSelectedSubActivity] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [updateSubActivity] = useUpdateSubActivityMutation();
  const [subActivityInput,setSubActivityInput]=useState('');


  const [deleteSubActivity] = useDeleteSubActivityMutation();


  if (isLoading) return <Typography align="center" variant="h6" color="primary">Loading...</Typography>;
  if (error) return <Typography align="center" color="error">Error loading data.</Typography>;

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
    try {
      await deleteSubActivity(id); // Trigger delete mutation
      refetch(); // Refetch data after deletion
    } catch (error) {
      console.error("Failed to delete sub-activity:", error);
    }
  };

  const filteredProjects = data?.data?.filter((project) =>
    project.project_activity_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjects = filteredProjects?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-white shadow-lg p-6 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-lg">
      {/* <Typography variant="h4" sx={{ color: "#29346B", fontWeight: "bold" }} gutterBottom align="center">
        Project Activities
      </Typography>
      <Button 
                          variant="contained"
                          style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
       onClick={()=>{setCreateModalOpen(!createModalOpen)}}>Add Sub Activity</Button>
      <TextField
        fullWidth
        label="Search by Project Name"
        variant="outlined"
        margin="dense"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> */}

<Grid container  alignItems="center">
  <Grid item xs={12} textAlign="center">
    <Typography variant="h4" sx={{ color: "#29346B", fontWeight: "bold" }} gutterBottom>
      Project Sub Activities
    </Typography>
  </Grid>

  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Search by Project Name"
      variant="outlined"
      margin="dense"
      sx={{width:'250px'}}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Grid>

  <Grid item xs={12} sm={6} textAlign="right">
    <Button 
      variant="contained"
      style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
      onClick={() => { setCreateModalOpen(!createModalOpen) }}
    >
      Add Sub Activity
    </Button>
  </Grid>
</Grid>


      {paginatedProjects?.map((project) => (
        <Accordion key={project.project_activity_id} sx={{ borderRadius: "8px", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {project.project_activity_name} ({project.solar_or_wind})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {project.sub_activity.map((sub) => (
                <ListItem key={sub.sub_activity_id} secondaryAction={
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ borderRadius: "20px", marginRight: "8px" }}
                      onClick={() => handleOpen(sub)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ borderRadius: "20px" }}
                      onClick={() => handleDelete(sub.sub_activity_id)} // Call delete handler
                    >
                      Delete
                    </Button>
                  </>
                  
                }>
                  <ListItemText 
                    primary={<Typography variant="body1" sx={{ fontWeight: "bold" }}>{sub.sub_activity_name}</Typography>} 
                    secondary={<Typography variant="caption" color="textSecondary">{new Date(sub.created_at).toLocaleString()}</Typography>} 
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* Pagination */}
      <Pagination 
        count={Math.ceil((filteredProjects?.length || 0) / itemsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", mt: 3 }}
      />
      
      {/* Edit Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Sub-Activity</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Sub-Activity Name" 
            value={updatedName} 
            onChange={(e) => setUpdatedName(e.target.value)} 
            margin="dense" 
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={handleClose} variant="outlined" color="secondary" sx={{ borderRadius: "20px" }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ borderRadius: "20px" }}>Update</Button>
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