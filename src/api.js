const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/** ================== UTILS ================== */
/** 🔹 Parse JSON safely */
async function parseJSON(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/** 🔹 Handle fetch responses */
async function handleResponse(res) {
  const data = await parseJSON(res);
  if (!res.ok) {
    const errorMsg =
      data.error || data.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }
  return data;
}

/** 🔹 Safe fetch wrapper with token support */
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

  profile: (email) => safeFetch(`${API_URL}/auth/user/${email}`),
};

/** ================== BUDGET ================== */
export const BudgetAPI = {
  getExpenses: (email) =>
    safeFetch(`${API_URL}/budget/expenses?email=${encodeURIComponent(email)}`),

  addExpense: (email, expense) =>
    safeFetch(`${API_URL}/budget/add`, {
      method: "POST",
      body: JSON.stringify({
        ...expense,
        email,
        amount: expense.amount ? String(expense.amount).trim() : null,
        date: expense.date || null,
      }),
    }),

  updateExpense: (id, expense) =>
    safeFetch(`${API_URL}/budget/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    }),

  deleteExpense: (id) =>
    safeFetch(`${API_URL}/budget/delete/${id}`, { method: "DELETE" }),

  updateSalary: (email, salary) =>
    safeFetch(`${API_URL}/budget/salary`, {
      method: "PUT",
      body: JSON.stringify({ email, salary }),
    }),

  updateBudget: (email, budget) =>
    safeFetch(`${API_URL}/budget/budget`, {
      method: "PUT",
      body: JSON.stringify({ email, budget }),
    }),

  resetAll: (email) =>
    safeFetch(`${API_URL}/budget/reset`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

/** ================== REPORTS ================== */
export const ReportAPI = {
  async download(email, format) {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API_URL}/budget/download-expenses-${format}?email=${encodeURIComponent(
          email
        )}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

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
  getTrends: (email) =>
    safeFetch(`${API_URL}/budget/trends?email=${encodeURIComponent(email)}`),

  getMonthlyTrends: (email) =>
    safeFetch(`${API_URL}/budget/monthly-trends?email=${encodeURIComponent(email)}`),
};