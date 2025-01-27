import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

function CriticalActivityTable() {

    const columns = [
    //   { field: 'id', headerName: 'ID', width: 70 },
      { field: 'activity', headerName: 'Activity', width: 200 },
      { field: 'projectName', headerName: 'Project Name', width: 150 },
    //   { field: 'priority', headerName: 'Priority', width: 150 },
      { field: 'dueDate', headerName: 'Due Date', width: 200 },
      { field: 'action', headerName: 'Action', width: 150 },
      { 
        field: 'priority', 
        headerName: 'Priority', 
        width: 120, 
        renderCell: (params) => (
          <span 
            style={{ 
              color: params.value === 'Completed' ? 'green' : params.value === 'Pending' ? 'orange' : 'red', 
              fontWeight: 'bold' 
            }}
            className={`${params.value=='Completed'?'text-green-200 bg-green-100 rounded-md px-3 py-2':
             params.value == 'Pending'?'text-yellow-300 bg-yellow-100 rounded-md px-3 py-2':'text-red-200 bg-red-100 rounded-md px-3 py-2'}`}
          >
            {params.value}
          </span>
        )
      },
    ];
    
    const rows = [
      { id: 1, projectName: 'Project Alpha', activity: 'Development', deadline: '2025-02-01', estCompletion: '20 hrs', contactPerson: 'John Doe', status: 'Completed' },
      { id: 2, projectName: 'Project Beta', activity: 'Testing', deadline: '2025-02-15', estCompletion: '15 hrs', contactPerson: 'Jane Smith', status: 'Pending' },
      { id: 3, projectName: 'Project Gamma', activity: 'Design', deadline: '2025-01-30', estCompletion: '25 hrs', contactPerson: 'Alice Johnson', status: 'In Progress' },
      { id: 4, projectName: 'Project Beta', activity: 'Testing', deadline: '2025-02-15', estCompletion: '15 hrs', contactPerson: 'Jane Smith', status: 'Pending' },
      { id: 5, projectName: 'Project Gamma', activity: 'Design', deadline: '2025-01-30', estCompletion: '25 hrs', contactPerson: 'Alice Johnson', status: 'In Progress' },
      { id: 6, projectName: 'Project Beta', activity: 'Testing', deadline: '2025-02-15', estCompletion: '15 hrs', contactPerson: 'Jane Smith', status: 'Pending' },
      { id: 7, projectName: 'Project Gamma', activity: 'Design', deadline: '2025-01-30', estCompletion: '25 hrs', contactPerson: 'Alice Johnson', status: 'In Progress'},
    ];
    
      return (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      );
}

export default CriticalActivityTable