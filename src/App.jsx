import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";

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

  // ✅ Load from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (loggedIn && user && users[user]) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setSalary(users[user].salary || 0);
      setExpenses(users[user].expenses || []);
    }
  }, []);

  // ✅ Save user data
  useEffect(() => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      users[currentUser] = { ...users[currentUser], salary, expenses };
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [salary, expenses, currentUser]);

  // ✅ Save theme choice
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ✅ Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  // Handlers
  const handleSalary = (amount) => setSalary(Number(amount));
  const addExpense = (expense) => setExpenses([...expenses, { ...expense, id: Date.now() }]);
  const updateExpense = (id, updated) =>
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  const deleteExpense = (id) => setExpenses(expenses.filter((e) => e.id !== id));
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

  const balance = salary - expenses.reduce((a, e) => a + e.amount, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
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
