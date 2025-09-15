import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { updateSalary } from "../api";  // ✅ FIXED

function SalaryForm({ email, salary, onSalaryUpdate }) {
  const [amount, setAmount] = useState(salary);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSalary(email, Number(amount));
      alert("Salary updated!");
      onSalaryUpdate(Number(amount));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update salary");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Set Salary"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        required
      />
      <Button type="submit" variant="contained" fullWidth>
        Save Salary
      </Button>
    </Box>
  );
}

export default SalaryForm;