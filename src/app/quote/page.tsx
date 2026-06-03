'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PricingConfig } from '@/lib/types';

export default function QuotePage() {
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    buyerCompany: '',
    buyerContact: '',
    buyerEmail: '',
    fuelProduct: '',
    deliveryTerm: 'FOB' as 'FOB' | 'CIF',
    destinationPort: '',
    quantity: '',
    quantityUnit: '',
    monthlyQuantity: '',
    monthlyQuantityUnit: '',
    contractDurationMonths: '',
    buyerTargetPrice: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/pricing').then((r) => r.json()).then(setPricing);
  }, []);

  const section = pricing ? pricing[form.deliveryTerm.toLowerCase() as 'fob' | 'cif'] : null;
  const fuels = section?.fuels || [];
  const ports = section?.ports || [];
  const selectedFuel = fuels.find((f) => f.name === form.fuelProduct);

  useEffect(() => {
    if (selectedFuel && !form.quantityUnit) {
      setForm((f) => ({
        ...f,
        quantityUnit: selectedFuel.unit,
        monthlyQuantityUnit: selectedFuel.unit,
      }));
    }
  }, [selectedFuel]);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.buyerCompany.trim()) errs.buyerCompany = 'Required';
    if (!form.buyerContact.trim()) errs.buyerContact = 'Required';
    if (!form.buyerEmail.trim()) errs.buyerEmail = 'Required';
    if (!form.fuelProduct) errs.fuelProduct = 'Required';
    if (!form.destinationPort) errs.destinationPort = 'Required';
    if (!form.quantity || parseFloat(form.quantity) <= 0) errs.quantity = 'Required';
    if (!form.monthlyQuantity || parseFloat(form.monthlyQuantity) <= 0) errs.monthlyQuantity = 'Required';
    if (!form.contractDurationMonths || parseInt(form.contractDurationMonths) <= 0) errs.contractDurationMonths = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      buyerCompany: form.buyerCompany,
      buyerContact: form.buyerContact,
      buyerEmail: form.buyerEmail,
      fuelProduct: form.fuelProduct,
      deliveryTerm: form.deliveryTerm,
      destinationPort: form.destinationPort,
      quantity: parseFloat(form.quantity),
      quantityUnit: form.quantityUnit || selectedFuel?.unit || 'MT',
      monthlyQuantity: parseFloat(form.monthlyQuantity),
      monthlyQuantityUnit: form.monthlyQuantityUnit || selectedFuel?.unit || 'MT',
      contractDurationMonths: parseInt(form.contractDurationMonths),
      buyerTargetPrice: form.buyerTargetPrice ? parseFloat(form.buyerTargetPrice) : undefined,
      notes: form.notes || undefined,
    };

    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const quote = await res.json();
    setSubmitting(false);
    window.location.href = `/proposals/${quote.id}`;
  }

  const inputClass = 'w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-gray-300 focus:outline-none';
  const errorClass = 'text-xs text-red-500 mt-0.5';

  if (!pricing) return <div className="py-12 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Quote</h1>
      <form onSubmit={submit} className="space-y-6">
        {/* Buyer info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Buyer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
              <input className={inputClass} value={form.buyerCompany} onChange={(e) => set('buyerCompany', e.target.value)} />
              {errors.buyerCompany && <p className={errorClass}>{errors.buyerCompany}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contact Name</label>
              <input className={inputClass} value={form.buyerContact} onChange={(e) => set('buyerContact', e.target.value)} />
              {errors.buyerContact && <p className={errorClass}>{errors.buyerContact}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
            <input type="email" className={inputClass} value={form.buyerEmail} onChange={(e) => set('buyerEmail', e.target.value)} />
            {errors.buyerEmail && <p className={errorClass}>{errors.buyerEmail}</p>}
          </div>
        </section>

        {/* Product info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product &amp; Delivery</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Delivery Term</label>
              <select
                className={inputClass}
                value={form.deliveryTerm}
                onChange={(e) => {
                  set('deliveryTerm', e.target.value);
                  set('fuelProduct', '');
                  set('destinationPort', '');
                }}
              >
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fuel Product</label>
              <select className={inputClass} value={form.fuelProduct} onChange={(e) => set('fuelProduct', e.target.value)}>
                <option value="">Select fuel...</option>
                {fuels.map((f) => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
              {errors.fuelProduct && <p className={errorClass}>{errors.fuelProduct}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Destination Port</label>
            <select className={inputClass} value={form.destinationPort} onChange={(e) => set('destinationPort', e.target.value)}>
              <option value="">Select port...</option>
              {ports.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.destinationPort && <p className={errorClass}>{errors.destinationPort}</p>}
          </div>
        </section>

        {/* Quantity */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quantity &amp; Duration</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Order Quantity</label>
              <input type="number" step="any" className={inputClass} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
              {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
              <select className={inputClass} value={form.quantityUnit} onChange={(e) => set('quantityUnit', e.target.value)}>
                {selectedFuel && <option value={selectedFuel.unit}>{selectedFuel.unit}</option>}
                <option value="MT">MT</option>
                {selectedFuel?.unit !== 'barrel' && <option value="barrel">barrel</option>}
                {selectedFuel?.unit !== 'gallon' && <option value="gallon">gallon</option>}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contract Duration (months)</label>
              <input type="number" min="1" className={inputClass} value={form.contractDurationMonths} onChange={(e) => set('contractDurationMonths', e.target.value)} />
              {errors.contractDurationMonths && <p className={errorClass}>{errors.contractDurationMonths}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Monthly Quantity</label>
              <input type="number" step="any" className={inputClass} value={form.monthlyQuantity} onChange={(e) => set('monthlyQuantity', e.target.value)} />
              {errors.monthlyQuantity && <p className={errorClass}>{errors.monthlyQuantity}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Monthly Unit</label>
              <select className={inputClass} value={form.monthlyQuantityUnit} onChange={(e) => set('monthlyQuantityUnit', e.target.value)}>
                {selectedFuel && <option value={selectedFuel.unit}>{selectedFuel.unit}</option>}
                <option value="MT">MT</option>
                {selectedFuel?.unit !== 'barrel' && <option value="barrel">barrel</option>}
                {selectedFuel?.unit !== 'gallon' && <option value="gallon">gallon</option>}
              </select>
            </div>
          </div>
        </section>

        {/* Optional */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Optional</h2>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Buyer Target Price</label>
            <input type="number" step="0.01" className={inputClass} value={form.buyerTargetPrice} onChange={(e) => set('buyerTargetPrice', e.target.value)} placeholder="Leave blank if none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea className={inputClass} rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Internal notes..." />
          </div>
        </section>

        {/* Pricing preview */}
        {selectedFuel && (
          <section className="bg-gray-100 rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Pricing Preview ({form.deliveryTerm})</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-500">Price:</span> ${selectedFuel.price.toFixed(2)} / {selectedFuel.unit}</p>
              <p><span className="text-gray-500">MT Price:</span> ${selectedFuel.mtPrice.toFixed(2)}</p>
              <p><span className="text-gray-500">Commission:</span> ${selectedFuel.commission.toFixed(2)} / {selectedFuel.commissionUnit}</p>
            </div>
          </section>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? 'Generating Quote...' : 'Generate Quote'}
        </button>
      </form>
    </div>
  );
}
