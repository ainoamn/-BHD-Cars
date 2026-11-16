import { listingSections } from "@/lib/listing-sections";

export type ListingAssistAction = "route" | "title" | "description" | "polish";

export type ListingAssistInput = {
  locale: "ar" | "en";
  action: ListingAssistAction;
  prompt?: string;
  sectionId?: string;
  style?: "calm" | "clear" | "warm";
  facts?: Record<string, string | number | string[] | null | undefined>;
  /** When true (default for title/description), also produce the other language in the background. */
  bilingual?: boolean;
};

export type ListingAssistCopyResult = {
  ok: true;
  source: "ai" | "template";
  text: string;
  textAr: string;
  textEn: string;
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

function fact(f: ListingAssistInput["facts"], key: string) {
  const v = f?.[key];
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return String(v).trim();
}

function isSeriousSection(sectionId?: string) {
  return sectionId === "scrap" || sectionId === "heavy";
}

function titleBits(facts: ListingAssistInput["facts"], sectionId?: string) {
  const f = facts ?? {};
  if (sectionId === "tires") {
    return [fact(f, "brand"), fact(f, "size") || fact(f, "diameter"), fact(f, "product"), fact(f, "quantity") ? `×${fact(f, "quantity")}` : ""]
      .filter(Boolean);
  }
  if (sectionId === "parts" || sectionId === "consumables" || sectionId === "accessories") {
    return [fact(f, "partName") || fact(f, "name") || fact(f, "brand"), fact(f, "make"), fact(f, "model")].filter(Boolean);
  }
  if (sectionId === "plates") {
    return [fact(f, "plateDigits") || fact(f, "name"), fact(f, "code")].filter(Boolean);
  }
  return [
    fact(f, "make"),
    fact(f, "model"),
    fact(f, "year"),
    fact(f, "partName"),
    fact(f, "name"),
    fact(f, "plateDigits"),
    fact(f, "equipType"),
    fact(f, "brand"),
  ].filter(Boolean);
}

function templateTitle(facts: ListingAssistInput["facts"], locale: "ar" | "en", style?: ListingAssistInput["style"], sectionId?: string) {
  const bits = titleBits(facts, sectionId);
  const base =
    bits.join(locale === "ar" ? " " : " ") ||
    (locale === "ar" ? listingSections.find((s) => s.id === sectionId)?.name.ar ?? "عرض على BHD Cars" : listingSections.find((s) => s.id === sectionId)?.name.en ?? "Listing on BHD Cars");

  if (sectionId === "scrap") {
    return locale === "ar" ? `${base} — للتفكيك ببيانات معلنة` : `${base} — for dismantling, details declared`;
  }
  if (sectionId === "tires") {
    return locale === "ar" ? `${base} للبيع` : `${base} for sale`;
  }
  if (sectionId === "parts" || sectionId === "consumables" || sectionId === "accessories") {
    return locale === "ar" ? `${base} — قطعة جاهزة` : `${base} — ready part`;
  }
  if (style === "warm" && !isSeriousSection(sectionId)) {
    if (sectionId === "boats") {
      return locale === "ar" ? `${base} — جاهز للبحر` : `${base} — ready for the water`;
    }
    return locale === "ar" ? `${base} للبيع` : `${base} for sale`;
  }
  return locale === "ar" ? `${base} — جاهز للمعاينة` : `${base} — ready to view`;
}

function proseFacts(facts: ListingAssistInput["facts"], locale: "ar" | "en", sectionId?: string) {
  const f = facts ?? {};
  const parts: string[] = [];
  const push = (arLabel: string, enLabel: string, key: string, transform?: (v: string) => string) => {
    const raw = fact(f, key);
    if (!raw) return;
    const value = transform ? transform(raw) : raw;
    parts.push(locale === "ar" ? `${arLabel} ${value}` : `${enLabel} ${value}`);
  };

  if (sectionId === "tires") {
    push("النوع:", "Type:", "product");
    push("العلامة:", "Brand:", "brand");
    push("المقاس:", "Size:", "size");
    push("القطر:", "Diameter:", "diameter");
    push("الكمية:", "Qty:", "quantity");
    push("الحالة:", "Condition:", "condition");
    push("يناسب:", "Fits:", "fitment");
  } else if (sectionId === "scrap") {
    push("الشركة:", "Make:", "make");
    push("الطراز:", "Model:", "model");
    push("السنة:", "Year:", "year");
    push("المحرك:", "Engine:", "cylinders");
    push("الضرر:", "Damage:", "damageLevel");
    push("الوثائق:", "Papers:", "titleStatus");
    push("الشحن خارج السلطنة:", "Export:", "exportable");
  } else {
    push("الشركة:", "Make:", "make");
    push("الطراز:", "Model:", "model");
    push("السنة:", "Year:", "year");
    push("القطعة:", "Part:", "partName");
    push("العلامة:", "Brand:", "brand");
    push("الحالة:", "Condition:", "condition");
    push("الممشى:", "Mileage:", "mileage");
  }
  push("الموقع:", "Location:", "location");
  push("السعر:", "Price:", "price");
  push("السداد:", "Payment:", "payment");
  return parts;
}

function templateDescription(input: ListingAssistInput) {
  const locale = input.locale === "en" ? "en" : "ar";
  const sectionId = input.sectionId;
  const style = input.style ?? "clear";
  const serious = isSeriousSection(sectionId);
  const lines = proseFacts(input.facts, locale, sectionId);
  const bullets = lines.map((line) => `• ${line}`).join("\n");
  const compact = lines.join(locale === "ar" ? "، " : ", ");

  if (locale === "ar") {
    if (serious) {
      return ["عرض معلن عبر BHD Cars:", bullets, "المعاينة حسب الاتفاق قبل إتمام الصفقة."].join("\n");
    }
    if (style === "calm") {
      return [
        "تفاصيل العرض بصيغة مهنية عبر BHD Cars:",
        bullets,
        "المعاينة والفحص متاحان بالتنسيق المسبق.",
      ].join("\n");
    }
    if (style === "clear") {
      return [`للبيع: ${compact || "عرض على BHD Cars"}.`, "معاينة حسب الاتفاق."].join("\n");
    }
    // warm
    return [
      sectionId === "tires"
        ? "مرحبا! إطارات وعجلات جاهزة عبر BHD Cars."
        : "مرحبا! عرض جاهز يسهّل قرارك عبر BHD Cars.",
      bullets,
      "تعال شوفها عن قرب — المعاينة حسب الاتفاق.",
    ].join("\n");
  }

  if (serious) {
    return ["Declared listing on BHD Cars:", bullets, "Viewing by arrangement before the deal."].join("\n");
  }
  if (style === "calm") {
    return ["Professional listing details on BHD Cars:", bullets, "Viewing and inspection by prior arrangement."].join("\n");
  }
  if (style === "clear") {
    return [`For sale: ${compact || "BHD Cars listing"}.`, "Viewing by arrangement."].join("\n");
  }
  return [
    sectionId === "tires" ? "Hello! Tires and wheels ready on BHD Cars." : "Hello! A ready listing on BHD Cars.",
    bullets,
    "Come take a look — viewing by arrangement.",
  ].join("\n");
}

async function callModel(system: string, user: string, temperature = 0.55) {
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
        temperature,
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

function parseBilingual(raw: string | null): { ar?: string; en?: string } | null {
  if (!raw) return null;
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as { ar?: string; en?: string };
    if (parsed.ar || parsed.en) return parsed;
  } catch {
    /* not json */
  }
  return null;
}

async function generateBilingualCopy(input: ListingAssistInput, kind: "title" | "description"): Promise<ListingAssistCopyResult> {
  const locale = input.locale === "en" ? "en" : "ar";
  const serious = isSeriousSection(input.sectionId);
  const fallbackAr = kind === "title"
    ? templateTitle(input.facts, "ar", input.style, input.sectionId)
    : templateDescription({ ...input, locale: "ar" });
  const fallbackEn = kind === "title"
    ? templateTitle(input.facts, "en", input.style, input.sectionId)
    : templateDescription({ ...input, locale: "en" });

  const styleId = input.style ?? "clear";
  const styleHint = serious
    ? "honest, declared, non-celebratory"
    : styleId === "warm"
      ? "warm and friendly marketplace tone — welcoming opening sentence, then facts"
      : styleId === "calm"
        ? "calm professional tone — formal opening, structured bullets, no exclamation"
        : "ultra short and direct — one or two tight sentences, minimal fluff";

  const system =
    kind === "title"
      ? `You write realistic marketplace listing titles for BHD Cars (Oman). Return JSON only: {"ar":"...","en":"..."}.
Rules: use the given facts (brand, size, make, model, year, quantity, etc.). Never invent specs. Never use raw field keys. Never write generic filler like "عرض على BHD Cars" or "فرصة تفرّح العين" unless facts are empty. Max 80 chars each language. Required style=${styleId}: ${styleHint}. Arabic in ar, English in en.`
      : `You write realistic marketplace listing descriptions for BHD Cars (Oman). Return JSON only: {"ar":"...","en":"..."}.
Required style id=${styleId}. ${styleHint}.
Rules: Use only given facts. Never dump English field keys (product/brand/diameter). Never copy the same text for different styles — warm ≠ calm ≠ clear. Arabic in ar, English in en. Mention viewing by arrangement once.`;

  const ai = await callModel(
    system,
    JSON.stringify({ sectionId: input.sectionId, facts: input.facts, preferredLocale: locale, style: styleId }),
    styleId === "clear" ? 0.35 : 0.55,
  );
  const parsed = parseBilingual(ai);
  const textAr = (parsed?.ar || fallbackAr).slice(0, kind === "title" ? 100 : 4000);
  const textEn = (parsed?.en || fallbackEn).slice(0, kind === "title" ? 100 : 4000);
  const text = locale === "ar" ? textAr : textEn;
  return {
    ok: true,
    source: parsed?.ar || parsed?.en ? "ai" : "template",
    text,
    textAr,
    textEn,
  };
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
    return generateBilingualCopy(input, "title");
  }

  if (input.action === "description" || input.action === "polish") {
    return generateBilingualCopy(input, "description");
  }

  return { ok: false as const, error: "Unknown action" };
}
