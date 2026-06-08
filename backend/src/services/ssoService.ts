/**
 * Okta + Google Workspace integration.
 * Fetches app assignments and last login timestamps to power
 * the inactive seat detection engine.
 */

import axios from 'axios';

export interface SeatActivity {
  userId: string;
  email: string;
  appId: string;
  appName: string;
  lastLogin: string | null;
  isActive: boolean;
}

export interface AppSeatSummary {
  appName: string;
  totalSeats: number;
  activeSeats: number;
  inactiveSeats: number;
  lastActivity: string | null;
}

// Okta
export async function fetchOktaAppSummaries(
  domain: string,
  apiToken: string,
  thresholdDays = 90
): Promise<AppSeatSummary[]> {
  if (process.env.DEMO_MODE === 'true') {
    return getMockSeatSummaries();
  }

  const baseUrl = `https://${domain}/api/v1`;
  const headers = { Authorization: `SSWS ${apiToken}` };

  // 1. Get all apps
  const appsRes = await axios.get(`${baseUrl}/apps?limit=200`, { headers });
  const apps = appsRes.data;

  const summaries: AppSeatSummary[] = [];

  for (const app of apps) {
    // 2. Get users for each app
    const usersRes = await axios.get(`${baseUrl}/apps/${app.id}/users?limit=200`, { headers });
    const users = usersRes.data;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - thresholdDays);

    let activeCount = 0;
    let lastActivity: string | null = null;

    for (const user of users) {
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
      const isActive = lastLogin ? lastLogin > cutoff : false;
      if (isActive) activeCount++;
      if (lastLogin && (!lastActivity || lastLogin.toISOString() > lastActivity)) {
        lastActivity = lastLogin.toISOString();
      }
    }

    summaries.push({
      appName: app.label,
      totalSeats: users.length,
      activeSeats: activeCount,
      inactiveSeats: users.length - activeCount,
      lastActivity,
    });
  }

  return summaries;
}

// Google Workspace (uses Admin SDK via service account)
export async function fetchGoogleWorkspaceApps(
  accessToken: string
): Promise<AppSeatSummary[]> {
  if (process.env.DEMO_MODE === 'true') {
    return getMockSeatSummaries();
  }

  const res = await axios.get(
    'https://admin.googleapis.com/admin/directory/v1/users?customer=my_customer&maxResults=200',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  // Real implementation would cross-reference with Google token scopes
  // and last login timestamps per user
  return [];
}

function getMockSeatSummaries(): AppSeatSummary[] {
  return [
    { appName: 'Salesforce', totalSeats: 200, activeSeats: 113, inactiveSeats: 87, lastActivity: '2024-01-10T09:00:00Z' },
    { appName: 'Slack', totalSeats: 310, activeSeats: 295, inactiveSeats: 15, lastActivity: '2024-01-13T14:00:00Z' },
    { appName: 'Figma', totalSeats: 120, activeSeats: 98, inactiveSeats: 22, lastActivity: '2024-01-13T10:00:00Z' },
    { appName: 'GitHub', totalSeats: 95, activeSeats: 91, inactiveSeats: 4, lastActivity: '2024-01-13T18:00:00Z' },
    { appName: 'Zoom', totalSeats: 300, activeSeats: 180, inactiveSeats: 120, lastActivity: '2024-01-11T11:00:00Z' },
    { appName: 'HubSpot', totalSeats: 40, activeSeats: 31, inactiveSeats: 9, lastActivity: '2024-01-08T16:00:00Z' },
    { appName: 'Loom', totalSeats: 25, activeSeats: 8, inactiveSeats: 17, lastActivity: '2023-11-20T10:00:00Z' },
    { appName: 'Notion', totalSeats: 50, activeSeats: 50, inactiveSeats: 0, lastActivity: '2024-01-13T12:00:00Z' },
  ];
}
