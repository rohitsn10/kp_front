import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';
import HSECards from '../../components/pages/hse/hse-cards';
import { useGetMainProjectsQuery } from '../../api/users/projectApi';

function HseMainPage() {
  const { data } = useGetMainProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectChange = (event, newValue) => {
    setSelectedProject(newValue);
  };

  const projectOptions = data?.data || [];

  return (
    <div className="bg-white rounded-md p-8 m-4 min-h-screen flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-2xl">HSE Dashboard</h1>
      </div>

      <div className="flex flex-row gap-4">
        {/* Select Project Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xl">Select Project</label>
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
        </div>

        {/* Show Project Location */}
        <div className="flex flex-col gap-2">
          <label className="text-xl">Project Location</label>
          <TextField
            value={selectedProject?.land_location_name || 'N/A'}
            sx={{ width: 400 }}
            disabled
            placeholder="Project Location"
          />
        </div>
      </div>

      <div>
        {selectedProject && <HSECards selectedSite={selectedProject} />}
      </div>
    </div>
  );
}

export default HseMainPage;
