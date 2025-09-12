import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";

export default function ExpenseForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && amount > 0) {
      onSubmit({ name, amount: Number(amount) });
      setName("");
      setAmount("");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        ➕ Add Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Expense Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Amount (INR)"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Button variant="contained" color="success" fullWidth type="submit" sx={{ mt: 1 }}>
          Add Expense
        </Button>
      </form>
    </Paper>
  );
}
