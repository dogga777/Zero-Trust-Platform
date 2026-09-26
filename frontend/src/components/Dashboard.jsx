import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { sendAuthDecision } from '../api/client';

export default function Dashboard() {
  const [identityId, setIdentityId] = useState('agent-summarizer-01');
  const [resourceId, setResourceId] = useState('db-hr-records');
  const [sensitivity, setSensitivity] = useState('CONFIDENTIAL');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleTest = async () => {
    setLoading(true);
    try {
      const resp = await sendAuthDecision({
        identity_id: identityId,
        resource_id: resourceId,
        resource_sensitivity: sensitivity,
        context: { recent_count: 5, actions: ['read', 'query'] },
      });
      setResult(resp.data);
      setHistory((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), risk: resp.data.risk_score },
      ].slice(-20));
    } catch (e) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Live Risk Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
          <h3 className="font-semibold mb-4 text-emerald-400">Trigger Authorization Decision</h3>
          <div className="space-y-3">
            <input value={identityId} onChange={(e) => setIdentityId(e.target.value)} placeholder="Identity ID" className="w-full p-2 bg-slate-800 rounded border border-slate-700" />
            <input value={resourceId} onChange={(e) => setResourceId(e.target.value)} placeholder="Resource ID" className="w-full p-2 bg-slate-800 rounded border border-slate-700" />
            <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} className="w-full p-2 bg-slate-800 rounded border border-slate-700">
              <option>PUBLIC</option>
              <option>INTERNAL</option>
              <option>CONFIDENTIAL</option>
              <option>CRITICAL</option>
            </select>
            <button onClick={handleTest} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 p-2 rounded font-medium disabled:opacity-50">
              {loading ? 'Evaluating...' : 'Evaluate Access'}
            </button>
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
          <h3 className="font-semibold mb-4 text-emerald-400">Decision Result</h3>
          {!result && <p className="text-slate-500">Click "Evaluate Access" to see a decision.</p>}
          {result && result.error && <p className="text-red-400">{result.error}</p>}
          {result && !result.error && (
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-400">Action:</span> <span className={`font-bold ${result.decision.action === 'allow' ? 'text-emerald-400' : result.decision.action === 'deny' ? 'text-red-400' : 'text-yellow-400'}`}>{result.decision.action.toUpperCase()}</span></p>
              <p><span className="text-slate-400">Reason:</span> {result.decision.reason}</p>
              <p><span className="text-slate-400">Risk Score:</span> {result.risk_score}</p>
              {result.token && (
                <div className="mt-3">
                  <p className="text-slate-400 text-xs mb-1">Ephemeral Token:</p>
                  <pre className="bg-slate-950 p-2 rounded text-xs overflow-x-auto text-emerald-300">{result.token}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
        <h3 className="font-semibold mb-4 text-emerald-400">Risk Score Over Time</h3>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No data yet. Run a few decisions above.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis domain={[0, 1]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="risk" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}