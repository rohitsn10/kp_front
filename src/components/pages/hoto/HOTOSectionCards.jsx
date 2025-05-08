import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaClipboardCheck, 
  FaBookOpen, 
  FaFileAlt, 
  FaExchangeAlt,
  FaRegFileAlt,
  FaFilePdf,
  FaHistory
} from "react-icons/fa";

const HOTOSectionCards = ({ selectedProject }) => {
  const navigate = useNavigate();
  const projectId = selectedProject;
  console.log("Selected Project ID", projectId);
  
  const cards = [
    {
      id: 'add-document',
      title: 'Add Document',
      description: 'Add new HOTO documents',
      icon: <FaFileAlt className="w-12 h-12 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800'
    },
    {
      id: 'punchpoints',
      title: 'HOTO Punchpoints',
      description: 'View all handover takeover records',
      icon: <FaClipboardCheck className="w-12 h-12 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800'
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Access HOTO procedures and manuals',
      icon: <FaBookOpen className="w-12 h-12 text-purple-600" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-800'
    },
  ];

  const handleCardClick = (card) => {
    // Navigate to the specific route, passing project ID as a URL parameter
    if (projectId) {
      navigate(`/hoto-page/${card.id}/${projectId}`);
    } else {
      // If no project ID is available, handle accordingly
      // navigate(`/hoto/${card.id}`);
    }
  };

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {cards.map((card) => (
        <div 
          key={card.id} 
          onClick={() => handleCardClick(card)}
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
  );
};

export default HOTOSectionCards;    