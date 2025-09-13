import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

function AuthForm({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      localStorage.setItem("user", JSON.stringify({ email, password }));
      alert("Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        onLogin(email);
      } else {
        alert("Invalid email or password.");
      }
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {isSignup && (
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          {isSignup ? "Sign Up" : "Login"}
        </Button>
      </Box>
      <Typography align="center">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button variant="text" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Login" : "Sign Up"}
        </Button>
      </Typography>
    </Paper>
  );
}

export default AuthForm;