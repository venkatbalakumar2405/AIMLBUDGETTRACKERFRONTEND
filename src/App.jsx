import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";

import {
  updateSalary as apiUpdateSalary,
  addExpense as apiAddExpense,
  getExpenses as apiGetExpenses,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
  resetAll as apiResetAll,
  updateBudget as apiUpdateBudget,
} from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [salary, setSalary] = useState(0);
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  // ✅ Snackbar state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

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

  /** ================== FETCH DATA ================== */
  const refreshUserData = useCallback(async (email) => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await apiGetExpenses(email);

      if (res.error === "Unauthorized") {
        logout();
        return;
      }

      setExpenses(res.expenses || []);
      setSalary(res.salary || 0);
      setBudget(res.budget || 0);
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
      showToast("✅ Salary updated successfully");
    } catch (err) {
      console.error("❌ Error updating salary:", err);
      showToast("❌ Failed to update salary", "error");
    }
  };

  /** ================== BUDGET ================== */
  const handleBudget = async (amount) => {
    const newBudget = Number(amount);
    setBudget(newBudget);
    try {
      await apiUpdateBudget(currentUser, newBudget);
      refreshUserData(currentUser);
      showToast("✅ Budget updated successfully");
    } catch (err) {
      console.error("❌ Error updating budget:", err);
      showToast("❌ Failed to update budget", "error");
    }
  };

  /** ================== EXPENSES ================== */
  const addExpense = async (expense) => {
    try {
      await apiAddExpense(currentUser, expense);
      refreshUserData(currentUser);
      showToast("✅ Expense added");
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      showToast("❌ Failed to add expense", "error");
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      await apiUpdateExpense(id, updatedExpense);
      refreshUserData(currentUser);
      showToast("✅ Expense updated");
    } catch (err) {
      console.error("❌ Error updating expense:", err);
      showToast("❌ Failed to update expense", "error");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      refreshUserData(currentUser);
      showToast("🗑️ Expense deleted");
    } catch (err) {
      console.error("❌ Error deleting expense:", err);
      showToast("❌ Failed to delete expense", "error");
    }
  };

  const resetAll = async () => {
    if (window.confirm("Clear all data?")) {
      try {
        await apiResetAll(currentUser);
        setSalary(0);
        setBudget(0);
        setExpenses([]);
        showToast("🗑️ All data cleared");
      } catch (err) {
        console.error("❌ Error resetting data:", err);
        showToast("❌ Failed to reset data", "error");
      }
    }
  };

  /** ================== AUTH ================== */
  const handleLogin = (email, rememberMe) => {
    setIsLoggedIn(true);
    setCurrentUser(email);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("currentUser", email);

    refreshUserData(email);
    showToast("✅ Login successful");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    showToast("👋 Logged out", "info");
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
          budget={budget}
          expenses={expenses}
          balance={balance}
          formatCurrency={formatCurrency}
          handleSalary={handleSalary}
          handleBudget={handleBudget}
          addExpense={addExpense}
          updateExpense={updateExpense}
          deleteExpense={deleteExpense}
          resetAll={resetAll}
          logout={logout}
          loading={loading}
        />
      )}

      {/* ✅ Global Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={handleToastClose}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
