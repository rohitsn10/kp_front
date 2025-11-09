import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUpdateProjectProgressMutation } from '../../../../api/users/projectApi';
import HistoryTimelineModal from '../ProgressUi/HistoryTimelineModal';
// import { useUpdateProjectProgressMutation } from './path-to-your-projectApi';

const ProgressActivityCards = ({ activity }) => {
    const { projectId } = useParams();
    const [updateProgress, { isLoading, isSuccess, isError, error }] = useUpdateProjectProgressMutation();
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    // Quantity update state
    const [todayQty, setTodayQty] = useState(0);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    
    // Date edit state
    const [showDateEdit, setShowDateEdit] = useState(false);
    const [scheduledStartDate, setScheduledStartDate] = useState(activity.plannedStartDate || '');
    const [targetedEndDate, setTargetedEndDate] = useState(activity.plannedEndDate || '');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'WIP': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Yet to start': return 'bg-red-100 text-red-800 border-red-200';
            case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
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

    const handleQuantityUpdate = async (e) => {
        e.preventDefault();
        
        if (todayQty <= 0) {
            alert('Please enter a valid quantity greater than 0');
            return;
        }

        const newCumulativeCompleted = activity.completedQuantity + todayQty;
        
        if (newCumulativeCompleted > activity.totalQuantity) {
            alert(`Cannot exceed total quantity of ${activity.totalQuantity}`);
            return;
        }

        const newPercentage = (newCumulativeCompleted / activity.totalQuantity) * 100;

        try {
            await updateProgress({
                project_id: projectId,
                progress_id: activity.id,
                today_qty: todayQty,
                cumulative_completed: newCumulativeCompleted,
                percent_completion: parseFloat(newPercentage.toFixed(2)),
                status: newPercentage === 100 ? 'completed' : 'in_progress'
            }).unwrap();

            setTodayQty(0);
            setShowUpdateForm(false);
            alert('Quantity updated successfully!');
        } catch (err) {
            console.error('Failed to update quantity:', err);
            alert('Failed to update quantity. Please try again.');
        }
    };

    const handleDateUpdate = async (e) => {
        e.preventDefault();

        // Validate dates
        if (!scheduledStartDate || !targetedEndDate) {
            alert('Both dates are required');
            return;
        }

        if (new Date(scheduledStartDate) > new Date(targetedEndDate)) {
            alert('Scheduled start date must be before targeted end date');
            return;
        }

        try {
            await updateProgress({
                project_id: projectId,
                progress_id: activity.id,
                scheduled_start_date: scheduledStartDate,
                targeted_end_date: targetedEndDate
            }).unwrap();

            setShowDateEdit(false);
            alert('Dates updated successfully!');
        } catch (err) {
            console.error('Failed to update dates:', err);
            alert('Failed to update dates. Please try again.');
        }
    };

    const handleIncrement = () => {
        setTodayQty(prev => prev + 1);
    };

    const handleDecrement = () => {
        setTodayQty(prev => (prev > 0 ? prev - 1 : 0));
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
                <div className="text-sm text-gray-600 italic mb-3">
                    Remarks: {activity.remarks}
                </div>
            )}

            {/* Action Buttons Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                
                {/* Date Edit Section */}
                {!showDateEdit ? (
                    <button
                        onClick={() => {
                            setShowDateEdit(true);
                            setScheduledStartDate(activity.plannedStartDate || '');
                            setTargetedEndDate(activity.plannedEndDate || '');
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm mr-2"
                    >
                        Edit Dates
                    </button>
                ) : (
                    <form onSubmit={handleDateUpdate} className="space-y-3 p-4 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Planned Start Date
                                </label>
                                <input
                                    type="date"
                                    value={scheduledStartDate}
                                    onChange={(e) => setScheduledStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Planned End Date
                                </label>
                                <input
                                    type="date"
                                    value={targetedEndDate}
                                    onChange={(e) => setTargetedEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                {isLoading ? 'Updating...' : 'Save Dates'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDateEdit(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>

                        {isSuccess && (
                            <p className="text-sm text-green-600">✓ Dates updated successfully!</p>
                        )}
                        {isError && (
                            <p className="text-sm text-red-600">
                                ✗ Error: {error?.data?.message || 'Failed to update dates'}
                            </p>
                        )}
                    </form>
                )}

                {/* Quantity Update Section */}
                {activity.status !== 'Completed' && (
                    <>
                        {!showUpdateForm ? (
                            <button
                                onClick={() => setShowUpdateForm(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                            >
                                Update Quantity
                            </button>
                        ) : (
                            <form onSubmit={handleQuantityUpdate} className="space-y-3 p-4 bg-gray-50 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        Today's Quantity:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleDecrement}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={todayQty}
                                            onChange={(e) => setTodayQty(Number(e.target.value))}
                                            className="w-20 px-3 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            max={activity.totalQuantity - activity.completedQuantity}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleIncrement}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading || todayQty === 0}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                                    >
                                        {isLoading ? 'Updating...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUpdateForm(false);
                                            setTodayQty(0);
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {isSuccess && (
                                    <p className="text-sm text-green-600">✓ Quantity updated successfully!</p>
                                )}
                                {isError && (
                                    <p className="text-sm text-red-600">
                                        ✗ Error: {error?.data?.message || 'Failed to update'}
                                    </p>
                                )}
                            </form>
                        )}
                    </>
                )}
                <button
                        onClick={() => setShowHistoryModal(true)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm mr-2"
                    >
                        View History
                    </button>
            </div>
                        <HistoryTimelineModal
                isOpen={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                activityId={activity.id}
                activityName={activity.taskName}
            />
        </div>
    );
};

export default ProgressActivityCards;
