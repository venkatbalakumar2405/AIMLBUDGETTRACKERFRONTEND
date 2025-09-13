import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      onLogin(true);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        🔑 Login
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
        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Paper>
  );
}

export default LoginForm;