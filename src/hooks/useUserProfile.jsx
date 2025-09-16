import { useEffect, useState } from "react";

// ✅ API base URL from Vite env
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("currentUser");
      const token = localStorage.getItem("token");

      if (!email || !token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/user/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ JWT token
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Session expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
          } else {
            setError(`Error ${res.status}: Failed to fetch profile`);
          }
          setLoading(false);
          return;
        }

        const result = await res.json();
        setProfile(result);
        setError(null);
      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error }; // ✅ Always consistent
}