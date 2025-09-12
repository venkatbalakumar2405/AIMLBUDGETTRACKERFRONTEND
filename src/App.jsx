import React, { useState, useEffect } from "react";
import SalaryForm from "./components/SalaryForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Balance from "./Balance";

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

  // Load from localStorage
  useEffect(() => {
    const savedSalary = localStorage.getItem("salary");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedSalary) setSalary(Number(savedSalary));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save salary
  useEffect(() => {
    localStorage.setItem("salary", salary);
  }, [salary]);

  // Save expenses
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Add or update salary
  const handleSalary = (amount) => {
    setSalary(Number(amount));
  };

  // Add new expense
  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  // Update expense
  const updateExpense = (id, updatedExpense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // 🔹 Clear all data
  const resetAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      localStorage.removeItem("salary");
      localStorage.removeItem("expenses");
      setSalary(0);
      setExpenses([]);
    }
  };

  // 🔹 Export data to CSV with INR
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

      {/* ✅ Show formatted INR values */}
      <Balance
        salary={formatCurrency(salary)}
        expenses={formatCurrency(totalExpenses)}
        balance={formatCurrency(balance)}
      />

      {/* 🔹 Action Buttons */}
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