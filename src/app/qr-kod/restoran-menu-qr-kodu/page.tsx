import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, UtensilsCrossed, Wifi, MessageCircle, MapPin, Star, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Restoran için QR Menü Kodu Oluştur — Ücretsiz | QRBir',
  description:
    'Restoranınız için saniyeler içinde QR menü oluşturun. Müşterileriniz kendi telefonlarıyla menünüze anında ulaşsın. Ücretsiz, kayıt gerektirmez.',
  keywords: 'restoran qr menü, qr kod menü, dijital menü qr, restoran qr kodu ücretsiz',
  openGraph: {
    title: 'Restoran için QR Menü Kodu Oluştur — Ücretsiz',
    description:
      'Restoranınız için saniyeler içinde QR menü oluşturun. Müşterileriniz kendi telefonlarıyla menünüze anında ulaşsın.',
    type: 'website',
  },
};

const STEPS = [
  {
    num: '01',
    title: 'Menü linkini girin',
    desc: 'PDF linkinizi, web menünüzü veya herhangi bir URL\'yi yapıştırın.',
  },
  {
    num: '02',
    title: 'Tasarımı özelleştirin',
    desc: 'Renk, çerçeve ve "Menüyü Gör" CTA metniyle markanıza uygun hale getirin.',
  },
  {
    num: '03',
    title: 'İndirin ve yapıştırın',
    desc: 'PNG veya SVG olarak indirin. Masaya, kapıya veya kartvizite yapıştırın.',
  },
];

const FEATURES = [
  { icon: UtensilsCrossed, text: 'PDF veya web menüsü bağlantısı' },
  { icon: Wifi, text: 'Wi-Fi şifresi paylaşımı' },
  { icon: MessageCircle, text: 'WhatsApp\'tan sipariş alma' },
  { icon: MapPin, text: 'Google Haritalar\'da konum' },
  { icon: Star, text: 'Google yorum sayfasına yönlendirme' },
  { icon: Clock, text: 'Çalışma saatlerinizi paylaşın' },
];

const FAQS = [
  {
    q: 'QR menü oluşturmak için teknik bilgi gerekiyor mu?',
    a: 'Hayır. Menünüzün linkini kopyalayıp yapıştırmanız yeterli. Tasarımı birkaç tıkla özelleştirebilirsiniz.',
  },
  {
    q: 'Menüm değişirse QR kodu yeniden oluşturmam gerekir mi?',
    a: 'Eğer menü linkiniz aynı kalıyorsa (örneğin sabit bir URL veya PDF), QR kodu değiştirmenize gerek yok. Sadece linkteki içeriği güncelleyin.',
  },
  {
    q: 'Hangi boyutta bastırmalıyım?',
    a: 'Masa üzeri için 5×5 cm veya 7×7 cm idealdir. QRBir\'den indirilen SVG dosyası sınırsız çözünürlükte olduğundan her boyuta net basılır.',
  },
  {
    q: 'Ücretsiz mi?',
    a: 'Evet. QR oluşturma ve PNG/SVG indirme tamamen ücretsizdir. İstatistik takibi ve landing page gibi ek özellikler için ücretli planlar mevcuttur.',
  },
];

export default function RestoranMenuPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(32,164,219,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(76,187,194,0.12) 0%, transparent 50%) #eef4fb',
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/8 px-3 py-1 text-xs font-semibold text-brand-blue">
              <UtensilsCrossed size={12} />
              Restoran / Menü
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-brand-navy md:text-5xl">
              Masalara QR menü koyun,{' '}
              <span className="bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
                müşteriler anında açsın
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-500 max-w-xl">
              Basılı menü masrafı yok, güncelleme derdi yok. Müşterileriniz telefonunu tutarak
              menünüze ulaşıyor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/qr-code-generator/menu?preset=restaurant"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition hover:bg-[#1a93c5]"
              >
                Ücretsiz QR Menü Oluştur
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/blog/restoran-icin-qr-menu-nasil-olusturulur"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-600 backdrop-blur-sm transition hover:bg-white/80"
              >
                Rehberi Oku
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
              {['Kayıt gerektirmez', 'PNG & SVG indirme', '800×800px baskı kalitesi'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle2 size={12} className="text-brand-teal" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-brand-navy md:text-3xl">
              3 adımda QR menünüz hazır
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <span className="block text-4xl font-black text-slate-100 leading-none mb-3">
                  {num}
                </span>
                <h3 className="text-sm font-bold text-brand-navy">{title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/qr-code-generator/menu?preset=restaurant"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition hover:bg-[#1a93c5]"
            >
              Hemen Başla
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-20"
        style={{
          background:
            'radial-gradient(ellipse at 85% 20%, rgba(32,164,219,0.08) 0%, transparent 50%) #eef4fb',
        }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-brand-navy md:text-3xl">
              Sadece menüyle sınırlı değil
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Aynı QR kodu farklı müşteri temas noktalarında kullanın.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/60 px-4 py-3.5 backdrop-blur-md shadow-sm"
              >
                <Icon size={17} className="shrink-0 text-brand-blue" />
                <span className="text-xs font-medium text-slate-600">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-brand-navy text-center md:text-3xl">
            Sık Sorulan Sorular
          </h2>
          {/* FAQ schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: FAQS.map(({ q, a }) => ({
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: { '@type': 'Answer', text: a },
                })),
              }),
            }}
          />
          <div className="flex flex-col divide-y divide-slate-100">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-5">
                <p className="text-sm font-semibold text-brand-navy">{q}</p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-navy py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Restoranınıza özel QR menünüzü şimdi oluşturun
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Ücretsiz, kayıt gerektirmez. 30 saniyede hazır.
          </p>
          <Link
            href="/qr-code-generator/menu?preset=restaurant"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-blue/30 transition hover:bg-[#1a93c5]"
          >
            Ücretsiz QR Menü Oluştur
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
