import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete } from '@mui/material';
import { useGetActivitiesQuery } from '../../../../api/users/projectActivityApi';
import { useGetDropdownSubActivitiesQuery } from '../../../../api/users/subActivityApi';
import { useCreateSubSubActivityMutation } from '../../../../api/users/multipleActivityApi'; // Import the mutation hook

export default function ProjectMultipleActivity({
  open,
  setOpen,
  multipleActivityInput,
  setMultipleActInput,
}) {
  const [selectedProjectActivity, setSelectedProjectActivity] = useState(null);
  const [selectedSubActivity, setSelectedSubActivity] = useState(null);
  const [subSubActivityNames, setSubSubActivityNames] = useState(''); // State for sub-sub activity name

  // Fetching activities using useGetActivitiesQuery hook
  const { data: activityData, error: activityError, isLoading: activityLoading } = useGetActivitiesQuery();

  // Fetching sub-activities using useGetDropdownSubActivitiesQuery hook
  const { data: subActivityData, error: subActivityError, isLoading: subActivityLoading } = useGetDropdownSubActivitiesQuery(selectedProjectActivity?.value, {
    skip: !selectedProjectActivity, // Skip fetching until a project activity is selected
  });

  // Using the mutation hook to create a sub-sub activity
  const [createSubSubActivity, { isLoading: creating, error: createError, isSuccess }] = useCreateSubSubActivityMutation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Prepare the data to be sent
    const subSubActivityData = {
      projectActivityId: selectedProjectActivity?.value,
      subActivityId: selectedSubActivity?.value,
      subSubActivityNames: [subSubActivityNames], // We assume it's an array
    };

    // Call the mutation to create the sub-sub activity
    createSubSubActivity(subSubActivityData)
      .then((response) => {
        console.log('Sub-Sub Activity Created:', response.data);
        // Handle success (you can close the dialog or show a success message)
        setOpen(false);
      })
      .catch((error) => {
        console.error('Error creating sub-sub activity:', error);
        // Handle error (you can show an error message if needed)
      });
  };

  // Activity dropdown options
  const activityOptions = activityData?.data?.map((item) => ({
    label: item.activity_name,
    value: item.id,
  })) || [];

  // Sub-Activity dropdown options
  const subActivityOptions = subActivityData?.data?.[0]?.sub_activity?.map((item) => ({
    label: item.sub_activity_name,
    value: item.sub_activity_id,
  })) || [];

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: '600px',
          },
        }}
      >
        <DialogContent>
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Multiple Activities</h2>

          {/* Input Field */}
          {/* <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Activity Name
          </label>
          <input
            type="text"
            className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            value={multipleActivityInput}
            placeholder="Enter Activity Name"
            onChange={(e) => setMultipleActInput(e.target.value)}
          /> */}

          {/* Project Activity Dropdown */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Project Activity
          </label>
          <Autocomplete
            options={activityOptions}
            getOptionLabel={(option) => option.label}
            value={selectedProjectActivity}
            onChange={(event, newValue) => {
              setSelectedProjectActivity(newValue);
              setSelectedSubActivity(null); // Reset sub-activity when activity changes
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select a project activity"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #FACC15', // Yellow border
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px', // Rounded corners
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    border: 'none',
                    borderRadius: '4px',
                  },
                }}
              />
            )}
          />

          {/* Sub-Activity Dropdown */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Sub Activity
          </label>
          <Autocomplete
            options={subActivityOptions}
            getOptionLabel={(option) => option.label}
            value={selectedSubActivity}
            onChange={(event, newValue) => setSelectedSubActivity(newValue)}
            disabled={!selectedProjectActivity} // Disable until a project activity is selected
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select a sub activity"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #FACC15', // Yellow border
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px', // Rounded corners
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    border: 'none',
                    borderRadius: '4px',
                  },
                }}
              />
            )}
          />

          {/* Sub-Sub Activity Name */}
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Sub-Sub Activity Name
          </label>
          <TextField
            value={subSubActivityNames}
            onChange={(e) => setSubSubActivityNames(e.target.value)}
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
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center', // Centers the button horizontally
            padding: '20px', // Adds spacing around the button
          }}
        >
          <Button
            onClick={handleSubmit}
            type="submit"
            sx={{
              backgroundColor: '#F6812D', // Orange background color
              color: '#FFFFFF', // White text color
              fontSize: '16px', // Slightly larger text
              padding: '6px 36px', // Makes the button bigger (adjust width here)
              width: '200px', // Explicit width for larger button
              borderRadius: '8px', // Rounded corners
              textTransform: 'none', // Disables uppercase transformation
              fontWeight: 'bold', // Makes the text bold
              '&:hover': {
                backgroundColor: '#E66A1F', // Slightly darker orange on hover
              },
            }}
          >
            {creating ? 'Creating...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
