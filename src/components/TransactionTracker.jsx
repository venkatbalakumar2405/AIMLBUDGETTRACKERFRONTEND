import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { getExpenses, addExpense } from "../api"; // backend endpoints

const categories = [
  "Fuel",
  "Shopping",
  "Travel",
  "Hotel",
  "Groceries",
  "Miscellaneous",
];

function TransactionTracker({ email }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New transaction form
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10), // default today
  });

  // Filters
  const [filters, setFilters] = useState({
    category: "All",
    from: "",
    to: "",
  });

  /** Fetch expenses from backend */
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses(email);
      setRecords(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch expenses:", err);
      setError("Failed to load records. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Handle new expense submission */
  const handleAddExpense = async () => {
    if (!form.amount || !form.category) {
      alert("Please enter amount and select category");
      return;
    }

    try {
      await addExpense(email, form);
      setForm({ amount: "", category: "", date: new Date().toISOString().slice(0, 10) });
      fetchExpenses();
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      alert("Failed to add expense");
    }
  };

  useEffect(() => {
    if (email) fetchExpenses();
  }, [email]);

  /** ================== FILTERING ================== */
  const applyFilters = (data) => {
    return data.filter((r) => {
      const recordDate = new Date(r.date);
      const fromDate = filters.from ? new Date(filters.from) : null;
      const toDate = filters.to ? new Date(filters.to) : null;

      // Category filter
      if (filters.category !== "All" && r.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (fromDate && recordDate < fromDate) return false;
      if (toDate && recordDate > toDate) return false;

      return true;
    });
  };

  const filteredRecords = applyFilters(records);

  /** ================== CALCULATIONS ================== */
  const totalSpent = filteredRecords.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  const byCategory = categories.map((c) => ({
    name: c,
    total: filteredRecords
      .filter((r) => (r.category || "Miscellaneous") === c)
      .reduce((sum, r) => sum + Number(r.amount || 0), 0),
  }));

  /** ================== RENDER ================== */
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Transaction Tracker
      </Typography>

      {/* Add New Expense */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add New Expense
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            type="number"
            label="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddExpense}>
            Add
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </Box>
      </Paper>

      {/* Expense Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell align="right"><b>Amount</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((row, index) => {
                const dateObj = new Date(row.date);
                const date = dateObj.toLocaleDateString();
                return (
                  <TableRow key={index}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{row.category || "Miscellaneous"}</TableCell>
                    <TableCell align="right">₹{row.amount}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="subtitle1"><b>Total Spent:</b> ₹{totalSpent}</Typography>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>By Category:</Typography>
        {byCategory.map((c) => (
          <Typography key={c.name} variant="body2">
            {c.name}: ₹{c.total}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}

export default TransactionTracker;