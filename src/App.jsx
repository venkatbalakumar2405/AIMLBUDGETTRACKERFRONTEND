import React, { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";
import  TransactionPage from "./components/TransactionPage";  
import MonthlyTrends from "./components/MonthlyTrends";
import ExpenseTrends from "./components/ExpenseTrends";
import TransactionTracker from "./components/TransactionTracker";

// ✅ Import API helpers
import {
  updateSalary as apiUpdateSalary,
  addExpense as apiAddExpense,
  getExpenses as apiGetExpenses,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
  resetAll as apiResetAll,
} from "./api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  /** ================== THEME ================== */
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#1976d2" },
          secondary: { main: "#9c27b0" },
        },
      }),
    [darkMode]
  );

  /** ================== SESSION & THEME LOAD ================== */
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkMode") === "true");

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("currentUser");

    if (loggedIn && user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      fetchUserData(user);
    }
  }, []);

  /** ================== FETCH EXPENSES ================== */
  const fetchUserData = async (email) => {
    try {
      const res = await apiGetExpenses(email);
      setExpenses(res.expenses || []);
      setSalary(res.salary || 0);
    } catch (err) {
      console.error("❌ Error fetching user data:", err);
    }
  };

  /** ================== SALARY ================== */
  const handleSalary = async (amount) => {
    const newSalary = Number(amount);
    setSalary(newSalary);
    try {
      await apiUpdateSalary(currentUser, newSalary);
    } catch (err) {
      console.error("❌ Error updating salary:", err);
      alert("Failed to update salary");
    }
  };

  /** ================== EXPENSES ================== */
  const addExpense = async (expense) => {
    try {
      await apiAddExpense(currentUser, expense);
      fetchUserData(currentUser);
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      alert("Failed to add expense");
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      await apiUpdateExpense(id, updatedExpense);
      fetchUserData(currentUser);
    } catch (err) {
      console.error("❌ Error updating expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      fetchUserData(currentUser);
    } catch (err) {
      console.error("❌ Error deleting expense:", err);
    }
  };

  const resetAll = async () => {
    if (window.confirm("Clear all data?")) {
      try {
        await apiResetAll(currentUser);
        setSalary(0);
        setExpenses([]);
      } catch (err) {
        console.error("❌ Error resetting data:", err);
      }
    }
  };

  /** ================== AUTH ================== */
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
  };

  /** ================== BALANCE ================== */
  const balance = salary - expenses.reduce((a, e) => a + e.amount, 0);

  /** ================== CURRENCY ================== */
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 🔘 Dark Mode Toggle */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <IconButton
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);
            localStorage.setItem("darkMode", newMode);
          }}
          color="inherit"
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </div>

      {!isLoggedIn ? (
        <AuthForm
          onLogin={(email) => {
            setIsLoggedIn(true);
            setCurrentUser(email);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("currentUser", email);
            fetchUserData(email);
          }}
        />
      ) : (
        <Dashboard
          currentUser={currentUser}
          salary={salary}
          expenses={expenses}
          balance={balance}
          formatCurrency={formatCurrency}
          handleSalary={handleSalary}
          addExpense={addExpense}
          updateExpense={updateExpense}
          deleteExpense={deleteExpense}
          resetAll={resetAll}
          logout={logout}
        />
      )}
    </ThemeProvider>
  );
}
