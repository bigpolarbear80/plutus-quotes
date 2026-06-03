import fs from 'fs';
import path from 'path';
import { PricingConfig, PricingHistoryEntry, QuoteResult } from './types';

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
