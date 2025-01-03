import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import Modal from "./components/Modal";
import { logout } from "./store/gameSlice";
// import { setGameState } from "./store/gameSlice";
// import { saveGameState } from "./api/user";

function App() {
  const { isLoggedIn: loggedIn } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = () => {
    // const gameState = {
    //   username,
    //   deck,
    //   hasDefuseCard,
    //   gameStatus,
    //   message,
    //   score,
    //   isGameOver,
    // };
    // const save = async () => {
    //   await saveGameState(gameState);
    // };
    // save();
    dispatch(logout()); // Dispatch the logout action
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // // Call `loadGameState(username)` after login or on component mount
  // const loadGameState = async (username) => {
  //   try {
  //     const response = await fetch(`/api/game/load?username=${username}`);
  //     if (response.ok) {
  //       const gameState = await response.json();
  //       dispatch(setGameState(gameState));
  //     } else {
  //       console.error("Failed to load game state.");
  //     }
  //   } catch (error) {
  //     console.error("Error loading game state:", error);
  //   }
  // };
  // useEffect(() => {
  //   if (loggedIn) {
  //     loadGameState(username);
  //   }
  // }, [loggedIn, username]);
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!loggedIn ? <Login /> : <Game />}
        {loggedIn && <Leaderboard />}
        {loggedIn && (
          <div className="mt-8 max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
            <button
              onClick={handleLogout}
              className="w-full text-center font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
            <p
              onClick={openModal}
              className="text-indigo-600 underline cursor-pointer text-sm sm:text-base"
            >
              How to play?
            </p>
          </div>
        )}

        {isModalOpen && <Modal closeModal={closeModal}></Modal>}
      </div>
    </div>
  );
}

export default App;
