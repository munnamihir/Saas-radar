-- SaaS Radar Database Schema

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  vendor TEXT,
  department TEXT,
  seats_total INTEGER DEFAULT 0,
  seats_active INTEGER DEFAULT 0,
  annual_cost NUMERIC(12,2) DEFAULT 0,
  monthly_cost NUMERIC(12,2) DEFAULT 0,
  renewal_date DATE,
  last_activity_at TIMESTAMPTZ,
  billing_source TEXT,
  is_trial BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'warn', 'danger')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  external_id TEXT UNIQUE,
  raw_merchant TEXT NOT NULL,
  normalized_vendor TEXT,
  category TEXT,
  amount NUMERIC(12,2) NOT NULL,
  transaction_date DATE NOT NULL,
  source TEXT NOT NULL,  -- plaid | ramp | brex | manual
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('seats', 'overlap', 'trial', 'renewal', 'duplicate')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  message TEXT NOT NULL,
  savings NUMERIC(12,2) DEFAULT 0,
  action TEXT,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,  -- plaid | okta | google | ramp | brex | slack
  access_token TEXT,       -- encrypted in production
  refresh_token TEXT,
  last_synced_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seat_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  last_login_at TIMESTAMPTZ,
  source TEXT NOT NULL,  -- okta | google | slack
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tools_workspace ON tools(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_transactions_workspace ON transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_alerts_workspace ON alerts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_seat_activity_tool ON seat_activity(tool_id);
