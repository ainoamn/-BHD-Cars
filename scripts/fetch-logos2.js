const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const outDir = path.join(process.cwd(), "public", "makes");

const brands = [
  ["toyota","toyota","toyota.com"],["nissan","nissan","nissanusa.com"],["lexus","lexus","lexus.com"],["mercedes","mercedes","mercedes-benz.com"],
  ["honda","honda","honda.com"],["hyundai","hyundai","hyundai.com"],["jeep","jeep","jeep.com"],["chevrolet","chevrolet","chevrolet.com"],
  ["ford","ford","ford.com"],["dodge","dodge","dodge.com"],["gmc","gmc","gmc.com"],["bmw","bmw","bmw.com"],
  ["mitsubishi","mitsubishi","mitsubishicars.com"],["kia","kia","kia.com"],["mazda","mazda","mazda.com"],["land-rover","landrover","landrover.com"],
  ["infiniti","infiniti","infiniti.com"],["suzuki","suzuki","suzukimotorusa.com"],["volkswagen","volkswagen","vw.com"],["byd","byd","byd.com"],
  ["mg","mg","mg.co.uk"],["tesla","tesla","tesla.com"],["mini","mini","mini.com"],["subaru","subaru","subaru.com"],
  ["ram","ram","ramtrucks.com"],["porsche","porsche","porsche.com"],["renault","renault","renault.com"],["audi","audi","audi.com"],
  ["chrysler","chrysler","chrysler.com"],["isuzu","isuzu","isuzu.com"],["changan","changan","globalchangan.com"],["cadillac","cadillac","cadillac.com"],
  ["genesis","genesis","genesis.com"],["lincoln","lincoln","lincoln.com"],["daihatsu","daihatsu","daihatsu.com"],["geely","geely","geely.com"],
  ["jetour","jetour","jetourglobal.com"],["yamaha","yamaha","yamaha-motor.com"],["peugeot","peugeot","peugeot.com"],["volvo","volvo","volvo.com"],
  ["harley-davidson","harley-davidson","harley-davidson.com"],["tata","tata","tata.com"],["jaguar","jaguar","jaguar.com"],["maserati","maserati","maserati.com"],
  ["man","man","man.eu"],["kawasaki","kawasaki","kawasaki.com"],["gac","gac","gacmotor.com"],["foton","foton","foton-global.com"],
  ["fiat","fiat","fiat.com"],["chery","chery","cheryinternational.com"],["great-wall","greatwall","gwm-global.com"],["jac","jac","jacmotors.com"],
  ["mercury","mercury","ford.com"],["hino","hino","hino.com"],["ashok-leyland","ashokleyland","ashokleyland.com"],["rox","rox","roxmotor.com"],
  ["polaris","polaris","polaris.com"],["alfa-romeo","alfaromeo","alfaromeo.com"],["hongqi","hongqi","hongqi-auto.com"],["golden-dragon","goldendragon","goldendragonbus.com"],
  ["baic","baic","baicgroup.com"],["bajaj","bajaj","bajajauto.com"],["hummer","hummer","gmc.com"],["haval","haval","haval-global.com"],
  ["bestune","bestune","bestune.com"],["tvs","tvs","tvsmotor.com"],["scion","scion","toyota.com"],["jcb","jcb","jcb.com"],
  ["king-long","kinglong","king-long.com"],["bentley","bentley","bentleymotors.com"],["rolls-royce","rollsroyce","rolls-roycemotorcars.com"],["jmc","jmc","jmc.com.cn"],
  ["ssangyong","ssangyong","kg-mobility.com"],["lynk-co","lynkco","lynkco.com"],["komatsu","komatsu","komatsu.com"],["ktm","ktm","ktm.com"],
  ["ferrari","ferrari","ferrari.com"],["lamborghini","lamborghini","lamborghini.com"],["slingshot","slingshot","polaris.com"],["can-am","canam","can-am.brp.com"],
  ["citroen","citroen","citroen.com"],["skoda","skoda","skoda-auto.com"],["cmc","cmc","china-motor.com.tw"],["maxus","maxus","saicmaxus.com"],
  ["indian","indianmotorcycle","indianmotorcycle.com"],["zeekr","zeekr","zeekr.com"],["deepal","deepal","deepal.com"],["dongfeng","dongfeng","dfmc.com.cn"],
  ["pontiac","pontiac","gm.com"],["forthing","forthing","forthing-auto.com"],["iveco","iveco","iveco.com"],["avatr","avatr","avatr.com"],
  ["benelli","benelli","benelli.com"],["royal-enfield","royalenfield","royalenfield.com"],["sym","sym","sym-global.com"],["victory","victory","polaris.com"],
  ["scania","scania","scania.com"],["shacman","shacman","shacman.com"],["xcmg","xcmg","xcmg.com"],["sdlg","sdlg","sdlg.com"],
  ["buick","buick","buick.com"],["proton","proton","proton.com"],["triumph","triumph","triumphmotorcycles.com"],["xiaomi","xiaomi","mi.com"],
  ["exeed","exeed","exeed.com"],["soueast","soueast","soueast-motor.com"],["motors-212","212","212motors.com"],["caterpillar","caterpillar","caterpillar.com"],
  ["bomag","bomag","bomag.com"],["hamm","hamm","wirtgen-group.com"],["bobcat","bobcat","bobcat.com"],["brilliance","brilliance","brilliance-auto.com"],
  ["opel","opel","opel.com"],["daewoo","daewoo","gm.com"],["cfmoto","cfmoto","cfmoto.com"],["jianshe","jianshe","jianshe.com"],
  ["kymco","kymco","kymco.com"],["moto-guzzi","motoguzzi","motoguzzi.com"],["higer","higer","higer.com"],["ineos","ineos","ineosgrenadier.com"],
  ["voyah","voyah","voyah.com"],["denza","denza","denza.com"],["seres","seres","seres.com"],["tank","tank","gwm-global.com"],
  ["hyster","hyster","hyster.com"],["massey-ferguson","masseyferguson","masseyferguson.com"],["new-holland","newholland","newholland.com"],["grove","grove","manitowoc.com"],
  ["sany","sany","sanyglobal.com"],["hangcha","hangcha","hcforklift.com"],["zoomlion","zoomlion","zoomlion.com"],["sharmax","sharmax","sharmax.ru"],
  ["gorica","gorica","gorica.si"],["mays","mays","example.com"],["other","other","example.com"]
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*,*/*" }, timeout: 25000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchBuffer(new URL(res.headers.location, url).toString()).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) return reject(new Error("status " + res.statusCode));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function hasLogo(id) {
  return [".svg", ".png", ".webp", ".jpg"].some((ext) => fs.existsSync(path.join(outDir, id + ext)));
}

(async () => {
  let ok = 0, fail = 0;
  for (const [id, simple, domain] of brands) {
    if (hasLogo(id)) { ok++; continue; }
    const tries = [
      `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${simple}.svg`,
      `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ];
    let saved = false;
    for (const url of tries) {
      try {
        const buf = await fetchBuffer(url);
        if (!buf || buf.length < 200) continue;
        const isSvg = buf.slice(0, 200).toString("utf8").includes("<svg");
        const ext = isSvg ? ".svg" : (url.includes(".ico") ? ".png" : ".png");
        fs.writeFileSync(path.join(outDir, id + ext), buf);
        console.log("ok", id, ext, buf.length, url.includes("simple-icons") ? "simple" : url.includes("gstatic") ? "gstatic" : "ddg");
        saved = true;
        ok++;
        break;
      } catch (e) {}
    }
    if (!saved) { console.log("fail", id); fail++; }
  }
  console.log("DONE ok=" + ok + " fail=" + fail);
})();
