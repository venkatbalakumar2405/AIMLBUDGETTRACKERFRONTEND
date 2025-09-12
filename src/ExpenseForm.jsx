import React, { useState } from "react";

function ExpenseForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && amount > 0) {
      onSubmit({ name, amount: Number(amount) });
      setName("");
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Expense Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Amount:</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "5px" }}>₹</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;