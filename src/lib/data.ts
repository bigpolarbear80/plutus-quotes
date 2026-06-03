import fs from 'fs';
import path from 'path';
import { PricingConfig, PricingHistoryEntry, QuoteResult, Deal } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getPricing(): PricingConfig {
  return readJSON<PricingConfig>('pricing.json');
}

export function savePricing(config: PricingConfig, changeDescription: string): void {
  const history = readJSON<PricingHistoryEntry[]>('pricing-history.json');
  history.unshift({
    date: new Date().toISOString(),
    changes: changeDescription,
    snapshot: config,
  });
  writeJSON('pricing.json', config);
  writeJSON('pricing-history.json', history);
}

export function getPricingHistory(): PricingHistoryEntry[] {
  return readJSON<PricingHistoryEntry[]>('pricing-history.json');
}

export function getQuotes(): QuoteResult[] {
  return readJSON<QuoteResult[]>('quotes.json');
}

export function saveQuote(quote: QuoteResult): void {
  const quotes = getQuotes();
  quotes.unshift(quote);
  writeJSON('quotes.json', quotes);
}

export function getQuote(id: string): QuoteResult | undefined {
  return getQuotes().find(q => q.id === id);
}

export function getDeals(): Deal[] {
  return readJSON<Deal[]>('deals.json');
}

export function saveDeal(deal: Deal): void {
  const deals = getDeals();
  const idx = deals.findIndex(d => d.id === deal.id);
  if (idx >= 0) {
    deals[idx] = deal;
  } else {
    deals.unshift(deal);
  }
  writeJSON('deals.json', deals);
}

export function getDeal(id: string): Deal | undefined {
  return getDeals().find(d => d.id === id);
}

export function updateDealStage(id: string, stage: Deal['stage']): Deal | undefined {
  const deals = getDeals();
  const deal = deals.find(d => d.id === id);
  if (!deal) return undefined;
  deal.stage = stage;
  deal.updatedAt = new Date().toISOString();
  writeJSON('deals.json', deals);
  return deal;
}

export function deleteDeal(id: string): boolean {
  const deals = getDeals();
  const filtered = deals.filter(d => d.id !== id);
  if (filtered.length === deals.length) return false;
  writeJSON('deals.json', filtered);
  return true;
}
