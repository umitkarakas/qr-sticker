export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date string
  persona?: string;
  keywords: string[];
  content: string; // HTML string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'restoran-icin-qr-menu-nasil-olusturulur',
    title: 'Restoran için QR Menü Nasıl Oluşturulur? Adım Adım Rehber',
    description:
      'Restoranınız için ücretsiz QR kod menü oluşturun. Müşterileriniz kendi akıllı telefonlarıyla menünüze anında ulaşsın.',
    publishedAt: '2026-04-20',
    persona: 'restaurant',
    keywords: [
      'restoran qr menü',
      'qr kod menü oluştur',
      'dijital menü',
      'qr menü ücretsiz',
    ],
    content: `
<h2>QR Menü Nedir?</h2>
<p>QR menü, restoranınızın fiziksel menüsünü dijital ortama taşıyan ve müşterilerin akıllı telefonlarıyla okutarak anında erişebildiği bir çözümdür. Tek bir QR kod, müşterinizi doğrudan menü web sayfanıza yönlendirir.</p>

<h2>Neden QR Menü Kullanmalısınız?</h2>
<ul>
  <li><strong>Hijyen:</strong> Fiziksel menü değil, her müşteri kendi telefonu üzerinden erişir.</li>
  <li><strong>Güncellenebilirlik:</strong> Menünüzü istediğiniz zaman değiştirebilir, QR kodu değiştirmenize gerek kalmaz.</li>
  <li><strong>Maliyet:</strong> Basılı menü masrafı ortadan kalkar.</li>
  <li><strong>Hız:</strong> Müşteriler masaya oturur oturmaz menüye ulaşabilir.</li>
</ul>

<h2>QR Menü Oluşturma Adımları</h2>
<ol>
  <li>QRBir'e girin ve "Menü URL" tipini seçin.</li>
  <li>Menünüzün web adresini girin (PDF linki veya web sayfası).</li>
  <li>Tasarımı özelleştirin: çerçeve, renk, CTA metni ekleyin.</li>
  <li>PNG veya SVG olarak indirin.</li>
  <li>Masalara, kapıya veya kartvizitlere yapıştırın.</li>
</ol>

<h2>Hangi Boyut Önerilir?</h2>
<p>Masa üzeri için 5×5 cm veya 7×7 cm yeterlidir. Kapı veya menü kapağı için 10×10 cm'e çıkabilirsiniz. QRBir'den indirdiğiniz SVG dosyası sınırsız çözünürlükte olduğundan her boyuta basılabilir.</p>
    `.trim(),
  },
  {
    slug: 'qr-kod-nedir-nasil-calisir',
    title: 'QR Kod Nedir, Nasıl Çalışır? Kapsamlı Rehber',
    description:
      'QR kodun ne olduğunu, nasıl çalıştığını ve işletmeler için nasıl kullanılabileceğini öğrenin.',
    publishedAt: '2026-04-15',
    keywords: ['qr kod nedir', 'qr kod nasıl çalışır', 'qr kod kullanımı'],
    content: `
<h2>QR Kod Nedir?</h2>
<p>QR (Quick Response — Hızlı Yanıt) kod, bilgiyi iki boyutlu bir matris barkoduna kodlayan bir sistemdir. 1994 yılında Japonya'da geliştirilen bu teknoloji, akıllı telefonların yaygınlaşmasıyla birlikte tüm dünyada kullanılır hale geldi.</p>

<h2>QR Kod Nasıl Çalışır?</h2>
<p>Bir QR kod, siyah-beyaz kareler dizisiyle metin, URL, telefon numarası veya diğer verileri depolar. Akıllı telefon kamerasıyla okutulduğunda, cihaz kodu çözümler ve içerdiği eylemi (URL açma, arama yapma vb.) gerçekleştirir.</p>

<h2>QR Kod Ne İşe Yarar?</h2>
<ul>
  <li>Web sitesi veya menü bağlantısı paylaşımı</li>
  <li>Wi-Fi şifresi paylaşımı</li>
  <li>Dijital kartvizit (vCard)</li>
  <li>WhatsApp ile hızlı iletişim</li>
  <li>Konum paylaşımı</li>
  <li>Google yorum sayfasına yönlendirme</li>
</ul>
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
