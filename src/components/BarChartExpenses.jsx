import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function BarChartExpenses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/budget/monthly-expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      // Format labels like "Jan 2025"
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const formatted = result.map((item) => ({
        name: `${months[item.month - 1]} ${item.year}`,
        total: item.total,
      }));

      setData(formatted);
    };

    fetchMonthlyExpenses();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartExpenses;