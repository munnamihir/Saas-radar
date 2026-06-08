# SaaS Radar 🔍

> Open source SaaS spend intelligence for finance and IT teams.

Most companies have no idea how much they're wasting on software. Ghost seats nobody uses. Two project management tools bought by different departments. Free trials silently converting to $30K/year contracts. Renewals happening at full price when half the seats are unused.

SaaS Radar finds all of it — automatically, by connecting to your billing provider and SSO. No spreadsheets. No manual entry.

![Dashboard](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Backend](https://img.shields.io/badge/Express-TypeScript-blue?style=flat-square&logo=typescript)
![Database](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## What it detects

| Problem | How it finds it |
|---------|----------------|
| **Ghost seats** | Compares billing roster against SSO last-login timestamps |
| **Redundant tools** | Flags multiple active tools in the same category (2 PM tools, 2 video tools) |
| **Trial conversions** | Alerts 7 days before a free trial auto-bills |
| **Renewal surprises** | Warns before contracts renew, with negotiation notes if seats are unused |
| **Duplicate billing** | Detects the same tool billed across multiple departments |

---

## Quick start

### Option 1 — Docker (recommended, 2 minutes)

```bash
git clone https://github.com/munnamihir/saas-radar
cd saas-radar
cp backend/.env.example backend/.env
docker compose up
```

Open **http://localhost:3000** — runs in demo mode with realistic sample data out of the box. No integrations needed to explore.

### Option 2 — Manual

**Requirements:** Node 20+, PostgreSQL 15+

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend → **http://localhost:3000** · API → **http://localhost:4000**

---

## Connecting real data

Set `DEMO_MODE=false` in `backend/.env` and add your keys.

### Billing (pick one or more)

| Provider | What you get |
|----------|-------------|
| **Plaid** | Every card transaction, auto-normalized to vendor names |
| **Ramp** | Per-card, per-employee spend breakdown |
| **Brex** | Corporate card spend with categories |

### Identity / seat activity (pick one or more)

| Provider | What you get |
|----------|-------------|
| **Okta** | Last login per user per app, full seat roster |
| **Google Workspace** | OAuth grants, login activity |
| **Azure AD** | Enterprise app catalog, user activity |

---

## How it works

### Merchant normalizer
Raw card transactions are messy — `"FIGMA* TEAM PLAN"`, `"FIGMA INC"`, `"FIGMA.COM"` are all the same vendor. The merchant normalizer maps 70+ SaaS vendor name variants to canonical names and categories automatically.

### Detection engine
Four independent detectors run against your data:

```
detectInactiveSeats()    — seats with no login in N days (configurable)
detectOverlappingTools() — same category, multiple active tools
detectTrialConversions() — free trials about to auto-bill
detectUpcomingRenewals() — contracts renewing soon with unused seats
```

Each detector is independent and pluggable — easy to add your own.

---

## Project structure

```
saas-radar/
├── frontend/                  Next.js 14 dashboard
│   └── src/
│       ├── app/               Pages (dashboard, tools, alerts, integrations, settings)
│       ├── components/        UI components
│       └── lib/               Utilities, mock data
├── backend/                   Express + TypeScript API
│   └── src/
│       ├── routes/            REST endpoints
│       ├── services/          Plaid, Okta, Google integrations
│       └── lib/               Detection engine + merchant normalizer
├── docker-compose.yml         Self-hosted deployment
└── backend/schema.sql         PostgreSQL schema
```

---

## API endpoints

```
GET  /health                          Health check + mode
GET  /tools                           All tracked tools
GET  /alerts                          Run detection, return alerts
GET  /stats                           Summary metrics
GET  /spend/trend                     6-month spend trend
GET  /spend/categories                Spend by category
POST /integrations/plaid/connect      Connect Plaid
POST /integrations/okta/connect       Connect Okta
POST /normalize                       Test merchant normalization
```

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DEMO_MODE` | `true` | Use sample data — no integrations needed |
| `PLAID_CLIENT_ID` | — | From dashboard.plaid.com |
| `PLAID_SECRET` | — | From dashboard.plaid.com |
| `PLAID_ENV` | `sandbox` | `sandbox` or `production` |
| `OKTA_DOMAIN` | — | e.g. `dev-123.okta.com` |
| `OKTA_API_TOKEN` | — | Okta API token with read access |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client |
| `SLACK_WEBHOOK_URL` | — | For alert delivery to Slack |

Full list in `backend/.env.example`.

---

## Roadmap

- [ ] Slack + email alert delivery
- [ ] Ramp / Brex direct API connectors
- [ ] Azure AD connector
- [ ] Renewal negotiation playbooks
- [ ] Approval workflow for renewals
- [ ] Multi-workspace support
- [ ] Scheduled weekly digest
- [ ] Chrome extension for one-click tool adding

---

## Contributing

Contributions welcome. The highest-value areas:

- **Connectors** — add Ramp, Brex, Stripe, QuickBooks in `backend/src/services/`
- **Merchant map** — extend vendor lookup in `merchantNormalizer.ts`
- **Detectors** — add new waste heuristics in `detectionEngine.ts`
- **UI** — improve dashboard components in `frontend/src/`

Please open an issue before starting large changes.

---

## Why open source

Every SaaS spend management tool on the market — Zylo, Torii, Cleanshelf — costs $1,000+/month and requires an enterprise sales cycle. SaaS Radar is free to self-host forever. The community adds connectors. Enterprises who want managed hosting, SSO, and audit logs can pay for that later.

The core detection logic will always be open.

---

## License

MIT — use it, fork it, build on it.

---

Built by [@munnamihir](https://github.com/munnamihir)
