import { useEffect, useRef, useState } from 'react';

export default function LiveFeed() {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/risk-updates');
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      const iv = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'heartbeat', t: Date.now() }));
        }
      }, 5000);
      ws._interval = iv;
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setEvents((prev) => [{ ...data, receivedAt: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
    };

    ws.onclose = () => {
      setConnected(false);
      if (ws._interval) clearInterval(ws._interval);
    };

    return () => {
      if (ws._interval) clearInterval(ws._interval);
      ws.close();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live WebSocket Feed</h2>
        <span className={`text-sm ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
          {connected ? '● Connected' : '● Disconnected'}
        </span>
      </div>
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 h-[500px] overflow-y-auto font-mono text-xs space-y-1">
        {events.length === 0 && <p className="text-slate-500">Waiting for events...</p>}
        {events.map((e, i) => (
          <div key={i} className="text-emerald-300">
            <span className="text-slate-500">[{e.receivedAt}]</span> {JSON.stringify(e)}
          </div>
        ))}
      </div>
    </div>
  );
}