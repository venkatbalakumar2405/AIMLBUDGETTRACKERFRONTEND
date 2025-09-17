import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

function Balance({ salary, budget, expenses, balance }) {
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);
  const [showNegativeBalance, setShowNegativeBalance] = useState(false);

  const budgetExceedsSalary = budget > salary;
  const balanceNegative = balance < 0;

  // Auto-show snackbar for budget warning
  useEffect(() => {
    if (budgetExceedsSalary) {
      setShowBudgetWarning(true);
    }
  }, [budgetExceedsSalary]);

  // Auto-show snackbar for negative balance
  useEffect(() => {
    if (balanceNegative) {
      setShowNegativeBalance(true);
    }
  }, [balanceNegative]);

  return (
    <>
      <Card elevation={3}>
        <CardContent>
          {/* Salary */}
          <Typography variant="subtitle1" color="primary">
            💼 Salary: {salary}
          </Typography>

          {/* Budget */}
          <Typography
            variant="subtitle1"
            color={budgetExceedsSalary ? "error" : "secondary"}
          >
            📊 Budget: {budget}
          </Typography>

          {/* Expenses */}
          <Typography variant="subtitle1" color="error">
            🛒 Total Expenses: {expenses}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* Balance */}
          <Typography
            variant="h6"
            color={balanceNegative ? "error" : "success.main"}
          >
            💵 Balance: {balance}
          </Typography>
        </CardContent>
      </Card>

      {/* Snackbar Warnings */}
      <Snackbar
        open={showBudgetWarning}
        autoHideDuration={5000}
        onClose={() => setShowBudgetWarning(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="warning"
          onClose={() => setShowBudgetWarning(false)}
          sx={{ width: "100%" }}
        >
          ⚠️ Your budget exceeds your salary! Please adjust.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showNegativeBalance}
        autoHideDuration={5000}
        onClose={() => setShowNegativeBalance(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="error"
          onClose={() => setShowNegativeBalance(false)}
          sx={{ width: "100%" }}
        >
          🚨 Your expenses are higher than your salary! Balance is negative.
        </Alert>
      </Snackbar>
    </>
  );
}

export default Balance;