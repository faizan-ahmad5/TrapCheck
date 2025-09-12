import React, { useState } from "react";
import VerdictCard from "../components/VerdictCard";

export default function Checker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/check-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error('Failed to check URL');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-dark text-text-base font-body px-2">
      <h2 className="text-h2 font-heading font-bold text-neon-cyan mb-4 tracking-wide">Phishing URL Checker</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 bg-dark border-2 border-neon-cyan p-6 rounded-xl shadow-lg">
        <input
          type="url"
          className="border-2 border-text-muted rounded-lg px-4 py-3 bg-dark text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-lg transition-all"
          placeholder="Paste a suspicious URL to check..."
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-neon-cyan text-dark font-heading font-bold py-2 rounded-lg shadow-neon hover:bg-neon-pink hover:text-white transition-all text-lg tracking-wider"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check URL'}
        </button>
      </form>
      {error && <div className="text-neon-pink mt-4 font-semibold">{error}</div>}
      {result && (
        <div className="mt-8 w-full flex justify-center animate-fadein-bounce">
          <VerdictCard verdict={result.verdict} score={result.score} reasons={result.reasons} />
        </div>
      )}
    </div>
  );
}
