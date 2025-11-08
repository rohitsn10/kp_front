  
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, label;
    
    const statusLower = status?.toLowerCase() || '';
    
    switch(statusLower) {
      case 'completed':
      case 'closed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Completed';
        break;
      case 'open':
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'Open';
        break;
      case 'in progress':
      case 'in_progress':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        label = 'In Progress';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = 'Rejected';
        break;
      case 'accepted':
        bgColor = 'bg-teal-100';
        textColor = 'text-teal-800';
        label = 'Accepted';
        break;
      case 'verified':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        label = 'Verified';
        break;
      case 'rework':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        label = 'Rework';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = status || 'Unknown';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };
  export default StatusBadge