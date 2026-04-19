import type { Metadata } from 'next';
import Link from 'next/link';
import '@/index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'QR Platform',
  description: 'Cok tipli QR olusturma ve yonetim platformu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-neutral-100 text-slate-900 antialiased">
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
                QR Platform
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link href="/qr-code-generator" className="hover:text-slate-900">
                  Create QR
                </Link>
                <Link href="/dashboard" className="hover:text-slate-900">
                  Dashboard
                </Link>
                <Link href="/login" className="hover:text-slate-900">
                  Login
                </Link>
                <Link href="/register" className="hover:text-slate-900">
                  Register
                </Link>
              </nav>
            </div>
          </header>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
