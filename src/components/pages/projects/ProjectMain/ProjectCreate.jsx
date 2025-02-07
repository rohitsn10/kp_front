import { Autocomplete, Button, Dialog, DialogContent, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useFetchUsersQuery } from '../../../../api/users/usersApi';
import { useGetActivitiesQuery } from '../../../../api/users/projectActivityApi';

// import { useFetchUsersQuery } from '../api/userApi';
function ProjectCreate({ open, handleClose }) {
    const { data: usersData, isLoading } = useFetchUsersQuery();
    const spocOptions = usersData?.map(user => ({
      id: user.id,
      full_name: user.full_name
  })) || [];
  // const { data: activitiesData, isLoading: activitiesLoading } = useGetActivitiesQuery();
  // console.log(activitiesData)
  // const activitiesFetched = activitiesData?.data || []; // Fetch activities dynamically
  
  const { data: activitiesData, isLoading: activitiesLoading } = useGetActivitiesQuery();
  const activitiesFetched = activitiesData?.data || []; // Ensure we get an array
  

    const [companyName, setCompanyName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectLocation, setProjectLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [codDate, setCodDate] = useState('');
    const [committedDate, setCommittedDate] = useState('');
    const [totalArea, setTotalArea] = useState('');
    const [capacity, setCapacity] = useState('');
    const [numDays, setNumDays] = useState('');
    
    // State for selection fields
    const [projectCategory, setProjectCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [activity, setActivity] = useState(null);
    const [subActivities, setSubActivities] = useState([]);
    const [spocs, setSpocs] = useState([]);
    const [criticalActivity, setCriticalActivity] = useState(null);
    console.log(spocs)

    const categories = ["Category 1", "Category 2", "Category 3"];
    const subCategories = ["Sub Category 1", "Sub Category 2", "Sub Category 3"];
    const activities = ["Activity 1", "Activity 2", "Activity 3"];
    const subActivitiesOptions = ["Sub Activity 1", "Sub Activity 2", "Sub Activity 3"];
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogContent>
                <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Multiple Activities</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <TextField value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder='Select Company Name' fullWidth sx={inputStyles} />
                    <TextField value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder='Select Project Name' fullWidth sx={inputStyles} />
                    <TextField value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} placeholder='Project Location' fullWidth sx={inputStyles} />
                    <TextField type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth sx={inputStyles} />
                    <TextField type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth sx={inputStyles} />
                    <TextField type='date' value={codDate} onChange={(e) => setCodDate(e.target.value)} fullWidth sx={inputStyles} />
                    <TextField type='date' value={committedDate} onChange={(e) => setCommittedDate(e.target.value)} fullWidth sx={inputStyles} />
                    <TextField type='number' value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder='Add Total Area' fullWidth sx={inputStyles} />
                    <TextField type='number' value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder='Add Capacity' fullWidth sx={inputStyles} />
                    <Autocomplete options={categories} value={projectCategory} onChange={(_, value) => setProjectCategory(value)} renderInput={(params) => <TextField {...params} fullWidth placeholder='Select Project Category' sx={inputStyles} />} />
                    <Autocomplete options={subCategories} value={subCategory} onChange={(_, value) => setSubCategory(value)} renderInput={(params) => <TextField {...params} fullWidth placeholder='Select Sub Category' sx={inputStyles} />} />

                    {/* <Autocomplete options={activities} value={activity} onChange={(_, value) => setActivity(value)} renderInput={(params) => <TextField {...params} fullWidth placeholder='Select Activity' sx={inputStyles} />} /> */}

                    {/* <Autocomplete
                        options={activitiesFetched}
                        getOptionLabel={(option) => option.name} // Adjust based on the actual property name
                        value={activitiesFetched.find(act => act.id === activity) || null} // Ensure selected value is an object
                        onChange={(_, value) => setActivity(value?.id || null)} // Store only ID in state
                        renderInput={(params) => (
                            <TextField {...params} fullWidth placeholder="Select Activity" sx={inputStyles} />
                        )}
                    /> */}
                    <Autocomplete
    options={activitiesFetched}
    getOptionLabel={(option) => option.activity_name} // Display the activity name
    value={activitiesFetched.find(act => act.id === activity) || null} // Match selected activity
    onChange={(_, value) => setActivity(value?.id || null)} // Store only ID
    renderInput={(params) => (
        <TextField {...params} fullWidth placeholder="Select Activity" sx={inputStyles} />
    )}
/>

                    <Autocomplete multiple options={subActivitiesOptions} value={subActivities} onChange={(_, value) => setSubActivities(value)} renderInput={(params) => <TextField {...params} fullWidth placeholder='Select Sub Activity' sx={inputStyles} />} />

                    {/* <Autocomplete 
    multiple 
    options={spocOptions} 
    getOptionLabel={(option) => option.full_name} 
    value={spocs} 
    onChange={(_, value) => setSpocs(value)} 
    renderInput={(params) => <TextField {...params} fullWidth placeholder='Select SPOC' sx={inputStyles} />} 
/> */}
<Autocomplete
    multiple
    options={spocOptions.filter((user) => !spocs.includes(user.id))} // Prevent duplicate selection
    getOptionLabel={(option) => option.full_name} // Display full name in dropdown
    value={spocOptions.filter((user) => spocs.includes(user.id))} // Map selected IDs to user objects
    onChange={(_, selectedUsers) => setSpocs(selectedUsers.map(user => user.id))} // Store only IDs in state
    renderInput={(params) => (
        <TextField {...params} fullWidth placeholder="Select SPOC" sx={inputStyles} />
    )}
/>

                    <Autocomplete options={criticalActivities} value={criticalActivity} onChange={(_, value) => setCriticalActivity(value)} renderInput={(params) => <TextField {...params} fullWidth placeholder='Select Critical Activity' sx={inputStyles} />} />
                    <TextField type='number' value={numDays} onChange={(e) => setNumDays(e.target.value)} placeholder='Enter number of Days' fullWidth sx={inputStyles} />
                </div>
                <div className='flex flex-row justify-center my-4'>
                    <Button variant="contained" style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', padding: '10px 30px', fontSize: '16px', textTransform: 'none' }}>
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProjectCreate;
