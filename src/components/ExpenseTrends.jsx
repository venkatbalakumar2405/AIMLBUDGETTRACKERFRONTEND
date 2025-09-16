import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Button } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTrends } from "../api"; // backend: /budget/trends

function ExpenseTrends({ email }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTrends(email);
      setData(result);
    } catch (err) {
      console.error("❌ Failed to fetch trends:", err);
      setError("Failed to load trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchTrends();
  }, [email]);

  /** ================== LOADING & ERROR ================== */
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchTrends}>
          🔄 Retry
        </Button>
      </Box>
    );

  if (!data) return <Typography>No trend data available.</Typography>;

  /** ================== DATA PREP ================== */
  const pieData = [
    { name: "Expenses", value: data.total_expenses || 0 },
    { name: "Savings", value: data.savings || 0 },
  ];

  let cumulative = 0;
  const lineData = Array.isArray(data.expenses)
    ? data.expenses.map((e) => {
        cumulative += Number(e.amount) || 0;
        return {
          date: e.date,
          spent: cumulative,
          salary: data.salary || 0,
        };
      })
    : [];

  const COLORS = ["#f87171", "#34d399"]; // red, green

  /** ================== RENDER ================== */
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📊 Expense Trends
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Pie Chart */}
        <Paper sx={{ flex: "1 1 300px", height: 300, p: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* Line Chart */}
        <Paper sx={{ flex: "2 1 500px", height: 300, p: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#2563eb" />
              <Line type="monotone" dataKey="spent" stroke="#f87171" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}

export default ExpenseTrends;