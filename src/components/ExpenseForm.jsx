import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { BudgetAPI } from "../api"; // ✅ use BudgetAPI

/** ================== CATEGORY OPTIONS ================== */
const CATEGORIES = [
  "Fuel",
  "Petrol",
  "Travel",
  "Hotel",
  "Food",
  "Shopping",
  "Other",
];

/** ================== EXPENSE FORM ================== */
function ExpenseForm({ email, onExpenseAdd, showToast }) {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    category: "Other",
    dateTime: new Date().toISOString().slice(0, 16), // ✅ default to now
  });
  const [loading, setLoading] = useState(false);

  /** 🔹 Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Handle form submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expense.name.trim() || Number(expense.amount) <= 0) {
      showToast?.("⚠️ Please enter a valid expense name and amount", "warning");
      return;
    }

    try {
      setLoading(true);

      await BudgetAPI.addExpense(email, {
        name: expense.name.trim(),
        amount: Number(expense.amount),
        category: expense.category,
        createdAt: new Date(expense.dateTime).toISOString(), // ✅ save timestamp
      });

      onExpenseAdd(); // refresh parent list

      // Reset form
      setExpense({
        name: "",
        amount: "",
        category: "Other",
        dateTime: new Date().toISOString().slice(0, 16),
      });

      showToast?.("✅ Expense added successfully", "success");
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      showToast?.("❌ Failed to add expense", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      {/* Expense Name */}
      <TextField
        name="name"
        label="Expense Name"
        value={expense.name}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        required
      />

      {/* Amount */}
      <TextField
        name="amount"
        label="Amount"
        type="number"
        inputProps={{ min: "1", step: "0.01" }}
        value={expense.amount}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        required
      />

      {/* Category */}
      <TextField
        select
        name="category"
        label="Category"
        value={expense.category}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        {CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      {/* Date & Time */}
      <TextField
        name="dateTime"
        label="Date & Time"
        type="datetime-local"
        value={expense.dateTime}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ py: 1.2, fontWeight: 600 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Expense"}
      </Button>
    </Box>
  );
}

ExpenseForm.propTypes = {
  email: PropTypes.string.isRequired,
  onExpenseAdd: PropTypes.func.isRequired,
  showToast: PropTypes.func,
};

export default ExpenseForm;