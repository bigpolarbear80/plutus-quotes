import { NextRequest, NextResponse } from 'next/server';
import { getDeal, saveDeal, updateDealStage, deleteDeal } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  if (body.stage && Object.keys(body).length === 1) {
    const deal = updateDealStage(id, body.stage);
    if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(deal);
  }
  body.id = id;
  body.updatedAt = new Date().toISOString();
  saveDeal(body);
  return NextResponse.json(body);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteDeal(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
