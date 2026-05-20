"use client";

import { useState } from "react";
import Image from "next/image";

export type NewspaperFormData = {
  topic: string;
  personName: string;
  location: string;
  detail: string;
};

type Props = {
  onSubmit: (data: NewspaperFormData) => void;
  errorMessage?: string | null;
};

const EXAMPLES = [
  { topic: "Uzayda yeni gezegen", personName: "Prof. Dr. Aylin Demir", location: "Erzurum", detail: "Konya'daki rasathaneden bir keşif" },
  { topic: "Süper hızlı tren", personName: "", location: "Ankara", detail: "Ankara-İstanbul 45 dakikaya iniyor" },
  { topic: "Dünyanın en büyük baklavası", personName: "Usta Mehmet Karaca", location: "Gaziantep", detail: "Guinness rekoru için 3 ton" },
];

export function NewspaperForm({ onSubmit, errorMessage }: Props) {
  const [data, setData] = useState<NewspaperFormData>({
    topic: "",
    personName: "",
    location: "",
    detail: "",
  });

  const canSubmit = data.topic.trim().length > 2;

  return (
    <div className="min-h-dvh w-full paper-texture flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-black/80 px-8 lg:px-16 portrait:px-10 py-6 portrait:py-8 flex items-center justify-between gap-6 bg-[#f6f1e7]/80 backdrop-blur-sm">
        <div className="flex items-center gap-5 portrait:gap-6">
          <Image
            src="/arma.png"
            alt="T.C. İletişim Başkanlığı arması"
            width={72}
            height={72}
            priority
            className="h-16 w-16 lg:h-20 lg:w-20 portrait:!h-24 portrait:!w-24 object-contain"
          />
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-condensed)] text-xs lg:text-sm portrait:!text-base uppercase tracking-[0.2em] text-ink-soft">
              T.C. İletişim Başkanlığı · DMM
            </div>
            <div className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl portrait:!text-5xl font-black text-ink">
              GASTE
            </div>
            <div className="font-[family-name:var(--font-condensed)] text-[10px] lg:text-xs portrait:!text-sm uppercase tracking-[0.18em] text-ink-soft">
              Sentetik Gazete Üreteci
            </div>
          </div>
        </div>
        <div className="hidden lg:block portrait:!hidden max-w-md text-right">
          <div className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-[0.15em] text-accent">
            Ulusal Gençlik Zirvesi · Deneyim Alanı
          </div>
          <p className="text-sm text-ink-soft italic mt-1">
            &ldquo;Yapay zekâ saniyeler içinde nasıl sahte haber üretir?&rdquo;
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-12 portrait:!px-10 py-8 lg:py-12 portrait:!py-16">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8 lg:mb-12 portrait:!mb-14">
            <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-6xl portrait:!text-7xl font-black text-ink leading-tight">
              Kendi <span className="italic text-accent">sahte</span> manşetini üret
            </h1>
            <p className="mt-4 portrait:!mt-6 text-lg lg:text-xl portrait:!text-2xl text-ink-soft max-w-3xl mx-auto leading-relaxed">
              Aşağıdaki birkaç bilgiyi gir; yapay zekâ bunlardan saniyeler içinde
              profesyonel görünümlü, tamamen kurgusal bir gazete sayfası üretsin.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) onSubmit(data);
            }}
            className="bg-white/70 border-2 border-black/80 shadow-[8px_8px_0_rgba(0,0,0,0.12)] p-6 lg:p-10 portrait:!p-12 space-y-6 portrait:!space-y-8"
          >
            <Field
              label="Haber Konusu"
              required
              hint="Gazetede yer alacak ana fikir"
              placeholder="örn. Uzayda yeni bir gezegen keşfedildi"
              value={data.topic}
              onChange={(v) => setData((d) => ({ ...d, topic: v }))}
              maxLength={120}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Field
                label="Kişi Adı"
                hint="İsteğe bağlı — haberde geçecek kurgusal kişi"
                placeholder="örn. Prof. Dr. Aylin Demir"
                value={data.personName}
                onChange={(v) => setData((d) => ({ ...d, personName: v }))}
                maxLength={80}
              />
              <Field
                label="Olay Yeri / Şehir"
                hint="İsteğe bağlı"
                placeholder="örn. Konya"
                value={data.location}
                onChange={(v) => setData((d) => ({ ...d, location: v }))}
                maxLength={80}
              />
            </div>

            <Field
              label="Kısa Açıklama"
              hint="İsteğe bağlı — habere katkı yapacak küçük bir detay"
              placeholder="örn. Bilim insanları haftalardır gözlem yapıyordu"
              value={data.detail}
              onChange={(v) => setData((d) => ({ ...d, detail: v }))}
              maxLength={200}
              multiline
            />

            {/* Quick examples */}
            <div className="pt-2">
              <div className="font-[family-name:var(--font-condensed)] text-xs portrait:!text-sm uppercase tracking-[0.18em] text-ink-soft mb-2 portrait:!mb-3">
                Fikrin yok mu? Hızlı örnekler:
              </div>
              <div className="flex flex-wrap gap-2 portrait:!gap-3">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setData(ex)}
                    className="text-sm portrait:!text-lg px-3 portrait:!px-5 py-2 portrait:!py-3 border border-black/30 hover:bg-black hover:text-paper transition rounded-sm"
                  >
                    {ex.topic}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="border-2 border-accent bg-accent/10 text-accent px-4 py-3 portrait:!py-4 text-sm portrait:!text-lg font-semibold"
              >
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-ink text-paper py-5 lg:py-6 portrait:!py-8 font-[family-name:var(--font-condensed)] text-xl lg:text-2xl portrait:!text-3xl uppercase tracking-[0.2em] hover:bg-accent transition disabled:bg-ink/40 disabled:cursor-not-allowed"
              >
                Manşeti Oluştur ▶
              </button>
            </div>

            <p className="text-center text-xs lg:text-sm portrait:!text-base text-ink-soft italic">
              Bu uygulama yapay zekânın ne kadar kolay sahte haber üretebildiğini
              göstermek için tasarlanmıştır. Üretilen tüm içerikler kurgusaldır.
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black/80 px-8 lg:px-16 portrait:!px-10 py-5 portrait:!py-7 flex items-center justify-between gap-6 portrait:!flex-col portrait:!items-start portrait:!gap-4 bg-[#f6f1e7]/80">
        <Image
          src="/dmmlogo2.png"
          alt="Dezenformasyonla Mücadele Merkezi · T.C. İletişim Başkanlığı"
          width={420}
          height={70}
          className="h-10 lg:h-12 portrait:!h-16 w-auto object-contain"
        />
        <div className="font-[family-name:var(--font-condensed)] text-[10px] lg:text-xs portrait:!text-sm uppercase tracking-[0.18em] text-ink-soft text-right portrait:!text-left">
          sentetik-gaste.vercel.app · DMM Ulusal Gençlik Zirvesi {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  multiline?: boolean;
};

function Field({
  label,
  required,
  hint,
  placeholder,
  value,
  onChange,
  maxLength,
  multiline,
}: FieldProps) {
  const inputClass =
    "w-full bg-paper border-2 border-black/70 px-4 portrait:!px-5 py-3 portrait:!py-5 text-lg lg:text-xl portrait:!text-2xl font-[family-name:var(--font-serif)] focus:border-accent outline-none transition";

  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2 portrait:!mb-3 gap-3">
        <span className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.18em] text-sm portrait:!text-base font-semibold">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </span>
        {hint && <span className="text-xs portrait:!text-sm text-ink-soft italic">{hint}</span>}
      </div>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          autoComplete="off"
          spellCheck={false}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          autoComplete="off"
          spellCheck={false}
          className={inputClass}
        />
      )}
      {maxLength && (
        <div className="mt-1 text-right text-xs text-ink-soft">
          {value.length} / {maxLength}
        </div>
      )}
    </label>
  );
}
