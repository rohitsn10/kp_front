import React from 'react';

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
export default TabButton