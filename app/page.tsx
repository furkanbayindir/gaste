"use client";

import { useState } from "react";
import { NewspaperForm, type NewspaperFormData } from "@/components/NewspaperForm";
import { LoadingState } from "@/components/LoadingState";
import { NewspaperPage } from "@/components/NewspaperPage";
import type { GeneratedNews } from "@/lib/gemini";

type ViewState =
  | { kind: "form"; error: string | null }
  | { kind: "loading" }
  | { kind: "result"; news: GeneratedNews; imageDataUrl: string | null };

export default function Page() {
  const [view, setView] = useState<ViewState>({ kind: "form", error: null });

  const handleSubmit = async (data: NewspaperFormData) => {
    setView({ kind: "loading" });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: data.topic,
          personName: data.personName || undefined,
          location: data.location || undefined,
          detail: data.detail || undefined,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setView({
          kind: "form",
          error:
            body.error ||
            "Haber üretilirken bir sorun oluştu. Lütfen tekrar deneyin.",
        });
        return;
      }

      const payload = (await res.json()) as {
        news: GeneratedNews;
        imageDataUrl: string | null;
      };
      setView({
        kind: "result",
        news: payload.news,
        imageDataUrl: payload.imageDataUrl,
      });
    } catch (err) {
      console.error(err);
      setView({
        kind: "form",
        error: "Ağ hatası. Bağlantınızı kontrol edip tekrar deneyin.",
      });
    }
  };

  if (view.kind === "loading") return <LoadingState />;
  if (view.kind === "result") {
    return (
      <NewspaperPage
        news={view.news}
        imageDataUrl={view.imageDataUrl}
        onReset={() => setView({ kind: "form", error: null })}
      />
    );
  }
  return <NewspaperForm onSubmit={handleSubmit} errorMessage={view.error} />;
}
