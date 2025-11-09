import React from 'react';

export const ProjectHeader = ({ 
    projectData, 
    onExport, 
    onUpdate 
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    {projectData.project_name}
                </h1>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onExport}
                        className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to Excel
                    </button>
                    <button
                        onClick={onUpdate}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                        Update Project Details
                    </button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {projectData.ci_or_utility}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {projectData.cpp_or_ipp}
                    </span>
                </div>
            </div>
            <p className="text-gray-600">
                Company: <span className="font-medium">{projectData.company_name}</span>
            </p>
        </div>
    );
};
