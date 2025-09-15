import React, { useEffect, useState } from "react";
import { getProfile } from "../api";  // ✅ FIXED
import { Box, Typography } from "@mui/material";

function ExpenseTrends({ email }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getProfile(email);
        setExpenses(data.expenses || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExpenses();
  }, [email]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">📊 Expense Trends</Typography>
      {/* You can add a chart here later */}
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>{e.name}: ₹{e.amount}</li>
        ))}
      </ul>
    </Box>
  );
}

export default ExpenseTrends;