import React, { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { BudgetAPI } from "../api"; // ✅ use BudgetAPI

// ✅ Centralized categories (can later move to constants/config)
const categories = [
  "Fuel",
  "Petrol",
  "Travel",
  "Hotel",
  "Food",
  "Shopping",
  "Other",
];

function ExpenseForm({ email, onExpenseAdd, showToast }) {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await BudgetAPI.addExpense(email, {
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category,
      });

      onExpenseAdd(); // ✅ refresh parent list
      setExpense({ name: "", amount: "", category: "Other" });

      showToast?.("✅ Expense added successfully", "success");
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      showToast?.("❌ Failed to add expense", "error");
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

      <TextField
        select
        label="Category"
        value={expense.category}
        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Expense"}
      </Button>
    </Box>
  );
}

export default ExpenseForm;