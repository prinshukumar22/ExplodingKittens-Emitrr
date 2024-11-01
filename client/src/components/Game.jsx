import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startGame,
  drawCard,
  resetGame,
  updateScore,
  makeidle,
  revealCard,
  setGameState,
} from "../store/gameSlice";
import Card from "./Card";
import GameStatus from "./GameStatus";
import { motion } from "framer-motion";
import { saveGameState } from "../api/user";
import { API_BASE_URL } from "../api/global";

export default function Game() {
  const dispatch = useDispatch();
  const {
    deck,
    hasDefuseCard,
    gameStatus,
    message,
    username,
    score,
    isGameOver,
  } = useSelector((state) => state.game);

  console.log(
    deck,
    hasDefuseCard,
    gameStatus,
    message,
    username,
    score,
    isGameOver
  );

  useEffect(() => {
    const loadGameState = async (username) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/game/load?username=${username}`
        );
        console.log(response);
        if (response.ok) {
          const gameState = await response.json();
          dispatch(setGameState(gameState));
        } else {
          const gameState = {
            username,
            deck: [],
            hasDefuseCard: false,
            gameStatus: "idle",
            message: "Welcome to Exploding Kittens!",
            score: 0,
            isGameOver: false,
          };
          await saveGameState(gameState);
          dispatch(setGameState(gameState));
        }
      } catch (error) {
        console.error("Error loading game state:", error);
      }
    };

    const load = async () => {
      await loadGameState(username);
    };
    load();
  }, []);

  useEffect(() => {
    // Add other necessary checks here
    const gameState = {
      username,
      deck,
      hasDefuseCard,
      gameStatus,
      message,
      score,
      isGameOver,
    };
    saveGameState(gameState);
  }, [deck, hasDefuseCard, gameStatus, message, score, username, isGameOver]);

  useEffect(() => {
    if (gameStatus === "won") {
      const gameState = {
        username,
        deck,
        hasDefuseCard,
        gameStatus,
        message,
        score,
        isGameOver,
      };
      dispatch(updateScore(gameState));
      dispatch(makeidle());
    }
  }, [gameStatus, dispatch, username]);

  //console.log(deck, gameStatus);

  const handleStartGame = () => {
    dispatch(startGame());
    // console.log("Game stared");
  };

  const handleDrawCard = (index) => {
    if (gameStatus === "playing" && deck[index]) {
      dispatch(revealCard(index));

      // Delay the drawCard action to allow the card to be shown
      setTimeout(() => {
        dispatch(drawCard(index)); // Pass the index of the clicked card
      }, 1000); // Delay for 1 second to show the revealed card
    }
    // console.log("Game draw");
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    // console.log("Game reset");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <GameStatus
        username={username}
        message={message}
        hasDefuseCard={hasDefuseCard}
        cardsRemaining={deck.length}
        gameStatus={gameStatus}
      />

      {/* <div className="flex justify-center items-center gap-8">
        {gameStatus === "playing" && deck.length > 0 && (
          <Card isBack onClick={handleDrawCard} />
        )}
        {deck[0] && !["idle", "playing"].includes(gameStatus) && (
          <Card type={gameStatus === "lost" ? "bomb" : "cat"} />
        )}
      </div> */}
      <div className="flex justify-center flex-wrap gap-4">
        {gameStatus === "playing" &&
          deck.slice(0, 5).map((card, index) => (
            <div key={card.id} className="flex justify-center">
              <Card
                type={card.revealed ? card.type : null}
                isBack={!card.revealed}
                onClick={() => handleDrawCard(index)}
              />
            </div>
          ))}
      </div>

      <div className="flex justify-center">
        {gameStatus === "idle" && (
          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Start Game
          </button>
        )}
        {["won", "lost", "idle_after_won"].includes(gameStatus) && (
          <button
            onClick={handleResetGame}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Play Again
          </button>
        )}
      </div>
    </motion.div>
  );
}
