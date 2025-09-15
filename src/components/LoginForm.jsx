import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import API from "../api"; // axios instance (baseURL = http://127.0.0.1:5000)

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      // Save user session in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", res.data.email);

      alert(res.data.message);
      onLogin(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
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
        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Paper>
  );
}

export default LoginForm;
