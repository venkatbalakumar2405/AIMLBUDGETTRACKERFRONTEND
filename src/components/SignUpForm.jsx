import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import API from "../api"; // axios instance (baseURL = http://127.0.0.1:5000)

function SignUpForm({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [salary, setSalary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        email,
        password,
        salary: parseFloat(salary) || 0,
      });

      alert(res.data.message || "Account created successfully!");
      onSignUp(); // redirect to login page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}>
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
        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
    </Paper>
  );
}

export default SignUpForm;