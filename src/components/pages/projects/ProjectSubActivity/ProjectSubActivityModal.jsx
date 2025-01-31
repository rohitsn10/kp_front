import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete } from '@mui/material';
import { useCreateSubActivityMutation } from '../../../../api/users/subActivityApi';
import { useGetActivitiesQuery } from '../../../../api/users/projectActivityApi';

export default function ProjectSubActivityModal({
  open,
  setOpen,
  setSubActivityInput: setParentSubActivityInput,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subActivityInput, setSubActivityInput] = useState('');
  const [subActivityNames, setSubActivityNames] = useState([]);

  const [createSubActivity, { isLoading, error }] = useCreateSubActivityMutation();
  const { data, error: DropdownError, isLoading: DropDownLoading } = useGetActivitiesQuery();

  const activityOptions = data?.data?.map((item) => ({
    label: item.activity_name,
    value: item.id,
  })) || [];

  const handleClose = () => {
    setOpen(false);
    setSubActivityNames([]); // Clear sub-activities when modal closes
    setSubActivityInput(''); // Clear input field when modal closes
  };

  const handleAddSubActivity = () => {
    if (subActivityInput.trim()) {
      setSubActivityNames([...subActivityNames, subActivityInput.trim()]);
      setSubActivityInput(''); // Clear the input field after adding
    }
  };

  const handleRemoveSubActivity = (index) => {
    const updatedSubActivities = subActivityNames.filter((_, idx) => idx !== index);
    setSubActivityNames(updatedSubActivities);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || subActivityNames.length === 0) {
      // Ensure there's a category selected and at least one sub-activity
      alert('Please select an activity and add at least one sub-activity.');
      return;
    }

    // Prepare the data to send to the API
    const subActivityData = {
      projectActivityId: selectedCategory.value,
      subActivityNames: subActivityNames,
    };

    try {
      // Call the mutation to create the sub-activities
      await createSubActivity(subActivityData).unwrap();
      // After successful submission, reset the input and close the modal
      setSubActivityNames([]);
      setSelectedCategory(null);
      setOpen(false);
    } catch (err) {
      console.error('Error creating sub-activity:', err);
    }
  };

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
          <h2 className="text-[#29346B] text-2xl font-semibold mb-5">
            Add Sub-Activity
          </h2>
          
          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Sub-Activity Names
          </label>

          {/* Dynamic input for adding sub-activities */}
          <div>
            <TextField
              value={subActivityInput}
              onChange={(e) => setSubActivityInput(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter a sub-activity"
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
            <Button
              onClick={handleAddSubActivity}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Add Sub-Activity
            </Button>
          </div>

          {/* List of added sub-activities */}
          <div style={{ marginTop: '10px' }}>
            {subActivityNames && subActivityNames.length > 0 && (
              <h2 className="text-lg font-semibold text-[#29346B]">Sub Activities:</h2>
            )}
            {subActivityNames.map((name, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="flex flex-row text-lg">
                  {index + 1}. <p>{name}</p>
                </span>
                <Button
                  onClick={() => handleRemoveSubActivity(index)}
                  color="secondary"
                  size="small"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Select Main Activity
          </label>

          <Autocomplete
            options={activityOptions}
            getOptionLabel={(option) => option.label}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            isLoading={DropDownLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search and select an activity"
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

          {/* Loading or Error messages */}
          {isLoading && <p>Creating sub-activities...</p>}
          {error && <p>Error creating sub-activities.</p>}
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
