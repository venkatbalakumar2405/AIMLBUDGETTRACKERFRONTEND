import React from "react";
import { Box, Typography, Button, Paper, Grid, Divider } from "@mui/material";
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
}) {
  // 🔹 Download report
  const handleDownload = async (format) => {
    try {
      await downloadReport(currentUser, format);
    } catch (err) {
      console.error("❌ Error downloading report:", err);
      alert("Failed to download report.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔹 Header */}
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
          <Typography variant="subtitle1" sx={{ display: "inline", mr: 2 }}>
            👋 Welcome, <strong>{currentUser}</strong>
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            🚪 Logout
          </Button>
        </Box>
      </Paper>

      {/* 🔹 Main Content */}
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

      {/* 🔹 Expense Trends */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <ExpenseTrends email={currentUser} />
      </Grid>

      {/* 🔹 Downloads */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          📂 Download Reports
        </Typography>
        <Button
          variant="contained"
          sx={{ m: 1 }}
          onClick={() => handleDownload("csv")}
        >
          📄 CSV
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ m: 1 }}
          onClick={() => handleDownload("excel")}
        >
          📊 Excel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ m: 1 }}
          onClick={() => handleDownload("pdf")}
        >
          📕 PDF
        </Button>
      </Box>

      {/* 🔹 Footer */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="outlined" color="warning" onClick={resetAll}>
          🗑️ Clear All Data
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;
