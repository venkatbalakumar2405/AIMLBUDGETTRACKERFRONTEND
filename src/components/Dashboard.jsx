// src/components/Dashboard.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import SalaryForm from "./SalaryForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Balance from "./Balance";
import ExpenseTrends from "./ExpenseTrends";
import { downloadReport } from "../api";
import useUserProfile from "../hooks/useUserProfile"; // ✅ FIXED PATH

function Dashboard({ resetAll, logout }) {
  const { profile, loading, error } = useUserProfile(); // ✅ keep consistent

  // 🔹 Loading state
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  // 🔹 Destructure data safely
  const { email, salary = 0, expenses = [] } = profile || {};
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = salary - totalExpenses;

  // 🔹 Report download handler
  const handleDownload = async (format) => {
    try {
      await downloadReport(email, format);
    } catch (err) {
      console.error("❌ Error downloading report:", err);
      alert("Failed to download report.");
    }
  };

  // 🔹 Format currency
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">💰 Budget Tracker</Typography>
        <Box>
          <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
            👋 Welcome, <strong>{email}</strong>
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            🚪 Logout
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left: Salary + Balance */}
        <Grid item xs={12} md={4}>
          <SalaryForm email={email} salary={salary} onSalaryUpdate={() => {}} />
          <Box sx={{ mt: 2 }}>
            <Balance
              salary={formatCurrency(salary)}
              expenses={formatCurrency(totalExpenses)}
              balance={formatCurrency(balance)}
            />
          </Box>
        </Grid>

        {/* Right: Expenses */}
        <Grid item xs={12} md={8}>
          <ExpenseForm email={email} onExpenseAdd={() => {}} />
          <Divider sx={{ my: 2 }} />
          <ExpenseList expenses={expenses} onDelete={() => {}} />
        </Grid>
      </Grid>

      {/* Expense Trends */}
      <Box sx={{ mt: 4 }}>
        <ExpenseTrends email={email} />
      </Box>

      {/* Downloads */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          📂 Download Reports
        </Typography>
        {[
          { label: "📄 CSV", format: "csv", color: "primary" },
          { label: "📊 Excel", format: "excel", color: "success" },
          { label: "📕 PDF", format: "pdf", color: "secondary" },
        ].map((btn) => (
          <Button
            key={btn.format}
            variant="contained"
            color={btn.color}
            sx={{ m: 1 }}
            onClick={() => handleDownload(btn.format)}
          >
            {btn.label}
          </Button>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="outlined" color="warning" onClick={resetAll}>
          🗑️ Clear All Data
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;