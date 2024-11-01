/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Cat, ShieldCheck, Shuffle, Bomb } from "lucide-react";

export default function Card({ type, isBack = false, onClick }) {
  const getIcon = () => {
    switch (type) {
      case "cat":
        return <Cat className="w-12 h-12 text-amber-600" />;
      case "defuse":
        return <ShieldCheck className="w-12 h-12 text-green-600" />;
      case "shuffle":
        return <Shuffle className="w-12 h-12 text-blue-600" />;
      case "bomb":
        return <Bomb className="w-12 h-12 text-red-600" />;
      default:
        return <div className="w-12 h-12 bg-indigo-200 rounded-full" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-48 h-64 rounded-xl shadow-lg flex items-center justify-center cursor-pointer
        ${isBack ? "bg-indigo-600" : "bg-white"}`}
      onClick={onClick}
    >
      {isBack ? (
        <div className="text-white text-4xl font-bold">?</div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {getIcon()}
          <span className="text-lg font-medium capitalize">{type}</span>
        </div>
      )}
    </motion.div>
  );
}
