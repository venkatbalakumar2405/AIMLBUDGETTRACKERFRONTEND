import React, { useEffect, useState } from "react";
import { getMonthlyTrends } from "../api";
import { Box, Typography } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from "recharts";

function MonthlyTrends({ email }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const result = await getMonthlyTrends(email);
        setData(result.monthly_trends || []);
      } catch (err) {
        console.error("Failed to fetch monthly trends:", err);
      }
    };
    fetchTrends();
  }, [email]);

  if (!data.length) return <Typography>No monthly data available</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📈 Monthly Expense vs Salary vs Savings
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="salary" stroke="#2563eb" fill="#2563eb33" />
          <Area type="monotone" dataKey="total_expenses" stroke="#f87171" fill="#f8717133" />
          <Area type="monotone" dataKey="savings" stroke="#34d399" fill="#34d39933" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MonthlyTrends;