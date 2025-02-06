import React, { useState } from "react";
import { 
  Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Button, Dialog, 
  DialogActions, DialogContent, DialogTitle, TextField, Pagination, Grid, Paper 
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
    <Paper elevation={3} sx={{ p: 4, maxWidth: "800px", mx: "auto", mt: 5, borderRadius: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="#29346B" align="center" gutterBottom>
        Project Sub Activities
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by Project Name"
            variant="outlined"
            size="small"
            sx={{
              width:'70%'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="right">
          <Button
            variant="contained"
            sx={{ bgcolor: "#FF8C00", fontWeight: "bold" }}
            onClick={() => setCreateModalOpen(true)}
          >
            Add Sub Activity
          </Button>
        </Grid>
      </Grid>

      {paginatedProjects?.map((project) => (
        <Accordion key={project.project_activity_id} sx={{ mt: 2, borderRadius: "8px", boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="bold">
                {/* <h3>Main Activity: <span>{project.project_activity_name}</span></h3>  */}
                {/* <p>({project.solar_or_wind})</p>   */}
                {/* <h3 className="text-lg font-semibold text-gray-800">
                    Main Activity: <span className="font-normal text-gray-600">{project.project_activity_name}</span>
                  </h3> */}
                  <div>
                    <p className="text-[12px] text-gray-600">Main Activity</p>
                    <h3 className="text-xl font-semibold text-gray-800">{project.project_activity_name}</h3>
                  </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
          <h2 className="text-gray-600 font-semibold text-[14px]">Project Sub Activities</h2>
            <List>
              {project.sub_activity.map((sub) => (
                <ListItem key={sub.sub_activity_id} secondaryAction={
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: "20px", mr: 1 }}
                      onClick={() => handleOpen(sub)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ borderRadius: "20px" }}
                      onClick={() => handleDelete(sub.sub_activity_id)}
                    >
                      Delete
                    </Button>
                  </>
                }>
                  <ListItemText 
                    primary={<Typography variant="body1" color="#29346B" fontWeight="bold">{sub.sub_activity_name}</Typography>} 
                    secondary={<Typography variant="caption" color="textSecondary">{new Date(sub.created_at).toLocaleString()}</Typography>} 
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Pagination 
        count={Math.ceil((filteredProjects?.length || 0) / itemsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", mt: 3 }}
      />
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Edit Sub-Activity</DialogTitle>
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
    </Paper>
  );
}

export default ProjectSubActivityPage;