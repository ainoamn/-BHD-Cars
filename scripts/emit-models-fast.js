/**
 * Fast emit of full model catalog using local /models files + body fallbacks.
 * Does NOT call Wikipedia (use enrich-model-images.js for that).
 */
const fs = require("fs");
const path = require("path");

// Reuse catalog definition from build-model-catalog.js by evaluating the CATALOG block:
// For maintainability we duplicate the require of the catalog data file.
const catalogPath = path.join(__dirname, "model-catalog-data.js");
if (!fs.existsSync(catalogPath)) {
  console.error("Missing model-catalog-data.js — write it first");
  process.exit(1);
}
const { CATALOG, BODY_FALLBACK } = require("./model-catalog-data.js");

const OUT = path.join(process.cwd(), "src", "lib", "generated-models.json");
const modelsDir = path.join(process.cwd(), "public", "models");

function localImage(makeId, modelId) {
  for (const ext of [".jpg", ".png", ".webp"]) {
    const file = `${makeId}--${modelId}${ext}`;
    const full = path.join(modelsDir, file);
    if (fs.existsSync(full) && fs.statSync(full).size > 1000) return `/models/${file}`;
  }
  return null;
}

const result = {};
let local = 0;
let fallback = 0;
for (const [makeId, models] of Object.entries(CATALOG)) {
  result[makeId] = models.map(([id, ar, en, body, trims]) => {
    const image = localImage(makeId, id) || BODY_FALLBACK[body] || BODY_FALLBACK.sedan;
    if (image.startsWith("/models/")) local++;
    else fallback++;
    return { id, name: { ar, en }, body, image, trims: trims || ["Base"] };
  });
}

fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
const total = Object.values(result).reduce((a, m) => a + m.length, 0);
console.log("DONE makes=" + Object.keys(result).length + " models=" + total + " local=" + local + " fallback=" + fallback);
