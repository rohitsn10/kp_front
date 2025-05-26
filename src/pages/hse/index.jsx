import { Autocomplete, TextField, Typography, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import HSECards from '../../components/pages/hse/hse-cards';
// import HSEStatsCards from '../../components/pages/hse/hse-stats-cards'; // Import the new component
import { useGetMainProjectsQuery } from '../../api/users/projectApi';
import HSEStatsCards from '../../components/pages/hse/hse-cards/HSEStatsCards';

function HseMainPage() {
  const { data, isLoading, isError } = useGetMainProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(null);
  const [locationID, setLocationID] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleProjectChange = (event, newValue) => {
    setSelectedProject(newValue);
    setLocationID(null);
    setSelectedLocation(null);
    
    // Reset location options when project changes
    if (newValue && newValue.location_name_survey && newValue.location_name_survey.length > 0) {
      setLocationOptions(newValue.location_name_survey);
    } else {
      setLocationOptions([]);
    }
  };

  const handleLocationChange = (event, newValue) => {
    setSelectedLocation(newValue);
    setLocationID(newValue ? newValue.id : null);
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

  // Determine location dropdown content based on selected project and available locations
  let locationDropdownContent;
  if (!selectedProject) {
    locationDropdownContent = (
      <TextField 
        label="Select a project first" 
        disabled
        fullWidth
        size="small"
      />
    );
  } else if (locationOptions.length === 0) {
    locationDropdownContent = (
      <TextField 
        label="No locations available" 
        disabled
        fullWidth
        size="small"
      />
    );
  } else {
    locationDropdownContent = (
      <Autocomplete
        disablePortal
        options={locationOptions}
        getOptionLabel={(option) => option.land_bank_location_name || ''}
        fullWidth
        size="small"
        renderInput={(params) => (
          <TextField {...params} label="Select Site" />
        )}
        onChange={handleLocationChange}
        value={selectedLocation}
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
              HSE Dashboard
            </h1>
          </div>

          {/* Dropdowns Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* Select Project Dropdown */}
              <div className="flex flex-col gap-3">
                <label className="text-base sm:text-lg font-medium text-[#29346B]">
                  Select Project
                </label>
                <div className="w-full">
                  {projectDropdownContent}
                </div>
              </div>

              {/* Select Site Dropdown */}
              <div className="flex flex-col gap-3">
                <label className="text-base sm:text-lg font-medium text-[#29346B]">
                  Select Site
                </label>
                <div className="w-full">
                  {locationDropdownContent}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            {selectedProject && selectedLocation ? (
              <>
                              {/* Navigation Cards Section */}
                <div>
                  <h2 className="text-xl font-bold text-[#29346B] mb-6">HSE Management Tools</h2>
                  <HSECards selectedSite={locationID} />
                </div>
                {/* ADD HSE STATS CARDS HERE - FIRST */}
                <div className="mb-8">
                  <HSEStatsCards selectedSite={locationID} />
                </div>
                
                {/* Divider between stats and navigation cards */}
                <div className="border-t border-gray-200 mb-8"></div>
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                  <div className="text-4xl sm:text-5xl mb-4">🏗️</div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
                    Ready to Start
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {!selectedProject 
                      ? "Please select a project to continue."
                      : "Please select a site to view the HSE dashboard."
                    }
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

export default HseMainPage;