'use client';

import { useState, useEffect, use } from 'react';
import { QuoteResult } from '@/lib/types';

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ProposalDocument({ quote, showCommission }: { quote: QuoteResult; showCommission: boolean }) {
  const offerDate = new Date(quote.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const validityDate = new Date(new Date(quote.createdAt).getTime() + 7 * 86400000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div id="proposal-document" className="bg-white border border-gray-200 rounded-xl p-8 print:border-0 print:rounded-none print:p-0">
      {/* Header */}
      <div className="border-b border-gray-300 pb-4 mb-6 flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="Plutus Ventures" className="h-10" />
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>mike@plutusv.com</p>
          <p>480-689-9405</p>
          <p>plutusv.com</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide">Soft Corporate Offer</h2>
        <p className="text-sm text-gray-500 mt-1">Ref: PV-{quote.id.slice(0, 8).toUpperCase()}</p>
      </div>

      {/* Offer Details */}
      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase mb-1">Offer Date</p>
          <p>{offerDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase mb-1">Valid Until</p>
          <p>{validityDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase mb-1">Buyer</p>
          <p className="font-medium">{quote.input.buyerCompany}</p>
          <p>{quote.input.buyerContact}</p>
          <p className="text-gray-500">{quote.input.buyerEmail}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase mb-1">Pricing As Of</p>
          <p>{quote.asOfDate}</p>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3 border-b pb-2">Product Details</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr><td className="py-2 text-gray-500 w-48">Product</td><td className="py-2 font-medium">{quote.fuel.name}</td></tr>
            <tr><td className="py-2 text-gray-500">Specification</td><td className="py-2">{quote.fuel.name === 'EN590' ? 'EN 590:2013+A1:2017' : quote.fuel.name === 'Jet A' ? 'ASTM D1655 / DEF STAN 91-91' : 'ASTM D6751'}</td></tr>
            <tr><td className="py-2 text-gray-500">Origin</td><td className="py-2">International</td></tr>
            <tr><td className="py-2 text-gray-500">Destination Port</td><td className="py-2">{quote.input.destinationPort}</td></tr>
            <tr><td className="py-2 text-gray-500">Delivery Term</td><td className="py-2 font-medium">{quote.deliveryTerm}</td></tr>
            <tr><td className="py-2 text-gray-500">Available Ports</td><td className="py-2">{quote.ports.join(', ')}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Quantity & Duration */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3 border-b pb-2">Quantity &amp; Duration</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr><td className="py-2 text-gray-500 w-48">Order Quantity</td><td className="py-2">{fmt(quote.input.quantity)} {quote.input.quantityUnit}</td></tr>
            <tr><td className="py-2 text-gray-500">Monthly Quantity</td><td className="py-2">{fmt(quote.input.monthlyQuantity)} {quote.input.monthlyQuantityUnit}</td></tr>
            <tr><td className="py-2 text-gray-500">Contract Duration</td><td className="py-2">{quote.input.contractDurationMonths} {quote.input.contractDurationMonths === 1 ? 'month' : 'months'}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Pricing */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3 border-b pb-2">Pricing</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr><td className="py-2 text-gray-500 w-48">Price per {quote.priceUnit}</td><td className="py-2 font-medium">${fmt(quote.pricePerUnit)}</td></tr>
            {quote.priceUnit !== 'MT' && <tr><td className="py-2 text-gray-500">Price per MT</td><td className="py-2">${fmt(quote.mtPrice)}</td></tr>}
            <tr><td className="py-2 text-gray-500">Monthly Value</td><td className="py-2 font-medium">${fmt(quote.monthlyValue)}</td></tr>
            <tr><td className="py-2 text-gray-500">Total Contract Value</td><td className="py-2 font-bold text-lg">${fmt(quote.totalContractValue)}</td></tr>
            {showCommission && (
              <>
                <tr className="bg-yellow-50"><td className="py-2 text-gray-500">Commission per {quote.commissionUnit}</td><td className="py-2">${fmt(quote.commissionPerUnit)}</td></tr>
                <tr className="bg-yellow-50"><td className="py-2 text-gray-500">Monthly Commission</td><td className="py-2">${fmt(quote.commissionMonthly)}</td></tr>
                <tr className="bg-yellow-50"><td className="py-2 text-gray-500">Total Commission</td><td className="py-2 font-bold">${fmt(quote.commissionTotal)}</td></tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Procedure */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3 border-b pb-2">
          Transaction Procedure{quote.procedureName ? ` — ${quote.procedureName}` : ''}
        </h3>
        {quote.procedureSteps && quote.procedureSteps.length > 0 ? (
          <ol className="text-sm leading-relaxed space-y-2 list-decimal list-inside">
            {quote.procedureSteps.map((step, i) => (
              <li key={i} className="pl-1">{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-sm leading-relaxed">{quote.procedure}</p>
        )}
      </div>

      {/* Terms */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3 border-b pb-2">Payment &amp; Terms</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr><td className="py-2 text-gray-500 w-48">Payment Method</td><td className="py-2">Irrevocable Transferable Letter of Credit (ITLC) or Standby Letter of Credit (SBLC)</td></tr>
            <tr><td className="py-2 text-gray-500">Payment Terms</td><td className="py-2">At sight or as mutually agreed</td></tr>
            <tr><td className="py-2 text-gray-500">Inspection</td><td className="py-2">SGS or equivalent at loading port</td></tr>
            <tr><td className="py-2 text-gray-500">Performance Bond</td><td className="py-2">2% of contract value (if applicable)</td></tr>
          </tbody>
        </table>
      </div>

      {/* Contact */}
      <div className="border-t border-gray-300 pt-4 mt-8">
        <p className="text-sm font-medium">Plutus Ventures</p>
        <p className="text-xs text-gray-500 mt-1">Mike Thompson &bull; 480-689-9405 &bull; mike@plutusv.com &bull; plutusv.com</p>
        <p className="text-xs text-gray-400 mt-2 italic">This Soft Corporate Offer is subject to final contract negotiation and execution. All terms are indicative and non-binding until a definitive agreement is signed by both parties.</p>
      </div>
    </div>
  );
}

function InternalSummary({ quote }: { quote: QuoteResult }) {
  return (
    <div id="internal-summary" className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">INTERNAL</div>
        <h3 className="text-lg font-semibold">Commission Summary</h3>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2 text-gray-500 w-48">Quote Ref</td><td className="py-2 font-mono text-xs">PV-{quote.id.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td className="py-2 text-gray-500">Buyer</td><td className="py-2">{quote.input.buyerCompany}</td></tr>
          <tr><td className="py-2 text-gray-500">Product</td><td className="py-2">{quote.fuel.name} ({quote.deliveryTerm})</td></tr>
          <tr><td className="py-2 text-gray-500">Commission per {quote.commissionUnit}</td><td className="py-2 font-medium">${fmt(quote.commissionPerUnit)}</td></tr>
          <tr><td className="py-2 text-gray-500">Monthly Quantity</td><td className="py-2">{fmt(quote.input.monthlyQuantity)} {quote.input.monthlyQuantityUnit}</td></tr>
          <tr><td className="py-2 text-gray-500">Monthly Commission</td><td className="py-2 font-medium">${fmt(quote.commissionMonthly)}</td></tr>
          <tr><td className="py-2 text-gray-500">Contract Duration</td><td className="py-2">{quote.input.contractDurationMonths} {quote.input.contractDurationMonths === 1 ? 'month' : 'months'}</td></tr>
          <tr className="bg-green-50"><td className="py-2 text-gray-500 font-medium">Total Commission (Full Contract)</td><td className="py-2 font-bold text-lg text-green-700">${fmt(quote.commissionTotal)}</td></tr>
          <tr><td className="py-2 text-gray-500">Total Contract Value</td><td className="py-2">${fmt(quote.totalContractValue)}</td></tr>
          <tr><td className="py-2 text-gray-500">Commission %</td><td className="py-2">{(quote.commissionTotal / quote.totalContractValue * 100).toFixed(3)}%</td></tr>
        </tbody>
      </table>
      {quote.input.buyerTargetPrice !== undefined && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
          <span className="font-medium text-blue-700">Buyer target price:</span> ${fmt(quote.input.buyerTargetPrice)} / {quote.priceUnit}
          <span className="ml-2 text-gray-500">
            (our price: ${fmt(quote.pricePerUnit)}, delta: ${fmt(quote.pricePerUnit - quote.input.buyerTargetPrice)})
          </span>
        </div>
      )}
      {quote.input.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <span className="font-medium text-gray-600">Notes:</span> {quote.input.notes}
        </div>
      )}
    </div>
  );
}

export default function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [showCommission, setShowCommission] = useState(false);
  const [activeTab, setActiveTab] = useState<'proposal' | 'internal'>('proposal');

  useEffect(() => {
    fetch(`/api/quotes/${id}`).then((r) => r.json()).then(setQuote);
  }, [id]);

  if (!quote) return <div className="py-12 text-center text-gray-400">Loading quote...</div>;

  function printDocument(elementId: string) {
    const content = document.getElementById(elementId);
    if (!content) return;
    // Fix logo src to absolute URL before printing
    const clone = content.cloneNode(true) as HTMLElement;
    const imgs = clone.querySelectorAll('img');
    imgs.forEach(img => {
      if (img.src && img.src.startsWith('/')) {
        img.src = window.location.origin + img.src;
      }
    });
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Plutus Ventures - ${elementId === 'proposal-document' ? 'Proposal' : 'Internal Summary'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #111; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px 0; }
          .text-gray-500 { color: #6b7280; }
          td:first-child { color: #6b7280; }
          .font-medium { font-weight: 500; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .text-lg { font-size: 18px; }
          .text-xl { font-size: 20px; }
          .text-xs { font-size: 12px; }
          .text-sm { font-size: 14px; }
          .uppercase { text-transform: uppercase; }
          .tracking-wide { letter-spacing: 0.05em; }
          .italic { font-style: italic; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          h1, h2, h3 { margin-bottom: 8px; }
          .border-b { border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
          .border-t { border-top: 1px solid #d1d5db; }
          .divide-y > tr + tr { border-top: 1px solid #f3f4f6; }
          .bg-yellow-50 { background: #fefce8; }
          .bg-green-50 { background: #f0fdf4; }
          .text-green-700 { color: #15803d; }
          .text-yellow-800 { color: #854d0e; }
          .bg-yellow-100 { background: #fef9c3; padding: 2px 8px; border-radius: 4px; font-size: 12px; display: inline-block; }
          .mb-2 { margin-bottom: 8px; }
          .mb-3 { margin-bottom: 12px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-1 { margin-top: 4px; }
          .mt-2 { margin-top: 8px; }
          .mt-4 { margin-top: 16px; }
          .mt-8 { margin-top: 32px; }
          .pb-2 { padding-bottom: 8px; }
          .pt-4 { padding-top: 16px; }
          .p-3 { padding: 12px; }
          .rounded-lg { border-radius: 8px; }
          .w-48 { width: 192px; }
          .font-mono { font-family: monospace; }
          .bg-blue-50 { background: #eff6ff; }
          .text-blue-700 { color: #1d4ed8; }
          .bg-gray-50 { background: #f9fafb; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-400 { color: #9ca3af; }
          .justify-between { display: flex; justify-content: space-between; align-items: flex-start; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .gap-2 { gap: 8px; }
          .h-10 { height: 40px; }
          ol { padding-left: 20px; }
          ol li { margin-bottom: 8px; line-height: 1.6; }
          .space-y-2 > * + * { margin-top: 8px; }
          .list-decimal { list-style-type: decimal; }
          .list-inside { list-style-position: inside; }
          img { max-height: 40px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>${clone.innerHTML}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quote PV-{quote.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">{quote.input.buyerCompany} &bull; {quote.fuel.name} ({quote.deliveryTerm})</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => printDocument(activeTab === 'proposal' ? 'proposal-document' : 'internal-summary')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'proposal' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Buyer Proposal
        </button>
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'internal' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Internal Summary
        </button>
      </div>

      {activeTab === 'proposal' && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showCommission}
                onChange={(e) => setShowCommission(e.target.checked)}
                className="rounded"
              />
              Show commission on proposal
            </label>
          </div>
          <ProposalDocument quote={quote} showCommission={showCommission} />
        </>
      )}

      {activeTab === 'internal' && <InternalSummary quote={quote} />}
    </div>
  );
}
