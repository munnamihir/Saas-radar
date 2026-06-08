'use client';
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

const SEVERITY_STYLES = {
  critical: { border: '#ff5c35', bg: 'rgba(255,92,53,0.06)', dot: '#ff5c35', label: 'Critical' },
  high: { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)', dot: '#f59e0b', label: 'High' },
  medium: { border: '#3a8fff', bg: 'rgba(58,143,255,0.06)', dot: '#3a8fff', label: 'Medium' },
  low: { border: '#6b6152', bg: 'rgba(107,97,82,0.06)', dot: '#6b6152', label: 'Low' },
};

const TYPE_ICONS = {
  trial: '⏱',
  seats: '◉',
  overlap: '⬡',
  duplicate: '⬢',
  renewal: '◈',
};

interface Alert {
  id: string;
  type: string;
  severity: string;
  tool: string;
  message: string;
  action: string;
  daysLeft: number | null;
  savings: number;
}

export default function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss?: (id: string) => void }) {
  const [dismissed, setDismissed] = useState(false);
  const style = SEVERITY_STYLES[alert.severity as keyof typeof SEVERITY_STYLES];
  const icon = TYPE_ICONS[alert.type as keyof typeof TYPE_ICONS] || '◉';

  if (dismissed) return null;

  return (
    <div
      className="rounded-xl p-4 border transition-all duration-300"
      style={{ borderColor: style.border, background: style.bg }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: `${style.border}22`, color: style.border }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-ink-100">{alert.tool}</span>
            {alert.daysLeft !== null && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ background: `${style.border}22`, color: style.border }}>
                {alert.daysLeft}d
              </span>
            )}
            <span className="ml-auto text-xs font-mono" style={{ color: '#c8f53a' }}>
              save {formatCurrency(alert.savings, true)}
            </span>
          </div>
          <p className="text-xs text-ink-400 leading-relaxed mb-3">{alert.message}</p>
          <div className="flex items-center gap-2">
            <button
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all"
              style={{ borderColor: style.border, color: style.border, background: `${style.border}11` }}
            >
              {alert.action} →
            </button>
            <button
              onClick={() => { setDismissed(true); onDismiss?.(alert.id); }}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-ink-800 text-ink-500 hover:text-ink-300 hover:border-ink-600 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
