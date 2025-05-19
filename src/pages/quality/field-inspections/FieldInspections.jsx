import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Grid, Paper, Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { 
  FaBolt, 
  FaCogs, 
  FaBuilding, 
  FaChartBar,
  FaExclamationTriangle
} from "react-icons/fa";
import { useGetAllRfiCountQuery } from '../../../api/quality/qualityApi';
// import { useGetAllRfiCountQuery } from '../../services/qualityApi'; // Adjust the import path as needed

// Custom color palettes
const CATEGORY_COLORS = {
  mechanical: '#3b82f6', // blue-500
  electrical: '#eab308', // yellow-500
  civil: '#22c55e' // green-500
};

const STATUS_COLORS = {
  'Approved with comments': '#22c55e', // green-500
  'Hold': '#f59e0b', // amber-500
  'Reject': '#ef4444', // red-500
  'Use-As-Is/Deviate': '#8b5cf6', // violet-500
  'Rework': '#f97316', // orange-500
  'Sort': '#06b6d4', // cyan-500
  'Released': '#10b981' // emerald-500
};

const RfiDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data: rfiData, error, isLoading } = useGetAllRfiCountQuery(projectId);
  const [categoryData, setCategoryData] = useState([]);
  const [statusTotals, setStatusTotals] = useState([]);

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
  
  // Navigation cards - maintain the same structure as original component
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

  useEffect(() => {
    if (rfiData?.data) {
      // Format data for RFI counts by activity (category)
      const counts = rfiData.data.rfi_counts_by_activity;
      const formattedCategoryData = Object.keys(counts).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: counts[key],
        color: CATEGORY_COLORS[key]
      }));
      setCategoryData(formattedCategoryData);

      // Calculate status totals for pie chart
      const outcomes = rfiData.data.outcome_counts_by_activity_and_status;
      const statusMap = {};
      Object.keys(outcomes).forEach(activity => {
        Object.keys(outcomes[activity]).forEach(status => {
          statusMap[status] = (statusMap[status] || 0) + outcomes[activity][status];
        });
      });
      
      const formattedStatusTotals = Object.keys(statusMap).map(status => ({
        name: status,
        value: statusMap[status],
        color: STATUS_COLORS[status] || '#64748b' // Default color if not in palette
      }));
      setStatusTotals(formattedStatusTotals);
    }
  }, [rfiData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="error">
          Error loading RFI data. Please try again later.
        </Typography>
      </Box>
    );
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md rounded-md">
          <p className="font-medium">{`${label || payload[0].name}`}</p>
          <p className="text-sm">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-md p-4 md:p-8 m-4 min-h-screen">
      <div className="text-center mb-6">
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <FaChartBar className="mr-2 text-blue-600" size={28} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            RFI Dashboard
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" className="mb-4">
          Project ID: {projectId}
        </Typography>
      </div>

      {/* Navigation Cards - Keep original navigation functionality */}
      <div className="mb-8">
        <Typography variant="h6" className="mb-4">
          Field Inspections
        </Typography>
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

      {/* RFI Dashboard Content */}
      <Typography variant="h6" className="mb-4">
        RFI Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={4}>
          <Card className="h-full border-l-4 border-blue-500">
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <FaCogs className="text-blue-500 mr-2" />
                <Typography variant="h6">Mechanical</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {rfiData?.data?.rfi_counts_by_activity?.mechanical || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total RFIs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="h-full border-l-4 border-yellow-500">
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <FaBolt className="text-yellow-500 mr-2" />
                <Typography variant="h6">Electrical</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {rfiData?.data?.rfi_counts_by_activity?.electrical || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total RFIs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="h-full border-l-4 border-green-500">
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <FaBuilding className="text-green-500 mr-2" />
                <Typography variant="h6">Civil</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {rfiData?.data?.rfi_counts_by_activity?.civil || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total RFIs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* RFIs by Category Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" fontWeight="medium" className="mb-4">
              RFIs by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Outcome Status Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" fontWeight="medium" className="mb-4">
              RFI Outcome Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detailed Outcome by Category */}
        <Grid item xs={12}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" fontWeight="medium" className="mb-4">
              Outcome Status by Category
            </Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Mechanical</th>
                    <th className="py-3 px-4 text-center">Electrical</th>
                    <th className="py-3 px-4 text-center">Civil</th>
                    <th className="py-3 px-4 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(STATUS_COLORS).map(status => {
                    const mechanical = rfiData?.data?.outcome_counts_by_activity_and_status?.mechanical?.[status] || 0;
                    const electrical = rfiData?.data?.outcome_counts_by_activity_and_status?.electrical?.[status] || 0;
                    const civil = rfiData?.data?.outcome_counts_by_activity_and_status?.civil?.[status] || 0;
                    const total = mechanical + electrical + civil;
                    
                    return (
                      <tr key={status} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: STATUS_COLORS[status] }}></div>
                            {status}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">{mechanical}</td>
                        <td className="py-3 px-4 text-center">{electrical}</td>
                        <td className="py-3 px-4 text-center">{civil}</td>
                        <td className="py-3 px-4 text-center font-medium">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default RfiDashboard;