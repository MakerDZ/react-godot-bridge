'use client';

import { useEffect, useState } from 'react';
import { GodotBridgeProvider, GodotFrame, useGodot } from 'react-godot-bridge';

function Controls() {
  const { emit, on } = useGodot();
  const [pong, setPong] = useState<string | null>(null);

  useEffect(() => {
    return on('pong', (payload) => {
      setPong(payload.message as string);
    });
  }, [on]);

  return (
    <div className="shrink-0 flex flex-col items-center gap-3 py-4">
      <button
        onClick={() => emit('ping', { from: 'Next.js' })}
        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-black text-xl transition-all active:scale-95 shadow-lg"
      >
        SEND PING TO GODOT
      </button>
      {pong && (
        <p className="text-green-400 font-mono text-sm">
          Godot says: &quot;{pong}&quot;
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <GodotBridgeProvider appKey={process.env.NEXT_PUBLIC_BRIDGE_KEY ?? ''}>
      <div className="flex flex-col h-screen bg-slate-900 text-white">
        <h1 className="text-2xl font-bold text-center py-4 shrink-0">
          react-godot-bridge demo
        </h1>

        <div className="flex-1 mx-4 min-h-0 border-4 border-blue-500 rounded-xl overflow-hidden shadow-2xl">
          {/* Copy your exported Godot game files into public/game/ */}
          <GodotFrame src="/game/index.html" className="w-full h-full" />
        </div>

        <Controls />
      </div>
    </GodotBridgeProvider>
  );
}
