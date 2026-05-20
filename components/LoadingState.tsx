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
    <div className="min-h-dvh w-full paper-texture flex flex-col items-center justify-center px-6 portrait:!px-10 py-12 portrait:!py-16">
      <Image
        src="/arma.png"
        alt=""
        width={120}
        height={120}
        className="h-24 w-24 lg:h-32 lg:w-32 portrait:!h-40 portrait:!w-40 object-contain opacity-90 mb-6 portrait:!mb-8"
        priority
      />
      <div className="font-[family-name:var(--font-condensed)] uppercase tracking-[0.3em] text-sm portrait:!text-base text-ink-soft mb-3 portrait:!mb-5">
        GASTE · Baskı Hazırlanıyor
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-6xl portrait:!text-7xl font-black text-center max-w-3xl leading-tight">
        Manşetiniz <span className="italic text-accent">hazırlanıyor</span>…
      </h2>

      <div className="mt-10 lg:mt-12 portrait:!mt-14 w-full max-w-xl portrait:!max-w-2xl">
        <ul className="space-y-3 portrait:!space-y-4">
          {STEPS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <li
                key={i}
                className={`flex items-center gap-4 portrait:!gap-5 px-4 portrait:!px-6 py-3 portrait:!py-5 border-2 transition ${
                  isActive
                    ? "border-accent bg-accent/5"
                    : isDone
                    ? "border-black/30 text-ink-soft line-through"
                    : "border-black/15 text-ink-soft"
                }`}
              >
                <span className="font-[family-name:var(--font-condensed)] text-2xl portrait:!text-3xl font-black w-8 portrait:!w-10 text-center">
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="font-[family-name:var(--font-serif)] text-lg portrait:!text-2xl flex-1">
                  {label}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1 portrait:!gap-1.5">
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

      <p className="mt-10 portrait:!mt-12 text-sm portrait:!text-lg text-ink-soft italic max-w-md portrait:!max-w-xl text-center">
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
