import React from "react";

const articles = [
  {
    title: "How to Spot a Phishing Email",
    snippet: "Learn the common signs of phishing emails and how to protect yourself.",
    color: "from-neon-cyan to-accent-yellow",
  },
  {
    title: "Top 10 Most Dangerous Phishing Tactics",
    snippet: "Stay up to date with the latest phishing tactics used by attackers.",
    color: "from-neon-pink to-neon-cyan",
  },
  {
    title: "Reporting Phishing: Why It Matters",
    snippet: "Understand the importance of reporting phishing attempts to help others.",
    color: "from-accent-yellow to-neon-pink",
  },
];

export default function Articles() {
  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] bg-dark text-text-base font-body px-2">
      <h2 className="text-h2 font-heading font-bold text-neon-cyan mb-8 tracking-wide">Phishing Awareness Articles</h2>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadein">
        {articles.map((a, i) => (
          <div key={i} className={`bg-dark border-2 border-neon-cyan rounded-xl shadow-lg p-6 flex flex-col items-start hover:scale-105 hover:shadow-neon transition-transform duration-200 group animate-fadein-bounce`}> 
            <div className={`w-12 h-12 mb-3 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl text-dark font-heading font-bold shadow-neon`}>A{i+1}</div>
            <h3 className="font-heading text-xl font-bold text-text-base mb-2 group-hover:text-neon-cyan transition">{a.title}</h3>
            <p className="text-text-muted text-sm mb-4">{a.snippet}</p>
            <button className="mt-auto bg-neon-pink text-white font-heading px-4 py-2 rounded shadow hover:bg-neon-cyan hover:text-dark transition-all">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}
