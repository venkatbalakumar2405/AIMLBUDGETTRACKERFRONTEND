// src/components/BudgetForm.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";

export default function BudgetForm({ email, budget, onBudgetUpdate }) {
  const [value, setValue] = useState(budget || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onBudgetUpdate) return;
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      alert("Please enter a valid budget amount");
      return;
    }
    onBudgetUpdate(num);
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
        />
        <Button type="submit" variant="contained" color="secondary">
          Save
        </Button>
      </Box>
    </Paper>
  );
}