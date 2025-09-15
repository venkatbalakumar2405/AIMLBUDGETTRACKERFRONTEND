const API_URL = "http://127.0.0.1:5000";

/** ✅ Get user profile (salary + expenses) */
export async function getProfile(email) {
  const res = await fetch(`${API_URL}/auth/user/${email}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
  return data; // { salary, expenses: [...] }
}

/** ✅ Update salary */
export async function updateSalary(email, salary) {
  const res = await fetch(`${API_URL}/budget/salary`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, salary }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update salary");
  return data;
}

/** ✅ Add expense */
export async function addExpense(email, expense) {
  const res = await fetch(`${API_URL}/budget/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...expense, email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add expense");
  return data;
}

/** ✅ Delete expense */
export async function deleteExpense(id) {
  const res = await fetch(`${API_URL}/budget/delete/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete expense");
  return data;
}

/** ✅ Reset all (salary + expenses) */
export async function resetAll(email) {
  const res = await fetch(`${API_URL}/budget/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to reset");
  return data;
}

/** ✅ Download reports */
export async function downloadReport(email, format) {
  const res = await fetch(
    `${API_URL}/budget/download-expenses-${format}?email=${email}`
  );
  if (!res.ok) throw new Error(`Failed to download ${format.toUpperCase()}`);

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}