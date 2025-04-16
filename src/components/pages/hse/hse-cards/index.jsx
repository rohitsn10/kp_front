import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegAddressCard } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { HiShieldExclamation } from "react-icons/hi2";
import { FaClipboardCheck, FaTools, FaTruck, FaFireExtinguisher, FaUserShield, FaClipboardList,FaChalkboardTeacher, FaHeartbeat, FaFileAlt, FaToolbox, FaMedkit, FaSortNumericUp, FaHardHat, FaLightbulb,
  FaCalendarAlt, 
  FaLock, FaExclamationCircle
   } from "react-icons/fa";

const HSECards = ({ selectedSite }) => {
  const navigate = useNavigate()
  const landbankId = selectedSite;
  console.log("Selected Site Landbank ID",landbankId)
  
  const cards = [
    {
      id: 'permit-to-work',
      title: 'PERMIT TO WORK',
      description: 'Manage and track work permits',
      icon: <FaRegAddressCard className="w-12 h-12 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800'
    },
    {
      id: 'incident-investigation',
      title: 'INCIDENT / NEARMISS INVESTIGATION',
      description: 'Report and investigate safety incidents',
      icon: <FaExclamationTriangle className="w-12 h-12 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800'
    },
    {
      id: 'incident-report',
      title: 'INCIDENT / NEARMISS REPORT',
      description: 'Report and investigate safety incidents',
      icon: <FaExclamationCircle className="w-12 h-12 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
    },
    {
      id: 'safety-violation',
      title: 'SAFETY VIOLATION REPORT',
      description: 'Report unsafe acts and behaviors',
      icon: <HiShieldExclamation className="w-12 h-12 text-red-600" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800'
    },
    {
        id: 'boom-lift-inspection',
        title: 'BOOM LIFT INSPECTION CHECKLIST',
        description: 'Ensure safe operation of boom lifts',
        icon: <FaClipboardCheck className="w-12 h-12 text-green-600" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800'
      },
      {
        id: 'crane-hydra-inspection',
        title: 'CRANE / HYDRA INSPECTION CHECKLIST',
        description: 'Inspect cranes and hydras for safety',
        icon: <FaTools className="w-12 h-12 text-indigo-600" />,
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-300',
        textColor: 'text-indigo-800'
      },
      {
        id: 'trailer-inspection',
        title: 'TRAILER INSPECTION CHECKLIST',
        description: 'Verify trailer safety standards',
        icon: <FaTruck className="w-12 h-12 text-orange-600" />,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        textColor: 'text-orange-800'
      },
      {
        id: 'mock-drill-report',
        title: 'MOCK DRILL REPORT',
        description: 'Record and evaluate emergency drills',
        icon: <FaFireExtinguisher className="w-12 h-12 text-red-600" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-800'
      },
      {
        id: 'safety-training',
        title: 'SAFETY TRAINING',
        description: 'Track and manage safety training sessions',
        icon: <FaUserShield className="w-12 h-12 text-blue-600" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800'
      },
      {
        id: 'internal-audit-report',
        title: 'INTERNAL AUDIT REPORT',
        description: 'Monitor and ensure compliance via audits',
        icon: <FaClipboardList className="w-12 h-12 text-teal-600" />,
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-300',
        textColor: 'text-teal-800'
      },
      {
        id: 'induction-training',
        title: 'INDUCTION TRAINING',
        description: 'Conduct and track induction training',
        icon: <FaChalkboardTeacher className="w-12 h-12 text-purple-600" />,
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800'
      },
      {
        id: 'physical-fitness-certificate',
        title: 'PHYSICAL FITNESS CERTIFICATE',
        description: 'Ensure employee fitness certification',
        icon: <FaHeartbeat className="w-12 h-12 text-pink-600" />,
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-300',
        textColor: 'text-pink-800'
      },
      {
        id: 'safety-meeting-minutes',
        title: 'MINUTES OF SAFETY MEETING',
        description: 'Record discussions from safety meetings',
        icon: <FaFileAlt className="w-12 h-12 text-gray-600" />,
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-300',
        textColor: 'text-gray-800'
      },
      {
        id: 'toolbox-talk',
        title: 'TOOLBOX TALK',
        description: 'Document daily safety briefings',
        icon: <FaToolbox className="w-12 h-12 text-blue-500" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800'
      },
      {
        id: 'first-aid-record',
        title: 'FIRST AID RECORD',
        description: 'Track first aid incidents and treatments',
        icon: <FaMedkit className="w-12 h-12 text-red-500" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-800'
      },
      {
        id: 'ladder-checklist',
        title: 'LADDER CHECKLIST',
        description: 'Inspect ladders for compliance',
        icon: <FaSortNumericUp className="w-12 h-12 text-yellow-500" />,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-800'
      },
      {
        id: 'excavation-checklist',
        title: 'EXCAVATION CHECKLIST',
        description: 'Ensure excavation safety protocols',
        icon: <FaHardHat className="w-12 h-12 text-green-500" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800'
      },
      {
        id: 'suggestion-scheme',
        title: 'SUGGESTION SCHEME',
        description: 'Encourage safety improvements via suggestions',
        icon: <FaLightbulb className="w-12 h-12 text-orange-500" />,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        textColor: 'text-orange-800'
      },
      {
        id: 'monthly-fire-extinguisher-inspection',
        title: 'MONTHLY FIRE EXTINGUISHER INSPECTION CHECKLIST',
        description: 'Track monthly fire extinguisher inspections',
        icon: <FaCalendarAlt className="w-12 h-12 text-purple-500" />,
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800',
      },
      {
        id: 'loto-register',
        title: 'LOG OUT / TAG OUT REGISTER (LOTO)',
        description: 'Manage and record LOTO procedures',
        icon: <FaLock className="w-12 h-12 text-indigo-500" />,
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-300',
        textColor: 'text-indigo-800',
      },
      {
        id: 'full-body-harness-checklist',
        title: 'FULL BODY HARNESS CHECKLIST',
        description: 'Ensure safety of full body harnesses',
        icon: <FaUserShield className="w-12 h-12 text-teal-500" />,
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-300',
        textColor: 'text-teal-800',
      },
      {
        id: 'risk-assessment',
        title: 'RISK ASSESSMENT',
        description: 'Identify and evaluate potential hazards',
        icon: <FaExclamationCircle className="w-12 h-12 text-red-500" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-800',
      },
  ]

  // const handleCardClick = (card) => {
  //   // Navigate to the specific route, passing site information
  //   navigate(`/hse/${card.id}`)
  // }
  const handleCardClick = (card) => {
    // Navigate to the specific route, passing landbank ID as a URL parameter
    if (landbankId) {
      navigate(`/hse/${card.id}/${landbankId}`);
    } else {
      // If no landbank ID is available, navigate without it
      navigate(`/hse/${card.id}`);
    }
  }

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
  )
}

export default HSECards