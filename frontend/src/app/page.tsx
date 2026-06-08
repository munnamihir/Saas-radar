'use client';
import React, { useState } from 'react';
import StatCard from '@/components/StatCard';
import AlertCard from '@/components/AlertCard';
import { SpendTrendChart, CategoryPieChart } from '@/components/Charts';
import ConnectBanner from '@/components/ConnectBanner';
import { TOOLS, ALERTS, STATS, CATEGORY_BREAKDOWN } from '@/lib/mockData';
import { formatCurrency, usagePercent, usageColor, formatDate, daysUntil } from '@/lib/utils';

export default function DashboardPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState(ALERTS.map(a => a.id));

  const totalPotential = ALERTS.reduce((sum, a) => sum + a.savings, 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#f7f6f3' }}>
            SaaS Radar
          </h1>
          <p className="text-sm text-ink-500 font-mono mt-0.5">
            73 tools · {formatDate(new Date().toISOString())} · Demo workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink-800 bg-ink-900">
            <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-slow" />
            <span className="text-xs font-mono text-ink-400">Live sync</span>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#c8f53a', color: '#0e0c09' }}>
            Export report
          </button>
        </div>
      </div>

      {/* Connect banner */}
      {showBanner && <ConnectBanner onDismiss={() => setShowBanner(false)} />}

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Annual spend"
          value={formatCurrency(STATS.annualizedSpend, true)}
          sub="↑ 34% vs last year"
          subColor="#ff5c35"
          icon="◈"
        />
        <StatCard
          label="Savings identified"
          value={formatCurrency(STATS.totalSavings, true)}
          sub={`across ${STATS.flaggedTools} tools`}
          accent
          icon="⬡"
        />
        <StatCard
          label="Unused seats"
          value={STATS.unusedSeats.toLocaleString()}
          sub={`${formatCurrency(STATS.unusedSeatCost, true)} wasted / yr`}
          subColor="#f59e0b"
          icon="◉"
        />
        <StatCard
          label="Active tools"
          value={STATS.totalTools.toString()}
          sub={`${STATS.departments} departments`}
          icon="⬢"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Spend trend */}
        <div className="card p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="metric-label mb-1">Monthly spend</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f7f6f3' }}>
                {formatCurrency(70583)}
              </div>
            </div>
            <div className="text-xs font-mono px-2 py-1 rounded-lg border border-red-800 bg-red-950 text-red-400">
              ↑ $8,383 MoM
            </div>
          </div>
          <SpendTrendChart />
        </div>

        {/* Category breakdown */}
        <div className="card p-5">
          <div className="metric-label mb-4">By category</div>
          <CategoryPieChart />
          <div className="mt-3 space-y-1.5">
            {CATEGORY_BREAKDOWN.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <span className="text-ink-400 font-mono">{cat.name}</span>
                </div>
                <span className="text-ink-300 font-mono">{formatCurrency(cat.value, true)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + top tools */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Alerts */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="metric-label">Optimization alerts</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: '#c8f53a' }}>
                {formatCurrency(totalPotential, true)} potential
              </span>
              <span className="badge badge-danger">{activeAlerts.length}</span>
            </div>
          </div>
          <div className="space-y-2">
            {ALERTS.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={(id) => setActiveAlerts(prev => prev.filter(a => a !== id))}
              />
            ))}
          </div>
        </div>

        {/* Top tools table */}
        <div className="md:col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-ink-800">
            <div className="metric-label">Top tools by spend</div>
            <a href="/tools" className="text-xs font-mono text-ink-500 hover:text-ink-300 transition-colors">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800/50">
                  {['Tool', 'Dept', 'Usage', 'Annual', 'Save', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-mono uppercase tracking-widest text-ink-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOOLS.sort((a, b) => b.annualCost - a.annualCost).slice(0, 8).map((tool) => {
                  const pct = usagePercent(tool.seats.active, tool.seats.total);
                  const barColor = usageColor(pct);
                  const statusColors = { danger: 'badge-danger', warn: 'badge-warn', ok: 'badge-ok' };
                  const statusLabels = { danger: 'Flagged', warn: 'Warning', ok: 'Healthy' };
                  return (
                    <tr key={tool.id} className="border-b border-ink-800/30 hover:bg-ink-900/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-medium flex-shrink-0"
                            style={{ background: `${tool.color}22`, color: tool.color, border: `1px solid ${tool.color}33` }}>
                            {tool.logo}
                          </div>
                          <span className="text-sm text-ink-200">{tool.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-ink-500">{tool.department}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 rounded-full bg-ink-800">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <span className="text-[10px] font-mono text-ink-500">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-ink-300">
                          {formatCurrency(tool.annualCost, true)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {tool.savings > 0 ? (
                          <span className="text-sm font-mono" style={{ color: '#c8f53a' }}>
                            {formatCurrency(tool.savings, true)}
                          </span>
                        ) : (
                          <span className="text-sm font-mono text-ink-700">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusColors[tool.status as keyof typeof statusColors]}`}>
                          {statusLabels[tool.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom renewal calendar strip */}
      <div className="card p-5">
        <div className="metric-label mb-4">Upcoming renewals</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOOLS
            .filter(t => daysUntil(t.renewal) < 120)
            .sort((a, b) => daysUntil(a.renewal) - daysUntil(b.renewal))
            .slice(0, 4)
            .map((tool) => {
              const days = daysUntil(tool.renewal);
              const urgent = days < 30;
              return (
                <div key={tool.id}
                  className={`p-3 rounded-xl border transition-all ${urgent ? 'border-ember/40 bg-ember/5' : 'border-ink-800 bg-ink-900/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-ink-200">{tool.name}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: urgent ? 'rgba(255,92,53,0.15)' : 'rgba(200,245,58,0.1)',
                        color: urgent ? '#ff5c35' : '#c8f53a'
                      }}>
                      {days}d
                    </span>
                  </div>
                  <div className="text-xs text-ink-500 font-mono">{formatDate(tool.renewal)}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: urgent ? '#f59e0b' : '#6b6152' }}>
                    {formatCurrency(tool.annualCost, true)}/yr
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
