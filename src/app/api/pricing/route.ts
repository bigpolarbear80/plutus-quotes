import { NextRequest, NextResponse } from 'next/server';
import { getPricing, savePricing, getPricingHistory } from '@/lib/data';

export async function GET() {
  const pricing = getPricing();
  return NextResponse.json(pricing);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { config, changeDescription } = body;
  savePricing(config, changeDescription || 'Pricing updated');
  return NextResponse.json({ success: true });
}
