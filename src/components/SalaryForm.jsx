import React, { useState } from "react";

function SalaryForm({ salary, onSubmit }) {
  const [amount, setAmount] = useState(salary);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0) {
      onSubmit(amount);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Set Salary:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default SalaryForm;