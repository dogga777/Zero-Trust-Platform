import { useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { simulateBlastRadius } from '../api/client';

const initialNodes = [
  { id: 'agent-01', position: { x: 50, y: 150 }, data: { label: 'agent-summarizer-01' }, style: { background: '#334155', color: '#fff', border: '1px solid #64748b', padding: 8, borderRadius: 6 } },
  { id: 'res-hr', position: { x: 400, y: 50 }, data: { label: 'db-hr-records (CRITICAL)' }, style: { background: '#7f1d1d', color: '#fff', border: '1px solid #dc2626', padding: 8, borderRadius: 6 } },
  { id: 'res-fin', position: { x: 400, y: 150 }, data: { label: 'db-finance (CONFIDENTIAL)' }, style: { background: '#78350f', color: '#fff', padding: 8, borderRadius: 6 } },
  { id: 'res-pub', position: { x: 400, y: 250 }, data: { label: 'public-docs' }, style: { background: '#064e3b', color: '#fff', padding: 8, borderRadius: 6 } },
];

const initialEdges = [
  { id: 'e1', source: 'agent-01', target: 'res-hr', animated: true },
  { id: 'e2', source: 'agent-01', target: 'res-fin' },
  { id: 'e3', source: 'agent-01', target: 'res-pub' },
];

export default function BlastRadiusGraph() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges] = useState(initialEdges);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const simulate = async () => {
    setLoading(true);
    try {
      const resp = await simulateBlastRadius('agent-summarizer-01');
      const reachable = resp.data.reachable_resources || [];
      setSummary(`Compromise would expose ${reachable.length} resources.`);
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          style: reachable.some((r) => r.resource_id === n.id)
            ? { ...n.style, background: '#dc2626', border: '2px solid #f87171' }
            : n.style,
        }))
      );
    } catch (e) {
      setSummary('Simulation endpoint returned no data (using mock graph).');
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          style: n.id.startsWith('res-')
            ? { ...n.style, background: '#dc2626', border: '2px solid #f87171' }
            : n.style,
        }))
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blast Radius Simulation</h2>
        <button onClick={simulate} disabled={loading} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-medium disabled:opacity-50">
          {loading ? 'Simulating...' : '💥 Simulate Compromise'}
        </button>
      </div>
      {summary && <p className="text-sm text-yellow-400">{summary}</p>}
      <div className="bg-slate-900 rounded-lg border border-slate-800 h-[550px]">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#334155" gap={20} />
          <Controls />
          <MiniMap style={{ background: '#0f172a' }} />
        </ReactFlow>
      </div>
    </div>
  );
}