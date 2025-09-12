import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setOpen(false);
  };
  return (
    <nav className="bg-dark text-text-base font-heading shadow-lg px-4 py-3 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-2">
        <span className="text-neon-cyan font-heading text-2xl tracking-widest drop-shadow-neon font-bold select-none">TrapCheck</span>
      </div>
      <button className="md:hidden flex flex-col justify-center items-center w-10 h-10" onClick={() => setOpen(!open)} aria-label="Open menu">
        <span className={`block w-7 h-1 rounded-full bg-neon-cyan mb-1 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-7 h-1 rounded-full bg-neon-cyan mb-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-7 h-1 rounded-full bg-neon-cyan transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      <div className={`flex-col md:flex-row md:flex gap-6 items-center absolute md:static top-full left-0 w-full md:w-auto bg-dark md:bg-transparent shadow-lg md:shadow-none transition-all duration-300 ${open ? 'flex' : 'hidden md:flex'}`}>
        <NavLink to="/" className={({isActive}) => isActive ? "text-neon-cyan font-semibold" : "text-text-muted hover:text-neon-cyan transition font-medium py-2 md:py-0"} onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/check" className={({isActive}) => isActive ? "text-neon-cyan font-semibold" : "text-text-muted hover:text-neon-cyan transition font-medium py-2 md:py-0"} onClick={() => setOpen(false)}>Phishing Checker</NavLink>
        <NavLink to="/reports" className={({isActive}) => isActive ? "text-neon-cyan font-semibold" : "text-text-muted hover:text-neon-cyan transition font-medium py-2 md:py-0"} onClick={() => setOpen(false)}>Reports</NavLink>
        <NavLink to="/articles" className={({isActive}) => isActive ? "text-neon-cyan font-semibold" : "text-text-muted hover:text-neon-cyan transition font-medium py-2 md:py-0"} onClick={() => setOpen(false)}>Articles</NavLink>
        <div className="flex gap-2 mt-2 md:mt-0">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-neon-pink text-white px-4 py-1 rounded font-semibold shadow-neon hover:bg-neon-cyan hover:text-dark transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-neon-pink hover:underline font-medium px-2 py-1 rounded transition" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="bg-neon-cyan text-dark px-4 py-1 rounded font-semibold shadow-neon hover:bg-neon-pink hover:text-white transition" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
