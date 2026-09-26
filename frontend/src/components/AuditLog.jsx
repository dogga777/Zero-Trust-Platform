import { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../api/client';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetchAuditLogs();
      setLogs(resp.data.logs || []);
    } catch (e) {
      setLogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  const actionColor = (a) => {
    if (a === 'allow') return 'text-emerald-400';
    if (a === 'deny') return 'text-red-400';
    if (a === 'step_up') return 'text-yellow-400';
    return 'text-slate-300';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Auditable Decision Logs</h2>
        <button onClick={load} className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-sm">🔄 Refresh</button>
      </div>
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        {loading && logs.length === 0 && <p className="p-4 text-slate-500">Loading...</p>}
        {!loading && logs.length === 0 && <p className="p-4 text-slate-500">No decisions yet. Trigger some from the Dashboard tab.</p>}
        {logs.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Identity</th>
                <th className="text-left p-3">Resource</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Risk</th>
                <th className="text-left p-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {[...logs].reverse().map((l) => (
                <tr key={l.id} className="border-t border-slate-800">
                  <td className="p-3 text-xs">{new Date(l.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3 font-mono text-xs">{l.identity_id}</td>
                  <td className="p-3 font-mono text-xs">{l.resource_id}</td>
                  <td className={`p-3 font-bold ${actionColor(l.action)}`}>{l.action.toUpperCase()}</td>
                  <td className="p-3">{l.risk_score}</td>
                  <td className="p-3 text-slate-400 text-xs">{l.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}