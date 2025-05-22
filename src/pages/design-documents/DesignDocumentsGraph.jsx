import React, { useState } from "react";
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
} from "@mui/material";

// Dummy data for different chart types
const statusData = [
  { name: "Approved", count: 25, color: "#10B981" },
  { name: "Commented", count: 15, color: "#F97316" },
  { name: "New", count: 8, color: "#6B7280" },
  { name: "Submitted", count: 12, color: "#3B82F6" },
];

const disciplineData = [
  { discipline: "Architecture", approved: 12, commented: 8, new: 3, submitted: 5 },
  { discipline: "Structural", approved: 8, commented: 4, new: 2, submitted: 3 },
  { discipline: "MEP", approved: 5, commented: 3, new: 3, submitted: 4 },
];

const weeklyProgressData = [
  { week: "Week 1", uploaded: 5, approved: 2 },
  { week: "Week 2", uploaded: 8, approved: 4 },
  { week: "Week 3", uploaded: 12, approved: 7 },
  { week: "Week 4", uploaded: 15, approved: 12 },
];

const blockData = [
  { block: "Block A", total: 18, approved: 12, pending: 6 },
  { block: "Block B", total: 22, approved: 15, pending: 7 },
  { block: "Block C", total: 20, approved: 13, pending: 7 },
];

const DesignDocumentsGraph = () => {
  const [chartType, setChartType] = useState("status");

  const renderStatusPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderDisciplineBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={disciplineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
      <LineChart data={weeklyProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
      <BarChart data={blockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

  // Summary statistics
  const totalDocuments = statusData.reduce((sum, item) => sum + item.count, 0);
  const approvedDocuments = statusData.find(item => item.name === "Approved")?.count || 0;
  const approvalRate = ((approvedDocuments / totalDocuments) * 100).toFixed(1);

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
                    {statusData.find(item => item.name === "Commented")?.count || 0}
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