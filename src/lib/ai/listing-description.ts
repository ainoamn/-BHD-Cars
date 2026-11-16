export type AiListingStyle = "casual" | "professional" | "simple";

export type ListingDescriptionInput = {
  locale: "ar" | "en";
  style?: AiListingStyle;
  make?: string;
  model?: string;
  year?: number | null;
  condition?: string;
  mileage?: string;
  origin?: string;
  trim?: string;
  body?: string;
  seats?: string;
  fuel?: string;
  gearbox?: string;
  cylinders?: string;
  drive?: string;
  exterior?: string;
  interior?: string;
  license?: string;
  insurance?: string;
  interiorFeatures?: string[];
  exteriorFeatures?: string[];
  techFeatures?: string[];
  smartKeys?: number;
  regularKeys?: number;
  price?: string;
  payment?: string;
  location?: string;
  vin?: string;
  title?: string;
};

function styleHint(style: AiListingStyle | undefined, locale: "ar" | "en") {
  const s = style ?? "casual";
  if (locale === "ar") {
    if (s === "casual") return "بنبرة مرحة وودّية ومشرقة، قصيرة ومشجّعة، دون مبالغة كاذبة.";
    if (s === "simple") return "بأسلوب بسيط وواضح وجمل قصيرة جدًا.";
    return "بنبرة احترافية هادئة ومختصرة.";
  }
  if (s === "casual") return "in a cheerful, warm, upbeat tone — short and inviting, still factual.";
  if (s === "simple") return "in very simple short sentences.";
  return "in a calm professional tone.";
}

function templateDescription(input: ListingDescriptionInput) {
  const ar = input.locale !== "en";
  const title = input.title || [input.make, input.model, input.year].filter(Boolean).join(" ");
  const style = input.style ?? "casual";
  const features = [
    ...(input.interiorFeatures ?? []),
    ...(input.exteriorFeatures ?? []),
    ...(input.techFeatures ?? []),
  ].slice(0, 8);

  if (ar) {
    const opener =
      style === "casual"
        ? `${title || "سيارة"} جاهزة تفرح العين عبر BHD Cars — تعال شوفها عن قرب!`
        : style === "simple"
          ? `${title || "سيارة"} للبيع.`
          : `${title || "سيارة"} معروضة للبيع مباشرة عبر BHD Cars.`;
    return [
      opener,
      input.condition ? `الحالة: ${input.condition}.` : null,
      input.trim ? `التجهيز: ${input.trim}.` : null,
      input.mileage ? `الممشى التقريبي: ${input.mileage}.` : null,
      input.origin ? `المواصفات: ${input.origin}.` : null,
      input.body || input.seats
        ? `الهيكل: ${[input.body, input.seats].filter(Boolean).join(" · ")}.`
        : null,
      input.fuel || input.gearbox || input.drive
        ? `المواصفات الفنية: ${[input.fuel, input.gearbox, input.cylinders ? `${input.cylinders} إسطوانات` : null, input.drive]
            .filter(Boolean)
            .join(" · ")}.`
        : null,
      input.exterior || input.interior
        ? `الألوان: خارجي ${input.exterior || "—"} · داخلي ${input.interior || "—"}.`
        : null,
      input.license || input.insurance
        ? `الترخيص والتأمين: ${[input.license, input.insurance].filter(Boolean).join(" · ")}.`
        : null,
      features.length ? `أبرز التجهيزات: ${features.join("، ")}.` : null,
      input.smartKeys || input.regularKeys
        ? `المفاتيح: ${input.smartKeys || 0} ذكي · ${input.regularKeys || 0} عادي.`
        : null,
      input.location ? `الموقع: ${input.location}.` : null,
      input.price
        ? `السعر المطلوب: ${input.price} ر.ع.${input.payment ? ` · الدفع: ${input.payment}` : ""}.`
        : null,
      style === "simple"
        ? "معاينة وفحص متاحان."
        : "السيارة جاهزة للمعاينة والفحص. التمويل والتأمين والفحص بالنيابة متاحة من داخل الإعلان عبر BHD Cars.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const opener =
    style === "casual"
      ? `${title || "Vehicle"} is ready to brighten your drive on BHD Cars — come take a look!`
      : style === "simple"
        ? `${title || "Vehicle"} for sale.`
        : `${title || "Vehicle"} listed for sale on BHD Cars.`;

  return [
    opener,
    input.condition ? `Condition: ${input.condition}.` : null,
    input.trim ? `Trim: ${input.trim}.` : null,
    input.mileage ? `Approx. mileage: ${input.mileage}.` : null,
    input.origin ? `Specs origin: ${input.origin}.` : null,
    input.body || input.seats
      ? `Body: ${[input.body, input.seats].filter(Boolean).join(" · ")}.`
      : null,
    input.fuel || input.gearbox || input.drive
      ? `Mechanical: ${[input.fuel, input.gearbox, input.cylinders ? `${input.cylinders} cyl` : null, input.drive]
          .filter(Boolean)
          .join(" · ")}.`
      : null,
    input.exterior || input.interior
      ? `Colours: exterior ${input.exterior || "—"} · interior ${input.interior || "—"}.`
      : null,
    input.license || input.insurance
      ? `License & insurance: ${[input.license, input.insurance].filter(Boolean).join(" · ")}.`
      : null,
    features.length ? `Highlights: ${features.join(", ")}.` : null,
    input.smartKeys || input.regularKeys
      ? `Keys: ${input.smartKeys || 0} smart · ${input.regularKeys || 0} regular.`
      : null,
    input.location ? `Location: ${input.location}.` : null,
    input.price
      ? `Asking price: ${input.price} OMR${input.payment ? ` · ${input.payment}` : ""}.`
      : null,
    style === "simple"
      ? "Viewing and inspection available."
      : "Ready for viewing and inspection. Finance, insurance, and proxy inspection are available from the listing on BHD Cars.",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function generateListingDescription(input: ListingDescriptionInput) {
  const fallback = templateDescription(input);
  const key = process.env.OPENAI_API_KEY?.trim() || process.env.GROQ_API_KEY?.trim() || "";
  if (!key) return { text: fallback, source: "template" as const };

  const useGroq = Boolean(process.env.GROQ_API_KEY?.trim()) && !process.env.OPENAI_API_KEY?.trim();
  const endpoint = useGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = useGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
  const hint = styleHint(input.style, input.locale === "en" ? "en" : "ar");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: input.style === "casual" ? 0.7 : 0.45,
        messages: [
          {
            role: "system",
            content:
              input.locale === "ar"
                ? `اكتب وصف إعلان سيارة بالعربية الفصحى السهلة، فقرة أو فقرتين، اعتمادًا على البيانات فقط ودون مبالغة. اكتب ${hint}`
                : `Write a concise car listing description in clear English, one or two short paragraphs, factual only, no hype. Write ${hint}`,
          },
          {
            role: "user",
            content: JSON.stringify(input),
          },
        ],
      }),
    });
    if (!res.ok) return { text: fallback, source: "template" as const };
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) return { text: fallback, source: "template" as const };
    return { text, source: "ai" as const };
  } catch {
    return { text: fallback, source: "template" as const };
  }
}
