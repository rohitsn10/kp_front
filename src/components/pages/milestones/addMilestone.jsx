import React, { useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  TextField, 
  Autocomplete, 
  CircularProgress,
  FormHelperText,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useCreateMilestoneMutation } from '../../../api/milestone/milestoneApi';
// import { useGetProjectProgressQuery } from '../../../api/your-progress-api';
import { toast } from 'react-toastify';
import { useGetProjectProgressQuery } from '../../../api/users/projectApi';

// Create filter with limit for performance
const filterOptions = createFilterOptions({
  limit: 50, // Show max 50 options at once
  matchFrom: 'any',
  stringify: (option) => `${option.label} ${option.status} ${option.category}`,
});

export default function MilestoneModal({ open, setOpen, refetch, projectId }) {
  const [formData, setFormData] = useState({
    milestoneName: '',
    startDate: '',
    endDate: '',
    milestoneDescription: '',
    isDepended: null,
    selectedProgressTasks: []
  });

  const [errors, setErrors] = useState({});

  // API hooks
  const [createMilestone, { isLoading }] = useCreateMilestoneMutation();
  const { 
    data: progressData, 
    isLoading: progressDataLoading, 
    isError: progressIsError, 
    error: progressError 
  } = useGetProjectProgressQuery(projectId);

  // Transform progress data for Autocomplete
  const progressOptions = useMemo(() => {
    if (!progressData) return [];
    return progressData.map(item => ({
      id: item.id,
      label: item.particulars,
      status: item.status,
      category: item.category,
      completion: item.percent_completion,
      daysToDeadline: item.days_to_deadline
    }));
  }, [progressData]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.milestoneName.trim()) {
      newErrors.milestoneName = 'Milestone name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.milestoneDescription.trim()) {
      newErrors.milestoneDescription = 'Milestone description is required';
    }
    
    if (formData.startDate && formData.endDate && 
        new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.isDepended === null) {
      newErrors.isDepended = 'Please select whether the milestone is dependent';
    }

    if (!Array.isArray(formData.selectedProgressTasks)) {
      newErrors.selectedProgressTasks = 'Project tasks list is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      milestoneName: '',
      startDate: '',
      endDate: '',
      milestoneDescription: '',
      isDepended: null,
      selectedProgressTasks: []
    });
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    try {
      const payload = {
        project: projectId,
        milestone_name: formData.milestoneName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        milestone_description: formData.milestoneDescription,
        is_depended: formData.isDepended === "True",
        project_progress_list: formData.selectedProgressTasks.map(task => task.id)
      };

      await createMilestone(payload).unwrap();
      
      refetch();
      resetForm();
      setOpen(false);
      toast.success("Milestone created successfully!");
    } catch (err) {
      console.error('Error creating milestone:', err);
      toast.error(err?.data?.message || 'Failed to create milestone. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add Milestone</h2>
        <div className='flex flex-col gap-3'>
          <TextField
            label="Milestone Name"
            variant="outlined"
            fullWidth
            value={formData.milestoneName}
            onChange={(e) => handleFieldChange('milestoneName', e.target.value)}
            error={!!errors.milestoneName}
            helperText={errors.milestoneName}
            required
          />
          
          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <TextField
            label="Milestone Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={formData.milestoneDescription}
            onChange={(e) => handleFieldChange('milestoneDescription', e.target.value)}
            error={!!errors.milestoneDescription}
            helperText={errors.milestoneDescription}
            required
          />
          
          <Autocomplete
            options={[
              { id: "True", label: "Yes" }, 
              { id: "False", label: "No" }
            ]}
            getOptionLabel={(option) => option.label}
            value={formData.isDepended ? 
              { id: formData.isDepended, label: formData.isDepended === "True" ? "Yes" : "No" } : 
              null
            }
            onChange={(_, value) => handleFieldChange('isDepended', value?.id || null)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Is Dependent" 
                fullWidth
                error={!!errors.isDepended}
                helperText={errors.isDepended}
                required 
              />
            )}
          />

          {/* Project Progress Tasks with optimized filtering */}
          <Autocomplete
            multiple
            options={progressOptions}
            getOptionLabel={(option) => option.label}
            value={formData.selectedProgressTasks}
            onChange={(_, values) => handleFieldChange('selectedProgressTasks', values)}
            loading={progressDataLoading}
            disabled={progressDataLoading}
            filterOptions={filterOptions}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.label}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                    <Chip 
                      label={option.status} 
                      size="small" 
                      color={option.status === 'Completed' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Chip 
                      label={option.category} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {Math.round(option.completion * 100)}%
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.label}
                  {...getTagProps({ index })}
                  size="small"
                  key={option.id}
                />
              ))
            }
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Project Progress Tasks" 
                fullWidth
                error={!!errors.selectedProgressTasks}
                helperText={
                  errors.selectedProgressTasks || 
                  `${formData.selectedProgressTasks.length} selected${progressOptions.length > 0 ? ` • ${progressOptions.length} total tasks • Type to search` : ''}`
                }
                placeholder={formData.selectedProgressTasks.length === 0 ? "Search tasks..." : ""}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {progressDataLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              style: { maxHeight: '300px' }
            }}
          />

          {progressIsError && (
            <FormHelperText error>
              Failed to load project progress data. Please try again.
            </FormHelperText>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || progressDataLoading}
          variant="contained"
          style={{ backgroundColor: '#F6812D', color: '#FFFFFF', fontWeight: 'bold' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Milestone'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
