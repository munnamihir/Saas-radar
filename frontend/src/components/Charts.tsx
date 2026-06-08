'use client';
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { SPEND_BY_MONTH, CATEGORY_BREAKDOWN } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="card px-3 py-2 text-xs font-mono">
        <div className="text-ink-400 mb-1">{label}</div>
        <div className="text-acid font-medium">{formatCurrency(payload[0].value)}</div>
      </div>
    );
  }
  return null;
}

export function SpendTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={SPEND_BY_MONTH} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8f53a" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#c8f53a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3c352e" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#6b6152', fontSize: 11, fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b6152', fontSize: 11, fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v / 1000}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#c8f53a"
          strokeWidth={2}
          fill="url(#spendGrad)"
          dot={{ fill: '#c8f53a', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#c8f53a', r: 5, strokeWidth: 2, stroke: '#0e0c09' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
  if (percent < 0.07) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="rgba(247,246,243,0.8)"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontFamily="var(--font-mono)"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function CategoryPieChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={CATEGORY_BREAKDOWN}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={CustomLabel}
        >
          {CATEGORY_BREAKDOWN.map((entry, index) => (
            <Cell key={index} fill={entry.color} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [formatCurrency(value), '']}
          contentStyle={{
            background: '#1c1a16',
            border: '1px solid #3c352e',
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#f7f6f3',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
