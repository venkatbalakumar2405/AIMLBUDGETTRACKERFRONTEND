import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { BudgetAPI } from "../api"; // ✅ use BudgetAPI

function SalaryForm({ email, salary, onSalaryUpdate }) {
  const [amount, setAmount] = useState(salary || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    try {
      setLoading(true);
      await BudgetAPI.updateSalary(email, Number(amount));
      onSalaryUpdate(Number(amount)); // 🔄 update parent
    } catch (err) {
      console.error("❌ Error updating salary:", err);
      alert(err.message || "Failed to update salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Set Salary"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        required
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Salary"}
      </Button>
    </Box>
  );
}

export default SalaryForm;