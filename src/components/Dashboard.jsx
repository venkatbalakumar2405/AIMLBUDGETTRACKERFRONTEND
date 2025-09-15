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

function Dashboard({ currentUser, logout, formatCurrency }) {
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);

  const email = localStorage.getItem("email");

  // 🔄 Fetch user profile (salary + expenses)
  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/auth/user/${email}`);
      const data = await res.json();
      if (res.ok) {
        setSalary(data.salary);
        setExpenses(data.expenses);
        setBalance(data.salary - data.expenses.reduce((a, e) => a + e.amount, 0));
      } else {
        alert(data.error || "Failed to fetch profile");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 💵 Update salary
  const handleSalary = async (amount) => {
    const res = await fetch("http://127.0.0.1:5000/budget/salary", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, salary: amount }),
    });
    const data = await res.json();
    if (res.ok) {
      setSalary(amount);
      setBalance(amount - expenses.reduce((a, e) => a + e.amount, 0));
    } else {
      alert(data.error || "Failed to update salary");
    }
  };

  // ➕ Add expense
  const addExpense = async (expense) => {
    const res = await fetch("http://127.0.0.1:5000/budget/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...expense, email }),
    });
    const data = await res.json();
    if (res.ok) {
      fetchProfile(); // refresh after adding
    } else {
      alert(data.error || "Failed to add expense");
    }
  };

  // ❌ Delete expense
  const deleteExpense = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/budget/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      fetchProfile();
    } else {
      alert(data.error || "Failed to delete expense");
    }
  };

  // 🗑️ Reset all (salary + expenses)
  const resetAll = async () => {
    const res = await fetch("http://127.0.0.1:5000/budget/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      fetchProfile();
    } else {
      alert(data.error || "Failed to reset");
    }
  };

  // 📥 File downloads
  const handleDownload = async (format) => {
    const res = await fetch(
      `http://127.0.0.1:5000/budget/download-expenses-${format}?email=${email}`
    );

    if (!res.ok) {
      alert(`Failed to download ${format.toUpperCase()}`);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
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
              expenses={formatCurrency(
                expenses.reduce((a, e) => a + e.amount, 0)
              )}
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

      {/* 📊 Monthly Expenses Chart */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <ExpenseTrends />
      </Grid>

      {/* 📂 Report Downloads */}
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