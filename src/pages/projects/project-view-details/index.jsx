import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectDataByIdQuery } from "../../../api/users/projectApi";

function ViewProjectDetails() {
    const { projectId } = useParams();
    const { data: projectFetchData, error, isLoading } = useGetProjectDataByIdQuery(projectId);
    const projectData = projectFetchData?.data;

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading project details...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg">Error fetching project data</p>
                <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
        </div>
    );

    if (!projectData) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-600 text-lg">No project data found</p>
            </div>
        </div>
    );

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {projectData.project_name}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {projectData.ci_or_utility}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                {projectData.cpp_or_ipp}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-600">Company: <span className="font-medium">{projectData.company_name}</span></p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Project Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                                Project Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailCard label="Capacity" value={`${projectData.capacity} MW`} />
                                <DetailCard label="Electricity Line" value={projectData.electricity_name} />
                                <DetailCard label="Main Activity" value={projectData.project_activity_name} />
                                <DetailCard label="Landbank" value={projectData.landbank_name} />
                                <DetailCard label="Available Land" value={`${projectData.available_land_area} acres`} />
                                <DetailCard label="Allotted Land" value={`${projectData.alloted_land_area} acres`} />
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                                Project Timeline
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TimelineCard 
                                    label="Start Date" 
                                    value={formatDate(projectData.start_date)}
                                    color="green"
                                />
                                <TimelineCard 
                                    label="End Date" 
                                    value={formatDate(projectData.end_date)}
                                    color="blue"
                                />
                                <TimelineCard 
                                    label="COD Commission" 
                                    value={formatDate(projectData.cod_commission_date)}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Project Activities Sidebar */}
                    <div className="space-y-6">
                        {/* Sub Activities */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-5 bg-emerald-500 rounded-full mr-3"></div>
                                Sub Activities
                                <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {projectData.project_sub_activity?.length || 0}
                                </span>
                            </h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {projectData.project_sub_activity && projectData.project_sub_activity.length > 0 ? (
                                    projectData.project_sub_activity.map((subActivity, index) => (
                                        <ActivityTag 
                                            key={subActivity.sub_activity_id}
                                            name={subActivity.sub_activity_name}
                                            number={index + 1}
                                            color="emerald"
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <div className="text-2xl mb-2">📝</div>
                                        <p className="text-sm">No sub activities found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Multi Activities */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-5 bg-amber-500 rounded-full mr-3"></div>
                                Multi Activities
                                <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {projectData.project_sub_sub_activity?.length || 0}
                                </span>
                            </h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {projectData.project_sub_sub_activity && projectData.project_sub_sub_activity.length > 0 ? (
                                    projectData.project_sub_sub_activity.map((multiActivity, index) => (
                                        <ActivityTag 
                                            key={multiActivity.sub_sub_activity_id}
                                            name={multiActivity.sub_sub_activity_name}
                                            number={index + 1}
                                            color="amber"
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <div className="text-2xl mb-2">🔄</div>
                                        <p className="text-sm">No multi activities found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Enhanced Detail Card Component
const DetailCard = ({ label, value }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-lg font-semibold text-gray-900">{value || "N/A"}</div>
    </div>
);

// Timeline Card Component
const TimelineCard = ({ label, value, color }) => {
    const colorClasses = {
        green: "bg-green-50 border-green-200 text-green-800",
        blue: "bg-blue-50 border-blue-200 text-blue-800",
        orange: "bg-orange-50 border-orange-200 text-orange-800"
    };

    return (
        <div className={`rounded-lg p-4 border-2 ${colorClasses[color]} text-center`}>
            <div className="text-sm font-medium mb-1">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
};

// Activity Tag Component
const ActivityTag = ({ name, number, color }) => {
    const colorClasses = {
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100",
        amber: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
    };

    return (
        <div className={`flex items-center p-3 rounded-lg border ${colorClasses[color]} transition-colors cursor-pointer group`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                color === 'emerald' ? 'bg-emerald-200' : 'bg-amber-200'
            }`}>
                {number}
            </div>
            <div className="text-sm font-medium flex-1 group-hover:font-semibold transition-all">
                {name}
            </div>
        </div>
    );
};

export default ViewProjectDetails;