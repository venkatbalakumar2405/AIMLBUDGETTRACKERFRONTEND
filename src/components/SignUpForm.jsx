import React, { useState } from "react";

function SignUpForm({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("✅ Account created successfully!");
    onSignUp(); // After signup, go back to login
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>📝 Sign Up</h2>
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
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpForm;