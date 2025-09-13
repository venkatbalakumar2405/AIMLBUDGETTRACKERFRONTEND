import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function Balance({ salary, expenses, balance }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1">💼 Salary: {salary}</Typography>
        <Typography variant="subtitle1">🛒 Total Expenses: {expenses}</Typography>
        <Typography variant="h6">💵 Balance: {balance}</Typography>
      </CardContent>
    </Card>
  );
}

export default Balance;