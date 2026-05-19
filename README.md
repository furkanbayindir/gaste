# GASTE — Sentetik Gazete Üreteci

T.C. İletişim Başkanlığı **Dezenformasyonla Mücadele Merkezi (DMM)** tarafından
düzenlenen **Ulusal Gençlik Zirvesi**'nin deneyim alanında, dokunmatik ekranda
sunulan bir farkındalık uygulaması.

Ziyaretçi birkaç kelime girer; yapay zekâ saniyeler içinde profesyonel
görünümlü ama tamamen kurgusal bir gazete manşeti, haber metni ve görsel üretir.
Amaç, sahte haberin ne kadar kolay üretilebildiğini bizzat hissettirmektir.

> Üretilen tüm içerikler kurgusaldır. Her çıktıda
> *"Bu içerik yapay zekâ ile üretilmiş kurgusal bir örnektir"* ibaresi yer alır.

## Teknoloji

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4
- `@google/genai` 2.4.0 — Gemini text + image generation
  - Metin: `gemini-2.5-flash` (structured JSON, thinkingBudget=0)
  - Görsel: `gemini-2.5-flash-image` (4:3 fotojurnalistik)
- Vercel (Fluid Compute, region: `fra1`)

## Yerel çalıştırma

```bash
npm install
cp .env.example .env.local
# .env.local içinde GEMINI_API_KEY değerini Google AI Studio'dan alıp doldur:
# https://aistudio.google.com/apikey
npm run dev
```

→ http://localhost:3000

Kiosk simülasyonu için Chrome DevTools → Device Toolbar → 1920×1080 + touch.

## Production

`gaste.vercel.app` (veya `sentetik-gaste.vercel.app`).
Production env: `GEMINI_API_KEY` Vercel project settings altında tanımlıdır.

## Lisans

Etkinlik içi kurumsal kullanım için hazırlanmıştır.
