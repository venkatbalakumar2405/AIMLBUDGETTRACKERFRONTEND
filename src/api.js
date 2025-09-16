// ✅ Dynamically use API URL from Vite env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** 🔹 Handle fetch responses */
async function handleResponse(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    // If backend sends no JSON (like file downloads), fallback to {}
  }

  if (!res.ok) {
    const errorMsg =
      data.error || data.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }
  return data;
}

/** 🔹 Safe fetch wrapper */
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    return await handleResponse(res);
  } catch (err) {
    console.error(`❌ Fetch failed: ${url}`, err);
    throw new Error(err.message || "Network request failed");
  }
}

/** ================== AUTH ================== */
export function registerUser(email, password) {
  return safeFetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function loginUser(email, password) {
  return safeFetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function getProfile(email) {
  return safeFetch(`${API_URL}/auth/user/${email}`);
}

/** ================== BUDGET ================== */
export function getExpenses(email) {
  return safeFetch(`${API_URL}/budget/expenses?email=${email}`);
}

export function addExpense(email, expense) {
  const payload = {
    ...expense,
    email,
    amount: expense.amount ? String(expense.amount).trim() : null,
    date: expense.date || null,
  };

  return safeFetch(`${API_URL}/budget/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateExpense(id, updatedExpense) {
  return safeFetch(`${API_URL}/budget/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedExpense),
  });
}

export function deleteExpense(id) {
  return safeFetch(`${API_URL}/budget/delete/${id}`, {
    method: "DELETE",
  });
}

export function updateSalary(email, salary) {
  return safeFetch(`${API_URL}/budget/salary`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, salary }),
  });
}

export function resetAll(email) {
  return safeFetch(`${API_URL}/budget/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

/** ================== REPORTS ================== */
export async function downloadReport(email, format) {
  try {
    const res = await fetch(
      `${API_URL}/budget/download-expenses-${format}?email=${email}`
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
}

/** ================== TRENDS ================== */
export function getMonthlyTrends(email) {
  return safeFetch(`${API_URL}/budget/monthly-trends?email=${email}`);
}

export function getTrends(email) {
  return safeFetch(`${API_URL}/budget/trends?email=${email}`);
}