// src/api.js

// ✅ Use Render backend in production, fallback to local in dev
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://aimlbudgettracker.onrender.com" ||
  "http://127.0.0.1:5000";

/** ================== UTILS ================== */
async function parseJSON(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function handleResponse(res) {
  const data = await parseJSON(res);
  if (!res.ok) {
    const errorMsg =
      data.error || data.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }
  return data;
}

async function safeFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { ...options, headers });
    return await handleResponse(res);
  } catch (err) {
    console.error(`❌ Fetch failed: ${url}`, err);
    throw new Error(err.message || "Network request failed");
  }
}

/** ================== AUTH ================== */
export const AuthAPI = {
  register: (email, password) =>
    safeFetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    safeFetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  profile: (email) =>
    safeFetch(`${API_URL}/auth/user/${encodeURIComponent(email)}`),
};

/** ================== BUDGET + SALARY + EXPENSES ================== */
export const BudgetAPI = {
  /** 🔹 Salary */
  updateSalary: (email, amount) =>
    safeFetch(`${API_URL}/salaries`, {
      method: "POST",
      body: JSON.stringify({ email, amount }),
    }),

  /** 🔹 Budget */
  updateBudget: (email, amount) =>
    safeFetch(`${API_URL}/budget`, {
      method: "POST",
      body: JSON.stringify({ email, amount }),
    }),

  /** 🔹 Expenses */
  getExpenses: () => safeFetch(`${API_URL}/expenses`),

  addExpense: (email, expense) =>
    safeFetch(`${API_URL}/expenses`, {
      method: "POST",
      body: JSON.stringify({
        ...expense,
        amount: expense.amount
          ? parseFloat(expense.amount).toFixed(2)
          : null,
        date: expense.date || null,
      }),
    }),

  updateExpense: (id, expense) =>
    safeFetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    }),

  deleteExpense: (id) =>
    safeFetch(`${API_URL}/expenses/${id}`, { method: "DELETE" }),

  /** 🔹 Reset all */
  resetAll: (email) =>
    safeFetch(`${API_URL}/budget/reset`, { method: "DELETE" }),
};

/** ================== REPORTS ================== */
export const ReportAPI = {
  async download(format) {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/budget/download/${format}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`Failed to download ${format.toUpperCase()}`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const extMap = { csv: "csv", excel: "xlsx", pdf: "pdf" };
      const ext = extMap[format] || format;

      const a = document.createElement("a");
      a.href = url;
      a.download = `expenses_${new Date().toISOString().slice(0, 10)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("❌ Download error:", err);
      alert(err.message);
    }
  },
};

/** ================== TRENDS ================== */
export const TrendAPI = {
  getTrends: () => safeFetch(`${API_URL}/trends`),
  getMonthlyTrends: () => safeFetch(`${API_URL}/trends/monthly`),
};
