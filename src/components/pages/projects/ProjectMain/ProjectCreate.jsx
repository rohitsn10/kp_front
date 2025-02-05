import { Autocomplete, Button, Dialog, DialogContent, TextField } from '@mui/material'
import React from 'react'

function ProjectCreate({open,handleClose}) {
//    console.log("Project Create",open)
    // const [createModal,setCreateModal] = useState(false);
    const categories = ["Category 1", "Category 2", "Category 3"];
const subCategories = ["Sub Category 1", "Sub Category 2", "Sub Category 3"];
const activities = ["Activity 1", "Activity 2", "Activity 3"];
const subActivities = ["Sub Activity 1", "Sub Activity 2", "Sub Activity 3"];
const spocs = ["SPOC 1", "SPOC 2", "SPOC 3"];
const criticalActivities = ["Critical 1", "Critical 2", "Critical 3"];

    const inputStyles = {
        "& .MuiOutlinedInput-root": {
          border: "1px solid #FACC15",
          borderBottom: "4px solid #FACC15",
          borderRadius: "6px",
          padding: "1px",
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
          outline: "none",
          borderBottom: "4px solid #E6A015",
        },
      };
      
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: '700px',
          },
        }}
    >
        <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Multiple Activities</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                    <div className='col-span-1'>
                      <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
                        Company Name:
                      </label>
                      <TextField
                        // value={subSubActivityNames}
                        // onChange={(e) => setSubSubActivityNames(e.target.value)}
                        variant="outlined"
                        placeholder='Select Company Name'
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid #FACC15',
                            borderBottom: '4px solid #FACC15',
                            borderRadius: '6px',
                          },
                        }}
                      />
                      </div>
                      <div className='col-span-1'>
                      <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
                        Project Name:
                      </label>
                      <TextField
                        placeholder='Select Project Name'

                        // value={subSubActivityNames}
                        // onChange={(e) => setSubSubActivityNames(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid #FACC15',
                            borderBottom: '4px solid #FACC15',
                            borderRadius: '6px',
                          },
                        }}
                      />
                      </div>
                      <div className='col-span-1 md:col-span-2'>
                      <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
                        Project Location:
                      </label>
                      <TextField
                        // value={subSubActivityNames}
                        // onChange={(e) => setSubSubActivityNames(e.target.value)}
                        variant="outlined"
                        placeholder='Project Location'
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid #FACC15',
                            borderBottom: '4px solid #FACC15',
                            borderRadius: '6px',
                          },
                        }}
                      />
                      </div>
                            <div>
                                <h2 className="text-[#29346B] font-semibold text-lg">Start Date <span className="text-red-600"> *</span></h2>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    name="timeline"
                                    // value={formData.timeline}
                                    // onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    margin="dense"
                                    sx={inputStyles}
                                    // inputProps={{
                                    //   min: today,
                                    // }}
                                  />
                            </div>
                            <div>
                                <h2 className="text-[#29346B] font-semibold text-lg">End Date <span className="text-red-600"> *</span></h2>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    name="timeline"
                                    // value={formData.timeline}
                                    // onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    margin="dense"
                                    sx={inputStyles}
                                    // inputProps={{
                                    //   min: today,
                                    // }}
                                  />
                            </div>
                            <div>
                                <h2 className="text-[#29346B] font-semibold text-lg">COD: <span className="text-red-600"> *</span></h2>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    name="timeline"
                                    // value={formData.timeline}
                                    // onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    margin="dense"
                                    sx={inputStyles}
                                    // inputProps={{
                                    //   min: today,
                                    // }}
                                  />
                            </div>
                            <div>
                                <h2 className="text-[#29346B] font-semibold text-lg">Commited Date: <span className="text-red-600"> *</span></h2>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    name="timeline"
                                    // value={formData.timeline}
                                    // onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    margin="dense"
                                    sx={inputStyles}
                                    // inputProps={{
                                    //   min: today,
                                    // }}
                                  />
                            </div>
                            <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Total Area of Project:</label>
          <TextField placeholder='Add Total Area' type='number' fullWidth sx={inputStyles} />
        </div>
         <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Capacity:</label>
          <TextField type='number' placeholder='Add Capacity' fullWidth sx={inputStyles} />
        </div>
        
        <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Project Category:</label>
          <Autocomplete options={categories} renderInput={(params) => <TextField {...params} fullWidth  placeholder='Select Project Category' sx={inputStyles} />} />
        </div>
       
        <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Project Sub Category:</label>
          <Autocomplete options={subCategories} renderInput={(params) => <TextField {...params} fullWidth  placeholder='Select Sub Category' sx={inputStyles} />} />
        </div>
        <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Activity:</label>
          <Autocomplete options={activities} renderInput={(params) => <TextField {...params} fullWidth sx={inputStyles}  placeholder='Select Activity' />} />
        </div>
        <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Sub-Activity:</label>
          <Autocomplete options={subActivities} renderInput={(params) => <TextField {...params} fullWidth sx={inputStyles}  placeholder='Select Sub Activity' />} />
        </div>
        <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">SPOC:</label>
          <Autocomplete options={spocs} renderInput={(params) => <TextField {...params} fullWidth sx={inputStyles}  placeholder='Select SPOC' />} />
        </div>
        <div className='col-span-1'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Critical Activity:</label>
          <Autocomplete options={criticalActivities}  placeholder='Select Critical Activity' renderInput={(params) => <TextField {...params} fullWidth sx={inputStyles} />} />
        </div>
        <div className='col-span-1 md:col-span-2'>
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">Number of Days:</label>
          <TextField type='number'  placeholder='Enter number of Days' fullWidth sx={inputStyles} />
        </div> 

                </div>  
                <div className='flex flex-row justify-center my-4'>
                <Button 
                variant="contained"
                style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold',padding:"10px",paddingLeft:"30px",paddingRight:"30px",fontSize: '16px', textTransform: 'none', }}
                onClick={() => {  }}
                >
                Submit
                </Button>
                </div> 
        </DialogContent>
    </Dialog>
  )
}

export default ProjectCreate