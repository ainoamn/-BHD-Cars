/**
 * Second pass: resolve remaining fallbacks via Wikipedia title variants + Commons search.
 * Focus first on passenger/luxury/china/moto brands (skip heavy equipment).
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT = path.join(process.cwd(), "src", "lib", "generated-models.json");
const modelsDir = path.join(process.cwd(), "public", "models");
const SKIP = new Set([
  "man", "hino", "ashok-leyland", "jcb", "komatsu", "caterpillar", "bomag", "hamm",
  "bobcat", "hyster", "massey-ferguson", "new-holland", "grove", "gorica", "sany",
  "hangcha", "zoomlion", "xcmg", "sdlg", "scania", "shacman", "iveco", "golden-dragon",
  "king-long", "higer", "foton", "other", "mays", "sharmax",
]);

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "BHDCarsCatalogBot/1.0 (marketplace demo)", Accept: "*/*" }, timeout: 25000 },
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeEn(id) {
  const map = {
    mercedes: "Mercedes-Benz",
    "land-rover": "Land Rover",
    volkswagen: "Volkswagen",
    bmw: "BMW",
    byd: "BYD",
    mg: "MG",
    gmc: "GMC",
    mini: "Mini",
    "rolls-royce": "Rolls-Royce",
    "alfa-romeo": "Alfa Romeo",
    "great-wall": "GWM",
    "aston-martin": "Aston Martin",
    "harley-davidson": "Harley-Davidson",
    "royal-enfield": "Royal Enfield",
    "moto-guzzi": "Moto Guzzi",
    "can-am": "Can-Am",
    "lynk-co": "Lynk & Co",
    ssangyong: "KG Mobility",
  };
  if (map[id]) return map[id];
  return id.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

async function pageThumb(title) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=640&pilicense=any&redirects=1&titles=${encodeURIComponent(title)}`;
  const { status, buf } = await get(api);
  if (status !== 200) return null;
  const json = JSON.parse(buf.toString("utf8"));
  const page = Object.values(json.query?.pages || {})[0];
  const thumb = page?.thumbnail?.source;
  if (!thumb || /disambig|question_mark|Wiki_letter|Ambox|Edit-clear/i.test(thumb)) return null;
  return thumb;
}

async function commonsThumb(query) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&gsrnamespace=6&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=640`;
  const { status, buf } = await get(api);
  if (status !== 200) return null;
  const json = JSON.parse(buf.toString("utf8"));
  const pages = Object.values(json.query?.pages || {});
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    const url = info?.thumburl || info?.url;
    const title = page.title || "";
    if (!url) continue;
    if (!/\.(jpe?g|png|webp)$/i.test(title) && !info?.mime?.includes("image")) continue;
    if (/logo|wordmark|emblem|badge|icon|flag|map/i.test(title) && !/car|vehicle|front|side/i.test(title)) continue;
    return url;
  }
  return null;
}

async function saveLocal(makeId, modelId, thumb) {
  const img = await get(thumb.split("?")[0]);
  if (img.status !== 200 || img.buf.length < 800 || img.buf.length > 2_800_000) return thumb;
  const ext = img.type.includes("png") || thumb.includes(".png") ? ".png" : img.type.includes("webp") ? ".webp" : ".jpg";
  const file = `${makeId}--${modelId}${ext}`;
  fs.writeFileSync(path.join(modelsDir, file), img.buf);
  return `/models/${file}`;
}

(async () => {
  const generated = JSON.parse(fs.readFileSync(OUT, "utf8"));
  let updated = 0;
  let failed = 0;

  for (const [makeId, models] of Object.entries(generated)) {
    if (SKIP.has(makeId)) continue;
    const brand = makeEn(makeId);
    for (const model of models) {
      if (String(model.image || "").startsWith("/models/")) continue;
      const titles = [
        `${brand} ${model.name.en}`,
        model.name.en,
        `${brand} ${model.name.en} (car)`,
        `${brand} ${model.name.en} (vehicle)`,
      ];
      let thumb = null;
      for (const title of titles) {
        await sleep(280);
        thumb = await pageThumb(title);
        if (thumb) break;
      }
      if (!thumb) {
        await sleep(280);
        thumb = await commonsThumb(`${brand} ${model.name.en} car`);
      }
      if (!thumb) {
        failed++;
        continue;
      }
      try {
        model.image = await saveLocal(makeId, model.id, thumb);
        updated++;
        console.log("ok", makeId, model.id);
      } catch (e) {
        model.image = thumb;
        updated++;
        console.log("url", makeId, model.id);
      }
      if (updated % 25 === 0) {
        fs.writeFileSync(OUT, JSON.stringify(generated, null, 2));
        console.log("checkpoint", updated);
      }
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(generated, null, 2));
  console.log("DONE updated=" + updated + " failed=" + failed);
})();
