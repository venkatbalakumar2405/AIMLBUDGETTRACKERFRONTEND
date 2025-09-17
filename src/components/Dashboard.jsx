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

function Dashboard({
  currentUser,
  salary,
  expenses,
  balance,
  formatCurrency,
  handleSalary,
  addExpense,
  updateExpense,
  deleteExpense,
  resetAll,
  logout,
  loading, // ✅ added
}) {
  // 🔹 Report download handler
  const handleDownload = async (format) => {
    try {
      await downloadReport(currentUser, format);
    } catch (err) {
      console.error("❌ Error downloading report:", err);
      alert("Failed to download report.");
    }
  };

  return (
    <Box sx={{ p: 3, position: "relative" }}>
      {/* ✅ Fullscreen overlay when loading */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.7)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Refreshing data...</Typography>
        </Box>
      )}

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
            👋 Welcome, <strong>{currentUser}</strong>
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
          <SalaryForm
            email={currentUser}
            salary={salary}
            onSalaryUpdate={handleSalary}
          />
          <Box sx={{ mt: 2 }}>
            <Balance
              salary={formatCurrency(salary)}
              expenses={formatCurrency(
                expenses.reduce((sum, e) => sum + e.amount, 0)
              )}
              balance={formatCurrency(balance)}
            />
          </Box>
        </Grid>

        {/* Right: Expenses */}
        <Grid item xs={12} md={8}>
          <ExpenseForm email={currentUser} onExpenseAdd={addExpense} />
          <Divider sx={{ my: 2 }} />
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </Grid>
      </Grid>

      {/* Expense Trends */}
      <Box sx={{ mt: 4 }}>
        <ExpenseTrends email={currentUser} />
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