# QR Sticker Designer — Proje Özeti

## Vizyon

Markalara uygun, baskıya hazır QR sticker tasarımı oluşturan, birden fazla projeye entegre edilebilir modüler bir araç. Tasarım aracı değil, **kompozisyon aracı**: QR kodu üret, şekle sok, markaya uyarla, baskıya hazırla.

---

## 3 Kullanım Senaryosu

### Senaryo 1: Kişisel Kullanım
- Hızlıca QR sticker oluştur, indir veya bas
- Marka preset'leri kayıtlı, tek tıkla üret

### Senaryo 2: Müşteri Projeleri (Restoran, Kafe, Menü Uygulamaları)
- Müşteri projesine embed edilmiş modül
- Sipariş akışı: Tasarla → QR oluştur → sipariş ver

### Senaryo 3: Online Mikro Site Builder
- Kullanıcı sitesini tasarlar, QR kodunu oluşturur
- Fiziksel ürün siparişi verir (sticker, pleksi panel, vb.)

---

## Mevcut Stack

| Katman    | Teknoloji                                    |
|-----------|----------------------------------------------|
| Frontend  | React 18.3 + TypeScript, Vite 5.4           |
| CSS       | Tailwind CSS 3.4                             |
| Routing   | react-router-dom v7                          |
| State     | React Context                                |
| Database  | Supabase (PostgreSQL, RLS)                   |
| Auth      | Supabase Auth                                |
| Backend   | Supabase Edge Functions (Deno)               |
| Validation| Zod 4.2                                      |
| QR        | qrcode library (mevcut — değiştirilecek)     |
| Icons     | Lucide React                                 |
| Deploy    | Cloudflare Pages                             |

---

## Mimari: 2 Bileşen

### Bileşen 1: QR Kod Motoru
İçerik tipine göre stilize QR kod üretir.

- **Girdi**: İçerik tipi + veri, stil (dot pattern, renk, gradient), logo, error correction
- **Çıktı**: SVG, PNG, raw data (kompozisyon için)

### Bileşen 2: Sticker Kompozisyon Motoru
QR kodu şekil içine yerleştirir, CTA ekler, baskıya hazır çıktı verir.

- **Girdi**: QR (Bileşen 1'den), marka profili, şekil, CTA, boyut
- **Çıktı**: Önizleme SVG, baskı dosyası (PNG/PDF), kesim dosyası

**Önemli**: Bu bir tasarım editörü değil. Parametrik SVG üretici + şekil kütüphanesi.

---

## Şekil Sistemi

Çıktı sadece dikdörtgen/daire değil — herhangi bir SVG path olabilir:

### Geometrik Şekiller
- Kare, dikdörtgen (rounded), daire, oval, pill

### Figüratif Şekiller
- Kalp, yıldız, like/thumbs-up, damla, bulut, konuşma balonu, altıgen, rozet, kalkan

### Nasıl Çalışır

Her şekil bir **SVG clipPath + outline path** çiftidir:

```typescript
interface StickerShape {
  id: string;                     // 'heart' | 'circle' | 'rounded-rect' | 'like' | ...
  name: string;                   // "Kalp", "Yuvarlak", vb.
  // Şeklin SVG path tanımı
  viewBox: string;                // "0 0 200 200"
  clipPath: string;               // QR + içerik bu path ile maskelenir
  outlinePath: string;            // Kesim çizgisi (die-cut hattı)
  // QR'ın şekil içindeki konumu
  qrArea: {
    x: number; y: number;
    width: number; height: number;
  };
  // CTA text konumu (opsiyonel — bazı şekillerde sığmaz)
  ctaArea?: {
    x: number; y: number;
    width: number;
    anchor: 'middle' | 'start';
  };
}
```

**Kompozisyon mantığı**:
```
1. Şekil path'ini al (kalp, yıldız, vb.)
2. clipPath ile maskeleme alanı oluştur
3. Arka plan rengini şekil içine doldur
4. QR kodu qrArea'ya yerleştir
5. CTA text varsa ctaArea'ya yaz
6. outlinePath → kesim çizgisi (baskı için ayrı katman)
```

Sonuç: Sticker **tam o şekilde kesilir**. Kalp şeklinde QR sticker, yıldız şeklinde WiFi sticker, vb.

---

## İçerik Tipleri

| Tip          | QR Data Formatı                     | Varsayılan CTA        | İkon            |
|-------------|-------------------------------------|-----------------------|-----------------|
| URL         | `https://example.com`               | "Ziyaret edin"        | Globe           |
| Instagram   | `https://instagram.com/user`        | "Bizi takip edin"     | Instagram       |
| WhatsApp    | `https://wa.me/905xxxxxxxxx`        | "Bize yazın"          | MessageCircle   |
| Google Yorum| `https://g.page/r/xxx/review`       | "Bizi değerlendirin"  | Star            |
| WiFi        | `WIFI:T:WPA;S:ad;P:sifre;;`        | "WiFi'a bağlanın"     | Wifi            |
| vCard       | `BEGIN:VCARD...END:VCARD`           | "Rehbere ekleyin"     | UserPlus        |
| Menü        | `https://menu.example.com`          | "Menüyü görün"        | UtensilsCrossed |
| Telefon     | `tel:+905xxxxxxxxx`                 | "Bizi arayın"         | Phone           |
| E-posta     | `mailto:info@example.com`           | "E-posta gönderin"    | Mail            |
| Konum       | Google Maps URL                     | "Bizi bulun"          | MapPin          |

---

## Marka Profili

```typescript
interface BrandProfile {
  id: string;
  name: string;                       // "Cafe Nero"
  colors: {
    primary: string;                  // QR dot rengi
    secondary: string;                // çerçeve/şekil rengi
    accent: string;                   // CTA arka plan
    background: string;               // sticker arka plan
    text: string;                     // CTA metin rengi
  };
  font: {
    family: string;                   // "Inter", "Poppins"
    ctaWeight: number;                // 600, 700
  };
  logo?: {
    url: string;                      // Supabase Storage
    shape: 'circle' | 'square' | 'rounded';
  };
  sector?: string;                    // preset tema seçimi için
}
```

---

## Sektör Preset'leri

| Sektör     | Dot Pattern     | Renk Tonu           | Şekil Önerisi     |
|-----------|-----------------|---------------------|--------------------|
| Restoran  | rounded         | Sıcak tonlar        | Rounded-rect, rozet|
| Kafe      | extra-rounded   | Earth tone          | Daire, pill        |
| Perakende | dots            | Canlı, kontrast     | Yıldız, rozet      |
| Kurumsal  | square          | Monokrom/lacivert   | Kare, dikdörtgen   |
| Sağlık    | rounded         | Beyaz-mavi-yeşil    | Kalkan, daire      |
| Emlak     | classy-rounded  | Koyu + altın accent | Altıgen, premium   |

---

## Baskı Spesifikasyonları

### Boyut Kuralları

```
Min QR boyutu:    20×20mm (logosuz) / 25×25mm (logolu)
Quiet zone:       4 modül (~3-4mm) QR etrafı
Safe zone:        Kesim çizgisinden 2mm içeride
Bleed:            Kesim çizgisinden 2mm dışarı
```

### Boyut Preset'leri

| İsim      | Boyut    | QR Alanı | Kullanım                   |
|----------|---------|----------|----------------------------|
| Mini     | 30mm    | 20mm     | Ürün etiketi, kartvizit    |
| Standart | 50mm    | 35mm     | Masa, kapı, ambalaj        |
| Büyük    | 70mm    | 50mm     | Vitrin, tabela              |
| Özel     | Serbest | Serbest  | Kullanıcı tanımlı          |

*Not: Figüratif şekillerde (kalp, yıldız) boyut = bounding box ölçüsü.*

### Kesim

| Tip        | Açıklama                              | Kullanım              |
|-----------|---------------------------------------|-----------------------|
| Kiss Cut  | Sticker kesilir, backing sağlam       | Sticker sheet         |
| Die Cut   | Tam kesim (şekil konturunda)          | Tekli sticker         |

Figüratif şekillerde (kalp, like, yıldız) kesim çizgisi = `outlinePath`. Sticker o şekilde kesilir.

### Çıktı Formatları

| Hedef               | Format            | Renk  | Kesim Bilgisi         |
|--------------------|-------------------|-------|-----------------------|
| Ekran önizleme     | SVG               | RGB   | —                     |
| Evde yazıcı        | PNG 300 DPI       | RGB   | Kesim guide çizgisi   |
| Kesici cihaz       | PNG + SVG cut path| RGB   | Registration marks    |
| Matbaa             | PDF/X-4           | CMYK  | CutContour spot color |

---

## Veritabanı (Supabase)

```sql
-- Marka profilleri
brand_profiles (
  id uuid PK,
  user_id uuid FK,
  name text,
  colors jsonb,
  font jsonb,
  logo_url text,
  sector text,
  created_at timestamptz,
  updated_at timestamptz
);

-- Sticker tasarımları
sticker_designs (
  id uuid PK,
  user_id uuid FK,
  brand_profile_id uuid FK,
  project_id uuid,               -- hangi projeye ait (nullable)
  content_type text,             -- 'url','instagram','whatsapp', vb.
  content_data jsonb,            -- {url, phone, ssid, vb.}
  qr_style jsonb,               -- {dotType, cornerType, colors, gradient, errorCorrection}
  shape_id text,                 -- 'heart','circle','rounded-rect', vb.
  shape_config jsonb,            -- {backgroundColor, borderColor, borderWidth}
  cta_config jsonb,              -- {text, icon, position, fontSize, color}
  size_preset text,
  custom_size_mm jsonb,
  cut_type text,                 -- 'kiss','die'
  preview_url text,
  print_file_url text,
  cut_file_url text,
  name text,
  tags text[],
  created_at timestamptz,
  updated_at timestamptz
);

-- Siparişler
sticker_orders (
  id uuid PK,
  user_id uuid FK,
  design_id uuid FK,
  material text,                 -- 'vinyl','paper','transparent','plexiglass'
  quantity integer,
  size_mm jsonb,
  status text DEFAULT 'pending', -- pending → preparing → printing → shipping → delivered
  notes text,
  unit_price numeric,
  total_price numeric,
  shipping_address jsonb,
  tracking_number text,
  created_at timestamptz,
  updated_at timestamptz
);

-- Şekil kütüphanesi (admin)
sticker_shapes (
  id text PK,                    -- 'heart', 'star', 'like', vb.
  name text,
  category text,                 -- 'geometric' | 'figurative' | 'icon'
  svg_data jsonb,                -- {viewBox, clipPath, outlinePath, qrArea, ctaArea}
  is_active boolean DEFAULT true,
  sort_order integer
);

-- Sektör preset'leri (admin)
sector_presets (
  id uuid PK,
  sector text,
  name text,
  qr_style jsonb,
  shape_id text FK,
  colors jsonb,
  is_active boolean DEFAULT true
);
```

---

## Modül Yapısı

```
@qr-sticker/core       — QR üretim + kompozisyon motoru (framework-agnostic)
@qr-sticker/react      — React bileşenleri (Designer, Preview, Export)
@qr-sticker/shapes     — SVG şekil kütüphanesi (geometrik + figüratif)
@qr-sticker/print      — Baskıya hazır dosya üretimi (PNG 300dpi, PDF, kesim SVG)
@qr-sticker/presets    — Sektör temaları & içerik tipi config'leri
```

---

## Teknoloji Kararları

| Karar                  | Seçim                                   | Neden                                       |
|-----------------------|-----------------------------------------|---------------------------------------------|
| QR motor              | `qr-code-styling` (veya maintained fork)| Dot tipi, gradient, logo embed, SVG çıktı   |
| Şekil sistemi         | Kendi SVG path kütüphanesi              | clipPath + outlinePath, tam kontrol          |
| Kompozisyon           | SVG DOM manipülasyonu                   | Parametrik, anlık önizleme                   |
| PDF üretim            | `pdf-lib`                               | CMYK desteği, client-side                    |
| Matbaa PDF (CutContour)| Supabase Edge Function                 | Spot color server-side gerekli               |
| Dosya depolama        | Supabase Storage                        | Mevcut altyapı                               |

---

## Faz Planı

### Faz 1: QR Motor + Şekil Sistemi + Önizleme
- `qr-code-styling` entegrasyonu
- İçerik tipleri (URL, Instagram, WhatsApp, WiFi, vCard, vb.)
- QR stil parametreleri (dot type, renkler, logo)
- Şekil kütüphanesi (5 geometrik + 5 figüratif)
- Kompozisyon motoru (clipPath + QR yerleştirme + CTA)
- React bileşeni: `<StickerDesigner />` — canlı önizleme
- PNG/SVG export

### Faz 2: Marka Profili + Preset'ler
- Marka profili CRUD (Supabase)
- Sektör preset'leri
- İçerik tipine göre varsayılan CTA + ikon
- Marka rengi → otomatik QR + şekil renklendirme

### Faz 3: Baskıya Hazır Çıktı
- Boyut preset sistemi (mm bazlı)
- Bleed + safe zone hesaplama
- PNG 300 DPI export
- Kesici cihaz çıktısı (PNG baskı + SVG cut path)
- Matbaa PDF (CMYK + CutContour)

### Faz 4: Sipariş Sistemi + Entegrasyon
- Sipariş formu & veritabanı
- Durum takibi
- Müşteri projelerine embed API
- Mikro site builder entegrasyonu
