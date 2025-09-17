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

/** ================== EXPENSE CATEGORIES ================== */
const CATEGORIES = [
  // Essential Needs
  "Groceries",
  "Utilities (Electricity, Water, Gas)",
  "Rent / Mortgage",
  "Transportation (Bus, Metro, Taxi, Car Maintenance)",

  // Lifestyle
  "Dining Out",
  "Entertainment (Movies, Subscriptions, Netflix, Spotify)",
  "Clothing",
  "Personal Care (Salon, Gym, Wellness)",

  // Financial
  "Savings / Investments",
  "Insurance",
  "Loan / EMI Payments",
  "Credit Card Payments",

  // Health & Education
  "Healthcare (Medicines, Doctor visits)",
  "Education (Courses, Books, School Fees)",

  // Miscellaneous
  "Gifts & Donations",
  "Emergency / Unexpected",
  "Other",
];

/** ================== EXPENSE FORM ================== */
function ExpenseForm({ email, onExpenseAdd, showToast }) {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);

  /** 🔹 Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Handle submit */
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
      });
      onExpenseAdd();
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <TextField
        name="name"
        label="Expense Name"
        value={expense.name}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
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