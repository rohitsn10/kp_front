import React from 'react';
import { Outlet } from 'react-router-dom';

function ProjectLayout() {
  return (
    <div>
      {/* Render the child route components here */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ProjectLayout;
