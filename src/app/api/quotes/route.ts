import { NextRequest, NextResponse } from 'next/server';
import { getPricing, saveQuote, getQuotes } from '@/lib/data';
import { calculateQuote } from '@/lib/quoteEngine';

export async function GET() {
  const quotes = getQuotes();
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const input = await req.json();
  const pricing = getPricing();
  const quote = calculateQuote(input, pricing);
  saveQuote(quote);
  return NextResponse.json(quote);
}
