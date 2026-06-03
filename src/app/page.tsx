import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-10">
      <Image src="/logo.png" alt="Plutus Ventures" width={300} height={57} priority />
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-gray-400 font-medium">Internal Quoting &amp; Proposal Tool</p>
      </div>
      <div className="flex gap-4 mt-4">
        <Link
          href="/quote"
          className="px-8 py-3 bg-gray-900 text-white text-sm uppercase tracking-wider font-medium hover:bg-gray-800 transition-colors"
        >
          Create New Quote
        </Link>
        <Link
          href="/admin"
          className="px-8 py-3 border border-gray-300 text-sm uppercase tracking-wider font-medium hover:bg-gray-50 transition-colors"
        >
          Manage Pricing
        </Link>
      </div>
    </div>
  );
}
