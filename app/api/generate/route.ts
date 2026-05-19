import { NextResponse } from "next/server";
import { generateNews } from "@/lib/gemini";
import { isInputSafe, type FormInput } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

// Naïve in-memory rate limit (kiosk için yeterli; tek instance varsayımı).
// Production'da Vercel KV/Redis ile değiştirilebilir.
const lastHitByIp = new Map<string, number>();
const RATE_WINDOW_MS = 5000;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

function validateInput(body: unknown): FormInput | { error: string } {
  if (!body || typeof body !== "object") return { error: "Geçersiz istek gövdesi." };
  const b = body as Record<string, unknown>;
  const topic = typeof b.topic === "string" ? b.topic.trim() : "";
  if (!topic) return { error: "Haber konusu zorunludur." };
  if (topic.length > 200) return { error: "Haber konusu çok uzun." };

  const personName = typeof b.personName === "string" ? b.personName.trim() : undefined;
  const location = typeof b.location === "string" ? b.location.trim() : undefined;
  const detail = typeof b.detail === "string" ? b.detail.trim() : undefined;

  const totalLength =
    topic.length + (personName?.length ?? 0) + (location?.length ?? 0) + (detail?.length ?? 0);
  if (totalLength > 800) return { error: "Toplam girdi uzunluğu çok büyük." };

  return {
    topic,
    personName: personName || undefined,
    location: location || undefined,
    detail: detail || undefined,
  };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const now = Date.now();
  const last = lastHitByIp.get(ip);
  if (last && now - last < RATE_WINDOW_MS) {
    return NextResponse.json(
      { error: "Çok hızlı istek. Lütfen birkaç saniye bekleyin." },
      { status: 429 }
    );
  }
  lastHitByIp.set(ip, now);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const validated = validateInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const safety = isInputSafe(validated);
  if (!safety.safe) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  try {
    const result = await generateNews(validated);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata.";
    console.error("[/api/generate] failed:", err);
    return NextResponse.json(
      { error: `Haber üretilemedi: ${message}` },
      { status: 500 }
    );
  }
}
