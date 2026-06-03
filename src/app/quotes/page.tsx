'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuoteResult } from '@/lib/types';

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function QuotesListPage() {
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-12 text-center text-gray-400">Loading quotes...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Quotes</h1>
        <Link
          href="/quote"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          New Quote
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">No quotes yet.</p>
          <Link href="/quote" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Create your first quote
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3 text-right">Contract Value</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">PV-{q.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{q.input.buyerCompany}</td>
                  <td className="px-4 py-3">{q.fuel.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      q.deliveryTerm === 'CIF' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {q.deliveryTerm}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">${fmt(q.totalContractValue)}</td>
                  <td className="px-4 py-3 text-right text-green-700">${fmt(q.commissionTotal)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/proposals/${q.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
