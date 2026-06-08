/**
 * Merchant name normalizer.
 * Raw card transaction descriptions are messy:
 *   "FIGMA INC", "FIGMA.COM", "FIGMA* TEAM PLAN", "FIGMA 1234"
 * This maps all of them to a canonical vendor + category.
 */

export interface NormalizedVendor {
  name: string;
  category: string;
  subcategory?: string;
  website?: string;
}

const VENDOR_MAP: Record<string, NormalizedVendor> = {
  // CRM
  'salesforce': { name: 'Salesforce', category: 'CRM', website: 'salesforce.com' },
  'hubspot': { name: 'HubSpot', category: 'CRM', website: 'hubspot.com' },
  'pipedrive': { name: 'Pipedrive', category: 'CRM', website: 'pipedrive.com' },
  'zoho': { name: 'Zoho', category: 'CRM', website: 'zoho.com' },
  'close.io': { name: 'Close', category: 'CRM', website: 'close.com' },

  // Dev Tools
  'github': { name: 'GitHub', category: 'Dev', subcategory: 'Version Control', website: 'github.com' },
  'gitlab': { name: 'GitLab', category: 'Dev', subcategory: 'Version Control', website: 'gitlab.com' },
  'bitbucket': { name: 'Bitbucket', category: 'Dev', subcategory: 'Version Control', website: 'bitbucket.org' },
  'vercel': { name: 'Vercel', category: 'Dev', subcategory: 'Hosting', website: 'vercel.com' },
  'netlify': { name: 'Netlify', category: 'Dev', subcategory: 'Hosting', website: 'netlify.com' },
  'heroku': { name: 'Heroku', category: 'Dev', subcategory: 'Hosting', website: 'heroku.com' },
  'aws': { name: 'AWS', category: 'Cloud', website: 'aws.amazon.com' },
  'amazon web services': { name: 'AWS', category: 'Cloud', website: 'aws.amazon.com' },
  'google cloud': { name: 'Google Cloud', category: 'Cloud', website: 'cloud.google.com' },
  'azure': { name: 'Azure', category: 'Cloud', website: 'azure.microsoft.com' },
  'digitalocean': { name: 'DigitalOcean', category: 'Dev', subcategory: 'Hosting', website: 'digitalocean.com' },
  'datadog': { name: 'Datadog', category: 'Monitoring', website: 'datadoghq.com' },
  'sentry': { name: 'Sentry', category: 'Monitoring', website: 'sentry.io' },
  'pagerduty': { name: 'PagerDuty', category: 'Monitoring', website: 'pagerduty.com' },
  'new relic': { name: 'New Relic', category: 'Monitoring', website: 'newrelic.com' },

  // Project Management
  'jira': { name: 'Jira', category: 'PM', website: 'atlassian.com' },
  'atlassian': { name: 'Atlassian', category: 'PM', website: 'atlassian.com' },
  'confluence': { name: 'Confluence', category: 'Docs', website: 'atlassian.com' },
  'linear': { name: 'Linear', category: 'PM', website: 'linear.app' },
  'asana': { name: 'Asana', category: 'PM', website: 'asana.com' },
  'monday': { name: 'Monday.com', category: 'PM', website: 'monday.com' },
  'clickup': { name: 'ClickUp', category: 'PM', website: 'clickup.com' },
  'basecamp': { name: 'Basecamp', category: 'PM', website: 'basecamp.com' },

  // Communication
  'slack': { name: 'Slack', category: 'Comms', website: 'slack.com' },
  'zoom': { name: 'Zoom', category: 'Video', website: 'zoom.us' },
  'teams': { name: 'Microsoft Teams', category: 'Video', website: 'microsoft.com' },
  'microsoft': { name: 'Microsoft 365', category: 'Productivity', website: 'microsoft.com' },
  'loom': { name: 'Loom', category: 'Video', website: 'loom.com' },
  'google workspace': { name: 'Google Workspace', category: 'Productivity', website: 'workspace.google.com' },
  'gsuite': { name: 'Google Workspace', category: 'Productivity', website: 'workspace.google.com' },

  // Design
  'figma': { name: 'Figma', category: 'Design', website: 'figma.com' },
  'sketch': { name: 'Sketch', category: 'Design', website: 'sketch.com' },
  'canva': { name: 'Canva', category: 'Design', website: 'canva.com' },
  'adobe': { name: 'Adobe', category: 'Design', website: 'adobe.com' },
  'invision': { name: 'InVision', category: 'Design', website: 'invisionapp.com' },
  'miro': { name: 'Miro', category: 'Design', subcategory: 'Whiteboard', website: 'miro.com' },

  // Docs / Knowledge
  'notion': { name: 'Notion', category: 'Docs', website: 'notion.so' },
  'coda': { name: 'Coda', category: 'Docs', website: 'coda.io' },
  'roam': { name: 'Roam Research', category: 'Docs', website: 'roamresearch.com' },

  // HR
  'rippling': { name: 'Rippling', category: 'HR', website: 'rippling.com' },
  'gusto': { name: 'Gusto', category: 'HR', website: 'gusto.com' },
  'bamboohr': { name: 'BambooHR', category: 'HR', website: 'bamboohr.com' },
  'workday': { name: 'Workday', category: 'HR', website: 'workday.com' },
  'lattice': { name: 'Lattice', category: 'HR', subcategory: 'Performance', website: 'lattice.com' },
  'culture amp': { name: 'Culture Amp', category: 'HR', website: 'cultureamp.com' },

  // Marketing
  'mailchimp': { name: 'Mailchimp', category: 'Marketing', website: 'mailchimp.com' },
  'klaviyo': { name: 'Klaviyo', category: 'Marketing', website: 'klaviyo.com' },
  'marketo': { name: 'Marketo', category: 'Marketing', website: 'marketo.com' },
  'intercom': { name: 'Intercom', category: 'Support', website: 'intercom.com' },
  'zendesk': { name: 'Zendesk', category: 'Support', website: 'zendesk.com' },
  'freshdesk': { name: 'Freshdesk', category: 'Support', website: 'freshdesk.com' },

  // Finance
  'quickbooks': { name: 'QuickBooks', category: 'Finance', website: 'quickbooks.intuit.com' },
  'xero': { name: 'Xero', category: 'Finance', website: 'xero.com' },
  'expensify': { name: 'Expensify', category: 'Finance', website: 'expensify.com' },

  // Security
  'okta': { name: 'Okta', category: 'Security', subcategory: 'Identity', website: 'okta.com' },
  '1password': { name: '1Password', category: 'Security', website: '1password.com' },
  'lastpass': { name: 'LastPass', category: 'Security', website: 'lastpass.com' },
  'crowdstrike': { name: 'CrowdStrike', category: 'Security', website: 'crowdstrike.com' },
};

// Regex patterns to clean merchant descriptions
const STRIP_PATTERNS = [
  /\*.*$/,           // everything after *
  /\s+\d{4,}$/,     // trailing transaction IDs
  /\s+INC\.?$/i,
  /\s+LLC\.?$/i,
  /\s+CORP\.?$/i,
  /\s+LTD\.?$/i,
  /\s+CO\.?$/i,
  /\s+LABS?\.?$/i,
  /\.COM$/i,
  /\.IO$/i,
  /\.APP$/i,
  /\s+PAYMENT$/i,
  /\s+CHARGE$/i,
  /\s+SUBSCRIPTION$/i,
  /\s+SERVICES?$/i,
];

export function normalizeMerchant(raw: string): NormalizedVendor | null {
  let cleaned = raw.trim().toUpperCase();

  // Apply strip patterns
  for (const pattern of STRIP_PATTERNS) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  const lower = cleaned.toLowerCase();

  // Direct lookup
  if (VENDOR_MAP[lower]) {
    return VENDOR_MAP[lower];
  }

  // Partial match — check if any key is contained in the cleaned name
  for (const [key, vendor] of Object.entries(VENDOR_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return vendor;
    }
  }

  // Not recognized
  return null;
}

export function categorizeTransactions(transactions: Array<{ merchant: string; amount: number; date: string }>) {
  return transactions.map(tx => ({
    ...tx,
    normalized: normalizeMerchant(tx.merchant),
  }));
}
