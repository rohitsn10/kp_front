// HistoryTimelineModal.jsx
import React from 'react';
import { useGetProjectTaskHistoryQuery } from '../../../../api/users/projectApi';

const HistoryTimelineModal = ({ isOpen, onClose, activityId, activityName }) => {
    const { data, isLoading, isError } = useGetProjectTaskHistoryQuery(activityId, {
        skip: !isOpen // Only fetch when modal is open
    });
    
    if (!isOpen) return null;

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFieldName = (field) => {
        return field.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Change History</h2>
                        <p className="text-sm text-gray-600 mt-1">{activityName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Loading history...</span>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-8">
                            <p className="text-red-600">Failed to load history. Please try again.</p>
                        </div>
                    )}

                    {data?.data?.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No change history available</p>
                        </div>
                    )}

                    {data?.data && data.data.length > 0 && (
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            {/* Timeline Items */}
                            <div className="space-y-6">
                                {data.data.map((record, index) => (
                                    <div key={index} className="relative pl-10">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-2.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>

                                        {/* Timeline Content */}
                                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {formatFieldName(record.field_name)}
                                                </h4>
                                                <span className="text-xs text-gray-500">
                                                    {formatDateTime(record.changed_at)}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                                                    {record.old_value || 'None'}
                                                </span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                                    {record.new_value || 'None'}
                                                </span>
                                            </div>

                                            {record.changed_by && (
                                                <p className="mt-2 text-xs text-gray-600">
                                                    Changed by: <span className="font-medium">{record.changed_by}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryTimelineModal;
