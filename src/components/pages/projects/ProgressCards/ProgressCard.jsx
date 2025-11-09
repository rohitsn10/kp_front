import React from 'react';

export const ProgressCard = ({ title, value, icon, color }) => (
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
