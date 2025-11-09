import React from 'react';
import { ProgressCard } from '../ProgressCards/ProgressCard';
// import { ProgressCard } from '../../ui/ProgressCard';

export const ProgressOverview = ({ summary }) => {
    return (
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
    );
};
