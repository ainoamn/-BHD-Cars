"use client";

import { useEffect, useMemo, useState } from "react";

/** Last-resort body silhouettes — only when no real model photo resolves. */
const CATALOG: Record<string, string> = {
  sedan: "/stickers/sedan.jpg",
  suv: "/stickers/suv.jpg",
  coupe: "/stickers/coupe.jpg",
  pickup: "/stickers/pickup.jpg",
  hatch: "/stickers/hatch.jpg",
  van: "/stickers/van.jpg",
  moto: "/stickers/moto.jpg",
  truck: "/stickers/truck.jpg",
  ev: "/stickers/ev.jpg",
  boat: "/stickers/boat.jpg",
};

/** Shared stock URLs that were wrongly reused across many models — never prefer these. */
const GENERIC_STOCK =
  /images\.unsplash\.com\/(photo-1558981403-c5f9899a28bc|photo-1494976388531-d1058494cdd8|photo-1519641471654-76ce0107ad1b|photo-1549317661-bd32c8ce0db2|photo-1503376780353-7e6692767b70|photo-1559416523-140ddc3d238c|photo-1601584115197-04ecc1da58d4|photo-1593941707882-a5bba14938c7)/i;

function resolveBody(body?: string, modelId?: string) {
  const id = (modelId ?? "").toLowerCase();
  if (body === "boat" || /boat|jetski|yacht|marine|wave|vx|fx|gp/.test(id)) return "boat";
  if (body === "ev" || /ev|seal|ioniq|model-|atto|dolphin|cyber|mach-e|id\d|eq[a-z]|lyriq|air|gravity|zeekr|byd/.test(id)) {
    return "ev";
  }
  if (body && CATALOG[body]) return body;
  return "sedan";
}

function candidateList(src: string | undefined, makeId: string | undefined, modelId: string | undefined, body: string) {
  const list: string[] = [];
  const push = (url?: string) => {
    if (!url || list.includes(url)) return;
    list.push(url);
  };

  // 1) Local catalog photo for this exact make+model
  if (makeId && modelId) {
    for (const ext of [".jpg", ".png", ".webp", ".jpeg"] as const) {
      push(`/models/${makeId}--${modelId}${ext}`);
    }
  }

  // 2) Explicit image when it is not a known recycled stock URL
  if (src && !GENERIC_STOCK.test(src)) push(src);

  // 3) Explicit image even if stock (better than wrong body sticker when nothing else)
  if (src) push(src);

  // 4) Body silhouette last
  push(CATALOG[resolveBody(body, modelId)] || CATALOG.sedan);

  return list;
}

export function ModelThumb({
  alt,
  body = "sedan",
  modelId,
  makeId,
  className = "aspect-square w-full object-contain p-2",
  src,
}: {
  src?: string;
  alt: string;
  body?: string;
  makeId?: string;
  modelId?: string;
  className?: string;
}) {
  const candidates = useMemo(
    () => candidateList(src, makeId, modelId, body),
    [src, makeId, modelId, body],
  );
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [src, makeId, modelId, body]);
  const image = candidates[Math.min(index, candidates.length - 1)] || CATALOG.sedan;

  return (
    <span className="relative block overflow-hidden bg-white">
      <img
        key={image}
        src={image}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setIndex((value) => (value + 1 < candidates.length ? value + 1 : value))}
      />
    </span>
  );
}

export function stickerForBody(body?: string, modelId?: string) {
  return CATALOG[resolveBody(body, modelId)] || CATALOG.sedan;
}
