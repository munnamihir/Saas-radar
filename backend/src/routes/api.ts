import { Router, Request, Response } from 'express';
import { runAllDetectors } from '../lib/detectionEngine';
import { fetchTransactions, createLinkToken, exchangePublicToken } from '../services/plaidService';
import { fetchOktaAppSummaries } from '../services/ssoService';
import { normalizeMerchant } from '../lib/merchantNormalizer';

// Mock tool store (in production, backed by DB)
import { MOCK_TOOLS, MOCK_STATS } from '../lib/mockStore';

const router = Router();

// Health
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'live', ts: new Date() });
});

// Tools
router.get('/tools', (_req: Request, res: Response) => {
  res.json({ tools: MOCK_TOOLS });
});

router.get('/tools/:id', (req: Request, res: Response) => {
  const tool = MOCK_TOOLS.find(t => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Not found' });
  res.json(tool);
});

// Stats summary
router.get('/stats', (_req: Request, res: Response) => {
  res.json(MOCK_STATS);
});

// Alerts — run detection engine
router.get('/alerts', (req: Request, res: Response) => {
  const config = {
    inactiveDays: Number(req.query.inactiveDays) || 90,
    renewalWindow: Number(req.query.renewalWindow) || 30,
  };
  const alerts = runAllDetectors(MOCK_TOOLS as any, config);
  res.json({ alerts, count: alerts.length });
});

// Plaid — link token
router.post('/integrations/plaid/link-token', async (req: Request, res: Response) => {
  try {
    const token = await createLinkToken(req.body.userId || 'default');
    res.json({ linkToken: token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Plaid — exchange token + fetch transactions
router.post('/integrations/plaid/connect', async (req: Request, res: Response) => {
  try {
    const { publicToken } = req.body;
    const accessToken = await exchangePublicToken(publicToken);

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0];

    const transactions = await fetchTransactions(accessToken, startDate, endDate);
    const saasTransactions = transactions.filter(t => t.vendor !== null);

    res.json({
      connected: true,
      totalTransactions: transactions.length,
      saasTransactions: saasTransactions.length,
      transactions: saasTransactions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Okta — connect and fetch seat data
router.post('/integrations/okta/connect', async (req: Request, res: Response) => {
  try {
    const { domain, apiToken } = req.body;
    const summaries = await fetchOktaAppSummaries(domain, apiToken);
    res.json({ connected: true, apps: summaries });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Merchant normalization utility
router.post('/normalize', (req: Request, res: Response) => {
  const { merchant } = req.body;
  if (!merchant) return res.status(400).json({ error: 'merchant required' });
  const result = normalizeMerchant(merchant);
  res.json({ raw: merchant, normalized: result });
});

// Spend by category
router.get('/spend/categories', (_req: Request, res: Response) => {
  const byCategory: Record<string, number> = {};
  for (const tool of MOCK_TOOLS) {
    const cat = tool.category;
    byCategory[cat] = (byCategory[cat] || 0) + tool.annualCost;
  }
  const sorted = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([name, spend]) => ({ name, spend }));
  res.json(sorted);
});

// Spend trend (mock 6-month rolling)
router.get('/spend/trend', (_req: Request, res: Response) => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const data = [58200, 61400, 63800, 67200, 69500, 70583];
  res.json(months.map((month, i) => ({ month, spend: data[i] })));
});

export default router;
