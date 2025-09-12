import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (data.errors && data.errors[0]?.msg) || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] bg-dark text-text-base font-body px-2">
      <h2 className="text-h2 font-heading font-bold text-neon-cyan mb-6 tracking-wide">Login</h2>
      <form onSubmit={handleSubmit} className="bg-dark border-2 border-neon-cyan p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-6 animate-fadein">
        <input
          type="email"
          className="border-2 border-text-muted rounded-lg px-4 py-3 bg-dark text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-lg transition-all"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="border-2 border-text-muted rounded-lg px-4 py-3 bg-dark text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-lg transition-all w-full pr-12"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-cyan hover:text-neon-pink transition text-xl focus:outline-none"
            onClick={() => setShow(s => !s)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <span role="img" aria-label="Hide">🙈</span> : <span role="img" aria-label="Show">👁️</span>}
          </button>
        </div>
        <button type="submit" className="bg-neon-cyan text-dark font-heading font-bold py-2 rounded-lg shadow-neon hover:bg-neon-pink hover:text-white transition-all text-lg tracking-wider" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-neon-pink text-sm mt-2 font-semibold animate-fadein">{error}</div>}
      </form>
    </div>
  );
}
