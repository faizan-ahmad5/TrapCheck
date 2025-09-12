import React, { useState, useEffect } from "react";
import Icon from "../components/Icon";

const tabs = [
  { label: "Review Reports", key: "reports", icon: "reports" },
  { label: "Approve Articles", key: "articles", icon: "article" },
  { label: "Manage Users", key: "users", icon: "user" },
];

// Remove mockReports, use real data
// Remove mockArticles, use real data

export default function AdminDashboard() {
  const [active, setActive] = useState("reports");
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (active === "articles") {
      setArticlesLoading(true);
      setArticlesError(null);
      fetch("/api/articles/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch articles");
          return res.json();
        })
        .then((data) => {
          setArticles(data.filter(article => article.status !== 'rejected'));
          setArticlesLoading(false);
        })
        .catch((err) => {
          setArticlesError(err.message);
          setArticlesLoading(false);
        });
    } else if (active === "users") {
      setUsersLoading(true);
      setUsersError(null);
      fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch users");
          return res.json();
        })
        .then((data) => {
          setUsers(data);
          setUsersLoading(false);
        })
        .catch((err) => {
          setUsersError(err.message);
          setUsersLoading(false);
        });
    } else if (active === "reports") {
      setReportsLoading(true);
      setReportsError(null);
      fetch("/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch reports");
          return res.json();
        })
        .then((data) => {
          setReports(data.filter(report => report.status !== 'dismissed'));
          setReportsLoading(false);
        })
        .catch((err) => {
          setReportsError(err.message);
          setReportsLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [active]);

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] bg-dark text-text-base font-body px-2">
      <div className="flex items-center gap-3 mt-10 mb-8 w-full max-w-5xl">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink w-14 h-14 shadow-neon">
          <Icon name="user" className="text-dark" />
        </span>
        <div>
          <div className="font-heading text-lg text-text-base font-bold">Admin Panel</div>
          <div className="text-text-muted text-sm">Manage reports, articles, and users</div>
        </div>
      </div>
      <div className="flex gap-2 mb-8 w-full max-w-5xl border-b border-text-muted">
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
      <div className="w-full max-w-5xl bg-[#23233a] border border-text-muted rounded-2xl shadow-xl p-8 animate-fadein-bounce min-h-[320px]">
        {active === "reports" && (
          <div className="animate-fadein">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-neon-cyan">Review Reports</h3>
              <span className="text-xs text-text-muted">Moderate user submissions</span>
            </div>
            {reportsLoading ? (
              <div className="text-text-muted py-4">Loading reports...</div>
            ) : reportsError ? (
              <div className="text-neon-pink font-bold py-4">{reportsError}</div>
            ) : reports.length === 0 ? (
              <div className="text-text-muted py-4">No reports found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-text-muted border-b border-text-muted">
                      <th className="py-2 pr-4">URL</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={r._id || i} className="border-b border-[#23233a] hover:bg-[#181828] transition">
                        <td className="py-2 pr-4 font-mono text-text-base">{r.url}</td>
                        <td className="py-2 pr-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</td>
                        <td className="py-2 pr-4">{r.rawText || ''}</td>
                        <td className="py-2 pr-4"><span className={`px-3 py-1 rounded-full font-heading font-bold text-xs shadow ${r.status === 'open' ? 'bg-accent-yellow text-dark' : 'bg-neon-cyan text-dark'}`}>{r.status}</span></td>
                        <td className="py-2 pr-4 flex gap-2">
                          <button
                            className="bg-neon-cyan text-dark px-3 py-1 rounded font-bold hover:bg-neon-pink hover:text-white transition"
                            title="Mark Reviewed"
                            disabled={r.status === 'reviewed'}
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/reports/${r._id}`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ status: 'reviewed' }),
                                });
                                if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
                                setReports(reports => reports.map(report => report._id === r._id ? { ...report, status: 'reviewed' } : report));
                              } catch (err) {
                                alert('Error: ' + err.message);
                              }
                            }}
                          >
                            {r.status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}
                          </button>
                          <button
                            className="bg-neon-pink text-white px-3 py-1 rounded font-bold hover:bg-accent-yellow hover:text-dark transition"
                            title="Dismiss"
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/reports/${r._id}`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ status: 'dismissed' }),
                                });
                                if (!res.ok) throw new Error((await res.json()).error || 'Failed to dismiss');
                                setReports(reports => reports.filter(report => report._id !== r._id));
                              } catch (err) {
                                alert('Error: ' + err.message);
                              }
                            }}
                          >
                            Dismiss
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {active === "articles" && (
          <div className="animate-fadein">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-neon-cyan">Approve Articles</h3>
              <span className="text-xs text-text-muted">Pending drafts</span>
            </div>
            {articlesLoading ? (
              <div className="text-text-muted py-4">Loading articles...</div>
            ) : articlesError ? (
              <div className="text-neon-pink font-bold py-4">{articlesError}</div>
            ) : articles.length === 0 ? (
              <div className="text-text-muted py-4">No articles found.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((a, i) => (
                  <div key={a._id || i} className="bg-[#181828] border border-neon-cyan rounded-lg p-5 flex flex-col gap-2 shadow hover:scale-105 transition">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-lg text-neon-cyan">{a.title}</span>
                      <span className="ml-auto text-xs text-text-muted">by {a.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="text-text-muted text-sm mb-2">{a.content?.slice(0, 80) || ''}...</div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        className="bg-neon-cyan text-dark px-3 py-1 rounded font-bold hover:bg-neon-pink hover:text-white transition"
                        title="Approve"
                        disabled={a.status === 'published'}
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/articles/${a._id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ status: 'published' }),
                            });
                            if (!res.ok) throw new Error((await res.json()).error || 'Failed to approve');
                            setArticles(articles => articles.map(article => article._id === a._id ? { ...article, status: 'published' } : article));
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                      >
                        {a.status === 'published' ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        className="bg-neon-pink text-white px-3 py-1 rounded font-bold hover:bg-accent-yellow hover:text-dark transition"
                        title="Reject"
                        disabled={a.status === 'rejected'}
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/articles/${a._id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ status: 'rejected' }),
                            });
                            if (!res.ok) throw new Error((await res.json()).error || 'Failed to reject');
                            setArticles(articles => articles.filter(article => article._id !== a._id));
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                      >
                        {a.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-800 transition"
                        title="Delete Article"
                        onClick={async () => {
                          if (!window.confirm(`Are you sure you want to delete article '${a.title}'?`)) return;
                          try {
                            const res = await fetch(`/api/articles/${a._id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete article');
                            setArticles(articles => articles.filter(article => article._id !== a._id));
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {active === "users" && (
          <div className="animate-fadein">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-neon-cyan">Manage Users</h3>
              <span className="text-xs text-text-muted">Roles & status</span>
            </div>
            {usersLoading ? (
              <div className="text-text-muted py-4">Loading users...</div>
            ) : usersError ? (
              <div className="text-neon-pink font-bold py-4">{usersError}</div>
            ) : users.length === 0 ? (
              <div className="text-text-muted py-4">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-text-muted border-b border-text-muted">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id || i} className="border-b border-[#23233a] hover:bg-[#181828] transition">
                        <td className="py-2 pr-4 font-heading font-bold">{u.name}</td>
                        <td className="py-2 pr-4">{u.email}</td>
                        <td className="py-2 pr-4 capitalize">{u.role}</td>
                        <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
                        <td className="py-2 pr-4 flex gap-2">
                          <button
                            className="bg-neon-cyan text-dark px-3 py-1 rounded font-bold hover:bg-neon-pink hover:text-white transition"
                            title="Change Role"
                            onClick={async () => {
                              const newRole = u.role === 'admin' ? 'user' : 'admin';
                              try {
                                const res = await fetch(`/api/users/${u._id}`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ role: newRole }),
                                });
                                if (!res.ok) throw new Error((await res.json()).error || 'Failed to update role');
                                setUsers(users => users.map(user => user._id === u._id ? { ...user, role: newRole } : user));
                              } catch (err) {
                                alert('Error: ' + err.message);
                              }
                            }}
                          >
                            {u.role === 'admin' ? 'Set User' : 'Set Admin'}
                          </button>
                          <button
                            className={`px-3 py-1 rounded font-bold transition ${u.status === 'deactivated' ? 'bg-neon-cyan text-dark hover:bg-neon-pink hover:text-white' : 'bg-neon-pink text-white hover:bg-accent-yellow hover:text-dark'}`}
                            title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                            onClick={async () => {
                              const newStatus = u.status === 'active' ? 'deactivated' : 'active';
                              try {
                                const res = await fetch(`/api/users/${u._id}`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ status: newStatus }),
                                });
                                if (!res.ok) throw new Error((await res.json()).error || 'Failed to update status');
                                setUsers(users => users.map(user => user._id === u._id ? { ...user, status: newStatus } : user));
                              } catch (err) {
                                alert('Error: ' + err.message);
                              }
                            }}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-800 transition"
                            title="Delete User"
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete user ${u.email}?`)) return;
                              try {
                                const res = await fetch(`/api/users/${u._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });
                                if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete user');
                                setUsers(users => users.filter(user => user._id !== u._id));
                              } catch (err) {
                                alert('Error: ' + err.message);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
