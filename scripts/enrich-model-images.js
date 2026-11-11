/**
 * Enrich generated-models.json with Wikipedia page thumbnails (640px).
 * Downloads a compressed local copy into public/models when possible.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT = path.join(process.cwd(), "src", "lib", "generated-models.json");
const CACHE = path.join(process.cwd(), "scripts", "wiki-thumb-cache.json");
const modelsDir = path.join(process.cwd(), "public", "models");
const { CATALOG } = require("./model-catalog-data.js");

fs.mkdirSync(modelsDir, { recursive: true });

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "BHDCarsCatalogBot/1.0 (marketplace demo)",
          Accept: "*/*",
        },
        timeout: 25000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, url).toString()).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks), type: res.headers["content-type"] || "" }));
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function makeEnFromId(id) {
  const map = {
    "land-rover": "Land Rover",
    "harley-davidson": "Harley-Davidson",
    "rolls-royce": "Rolls-Royce",
    "alfa-romeo": "Alfa Romeo",
    "great-wall": "Great Wall",
    "aston-martin": "Aston Martin",
    "moto-guzzi": "Moto Guzzi",
    "royal-enfield": "Royal Enfield",
    "can-am": "Can-Am",
    "motors-212": "212",
    mercedes: "Mercedes-Benz",
    volkswagen: "Volkswagen",
    bmw: "BMW",
    mg: "MG",
    byd: "BYD",
    gmc: "GMC",
    ram: "Ram",
    mini: "Mini",
  };
  if (map[id]) return map[id];
  return id
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

async function wikiThumb(makeEn, modelEn, cache) {
  const key = `${makeEn}||${modelEn}`.toLowerCase();
  if (key in cache) return cache[key];
  const title = `${makeEn} ${modelEn}`;
  try {
    const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=640&pilicense=any&redirects=1&titles=${encodeURIComponent(title)}`;
    const { status, buf } = await get(api);
    if (status !== 200) {
      cache[key] = null;
      return null;
    }
    const json = JSON.parse(buf.toString("utf8"));
    const pages = Object.values(json.query?.pages || {});
    const thumb = pages[0]?.thumbnail?.source || null;
    if (thumb && /disambig|question_mark|Wiki_letter|Ambox/i.test(thumb)) {
      cache[key] = null;
      return null;
    }
    cache[key] = thumb;
    return thumb;
  } catch {
    cache[key] = null;
    return null;
  }
}

(async () => {
  const generated = JSON.parse(fs.readFileSync(OUT, "utf8"));
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  const priority = Object.keys(CATALOG);
  for (const makeId of priority) {
    const makeEn = makeEnFromId(makeId);
    const models = generated[makeId] || [];
    for (const model of models) {
      if (model.image && model.image.startsWith("/models/")) {
        skipped++;
        continue;
      }
      // already a wikimedia url?
      if (model.image && model.image.includes("wikimedia.org")) {
        skipped++;
        continue;
      }

      await sleep(400);
      const thumb = await wikiThumb(makeEn, model.name.en, cache);
      if (!thumb) {
        failed++;
        continue;
      }

      try {
        const img = await get(thumb.split("?")[0]);
        if (img.status === 200 && img.buf.length > 800 && img.buf.length < 2_500_000) {
          const ext = img.type.includes("png") || thumb.includes(".png") ? ".png" : img.type.includes("webp") ? ".webp" : ".jpg";
          const file = `${makeId}--${model.id}${ext}`;
          fs.writeFileSync(path.join(modelsDir, file), img.buf);
          model.image = `/models/${file}`;
          updated++;
          console.log("ok", makeId, model.id, img.buf.length);
        } else {
          model.image = thumb;
          updated++;
          console.log("url", makeId, model.id);
        }
      } catch {
        model.image = thumb;
        updated++;
      }

      if (updated % 20 === 0) {
        fs.writeFileSync(CACHE, JSON.stringify(cache));
        fs.writeFileSync(OUT, JSON.stringify(generated, null, 2));
        console.log("checkpoint updated=" + updated);
      }
    }
  }

  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  fs.writeFileSync(OUT, JSON.stringify(generated, null, 2));
  console.log("DONE updated=" + updated + " skipped=" + skipped + " failed=" + failed);
})();
