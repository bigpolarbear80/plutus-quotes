import { NextResponse } from 'next/server';
import { getPricingHistory } from '@/lib/data';

export async function GET() {
  const history = getPricingHistory();
  return NextResponse.json(history);
}
