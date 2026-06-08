'use client';
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  accent?: boolean;
  icon?: string;
}

export default function StatCard({ label, value, sub, subColor, accent, icon }: StatCardProps) {
  return (
    <div
      className={`card p-5 flex flex-col gap-3 ${accent ? 'border-acid/30 glow-acid' : ''}`}
      style={accent ? { background: 'linear-gradient(135deg, #0e0c09 0%, #1a1f0a 100%)' } : {}}
    >
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        {icon && <span className="text-ink-600 text-lg">{icon}</span>}
      </div>
      <div>
        <div
          className="metric-value"
          style={accent ? { color: '#c8f53a' } : {}}
        >
          {value}
        </div>
        {sub && (
          <div className="text-xs font-mono mt-1" style={{ color: subColor || '#6b6152' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
