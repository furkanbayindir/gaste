import { GoogleGenAI, Type } from "@google/genai";
import {
  buildImagePrompt,
  buildNewsSchema,
  buildTextPrompt,
  type FormInput,
} from "./prompts";

export type GeneratedNews = {
  headline: string;
  deck: string;
  body: string;
  imageCaption: string;
  imagePrompt: string;
};

export type GenerationResult = {
  news: GeneratedNews;
  imageDataUrl: string | null;
};

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY ortam değişkeni tanımlı değil. .env.local dosyasına ekleyin."
    );
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateNewsText(input: FormInput): Promise<GeneratedNews> {
  const ai = getClient();
  const prompt = buildTextPrompt(input);

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: buildNewsSchema(Type),
      temperature: 0.95,
      topP: 0.95,
      maxOutputTokens: 4096,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const raw = response.text;
  if (!raw) {
    console.error("[gemini] empty response. candidates:", JSON.stringify(response.candidates, null, 2));
    throw new Error("Metin üretimi boş yanıt döndü. Lütfen tekrar deneyin.");
  }

  // Bazı modeller markdown code fence ile sarmalanmış JSON döndürebiliyor.
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: GeneratedNews;
  try {
    parsed = JSON.parse(stripped) as GeneratedNews;
  } catch (parseErr) {
    console.error("[gemini] JSON parse failed. Raw response:\n", raw);
    console.error("[gemini] parse error:", parseErr);
    throw new Error("Metin üretim çıktısı geçerli JSON değil.");
  }

  if (!parsed.headline || !parsed.body) {
    throw new Error("Üretilen haber eksik alanlar içeriyor.");
  }
  return parsed;
}

export async function generateNewsImage(imagePromptRaw: string): Promise<string | null> {
  const ai = getClient();
  const prompt = buildImagePrompt(imagePromptRaw);

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || "image/png";
        return `data:${mime};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err) {
    console.error("[gemini] image generation failed:", err);
    return null;
  }
}

export async function generateNews(input: FormInput): Promise<GenerationResult> {
  // Metni önce üret, çünkü imagePrompt metinden geliyor.
  const news = await generateNewsText(input);
  const imageDataUrl = await generateNewsImage(news.imagePrompt);
  return { news, imageDataUrl };
}
