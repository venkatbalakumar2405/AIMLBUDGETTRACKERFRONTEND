import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

function AuthForm({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (isSignup) {
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match!" });
        setLoading(false);
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
          setMessage({ type: "success", text: "Signup successful! Please log in." });
          setIsSignup(false);
        } else {
          setMessage({ type: "error", text: data.error || "Signup failed" });
        }
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Error connecting to server." });
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
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          localStorage.setItem("currentUser", email);
          onLogin(email);
          setMessage({ type: "success", text: "Login successful!" });
        } else {
          setMessage({ type: "error", text: data.error || "Invalid email or password" });
        }
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Error connecting to server." });
      }
    }

    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
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