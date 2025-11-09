import React from 'react';

const DetailCard = ({ label, value }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-lg font-semibold text-gray-900">{value || "N/A"}</div>
    </div>
);

export default DetailCard