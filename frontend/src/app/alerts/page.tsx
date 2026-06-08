'use client';
import React, { useState } from 'react';
import AlertCard from '@/components/AlertCard';
import { ALERTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const totalSavings = alerts.reduce((s, a) => s + a.savings, 0);

  const bySeverity = {
    critical: alerts.filter(a => a.severity === 'critical'),
    high: alerts.filter(a => a.severity === 'high'),
    medium: alerts.filter(a => a.severity === 'medium'),
    low: alerts.filter(a => a.severity === 'low'),
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#f7f6f3' }}>Alerts</h1>
          <p className="text-sm text-ink-500 font-mono mt-0.5">
            {alerts.length} active · {formatCurrency(totalSavings, true)} potential savings
          </p>
        </div>
        <button
          onClick={() => setAlerts([])}
          className="px-4 py-2 text-sm font-mono rounded-xl border border-ink-800 text-ink-400 hover:text-ink-200 hover:border-ink-600 transition-all">
          Dismiss all
        </button>
      </div>

      {/* Severity sections */}
      {Object.entries(bySeverity).map(([sev, items]) => {
        if (!items.length) return null;
        const sevColors = {
          critical: '#ff5c35',
          high: '#f59e0b',
          medium: '#3a8fff',
          low: '#6b6152',
        };
        return (
          <div key={sev} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: sevColors[sev as keyof typeof sevColors] }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: sevColors[sev as keyof typeof sevColors] }}>
                {sev} · {items.length} alert{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {items.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
                />
              ))}
            </div>
          </div>
        );
      })}

      {alerts.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4" style={{ color: '#c8f53a' }}>⬡</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#f7f6f3' }}>All clear</p>
          <p className="text-sm text-ink-500 mt-2">No active alerts. Your SaaS stack is optimized.</p>
        </div>
      )}
    </div>
  );
}
