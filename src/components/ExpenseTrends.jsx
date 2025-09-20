import React from "react"; 
import {
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const samplePieData = [
  { name: "Salary", value: 60000 },
  { name: "Expenses", value: 45137.5 },
];

const sampleLineData = [
  { date: "2025-09-16", salary: 60000, spent: 12500 },
  { date: "2025-09-17", salary: 60000, spent: 30000 },
  { date: "2025-09-18", salary: 60000, spent: 45137.5 },
];

const COLORS = ["#22c55e", "#ef4444"];

function ExpenseTrendsStatic() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📊 Expense Trends
      </Typography>

      <Grid container spacing={2}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 350, background: "#111", color: "#fff" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={samplePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {samplePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 350, background: "#111", color: "#fff" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Blue Salary Line */}
                <Line type="monotone" dataKey="salary" stroke="#3b82f6" name="Salary" />
                {/* Red Expenses Line */}
                <Line type="monotone" dataKey="spent" stroke="#ef4444" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExpenseTrendsStatic;