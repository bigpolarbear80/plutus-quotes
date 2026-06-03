'use client';

import { useState, useEffect } from 'react';
import { PricingConfig, FuelEntry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

function FuelTable({
  fuels,
  onChange,
  onRemove,
  onAdd,
}: {
  fuels: FuelEntry[];
  onChange: (index: number, field: keyof FuelEntry, value: string | number) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-3 py-2 border">Fuel</th>
            <th className="px-3 py-2 border">Price</th>
            <th className="px-3 py-2 border">Unit</th>
            <th className="px-3 py-2 border">MT Price</th>
            <th className="px-3 py-2 border">Commission</th>
            <th className="px-3 py-2 border">Comm. Unit</th>
            <th className="px-3 py-2 border w-16"></th>
          </tr>
        </thead>
        <tbody>
          {fuels.map((fuel, i) => (
            <tr key={fuel.id} className="border-b">
              <td className="px-1 py-1 border">
                <input
                  className="w-full px-2 py-1.5 border rounded bg-white"
                  value={fuel.name}
                  onChange={(e) => onChange(i, 'name', e.target.value)}
                />
              </td>
              <td className="px-1 py-1 border">
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-2 py-1.5 border rounded bg-white"
                  value={fuel.price}
                  onChange={(e) => onChange(i, 'price', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td className="px-1 py-1 border">
                <select
                  className="w-full px-2 py-1.5 border rounded bg-white"
                  value={fuel.unit}
                  onChange={(e) => onChange(i, 'unit', e.target.value)}
                >
                  <option value="MT">MT</option>
                  <option value="barrel">barrel</option>
                  <option value="gallon">gallon</option>
                </select>
              </td>
              <td className="px-1 py-1 border">
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-2 py-1.5 border rounded bg-white"
                  value={fuel.mtPrice}
                  onChange={(e) => onChange(i, 'mtPrice', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td className="px-1 py-1 border">
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-2 py-1.5 border rounded bg-white"
                  value={fuel.commission}
                  onChange={(e) => onChange(i, 'commission', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td className="px-1 py-1 border">
                <select
                  className="w-full px-2 py-1.5 border rounded bg-white"
                  value={fuel.commissionUnit}
                  onChange={(e) => onChange(i, 'commissionUnit', e.target.value)}
                >
                  <option value="MT">MT</option>
                  <option value="barrel">barrel</option>
                  <option value="gallon">gallon</option>
                </select>
              </td>
              <td className="px-1 py-1 border text-center">
                <button
                  onClick={() => onRemove(i)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onAdd}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        + Add fuel
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<{ date: string; changes: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch('/api/pricing').then((r) => r.json()).then(setConfig);
    fetch('/api/pricing/history').then((r) => r.json()).then(setHistory);
  }, []);

  if (!config) return <div className="py-12 text-center text-gray-400">Loading pricing...</div>;

  function updateFob(patch: Partial<PricingConfig['fob']>) {
    setConfig((c) => c ? { ...c, fob: { ...c.fob, ...patch } } : c);
    setSaved(false);
  }

  function updateCif(patch: Partial<PricingConfig['cif']>) {
    setConfig((c) => c ? { ...c, cif: { ...c.cif, ...patch } } : c);
    setSaved(false);
  }

  function updateFuel(term: 'fob' | 'cif', index: number, field: keyof FuelEntry, value: string | number) {
    setConfig((c) => {
      if (!c) return c;
      const section = { ...c[term] };
      const fuels = [...section.fuels];
      fuels[index] = { ...fuels[index], [field]: value };
      section.fuels = fuels;
      return { ...c, [term]: section };
    });
    setSaved(false);
  }

  function removeFuel(term: 'fob' | 'cif', index: number) {
    setConfig((c) => {
      if (!c) return c;
      const section = { ...c[term] };
      section.fuels = section.fuels.filter((_, i) => i !== index);
      return { ...c, [term]: section };
    });
    setSaved(false);
  }

  function addFuel(term: 'fob' | 'cif') {
    setConfig((c) => {
      if (!c) return c;
      const section = { ...c[term] };
      section.fuels = [
        ...section.fuels,
        { id: uuidv4(), name: '', price: 0, unit: 'MT', mtPrice: 0, commission: 0, commissionUnit: 'MT' },
      ];
      return { ...c, [term]: section };
    });
    setSaved(false);
  }

  function updatePorts(term: 'fob' | 'cif', portsStr: string) {
    const ports = portsStr.split(',').map((p) => p.trim()).filter(Boolean);
    if (term === 'fob') updateFob({ ports });
    else updateCif({ ports });
  }

  async function save() {
    setSaving(true);
    const changeDescription = prompt('Briefly describe what changed:') || 'Pricing updated';
    await fetch('/api/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, changeDescription }),
    });
    const hist = await fetch('/api/pricing/history').then((r) => r.json());
    setHistory(hist);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pricing Configuration</h1>
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      {/* FOB Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">FOB Pricing</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">As of Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={config.fob.asOfDate}
              onChange={(e) => updateFob({ asOfDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ports (comma-separated)</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={config.fob.ports.join(', ')}
              onChange={(e) => updatePorts('fob', e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Procedure</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg text-sm"
            rows={2}
            value={config.fob.procedure}
            onChange={(e) => updateFob({ procedure: e.target.value })}
          />
        </div>
        <FuelTable
          fuels={config.fob.fuels}
          onChange={(i, f, v) => updateFuel('fob', i, f, v)}
          onRemove={(i) => removeFuel('fob', i)}
          onAdd={() => addFuel('fob')}
        />
      </section>

      {/* CIF Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">CIF Pricing</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">As of Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={config.cif.asOfDate}
              onChange={(e) => updateCif({ asOfDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ports (comma-separated)</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={config.cif.ports.join(', ')}
              onChange={(e) => updatePorts('cif', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">CIF Price Increase</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border rounded-lg"
              value={config.cif.cifPriceIncrease}
              onChange={(e) => updateCif({ cifPriceIncrease: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Procedure</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg text-sm"
            rows={2}
            value={config.cif.procedure}
            onChange={(e) => updateCif({ procedure: e.target.value })}
          />
        </div>
        <FuelTable
          fuels={config.cif.fuels}
          onChange={(i, f, v) => updateFuel('cif', i, f, v)}
          onRemove={(i) => removeFuel('cif', i)}
          onAdd={() => addFuel('cif')}
        />
      </section>

      {/* History */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {showHistory ? 'Hide' : 'Show'} Pricing History ({history.length} changes)
        </button>
        {showHistory && (
          <div className="mt-4 space-y-2">
            {history.length === 0 && (
              <p className="text-sm text-gray-400">No changes recorded yet.</p>
            )}
            {history.map((h, i) => (
              <div key={i} className="flex gap-4 text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-400 whitespace-nowrap">
                  {new Date(h.date).toLocaleString()}
                </span>
                <span>{h.changes}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
