import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function Balance({ salary, expenses, balance }) {
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6">📊 Summary</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>💵 Salary: {salary}</Typography>
        <Typography color="error">💸 Expenses: {expenses}</Typography>
        <Typography color={balance >= 0 ? "success.main" : "error.main"}>
          🏦 Balance: {balance}
        </Typography>
      </Box>
    </Paper>
  );
}