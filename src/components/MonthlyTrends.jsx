import React, { useEffect, useState, useCallback } from "react";
import { getMonthlyTrends } from "../api";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    No monthly data available yet.
  </Typography>
);

/** ================== MAIN COMPONENT ================== */
function MonthlyTrends({ email }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTrends = useCallback(async () => {
    if (!email) return;
    try {
      setLoading(true);
      setError(null);

      const result = await getMonthlyTrends(email);
      console.log("📊 Monthly Trends API result:", result);

      if (result?.monthly_trends) {
        const salary = result.salary || 0;
        const budget = result.budget || 0;

        const formatted = Object.entries(result.monthly_trends).map(
          ([month, total_expenses]) => ({
            month,
            total_expenses,
            salary,
            savings: salary - total_expenses,
            budget,
          })
        );

        setData(formatted);
        setLastUpdated(new Date()); // ✅ Save timestamp
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch monthly trends:", err);
      setError("Failed to load monthly trends. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchTrends} />;
  if (!data.length) return <EmptyState />;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📈 Monthly Expense vs Salary vs Savings
      </Typography>

      <Paper sx={{ p: 2, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="salary"
              stroke="#2563eb"
              fill="#2563eb33"
              name="Salary"
            />
            <Area
              type="monotone"
              dataKey="total_expenses"
              stroke="#f87171"
              fill="#f8717133"
              name="Expenses"
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#34d399"
              fill="#34d39933"
              name="Savings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {lastUpdated && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, textAlign: "right", fontStyle: "italic" }}
        >
          Last updated: {lastUpdated.toLocaleString()}
        </Typography>
      )}
    </Box>
  );
}

export default MonthlyTrends;