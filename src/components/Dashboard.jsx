import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
} from "@mui/material";

import SalaryForm from "./SalaryForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Balance from "./Balance";
import ExpenseTrends from "./ExpenseTrends";

// ✅ Import API helpers
import {
  getExpenses,
  updateSalary,
  addExpense as apiAddExpense,
  deleteExpense as apiDeleteExpense,
  resetAll as apiResetAll,
  downloadReport,
} from "../api";

function Dashboard({ currentUser, logout, formatCurrency }) {
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);

  // 🔄 Fetch profile data (salary + expenses)
  const fetchProfile = async () => {
    try {
      const res = await getExpenses(currentUser);
      const salaryFromDB = res.salary || 0;
      const expensesFromDB = res.data || [];

      setSalary(salaryFromDB);
      setExpenses(expensesFromDB);
      setBalance(
        salaryFromDB - expensesFromDB.reduce((a, e) => a + e.amount, 0)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to fetch profile");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  // 💵 Update salary
  const handleSalary = async (amount) => {
    try {
      await updateSalary(currentUser, amount);
      setSalary(amount);
      setBalance(amount - expenses.reduce((a, e) => a + e.amount, 0));
    } catch (err) {
      console.error(err);
      alert("Failed to update salary");
    }
  };

  // ➕ Add expense
  const addExpense = async (expense) => {
    try {
      await apiAddExpense(currentUser, expense.amount, expense.description);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  // ❌ Delete expense
  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  // 🗑️ Reset all
  const resetAll = async () => {
    try {
      await apiResetAll(currentUser);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to reset data");
    }
  };

  // 📥 File downloads
  const handleDownload = async (format) => {
    try {
      const blob = await downloadReport(format, currentUser);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expenses.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert(`Failed to download ${format.toUpperCase()}`);
    }
  };

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
          <Typography variant="subtitle1" sx={{ display: "inline", mr: 2 }}>
            👋 Welcome, <strong>{currentUser}</strong>
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            🚪 Logout
          </Button>
        </Box>
      </Paper>

      {/* Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SalaryForm salary={salary} onSubmit={handleSalary} />
          <Box sx={{ mt: 2 }}>
            <Balance
              salary={formatCurrency(salary)}
              expenses={formatCurrency(expenses.reduce((a, e) => a + e.amount, 0))}
              balance={formatCurrency(balance)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <ExpenseForm onSubmit={addExpense} />
          <Divider sx={{ my: 2 }} />
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </Grid>
      </Grid>

      {/* 📊 Trends */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <ExpenseTrends />
      </Grid>

      {/* 📂 Downloads */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          📂 Download Reports
        </Typography>
        <Button
          variant="contained"
          color="primary"
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