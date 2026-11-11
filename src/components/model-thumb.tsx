"use client";

import { useMemo, useState } from "react";

const BODY_FALLBACK: Record<string, string> = {
  sedan: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
  coupe: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  pickup: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80",
  hatch: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
  van: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=900&q=80",
  moto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
  truck: "https://images.unsplash.com/photo-1601584115197-04ecc1da58d4?auto=format&fit=crop&w=900&q=80",
  ev: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
};

export function ModelThumb({
  src,
  alt,
  body = "sedan",
  makeId,
  modelId,
  className = "aspect-[16/10] w-full object-cover bg-soft",
}: {
  src: string;
  alt: string;
  body?: string;
  makeId?: string;
  modelId?: string;
  className?: string;
}) {
  const fallback = BODY_FALLBACK[body] || BODY_FALLBACK.sedan;
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (makeId && modelId) {
      for (const ext of [".jpg", ".png", ".webp"]) {
        list.push(`/models/${makeId}--${modelId}${ext}`);
      }
    }
    if (src) list.push(src);
    list.push(fallback);
    return [...new Set(list)];
  }, [src, makeId, modelId, fallback]);

  const [index, setIndex] = useState(0);
  const current = candidates[Math.min(index, candidates.length - 1)];

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setIndex((value) => Math.min(value + 1, candidates.length - 1))}
    />
  );
}
