import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

function ExpenseForm({ onSubmit }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    // match backend: description + amount
    onSubmit({ description, amount: Number(amount) });

    // reset fields
    setDescription("");
    setAmount("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Expense Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" fullWidth>
        Add Expense
      </Button>
    </Box>
  );
}

export default ExpenseForm;