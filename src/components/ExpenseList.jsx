import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { BudgetAPI } from "../api"; // ✅ use BudgetAPI

function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", amount: "" });
  const [loading, setLoading] = useState(false);

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({ name: expense.name, amount: expense.amount });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", amount: "" });
  };

  const saveEdit = async () => {
    try {
      setLoading(true);
      await BudgetAPI.updateExpense(editingId, {
        name: editData.name,
        amount: Number(editData.amount),
      });
      onUpdate(editingId, {
        name: editData.name,
        amount: Number(editData.amount),
      });
      cancelEdit();
    } catch (err) {
      console.error("❌ Error updating expense:", err);
      alert(err.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await BudgetAPI.deleteExpense(id);
      onDelete(id);
    } catch (err) {
      console.error("❌ Error deleting expense:", err);
      alert(err.message || "Failed to delete expense");
    }
  };

  return (
    <Box>
      <List>
        {expenses.map((expense) => (
          <ListItem
            key={expense.id}
            secondaryAction={
              editingId === expense.id ? (
                <>
                  <IconButton edge="end" onClick={saveEdit} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={cancelEdit}>
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton edge="end" onClick={() => startEdit(expense)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
          >
            {editingId === expense.id ? (
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <TextField
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  type="number"
                  value={editData.amount}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  sx={{ width: 100 }}
                />
              </Box>
            ) : (
              <ListItemText
                primary={expense.name}
                secondary={`₹${expense.amount}`}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ExpenseList;