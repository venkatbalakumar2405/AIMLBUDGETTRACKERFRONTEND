import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import API from "../api"; // axios instance

function SalaryForm({ email, salary, onSalaryUpdate }) {
  const [amount, setAmount] = useState(salary);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/auth/user/${email}/salary`, {
        salary: Number(amount),
      });

      alert(res.data.message || "Salary updated!");
      onSalaryUpdate(Number(amount)); // update parent state
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update salary");
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