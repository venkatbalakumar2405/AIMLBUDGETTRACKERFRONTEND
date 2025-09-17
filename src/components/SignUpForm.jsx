import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import API from "../api"; // axios instance

function SignUpForm({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Register user
      await API.post("/auth/register", {
        email,
        password,
        salary: parseFloat(salary) || 0,
        budget_limit: parseFloat(budgetLimit) || 0,
      });

      // Step 2: Auto-login immediately
      const loginRes = await API.post("/auth/login", { email, password });

      // Save tokens + session info
      localStorage.setItem("access_token", loginRes.data.access_token);
      localStorage.setItem("refresh_token", loginRes.data.refresh_token);
      localStorage.setItem("currentUser", loginRes.data.email);
      localStorage.setItem("isLoggedIn", "true");

      alert("✅ Account created & logged in successfully!");
      if (onSignUp) onSignUp(true); // redirect to dashboard
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, borderRadius: 2 }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        📝 Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Salary"
          type="number"
          fullWidth
          margin="normal"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />

        <TextField
          label="Budget Limit"
          type="number"
          fullWidth
          margin="normal"
          value={budgetLimit}
          onChange={(e) => setBudgetLimit(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Paper>
  );
}

export default SignUpForm;