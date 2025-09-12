import React, { useState } from "react";

function ExpenseList({ expenses, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount);
  };

  const saveEdit = (id) => {
    onUpdate(id, { name: editName, amount: Number(editAmount) });
    setEditingId(null);
  };

  return (
    <div className="list">
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            {editingId === expense.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
                <button onClick={() => saveEdit(expense.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{expense.name} - ${expense.amount}</span>
                <button onClick={() => startEditing(expense)}>Edit</button>
                <button onClick={() => onDelete(expense.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ExpenseList;
