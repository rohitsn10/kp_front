import { Autocomplete, TextField, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import HOTOSectionCards from '../../components/pages/hoto/HOTOSectionCards';
import { useGetMainProjectsQuery } from '../../api/users/projectApi';

function HotoMainPage() {
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
      <TextField 
        label="Loading projects..." 
        disabled
        fullWidth
        size="small"
      />
    );
  } else if (isError) {
    projectDropdownContent = (
      <TextField 
        label="Error loading projects" 
        error
        fullWidth
        size="small"
      />
    );
  } else if (projectOptions.length === 0) {
    projectDropdownContent = (
      <TextField 
        label="No projects available" 
        disabled
        fullWidth
        size="small"
      />
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
          <TextField {...params} label="Projects" />
        )}
        onChange={handleProjectChange}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section - Simple and Responsive */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 text-center border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl text-[#29346B] font-semibold">
              HOTO Dashboard
            </h1>
          </div>

          {/* Dropdown Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-md mx-auto">
              
              {/* Select Project Dropdown */}
              <div className="flex flex-col gap-3">
                <label className="text-base sm:text-lg font-medium text-[#29346B]">
                  Select Project
                </label>
                <div className="w-full">
                  {projectDropdownContent}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            {selectedProject ? (
              <HOTOSectionCards selectedProject={projectID} />
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                  <div className="text-4xl sm:text-5xl mb-4">🔄</div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
                    Ready to Start
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Please select a project from the dropdown above to view the HOTO dashboard.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotoMainPage;