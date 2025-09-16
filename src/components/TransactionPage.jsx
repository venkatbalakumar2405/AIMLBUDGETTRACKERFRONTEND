import { useState } from "react";
import { Box, Button, TextField, MenuItem, Typography, Paper } from "@mui/material";
import { addExpense } from "../api";

const categories = ["Fuel", "Petrol", "Travel", "Hotel", "Food", "Shopping"];

export default function TransactionPage({ email, onExpenseAdded }) {
  const [form, setForm] = useState({ amount: "", category: "", description: "", date: "", time: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(email, form);
      setForm({ amount: "", category: "", description: "", date: "", time: "" });
      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>Record Expense</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <TextField label="Category" name="category" select value={form.category} onChange={handleChange} required>
          {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
        <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained">Add Expense</Button>
      </Box>
    </Paper>
  );
}
// Removed duplicate default export