import React from "react";

function Balance({ salary, expenses, balance }) {
  return (
    <div className="balance">
      <h2>Summary</h2>
      <p>💵 Salary: ${salary}</p>
      <p>💸 Total Expenses: ${expenses}</p>
      <p>
        {balance >= 0 ? "✅ Balance" : "❌ Over Budget"}: ${balance}
      </p>
    </div>
  );
}

export default Balance;