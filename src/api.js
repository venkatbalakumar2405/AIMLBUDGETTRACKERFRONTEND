const API_URL = "http://127.0.0.1:5000"; // Flask backend

// 🔑 AUTH API
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function getUser(email) {
  const res = await fetch(`${API_URL}/auth/user/${email}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// 💵 SALARY
export async function updateSalary(email, salary) {
  const res = await fetch(`${API_URL}/budget/salary`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, salary }),
  });
  if (!res.ok) throw new Error("Failed to update salary");
  return res.json();
}

// 💸 EXPENSES
export async function addExpense(email, amount, description) {
  const res = await fetch(`${API_URL}/budget/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount, description }),
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}

export async function getExpenses(email) {
  const res = await fetch(`${API_URL}/budget/all/${email}`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function updateExpense(id, updatedData) {
  const res = await fetch(`${API_URL}/budget/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_URL}/budget/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

// 🗑️ RESET DATA
export async function resetAll(email) {
  const res = await fetch(`${API_URL}/budget/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to reset data");
  return res.json();
}

// 📊 DOWNLOAD REPORTS
export async function downloadReport(format, email) {
  const res = await fetch(`${API_URL}/budget/download-expenses-${format}?email=${email}`);
  if (!res.ok) throw new Error(`Failed to download ${format}`);

  // Return file blob
  return res.blob();
}