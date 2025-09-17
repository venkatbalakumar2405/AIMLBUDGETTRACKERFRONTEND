import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

// 🎨 Category colors
const COLORS = [
  "#1976d2",
  "#9c27b0",
  "#f44336",
  "#ff9800",
  "#4caf50",
  "#00bcd4",
  "#795548",
];

const categories = [
  "Fuel",
  "Petrol",
  "Travel",
  "Hotel",
  "Food",
  "Shopping",
  "Other",
];

function Balance({ salary, budget, expenses, balance, expenseList }) {
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);
  const [showNegativeBalance, setShowNegativeBalance] = useState(false);

  // 🔹 Hover + Click states
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const budgetExceedsSalary = budget > salary;
  const balanceNegative = balance < 0;

  // 🔹 Category totals
  const categoryTotals = categories.map((cat) => ({
    name: cat,
    value: expenseList
      .filter((e) => (e.category || "Other") === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  // 🔹 Auto-show/hide warnings
  useEffect(() => setShowBudgetWarning(budgetExceedsSalary), [budgetExceedsSalary]);
  useEffect(() => setShowNegativeBalance(balanceNegative), [balanceNegative]);

  // 🔹 Active index = hover has priority, otherwise selected
  const activeIndex = hoverIndex !== null ? hoverIndex : selectedIndex;

  // 🔹 Handle selection toggle
  const handleSelect = (index) => {
    if (selectedIndex === index) {
      setDrawerOpen(false);
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
      setDrawerOpen(true);
    }
  };

  // 🔹 Detail panel data
  const selectedCategory = selectedIndex !== null ? categoryTotals[selectedIndex] : null;
  const expenseTotal = expenses || 1; // avoid division by zero

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
        }}
        whileTap={{ scale: 0.98 }}
        style={{ borderRadius: "16px" }}
      >
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💹 Balance Summary
            </Typography>

            {/* Salary */}
            <Typography variant="subtitle1" color="primary">
              💼 Salary: ₹
              <CountUp end={salary} duration={1} separator="," />
            </Typography>

            {/* Budget */}
            <Typography
              variant="subtitle1"
              color={budgetExceedsSalary ? "error" : "secondary"}
            >
              📊 Budget: ₹
              <CountUp end={budget} duration={1} separator="," />
            </Typography>

            {/* Expenses */}
            <Typography variant="subtitle1" color="error">
              🛒 Total Expenses: ₹
              <CountUp end={expenses} duration={1} separator="," />
            </Typography>

            <Divider sx={{ my: 1 }} />

            {/* Balance */}
            <Typography
              variant="h6"
              color={balanceNegative ? "error" : "success"}
              gutterBottom
            >
              💵 Balance: ₹
              <CountUp end={balance} duration={1.2} separator="," />
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Category Breakdown */}
            <Typography variant="subtitle1" gutterBottom>
              📂 Category-wise Expenses
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {/* Animated List */}
              <List dense sx={{ flex: 1 }}>
                <AnimatePresence>
                  {categoryTotals.map(
                    (cat, i) =>
                      cat.value > 0 && (
                        <motion.div
                          key={cat.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <ListItem
                            sx={{
                              py: 0.5,
                              px: 1,
                              borderRadius: 1,
                              cursor: "pointer",
                              bgcolor:
                                activeIndex === i
                                  ? "rgba(25, 118, 210, 0.1)"
                                  : "transparent",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.08)",
                              },
                              border:
                                selectedIndex === i
                                  ? "2px solid #1976d2"
                                  : "2px solid transparent",
                            }}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={() => handleSelect(i)}
                          >
                            <ListItemText
                              primary={`${cat.name}: ₹${cat.value}`}
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                fontWeight:
                                  activeIndex === i || selectedIndex === i
                                    ? "bold"
                                    : "normal",
                                color: COLORS[i % COLORS.length],
                              }}
                            />
                          </ListItem>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </List>

              {/* Interactive Pie Chart */}
              <Box sx={{ flex: 1, height: 240 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryTotals.filter((c) => c.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      activeIndex={activeIndex}
                      activeShape={(props) => (
                        <g>
                          <Sector {...props} outerRadius={props.outerRadius + 10} />
                        </g>
                      )}
                      onMouseEnter={(_, index) => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                      onClick={(_, index) => handleSelect(index)}
                      label
                      isAnimationActive
                    >
                      {categoryTotals.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* ✅ Side Drawer Detail Panel */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 320, p: 2 } }}
      >
        {selectedCategory && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">📌 {selectedCategory.name}</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography>
              💵 Spent: ₹{selectedCategory.value.toLocaleString()}
            </Typography>
            <Typography>
              📊 % of Expenses:{" "}
              {((selectedCategory.value / expenseTotal) * 100).toFixed(1)}%
            </Typography>
            <Typography>
              🏦 % of Salary:{" "}
              {((selectedCategory.value / salary) * 100).toFixed(1)}%
            </Typography>
            <Typography>
              🎯 % of Budget:{" "}
              {((selectedCategory.value / budget) * 100).toFixed(1)}%
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Snackbar Warnings */}
      <Snackbar
        open={showBudgetWarning}
        autoHideDuration={5000}
        onClose={() => setShowBudgetWarning(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          ⚠️ Your budget exceeds your salary! Please adjust.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showNegativeBalance}
        autoHideDuration={5000}
        onClose={() => setShowNegativeBalance(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          🚨 Your expenses are higher than your salary! Balance is negative.
        </Alert>
      </Snackbar>
    </>
  );
}

export default Balance;