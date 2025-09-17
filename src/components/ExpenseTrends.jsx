import React, { useEffect, useState, useCallback, memo } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
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
  ReferenceLine,
} from "recharts";
import { getTrends } from "../api"; 

/** ================== CONFIG ================== */
const COLORS = ["#f87171", "#34d399"]; // red, green

/** ================== UI STATES ================== */
const LoadingState = () => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
    <CircularProgress />
  </Box>
);

const ErrorState = ({ message, onRetry }) => (
  <Box sx={{ mt: 4, textAlign: "center" }}>
    <Typography color="error" gutterBottom>
      {message}
    </Typography>
    <Button variant="contained" onClick={onRetry}>
      Retry
    </Button>
  </Box>
);

const EmptyState = () => (
  <Typography sx={{ mt: 4, textAlign: "center" }}>
    No trend data available yet.
  </Typography>
);

/** ================== PIE CHART ================== */
const ExpensesPie = ({ expenses, savings }) => {
  const pieData = [
    { name: "Expenses", value: expenses || 0 },
    { name: "Savings", value: savings || 0 },
  ];

  return (
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

/** ================== LINE CHART ================== */
const ExpensesLine = ({ expenses, salary, budget }) => {
  let cumulative = 0;
  const lineData = Array.isArray(expenses)
    ? expenses.map((e) => {
        cumulative += Number(e.amount) || 0;
        return {
          date: e.date,
          spent: cumulative,
          salary: salary || 0,
          budget: budget || 0,
        };
      })
    : [];

  return (
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

          {budget > 0 && (
            <ReferenceLine
              y={budget}
              label="Budget Limit"
              stroke="#ff0000"
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

/** ================== MAIN COMPONENT ================== */
function ExpenseTrends({ email }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrends = useCallback(async () => {
    if (!email) return;
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
  }, [email]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchTrends} />;
  if (!data) return <EmptyState />;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📈 Expense Trends
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <ExpensesPie expenses={data.total_expenses} savings={data.savings} />
        <ExpensesLine
          expenses={data.expenses}
          salary={data.salary}
          budget={data.budget}
        />
      </Box>
    </Box>
  );
}

export default memo(ExpenseTrends);