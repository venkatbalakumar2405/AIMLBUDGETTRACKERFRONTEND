function Balance({ salary, expenses, balance }) {
  return (
    <div className="summary">
      <h2>Summary</h2>
      <p>💼 Salary: {salary}</p>
      <p>🛒 Total Expenses: {expenses}</p>
      <p>✅ Balance: {balance}</p>
    </div>
  );
}

export default Balance;