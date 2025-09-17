import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { BudgetAPI } from "../api";  // ✅ use BudgetAPI

function ExpenseForm({ email, onExpenseAdd }) {
  const [expense, setExpense] = useState({ name: "", amount: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await BudgetAPI.addExpense(email, {
        name: expense.name,
        amount: Number(expense.amount),
      });
      onExpenseAdd();
      setExpense({ name: "", amount: "" });
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      alert(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Expense Name"
        value={expense.name}
        onChange={(e) => setExpense({ ...expense, name: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Amount"
        type="number"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </Button>
    </Box>
  );
}

export default ExpenseForm;