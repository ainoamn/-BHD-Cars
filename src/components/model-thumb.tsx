"use client";

/** AI sticker art by body shape — never real photographs. */
const STICKERS: Record<string, string> = {
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

function hueForId(id?: string) {
  if (!id) return 0;
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 48; // subtle variety so stickers don't look identical across models
}

function resolveBody(body?: string, modelId?: string) {
  const id = (modelId ?? "").toLowerCase();
  if (body === "ev" || /ev|seal|ioniq|model-|atto|dolphin|cyber|mach-e|id\d|eq[a-z]|lyriq|air|gravity/.test(id)) {
    return "ev";
  }
  if (body && STICKERS[body]) return body;
  return "sedan";
}

export function ModelThumb({
  alt,
  body = "sedan",
  modelId,
  className = "aspect-square w-full object-contain",
  /** kept for API compatibility — ignored so we never show real photos */
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
  const sticker = STICKERS[shape] || STICKERS.sedan;
  const hue = hueForId(modelId || alt);

  return (
    <span className="relative block overflow-hidden bg-[#f3f4f6]">
      <img
        src={sticker}
        alt={alt}
        className={className}
        loading="lazy"
        style={{ filter: `hue-rotate(${hue}deg) saturate(1.05)` }}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
    </span>
  );
}

export function stickerForBody(body?: string, modelId?: string) {
  return STICKERS[resolveBody(body, modelId)] || STICKERS.sedan;
}
