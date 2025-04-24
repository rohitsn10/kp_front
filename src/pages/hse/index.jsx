import { Autocomplete, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import HSECards from '../../components/pages/hse/hse-cards';
import { useGetMainProjectsQuery } from '../../api/users/projectApi';

function HseMainPage() {
  const { data, isLoading, isError } = useGetMainProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(null);
  const [locationID, setLocationID] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
// console.log(">>>>>>>>>>>",locationID)
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
        sx={{ width: 400 }}
      />
    );
  } else if (isError) {
    projectDropdownContent = (
      <TextField 
        label="Error loading projects" 
        error
        sx={{ width: 400 }}
      />
    );
  } else if (projectOptions.length === 0) {
    projectDropdownContent = (
      <TextField 
        label="No projects available" 
        disabled
        sx={{ width: 400 }}
      />
    );
  } else {
    projectDropdownContent = (
      <Autocomplete
        disablePortal
        options={projectOptions}
        getOptionLabel={(option) => option.project_name || ''}
        sx={{ width: 400 }}
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
        sx={{ width: 400 }}
      />
    );
  } else if (locationOptions.length === 0) {
    locationDropdownContent = (
      <TextField 
        label="No locations available" 
        disabled
        sx={{ width: 400 }}
      />
    );
  } else {
    locationDropdownContent = (
      <Autocomplete
        disablePortal
        options={locationOptions}
        getOptionLabel={(option) => option.land_bank_location_name || ''}
        sx={{ width: 400 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Site" />
        )}
        onChange={handleLocationChange}
        value={selectedLocation}
      />
    );
  }

  return (
    <div className="bg-white rounded-md p-8 m-4 min-h-screen flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-2xl">HSE Dashboard</h1>
      </div>

      <div className="flex flex-row gap-4">
        {/* Select Project Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xl">Select Project</label>
          {projectDropdownContent}
        </div>
      </div>

      {/* Add Location Dropdown */}
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xl">Select Site</label>
          {locationDropdownContent}
        </div>
      </div>

      <div>
        {selectedProject && selectedLocation && <HSECards selectedSite={locationID} />}
      </div>
    </div>
  );
}

export default HseMainPage;