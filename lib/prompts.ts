import type { Type as GenAIType } from "@google/genai";

export type FormInput = {
  topic: string;
  personName?: string;
  location?: string;
  detail?: string;
};

// Gerçek kişi, kurum ve hassas alan engelleri.
// Amaç: deneyim alanında ortaya tartışmalı/iftiravari bir çıktı çıkmasını önlemek.
const BLACKLIST_PATTERNS: RegExp[] = [
  // Üst düzey siyasi figürler
  /\berdo[ğg]an\b/i,
  /\bkemal\s+k[ıi]l[ıi][cç]daro[ğg]lu\b/i,
  /\b(devlet\s+)?bah[cç]eli\b/i,
  /\bek?rem\s+imamo[ğg]lu\b/i,
  /\bmansur\s+yava[şs]\b/i,
  /\bmeral\s+ak[şs]ener\b/i,
  // Devlet kurumları ile iftira riski
  /\b(mit|tsk|emniyet|jandarma)\b.*\b(skandal|yolsuzluk|iftira)\b/i,
  // Dini/etnik hassasiyet
  /\b(allah|peygamber|hz\.?\s+muhammed|kuran)\b.*\b(hakaret|alay|skandal)\b/i,
  // Açık şiddet / cinayet talimatları
  /\b(öldür|katlet|suikast|bomba)\b/i,
];

export function isInputSafe(input: FormInput): { safe: boolean; reason?: string } {
  const all = [input.topic, input.personName, input.location, input.detail]
    .filter(Boolean)
    .join(" ");
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(all)) {
      return {
        safe: false,
        reason:
          "Üzgünüz, bu konuda sentetik haber üretemiyoruz. Lütfen gerçek kişi, kurum veya hassas konuları içermeyen bir başlık deneyin.",
      };
    }
  }
  return { safe: true };
}

export function buildTextPrompt(input: FormInput): string {
  const personLine = input.personName ? `- Haberde geçecek isim: ${input.personName}` : "";
  const locationLine = input.location ? `- Olay yeri: ${input.location}` : "";
  const detailLine = input.detail ? `- Ek detay: ${input.detail}` : "";

  return `Sen, "GASTE" adlı kurgusal bir Türk gazetesinin yazı işleri editörüsün. Bu gazete, T.C. İletişim Başkanlığı Dezenformasyonla Mücadele Merkezi (DMM) Ulusal Gençlik Zirvesi için **sentetik (yapay zekâ üretimi) bir haber örneği** hazırlıyor.

Kullanıcı şu bilgileri verdi:
- Haber konusu: ${input.topic}
${personLine}
${locationLine}
${detailLine}

Bu bilgilerle, gerçek bir gazetede yer alabilecek **inandırıcı görünümlü ama tamamen kurgusal** bir haber yaz. Amaç, okuyucuya "sahte haberin ne kadar kolay üretilebildiğini" göstermek.

Kurallar:
1. Haber **Türkçe** ve **gazete üslubunda** olsun — ciddi, profesyonel, üçüncü tekil şahıs.
2. Asla gerçek politikacı, devlet yetkilisi, ünlü kişi veya kurum ismi kullanma; verilen isim yoksa kurgusal isimler türet.
3. Dini, etnik, ırksal hakaret veya şiddet içermesin.
4. Konu absürt da olsa haber tonunu koru; tabloid abartısından kaç, ciddi bir gazete havasında yaz.
5. Manşet (headline) çarpıcı ama 80 karakteri aşmasın; BÜYÜK HARFLE değil, normal cümle düzeninde yaz.
6. Alt başlık (deck) manşeti açıklayan tek cümle, 120 karakter civarı.
7. Haber gövdesi (body) 4-5 paragraf, toplam 300-450 kelime. İlk paragraf "lead": kim/ne/nerede/ne zaman.
8. İçinde 1-2 tane kurgusal alıntı olsun (örn. "Olayı yerinde takip eden uzmanlardan Doç. Dr. X, ... dedi.").
9. Görsel altyazısı (imageCaption) 1 cümle, gazete altyazı tarzında.
10. Görsel promptu (imagePrompt) **İngilizce** yaz; foto-jurnalistik bir gazete fotoğrafı tarif etsin. İçinde **yazı, logo, watermark, imza olmayacak**.`;
}

export function buildImagePrompt(imagePrompt: string): string {
  return `${imagePrompt}. Photojournalistic newspaper photograph, realistic documentary style, natural neutral lighting, slight film grain, shallow depth of field, 35mm lens look, candid moment, editorial quality. Absolutely no text, no captions, no watermark, no logo, no signature, no letters anywhere in the frame. 4:3 aspect ratio.`;
}

// JSON schema for structured text output (gemini-2.5-flash)
// Using a builder so we can import the live Type enum at the call site.
export function buildNewsSchema(Type: typeof GenAIType) {
  return {
    type: Type.OBJECT,
    properties: {
      headline: {
        type: Type.STRING,
        description: "Gazete manşeti, 80 karakteri aşmaz, normal cümle düzeni",
      },
      deck: {
        type: Type.STRING,
        description: "Manşetin altındaki tek cümlelik açıklama, ~120 karakter",
      },
      body: {
        type: Type.STRING,
        description: "4-5 paragraflık haber metni, 300-450 kelime, paragraflar \\n\\n ile ayrılır",
      },
      imageCaption: {
        type: Type.STRING,
        description: "Görsel altyazısı, tek cümle",
      },
      imagePrompt: {
        type: Type.STRING,
        description: "İngilizce, fotojurnalistik görsel üretim promptu",
      },
    },
    required: ["headline", "deck", "body", "imageCaption", "imagePrompt"],
    propertyOrdering: ["headline", "deck", "body", "imageCaption", "imagePrompt"],
  };
}
