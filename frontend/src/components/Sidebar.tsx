'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', icon: '◈', label: 'Overview' },
  { href: '/tools', icon: '⬡', label: 'Tools' },
  { href: '/alerts', icon: '◉', label: 'Alerts', badge: 6 },
  { href: '/integrations', icon: '⬢', label: 'Integrations' },
  { href: '/settings', icon: '◎', label: 'Settings' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-6 gap-1 border-r border-ink-800 bg-ink-950 z-50">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #c8f53a 0%, #a8d420 100%)' }}>
          <span style={{ fontFamily: 'var(--font-display)', color: '#0e0c09', fontSize: 14, fontWeight: 700 }}>R</span>
        </div>
      </div>

      {NAV.map((item) => {
        const active = path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 group ${
              active
                ? 'bg-acid/10 text-acid'
                : 'text-ink-500 hover:text-ink-300 hover:bg-ink-800'
            }`}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ember text-white text-[9px] flex items-center justify-center font-mono">
                {item.badge}
              </span>
            )}
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1 bg-ink-800 text-ink-100 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-ink-700">
              {item.label}
            </span>
          </Link>
        );
      })}

      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-ink-800 flex items-center justify-center text-xs font-mono text-ink-400 cursor-pointer hover:bg-ink-700 transition-colors">
          MH
        </div>
      </div>
    </aside>
  );
}
