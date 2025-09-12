import React from "react";

export default function Toast({ message, type = "info", onClose }) {
  const color = type === "success" ? "bg-neon-cyan text-dark" : type === "error" ? "bg-neon-pink text-white" : "bg-accent-yellow text-dark";
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg font-heading font-bold text-lg animate-fadein-bounce ${color}`} role="alert">
      {message}
      <button onClick={onClose} className="ml-4 text-xl font-bold focus:outline-none" aria-label="Close">×</button>
    </div>
  );
}
