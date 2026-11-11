"use client";

/**
 * Catalog-style model thumbnails (Sooq Cars look):
 * photoreal AI renders on white — never cartoon drawings, never outdoor photos.
 * Colorways follow BHD identity (night green, teal brass, navy).
 */
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
};

function resolveBody(body?: string, modelId?: string) {
  const id = (modelId ?? "").toLowerCase();
  if (body === "ev" || /ev|seal|ioniq|model-|atto|dolphin|cyber|mach-e|id\d|eq[a-z]|lyriq|air|gravity|zeekr|byd/.test(id)) {
    return "ev";
  }
  if (body && CATALOG[body]) return body;
  return "sedan";
}

export function ModelThumb({
  alt,
  body = "sedan",
  modelId,
  className = "aspect-square w-full object-contain p-2",
  src: _src,
  makeId: _makeId,
}: {
  src?: string;
  alt: string;
  body?: string;
  makeId?: string;
  modelId?: string;
  className?: string;
}) {
  const shape = resolveBody(body, modelId);
  const image = CATALOG[shape] || CATALOG.sedan;

  return (
    <span className="relative block overflow-hidden bg-white">
      <img src={image} alt={alt} className={className} loading="lazy" />
    </span>
  );
}

export function stickerForBody(body?: string, modelId?: string) {
  return CATALOG[resolveBody(body, modelId)] || CATALOG.sedan;
}
