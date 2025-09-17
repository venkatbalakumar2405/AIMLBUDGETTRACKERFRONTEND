import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { BudgetAPI } from "../api"; // ✅ use BudgetAPI

// Centralized categories
const categories = [
  "Fuel",
  "Petrol",
  "Travel",
  "Hotel",
  "Food",
  "Shopping",
  "Other",
];

function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", amount: "", category: "Other" });
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  /** Start editing */
  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      name: expense.name,
      amount: expense.amount,
      category: expense.category || "Other",
    });
  };

  /** Cancel edit */
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", amount: "", category: "Other" });
  };

  /** Save edit */
  const saveEdit = async () => {
    try {
      setLoading(true);
      await BudgetAPI.updateExpense(editingId, {
        name: editData.name,
        amount: Number(editData.amount),
        category: editData.category,
      });

      onUpdate(editingId, {
        name: editData.name,
        amount: Number(editData.amount),
        category: editData.category,
      });

      cancelEdit();
    } catch (err) {
      console.error("❌ Error updating expense:", err);
      alert(err.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  /** Delete expense */
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

  /** Apply category filter */
  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  return (
    <Box>
      {/* Category filter */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          select
          label="Filter by Category"
          size="small"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="All">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Expense list */}
      <List>
        {filteredExpenses.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            No expenses found.
          </Typography>
        ) : (
          filteredExpenses.map((expense) => (
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
                    label="Name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Amount"
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
                  <TextField
                    select
                    label="Category"
                    value={editData.category}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    sx={{ width: 150 }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              ) : (
                <ListItemText
                  primary={`${expense.name} (${expense.category || "Other"})`}
                  secondary={`₹${expense.amount}`}
                />
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

export default ExpenseList;
