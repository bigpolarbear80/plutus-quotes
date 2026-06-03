import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Plutus Ventures</h1>
        <p className="text-lg text-gray-500">Internal Quoting &amp; Proposal Tool</p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/quote"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Create New Quote
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Manage Pricing
        </Link>
      </div>
    </div>
  );
}
