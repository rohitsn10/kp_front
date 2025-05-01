import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaBolt, 
  FaCogs, 
  FaBuilding,
  FaExclamationTriangle
} from "react-icons/fa";

function FieldInspections() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // If no project ID is available, show fallback component
  if (!projectId) {
    return (
      <div className="bg-white rounded-md p-8 m-4 min-h-screen flex flex-col items-center justify-center">
        <FaExclamationTriangle className="text-yellow-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Project Selected</h2>
        <p className="text-gray-600 mb-6">Please select a project before accessing field inspections.</p>
        <button 
          onClick={() => navigate('/quality-main')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Quality Dashboard
        </button>
      </div>
    );
  }
  
  const cards = [

    {
      id: 'electrical',
      title: 'ELECTRICAL INSPECTION',
      description: 'Inspect electrical systems, wiring, and installations',
      icon: <FaBolt className="w-12 h-12 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800',
      path: `/quality-main/field-inspections/electical/${projectId}` // Using your route spelling
    },
    {
      id: 'mechanical',
      title: 'MECHANICAL INSPECTION',
      description: 'Inspect mechanical equipment, systems, and installations',
      icon: <FaCogs className="w-12 h-12 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800',
      path: `/quality-main/field-inspections/mechanical/${projectId}` 
    },
    {
      id: 'civil',
      title: 'CIVIL INSPECTION',
      description: 'Inspect structural and civil engineering works',
      icon: <FaBuilding className="w-12 h-12 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      path: `/quality-main/field-inspections/civil/${projectId}`
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-white rounded-md p-8 m-4 min-h-screen flex flex-col gap-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Field Inspections</h1>
        <p className="text-gray-600">Select an inspection category to continue</p>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {cards.map((card) => (
          <div 
            key={card.id} 
            onClick={() => handleCardClick(card.path)}
            className={`
              ${card.bgColor} 
              ${card.borderColor} 
              ${card.textColor}
              border-2 
              rounded-lg 
              p-6 
              shadow-md 
              hover:shadow-xl 
              transition-all 
              duration-300 
              ease-in-out 
              transform 
              hover:-translate-y-1
              cursor-pointer
              group
            `}
          >
            <div className='flex items-center space-x-4 mb-4'>
              {card.icon}
              <div className='flex flex-col gap-3'>
                <h2 className='text-xl font-bold group-hover:text-opacity-80 transition-all'>
                  {card.title}
                </h2>
                <p className='text-sm opacity-70'>{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldInspections;