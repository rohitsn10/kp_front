import React from 'react'

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

function ProgressActivity({transformedActivities,summary}) {
  return (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <ProgressBar
                                            label="Service Tasks"
                                            completed={transformedActivities.filter(t => t.category === 'Service' && t.status === 'Completed').length}
                                            total={summary.serviceTasks}
                                            color="bg-blue-500"
                                        />
                                        <ProgressBar
                                            label="Supply Tasks"
                                            completed={transformedActivities.filter(t => t.category === 'Supply' && t.status === 'Completed').length}
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
                                </div>  )
}

export default ProgressActivity