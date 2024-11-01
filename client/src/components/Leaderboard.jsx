/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { fetchLeaderboard } from "../api/leaderboard";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchLeaderboard();
      setIsLoading(false);
      setLeaderboard(data);
    } catch (err) {
      setError("Failed to load leaderboard. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
  }, []);

  const handleRefresh = () => {
    loadLeaderboard();
  };

  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-500 bg-red-50 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 max-w-md mx-auto bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
      </div>

      {leaderboard === null || leaderboard.length === 0 ? (
        <p className="text-center text-gray-500">
          No scores yet. Be the first to play!
        </p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={`${entry.username}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${
                    index < 3 ? "text-yellow-500" : "text-gray-600"
                  }`}
                >
                  {index + 1}.
                </span>
                <span className="font-bold uppercase text-gray-800">
                  {entry.username}
                </span>
              </div>
              <span className="font-bold text-indigo-600">
                {entry.score} {entry.score === 1 ? "point" : "points"}
              </span>
            </motion.div>
          ))}
          <div className="mt-8 max-w-md mx-auto flex items-center justify-center">
            <button
              onClick={handleRefresh}
              className="w-full text-center font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
