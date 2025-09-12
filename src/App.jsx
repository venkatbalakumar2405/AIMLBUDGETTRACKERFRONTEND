import React, { useState } from "react";
import SalaryForm from "./components/SalaryForm.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Balance from "./components/Balance.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="auth-container">
          {/* Toggle Buttons */}
          <div className="auth-toggle">
            <button
              className={showLogin ? "active" : ""}
              onClick={() => setShowLogin(true)}
            >
              🔑 Login
            </button>
            <button
              className={!showLogin ? "active" : ""}
              onClick={() => setShowLogin(false)}
            >
              📝 Sign Up
            </button>
          </div>
          {/* Render Form */}
          {showLogin ? (
            <LoginForm onLogin={setIsAuthenticated} />
          ) : (
            <SignUpForm onSignUp={() => setShowLogin(true)} />
          )}
        </div>
      ) : (
        <div className="tracker-container">
          <h1>💰 Budget Tracker</h1>
          <SalaryForm />
          <ExpenseForm />
          <ExpenseList />
          <Balance />
        </div>
      )}
    </div>
  );
}

export default App;