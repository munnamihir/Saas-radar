'use client';
import React, { useState } from 'react';

const INTEGRATIONS = [
  {
    id: 'plaid',
    name: 'Plaid',
    category: 'Billing',
    desc: 'Connect your bank and credit card accounts to automatically detect all SaaS charges.',
    features: ['Auto-detect all card charges', 'Merchant name normalization', 'Historical spend import'],
    status: 'available',
    logo: '🏦',
    color: '#00D395',
  },
  {
    id: 'ramp',
    name: 'Ramp',
    category: 'Billing',
    desc: 'Pull spend data directly from your Ramp corporate card with per-employee breakdown.',
    features: ['Per-card spend visibility', 'Real-time transactions', 'Vendor consolidation'],
    status: 'connected',
    logo: '💳',
    color: '#F5C518',
  },
  {
    id: 'brex',
    name: 'Brex',
    category: 'Billing',
    desc: 'Sync Brex card transactions and get category-level spend intelligence.',
    features: ['Automatic categorization', 'Budget tracking', 'Receipt sync'],
    status: 'available',
    logo: '💳',
    color: '#4A90E2',
  },
  {
    id: 'okta',
    name: 'Okta',
    category: 'Identity',
    desc: 'Connect your Okta directory to see every app employees use and when they last logged in.',
    features: ['Last login timestamps', 'Seat activity heatmaps', 'App provisioning audit'],
    status: 'available',
    logo: '🔑',
    color: '#007DC1',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    category: 'Identity',
    desc: 'Pull OAuth app grants and login activity from Google Workspace.',
    features: ['OAuth app discovery', 'User login activity', 'App access audit'],
    status: 'connected',
    logo: '🔵',
    color: '#4285F4',
  },
  {
    id: 'azure',
    name: 'Azure AD',
    category: 'Identity',
    desc: 'Discover all enterprise apps and track user activity from Azure Active Directory.',
    features: ['Enterprise app catalog', 'Conditional access audit', 'License reconciliation'],
    status: 'available',
    logo: '🪟',
    color: '#0078D4',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Comms',
    desc: 'Audit Slack app installs and see which integrations are actively used.',
    features: ['App install discovery', 'Usage frequency', 'Billing reconciliation'],
    status: 'available',
    logo: '💬',
    color: '#4A154B',
  },
  {
    id: 'stripe',
    name: 'Stripe (vendor)',
    category: 'Billing',
    desc: 'If you use Stripe Billing, connect as vendor to see subscription churn signals.',
    features: ['Subscription data', 'Failed payment alerts', 'Churn risk'],
    status: 'coming_soon',
    logo: '⚡',
    color: '#635BFF',
  },
];

export default function IntegrationsPage() {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>(['ramp', 'google']);

  const connect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnected(prev => [...prev, id]);
      setConnecting(null);
    }, 1500);
  };

  const categories = [...new Set(INTEGRATIONS.map(i => i.category))];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#f7f6f3' }}>Integrations</h1>
        <p className="text-sm text-ink-500 font-mono mt-0.5">
          Connect your billing and identity providers to detect waste automatically
        </p>
      </div>

      {/* Connected summary */}
      <div className="card p-4 mb-6 flex items-center gap-4"
        style={{ borderColor: '#c8f53a33', background: 'linear-gradient(135deg, #0e0c09 0%, #1a1f0a 100%)' }}>
        <div className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: '#c8f53a' }}>
          {connected.length}
        </div>
        <div>
          <div className="text-sm text-ink-200 font-medium">sources connected</div>
          <div className="text-xs text-ink-500 font-mono">Last synced 2 minutes ago</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-slow" />
          <span className="text-xs font-mono text-ink-400">Live</span>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-500">{cat}</span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INTEGRATIONS.filter(i => i.category === cat).map(integration => {
              const isConnected = connected.includes(integration.id);
              const isConnecting = connecting === integration.id;
              const isComingSoon = integration.status === 'coming_soon';

              return (
                <div key={integration.id}
                  className={`card p-5 transition-all duration-200 ${isConnected ? 'border-acid/20' : 'card-hover'}`}
                  style={isConnected ? { background: 'linear-gradient(135deg, #0e0c09 0%, #101808 100%)' } : {}}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${integration.color}18`, border: `1px solid ${integration.color}30` }}>
                      {integration.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-ink-100">{integration.name}</span>
                        {isConnected && (
                          <span className="badge" style={{ background: 'rgba(200,245,58,0.1)', color: '#c8f53a', border: '1px solid rgba(200,245,58,0.2)', fontSize: 9 }}>
                            ✓ Connected
                          </span>
                        )}
                        {isComingSoon && (
                          <span className="badge badge-info" style={{ fontSize: 9 }}>Coming soon</span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500 mb-3 leading-relaxed">{integration.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {integration.features.map(f => (
                          <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ink-800 text-ink-500">
                            {f}
                          </span>
                        ))}
                      </div>
                      {!isComingSoon && (
                        <button
                          onClick={() => !isConnected && connect(integration.id)}
                          disabled={isConnected || isConnecting}
                          className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all"
                          style={isConnected
                            ? { borderColor: 'rgba(200,245,58,0.2)', color: '#c8f53a', background: 'rgba(200,245,58,0.05)', cursor: 'default' }
                            : { borderColor: '#574e42', color: '#bfb9a8', background: 'transparent' }}>
                          {isConnecting ? 'Connecting…' : isConnected ? '✓ Connected' : 'Connect →'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
