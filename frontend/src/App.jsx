import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AgentRegistry from './components/AgentRegistry';
import BlastRadiusGraph from './components/BlastRadiusGraph';
import AuditLog from './components/AuditLog';
import LiveFeed from './components/LiveFeed';

const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'registry', label: '🤖 Agent Registry' },
  { id: 'blast', label: '💥 Blast Radius' },
  { id: 'audit', label: '📜 Audit Log' },
  { id: 'live', label: '⚡ Live Feed' },
];

export default function App() {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900">
        <h1 className="text-xl font-bold">🛡️ Zero-Trust Platform</h1>
        <span className="text-xs text-emerald-400">● System Healthy</span>
      </header>

      <nav className="flex flex-wrap gap-2 p-3 border-b border-slate-800 bg-slate-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              active === t.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="p-6">
        {active === 'dashboard' && <Dashboard />}
        {active === 'registry' && <AgentRegistry />}
        {active === 'blast' && <BlastRadiusGraph />}
        {active === 'audit' && <AuditLog />}
        {active === 'live' && <LiveFeed />}
      </main>
    </div>
  );
}