export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const getStatusColor = (status) => {
    const colorMap = {
        'Completed': 'bg-green-100 text-green-800 border-green-200',
        'WIP': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Yet to start': 'bg-red-100 text-red-800 border-red-200',
        'Pending': 'bg-red-100 text-red-800 border-red-200',
        'Yet to start/Pending': 'bg-red-100 text-red-800 border-red-200',
        default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[status] || colorMap.default;
};

