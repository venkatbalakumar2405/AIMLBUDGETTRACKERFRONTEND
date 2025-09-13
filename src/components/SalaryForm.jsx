import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

function SalaryForm({ salary, onSubmit }) {
  const [amount, setAmount] = useState(salary);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(amount));
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
      />
      <Button type="submit" variant="contained" fullWidth>
        Save Salary
      </Button>
    </Box>
  );
}

export default SalaryForm; 