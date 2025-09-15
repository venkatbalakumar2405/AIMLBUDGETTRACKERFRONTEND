import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Grid, Divider } from "@mui/material";
import SalaryForm from "./SalaryForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Balance from "./Balance";
import ExpenseTrends from "./ExpenseTrends";

import { getProfile, updateSalary, addExpense, deleteExpense, resetAll, downloadReport } from "../api";  // ✅ FIXED

function Dashboard({ currentUser, logout, formatCurrency }) {
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);

  const email = localStorage.getItem("email");

  const fetchProfile = async () => {
    try {
      const data = await getProfile(email);
      setSalary(data.salary);
      setExpenses(data.expenses);
      setBalance(data.salary - data.expenses.reduce((a, e) => a + e.amount, 0));
    } catch (err) {
      console.error(err);
      alert("Server error while fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSalary = async (amount) => {
    try {
      await updateSalary(email, amount);
      setSalary(amount);
      setBalance(amount - expenses.reduce((a, e) => a + e.amount, 0));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      await addExpense(email, expense);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = async () => {
    try {
      await resetAll(email);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownload = async (format) => {
    try {
      await downloadReport(email, format);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
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
          <SalaryForm email={email} salary={salary} onSalaryUpdate={handleSalary} />
          <Box sx={{ mt: 2 }}>
            <Balance
              salary={formatCurrency(salary)}
              expenses={formatCurrency(expenses.reduce((a, e) => a + e.amount, 0))}
              balance={formatCurrency(balance)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <ExpenseForm email={email} onExpenseAdd={handleAddExpense} />
          <Divider sx={{ my: 2 }} />
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </Grid>
      </Grid>

      {/* Expense Trends */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <ExpenseTrends email={email} />
      </Grid>

      {/* Downloads */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" gutterBottom>📂 Download Reports</Typography>
        <Button variant="contained" sx={{ m: 1 }} onClick={() => handleDownload("csv")}>📄 CSV</Button>
        <Button variant="contained" color="success" sx={{ m: 1 }} onClick={() => handleDownload("excel")}>📊 Excel</Button>
        <Button variant="contained" color="secondary" sx={{ m: 1 }} onClick={() => handleDownload("pdf")}>📕 PDF</Button>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="outlined" color="warning" onClick={handleReset}>
          🗑️ Clear All Data
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;