import React from 'react';

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
export default TimelineCard