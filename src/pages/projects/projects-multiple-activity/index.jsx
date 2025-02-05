import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetSubSubActivityQuery, useUpdateSubSubActivityMutation } from "../../../api/users/multipleActivityApi.js";
import ProjectMultipleActivityModal from "../../../components/pages/projects/ProjectMultipleActivity/ProjectMultipleActivity.jsx";

function ProjectMultipleActivity() {
  const { data, refetch } = useGetSubSubActivityQuery();
  const [updateSubSubActivity] = useUpdateSubSubActivityMutation();
  const [expanded, setExpanded] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm,setSearchTerm]=useState("")
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleEditClick = (id, name) => {
    setEditId(id);
    setEditValue(name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setEditValue("");
  };

  const handleUpdate = async () => {
    if (editId) {
      await updateSubSubActivity({ id: editId, subSubActivityName: editValue });
      handleClose();
      refetch();
    }
  };
  const handleDeleteMultipleActivity = (deleteID)=>{
    console.log("dele")
  }

  return (
    <div className="bg-white shadow-lg p-6 w-[90%] lg:w-[70%] mx-auto my-8 rounded-lg">
      {/* <h2 className="text-3xl border text-center text-[]">Project Multiple Activities</h2> */}
    <Typography variant="h4" fontWeight="bold" color="#29346B" align="center" gutterBottom>
            Project Sub Activities
    </Typography>
    <div className="flex flex-row justify-between my-4 items-center">
      <TextField
        fullWidth
        label="Search by Project Name"
        variant="outlined"
        margin="dense"

        sx={{width:'220px'}}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    <Button 
      variant="contained"
      style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold',padding:"10px", fontSize: '16px', textTransform: 'none' }}
      onClick={() => { setOpenCreateModal(!openCreateModal) }}
    >
      Add Sub Activity
    </Button>
    </div>
      {/* <Grid container sx={{
        margin:"20px"
      }}  alignItems="center">
  <Grid item xs={12} textAlign="center">
    <Typography variant="h4" sx={{ color: "#29346B", fontWeight: "bold" }} gutterBottom>
    Project Multiple Activities
    </Typography>
  </Grid>

  <Grid item xs={12} sm={6}>

  </Grid>

  <Grid item xs={12} sm={6} textAlign="right">
    <Button 
      variant="contained"
      style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
      onClick={() => { setOpenCreateModal(!openCreateModal) }}
    >
      Add Sub Activity
    </Button>
  </Grid>
</Grid> */}


      {data?.data?.map((project) => (
        <Accordion
          key={project.project_activity_id}
          expanded={expanded === project.project_activity_id}
          onChange={handleChange(project.project_activity_id)}
          sx={{ borderRadius: "8px", mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>

               {/* ({project.solar_or_wind}) */}
              <div>
              <p className="text-[12px] text-gray-600">Project Main Activity</p>
                    <h3 className="text-xl font-semibold text-gray-800">
                        {project.project_activity_name}
                        
                    </h3>
                  </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
          <h2 className="text-gray-600 font-semibold text-[14px]">Project Sub Activities</h2>
            {project.sub_activity.map((sub) => (
              <Accordion key={sub.sub_activity_id} sx={{ borderRadius: "8px", mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {sub.sub_activity_name.length > 0 ? sub.sub_activity_name[0] : "--"}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                <h2 className="text-gray-600 font-semibold text-[14px]">Project Multiple Activities</h2>
                  <List>
                    {sub.sub_sub_activities.map((subSub) => (
                      <ListItem key={subSub.sub_sub_activity_id} secondaryAction={
                        <>
                          <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleEditClick(subSub.sub_sub_activity_id, subSub.sub_sub_activity_name)}>Edit</Button>
                          <Button variant="contained" color="error" size="small" onClick={()=>handleDeleteMultipleActivity(subSub.sub_sub_activity_id)}>Delete</Button>
                        </>
                      }>
                        <ListItemText primary={
                          
                          <Typography variant="body1" color="#29346B" fontWeight="bold">{subSub.sub_sub_activity_name}</Typography>
                          
                          } />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Sub-Sub Activity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Sub-Sub Activity Name"
            type="text"
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <ProjectMultipleActivityModal
          open={openCreateModal}
          setOpen={setOpenCreateModal}
          // multipleActivityInput={multipleActivityInput}
          // setMultipleActInput={setMultipleActInput}
      />
    </div>
  );
}

export default ProjectMultipleActivity;
