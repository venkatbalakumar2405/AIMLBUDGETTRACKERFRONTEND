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
import Register from "./components/Register";

// Flask backend URL
const API_URL = "http://127.0.0.1:5000";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Theme setup
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

  // ✅ Load theme + session from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("currentUser");

    if (loggedIn && user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      fetchUserData(user);
    }
  }, []);

  // ✅ Fetch user + expenses
  const fetchUserData = async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/user/${email}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setSalary(data.salary || 0);
      setExpenses(data.expenses || []);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  // ✅ Salary update → backend
  const handleSalary = async (amount) => {
    const newSalary = Number(amount);
    setSalary(newSalary);
    try {
      await fetch(`${API_URL}/budget/salary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser, salary: newSalary }),
      });
    } catch (err) {
      console.error("Error updating salary:", err);
    }
  };

  // ✅ Add expense → backend
  const addExpense = async (expense) => {
    try {
      const res = await fetch(`${API_URL}/budget/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expense, email: currentUser }),
      });
      if (res.ok) fetchUserData(currentUser);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // ✅ Update expense → backend
  const updateExpense = async (id, updated) => {
    try {
      const res = await fetch(`${API_URL}/budget/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) fetchUserData(currentUser);
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  // ✅ Delete expense → backend
  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`${API_URL}/budget/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchUserData(currentUser);
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // ✅ Reset all → backend
  const resetAll = async () => {
    if (window.confirm("Clear all data?")) {
      try {
        await fetch(`${API_URL}/budget/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser }),
        });
        setSalary(0);
        setExpenses([]);
      } catch (err) {
        console.error("Error resetting data:", err);
      }
    }
  };

  // ✅ Logout
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("currentUser");
  };

  // ✅ Balance
  const balance = salary - expenses.reduce((a, e) => a + e.amount, 0);

  // ✅ Currency formatter
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
            setDarkMode(!darkMode);
            localStorage.setItem("darkMode", !darkMode);
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