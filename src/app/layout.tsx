import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plutus Ventures — Quoting Tool",
  description: "Internal quoting and proposal generation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
            Plutus Ventures
          </Link>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/quote" className="text-gray-600 hover:text-gray-900">New Quote</Link>
            <Link href="/quotes" className="text-gray-600 hover:text-gray-900">Quotes</Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
