import { NextRequest, NextResponse } from 'next/server';
import { getDeals, saveDeal } from '@/lib/data';
import { Deal } from '@/lib/types';

export async function GET() {
  const deals = getDeals();
  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const deal: Deal = await req.json();
  saveDeal(deal);
  return NextResponse.json(deal);
}
