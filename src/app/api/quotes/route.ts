import { NextRequest, NextResponse } from 'next/server';
import { getPricing, saveQuote, getQuotes, saveDeal } from '@/lib/data';
import { calculateQuote } from '@/lib/quoteEngine';
import { Deal } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const quotes = getQuotes();
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const input = await req.json();
  const pricing = getPricing();
  const quote = calculateQuote(input, pricing);
  saveQuote(quote);

  // Auto-create a deal in the pipeline
  const deal: Deal = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stage: 'quote_sent',
    buyerCompany: quote.input.buyerCompany,
    buyerContact: quote.input.buyerContact,
    buyerEmail: quote.input.buyerEmail,
    product: quote.fuel.name,
    deliveryTerm: quote.deliveryTerm,
    destinationPort: quote.input.destinationPort,
    contractValue: quote.totalContractValue,
    commissionTotal: quote.commissionTotal,
    quoteId: quote.id,
    notes: quote.input.notes || '',
  };
  saveDeal(deal);

  return NextResponse.json(quote);
}
