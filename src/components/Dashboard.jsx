import React, { useState, memo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import SalaryForm from "./SalaryForm";
import BudgetForm from "./BudgetForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Balance from "./Balance";
import ExpenseTrends from "./ExpenseTrends";
import { ReportAPI } from "../api"; // ✅ use ReportAPI

/** ================== LOADING OVERLAY ================== */
const LoadingOverlay = ({ message = "Refreshing data..." }) => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      bgcolor: "rgba(255,255,255,0.7)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>{message}</Typography>
  </Box>
);

/** ================== HEADER ================== */
const Header = ({ currentUser, onLogout }) => (
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
      <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
        👋 Welcome, <strong>{currentUser}</strong>
      </Typography>
      <Button variant="contained" color="error" onClick={onLogout}>
        🚪 Logout
      </Button>
    </Box>
  </Paper>
);

/** ================== REPORT DOWNLOADS ================== */
const Reports = ({ onDownload }) => (
  <Box sx={{ textAlign: "center", mt: 3 }}>
    <Typography variant="h6" gutterBottom>
      📂 Download Reports
    </Typography>
    {[
      { label: "📄 CSV", format: "csv", color: "primary" },
      { label: "📊 Excel", format: "excel", color: "success" },
      { label: "📕 PDF", format: "pdf", color: "secondary" },
    ].map((btn) => (
      <Button
        key={btn.format}
        variant="contained"
        color={btn.color}
        sx={{ m: 1 }}
        onClick={() => onDownload(btn.format)}
      >
        {btn.label}
      </Button>
    ))}
  </Box>
);

/** ================== DASHBOARD ================== */
function Dashboard({
  currentUser,
  salary,
  budget,
  expenses,
  balance,
  formatCurrency,
  handleSalary,
  handleBudget,
  addExpense,
  updateExpense,
  deleteExpense,
  resetAll,
  logout,
  loading,
  showToast, // ✅ inject from App.jsx
}) {
  const [error, setError] = useState("");

  // 🔹 Report download handler
  const handleDownload = async (format) => {
    try {
      setError("");
      await ReportAPI.download(currentUser, format);
    } catch (err) {
      console.error("❌ Error downloading report:", err);
      setError(`Failed to download ${format.toUpperCase()} report`);
    }
  };

  return (
    <Box sx={{ p: 3, position: "relative" }}>
      {loading && <LoadingOverlay />}

      <Header currentUser={currentUser} onLogout={logout} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left: Salary + Budget + Balance */}
        <Grid item xs={12} md={4}>
          <SalaryForm
            email={currentUser}
            salary={salary}
            onSalaryUpdate={handleSalary}
            showToast={showToast} // ✅ added
          />

          <Box sx={{ mt: 2 }}>
            <BudgetForm
              email={currentUser}
              budget={budget}
              onBudgetUpdate={handleBudget}
              showToast={showToast} // ✅ added
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Balance
              salary={formatCurrency(salary)}
              budget={formatCurrency(budget)}
              expenses={formatCurrency(
                expenses.reduce((sum, e) => sum + e.amount, 0)
              )}
              balance={formatCurrency(balance)}
            />
          </Box>
        </Grid>

        {/* Right: Expenses */}
        <Grid item xs={12} md={8}>
          <ExpenseForm
            email={currentUser}
            onExpenseAdd={addExpense}
            showToast={showToast} // ✅ added
          />
          <Divider sx={{ my: 2 }} />
          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
            onUpdate={updateExpense}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <ExpenseTrends email={currentUser} />
      </Box>

      <Reports onDownload={handleDownload} />

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="outlined" color="warning" onClick={resetAll}>
          🗑️ Clear All Data
        </Button>
      </Box>
    </Box>
  );
}

export default memo(Dashboard);