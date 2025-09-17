import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { BudgetAPI } from "../api";

/** ================== CATEGORY OPTIONS ================== */
const CATEGORIES = [
  "Fuel",
  "Petrol",
  "Travel",
  "Hotel",
  "Food",
  "Shopping",
  "Other",
];

/** ================== EXPENSE LIST ================== */
function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    amount: "",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  /** 🔹 Start editing */
  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      name: expense.name,
      amount: expense.amount,
      category: expense.category || "Other",
    });
  };

  /** 🔹 Cancel editing */
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", amount: "", category: "Other" });
  };

  /** 🔹 Save changes */
  const saveEdit = async () => {
    if (!editData.name.trim() || Number(editData.amount) <= 0) {
      alert("⚠️ Please enter a valid expense name and amount");
      return;
    }

    try {
      setLoading(true);
      await BudgetAPI.updateExpense(editingId, {
        name: editData.name.trim(),
        amount: Number(editData.amount),
        category: editData.category,
      });

      onUpdate(editingId, {
        name: editData.name.trim(),
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

  /** 🔹 Delete expense */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      setLoading(true);
      await BudgetAPI.deleteExpense(id);
      onDelete(id);
    } catch (err) {
      console.error("❌ Error deleting expense:", err);
      alert(err.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Apply category filter */
  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  /** 🔹 Format date nicely */
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

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
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Expense list */}
      <List>
        {filteredExpenses.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 2, fontStyle: "italic" }}
          >
            No expenses found.
          </Typography>
        ) : (
          filteredExpenses.map((expense) => (
            <ListItem
              key={expense.id}
              secondaryAction={
                editingId === expense.id ? (
                  <>
                    <Tooltip title="Save">
                      <IconButton
                        edge="end"
                        onClick={saveEdit}
                        disabled={loading}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton edge="end" onClick={cancelEdit}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Edit">
                      <IconButton
                        edge="end"
                        onClick={() => startEdit(expense)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDelete(expense.id)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              ) : (
                <ListItemText
                  primary={`${expense.name} (${expense.category || "Other"})`}
                  secondary={`₹${expense.amount} • ${formatDate(expense.date)}`}
                />
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string,
      date: PropTypes.string, // ✅ ISO timestamp
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ExpenseList;