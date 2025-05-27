import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetActivitiesQuery } from '../../../../api/users/projectActivityApi';
import { useGetDropdownSubActivitiesQuery } from '../../../../api/users/subActivityApi';
import { useCreateSubSubActivityMutation, useGetSubSubActivityQuery } from '../../../../api/users/multipleActivityApi';
import { toast } from 'react-toastify';

export default function ProjectMultipleActivityModal({
  open,
  setOpen,
  multipleActivityInput,
  setMultipleActInput,
}) {
  const [selectedProjectActivity, setSelectedProjectActivity] = useState(null);
  const [selectedSubActivity, setSelectedSubActivity] = useState(null);
  const [subSubActivityNames, setSubSubActivityNames] = useState(['']); // Array of strings

  // Fetching activities using useGetActivitiesQuery hook
  const { data: activityData, error: activityError, isLoading: activityLoading } = useGetActivitiesQuery();
  const { refetch } = useGetSubSubActivityQuery();

  // Fetching sub-activities using useGetDropdownSubActivitiesQuery hook
  const { data: subActivityData, error: subActivityError, isLoading: subActivityLoading } = useGetDropdownSubActivitiesQuery(selectedProjectActivity?.value, {
    skip: !selectedProjectActivity,
  });

  // Using the mutation hook to create a sub-sub activity
  const [createSubSubActivity, { isLoading: creating, error: createError, isSuccess }] = useCreateSubSubActivityMutation();

  // Function to add a new input field
  const addSubSubActivityInput = () => {
    setSubSubActivityNames([...subSubActivityNames, '']);
  };

  // Function to remove an input field
  const removeSubSubActivityInput = (index) => {
    if (subSubActivityNames.length > 1) {
      const updatedNames = subSubActivityNames.filter((_, i) => i !== index);
      setSubSubActivityNames(updatedNames);
    }
  };

  // Function to handle input change
  const handleSubSubActivityChange = (index, value) => {
    const updatedNames = [...subSubActivityNames];
    updatedNames[index] = value;
    setSubSubActivityNames(updatedNames);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form when closing
    setSelectedProjectActivity(null);
    setSelectedSubActivity(null);
    setSubSubActivityNames(['']);
  };

  const handleSubmit = () => {
    // Filter out empty strings from the array
    const filteredNames = subSubActivityNames.filter(name => name.trim() !== '');
    
    if (!selectedProjectActivity || !selectedSubActivity || filteredNames.length === 0) {
      toast.error('Please fill in all required fields!');
      return;
    }

    // Prepare the data to be sent
    const subSubActivityData = {
      projectActivityId: selectedProjectActivity?.value,
      subActivityId: selectedSubActivity?.value,
      subSubActivityNames: filteredNames, // Send only non-empty names
    };

    console.log('Payload being sent:', subSubActivityData);

    // Call the mutation to create the sub-sub activity
    createSubSubActivity(subSubActivityData)
      .then((response) => {
        console.log('Sub-Sub Activity Created:', response.data);
        toast.success('Multiple Activities Created Successfully!');
        refetch();
        handleClose();
      })
      .catch((error) => {
        console.error('Error creating sub-sub activity:', error);
        toast.error('Error creating sub-sub activities!');
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
              setSelectedSubActivity(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select a project activity"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #FACC15',
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px',
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
            disabled={!selectedProjectActivity}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select a sub activity"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #FACC15',
                    borderBottom: '4px solid #FACC15',
                    borderRadius: '6px',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    border: 'none',
                    borderRadius: '4px',
                  },
                }}
              />
            )}
          />

          {/* Multiple Activity Names */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <label className="text-[#29346B] text-lg font-semibold">
                Multiple Activity Names
              </label>
              <Button
                onClick={addSubSubActivityInput}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '14px',
                  padding: '4px 12px',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                Add More
              </Button>
            </Box>

            {/* Dynamic Input Fields for Multiple Activity Names */}
            {subSubActivityNames.map((name, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  value={name}
                  onChange={(e) => handleSubSubActivityChange(index, e.target.value)}
                  variant="outlined"
                  fullWidth
                  placeholder={`Enter multiple activity name ${index + 1}`}
                  sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      border: '1px solid #FACC15',
                      borderBottom: '4px solid #FACC15',
                      borderRadius: '6px',
                    },
                  }}
                />
                {subSubActivityNames.length > 1 && (
                  <IconButton
                    onClick={() => removeSubSubActivityInput(index)}
                    sx={{
                      color: '#EF4444',
                      '&:hover': {
                        backgroundColor: '#FEE2E2',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          {/* Display count of multiple activity names */}
          <Box sx={{ mt: 1, mb: 2 }}>
            <span className="text-sm text-gray-600">
              {subSubActivityNames.filter(name => name.trim() !== '').length} multiple activity name(s) added
            </span>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={creating}
            sx={{
              backgroundColor: '#F6812D',
              color: '#FFFFFF',
              fontSize: '16px',
              padding: '6px 36px',
              width: '200px',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#E66A1F',
              },
              '&:disabled': {
                backgroundColor: '#D1D5DB',
                color: '#9CA3AF',
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