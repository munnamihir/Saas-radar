'use client';
import React, { useState } from 'react';

export default function SettingsPage() {
  const [alertEmail, setAlertEmail] = useState('finance@acme.com');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [thresholdDays, setThresholdDays] = useState(90);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#f7f6f3' }}>Settings</h1>
        <p className="text-sm text-ink-500 font-mono mt-0.5">Configure alerting and detection thresholds</p>
      </div>

      <div className="space-y-6">
        {/* Alerts */}
        <div className="card p-5">
          <div className="text-sm font-medium text-ink-200 mb-4">Alert delivery</div>
          <div className="space-y-4">
            <div>
              <label className="metric-label block mb-2">Email address</label>
              <input
                type="email"
                value={alertEmail}
                onChange={e => setAlertEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-ink-800 bg-ink-900 text-ink-200 focus:outline-none focus:border-ink-600 font-mono"
              />
              <p className="text-xs text-ink-600 mt-1">Receive weekly digest and critical alerts</p>
            </div>
            <div>
              <label className="metric-label block mb-2">Slack webhook URL</label>
              <input
                type="url"
                value={slackWebhook}
                onChange={e => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-ink-800 bg-ink-900 text-ink-200 placeholder-ink-700 focus:outline-none focus:border-ink-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Detection */}
        <div className="card p-5">
          <div className="text-sm font-medium text-ink-200 mb-4">Detection thresholds</div>
          <div className="space-y-4">
            <div>
              <label className="metric-label block mb-2">Inactive seat threshold (days)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={14} max={180} step={7}
                  value={thresholdDays}
                  onChange={e => setThresholdDays(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono text-ink-200 w-12 text-right">{thresholdDays}d</span>
              </div>
              <p className="text-xs text-ink-600 mt-1">Flag seats with no login activity beyond this window</p>
            </div>
            <div>
              <label className="metric-label block mb-2">Renewal warning window (days)</label>
              <div className="flex items-center gap-3">
                <input type="range" min={7} max={90} step={7} defaultValue={30} className="flex-1" />
                <span className="text-sm font-mono text-ink-200 w-12 text-right">30d</span>
              </div>
              <p className="text-xs text-ink-600 mt-1">Alert before subscription renewals in this window</p>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="card p-5">
          <div className="text-sm font-medium text-ink-200 mb-4">Data</div>
          <div className="flex items-center justify-between py-2 border-b border-ink-800">
            <div>
              <div className="text-sm text-ink-200">Demo mode</div>
              <div className="text-xs text-ink-600">Using sample data — connect real sources in Integrations</div>
            </div>
            <div className="w-10 h-5 rounded-full border border-acid/40 bg-acid/10 relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full" style={{ background: '#c8f53a' }} />
            </div>
          </div>
          <div className="pt-3">
            <button className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-900 text-red-500 hover:border-red-700 transition-all">
              Reset all data
            </button>
          </div>
        </div>

        <button onClick={save}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: saved ? '#3B6D11' : '#c8f53a', color: saved ? '#c0dd97' : '#0e0c09' }}>
          {saved ? '✓ Saved' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
