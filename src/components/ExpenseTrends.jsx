import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
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
import { getTrends } from "../api"; // ✅ backend: /budget/trends

function ExpenseTrends({ email }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const result = await getTrends(email);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch trends:", err);
      }
    };
    fetchTrends();
  }, [email]);

  if (!data) return <Typography>Loading trends...</Typography>;

  // ✅ Pie chart data (summary)
  const pieData = [
    { name: "Expenses", value: data.total_expenses },
    { name: "Savings", value: data.savings },
  ];

  // ✅ Line chart data (expenses over time)
  let cumulative = 0;
  const lineData = data.expenses.map((e) => {
    cumulative += e.amount;
    return {
      date: e.date, // ✅ proper date from backend
      spent: cumulative,
      salary: data.salary,
    };
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📊 Expense Trends
      </Typography>

      <Box sx={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {/* Pie Chart (Expenses vs Savings) */}
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              <Cell fill="#f87171" /> {/* Expenses in red */}
              <Cell fill="#34d399" /> {/* Savings in green */}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Line Chart (Cumulative Expenses vs Salary over time) */}
        <ResponsiveContainer width={500} height={300}>
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
      </Box>
    </Box>
  );
}

export default ExpenseTrends;
