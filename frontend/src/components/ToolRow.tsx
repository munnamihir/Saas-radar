'use client';
import React from 'react';
import { formatCurrency, formatDate, daysUntil, usagePercent, usageColor } from '@/lib/utils';

const STATUS_BADGE = {
  danger: 'badge-danger',
  warn: 'badge-warn',
  ok: 'badge-ok',
};

const STATUS_LABEL = {
  danger: 'Flagged',
  warn: 'Warning',
  ok: 'Healthy',
};

export default function ToolRow({ tool }: { tool: any }) {
  const pct = usagePercent(tool.seats.active, tool.seats.total);
  const barColor = usageColor(pct);
  const days = daysUntil(tool.renewal);
  const renewalUrgent = days < 30;

  return (
    <tr className="border-b border-ink-800/50 hover:bg-ink-900/50 transition-colors group">
      {/* Tool */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-medium flex-shrink-0"
            style={{ background: `${tool.color}22`, color: tool.color, border: `1px solid ${tool.color}33` }}
          >
            {tool.logo}
          </div>
          <div>
            <div className="text-sm text-ink-100 font-medium">{tool.name}</div>
            <div className="text-xs text-ink-500">{tool.category}</div>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-3">
        <span className="text-xs text-ink-400">{tool.department}</span>
      </td>

      {/* Seats */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-ink-800 flex-shrink-0">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
          <span className="text-xs font-mono text-ink-400">
            {tool.seats.active}/{tool.seats.total}
          </span>
        </div>
      </td>

      {/* Cost */}
      <td className="px-4 py-3">
        <div className="text-sm text-ink-200 font-mono">{formatCurrency(tool.annualCost, true)}/yr</div>
        <div className="text-xs text-ink-500 font-mono">{formatCurrency(tool.monthlyCost)}/mo</div>
      </td>

      {/* Savings */}
      <td className="px-4 py-3">
        {tool.savings > 0 ? (
          <span className="text-sm font-mono" style={{ color: '#c8f53a' }}>
            {formatCurrency(tool.savings, true)}
          </span>
        ) : (
          <span className="text-sm font-mono text-ink-700">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <div>
          <span className={`badge ${STATUS_BADGE[tool.status as keyof typeof STATUS_BADGE]}`}>
            {STATUS_LABEL[tool.status as keyof typeof STATUS_LABEL]}
          </span>
          {tool.issue && (
            <div className="text-xs text-ink-500 mt-1">{tool.issue}</div>
          )}
        </div>
      </td>

      {/* Renewal */}
      <td className="px-4 py-3">
        <div className={`text-xs font-mono ${renewalUrgent ? 'text-ember' : 'text-ink-400'}`}>
          {formatDate(tool.renewal)}
        </div>
        <div className={`text-xs ${renewalUrgent ? 'text-ember/70' : 'text-ink-600'}`}>
          in {days}d
        </div>
      </td>

      {/* Billing */}
      <td className="px-4 py-3">
        <span className="text-xs text-ink-500">{tool.billingSource}</span>
      </td>
    </tr>
  );
}
