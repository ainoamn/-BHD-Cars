"use client";

import { useState } from "react";

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
  const [failed, setFailed] = useState(false);
  const src = id === "mercedes" ? "/makes/mercedes-star.svg" : `/makes/${id}.svg`;

  if (failed) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-night text-xs font-bold text-ivory ${className}`}>
        {mark}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ${className}`}>
      <img
        src={src}
        alt={name}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
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
