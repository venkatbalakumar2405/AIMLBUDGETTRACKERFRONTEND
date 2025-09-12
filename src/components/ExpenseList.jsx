import React, { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";

export default function ExpenseList({ expenses, onUpdate, onDelete }) {
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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📋 Expense List
      </Typography>
      {expenses.length === 0 ? (
        <Typography variant="body2">No expenses added yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Amount (INR)</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {editingId === expense.id ? (
                    <TextField
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size="small"
                    />
                  ) : (
                    expense.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <TextField
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      size="small"
                    />
                  ) : (
                    `₹${expense.amount}`
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingId === expense.id ? (
                    <>
                      <IconButton color="success" onClick={() => saveEdit(expense.id)}>
                        <Save />
                      </IconButton>
                      <IconButton color="error" onClick={() => setEditingId(null)}>
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton color="primary" onClick={() => startEditing(expense)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete(expense.id)}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}