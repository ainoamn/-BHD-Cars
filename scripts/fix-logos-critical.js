/**
 * Re-fetch critical brand logos that currently show wrong marks / text banners.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const outDir = path.join(process.cwd(), "public", "makes");

const LOGOS = {
  mercedes: [
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mercedes.svg",
    "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
  ],
  lexus: [
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Lexus_division_emblem.svg",
    "https://cdn.worldvectorlogo.com/logos/lexus-2.svg",
    "https://www.carlogos.org/car-logos/lexus-logo.png",
  ],
  hyundai: [
    "https://upload.wikimedia.org/wikipedia/commons/0/09/Hyundai_Motor_Company_logo_%28yellow%29.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/hyundai-motor-company.svg",
    "https://www.carlogos.org/car-logos/hyundai-logo.png",
  ],
  "land-rover": [
    "https://upload.wikimedia.org/wikipedia/en/4/4b/Land_Rover_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/land-rover-1.svg",
    "https://cdn.worldvectorlogo.com/logos/land-rover-2.svg",
    "https://www.carlogos.org/car-logos/land-rover-logo.png",
  ],
  porsche: [
    "https://upload.wikimedia.org/wikipedia/commons/7/7a/Porsche_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/porsche-2.svg",
    "https://www.carlogos.org/car-logos/porsche-logo.png",
  ],
  dodge: [
    "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dodge_logo_%282011%29.svg",
    "https://cdn.worldvectorlogo.com/logos/dodge.svg",
    "https://www.carlogos.org/car-logos/dodge-logo.png",
  ],
  mini: [
    "https://upload.wikimedia.org/wikipedia/commons/a/a0/MINI_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/mini-1.svg",
    "https://www.carlogos.org/car-logos/mini-logo.png",
  ],
  jeep: [
    "https://upload.wikimedia.org/wikipedia/commons/3/3e/Jeep_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/jeep-3.svg",
    "https://www.carlogos.org/car-logos/jeep-logo.png",
  ],
  kia: [
    "https://upload.wikimedia.org/wikipedia/commons/1/13/Kia_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/kia-3.svg",
    "https://www.carlogos.org/car-logos/kia-logo.png",
  ],
  bmw: [
    "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    "https://www.carlogos.org/car-logos/bmw-logo.png",
  ],
  honda: [
    "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg",
    "https://www.carlogos.org/car-logos/honda-logo.png",
  ],
  ford: [
    "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
    "https://www.carlogos.org/car-logos/ford-logo.png",
  ],
  gmc: [
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/GMC_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/gmc-2.svg",
    "https://www.carlogos.org/car-logos/gmc-logo.png",
  ],
  mitsubishi: [
    "https://upload.wikimedia.org/wikipedia/commons/5/5a/Mitsubishi_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/mitsubishi-3.svg",
    "https://www.carlogos.org/car-logos/mitsubishi-logo.png",
  ],
  byd: [
    "https://upload.wikimedia.org/wikipedia/commons/9/99/BYD_Auto_logo.svg",
    "https://cdn.worldvectorlogo.com/logos/byd.svg",
    "https://www.carlogos.org/car-logos/byd-logo.png",
  ],
  toyota: [
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
    "https://www.carlogos.org/car-logos/toyota-logo.png",
  ],
  nissan: [
    "https://upload.wikimedia.org/wikipedia/commons/8/8b/Nissan_logo.svg",
    "https://www.carlogos.org/car-logos/nissan-logo.png",
  ],
};

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("http://") ? http : https;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "image/svg+xml,image/png,image/*,*/*;q=0.8",
          Referer: "https://commons.wikimedia.org/",
        },
        timeout: 30000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(new URL(res.headers.location, url).toString()).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            buf: Buffer.concat(chunks),
            type: res.headers["content-type"] || "",
          }),
        );
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function looksValid(buf, type) {
  if (!buf || buf.length < 400) return false;
  const head = buf.slice(0, 240).toString("utf8").toLowerCase();
  if (head.includes("<!doctype html") || head.includes("<html")) return false;
  // reject our own prior text-banner placeholders
  if (head.includes(">land rover<") || head.includes(">porsche<")) return false;
  if (type.includes("svg") || head.includes("<svg")) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  return buf.length > 800;
}

function extFrom(url, type, buf) {
  const head = buf.slice(0, 64).toString("utf8").toLowerCase();
  if (head.includes("<svg") || type.includes("svg") || url.includes(".svg")) return ".svg";
  if (type.includes("jpeg") || type.includes("jpg") || url.includes(".jpg")) return ".jpg";
  if (type.includes("webp") || url.includes(".webp")) return ".webp";
  return ".png";
}

function wipe(id) {
  for (const ext of [".svg", ".png", ".jpg", ".jpeg", ".webp"]) {
    const p = path.join(outDir, id + ext);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  if (id === "mercedes") {
    const star = path.join(outDir, "mercedes-star.svg");
    if (fs.existsSync(star)) fs.unlinkSync(star);
  }
}

(async () => {
  let ok = 0;
  let fail = 0;
  for (const [id, urls] of Object.entries(LOGOS)) {
    let done = false;
    for (const url of urls) {
      try {
        const { buf, type } = await get(url);
        if (!looksValid(buf, type)) throw new Error("invalid");
        const ext = extFrom(url, type, buf);
        wipe(id);
        fs.writeFileSync(path.join(outDir, `${id}${ext}`), buf);
        console.log(`OK  ${id}${ext} (${buf.length}b) ← ${url.slice(0, 80)}`);
        ok++;
        done = true;
        break;
      } catch {
        // next
      }
    }
    if (!done) {
      console.log(`FAIL ${id}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`\nDone ok=${ok} fail=${fail}`);
})();
