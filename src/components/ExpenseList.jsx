import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ExpenseList({ expenses, onDelete }) {
  return (
    <List>
      {expenses.map((expense) => (
        <React.Fragment key={expense.id}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" onClick={() => onDelete(expense.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            }
          >
            <ListItemText
              primary={expense.name}
              secondary={`₹${expense.amount}`}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

export default ExpenseList;  