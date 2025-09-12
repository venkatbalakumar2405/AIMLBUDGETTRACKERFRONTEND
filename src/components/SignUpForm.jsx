import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function SignUpForm({ onSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      alert("User already exists!");
      return;
    }
    users[username] = { password, salary: 0, expenses: [] };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully! Please login.");
    onSignUp();
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        📝 Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
