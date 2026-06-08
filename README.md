# SaaS Radar 🔍

**Open source SaaS spend intelligence.** Detect ghost seats, redundant tools, forgotten trial conversions, and renewal surprises — automatically, by connecting your billing and identity providers.

No spreadsheets. No manual entry. Just connect and go.

---

## Why SaaS Radar

Organizations waste 30–40% of SaaS spend on:
- **Ghost seats** — users who haven't logged in for 90+ days
- **Redundant tools** — two project management tools, two video tools, different departments
- **Forgotten trials** — free trials auto-converting to $30K/yr with no one noticing
- **Renewal surprises** — contracts renewing at full price when 40% of seats are unused

SaaS Radar surfaces all of this automatically by reading from your card provider and SSO.

---

## Quick start

### Option 1: Docker (recommended)

```bash
git clone https://github.com/your-org/saas-radar
cd saas-radar
cp backend/.env.example backend/.env
docker compose up
```

Open http://localhost:3000 — it runs in demo mode out of the box with realistic sample data.

### Option 2: Manual

**Requirements**: Node 20+, PostgreSQL 15+

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your config
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Connecting real data

### Billing (pick one or more)

| Provider | What it gives you |
|----------|-------------------|
| **Plaid** | Reads all card transactions, normalizes merchant names to SaaS tools |
| **Ramp** | Direct API — per-card, per-employee breakdown |
| **Brex** | Same as Ramp |

### Identity / seat activity (pick one or more)

| Provider | What it gives you |
|----------|-------------------|
| **Okta** | Last login per user per app, full seat roster |
| **Google Workspace** | OAuth grants, last login timestamps |
| **Azure AD** | Enterprise app catalog, user activity |

Set keys in `backend/.env` and set `DEMO_MODE=false`.

---

## Architecture

```
saas-radar/
├── frontend/          Next.js 14 dashboard
│   └── src/
│       ├── app/       Pages (dashboard, tools, alerts, integrations)
│       ├── components/ Reusable UI components
│       └── lib/       Utilities and mock data
├── backend/           Express + TypeScript API
│   └── src/
│       ├── routes/    REST endpoints
│       ├── services/  Plaid, Okta, Google integrations
│       └── lib/       Detection engine + merchant normalizer
├── docker-compose.yml Self-hosted deployment
└── README.md
```

### Detection engine

The core of SaaS Radar lives in `backend/src/lib/detectionEngine.ts`. It runs four detectors:

- **Inactive seat detector** — flags seats with no login in N days (configurable threshold)
- **Overlap detector** — surfaces tools in the same category both running across the org
- **Trial conversion detector** — alerts before free trials auto-bill
- **Renewal detector** — warns N days before contracts renew, with negotiation notes if seats are unused

### Merchant normalizer

`backend/src/lib/merchantNormalizer.ts` maps raw card descriptions to canonical vendor names. `"FIGMA* TEAM PLAN"`, `"FIGMA INC"`, and `"FIGMA.COM"` all resolve to `Figma → Design`. The lookup table covers 70+ SaaS vendors out of the box and is easy to extend.

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DEMO_MODE` | `true` | Use sample data — no integrations needed |
| `PLAID_CLIENT_ID` | — | From dashboard.plaid.com |
| `PLAID_SECRET` | — | From dashboard.plaid.com |
| `OKTA_DOMAIN` | — | e.g. `dev-123.okta.com` |
| `OKTA_API_TOKEN` | — | Okta API token with read access |

See `backend/.env.example` for the full list.

---

## Contributing

SaaS Radar is open source under MIT. Contributions welcome:

- **Connectors** — add Ramp, Brex, Stripe, QuickBooks, etc. in `backend/src/services/`
- **Merchant map** — extend the vendor lookup table in `merchantNormalizer.ts`
- **Detectors** — add new waste detection heuristics in `detectionEngine.ts`
- **UI** — improve the dashboard in `frontend/src/`

---

## Roadmap

- [ ] Slack & email alert delivery
- [ ] Approval workflow for renewals
- [ ] Ramp / Brex direct API connectors  
- [ ] Azure AD connector
- [ ] Vendor contract storage
- [ ] Negotiation playbooks per vendor
- [ ] Multi-workspace support
- [ ] Scheduled weekly digest

---

MIT License · Built with Next.js, Express, PostgreSQL
