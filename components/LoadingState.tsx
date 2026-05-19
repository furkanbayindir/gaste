"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const STEPS = [
  "Editörlerimiz başlığı yazıyor",
  "Foto muhabirleri görseli çekiyor",
  "Sayfa dizgisi yapılıyor",
];

export function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-dvh w-full paper-texture flex flex-col items-center justify-center px-6 py-12">
      <Image
        src="/arma.png"
        alt=""
        width={120}
        height={120}
        className="h-24 w-24 lg:h-32 lg:w-32 object-contain opacity-90 mb-6"
        priority
      />
      <div className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.3em] text-sm text-ink-soft mb-3">
        GASTE · Baskı Hazırlanıyor
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-6xl font-black text-center max-w-3xl leading-tight">
        Manşetiniz <span className="italic text-accent">hazırlanıyor</span>…
      </h2>

      <div className="mt-10 lg:mt-12 w-full max-w-xl">
        <ul className="space-y-3">
          {STEPS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <li
                key={i}
                className={`flex items-center gap-4 px-4 py-3 border-2 transition ${
                  isActive
                    ? "border-accent bg-accent/5"
                    : isDone
                    ? "border-black/30 text-ink-soft line-through"
                    : "border-black/15 text-ink-soft"
                }`}
              >
                <span className="font-[family-name:var(--font-condensed)] text-2xl font-black w-8 text-center">
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="font-[family-name:var(--font-serif)] text-lg flex-1">
                  {label}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1">
                    <Dot delay="0s" />
                    <Dot delay="0.15s" />
                    <Dot delay="0.3s" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-10 text-sm text-ink-soft italic max-w-md text-center">
        Tüm sayfa birkaç saniye içinde önünüze gelecek. İşte sahte haberin korkutucu hızı tam da bu.
      </p>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-accent loading-dot"
      style={{ animationDelay: delay }}
    />
  );
}
