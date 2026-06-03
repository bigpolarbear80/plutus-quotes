'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Deal, DealStage, DEAL_STAGES, DEAL_STAGE_LABELS } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const STAGE_COLORS: Record<DealStage, string> = {
  lead: 'bg-gray-100 border-gray-300',
  quote_sent: 'bg-blue-50 border-blue-300',
  follow_up: 'bg-yellow-50 border-yellow-300',
  deal_in_process: 'bg-orange-50 border-orange-300',
  final_deal: 'bg-green-50 border-green-300',
  commission_paid: 'bg-emerald-50 border-emerald-400',
};

const STAGE_DOT: Record<DealStage, string> = {
  lead: 'bg-gray-400',
  quote_sent: 'bg-blue-400',
  follow_up: 'bg-yellow-500',
  deal_in_process: 'bg-orange-400',
  final_deal: 'bg-green-500',
  commission_paid: 'bg-emerald-500',
};

function DealCard({
  deal,
  onDragStart,
  onClick,
}: {
  deal: Deal;
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
  onClick: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-1.5">
        <p className="font-medium text-sm text-gray-900 leading-tight">{deal.buyerCompany}</p>
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 whitespace-nowrap ml-2">
          {deal.deliveryTerm}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{deal.product} &bull; {deal.destinationPort}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-900">${fmt(deal.contractValue)}</span>
        <span className="text-xs text-green-600">${fmt(deal.commissionTotal)} comm</span>
      </div>
      {deal.buyerContact && (
        <p className="text-xs text-gray-400 mt-1.5 truncate">{deal.buyerContact}</p>
      )}
    </div>
  );
}

function NewDealModal({
  onClose,
  onSave,
  existingDeal,
}: {
  onClose: () => void;
  onSave: (deal: Deal) => void;
  existingDeal?: Deal;
}) {
  const [form, setForm] = useState<Deal>(
    existingDeal || {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stage: 'lead',
      buyerCompany: '',
      buyerContact: '',
      buyerEmail: '',
      product: '',
      deliveryTerm: 'FOB',
      destinationPort: '',
      contractValue: 0,
      commissionTotal: 0,
      notes: '',
    }
  );

  function set(field: keyof Deal, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.buyerCompany.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString() });
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-300 focus:outline-none';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{existingDeal ? 'Edit Deal' : 'New Deal'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Buyer Company *</label>
              <input className={inputClass} value={form.buyerCompany} onChange={(e) => set('buyerCompany', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contact Name</label>
              <input className={inputClass} value={form.buyerContact} onChange={(e) => set('buyerContact', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
            <input type="email" className={inputClass} value={form.buyerEmail} onChange={(e) => set('buyerEmail', e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
              <input className={inputClass} value={form.product} onChange={(e) => set('product', e.target.value)} placeholder="EN590, Jet A, D6" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Delivery Term</label>
              <select className={inputClass} value={form.deliveryTerm} onChange={(e) => set('deliveryTerm', e.target.value)}>
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Destination Port</label>
              <input className={inputClass} value={form.destinationPort} onChange={(e) => set('destinationPort', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contract Value ($)</label>
              <input type="number" step="any" className={inputClass} value={form.contractValue || ''} onChange={(e) => set('contractValue', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Commission Total ($)</label>
              <input type="number" step="any" className={inputClass} value={form.commissionTotal || ''} onChange={(e) => set('commissionTotal', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Stage</label>
            <select className={inputClass} value={form.stage} onChange={(e) => set('stage', e.target.value)}>
              {DEAL_STAGES.map((s) => (
                <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          {existingDeal && existingDeal.quoteId && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Linked Quote</label>
              <Link href={`/proposals/${existingDeal.quoteId}`} className="text-sm text-blue-600 hover:text-blue-800">
                View Proposal &rarr;
              </Link>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea className={inputClass} rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
              {existingDeal ? 'Save Changes' : 'Create Deal'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDeal, setEditDeal] = useState<Deal | undefined>();
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const dragDeal = useRef<Deal | null>(null);

  async function loadDeals() {
    const res = await fetch('/api/deals');
    const data = await res.json();
    setDeals(data);
    setLoading(false);
  }

  useEffect(() => { loadDeals(); }, []);

  function handleDragStart(e: React.DragEvent, deal: Deal) {
    dragDeal.current = deal;
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent, stage: DealStage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  async function handleDrop(e: React.DragEvent, stage: DealStage) {
    e.preventDefault();
    setDragOverStage(null);
    const deal = dragDeal.current;
    if (!deal || deal.stage === stage) return;

    setDeals((prev) =>
      prev.map((d) => (d.id === deal.id ? { ...d, stage, updatedAt: new Date().toISOString() } : d))
    );

    await fetch(`/api/deals/${deal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
  }

  async function handleSaveDeal(deal: Deal) {
    await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    setShowModal(false);
    setEditDeal(undefined);
    loadDeals();
  }

  function openEdit(deal: Deal) {
    setEditDeal(deal);
    setShowModal(true);
  }

  function openNew() {
    setEditDeal(undefined);
    setShowModal(true);
  }

  const dealsByStage = (stage: DealStage) => deals.filter((d) => d.stage === stage);

  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'commission_paid')
    .reduce((sum, d) => sum + d.contractValue, 0);
  const totalCommission = deals
    .filter((d) => d.stage === 'commission_paid')
    .reduce((sum, d) => sum + d.commissionTotal, 0);

  if (loading) return <div className="py-12 text-center text-gray-400">Loading pipeline...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Deal Pipeline</h1>
          <div className="flex gap-6 mt-1 text-sm text-gray-500">
            <span>Pipeline: <span className="font-medium text-gray-900">${fmt(totalPipelineValue)}</span></span>
            <span>Paid: <span className="font-medium text-green-600">${fmt(totalCommission)}</span></span>
            <span>{deals.length} deals</span>
          </div>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + New Deal
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 220px)' }}>
        {DEAL_STAGES.map((stage) => {
          const stageDeals = dealsByStage(stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.contractValue, 0);
          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-64 rounded-xl border-2 transition-colors ${
                dragOverStage === stage
                  ? 'border-gray-900 bg-gray-50'
                  : `border-transparent ${STAGE_COLORS[stage]}`
              }`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="px-3 py-3 border-b border-gray-200/50">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className={`w-2 h-2 rounded-full ${STAGE_DOT[stage]}`} />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    {DEAL_STAGE_LABELS[stage]}
                  </h3>
                  <span className="text-xs text-gray-400 ml-auto">{stageDeals.length}</span>
                </div>
                {stageValue > 0 && (
                  <p className="text-xs text-gray-400 ml-4">${fmt(stageValue)}</p>
                )}
              </div>
              <div className="p-2 space-y-2 min-h-[100px]">
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onDragStart={handleDragStart}
                    onClick={() => openEdit(deal)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <NewDealModal
          onClose={() => { setShowModal(false); setEditDeal(undefined); }}
          onSave={handleSaveDeal}
          existingDeal={editDeal}
        />
      )}
    </div>
  );
}
