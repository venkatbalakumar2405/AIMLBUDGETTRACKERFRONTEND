import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Link,
} from "@mui/material";

export default function AuthForm({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
      }
      localStorage.setItem("user", JSON.stringify({ email, password }));
      alert("✅ Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (
        storedUser &&
        storedUser.email === email &&
        storedUser.password === password
      ) {
        onLogin(email);
      } else {
        alert("❌ Invalid email or password.");
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isSignup ? "Create Account" : "Login"}
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
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            component="button"
            onClick={() => setIsSignup(!isSignup)}
            underline="hover"
          >
            {isSignup ? "Login" : "Sign Up"}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}