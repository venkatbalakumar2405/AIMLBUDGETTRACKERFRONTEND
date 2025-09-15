import React, { useEffect, useState } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { Box, Button } from "@mui/material";

function ExpenseTrends() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar"); // bar | line

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/budget/monthly-expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      // Format: "2025-01", "2025-02"
      const formatted = json.map((item) => ({
        month: `${item.year}-${String(item.month).padStart(2, "0")}`,
        total: item.total,
      }));
      setData(formatted);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ my: 3 }}>
      <Button
        variant="outlined"
        onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
        sx={{ mb: 2 }}
      >
        Toggle to {chartType === "bar" ? "Line" : "Bar"} Chart
      </Button>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#1976d2" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

export default ExpenseTrends;