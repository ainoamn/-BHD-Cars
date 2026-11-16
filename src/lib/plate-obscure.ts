/** Client-side plate band obscure: covers the common lower plate zone with BHD branding. */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

function loadLogo(): Promise<HTMLImageElement | null> {
  return loadImage("/brand/bhd-mark.svg").catch(() => null);
}

/**
 * Draws a night-green band over the typical plate area (lower center)
 * and stamps the BHD mark so the plate number is no longer readable.
 */
export async function obscurePlateOnImage(src: string): Promise<string> {
  const [img, logo] = await Promise.all([loadImage(src), loadLogo()]);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const bandW = canvas.width * 0.42;
  const bandH = Math.max(28, canvas.height * 0.08);
  const x = (canvas.width - bandW) / 2;
  const y = canvas.height * 0.78;

  // Soft blur strip by pixelating the plate region first.
  const slice = ctx.getImageData(x, y, bandW, bandH);
  const block = 8;
  for (let py = 0; py < bandH; py += block) {
    for (let px = 0; px < bandW; px += block) {
      const i = (py * bandW + px) * 4;
      const r = slice.data[i];
      const g = slice.data[i + 1];
      const b = slice.data[i + 2];
      for (let dy = 0; dy < block && py + dy < bandH; dy++) {
        for (let dx = 0; dx < block && px + dx < bandW; dx++) {
          const j = ((py + dy) * bandW + (px + dx)) * 4;
          slice.data[j] = r;
          slice.data[j + 1] = g;
          slice.data[j + 2] = b;
        }
      }
    }
  }
  ctx.putImageData(slice, x, y);

  // Brand plate cover
  const radius = Math.min(14, bandH / 2);
  ctx.fillStyle = "rgba(9, 45, 36, 0.92)";
  ctx.beginPath();
  ctx.roundRect(x, y, bandW, bandH, radius);
  ctx.fill();

  ctx.strokeStyle = "rgba(181, 141, 85, 0.85)";
  ctx.lineWidth = Math.max(2, bandH * 0.06);
  ctx.stroke();

  if (logo) {
    const mark = Math.min(bandH * 0.7, bandW * 0.18);
    ctx.drawImage(logo, x + bandW / 2 - mark / 2, y + (bandH - mark) / 2, mark, mark);
  } else {
    ctx.fillStyle = "#b58d55";
    ctx.font = `bold ${Math.max(12, bandH * 0.35)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BHD", x + bandW / 2, y + bandH / 2);
  }

  return canvas.toDataURL("image/jpeg", 0.92);
}

export async function obscurePlatesOnImages(sources: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const src of sources) {
    try {
      out.push(await obscurePlateOnImage(src));
    } catch {
      out.push(src);
    }
  }
  return out;
}
