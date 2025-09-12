import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import App from "./App";

function MainApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleAuth = (email) => {
    setUser(email);
    localStorage.setItem("user", email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      {!user ? (
        <AuthForm onAuth={handleAuth} />
      ) : (
        <div>
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
            <h2 className="font-semibold">Welcome, {user}</h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Budget Tracker */}
          <App />
        </div>
      )}
    </>
  );
}

export default MainApp;