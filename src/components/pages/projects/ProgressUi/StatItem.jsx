import React from 'react';

const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);

export default StatItem