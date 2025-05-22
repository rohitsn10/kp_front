import { Autocomplete, TextField, CircularProgress, Alert } from '@mui/material';
import React, { useState } from 'react';
import QualitySectionCards from '../../components/pages/quality/QualitySectionCards';
import { useGetMainProjectsQuery } from '../../api/users/projectApi';

function QualityMainPage() {
  const { data, isLoading, isError } = useGetMainProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectID, setProjectID] = useState(null);

  const handleProjectChange = (event, newValue) => {
    setSelectedProject(newValue);
    setProjectID(newValue ? newValue.id : null);
  };

  const projectOptions = data?.data || [];

  // Error and loading states for the project dropdown
  let projectDropdownContent;
  if (isLoading) {
    projectDropdownContent = (
      <div className="flex items-center gap-2">
        <CircularProgress size={20} />
        <TextField 
          label="Loading projects..." 
          disabled
          fullWidth
          size="small"
        />
      </div>
    );
  } else if (isError) {
    projectDropdownContent = (
      <Alert severity="error" className="w-full">
        Error loading projects. Please try again.
      </Alert>
    );
  } else if (projectOptions.length === 0) {
    projectDropdownContent = (
      <Alert severity="info" className="w-full">
        No projects available
      </Alert>
    );
  } else {
    projectDropdownContent = (
      <Autocomplete
        disablePortal
        options={projectOptions}
        getOptionLabel={(option) => option.project_name || ''}
        fullWidth
        size="small"
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Select a project"
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: { xs: '14px', sm: '16px' }
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '14px', sm: '16px' }
              }
            }}
          />
        )}
        onChange={handleProjectChange}
        value={selectedProject}
        sx={{
          '& .MuiAutocomplete-popupIndicator': {
            padding: { xs: '4px', sm: '8px' }
          }
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 m-2 sm:m-4 min-h-screen flex flex-col gap-4 sm:gap-6">
      {/* Responsive Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-[#29346B] font-semibold">
          Quality Assurance Dashboard
        </h1>
      </div>

      {/* Responsive Project Selection */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col gap-2 sm:gap-3">
          <label className="text-base sm:text-lg md:text-xl font-medium text-gray-700">
            Select Project
          </label>
          <div className="w-full">
            {projectDropdownContent}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 w-full">
        {selectedProject ? (
          <QualitySectionCards selectedProject={projectID} />
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
              <div className="text-4xl sm:text-5xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
                Ready to Start
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Please select a project from the dropdown above to view the quality assurance dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QualityMainPage;