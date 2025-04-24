import { Autocomplete, TextField } from '@mui/material';
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

  return (
    <div className="bg-white rounded-md p-8 m-4 min-h-screen flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-2xl">Quality Assurance Dashboard</h1>
      </div>

      <div className="flex flex-row gap-4">
        {/* Select Project Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xl">Select Project</label>
          {projectDropdownContent}
        </div>
      </div>

      <div>
        {selectedProject && <QualitySectionCards selectedProject={projectID} />}
      </div>
    </div>
  );
}

export default QualityMainPage;