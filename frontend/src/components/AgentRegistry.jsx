const agents = [
  { id: 'agent-summarizer-01', type: 'AI Agent', trust: 0.95, posture: 'Patched', auth: 'mTLS' },
  { id: 'agent-reviewer-02', type: 'AI Agent', trust: 0.88, posture: 'Patched', auth: 'mTLS' },
  { id: 'robot-arm-07', type: 'Robot', trust: 0.72, posture: 'Outdated OS', auth: 'Certificate' },
  { id: 'svc-billing-api', type: 'Service', trust: 0.99, posture: 'Patched', auth: 'SPIFFE' },
  { id: 'user-alice', type: 'User', trust: 0.91, posture: 'Patched', auth: 'MFA' },
  { id: 'user-bob', type: 'User', trust: 0.55, posture: 'Missing AV', auth: 'Password' },
];

function trustColor(t) {
  if (t >= 0.85) return 'text-emerald-400';
  if (t >= 0.7) return 'text-yellow-400';
  return 'text-red-400';
}

export default function AgentRegistry() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Identity & Device Registry</h2>
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left p-3">Identity ID</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Trust Score</th>
              <th className="text-left p-3">Device Posture</th>
              <th className="text-left p-3">Auth Strength</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                <td className="p-3 font-mono text-xs">{a.id}</td>
                <td className="p-3">{a.type}</td>
                <td className={`p-3 font-bold ${trustColor(a.trust)}`}>{a.trust.toFixed(2)}</td>
                <td className="p-3">{a.posture}</td>
                <td className="p-3">{a.auth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}