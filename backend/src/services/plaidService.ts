/**
 * Plaid integration service.
 * Handles OAuth flow, transaction fetching, and merchant normalization.
 * In demo mode, returns mock data.
 */

import axios from 'axios';
import { normalizeMerchant } from './merchantNormalizer';

const PLAID_BASE = process.env.PLAID_ENV === 'production'
  ? 'https://production.plaid.com'
  : 'https://sandbox.plaid.com';

const PLAID_HEADERS = {
  'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
  'PLAID-SECRET': process.env.PLAID_SECRET || '',
  'Content-Type': 'application/json',
};

export interface PlaidTransaction {
  transaction_id: string;
  merchant_name: string | null;
  name: string;
  amount: number;
  date: string;
  category: string[];
}

export interface NormalizedTransaction {
  id: string;
  rawMerchant: string;
  vendor: string | null;
  category: string | null;
  amount: number;
  date: string;
  annualizedAmount: number;
}

export async function createLinkToken(userId: string): Promise<string> {
  if (process.env.DEMO_MODE === 'true') {
    return 'link-sandbox-demo-token';
  }

  const res = await axios.post(`${PLAID_BASE}/link/token/create`, {
    user: { client_user_id: userId },
    client_name: 'SaaS Radar',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en',
  }, { headers: PLAID_HEADERS });

  return res.data.link_token;
}

export async function exchangePublicToken(publicToken: string): Promise<string> {
  if (process.env.DEMO_MODE === 'true') {
    return 'access-sandbox-demo';
  }

  const res = await axios.post(`${PLAID_BASE}/item/public_token/exchange`, {
    public_token: publicToken,
  }, { headers: PLAID_HEADERS });

  return res.data.access_token;
}

export async function fetchTransactions(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<NormalizedTransaction[]> {
  if (process.env.DEMO_MODE === 'true') {
    return getMockTransactions();
  }

  const res = await axios.post(`${PLAID_BASE}/transactions/get`, {
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
    options: { count: 500 },
  }, { headers: PLAID_HEADERS });

  const txs: PlaidTransaction[] = res.data.transactions;

  return txs
    .filter(tx => tx.amount > 0) // exclude credits
    .map(tx => normalizeTransaction(tx));
}

function normalizeTransaction(tx: PlaidTransaction): NormalizedTransaction {
  const rawMerchant = tx.merchant_name || tx.name;
  const normalized = normalizeMerchant(rawMerchant);

  return {
    id: tx.transaction_id,
    rawMerchant,
    vendor: normalized?.name ?? null,
    category: normalized?.category ?? null,
    amount: tx.amount,
    date: tx.date,
    annualizedAmount: tx.amount * 12, // rough annualization
  };
}

function getMockTransactions(): NormalizedTransaction[] {
  return [
    { id: '1', rawMerchant: 'SALESFORCE INC', vendor: 'Salesforce', category: 'CRM', amount: 7417, date: '2024-01-01', annualizedAmount: 89004 },
    { id: '2', rawMerchant: 'SLACK TECHNOLOGIES', vendor: 'Slack', category: 'Comms', amount: 5950, date: '2024-01-01', annualizedAmount: 71400 },
    { id: '3', rawMerchant: 'ZOOM VIDEO*TEAM', vendor: 'Zoom', category: 'Video', amount: 4500, date: '2024-01-01', annualizedAmount: 54000 },
    { id: '4', rawMerchant: 'FIGMA INC', vendor: 'Figma', category: 'Design', amount: 3600, date: '2024-01-01', annualizedAmount: 43200 },
    { id: '5', rawMerchant: 'GITHUB.COM', vendor: 'GitHub', category: 'Dev', amount: 3200, date: '2024-01-01', annualizedAmount: 38400 },
    { id: '6', rawMerchant: 'DATADOG INC', vendor: 'Datadog', category: 'Monitoring', amount: 4000, date: '2024-01-01', annualizedAmount: 48000 },
    { id: '7', rawMerchant: 'HUBSPOT PAYMENT', vendor: 'HubSpot', category: 'CRM', amount: 2000, date: '2024-01-01', annualizedAmount: 24000 },
    { id: '8', rawMerchant: 'ATLASSIAN JIRA', vendor: 'Jira', category: 'PM', amount: 1800, date: '2024-01-01', annualizedAmount: 21600 },
    { id: '9', rawMerchant: 'LINEAR APP', vendor: 'Linear', category: 'PM', amount: 1050, date: '2024-01-01', annualizedAmount: 12600 },
    { id: '10', rawMerchant: 'NOTION LABS', vendor: 'Notion', category: 'Docs', amount: 0, date: '2024-01-01', annualizedAmount: 0 },
    { id: '11', rawMerchant: 'INTERCOM.IO', vendor: 'Intercom', category: 'Support', amount: 1600, date: '2024-01-01', annualizedAmount: 19200 },
    { id: '12', rawMerchant: 'LOOM INC CHARGE', vendor: 'Loom', category: 'Video', amount: 300, date: '2024-01-01', annualizedAmount: 3600 },
  ];
}
