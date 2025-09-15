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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Signup successful! Please log in.");
          setIsSignup(false);
        } else {
          alert(data.error || "Signup failed");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
      }
    } else {
      try {
        const res = await fetch("http://127.0.0.1:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token || ""); // store token if returned
          localStorage.setItem("email", email);
          onLogin(email);
        } else {
          alert(data.error || "Invalid email or password");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
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
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        {isSignup && (
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
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