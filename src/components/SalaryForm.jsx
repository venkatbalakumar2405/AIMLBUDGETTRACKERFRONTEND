import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";

export default function SalaryForm({ salary, onSubmit }) {
  const [amount, setAmount] = useState(salary || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        💵 Set Your Salary
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Monthly Salary (INR)"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
        <Button variant="contained" fullWidth type="submit" sx={{ mt: 1 }}>
          Save Salary
        </Button>
      </form>
    </Paper>
  );
}
