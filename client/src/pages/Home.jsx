import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const [focus, setFocus] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] bg-dark text-text-base font-body">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-h1 md:text-5xl font-heading font-bold text-neon-cyan drop-shadow-neon mb-4 text-center tracking-widest animate-fadein">Phishing Awareness & Reporting</h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl text-center mb-8 animate-fadein delay-100">Instantly check suspicious URLs, report phishing, and read the latest security articles to stay safe online.</p>
        <form
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl animate-fadein delay-200"
          onSubmit={e => { e.preventDefault(); navigate('/check'); }}
        >
          <input
            type="url"
            className={`flex-1 px-5 py-3 rounded-lg bg-dark border-2 outline-none transition-all duration-300 text-lg font-body shadow focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan ${focus ? 'border-neon-cyan ring-2 ring-neon-cyan' : 'border-text-muted'} placeholder:text-text-muted`}
            placeholder="Paste a suspicious URL or email..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            aria-label="Check URL or email"
          />
          <button
            type="submit"
            className="bg-neon-cyan text-dark font-heading font-bold px-8 py-3 rounded-lg shadow-neon hover:bg-neon-pink hover:text-white transition-all duration-200 text-lg tracking-wider animate-glow"
          >
            Check Now
          </button>
        </form>
      </section>

      {/* Result Card Placeholder (animated entry) */}
      {/* <div className="w-full max-w-xl mt-8 animate-fadein-bounce">
        <VerdictCard verdict="safe" score={12} reasons={["No suspicious patterns detected."]} />
      </div> */}

      {/* Articles Preview Section */}
      <section className="w-full max-w-5xl mx-auto mt-16 px-4 animate-fadein delay-300">
        <h2 className="text-h2 font-heading font-bold text-neon-cyan mb-6 tracking-wide">Latest Awareness Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-dark border-2 border-neon-cyan rounded-xl shadow-lg p-6 flex flex-col items-start hover:scale-105 hover:shadow-neon transition-transform duration-200 group">
              <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center text-2xl text-dark font-heading font-bold shadow-neon">A{i}</div>
              <h3 className="font-heading text-xl font-bold text-text-base mb-2 group-hover:text-neon-cyan transition">Sample Article Title {i}</h3>
              <p className="text-text-muted text-sm mb-4">This is a preview of a cybersecurity awareness article. Learn how to spot phishing, protect your data, and more.</p>
              <button className="mt-auto bg-neon-pink text-white font-heading px-4 py-2 rounded shadow hover:bg-neon-cyan hover:text-dark transition-all">Read More</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
