import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectDataByIdQuery, useGetProjectProgressQuery } from "../../../api/users/projectApi";
import { exportActivitiesToExcelWithCharts } from './excelExportUtils';
import ProjectUpdateModal from "../../../components/pages/projects/ProjectMain/ProjectUpdate";
import { ProjectHeader } from "../../../components/pages/projects/ProjectMain/ProjectHeader";
import { ProgressOverview } from "../../../components/pages/projects/ProgressTabs/ProgressOverview";
import ProgressDashboard from "../../../components/pages/projects/ProgressTabs/ProgressDashboard";
import ProgressActivity from "../../../components/pages/projects/ProgressTabs/ProgressActivity";
import ProgressActivityCards from "../../../components/pages/projects/ProgressCards/ProgressActivityCard";
import StatItem from "../../../components/pages/projects/ProgressUi/StatItem";
import TabButton from "../../../components/pages/projects/ProgressUi/TabButton";
import TimelineCard from "../../../components/pages/projects/ProgressCards/TimelineCard";
import DetailCard from "../../../components/pages/projects/ProgressCards/DetailCard";

function ViewProjectDetails() {
    const { projectId } = useParams();
    const { data: projectFetchData, error, isLoading, refetch } = useGetProjectDataByIdQuery(projectId);
    const { data: progressData, isLoading: progressDataLoading, isError: progressIsError, error: progressError } = useGetProjectProgressQuery(projectId);
    const projectData = projectFetchData?.data;
    const activitiesData = progressData || [];
    
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [updateModal, setUpdateModal] = useState(false);

    // Transform API data to match the component's expected format
    const transformedActivities = useMemo(() => {
        return activitiesData.map(activity => ({
            id: activity.id,
            taskName: activity.particulars,
            status: activity.status,
            category: activity.category,
            uom: activity.uom,
            totalQuantity: activity.qty,
            completedQuantity: activity.cumulative_completed,
            completionPercentage: activity.percent_completion,
            plannedStartDate: activity.scheduled_start_date,
            plannedEndDate: activity.targeted_end_date,
            actualStartDate: activity.actual_start_date,
            actualCompletionDate: activity.actual_completion_date,
            todayQty: activity.today_qty,
            remarks: activity.remarks === "nan" ? "" : activity.remarks,
            daysToDeadline: activity.days_to_deadline,
            daysToComplete: activity.days_to_complete
        }));
    }, [activitiesData]);

    // Calculate summary data from API
    const summary = useMemo(() => {
        const totalTasks = transformedActivities.length;
        const completedTasks = transformedActivities.filter(a => a.status === 'Completed').length;
        const wipTasks = transformedActivities.filter(a => a.status === 'WIP').length;
        const pendingTasks = transformedActivities.filter(a => 
            a.status === 'Yet to start' || a.status === 'Pending' || a.status === 'Yet to start/Pending'
        ).length;
        const serviceTasks = transformedActivities.filter(a => a.category === 'Service').length;
        const supplyTasks = transformedActivities.filter(a => a.category === 'Supply').length;
        const overallProgress = totalTasks > 0 
            ? (transformedActivities.reduce((sum, a) => sum + a.completionPercentage, 0) / totalTasks).toFixed(1)
            : 0;

        return {
            totalTasks,
            completedTasks,
            wipTasks,
            pendingTasks,
            serviceTasks,
            supplyTasks,
            overallProgress
        };
    }, [transformedActivities]);

    // Generate chart data from API
    const statusChartData = useMemo(() => {
        const statusCounts = transformedActivities.reduce((acc, activity) => {
            acc[activity.status] = (acc[activity.status] || 0) + 1;
            return acc;
        }, {});

        const colorMap = {
            'Completed': '#10B981',
            'WIP': '#F59E0B',
            'Yet to start': '#EF4444',
            'Pending': '#EF4444',
            'Yet to start/Pending': '#EF4444'
        };

        return Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value,
            color: colorMap[name] || '#6B7280'
        }));
    }, [transformedActivities]);

    const categoryChartData = useMemo(() => {
        const categoryCounts = transformedActivities.reduce((acc, activity) => {
            acc[activity.category] = (acc[activity.category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(categoryCounts).map(([name, value]) => ({
            name,
            value
        }));
    }, [transformedActivities]);

    // Filter activities based on search and status
    const filteredActivities = useMemo(() => {
        return transformedActivities.filter(activity => {
            const matchesSearch = activity.taskName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || activity.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [transformedActivities, searchTerm, statusFilter]);

    // Get unique status options for filter
    const statusOptions = useMemo(() => {
        return ['All', ...new Set(transformedActivities.map(activity => activity.status))];
    }, [transformedActivities]);

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
        setUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setUpdateModal(false);
    };

    if (isLoading || progressDataLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading project details...</p>
            </div>
        </div>
    );

    if (error || progressIsError) return (
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
               <ProjectHeader
                    projectData={projectData}
                    onExport={handleExportToExcel}
                    onUpdate={() => setUpdateModal(true)}
                />

                {/* Progress Overview Cards */}
                <ProgressOverview summary={summary}/>

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
                                <ProgressDashboard statusChartData={statusChartData} categoryChartData={categoryChartData}/>

                                {/* Progress by Activity Type */}
                                <ProgressActivity transformedActivities={transformedActivities} summary={summary}/>

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
                                        Showing {filteredActivities.length} of {transformedActivities.length} activities
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
                                            <ProgressActivityCards key={activity.id} activity={activity} />
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
            <ProjectUpdateModal
                isOpen={updateModal}
                onClose={handleCloseUpdateModal}
                project={projectData}
                handleRefetch={() => { refetch() }}
            />
        </div>
    );
}

export default ViewProjectDetails;