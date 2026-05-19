"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GeneratedNews } from "@/lib/gemini";

type Props = {
  news: GeneratedNews;
  imageDataUrl: string | null;
  onReset: () => void;
};

function trDate(): string {
  return new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function issueNumber(): string {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `Sayı ${String(day).padStart(4, "0")}`;
}

export function NewspaperPage({ news, imageDataUrl, onReset }: Props) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBanner(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const paragraphs = news.body.split(/\n{2,}|(?<=\.)\s{2,}/).filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-dvh w-full paper-texture flex flex-col relative animate-fade-in">
      {/* Awareness banner */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-accent text-white px-6 py-4 shadow-lg animate-slide-down">
          <div className="max-w-6xl mx-auto flex items-start gap-4">
            <div className="flex-1">
              <div className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.2em] text-xs font-semibold mb-1">
                ⚠ Farkındalık Uyarısı
              </div>
              <p className="text-sm lg:text-base leading-snug">
                Az önce gördüğünüz bu haber, sizin girdiğiniz birkaç kelimeden{" "}
                <strong>saniyeler içinde</strong> uyduruldu. Gerçek hayatta okuduğunuz
                haberlerin kaynağını her zaman doğrulayın.
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Uyarıyı kapat"
              className="font-[family-name:var(--font-condensed)] text-2xl leading-none px-2 hover:opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating "New Headline" button */}
      <button
        onClick={onReset}
        className="fixed top-6 right-6 z-50 bg-ink text-paper px-6 py-4 font-[family-name:var(--font-condensed)] uppercase tracking-[0.18em] text-sm shadow-lg hover:bg-accent transition flex items-center gap-2"
      >
        <span>◀ Yeni Haber</span>
      </button>

      {/* Newspaper sheet */}
      <article className="flex-1 max-w-7xl mx-auto w-full px-8 lg:px-14 py-10 lg:py-14">
        {/* Masthead */}
        <header className="border-b-4 border-black pb-4">
          <div className="flex items-end justify-between gap-6">
            <div className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.18em] text-xs lg:text-sm text-ink-soft leading-tight">
              <div>Türkiye Cumhuriyeti İletişim Başkanlığı</div>
              <div>Dezenformasyonla Mücadele Merkezi</div>
            </div>
            <Image
              src="/arma.png"
              alt=""
              width={64}
              height={64}
              className="h-12 w-12 lg:h-16 lg:w-16 object-contain opacity-70"
            />
          </div>
          <h1 className="font-[family-name:var(--font-display)] font-black text-[14vw] lg:text-[160px] leading-[0.85] tracking-[-0.04em] text-center my-3">
            GASTE
          </h1>
          <div className="flex items-center justify-between border-t-2 border-b border-black/80 py-2 text-xs lg:text-sm font-[family-name:var(--font-condensed)] uppercase tracking-[0.15em]">
            <span>{trDate()}</span>
            <span className="italic">Sentetik Yayın · Kurgusal</span>
            <span>{issueNumber()}</span>
          </div>
        </header>

        {/* Headline section */}
        <section className="py-6 lg:py-10 border-b-2 border-black/80">
          <div className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.25em] text-xs text-accent font-bold mb-3">
            Manşet · Özel Haber
          </div>
          <h2 className="font-[family-name:var(--font-display)] font-black text-4xl md:text-6xl lg:text-7xl leading-[1.02] text-ink">
            {news.headline}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-display)] italic text-xl lg:text-2xl text-ink-soft leading-snug max-w-4xl">
            {news.deck}
          </p>
        </section>

        {/* Body + image */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 lg:py-10">
          <figure className="lg:col-span-2 lg:row-span-1">
            <div className="border-2 border-black bg-black/5 aspect-[4/3] w-full overflow-hidden">
              {imageDataUrl ? (
                // Base64 data URL — Next/Image yerine düz <img>
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageDataUrl}
                  alt={news.imageCaption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-soft font-[family-name:var(--font-condensed)] uppercase tracking-[0.2em] text-xs p-6 text-center">
                  Görsel üretilemedi
                  <br />
                  (kurgusal foto-arşiv)
                </div>
              )}
            </div>
            <figcaption className="mt-2 font-[family-name:var(--font-serif)] text-sm italic text-ink-soft leading-snug">
              {news.imageCaption}{" "}
              <span className="not-italic font-[family-name:var(--font-condensed)] uppercase tracking-[0.15em] text-[10px] text-ink-soft/80">
                — GASTE Foto Servisi
              </span>
            </figcaption>
          </figure>

          <div className="lg:col-span-3">
            <div className="columns-1 md:columns-2 gap-8 column-rule text-[17px] lg:text-[18px] leading-[1.55] text-ink font-[family-name:var(--font-serif)] text-justify">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`mb-4 break-inside-avoid-column ${i === 0 ? "drop-cap" : ""}`}
                >
                  {p.trim()}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Sentetic disclaimer ribbon */}
        <section className="border-t-4 border-double border-black/80 pt-5">
          <div className="bg-accent text-white px-5 py-4 flex items-center gap-4">
            <span className="text-2xl font-black">⚠</span>
            <p className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.18em] text-sm lg:text-base font-semibold leading-snug">
              Bu içerik yapay zekâ ile üretilmiş kurgusal bir örnektir. Gerçek bir
              haber değildir.
            </p>
          </div>
        </section>
      </article>

      {/* Bottom footer with logos */}
      <footer className="border-t-2 border-black/80 px-8 lg:px-14 py-5 flex items-center justify-between gap-6 bg-[#f6f1e7]">
        <Image
          src="/dmmlogo2.png"
          alt="DMM · T.C. İletişim Başkanlığı"
          width={480}
          height={80}
          className="h-12 lg:h-14 w-auto object-contain"
        />
        <div className="font-[family-name:var(--font-condensed)] text-[10px] lg:text-xs uppercase tracking-[0.18em] text-ink-soft text-right">
          Ulusal Gençlik Zirvesi · Deneyim Alanı
          <br />
          gaste.vercel.app
        </div>
      </footer>
    </div>
  );
}
