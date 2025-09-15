import React, { useEffect, useState } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { Box, Button, Typography } from "@mui/material";
import API from "../api"; // axios instance

function ExpenseTrends() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar"); // bar | line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/budget/monthly-expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((item) => ({
          month: `${item.year}-${String(item.month).padStart(2, "0")}`,
          total: item.total,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Failed to load monthly expenses:", err);
      } finally {
        setLoading(false);
      }
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

      {loading ? (
        <Typography>Loading chart...</Typography>
      ) : data.length === 0 ? (
        <Typography>No expense data yet.</Typography>
      ) : (
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
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1976d2"
                strokeWidth={2}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </Box>
  );
}

export default ExpenseTrends;