/**
 * Detection engine.
 * Runs heuristic checks across tool data to surface waste:
 * - Inactive seats (no login in N days)
 * - Overlapping tools (same category, both active)
 * - Trial conversions about to happen
 * - Renewal alerts
 * - Department duplicates (same tool billed by multiple departments)
 */

export interface Tool {
  id: string;
  name: string;
  category: string;
  seats: { total: number; active: number };
  annualCost: number;
  monthlyCost: number;
  renewal: string;
  lastActivity?: string;
  department?: string;
  isTrial?: boolean;
}

export interface Alert {
  id: string;
  type: 'seats' | 'overlap' | 'trial' | 'renewal' | 'duplicate';
  severity: 'critical' | 'high' | 'medium' | 'low';
  tool: string;
  relatedTool?: string;
  message: string;
  savings: number;
  action: string;
  daysLeft?: number;
}

function daysBetween(a: string, b: string = new Date().toISOString()): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function daysUntil(date: string): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export function detectInactiveSeats(
  tool: Tool,
  thresholdDays = 90
): Alert | null {
  const unusedSeats = tool.seats.total - tool.seats.active;
  if (unusedSeats <= 0) return null;

  const unusedRatio = unusedSeats / tool.seats.total;
  const costPerSeat = tool.annualCost / tool.seats.total;
  const wastedAnnual = Math.round(unusedSeats * costPerSeat);

  // Last activity check
  const daysSinceActivity = tool.lastActivity
    ? daysBetween(tool.lastActivity)
    : 999;

  if (unusedRatio < 0.1 || wastedAnnual < 500) return null;

  const severity: Alert['severity'] =
    unusedRatio > 0.5 ? 'high'
    : unusedRatio > 0.3 ? 'medium'
    : 'low';

  return {
    id: `seats-${tool.id}`,
    type: 'seats',
    severity,
    tool: tool.name,
    message: `${unusedSeats} of ${tool.seats.total} seats inactive for ${daysSinceActivity}+ days. ${Math.round(unusedRatio * 100)}% waste.`,
    savings: wastedAnnual,
    action: unusedRatio > 0.4 ? 'Downgrade plan' : 'Reclaim seats',
  };
}

export function detectOverlappingTools(tools: Tool[]): Alert[] {
  const alerts: Alert[] = [];
  const byCategory: Record<string, Tool[]> = {};

  for (const tool of tools) {
    if (!byCategory[tool.category]) byCategory[tool.category] = [];
    byCategory[tool.category].push(tool);
  }

  for (const [category, categoryTools] of Object.entries(byCategory)) {
    if (categoryTools.length < 2) continue;

    // Sort by usage descending — the highest-usage tool is the keeper
    const sorted = [...categoryTools].sort(
      (a, b) => (b.seats.active / b.seats.total) - (a.seats.active / a.seats.total)
    );

    const keeper = sorted[0];
    const redundant = sorted.slice(1);

    for (const tool of redundant) {
      const savings = tool.annualCost;
      alerts.push({
        id: `overlap-${tool.id}-${keeper.id}`,
        type: 'overlap',
        severity: savings > 20000 ? 'high' : 'medium',
        tool: tool.name,
        relatedTool: keeper.name,
        message: `${tool.name} and ${keeper.name} both serve ${category}. ${keeper.name} has higher adoption (${Math.round(keeper.seats.active/keeper.seats.total*100)}%). Consolidate to save ${formatK(savings)}.`,
        savings,
        action: `Migrate to ${keeper.name}`,
      });
    }
  }

  return alerts;
}

export function detectTrialConversions(tools: Tool[]): Alert[] {
  return tools
    .filter(t => t.isTrial && daysUntil(t.renewal) < 14)
    .map(t => ({
      id: `trial-${t.id}`,
      type: 'trial' as const,
      severity: daysUntil(t.renewal) < 4 ? 'critical' as const : 'high' as const,
      tool: t.name,
      message: `Free trial auto-converts to ${formatK(t.annualCost)}/yr in ${daysUntil(t.renewal)} days. Review before billing starts.`,
      savings: t.annualCost,
      action: 'Review now',
      daysLeft: daysUntil(t.renewal),
    }));
}

export function detectUpcomingRenewals(tools: Tool[], windowDays = 30): Alert[] {
  return tools
    .filter(t => {
      const days = daysUntil(t.renewal);
      return days > 0 && days <= windowDays;
    })
    .map(t => {
      const days = daysUntil(t.renewal);
      const unusedSeats = t.seats.total - t.seats.active;
      const negotiationNote = unusedSeats > 0
        ? ` ${unusedSeats} unused seats — negotiate before signing.`
        : '';
      return {
        id: `renewal-${t.id}`,
        type: 'renewal' as const,
        severity: days < 7 ? 'high' as const : 'medium' as const,
        tool: t.name,
        message: `Renewal in ${days} days (${formatCurrency(t.annualCost)}/yr).${negotiationNote}`,
        savings: unusedSeats > 0 ? Math.round((unusedSeats / t.seats.total) * t.annualCost) : 0,
        action: unusedSeats > 0 ? 'Prep negotiation' : 'Review contract',
        daysLeft: days,
      };
    });
}

export function runAllDetectors(tools: Tool[], config = { inactiveDays: 90, renewalWindow: 30 }): Alert[] {
  const alerts: Alert[] = [];

  // Per-tool checks
  for (const tool of tools) {
    const seatAlert = detectInactiveSeats(tool, config.inactiveDays);
    if (seatAlert) alerts.push(seatAlert);
  }

  // Cross-tool checks
  alerts.push(...detectOverlappingTools(tools));
  alerts.push(...detectTrialConversions(tools));
  alerts.push(...detectUpcomingRenewals(tools, config.renewalWindow));

  // Sort by severity
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatK(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : formatCurrency(n);
}
