import Link from 'next/link';

const FEATURES = [
  'Type catalog ile QR tipi secimi',
  'Tasarim ve sticker kompozisyonu',
  'Kaydedilebilir QR kayitlari',
  'Self-hosted PostgreSQL veri modeli',
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
            v1.qrbir.com hazirlik
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900">
            QR sticker aracindan cok tipli QR platformuna gecis.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Bu repo artik yalnizca sticker onizlemesi degil; type catalog, generator,
            dashboard ve self-hosted deployment yuzeyi olan yeni urunun cekirdegi olacak.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/qr-code-generator"
              className="rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700"
            >
              QR Catalog
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            >
              Dashboard Taslagi
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Ilk Cikis Kapsami
          </h2>
          <ul className="mt-6 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
