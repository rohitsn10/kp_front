import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectDataByIdQuery } from "../../../api/users/projectApi";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
    dummyActivitiesData,
    getProjectSummary,
    getStatusChartData,
    getCategoryChartData
} from './dummyActivitiesData';
import { exportActivitiesToExcelWithCharts } from './excelExportUtils';
import ProjectUpdate from "../../../components/pages/projects/ProjectMain/ProjectUpdate";
// import ProjectUpdate from "../project-update-details/ProjectUpdateModal";

function ViewProjectDetails() {
    const { projectId } = useParams();
    const { data: projectFetchData, error, isLoading,refetch } = useGetProjectDataByIdQuery(projectId);
    const projectData = projectFetchData?.data;
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [updateModal, setUpdateModal] = useState(false)
    // Get summary data
    const summary = getProjectSummary();
    const statusChartData = getStatusChartData();
    const categoryChartData = getCategoryChartData();

    // Filter activities based on search and status
    const filteredActivities = useMemo(() => {
        return dummyActivitiesData.filter(activity => {
            const matchesSearch = activity.taskName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || activity.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    // Get unique status options for filter
    const statusOptions = ['All', ...new Set(dummyActivitiesData.map(activity => activity.status))];

    // Handle Excel export
    const handleExportToExcel = async () => {
        try {
            await exportActivitiesToExcelWithCharts(filteredActivities, projectData, summary);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        }
    };
    const handleOpenUpdateModal = () => {
        setUpdateModal(true)
    }
    const handleCloseUpdateModal = () => {
        setUpdateModal(false)
    }

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
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {projectData.project_name}
                        </h1>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleExportToExcel}
                                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export to Excel
                            </button>
                            <button
                                onClick={handleOpenUpdateModal}
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
                    <p className="text-gray-600">Company: <span className="font-medium">{projectData.company_name}</span></p>
                </div>

                {/* Progress Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <ProgressCard
                        title="Overall Progress"
                        value={`${summary.overallProgress}%`}
                        icon="📊"
                        color="bg-blue-500"
                    />
                    <ProgressCard
                        title="Completed Tasks"
                        value={`${summary.completedTasks}/${summary.totalTasks}`}
                        icon="✅"
                        color="bg-green-500"
                    />
                    <ProgressCard
                        title="In Progress"
                        value={summary.wipTasks}
                        icon="🔄"
                        color="bg-yellow-500"
                    />
                    <ProgressCard
                        title="Pending Tasks"
                        value={summary.pendingTasks}
                        icon="⏳"
                        color="bg-red-500"
                    />
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <TabButton
                                active={activeTab === 'overview'}
                                onClick={() => setActiveTab('overview')}
                                label="Project Overview"
                            />
                            <TabButton
                                active={activeTab === 'dashboard'}
                                onClick={() => setActiveTab('dashboard')}
                                label="Dashboard"
                            />
                            <TabButton
                                active={activeTab === 'activities'}
                                onClick={() => setActiveTab('activities')}
                                label="Activities"
                            />
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Project Information */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Basic Information */}
                                    <div className="bg-gray-50 rounded-lg p-6">
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
                                    <div className="bg-gray-50 rounded-lg p-6">
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

                                {/* Quick Stats Sidebar */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                                        <div className="space-y-4">
                                            <StatItem label="Service Tasks" value={summary.serviceTasks} />
                                            <StatItem label="Supply Tasks" value={summary.supplyTasks} />
                                            <StatItem label="Total Activities" value={summary.totalTasks} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Status Distribution Chart */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={statusChartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {statusChartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Category Distribution Chart */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Categories</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={categoryChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#3B82F6" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress by Activity Type */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <ProgressBar
                                            label="Service Tasks"
                                            completed={dummyActivitiesData.filter(t => t.category === 'Service' && t.status === 'Completed').length}
                                            total={summary.serviceTasks}
                                            color="bg-blue-500"
                                        />
                                        <ProgressBar
                                            label="Supply Tasks"
                                            completed={dummyActivitiesData.filter(t => t.category === 'Supply' && t.status === 'Completed').length}
                                            total={summary.supplyTasks}
                                            color="bg-purple-500"
                                        />
                                        <ProgressBar
                                            label="Overall Project"
                                            completed={summary.completedTasks}
                                            total={summary.totalTasks}
                                            color="bg-green-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activities' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Project Activities</h3>

                                    {/* Search and Filter Controls */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {/* Search Input */}
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search activities..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>

                                        {/* Status Filter */}
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status === 'All' ? 'All Status' : status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Filter Results Summary */}
                                <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                    <span>
                                        Showing {filteredActivities.length} of {dummyActivitiesData.length} activities
                                        {searchTerm && (
                                            <span className="ml-1">
                                                for "<span className="font-medium text-gray-900">{searchTerm}</span>"
                                            </span>
                                        )}
                                        {statusFilter !== 'All' && (
                                            <span className="ml-1">
                                                with status "<span className="font-medium text-gray-900">{statusFilter}</span>"
                                            </span>
                                        )}
                                    </span>
                                    {(searchTerm || statusFilter !== 'All') && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setStatusFilter('All');
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>

                                {/* Activities List */}
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredActivities.length > 0 ? (
                                        filteredActivities.map((activity) => (
                                            <ActivityCard key={activity.id} activity={activity} />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                                            <div className="text-gray-400 text-4xl mb-3">🔍</div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">No activities found</h4>
                                            <p className="text-gray-500">
                                                {searchTerm || statusFilter !== 'All'
                                                    ? 'Try adjusting your search or filter criteria.'
                                                    : 'No activities available.'}
                                            </p>
                                            {(searchTerm || statusFilter !== 'All') && (
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setStatusFilter('All');
                                                    }}
                                                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ProjectUpdate
                isOpen={updateModal}
                onClose={handleCloseUpdateModal}
                project={projectData}
                handleRefetch={()=>{refetch()}}
            />
        </div>
    );
}

// Enhanced Detail Card Component
const DetailCard = ({ label, value }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
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

// Progress Card Component
const ProgressCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center">
            <div className={`${color} text-white p-3 rounded-lg text-xl mr-4`}>
                {icon}
            </div>
            <div>
                <div className="text-sm font-medium text-gray-500">{title}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
            </div>
        </div>
    </div>
);

// Tab Button Component
const TabButton = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`py-3 px-1 border-b-2 font-medium text-sm ${active
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
    >
        {label}
    </button>
);

// Stat Item Component
const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);

// Progress Bar Component
const ProgressBar = ({ label, completed, total, color }) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{completed}/{total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% Complete</div>
        </div>
    );
};

// Activity Card Component
const ActivityCard = ({ activity }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'WIP': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Yet to start/Pending': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{activity.taskName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>ID: {activity.id}</span>
                        <span>Category: {activity.category}</span>
                        <span>UOM: {activity.uom}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                    {activity.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="text-sm font-semibold">{activity.completionPercentage.toFixed(1)}%</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Quantity</div>
                    <div className="text-sm font-semibold">{activity.completedQuantity}/{activity.totalQuantity}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Planned Start</div>
                    <div className="text-sm font-semibold">{formatDate(activity.plannedStartDate)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Planned End</div>
                    <div className="text-sm font-semibold">{formatDate(activity.plannedEndDate)}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity.completionPercentage}%` }}
                    ></div>
                </div>
            </div>

            {activity.remarks && (
                <div className="text-sm text-gray-600 italic">
                    Remarks: {activity.remarks}
                </div>
            )}
        </div>
    );
};

export default ViewProjectDetails;