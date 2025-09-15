import React, { useState } from "react";
import { registerUser } from "../api";  // ✅ import the named function

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await registerUser(email, password); // ✅ use your fetch wrapper
      alert(res.message || "Registration successful!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}