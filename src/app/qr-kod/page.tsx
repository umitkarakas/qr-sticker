import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

export const metadata: Metadata = {
  title: 'QR Kod Çözümleri — QRBir',
  description:
    'İşletme tipinize özel QR kod çözümlerini keşfedin. Restoran, düğün, etkinlik ve daha fazlası.',
};

const PERSONAS = [
  {
    href: '/qr-kod/restoran-menu-qr-kodu',
    icon: UtensilsCrossed,
    title: 'Restoran / Menü',
    description: 'Masalara QR menü koyun, müşteriler anında açsın.',
    color: 'from-orange-50 to-amber-50',
    iconColor: 'text-orange-500',
    tag: 'Popüler',
  },
];

export default function QrKodIndexPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse at 15% 25%, rgba(32,164,219,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 75%, rgba(76,187,194,0.10) 0%, transparent 55%) #eef4fb',
      }}
    >
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
            İşletmenize Özel QR Çözümleri
          </h1>
          <p className="mt-4 text-base text-slate-500 max-w-xl mx-auto">
            Hangi sektörde olursanız olun, size özel QR kod şablonları ve rehberlerle hızlıca
            başlayın.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {PERSONAS.map(({ href, icon: Icon, title, description, color, iconColor, tag }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-md transition hover:shadow-md hover:bg-white/80"
            >
              {tag && (
                <span className="absolute top-3 right-3 rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">
                  {tag}
                </span>
              )}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
              >
                <Icon size={22} className={iconColor} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                  {title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
              <ArrowRight
                size={14}
                className="mt-auto text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue"
              />
            </Link>
          ))}

          {/* Placeholder cards for upcoming personas */}
          {['Düğün / Nişan', 'Etkinlik', 'CV / Kartvizit'].map((name) => (
            <div
              key={name}
              className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/30 p-6 opacity-60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <span className="text-lg">🔜</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400">{name}</p>
                <p className="mt-0.5 text-xs text-slate-400">Yakında</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
