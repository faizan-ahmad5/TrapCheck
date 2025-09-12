
import React, { useState, useEffect } from "react";

import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import ReactMarkdown from "react-markdown";
import Icon from "../components/Icon";


const tabs = [
  { label: "My Reports", key: "reports", icon: "reports" },
  { label: "Submit Article", key: "article", icon: "article" },
  { label: "Notifications", key: "notifications", icon: "notifications" },
];

export default function Dashboard() {
  const [active, setActive] = useState("reports");
  const [articleTitle, setArticleTitle] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);
  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  // Get JWT token from localStorage (or context if you use one)
  const token = localStorage.getItem("token");

  // Fetch user's reports from backend
  useEffect(() => {
    if (active !== "reports") return;
    const fetchReports = async () => {
      setReportsLoading(true);
      setReportsError(null);
      try {
        const res = await fetch("/api/reports/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch reports");
        setReports(data.reports || []);
      } catch (err) {
        setReportsError(err.message);
      } finally {
        setReportsLoading(false);
      }
    };
    fetchReports();
    // eslint-disable-next-line
  }, [active]);

  // Fetch notifications from backend
  useEffect(() => {
    if (active !== "notifications") return;
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      setNotificationsError(null);
      try {
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch notifications");
        setNotifications(data || []);
      } catch (err) {
        setNotificationsError(err.message);
      } finally {
        setNotificationsLoading(false);
      }
    };
    fetchNotifications();
    // eslint-disable-next-line
  }, [active]);

  // Mark notification as read
  const markNotificationRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  // Submit article to backend
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    if (articleTitle.trim().length < 5) {
      setToast({ message: "Title must be at least 5 characters.", type: "error" });
      return;
    }
    if (article.trim().length < 20) {
      setToast({ message: "Content must be at least 20 characters.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: articleTitle, content: article }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit article");
      setArticle("");
      setArticleTitle("");
      setToast({ message: "Article submitted for review!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] bg-dark text-text-base font-body px-2">
      {/* User avatar and greeting */}
      <div className="flex items-center gap-4 mb-8 mt-8 w-full max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink w-14 h-14 shadow-neon">
            <Icon name="user" className="text-dark" />
          </span>
          <div>
            <div className="font-heading text-lg text-text-base font-bold">Welcome back, <span className="text-neon-cyan">User</span></div>
            <div className="text-text-muted text-sm">Your phishing activity at a glance</div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 w-full max-w-3xl border-b border-text-muted">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-5 py-2 -mb-px border-b-2 font-heading font-bold text-base transition-all duration-200 ${active === tab.key ? 'border-neon-cyan text-neon-cyan bg-dark' : 'border-transparent text-text-muted hover:text-neon-cyan'}`}
            onClick={() => setActive(tab.key)}
            aria-current={active === tab.key ? "page" : undefined}
            title={tab.label}
          >
            <Icon name={tab.icon} className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>
      {/* Main card */}
      <div className="w-full max-w-3xl bg-[#23233a] border border-text-muted rounded-2xl shadow-xl p-8 animate-fadein-bounce min-h-[320px]">
        {active === "reports" && (
          <div className="animate-fadein">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-neon-cyan">My Reports</h3>
              <span className="text-xs text-text-muted">Recent activity</span>
            </div>
            <div className="flex flex-col gap-4">
              {reportsLoading ? (
                <div className="flex justify-center items-center py-8"><Spinner /> Loading reports...</div>
              ) : reportsError ? (
                <div className="text-neon-pink font-bold py-4">{reportsError}</div>
              ) : reports.length === 0 ? (
                <div className="text-text-muted py-4">No reports found.</div>
              ) : (
                reports.map((r, i) => (
                  <div key={r._id || i} className="flex items-center justify-between bg-[#23233a] border border-text-muted rounded-lg px-5 py-4 shadow group hover:border-neon-cyan transition-all">
                    <div className="flex flex-col">
                      <span className="font-mono text-text-base text-base">{r.url}</span>
                      <span className="text-xs text-text-muted">{new Date(r.createdAt || r.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`ml-4 px-3 py-1 rounded-full font-heading font-bold text-xs shadow ${r.status === 'Open' ? 'bg-accent-yellow text-dark' : 'bg-neon-cyan text-dark'}`}>{r.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {active === "article" && (
          <form className="animate-fadein" onSubmit={handleArticleSubmit}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-neon-cyan">Submit Article</h3>
              <span className="text-xs text-text-muted">Markdown supported</span>
            </div>
            <div className="mb-4">
              <input
                className="w-full border border-text-muted rounded-lg px-4 py-3 bg-[#1E1E2F] text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-base transition-all mb-2"
                placeholder="Article Title (min 5 chars)"
                value={articleTitle}
                onChange={e => setArticleTitle(e.target.value)}
                aria-label="Article Title"
                minLength={5}
                maxLength={100}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <textarea
                className="w-full min-h-[120px] border border-text-muted rounded-lg px-4 py-3 bg-[#1E1E2F] text-text-base focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan placeholder:text-text-muted text-base transition-all"
                placeholder="Write your article in Markdown (min 20 chars)..."
                value={article}
                onChange={e => setArticle(e.target.value)}
                aria-label="Article Markdown"
                minLength={20}
                required
              />
              <div className="bg-[#181828] border border-neon-cyan rounded-lg p-4 min-h-[120px] text-text-base prose prose-invert max-w-none overflow-auto">
                <ReactMarkdown>{article || "*Start typing to see preview...*"}</ReactMarkdown>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button className="bg-neon-cyan text-dark font-heading font-bold py-2 px-6 rounded-lg shadow-neon hover:bg-neon-pink hover:text-white transition-all text-base tracking-wider" disabled={loading}>
                {loading ? <Spinner /> : "Submit Article"}
              </button>
            </div>
          </form>
        )}
        {active === "notifications" && (
          <div className="animate-fadein">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-neon-cyan">Notifications</h3>
              <span className="text-xs text-text-muted">System & user alerts</span>
            </div>
            {notificationsLoading ? (
              <div className="flex justify-center items-center py-8"><Spinner /> Loading notifications...</div>
            ) : notificationsError ? (
              <div className="text-neon-pink font-bold py-4">{notificationsError}</div>
            ) : notifications.length === 0 ? (
              <div className="text-text-muted py-4">No notifications found.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((n) => (
                  <div key={n._id} className={`flex items-start gap-4 p-4 rounded-lg border shadow transition-all ${n.read ? 'bg-[#23233a] border-text-muted opacity-60' : 'bg-accent-yellow border-accent-yellow/60'} relative`}>
                    <div className="flex-shrink-0 pt-1">
                      <Icon name="notifications" className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div className="flex-1">
                      <div className="font-heading font-bold text-base mb-1 text-dark dark:text-text-base">{n.message}</div>
                      {n.article && n.article.title && (
                        <div className="text-xs text-text-muted mb-1">Article: <span className="font-mono">{n.article.title}</span></div>
                      )}
                      <div className="text-xs text-text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    {!n.read && (
                      <button
                        className="ml-2 px-3 py-1 rounded bg-neon-cyan text-dark font-bold text-xs shadow hover:bg-neon-pink hover:text-white transition"
                        onClick={() => markNotificationRead(n._id)}
                        title="Mark as read"
                      >Mark as read</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
