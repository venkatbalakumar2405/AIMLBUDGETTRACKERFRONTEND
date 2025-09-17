import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";

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
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true); // ✅ show spinner while restoring session

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

  /** ================== LOAD SESSION ================== */
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkMode") === "true");

    // ✅ Try restoring from localStorage first, then sessionStorage
    const email =
      localStorage.getItem("currentUser") ||
      sessionStorage.getItem("currentUser");

    if (email) {
      setIsLoggedIn(true);
      setCurrentUser(email);
      refreshUserData(email).finally(() => setBooting(false));
    } else {
      setBooting(false);
    }
  }, [refreshUserData]);

  /** ================== FETCH DATA ================== */
  const refreshUserData = useCallback(async (email) => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await apiGetExpenses(email);

      // ✅ if backend says unauthorized, force logout
      if (res.error === "Unauthorized") {
        logout();
        return;
      }

      setExpenses(res.expenses || []);
      setSalary(res.salary || 0);
    } catch (err) {
      console.error("❌ Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** ================== SALARY ================== */
  const handleSalary = async (amount) => {
    const newSalary = Number(amount);
    setSalary(newSalary);
    try {
      await apiUpdateSalary(currentUser, newSalary);
      refreshUserData(currentUser);
    } catch (err) {
      console.error("❌ Error updating salary:", err);
      alert("Failed to update salary");
    }
  };

  /** ================== EXPENSES ================== */
  const addExpense = async (expense) => {
    try {
      await apiAddExpense(currentUser, expense);
      refreshUserData(currentUser);
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      alert("Failed to add expense");
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      await apiUpdateExpense(id, updatedExpense);
      refreshUserData(currentUser);
    } catch (err) {
      console.error("❌ Error updating expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      refreshUserData(currentUser);
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
  const handleLogin = (email, rememberMe) => {
    setIsLoggedIn(true);
    setCurrentUser(email);

    // ✅ Store based on rememberMe flag
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("currentUser", email);

    refreshUserData(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
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

  /** ================== LOADING BOOT ================== */
  if (booting) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
        <AuthForm onLogin={handleLogin} />
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
          loading={loading}
        />
      )}
    </ThemeProvider>
  );
}