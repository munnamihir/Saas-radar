export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function usagePercent(active: number, total: number): number {
  return Math.round((active / total) * 100);
}

export function usageColor(pct: number): string {
  if (pct < 60) return '#ff5c35';
  if (pct < 80) return '#f59e0b';
  return '#c8f53a';
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'danger': return 'Flagged';
    case 'warn': return 'Warning';
    case 'ok': return 'Healthy';
    default: return 'Unknown';
  }
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
