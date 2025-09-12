import React, { useState, useEffect } from "react";
import SalaryForm from "./components/SalaryForm.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Balance from "./components/Balance.jsx";

function App() {
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);

  // ✅ Currency formatter (INR)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Load saved data
  useEffect(() => {
    const savedSalary = localStorage.getItem("salary");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedSalary) setSalary(Number(savedSalary));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("salary", salary);
  }, [salary]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Salary handler
  const handleSalary = (amount) => setSalary(Number(amount));

  // Expense handlers
  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Reset all
  const resetAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      localStorage.removeItem("salary");
      localStorage.removeItem("expenses");
      setSalary(0);
      setExpenses([]);
    }
  };

  // Export CSV
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Salary,${salary} (INR)\n\n`;
    csvContent += "Expense Name,Amount (INR)\n";

    expenses.forEach((exp) => {
      csvContent += `${exp.name},${exp.amount}\n`;
    });

    csvContent += `\nTotal Expenses,${totalExpenses}\nBalance,${balance}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_tracker_inr.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = salary - totalExpenses;

  return (
    <div className="app">
      <h1>💰 Budget Tracker</h1>
      <SalaryForm salary={salary} onSubmit={handleSalary} />
      <ExpenseForm onSubmit={addExpense} />
      <ExpenseList
        expenses={expenses}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />

      {/* ✅ Pass formatted INR values */}
      <Balance
        salary={formatCurrency(salary)}
        expenses={formatCurrency(totalExpenses)}
        balance={formatCurrency(balance)}
      />

      {/* Action Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="reset-btn" onClick={resetAll}>
          🗑️ Clear All Data
        </button>
        <button className="download-btn" onClick={downloadCSV}>
          📥 Download CSV
        </button>
      </div>
    </div>
  );
}

export default App;