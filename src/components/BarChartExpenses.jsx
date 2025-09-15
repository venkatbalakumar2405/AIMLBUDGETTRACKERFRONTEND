import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function BarChartExpenses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("currentUser");

      if (!token || !email) {
        console.warn("No token or email found in localStorage");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/budget/monthly-expenses?email=${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const result = await response.json();

        const months = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const formatted = result.map((item) => ({
          name: `${months[item.month - 1]} ${item.year}`,
          total: item.total,
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
      }
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