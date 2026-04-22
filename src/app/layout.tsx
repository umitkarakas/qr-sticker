import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import '@/index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'QRBir — QR Kod Oluşturucu',
  description: 'URL, vCard, WiFi, WhatsApp ve daha fazlası için özelleştirilebilir QR kodlar oluşturun.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-brand-navy antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="QRBir"
                width={120}
                height={48}
                priority
                className="h-10 w-auto"
              />
            </Link>

            {/* Nav */}
            <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
              <Link href="/qr-code-generator" className="hover:text-brand-navy transition-colors">
                QR Oluştur
              </Link>
              {session && (
                <Link href="/dashboard" className="hover:text-brand-navy transition-colors">
                  Panelim
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue md:inline-flex"
                  >
                    Panelim
                  </Link>
                  <Link
                    href="/qr-code-generator"
                    className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a93c5]"
                  >
                    QR Oluştur
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue md:inline-flex"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/qr-code-generator"
                    className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a93c5]"
                  >
                    QR Oluştur
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
