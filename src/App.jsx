import React, { useState, useEffect } from "react";
import SalaryForm from "./components/SalaryForm.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Balance from "./components/Balance.jsx";
import AuthForm from "./components/AuthForm.jsx"; // ✅ New unified form
import { Button, Typography, Box, Paper } from "@mui/material";

function App() {
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Load user data
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (loggedIn === "true" && user && users[user]) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setSalary(users[user].salary || 0);
      setExpenses(users[user].expenses || []);
    }
  }, []);

  // ✅ Save user-specific data
  useEffect(() => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      users[currentUser] = {
        ...users[currentUser],
        salary,
        expenses,
      };
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [salary, expenses, currentUser]);

  // ✅ Handlers
  const handleSalary = (amount) => setSalary(Number(amount));
  const addExpense = (expense) =>
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  const updateExpense = (id, updatedExpense) =>
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
    );
  const deleteExpense = (id) =>
    setExpenses(expenses.filter((e) => e.id !== id));

  const resetAll = () => {
    if (window.confirm("Clear all data?")) {
      setSalary(0);
      setExpenses([]);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("currentUser");
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = salary - totalExpenses;

  // ✅ Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="app">
      {!isLoggedIn ? (
        <AuthForm
          onLogin={(email) => {
            setIsLoggedIn(true);
            setCurrentUser(email);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("currentUser", email);
          }}
        />
      ) : (
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
            <Typography variant="h4" gutterBottom>
              💰 Budget Tracker
            </Typography>
            <Typography variant="h6">👋 Welcome, {currentUser}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
              sx={{ mt: 2 }}
            >
              🚪 Logout
            </Button>
          </Paper>

          <SalaryForm salary={salary} onSubmit={handleSalary} />
          <ExpenseForm onSubmit={addExpense} />
          <ExpenseList
            expenses={expenses}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
          />
          <Balance
            salary={formatCurrency(salary)}
            expenses={formatCurrency(totalExpenses)}
            balance={formatCurrency(balance)}
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={resetAll}
              sx={{ mr: 2 }}
            >
              🗑️ Clear All Data
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default App;