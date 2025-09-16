const API_URL = "http://127.0.0.1:5000";

/** 🔹 Helper: handle fetch responses */
async function handleResponse(res) {
  const data = await res.json().catch(() => ({})); // fallback if no JSON
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

/** ================== AUTH ================== */

/** 🔹 Register user */
export async function registerUser(email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

/** 🔹 Login user */
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res); // { message, email }
}

/** 🔹 Get user profile (salary + expenses) */
export async function getProfile(email) {
  const res = await fetch(`${API_URL}/auth/user/${email}`);
  return handleResponse(res); // { email, salary, expenses: [...] }
}

/** ================== BUDGET ================== */

/** 🔹 Get only expenses */
export async function getExpenses(email) {
  const res = await fetch(`${API_URL}/budget/expenses?email=${email}`);
  return handleResponse(res); // { expenses: [...] }
}

/** 🔹 Add expense */
export async function addExpense(email, expense) {
  const res = await fetch(`${API_URL}/budget/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...expense, email }),
  });
  return handleResponse(res);
}

/** 🔹 Update expense */
export async function updateExpense(id, updatedExpense) {
  const res = await fetch(`${API_URL}/budget/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedExpense),
  });
  return handleResponse(res);
}

/** 🔹 Delete expense */
export async function deleteExpense(id) {
  const res = await fetch(`${API_URL}/budget/delete/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

/** 🔹 Update salary */
export async function updateSalary(email, salary) {
  const res = await fetch(`${API_URL}/budget/salary`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, salary }),
  });
  return handleResponse(res);
}

/** 🔹 Reset all (salary + expenses) */
export async function resetAll(email) {
  const res = await fetch(`${API_URL}/budget/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

/** 🔹 Download expense reports (CSV, PDF, Excel) */
export async function downloadReport(email, format) {
  const res = await fetch(
    `${API_URL}/budget/download-expenses-${format}?email=${email}`
  );
  if (!res.ok) throw new Error(`Failed to download ${format.toUpperCase()}`);

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses_${new Date().toISOString().slice(0, 10)}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** 🔹 Get monthly trends */
export async function getMonthlyTrends(email) {
  const res = await fetch(`${API_URL}/budget/monthly-trends?email=${email}`);
  return handleResponse(res); // { monthly_trends: [...] }
}

/** 🔹 Get daily expense trends (salary, expenses, savings) */
export async function getTrends(email) {
  const res = await fetch(`${API_URL}/budget/trends?email=${email}`);
  return handleResponse(res); // { salary, total_expenses, savings, expenses: [...] }
}