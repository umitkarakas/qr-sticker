'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Lock } from 'lucide-react';
import { QR_TYPE_REGISTRY } from '@/lib/qr-types/registry';

export default function QrCodeGeneratorCatalogPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return QR_TYPE_REGISTRY;
    return QR_TYPE_REGISTRY.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q),
    );
  }, [query]);

  const ready   = filtered.filter((t) => t.status === 'ready');
  const planned = filtered.filter((t) => t.status === 'planned');

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* breadcrumb */}
          <p className="mb-1 text-xs font-medium text-slate-400 uppercase tracking-widest">
            QRBir / Tür Seç
          </p>
          <h1 className="text-3xl font-bold text-brand-navy">
            Tüm QR Kod Türleri
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Oluşturmak istediğin QR kodun türünü seç.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ── Search ── */}
        <div className="relative mb-10 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tür ara… (URL, WiFi, vCard…)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-brand-navy shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        {/* ── Ready types ── */}
        {ready.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Hazır Tipler
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ready.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.routeType}
                    href={`/qr-code-generator/${item.routeType}`}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
                        <p className="mt-0.5 text-xs text-slate-400 leading-tight line-clamp-1">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Planned types ── */}
        {planned.length > 0 && (
          <section>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Yakında
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {planned.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.routeType}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                        <p className="mt-0.5 text-xs text-slate-400 leading-tight line-clamp-1">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                    <Lock size={14} className="shrink-0 text-slate-300" />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── No results ── */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">
              &ldquo;{query}&rdquo; için sonuç bulunamadı.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
