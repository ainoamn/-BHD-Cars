"use client";

import { useState } from "react";

const EXTS = [".svg", ".png", ".webp", ".jpg"] as const;

function logoCandidates(id: string) {
  if (id === "mercedes") {
    return ["/makes/mercedes-star.svg", "/makes/mercedes.svg", ...EXTS.map((ext) => `/makes/${id}${ext}`)];
  }
  return EXTS.map((ext) => `/makes/${id}${ext}`);
}

export function BrandLogo({
  id,
  mark,
  name,
  className = "",
}: {
  id: string;
  mark: string;
  name: string;
  className?: string;
}) {
  const candidates = logoCandidates(id);
  const [index, setIndex] = useState(0);
  const exhausted = index >= candidates.length;

  if (exhausted) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-night text-xs font-bold text-ivory ${className}`}>
        {mark}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ${className}`}>
      <img
        src={candidates[index]}
        alt={name}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setIndex((value) => value + 1)}
      />
    </span>
  );
}

export function ModelName({
  name,
  locale,
  className = "",
}: {
  name: { ar: string; en: string };
  locale: "ar" | "en";
  className?: string;
}) {
  const primary = name[locale];
  const secondary = locale === "ar" ? name.en : name.ar;
  const showSecondary = secondary && secondary !== primary;

  return (
    <span className={`block ${className}`}>
      <span className="block font-semibold leading-snug text-night">{primary}</span>
      {showSecondary && <span className="mt-0.5 block text-[11px] text-muted">{secondary}</span>}
    </span>
  );
}
