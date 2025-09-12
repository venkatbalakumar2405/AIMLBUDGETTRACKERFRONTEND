import React, { useState } from "react";

function AuthForm({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // ✅ Signup flow
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.find((u) => u.email === email);

      if (userExists) {
        alert("User already exists! Please login.");
        setIsSignup(false);
        return;
      }

      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please login.");
      setIsSignup(false);
    } else {
      // ✅ Login flow
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const validUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (validUser) {
        onAuth(email);
      } else {
        alert("Invalid credentials!");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded"
          />

          {/* ✅ Show Confirm Password only in Signup */}
          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-2 border rounded"
            />
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? "Login here" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;