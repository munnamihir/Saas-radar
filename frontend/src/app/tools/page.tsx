'use client';
import React, { useState, useMemo } from 'react';
import { TOOLS } from '@/lib/mockData';
import { formatCurrency, usagePercent, usageColor, formatDate, daysUntil } from '@/lib/utils';

type SortKey = 'name' | 'annualCost' | 'savings' | 'renewal' | 'usage';
type FilterStatus = 'all' | 'danger' | 'warn' | 'ok';

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FilterStatus>('all');
  const [sort, setSort] = useState<SortKey>('annualCost');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let items = [...TOOLS];
    if (search) items = items.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
    if (status !== 'all') items = items.filter(t => t.status === status);
    items.sort((a, b) => {
      let va: any, vb: any;
      if (sort === 'name') { va = a.name; vb = b.name; }
      else if (sort === 'annualCost') { va = a.annualCost; vb = b.annualCost; }
      else if (sort === 'savings') { va = a.savings; vb = b.savings; }
      else if (sort === 'renewal') { va = new Date(a.renewal).getTime(); vb = new Date(b.renewal).getTime(); }
      else if (sort === 'usage') { va = usagePercent(a.seats.active, a.seats.total); vb = usagePercent(b.seats.active, b.seats.total); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
  }, [search, status, sort, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sort === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(key); setSortDir('desc'); }
  };

  const totalFiltered = filtered.reduce((s, t) => s + t.annualCost, 0);
  const totalSavings = filtered.reduce((s, t) => s + t.savings, 0);

  const statusCounts = {
    all: TOOLS.length,
    danger: TOOLS.filter(t => t.status === 'danger').length,
    warn: TOOLS.filter(t => t.status === 'warn').length,
    ok: TOOLS.filter(t => t.status === 'ok').length,
  };

  const SortArrow = ({ k }: { k: SortKey }) => (
    <span className="ml-1 text-ink-600">
      {sort === k ? (sortDir === 'desc' ? '↓' : '↑') : '·'}
    </span>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#f7f6f3' }}>Tools</h1>
          <p className="text-sm text-ink-500 font-mono mt-0.5">{TOOLS.length} subscriptions tracked</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#c8f53a', color: '#0e0c09' }}>
          + Add tool
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tools, departments…"
          className="flex-1 max-w-xs px-3 py-2 text-sm rounded-xl border border-ink-800 bg-ink-900 text-ink-200 placeholder-ink-600 focus:outline-none focus:border-ink-600 font-mono"
        />
        <div className="flex items-center gap-1 p-1 rounded-xl border border-ink-800 bg-ink-900">
          {(['all', 'danger', 'warn', 'ok'] as FilterStatus[]).map(s => {
            const labels = { all: `All (${statusCounts.all})`, danger: `Flagged (${statusCounts.danger})`, warn: `Warning (${statusCounts.warn})`, ok: `Healthy (${statusCounts.ok})` };
            return (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${status === s ? 'bg-ink-700 text-ink-100' : 'text-ink-500 hover:text-ink-300'}`}>
                {labels[s]}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-xs font-mono text-ink-500">
          {filtered.length} tools · {formatCurrency(totalFiltered, true)} ·{' '}
          <span style={{ color: '#c8f53a' }}>{formatCurrency(totalSavings, true)} saveable</span>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-800">
              {[
                { label: 'Tool', key: 'name' as SortKey },
                { label: 'Department', key: null },
                { label: 'Seats', key: 'usage' as SortKey },
                { label: 'Annual cost', key: 'annualCost' as SortKey },
                { label: 'Savings', key: 'savings' as SortKey },
                { label: 'Status', key: null },
                { label: 'Renewal', key: 'renewal' as SortKey },
                { label: 'Billing source', key: null },
              ].map(({ label, key }) => (
                <th key={label}
                  onClick={() => key && handleSort(key)}
                  className={`px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-ink-600 select-none ${key ? 'cursor-pointer hover:text-ink-400' : ''}`}>
                  {label}{key && <SortArrow k={key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool) => {
              const pct = usagePercent(tool.seats.active, tool.seats.total);
              const barColor = usageColor(pct);
              const days = daysUntil(tool.renewal);
              const urgentRenewal = days < 30;
              const statusStyle = {
                danger: 'badge-danger',
                warn: 'badge-warn',
                ok: 'badge-ok',
              }[tool.status];
              const statusText = { danger: 'Flagged', warn: 'Warning', ok: 'Healthy' }[tool.status];

              return (
                <tr key={tool.id} className="border-b border-ink-800/30 hover:bg-ink-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-medium flex-shrink-0"
                        style={{ background: `${tool.color}22`, color: tool.color, border: `1px solid ${tool.color}33` }}>
                        {tool.logo}
                      </div>
                      <div>
                        <div className="text-sm text-ink-100 font-medium">{tool.name}</div>
                        <div className="text-xs text-ink-600">{tool.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-400">{tool.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-ink-800">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                      <span className="text-xs font-mono text-ink-400">{tool.seats.active}/{tool.seats.total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-ink-200">{formatCurrency(tool.annualCost, true)}/yr</div>
                    <div className="text-xs font-mono text-ink-600">{formatCurrency(tool.monthlyCost)}/mo</div>
                  </td>
                  <td className="px-4 py-3">
                    {tool.savings > 0
                      ? <span className="text-sm font-mono" style={{ color: '#c8f53a' }}>{formatCurrency(tool.savings, true)}</span>
                      : <span className="text-sm font-mono text-ink-700">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className={`badge ${statusStyle}`}>{statusText}</span>
                      {tool.issue && <div className="text-xs text-ink-500 mt-0.5">{tool.issue}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-xs font-mono ${urgentRenewal ? 'text-ember' : 'text-ink-400'}`}>
                      {formatDate(tool.renewal)}
                    </div>
                    <div className={`text-xs ${urgentRenewal ? 'text-ember/60' : 'text-ink-700'}`}>in {days}d</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">{tool.billingSource}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
