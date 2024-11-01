import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateLeaderboard } from "../api/leaderboard";

// const DECK_SIZE = 5;

const createCard = (type) => ({
  id: Math.random().toString(36).substring(7),
  type,
  revealed: false,
});

const createDeck = () => {
  const cards = [];
  const cards2 = [];
  // Add one of each card type
  cards.push(createCard("cat"));
  cards.push(createCard("defuse"));
  cards.push(createCard("shuffle"));
  cards.push(createCard("bomb"));
  // Add an extra cat card
  cards.push(createCard("cat"));

  cards2.push(createCard("cat"));
  cards2.push(createCard("defuse"));
  cards2.push(createCard("cat"));
  cards2.push(createCard("bomb"));
  // Add an extra cat card
  cards2.push(createCard("cat"));
  // Shuffle the deck
  const comCard = [[...cards], [...cards2], [...cards2], [...cards2]];
  comCard.forEach((card) => card.sort(() => Math.random() - 0.5));
  const inx = Math.floor(Math.random() * 4);
  return comCard[inx];
};

export const updateScore = createAsyncThunk(
  "game/updateScore",
  updateLeaderboard
);

const initialState = {
  username: "",
  isLoggedIn: false,
  deck: [],
  hasDefuseCard: false,
  isGameOver: false,
  message: "Welcome to Exploding Kittens!",
  gameStatus: "idle",
  score: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload;
      state.isLoggedIn = true;
    },
    startGame: (state) => {
      state.deck = createDeck();
      state.hasDefuseCard = false;
      state.isGameOver = false;
      state.message = "Game started! Draw a card.";
      state.gameStatus = "playing";
    },
    drawCard: (state, action) => {
      const index = action.payload;
      if (state.deck.length === 0 || state.isGameOver || !state.deck[index])
        return;

      const card = state.deck[index];
      state.deck = state.deck.filter((_, idx) => idx !== index);

      switch (card.type) {
        case "cat":
          state.message = "You drew a cat card! Safe for now.";
          break;
        case "defuse":
          state.hasDefuseCard = true;
          state.message =
            "You got a defuse card! It will protect you from one bomb.";
          break;
        case "shuffle":
          state.deck = createDeck();
          state.message = "Shuffle card! The deck has been reset.";
          break;
        case "bomb":
          if (state.hasDefuseCard) {
            state.hasDefuseCard = false;
            state.message = "Bomb defused! Close call!";
          } else {
            state.isGameOver = true;
            state.message = "BOOM! Game Over!";
            state.gameStatus = "lost";
          }
          break;
      }

      if (state.deck.length === 0 && !state.isGameOver) {
        state.isGameOver = true;
        state.message = "Congratulations! You won!";
        state.score += 1;
        state.gameStatus = "won";
      }
    },
    resetGame: (state) => {
      state.deck = createDeck();
      state.hasDefuseCard = false;
      state.isGameOver = false;
      state.message = "Game started! Draw a card.";
      state.gameStatus = "playing";
    },
    logout: (state) => {
      state.username = "";
      state.isLoggedIn = false;
    },
    makeidle: (state) => {
      state.gameStatus = "idle_after_won";
    },
    setGameState: (state, action) => {
      state.deck = action.payload.deck;
      state.hasDefuseCard = action.payload.hasDefuseCard;
      state.isGameOver = action.payload.isGameOver;
      state.message = action.payload.message;
      state.score = action.payload.score;
      state.gameStatus = action.payload.gameStatus;
    },
    revealCard: (state, action) => {
      const index = action.payload;
      if (state.deck[index]) {
        state.deck[index].revealed = true; // Reveal the card
      }
    },
  },
});

export const {
  login,
  startGame,
  drawCard,
  resetGame,
  logout,
  makeidle,
  setGameState,
  revealCard,
} = gameSlice.actions;
export default gameSlice.reducer;
