import React from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import { deleteExpense } from "../api";  // ✅ FIXED

function ExpenseList({ expenses, onDelete }) {
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      alert("Expense deleted!");
      onDelete();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete expense");
    }
  };

  return (
    <List>
      {expenses.map((expense) => (
        <ListItem
          key={expense.id}
          secondaryAction={
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(expense.id)}
            >
              Delete
            </Button>
          }
        >
          <ListItemText primary={expense.name} secondary={`₹${expense.amount}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default ExpenseList;