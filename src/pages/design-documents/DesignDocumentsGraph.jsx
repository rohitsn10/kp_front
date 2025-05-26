import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useGetDrawingDashboardCountQuery } from "../../api/masterdesign/masterDesign";
// import { useGetDrawingDashboardCountQuery } from "./path-to-your-api"; // Update this import path

const DesignDocumentsGraph = ({ projectID = 8 }) => { // Accept projectID as prop
  const [chartType, setChartType] = useState("status");
  
  // API call
  const { 
    data: apiResponse, 
    error, 
    isLoading 
  } = useGetDrawingDashboardCountQuery(projectID);

  // Transform API data to chart format
  const chartData = useMemo(() => {
    if (!apiResponse?.data) return null;

    const { data } = apiResponse;
    
    const statusData = [
      { name: "Approved", count: data.total_approved, color: "#10B981" },
      { name: "Commented", count: data.total_commented, color: "#F97316" },
      { name: "New", count: data.total_new, color: "#6B7280" },
      { name: "Submitted", count: data.total_submitted, color: "#3B82F6" },
    ];

    // For discipline data - using proportional dummy data based on actual totals
    const disciplineData = [
      { 
        discipline: "Architecture", 
        approved: Math.round(data.total_approved * 0.48), 
        commented: Math.round(data.total_commented * 0.53), 
        new: Math.round(data.total_new * 0.38), 
        submitted: Math.round(data.total_submitted * 0.42) 
      },
      { 
        discipline: "Structural", 
        approved: Math.round(data.total_approved * 0.32), 
        commented: Math.round(data.total_commented * 0.27), 
        new: Math.round(data.total_new * 0.25), 
        submitted: Math.round(data.total_submitted * 0.25) 
      },
      { 
        discipline: "MEP", 
        approved: data.total_approved - Math.round(data.total_approved * 0.48) - Math.round(data.total_approved * 0.32), 
        commented: data.total_commented - Math.round(data.total_commented * 0.53) - Math.round(data.total_commented * 0.27), 
        new: data.total_new - Math.round(data.total_new * 0.38) - Math.round(data.total_new * 0.25), 
        submitted: data.total_submitted - Math.round(data.total_submitted * 0.42) - Math.round(data.total_submitted * 0.25) 
      },
    ];

    // For weekly progress - using dummy progression based on current totals
    const weeklyProgressData = [
      { week: "Week 1", uploaded: Math.round(data.total_drawings * 0.1), approved: Math.round(data.total_approved * 0.2) },
      { week: "Week 2", uploaded: Math.round(data.total_drawings * 0.25), approved: Math.round(data.total_approved * 0.4) },
      { week: "Week 3", uploaded: Math.round(data.total_drawings * 0.55), approved: Math.round(data.total_approved * 0.7) },
      { week: "Week 4", uploaded: data.total_drawings, approved: data.total_approved },
    ];

    // For block data - using proportional distribution
    const blockData = [
      { 
        block: "Block A", 
        total: Math.round(data.total_drawings * 0.3), 
        approved: Math.round(data.total_approved * 0.4), 
        pending: Math.round((data.total_commented + data.total_new + data.total_submitted) * 0.25) 
      },
      { 
        block: "Block B", 
        total: Math.round(data.total_drawings * 0.4), 
        approved: Math.round(data.total_approved * 0.35), 
        pending: Math.round((data.total_commented + data.total_new + data.total_submitted) * 0.4) 
      },
      { 
        block: "Block C", 
        total: data.total_drawings - Math.round(data.total_drawings * 0.3) - Math.round(data.total_drawings * 0.4), 
        approved: data.total_approved - Math.round(data.total_approved * 0.4) - Math.round(data.total_approved * 0.35), 
        pending: (data.total_commented + data.total_new + data.total_submitted) - Math.round((data.total_commented + data.total_new + data.total_submitted) * 0.25) - Math.round((data.total_commented + data.total_new + data.total_submitted) * 0.4) 
      },
    ];

    return {
      statusData,
      disciplineData,
      weeklyProgressData,
      blockData,
      totals: data
    };
  }, [apiResponse]);

  // Loading state
  if (isLoading) {
    return (
      <Box className="w-full mb-8">
        <Card elevation={2}>
          <CardContent>
            <Box className="flex justify-center items-center" sx={{ height: 400 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" className="ml-4">
                Loading dashboard data...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box className="w-full mb-8">
        <Card elevation={2}>
          <CardContent>
            <Alert severity="error" className="mb-4">
              <Typography variant="h6">Error loading dashboard data</Typography>
              <Typography variant="body2">
                {error?.data?.message || error?.message || "Failed to fetch dashboard data"}
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // No data state
  if (!chartData) {
    return (
      <Box className="w-full mb-8">
        <Card elevation={2}>
          <CardContent>
            <Alert severity="info">
              <Typography variant="h6">No data available</Typography>
              <Typography variant="body2">
                No drawing data found for this project.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const renderStatusPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData.statusData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {chartData.statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderDisciplineBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData.disciplineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="discipline" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="approved" fill="#10B981" />
        <Bar dataKey="commented" fill="#F97316" />
        <Bar dataKey="new" fill="#6B7280" />
        <Bar dataKey="submitted" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderWeeklyProgressChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData.weeklyProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="uploaded" stroke="#FACC15" strokeWidth={2} />
        <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBlockBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData.blockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="block" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="approved" fill="#10B981" />
        <Bar dataKey="pending" fill="#F97316" />
      </BarChart>
    </ResponsiveContainer>
  );

  const getChartTitle = () => {
    switch (chartType) {
      case "status":
        return "Approval Status Distribution";
      case "discipline":
        return "Documents by Discipline";
      case "progress":
        return "Weekly Progress Tracking";
      case "block":
        return "Documents by Block";
      default:
        return "Design Documents Analytics";
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case "status":
        return renderStatusPieChart();
      case "discipline":
        return renderDisciplineBarChart();
      case "progress":
        return renderWeeklyProgressChart();
      case "block":
        return renderBlockBarChart();
      default:
        return renderStatusPieChart();
    }
  };

  // Calculate summary statistics from real data
  const totalDocuments = chartData.totals.total_drawings;
  const approvedDocuments = chartData.totals.total_approved;
  const commentedDocuments = chartData.totals.total_commented;
  const approvalRate = totalDocuments > 0 ? ((approvedDocuments / totalDocuments) * 100).toFixed(1) : "0.0";

  return (
    <Box className="w-full mb-8">
      <Card elevation={2}>
        <CardContent>
          {/* Header with Chart Type Selection */}
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Typography variant="h6" className="text-[#29346B] font-semibold">
              Design Documents Analytics
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="chart-type-label">Chart Type</InputLabel>
              <Select
                labelId="chart-type-label"
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value)}
                sx={{
                  "& .MuiSelect-select": {
                    fontSize: { xs: '14px', sm: '16px' }
                  }
                }}
              >
                <MenuItem value="status">Status Distribution</MenuItem>
                <MenuItem value="discipline">By Discipline</MenuItem>
                <MenuItem value="progress">Weekly Progress</MenuItem>
                <MenuItem value="block">By Block</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={2} className="mb-6">
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" className="text-center">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h5" className="text-[#29346B] font-bold">
                    {totalDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Documents
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" className="text-center">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h5" className="text-green-600 font-bold">
                    {approvedDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" className="text-center">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h5" className="text-orange-600 font-bold">
                    {commentedDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commented
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" className="text-center">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h5" className="text-[#29346B] font-bold">
                    {approvalRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approval Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Box>
            <Typography variant="h6" className="text-[#29346B] mb-4 text-center">
              {getChartTitle()}
            </Typography>
            <Box className="w-full" sx={{ height: 300 }}>
              {renderChart()}
            </Box>
          </Box>

          {/* Chart Legend/Description */}
          <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Typography variant="body2" color="text.secondary" className="text-center">
              {chartType === "status" && "Distribution of documents by approval status"}
              {chartType === "discipline" && "Breakdown of documents across different disciplines"}
              {chartType === "progress" && "Weekly tracking of document uploads and approvals"}
              {chartType === "block" && "Document distribution across project blocks"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DesignDocumentsGraph;