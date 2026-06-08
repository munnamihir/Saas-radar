'use client';
import React, { useState } from 'react';

const SOURCES = [
  { id: 'plaid', name: 'Plaid', icon: '🏦', desc: 'Bank & card transactions', color: '#00D395' },
  { id: 'ramp', name: 'Ramp', icon: '💳', desc: 'Corporate card spend', color: '#F5C518' },
  { id: 'brex', name: 'Brex', icon: '💳', desc: 'Corporate card spend', color: '#4A90E2' },
  { id: 'okta', name: 'Okta', icon: '🔑', desc: 'SSO & seat activity', color: '#007DC1' },
  { id: 'google', name: 'Google WS', icon: '🔵', desc: 'App usage & logins', color: '#4285F4' },
  { id: 'azure', name: 'Azure AD', icon: '🪟', desc: 'Identity & access', color: '#0078D4' },
];

export default function ConnectBanner({ onDismiss }: { onDismiss: () => void }) {
  const [connected, setConnected] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  const connect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnected(prev => [...prev, id]);
      setConnecting(null);
    }, 1200);
  };

  return (
    <div className="card p-5 mb-6 relative overflow-hidden"
      style={{ borderColor: '#c8f53a33', background: 'linear-gradient(135deg, #0e0c09 0%, #1a1f0a 100%)' }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 50%, rgba(200,245,58,0.06) 0%, transparent 70%)'
      }} />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#c8f53a', fontSize: 12 }}>⬡</span>
            <span className="metric-label" style={{ color: '#c8f53a' }}>Connect data sources</span>
          </div>
          <p className="text-sm text-ink-300">Connect your billing and identity providers to start detecting waste automatically.</p>
        </div>
        <button onClick={onDismiss} className="text-ink-600 hover:text-ink-400 text-lg transition-colors">×</button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {SOURCES.map((src) => {
          const isConnected = connected.includes(src.id);
          const isConnecting = connecting === src.id;
          return (
            <button
              key={src.id}
              onClick={() => !isConnected && connect(src.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 ${
                isConnected
                  ? 'border-acid/40 bg-acid/5 cursor-default'
                  : 'border-ink-800 bg-ink-900/50 hover:border-ink-600 hover:bg-ink-800/50 cursor-pointer'
              }`}
            >
              <span className="text-xl">{src.icon}</span>
              <span className="text-xs font-medium text-ink-200">{src.name}</span>
              {isConnecting ? (
                <span className="text-[10px] font-mono" style={{ color: '#c8f53a' }}>Connecting…</span>
              ) : isConnected ? (
                <span className="text-[10px] font-mono" style={{ color: '#c8f53a' }}>✓ Connected</span>
              ) : (
                <span className="text-[10px] font-mono text-ink-500">Connect →</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
