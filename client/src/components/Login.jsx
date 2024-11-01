import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { login, setGameState } from "../store/gameSlice";
import { saveGameState } from "../api/user";
import { API_BASE_URL } from "../api/global";
// import { registerUser } from "../api/user";s

export default function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        setError(null);
        setIsLoading(true);
        // await registerUser(username.trim());
        setIsLoading(false);
        await loadGameState(username.trim().toLowerCase());
        dispatch(login(username.trim().toLowerCase()));
      } catch (error) {
        console.error("Error during registration:", error);
        setError(error.message);
        setIsLoading(false);
      }
    } else {
      setError("Please enter a username");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
        Welcome to Exploding Kittens!
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
            placeholder="Enter your username"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? "Logging in..." : "Start Playing"}
        </button>
        {error && (
          <div className="mt-8 text-center text-red-500 bg-red-50 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </form>
    </motion.div>
  );
}
