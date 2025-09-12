import React, { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // toggle between login/signup

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ If user is signing up
    if (isSignUp) {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // check if email already exists
      if (users.find((u) => u.email === email)) {
        alert("User already exists! Please login.");
        setIsSignUp(false);
        return;
      }

      // save new user
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! You can now login.");
      setIsSignUp(false);
      setEmail("");
      setPassword("");
      return;
    }

    // ✅ If user is logging in
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      onLogin(email); // pass email to MainApp
    } else {
      alert("Invalid email or password. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💰</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isSignUp ? "Create Account" : "Budget Tracker Login"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isSignUp
              ? "Sign up to start managing your expenses"
              : "Login to continue"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Footer toggle */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;