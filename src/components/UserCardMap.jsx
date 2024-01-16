import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { mockDataTeam } from "../data/mockData";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { tokens, useMode } from "../theme";

const Card = ({ user, index, moveCard, theme }) => {
  const [, ref] = useDrag({
    type: "CARD",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const cardStyle = {
    width: "48%",
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor:
      user.access === "admin"
        ? theme.palette.primary.main
        : user.access === "manager"
        ? theme.palette.secondary.main
        : "#fff",
    color:
      user.access === "admin" || user.access === "manager" ? "#fff" : "#000",
    textAlign: "center",
  };

  return (
    <div ref={(node) => ref(drop(node))} style={cardStyle}>
      <h2>{`User ${user.id}`}</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <p>Phone: {user.phone}</p>
      <p>Access: {user.access}</p>
    </div>
  );
};

const UserCardMap = () => {
  const [cards, setCards] = useState(mockDataTeam);
  const [theme, colorMode] = useMode(); // Use the useMode hook from your theme file

  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  const cardContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  };

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <DndProvider backend={HTML5Backend}>
        <div style={cardContainerStyle}>
          {cards.map((user, index) => (
            <Card
              key={user.id}
              index={index}
              user={user}
              moveCard={moveCard}
              theme={theme}
            />
          ))}
        </div>
      </DndProvider>
    </ThemeProvider>
  );
};

export default UserCardMap;
