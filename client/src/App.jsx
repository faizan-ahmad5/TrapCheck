
import { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">TrapCheck</h1>
        <p className="text-gray-600 mb-6 text-center">Phishing Awareness & Reporting Platform</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="url"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Paste a suspicious URL to check..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check URL'}
          </button>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {result && (
          <div className="mt-6 w-full bg-blue-50 border border-blue-200 rounded p-4 text-sm text-gray-800">
            <div className="font-semibold mb-2">Result:</div>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
      <footer className="mt-8 text-gray-400 text-xs">&copy; {new Date().getFullYear()} TrapCheck. All rights reserved.</footer>
    </div>
  );
}
