import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (email === "test@test.com" && password === "1234") {
      alert("✅ Login successful!");
      onLogin(true); // <-- This sets isAuthenticated = true in App.jsx
    } else {
      alert("❌ Invalid credentials!");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>🔑 Login</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;