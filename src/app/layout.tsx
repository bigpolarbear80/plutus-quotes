import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plutus Ventures — Quoting Tool",
  description: "Internal quoting and proposal generation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        <nav className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Plutus Ventures" width={200} height={38} priority />
          </Link>
          <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-gray-500">
            <Link href="/pipeline" className="hover:text-gray-900 transition-colors">Pipeline</Link>
            <Link href="/quote" className="hover:text-gray-900 transition-colors">New Quote</Link>
            <Link href="/quotes" className="hover:text-gray-900 transition-colors">Quotes</Link>
            <Link href="/admin" className="hover:text-gray-900 transition-colors">Pricing</Link>
          </div>
        </nav>
        <main className="mx-auto px-8 py-10">{children}</main>
      </body>
    </html>
  );
}
