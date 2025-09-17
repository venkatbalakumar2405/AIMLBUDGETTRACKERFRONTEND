import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { BudgetAPI } from "../api";

export default function BudgetForm({ email, budget, onBudgetUpdate, showToast }) {
  const [value, setValue] = useState(budget || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(value);

    if (isNaN(num) || num < 0) {
      showToast("⚠️ Please enter a valid budget amount", "warning");
      return;
    }

    try {
      setLoading(true);
      await BudgetAPI.updateBudget(email, num); // ✅ call backend
      if (onBudgetUpdate) onBudgetUpdate(num); // 🔄 update parent
      showToast("✅ Budget updated successfully");
    } catch (err) {
      console.error("❌ Error updating budget:", err);
      showToast("❌ Failed to update budget", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        📊 Set Monthly Budget
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, alignItems: "center" }}
      >
        <TextField
          label="Budget (₹)"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Paper>
  );
}
