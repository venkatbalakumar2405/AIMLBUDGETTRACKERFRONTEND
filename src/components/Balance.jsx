import React from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";

function Balance({ salary, expenses, balance }) {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="subtitle1" color="primary">
          💼 Salary: {salary}
        </Typography>

        <Typography variant="subtitle1" color="error">
          🛒 Total Expenses: {expenses}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="h6" color="success">
          💵 Balance: {balance}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Balance;