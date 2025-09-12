import React from "react";

// verdict: 'likely_safe' | 'suspicious' | 'malicious'
const verdictMap = {
  likely_safe: {
    label: "Safe",
    color: "bg-green-500 text-white",
    icon: "✔️",
  },
  suspicious: {
    label: "Suspicious",
    color: "bg-accent-yellow text-dark",
    icon: "⚠️",
  },
  malicious: {
    label: "Malicious",
    color: "bg-neon-pink text-white",
    icon: "⛔",
  },
};

export default function VerdictCard({ verdict, score, reasons }) {
  const v = verdictMap[verdict] || verdictMap.likely_safe;
  return (
    <div className="w-full max-w-md mx-auto bg-dark border-2 border-neon-cyan rounded-xl shadow-lg p-6 flex flex-col items-center animate-fadein-bounce">
      <div className={`flex items-center gap-3 mb-2`}>
        <span className={`text-3xl drop-shadow-neon`}>{v.icon}</span>
        <span className={`px-4 py-1 rounded-full font-heading font-bold text-lg shadow ${v.color}`}>{v.label}</span>
      </div>
      <div className="text-text-base text-xl font-bold mb-2">Score: <span className="font-mono">{score}</span> / 100</div>
      <ul className="text-text-muted text-sm list-disc pl-6">
        {reasons && reasons.length > 0 ? reasons.map((r, i) => <li key={i}>{r}</li>) : <li>No suspicious patterns detected.</li>}
      </ul>
    </div>
  );
}
