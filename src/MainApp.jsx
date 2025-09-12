import React, { useState, useEffect } from "react";
import Login from "./components/login";
import App from "./App"; // Budget Tracker

function MainApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (email) => {
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
        <Login onLogin={handleLogin} />
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

          {/* Budget App */}
          <App />
        </div>
      )}
    </>
  );
}

export default MainApp;