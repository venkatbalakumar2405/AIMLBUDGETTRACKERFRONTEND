// src/components/LoginForm.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../api"; // ✅ API call for login

function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(credentials.email, credentials.password);

      // ✅ Choose storage based on "Remember Me"
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", res.access_token);
      storage.setItem("refresh_token", res.refresh_token);
      storage.setItem("user_email", res.email);

      if (onLogin) onLogin(true); // notify parent
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please try again.");
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={credentials.email}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={handleChange}
          disabled={loading}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* ✅ Remember Me */}
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
          }
          label="Remember Me"
          sx={{ mt: 1 }}
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
      </Box>
    </Paper>
  );
}

export default LoginForm;