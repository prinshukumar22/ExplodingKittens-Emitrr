/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function GameStatus({
  message,
  hasDefuseCard,
  cardsRemaining,
  gameStatus,
  username,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <div className="text-2xl font-bold uppercase text-gray-700">{`Hello ${username}`}</div>
      <div className="text-xl font-medium text-gray-700">{message}</div>
      <div className="flex justify-center items-center gap-4">
        {hasDefuseCard && (
          <div className="flex items-center gap-2 text-green-600">
            <ShieldCheck className="w-5 h-5" />
            <span>Defuse Card Active</span>
          </div>
        )}
        {gameStatus !== "idle" && (
          <div className="text-gray-600">Cards remaining: {cardsRemaining}</div>
        )}
      </div>
    </motion.div>
  );
}
