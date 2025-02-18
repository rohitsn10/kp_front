import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  TextField, 
  Autocomplete, 
  CircularProgress,
  FormHelperText 
} from '@mui/material';
import { useCreateMilestoneMutation, useGetProductActivityQuery, useGetProductSubActivityQuery, useGetProductSubSubActivityQuery } from '../../../api/milestone/milestoneApi';
import { toast } from 'react-toastify';

export default function MilestoneModal({ open, setOpen, refetch, projectId }) {
  // Form state
  const [formData, setFormData] = useState({
    milestoneName: '',
    startDate: '',
    endDate: '',
    milestoneDescription: '',
    isDepended: null,
    projectMainActivity: null,
    selectedSubActivities: [],
    selectedSubSubActivities: []
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // API hooks
  const [createMilestone, { isLoading }] = useCreateMilestoneMutation();
  const { data: activityData, isLoading: isActivityLoading } = useGetProductActivityQuery(projectId);
  const { data: subActivityData, isLoading: isSubActivityLoading } = useGetProductSubActivityQuery(projectId);
  const { data: subSubActivityData, isLoading: isSubSubActivityLoading } = useGetProductSubSubActivityQuery(projectId);

  // Compute disabled states based on isDepended
  const isActivitiesDisabled = formData.isDepended === null;
  
  // Only apply sequential disabling when isDepended is true
  const isSubActivitiesDisabled = formData.isDepended === "True" ? 
    (isActivitiesDisabled || !formData.projectMainActivity) : isActivitiesDisabled;
  
  const isSubSubActivitiesDisabled = formData.isDepended === "True" ? 
    (isSubActivitiesDisabled || formData.selectedSubActivities.length === 0) : isActivitiesDisabled;

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Only clear dependent fields when isDepended is true
    if (field === 'isDepended') {
      setFormData(prev => ({
        ...prev,
        projectMainActivity: null,
        selectedSubActivities: [],
        selectedSubSubActivities: []
      }));
    } else if (formData.isDepended === "True") {
      if (field === 'projectMainActivity') {
        setFormData(prev => ({
          ...prev,
          selectedSubActivities: [],
          selectedSubSubActivities: []
        }));
      } else if (field === 'selectedSubActivities') {
        setFormData(prev => ({
          ...prev,
          selectedSubSubActivities: []
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Basic required field validation
    if (!formData.milestoneName) newErrors.milestoneName = 'Milestone name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    // Date validation
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Dependency validation
    if (formData.isDepended === null) {
      newErrors.isDepended = 'Please select whether the milestone is dependent';
    }

    if (formData.isDepended === "True") {
      // Validate all fields are selected when isDepended is true
      if (!formData.projectMainActivity) newErrors.projectMainActivity = 'Main activity is required';
      if (formData.selectedSubActivities.length === 0) newErrors.selectedSubActivities = 'At least one sub activity is required';
      if (formData.selectedSubSubActivities.length === 0) newErrors.selectedSubSubActivities = 'At least one sub-sub activity is required';
    } else if (formData.isDepended === "False") {
      // Validate at least one activity is selected when isDepended is false
      const hasAnyActivity = formData.projectMainActivity || 
                           formData.selectedSubActivities.length > 0 || 
                           formData.selectedSubSubActivities.length > 0;
      if (!hasAnyActivity) {
        newErrors.activitySelection = 'Please select at least one activity type when not dependent';
      }
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
      projectMainActivity: null,
      selectedSubActivities: [],
      selectedSubSubActivities: []
    });
    setErrors({});
  };

  // Handle close
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill the required data in the form.');
      return;
    }

    try {
      await createMilestone({
        project: projectId,
        milestone_name: formData.milestoneName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        milestone_description: formData.milestoneDescription,
        is_depended: formData.isDepended === "True" || "False",
        project_main_activity: formData.projectMainActivity ? String(formData.projectMainActivity) : null,
        project_sub_activity: formData.selectedSubActivities.map(sa => sa.id),
        project_sub_sub_activity: formData.selectedSubSubActivities.map(ssa => ssa.id),
      }).unwrap();
      
      refetch();
      resetForm();
      setOpen(false);
      toast.success("Milestone created successfully!");
    } catch (err) {
      console.error('Error creating milestone:', err);
      toast.error('Failed to create milestone. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
            type="date"
            variant="outlined"
            fullWidth
            value={formData.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            error={!!errors.startDate}
            helperText={errors.startDate}
            required
          />
          
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={formData.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
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
          />
          
          <Autocomplete
            options={[{ id: "True", label: "Yes" }, { id: "False", label: "No" }]}
            getOptionLabel={(option) => option.label}
            value={[{ id: "True", label: "Yes" }, { id: "False", label: "No" }].find(option => option.id === formData.isDepended) || null}
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

          <Autocomplete
            options={activityData?.data?.map((activity) => ({
              id: activity.id,
              label: activity.activity_name,
            })) || []}
            getOptionLabel={(option) => option.label}
            value={formData.projectMainActivity ? { 
              id: formData.projectMainActivity, 
              label: activityData?.data?.find(a => a.id === formData.projectMainActivity)?.activity_name 
            } : null}
            onChange={(_, value) => handleFieldChange('projectMainActivity', value?.id || null)}
            loading={isActivityLoading}
            disabled={isActivitiesDisabled}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Project Main Activity" 
                fullWidth
                error={!!errors.projectMainActivity}
                helperText={errors.projectMainActivity}
                required={formData.isDepended === "True"}
              />
            )}
          />

          <Autocomplete
            multiple
            options={subActivityData?.data[0]?.sub_activity?.map((subActivity) => ({
              id: subActivity.id,
              label: subActivity.name,
            })) || []}
            getOptionLabel={(option) => option.label}
            value={formData.selectedSubActivities}
            onChange={(_, values) => handleFieldChange('selectedSubActivities', values)}
            loading={isSubActivityLoading}
            disabled={isSubActivitiesDisabled}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Project Sub Activities" 
                fullWidth
                error={!!errors.selectedSubActivities}
                helperText={errors.selectedSubActivities}
                required={formData.isDepended === "True"}
              />
            )}
          />

          <Autocomplete
            multiple
            options={subSubActivityData?.data?.map((subSubActivity) => ({
              id: subSubActivity.id,
              label: subSubActivity.sub_sub_activity_name[0],
            })) || []}
            getOptionLabel={(option) => option.label}
            value={formData.selectedSubSubActivities}
            onChange={(_, values) => handleFieldChange('selectedSubSubActivities', values)}
            loading={isSubSubActivityLoading}
            disabled={isSubSubActivitiesDisabled}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Project Sub-Sub Activities" 
                fullWidth
                error={!!errors.selectedSubSubActivities}
                helperText={errors.selectedSubSubActivities}
                required={formData.isDepended === "True"}
              />
            )}
          />

          {errors.activitySelection && (
            <FormHelperText error>{errors.activitySelection}</FormHelperText>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{ backgroundColor: '#F6812D', color: '#FFFFFF', fontWeight: 'bold' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Milestone'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}