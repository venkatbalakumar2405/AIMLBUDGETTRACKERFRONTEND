import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { loginUser } from "../api"; // ✅ API call for login

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(email, password);

      // ✅ Save tokens + user info for session management
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      localStorage.setItem("user_email", res.email);

      alert("✅ Login successful!");
      if (onLogin) onLogin(true); // notify parent
    } catch (err) {
      console.error("❌ Login error:", err);
      alert(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        🔑 Login
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

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Paper>
  );
}

export default LoginForm;