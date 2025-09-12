import React, { useState } from "react";

const mockReports = [
  { url: "http://phishy-site.tk", status: "Open", date: "2025-09-12" },
  { url: "http://secure-login.ga", status: "Reviewed", date: "2025-09-10" },
  { url: "http://bank-update.cf", status: "Dismissed", date: "2025-09-08" },
];

const statusStyles = {
  Open: "bg-accent-yellow text-dark",
  Reviewed: "bg-neon-cyan text-dark",
  Dismissed: "bg-neon-pink text-white",
};

export default function Reports() {
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setUrl("");
    setDesc("");
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] bg-dark text-text-base font-body px-2">
      <h2 className="text-h2 font-heading font-bold text-neon-cyan mb-4 tracking-wide">Phishing Reports</h2>
      <p className="text-text-muted mb-6 text-center max-w-xl">Submit a phishing report or view recent reports from the community.</p>
      <div className="bg-dark border-2 border-neon-cyan p-6 rounded-xl shadow-lg w-full max-w-lg mb-10 animate-fadein">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="url"
            className="border-2 border-text-muted rounded-lg px-4 py-3 bg-dark text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-lg transition-all"
            placeholder="Phishing URL (e.g. http://bad-site.tk)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            aria-label="Phishing URL"
          />
          <textarea
            className="border-2 border-text-muted rounded-lg px-4 py-3 bg-dark text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-lg transition-all"
            placeholder="Description (optional)"
            rows={3}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            aria-label="Description"
          />
          <button
            type="submit"
            className="bg-neon-cyan text-dark font-heading font-bold py-2 rounded-lg shadow-neon hover:bg-neon-pink hover:text-white transition-all text-lg tracking-wider"
          >
            Submit Report
          </button>
          {submitted && <div className="text-neon-cyan font-semibold mt-2 animate-fadein">Report submitted! Thank you.</div>}
        </form>
      </div>
      <div className="w-full max-w-lg animate-fadein delay-200">
        <h3 className="font-heading text-lg font-bold text-neon-cyan mb-3">Recent Reports</h3>
        <div className="flex flex-col gap-3">
          {mockReports.map((r, i) => (
            <div key={i} className="flex items-center justify-between bg-dark border border-text-muted rounded-lg px-4 py-3 shadow group hover:border-neon-cyan transition-all">
              <div className="flex flex-col">
                <span className="font-mono text-text-base text-sm md:text-base">{r.url}</span>
                <span className="text-xs text-text-muted">{r.date}</span>
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full font-heading font-bold text-xs shadow ${statusStyles[r.status]}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
