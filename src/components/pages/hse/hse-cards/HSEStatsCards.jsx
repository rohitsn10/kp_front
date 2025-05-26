import React, { useState } from 'react';
import { 
  FaExclamationTriangle, 
  FaChalkboardTeacher, 
  FaRegAddressCard, 
  FaToolbox, 
  FaClipboardList, 
  FaFireExtinguisher, 
  FaUsers, 
  FaClipboardCheck, 
  FaTools, 
  FaTruck, 
  FaMedkit, 
  FaSortNumericUp,
  FaChartBar,
  FaChartLine 
} from "react-icons/fa";
import { HiShieldExclamation } from "react-icons/hi2";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const HSEMonthlyVisualization = ({ selectedSite }) => {
  const [selectedMetric, setSelectedMetric] = useState('nearMissReported');
  const [chartType, setChartType] = useState('line');

  // Monthly HSE statistics data
  const hseStatsData = {
    nearMissReported: {
      Jan: 2, Feb: 1, Mar: 3, Apr: 1, May: 0, Jun: 1,
      Jul: 0, Aug: 1, Sep: 1, Oct: 0, Nov: 1, Dec: 1
    },
    hseInduction: {
      Jan: 5, Feb: 4, Mar: 3, Apr: 2, May: 4, Jun: 5,
      Jul: 3, Aug: 4, Sep: 4, Oct: 3, Nov: 4, Dec: 4
    },
    ptwIssued: {
      Jan: 2, Feb: 1, Mar: 1, Apr: 3, May: 2, Jun: 2,
      Jul: 1, Aug: 3, Sep: 2, Oct: 2, Nov: 2, Dec: 2
    },
    tbtConducted: {
      Jan: 6, Feb: 5, Mar: 5, Apr: 6, May: 5, Jun: 5,
      Jul: 5, Aug: 5, Sep: 4, Oct: 4, Nov: 5, Dec: 6
    },
    safetyAudits: {
      Jan: 1, Feb: 1, Mar: 0, Apr: 1, May: 1, Jun: 0,
      Jul: 1, Aug: 0, Sep: 1, Oct: 1, Nov: 0, Dec: 1
    },
    mockDrill: {
      Jan: 1, Feb: 0, Mar: 1, Apr: 0, May: 1, Jun: 0,
      Jul: 1, Aug: 0, Sep: 1, Oct: 0, Nov: 1, Dec: 0
    },
    safetyCommitteeMeetings: {
      Jan: 1, Feb: 0, Mar: 0, Apr: 0, May: 1, Jun: 0,
      Jul: 0, Aug: 1, Sep: 0, Oct: 0, Nov: 1, Dec: 0
    },
    boomLiftInspection: {
      Jan: 2, Feb: 1, Mar: 2, Apr: 1, May: 1, Jun: 1,
      Jul: 2, Aug: 1, Sep: 1, Oct: 1, Nov: 1, Dec: 1
    },
    craneHydraInspection: {
      Jan: 2, Feb: 1, Mar: 1, Apr: 2, May: 2, Jun: 1,
      Jul: 2, Aug: 2, Sep: 1, Oct: 1, Nov: 2, Dec: 1
    },
    trailerInspectionChecklist: {
      Jan: 2, Feb: 1, Mar: 2, Apr: 2, May: 1, Jun: 2,
      Jul: 2, Aug: 2, Sep: 2, Oct: 1, Nov: 2, Dec: 1
    },
    firstAidCases: {
      Jan: 0, Feb: 0, Mar: 1, Apr: 0, May: 0, Jun: 0,
      Jul: 1, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 1
    },
    safetyViolationReport: {
      Jan: 1, Feb: 0, Mar: 1, Apr: 1, May: 0, Jun: 1,
      Jul: 0, Aug: 1, Sep: 0, Oct: 1, Nov: 0, Dec: 1
    },
    ladderInspection: {
      Jan: 3, Feb: 2, Mar: 2, Apr: 3, May: 2, Jun: 3,
      Jul: 2, Aug: 2, Sep: 2, Oct: 2, Nov: 2, Dec: 3
    }
  };

  // Helper function to calculate total from monthly data
  const calculateTotal = (monthlyData) => {
    return Object.values(monthlyData).reduce((sum, value) => sum + value, 0);
  };

  // Metric options for dropdown
  const metricOptions = [
    { key: 'nearMissReported', label: 'Near Miss Reported', color: '#EAB308' },
    { key: 'hseInduction', label: 'HSE Induction', color: '#3B82F6' },
    { key: 'ptwIssued', label: 'PTW Issued', color: '#10B981' },
    { key: 'tbtConducted', label: 'TBT Conducted', color: '#6366F1' },
    { key: 'safetyAudits', label: 'Safety Audits', color: '#8B5CF6' },
    { key: 'mockDrill', label: 'Mock Drill', color: '#EF4444' },
    { key: 'safetyCommitteeMeetings', label: 'Safety Committee Meetings', color: '#14B8A6' },
    { key: 'boomLiftInspection', label: 'Boom Lift Inspection', color: '#10B981' },
    { key: 'craneHydraInspection', label: 'Crane/Hydra Inspection', color: '#F97316' },
    { key: 'trailerInspectionChecklist', label: 'Trailer Inspection', color: '#06B6D4' },
    { key: 'firstAidCases', label: 'First Aid Cases', color: '#EC4899' },
    { key: 'safetyViolationReport', label: 'Safety Violation Report', color: '#EF4444' },
    { key: 'ladderInspection', label: 'Ladder Inspection', color: '#64748B' }
  ];

  // Convert data to chart format
  const chartData = Object.keys(hseStatsData[selectedMetric]).map(month => ({
    month,
    value: hseStatsData[selectedMetric][month],
    name: month
  }));

  // Get current metric info
  const currentMetric = metricOptions.find(m => m.key === selectedMetric);

  // Stats cards for quick overview
  const statsCards = [
    {
      id: 'near-miss',
      title: 'Near Miss Reported',
      count: calculateTotal(hseStatsData.nearMissReported),
      icon: <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800',
      countColor: 'text-yellow-600',
      key: 'nearMissReported'
    },
    {
      id: 'hse-induction',
      title: 'HSE Induction',
      count: calculateTotal(hseStatsData.hseInduction),
      icon: <FaChalkboardTeacher className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800',
      countColor: 'text-blue-600',
      key: 'hseInduction'
    },
    {
      id: 'ptw-issued',
      title: 'PTW Issued',
      count: calculateTotal(hseStatsData.ptwIssued),
      icon: <FaRegAddressCard className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      countColor: 'text-green-600',
      key: 'ptwIssued'
    },
    {
      id: 'tbt-conducted',
      title: 'TBT Conducted',
      count: calculateTotal(hseStatsData.tbtConducted),
      icon: <FaToolbox className="w-6 h-6 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      textColor: 'text-indigo-800',
      countColor: 'text-indigo-600',
      key: 'tbtConducted'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">HSE Monthly Data Visualization</h2>
        <p className="text-gray-600">Track monthly trends and patterns in HSE metrics</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedMetric(card.key)}
            className={`
              ${card.bgColor} 
              ${card.borderColor} 
              ${selectedMetric === card.key ? 'border-4 shadow-lg scale-105' : 'border-2'} 
              ${card.textColor}
              rounded-lg 
              p-3 
              shadow-sm 
              hover:shadow-md 
              transition-all 
              duration-300 
              cursor-pointer
              group
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-shrink-0">
                {card.icon}
              </div>
              <div className={`text-xl font-bold ${card.countColor}`}>
                {card.count}
              </div>
            </div>
            <h3 className="text-xs font-semibold leading-tight">
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Metric
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {metricOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FaChartLine />
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FaChartBar />
            Bar
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentMetric?.label} - Monthly Trend
          </h3>
          <p className="text-gray-600">
            Total for the year: <span className="font-bold">{calculateTotal(hseStatsData[selectedMetric])}</span>
          </p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={currentMetric?.color || '#3B82F6'} 
                  strokeWidth={3}
                  dot={{ fill: currentMetric?.color || '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill={currentMetric?.color || '#3B82F6'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Breakdown - {currentMetric?.label}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(hseStatsData[selectedMetric]).map(([month, value]) => (
            <div key={month} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{month}</div>
              <div className="text-2xl font-bold" style={{ color: currentMetric?.color }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HSEMonthlyVisualization;