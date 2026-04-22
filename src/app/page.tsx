import Link from 'next/link';
import {
  Globe, Phone, Mail, MessageCircle, Wifi, UserRound, MapPin, FileText, Image as ImageIcon, ArrowRight,
} from 'lucide-react';

const TYPES = [
  { icon: Globe,        label: 'URL / Link',  color: 'bg-blue-50 text-brand-blue' },
  { icon: Phone,        label: 'Telefon',      color: 'bg-teal-50 text-brand-teal' },
  { icon: Mail,         label: 'E-posta',      color: 'bg-blue-50 text-brand-blue' },
  { icon: MessageCircle,label: 'WhatsApp',     color: 'bg-teal-50 text-brand-teal' },
  { icon: Wifi,         label: 'Wi-Fi',        color: 'bg-blue-50 text-brand-blue' },
  { icon: UserRound,    label: 'vCard',        color: 'bg-teal-50 text-brand-teal' },
  { icon: MapPin,       label: 'Konum',        color: 'bg-blue-50 text-brand-blue' },
  { icon: FileText,     label: 'PDF',          color: 'bg-teal-50 text-brand-teal' },
  { icon: ImageIcon,    label: 'Görsel',       color: 'bg-blue-50 text-brand-blue' },
];

const FEATURES = [
  {
    title: 'Onlarca QR Tipi',
    desc: 'URL, vCard, WiFi, WhatsApp, konum, PDF ve daha fazlası için hazır formlar.',
    icon: '🧩',
  },
  {
    title: 'Tam Tasarım Kontrolü',
    desc: 'Şekil, çerçeve, renk ve logo ile kendi stilini yansıtan QR kodlar oluştur.',
    icon: '🎨',
  },
  {
    title: 'Kaydet & Yönet',
    desc: 'Hesabına kaydet, istediğin zaman düzenle, PNG veya SVG olarak indir.',
    icon: '💾',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#1a3a5e] to-[#1a4a6a] py-24 text-white">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-blue opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-teal opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
              Profesyonel QR Kodlar
            </p>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Her ortam için{' '}
              <span className="bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
                akıllı QR kod
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              URL&apos;den vCard&apos;a, WiFi&apos;den PDF&apos;e — markanıza özel şekil
              ve çerçevelerle tasarlayın, kaydedin, istediğinizde indirin.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/qr-code-generator"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-[#1a93c5]"
              >
                QR Kodu Oluştur
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Ücretsiz Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Type Pills ── */}
      <section className="border-b border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            Desteklenen Tipler
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {TYPES.map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${color}`}
              >
                <Icon size={15} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
              Neden QRBir?
            </h2>
            <p className="mt-4 text-base text-slate-500">
              Tasarlayın, kaydedin, paylaşın — tek platformda.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map(({ title, desc, icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <span className="text-4xl">{icon}</span>
                <h3 className="mt-5 text-lg font-bold text-brand-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-brand-teal py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Hemen başla, ilk QR kodun ücretsiz.
          </h2>
          <p className="mt-4 text-base text-white/80">
            Kayıt olmadan da oluşturabilir, beğenirsen hesabına kaydedebilirsin.
          </p>
          <Link
            href="/qr-code-generator"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-teal shadow-lg transition hover:bg-slate-50"
          >
            QR Oluşturmaya Başla
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
