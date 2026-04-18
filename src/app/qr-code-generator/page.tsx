import Link from 'next/link';
import { QR_TYPE_REGISTRY } from '@/lib/qr-types/registry';

export default function QrCodeGeneratorCatalogPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
          Choose Type
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          All Types Of QR Codes
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          ME-QR benzeri type catalog akisini burada kuruyoruz. Hazir tipler builder’a bagli,
          digerleri sonraki fazlarda acilacak.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {QR_TYPE_REGISTRY.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.routeType}
              href={`/qr-code-generator/${item.routeType}`}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-fuchsia-50 p-3 text-fuchsia-600">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{item.label}</h2>
                    <p className="mt-1 text-sm text-slate-500">{item.shortDescription}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'ready'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status === 'ready' ? 'Ready' : 'Planned'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
