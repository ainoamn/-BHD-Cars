export type ListingDescriptionInput = {
  locale: "ar" | "en";
  make?: string;
  model?: string;
  year?: number | null;
  mileage?: string;
  origin?: string;
  trim?: string;
  body?: string;
  fuel?: string;
  gearbox?: string;
  cylinders?: string;
  drive?: string;
  exterior?: string;
  interior?: string;
  smartKeys?: number;
  regularKeys?: number;
  price?: string;
  location?: string;
  vin?: string;
};

function templateDescription(input: ListingDescriptionInput) {
  const ar = input.locale !== "en";
  const title = [input.make, input.model, input.year].filter(Boolean).join(" ");
  if (ar) {
    return [
      `${title || "سيارة"} معروضة للبيع مباشرة عبر BHD Cars.`,
      input.trim ? `التجهيز: ${input.trim}.` : null,
      input.mileage ? `الممشى التقريبي: ${input.mileage}.` : null,
      input.origin ? `المواصفات: ${input.origin}.` : null,
      input.body ? `الهيكل: ${input.body}.` : null,
      input.fuel || input.gearbox || input.drive
        ? `المواصفات الفنية: ${[input.fuel, input.gearbox, input.cylinders ? `${input.cylinders} إسطوانات` : null, input.drive]
            .filter(Boolean)
            .join(" · ")}.`
        : null,
      input.exterior || input.interior
        ? `الألوان: خارجي ${input.exterior || "—"} · داخلي ${input.interior || "—"}.`
        : null,
      input.smartKeys || input.regularKeys
        ? `المفاتيح: ${input.smartKeys || 0} ذكي · ${input.regularKeys || 0} عادي.`
        : null,
      input.location ? `الموقع: ${input.location}.` : null,
      input.price ? `السعر المطلوب: ${input.price} ر.ع.` : null,
      "السيارة جاهزة للمعاينة والفحص. التمويل والتأمين والفحص بالنيابة متاحة من داخل الإعلان عبر BHD Cars.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    `${title || "Vehicle"} listed for sale on BHD Cars.`,
    input.trim ? `Trim: ${input.trim}.` : null,
    input.mileage ? `Approx. mileage: ${input.mileage}.` : null,
    input.origin ? `Specs origin: ${input.origin}.` : null,
    input.body ? `Body: ${input.body}.` : null,
    input.fuel || input.gearbox || input.drive
      ? `Mechanical: ${[input.fuel, input.gearbox, input.cylinders ? `${input.cylinders} cyl` : null, input.drive]
          .filter(Boolean)
          .join(" · ")}.`
      : null,
    input.exterior || input.interior
      ? `Colours: exterior ${input.exterior || "—"} · interior ${input.interior || "—"}.`
      : null,
    input.smartKeys || input.regularKeys
      ? `Keys: ${input.smartKeys || 0} smart · ${input.regularKeys || 0} regular.`
      : null,
    input.location ? `Location: ${input.location}.` : null,
    input.price ? `Asking price: ${input.price} OMR.` : null,
    "Ready for viewing and inspection. Finance, insurance, and proxy inspection are available from the listing on BHD Cars.",
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

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              input.locale === "ar"
                ? "اكتب وصف إعلان سيارة مختصرًا ومهنيًا بالعربية الفصحى السهلة، فقرة أو فقرتين، دون مبالغة أو وعود كاذبة، اعتمادًا على البيانات فقط."
                : "Write a concise professional car listing description in clear English, one or two short paragraphs, factual only, no hype.",
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
