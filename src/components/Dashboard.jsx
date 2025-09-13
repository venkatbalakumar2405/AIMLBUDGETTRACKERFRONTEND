import React from "react";
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

function Dashboard({
  currentUser,
  salary,
  expenses,
  balance,
  formatCurrency,
  handleSalary,
  addExpense,
  updateExpense,
  deleteExpense,
  resetAll,
  logout,
}) {
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
          <ExpenseList expenses={expenses} onUpdate={updateExpense} onDelete={deleteExpense} />
        </Grid>
      </Grid>

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