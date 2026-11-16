import { listingSections } from "@/lib/listing-sections";

export type ListingAssistAction = "route" | "title" | "description" | "polish";

export type ListingAssistInput = {
  locale: "ar" | "en";
  action: ListingAssistAction;
  prompt?: string;
  sectionId?: string;
  style?: "calm" | "clear" | "warm";
  facts?: Record<string, string | number | string[] | null | undefined>;
};

function sectionCatalog() {
  return listingSections.map((s) => ({
    id: s.id,
    nameAr: s.name.ar,
    nameEn: s.name.en,
    blurbAr: s.blurb.ar,
    blurbEn: s.blurb.en,
  }));
}

function templateRoute(prompt: string, locale: "ar" | "en") {
  const q = prompt.toLowerCase();
  const rules: Array<{ id: string; keys: string[] }> = [
    { id: "cars-rent", keys: ["ايجار", "تأجير", "rent", "hire", "يومي", "شهري"] },
    { id: "scrap", keys: ["تفكيك", "سكراب", "غير صالحة", "scrap", "salvage", "حادث كلي"] },
    { id: "motorcycle", keys: ["دراجة", "سكوتر", "خوذة", "motorcycle", "scooter", "atv"] },
    { id: "heavy", keys: ["حفار", "شيول", "رافعة", "كرين", "excavator", "forklift", "معدات"] },
    { id: "trucks", keys: ["شاحنة", "حافلة", "مقطورة", "تريلا", "truck", "bus", "trailer"] },
    { id: "boats", keys: ["قارب", "جت", "يخت", "بحري", "boat", "jetski", "yacht"] },
    { id: "plates", keys: ["لوحة", "رقم مميز", "plate", "رقم"] },
    { id: "tires", keys: ["إطار", "جنط", "tire", "rim", "wheel"] },
    { id: "consumables", keys: ["زيت", "فلتر", "سائل", "oil", "fluid", "filter", "brake fluid"] },
    { id: "parts", keys: ["قطعة", "قطع", "محرك", "فرامل", "part", "oem", "spare"] },
    { id: "accessories", keys: ["إضافة", "تجهيز", "شاشة", "accessory", "cover", "audio"] },
    { id: "cars-sale", keys: ["سيارة", "كامري", "لاند", "car", "sedan", "suv"] },
  ];
  for (const rule of rules) {
    if (rule.keys.some((k) => q.includes(k))) {
      const section = listingSections.find((s) => s.id === rule.id);
      return {
        sectionId: rule.id,
        reason:
          locale === "ar"
            ? `أنسب مسار حسب وصفك: ${section?.name.ar ?? rule.id}`
            : `Best path from your description: ${section?.name.en ?? rule.id}`,
      };
    }
  }
  return {
    sectionId: "cars-sale",
    reason:
      locale === "ar"
        ? "لم يتضح التصنيف بدقة — نبدأ بمسار السيارات للبيع ويمكنك التغيير."
        : "Classification unclear — starting with cars for sale; you can change.",
  };
}

function templateTitle(facts: ListingAssistInput["facts"], locale: "ar" | "en", style?: ListingAssistInput["style"]) {
  const f = facts ?? {};
  const bits = [f.make, f.model, f.year, f.partName, f.name, f.plateDigits, f.equipType]
    .filter(Boolean)
    .map(String);
  const base = bits.join(" ") || (locale === "ar" ? "عرض على BHD Cars" : "Listing on BHD Cars");
  if (style === "warm") {
    return locale === "ar" ? `${base} — فرصة تفرّح العين!` : `${base} — ready to brighten your drive!`;
  }
  return locale === "ar" ? `${base} — جاهز للمعاينة` : `${base} — ready to view`;
}

function templateDescription(input: ListingAssistInput) {
  const f = input.facts ?? {};
  const ar = input.locale !== "en";
  const style = input.style ?? "clear";
  const lines = Object.entries(f)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .slice(0, 12)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`);

  if (ar) {
    const opener =
      style === "warm"
        ? "مرحبا! هذه السيارة جاهزة تفرّح يومك عبر BHD Cars."
        : style === "calm"
          ? "تفاصيل العرض كما أدخلها البائع:"
          : "ملخص العرض:";
    return [opener, ...lines.map((l) => `• ${l}`), "المعاينة والفحص متاحان حسب الاتفاق."].join("\n");
  }
  const opener =
    style === "warm"
      ? "Hello! This vehicle is ready to brighten your day on BHD Cars."
      : style === "calm"
        ? "Listing facts as entered:"
        : "Listing summary:";
  return [opener, ...lines.map((l) => `• ${l}`), "Viewing and inspection by arrangement."].join("\n");
}

async function callModel(system: string, user: string) {
  const key = process.env.OPENAI_API_KEY?.trim() || process.env.GROQ_API_KEY?.trim() || "";
  if (!key) return null;
  const useGroq = Boolean(process.env.GROQ_API_KEY?.trim()) && !process.env.OPENAI_API_KEY?.trim();
  const endpoint = useGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = useGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.65,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function runListingAssist(input: ListingAssistInput) {
  const locale = input.locale === "en" ? "en" : "ar";

  if (input.action === "route") {
    const prompt = (input.prompt || "").trim();
    const fallback = templateRoute(prompt, locale);
    const ai = await callModel(
      locale === "ar"
        ? "أنت موجّه عروض BHD Cars. اختر sectionId واحدًا من القائمة فقط وأرجع JSON: {\"sectionId\":\"...\",\"reason\":\"...\"}. لا تنسخ أسماء مواقع أخرى."
        : "You route BHD Cars listings. Pick one sectionId from the catalog and return JSON {\"sectionId\":\"...\",\"reason\":\"...\"}. Do not copy other marketplaces.",
      JSON.stringify({ prompt, catalog: sectionCatalog() }),
    );
    if (ai) {
      try {
        const parsed = JSON.parse(ai.replace(/```json|```/g, "").trim()) as {
          sectionId?: string;
          reason?: string;
        };
        if (parsed.sectionId && listingSections.some((s) => s.id === parsed.sectionId)) {
          return { ok: true as const, source: "ai" as const, ...parsed, sectionId: parsed.sectionId };
        }
      } catch {
        /* fallback */
      }
    }
    return { ok: true as const, source: "template" as const, ...fallback };
  }

  if (input.action === "title") {
    const cheerful = input.style === "warm";
    const fallback = templateTitle(input.facts, locale, input.style);
    const langLock =
      locale === "ar"
        ? "اكتب بالعربية فقط. ممنوع أي كلمة إنجليزية أو ترجمة مزدوجة."
        : "Write in English only. No Arabic text and no bilingual dual lines.";
    const ai = await callModel(
      locale === "ar"
        ? cheerful
          ? `اكتب عنوان عرض قصير مرحًا وودّيًا بالعربية الفصحى السهلة (أقل من 80 حرفًا) من البيانات المعطاة. حيوي ومشجّع دون مبالغة كاذبة. ${langLock} أرجع النص فقط.`
          : `اكتب عنوان عرض قصير ودقيق بالعربية الفصحى السهلة (أقل من 80 حرفًا) من البيانات المعطاة. بلا مبالغة. ${langLock} أرجع النص فقط.`
        : cheerful
          ? `Write a short cheerful, warm listing title under 80 chars from the given facts. Inviting but factual. ${langLock} Return text only.`
          : `Write a short factual listing title under 80 chars from the given facts. No hype. ${langLock} Return text only.`,
      JSON.stringify({ facts: input.facts, sectionId: input.sectionId }),
    );
    return { ok: true as const, source: ai ? ("ai" as const) : ("template" as const), text: (ai || fallback).slice(0, 100) };
  }

  if (input.action === "description" || input.action === "polish") {
    const fallback = templateDescription({ ...input, locale });
    const styleHint =
      input.style === "warm"
        ? locale === "ar"
          ? "بنبرة مرحة وودّية ومشرقة — قصيرة ومشجّعة دون مبالغة كاذبة"
          : "cheerful, warm, and upbeat — short and inviting, still factual"
        : input.style === "calm"
          ? locale === "ar"
            ? "بنبرة هادئة مهنية"
            : "calm professional"
          : locale === "ar"
            ? "بأسلوب واضح مباشر"
            : "clear and direct";
    const langLock =
      locale === "ar"
        ? "اكتب بالعربية فقط. ممنوع الإنجليزية أو عرض لغتين معًا."
        : "Write in English only. Do not include Arabic or dual-language lines.";
    const ai = await callModel(
      locale === "ar"
        ? `اكتب وصف عرض حقيقي ومفيد بالعربية الفصحى السهلة ${styleHint}. فقرة أو نقاط. اعتمد على البيانات المدخلة فقط. ${langLock} أرجع النص فقط.`
        : `Write a real, useful listing description ${styleHint}. One short paragraph or bullets. Use only the given facts. ${langLock} Return text only.`,
      JSON.stringify({ facts: input.facts, sectionId: input.sectionId, prompt: input.prompt }),
    );
    return {
      ok: true as const,
      source: ai ? ("ai" as const) : ("template" as const),
      text: (ai || fallback).slice(0, 4000),
    };
  }

  return { ok: false as const, error: "Unknown action" };
}
