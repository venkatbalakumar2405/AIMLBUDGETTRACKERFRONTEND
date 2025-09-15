import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { addExpense } from "../api";  // ✅ FIXED

function ExpenseForm({ email, onExpenseAdd }) {
  const [expense, setExpense] = useState({ name: "", amount: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(email, { 
        name: expense.name, 
        amount: Number(expense.amount) 
      });
      alert("Expense added!");
      onExpenseAdd();
      setExpense({ name: "", amount: "" });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add expense");
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
      <Button type="submit" variant="contained" fullWidth>
        Add Expense
      </Button>
    </Box>
  );
}

export default ExpenseForm;