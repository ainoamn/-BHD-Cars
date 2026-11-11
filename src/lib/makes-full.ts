import generatedModels from "./generated-models.json";

export type Copy = { ar: string; en: string };
export const L = (ar: string, en: string): Copy => ({ ar, en });

export type SellModel = {
  id: string;
  name: Copy;
  body: string;
  image: string;
  trims: string[];
};

export type SellMake = {
  id: string;
  name: Copy;
  mark: string;
  logo: string;
  models: SellModel[];
  category?: "cars" | "luxury" | "china" | "moto" | "truck" | "other";
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const generic = u("photo-1494976388531-d1058494cdd8");
const suv = u("photo-1519641471654-76ce0107ad1b");
const sedan = u("photo-1549317661-bd32c8ce0db2");
const coupe = u("photo-1503376780353-7e6692767b70");
const pickup = u("photo-1559416523-140ddc3d238c");
const bike = u("photo-1558981403-c5f9899a28bc");
const truck = u("photo-1601584115197-04ecc1da58d4");
const ev = u("photo-1593941707882-a5bba14938c7");

function m(id: string, ar: string, en: string, body = "sedan", image = sedan, trims: string[] = ["Base"]): SellModel {
  return { id, name: L(ar, en), body, image, trims };
}

function make(
  id: string,
  ar: string,
  en: string,
  mark: string,
  models: SellModel[],
  category: "cars" | "luxury" | "china" | "moto" | "truck" | "other" = "cars",
): SellMake {
  return {
    id,
    name: L(ar, en),
    mark,
    logo: `/makes/${id}`,
    models,
    category,
  };
}

/** Full Oman-marketplace make catalog with bilingual names and sub-models. */
export const allMakes: SellMake[] = [
  make("toyota", "تويوتا", "Toyota", "T", [
    m("camry", "كامري", "Camry", "sedan", sedan, ["LE", "SE", "XLE", "Grande"]),
    m("corolla", "كورولا", "Corolla", "sedan", sedan, ["XLI", "GLI", "SE"]),
    m("land-cruiser", "لاند كروزر", "Land Cruiser", "suv", suv, ["GXR", "VX", "VXR"]),
    m("prado", "برادو", "Prado", "suv", suv, ["TXL", "VX"]),
    m("hilux", "هايلكس", "Hilux", "pickup", pickup, ["GL", "GLX", "Adventure"]),
    m("rav4", "راف فور", "RAV4", "suv", suv, ["LE", "XLE", "Limited"]),
    m("fortuner", "فورتشنر", "Fortuner", "suv", suv, ["GXR", "VRZ"]),
    m("yaris", "ياريس", "Yaris", "hatch", sedan, ["SE", "Y"]),
  ]),
  make("nissan", "نيسان", "Nissan", "N", [
    m("patrol", "باترول", "Patrol", "suv", suv, ["SE", "LE", "Platinum", "NISMO"]),
    m("altima", "التيما", "Altima", "sedan", sedan, ["S", "SV", "SL"]),
    m("xterra", "إكستيرا", "X-Terra", "suv", suv, ["S", "SE", "Titanium"]),
    m("sunny", "صني", "Sunny", "sedan", sedan, ["S", "SV"]),
    m("kicks", "كيكس", "Kicks", "suv", suv, ["S", "SV", "SR"]),
    m("navara", "نافارا", "Navara", "pickup", pickup, ["SE", "LE"]),
  ]),
  make("lexus", "لكزس", "Lexus", "L", [
    m("es", "إي إس", "ES", "sedan", sedan, ["250", "300h", "350"]),
    m("ls", "إل إس", "LS", "sedan", sedan, ["500", "500h"]),
    m("lx", "إل إكس", "LX", "suv", suv, ["570", "600"]),
    m("rx", "آر إكس", "RX", "suv", suv, ["350", "450h"]),
    m("nx", "إن إكس", "NX", "suv", suv, ["250", "350h"]),
    m("gx", "جي إكس", "GX", "suv", suv, ["460", "550"]),
  ]),
  make("mercedes", "مرسيدس", "Mercedes-Benz", "★", [
    m("a-class", "الفئة A", "A-Class", "hatch", sedan, ["A200", "A250"]),
    m("c-class", "الفئة C", "C-Class", "sedan", sedan, ["C200", "C300", "AMG"]),
    m("e-class", "الفئة E", "E-Class", "sedan", sedan, ["E200", "E300", "AMG"]),
    m("s-class", "الفئة S", "S-Class", "sedan", sedan, ["S450", "S580"]),
    m("g-class", "الفئة G", "G-Class", "suv", suv, ["G500", "G63"]),
    m("gle", "جي إل إي", "GLE", "suv", suv, ["GLE350", "GLE450"]),
    m("glc", "جي إل سي", "GLC", "suv", suv, ["GLC300", "AMG"]),
  ], "luxury"),
  make("honda", "هوندا", "Honda", "H", [
    m("accord", "أكورد", "Accord", "sedan", sedan, ["EX", "EX-L", "Touring"]),
    m("civic", "سيفيك", "Civic", "sedan", sedan, ["LX", "EX", "Sport"]),
    m("crv", "سي آر في", "CR-V", "suv", suv, ["EX", "EX-L", "Touring"]),
    m("hrv", "اتش آر في", "HR-V", "suv", suv, ["LX", "EX"]),
    m("pilot", "بايلوت", "Pilot", "suv", suv, ["EX", "Touring"]),
    m("city", "سيتي", "City", "sedan", sedan, ["DX", "LX"]),
  ]),
  make("hyundai", "هيونداي", "Hyundai", "H", [
    m("tucson", "توسان", "Tucson", "suv", suv, ["Smart", "Comfort", "Premium"]),
    m("sonata", "سوناتا", "Sonata", "sedan", sedan, ["GL", "GLS", "N Line"]),
    m("elantra", "إلنترا", "Elantra", "sedan", sedan, ["Smart", "Comfort"]),
    m("santa-fe", "سانتافي", "Santa Fe", "suv", suv, ["Comfort", "Calligraphy"]),
    m("palisade", "باليسيد", "Palisade", "suv", suv, ["SEL", "Limited"]),
    m("creta", "كريتا", "Creta", "suv", suv, ["Smart", "Premium"]),
  ]),
  make("jeep", "جيب", "Jeep", "J", [
    m("wrangler", "رانجلر", "Wrangler", "suv", suv, ["Sport", "Sahara", "Rubicon"]),
    m("grand-cherokee", "جراند شيروكي", "Grand Cherokee", "suv", suv, ["Laredo", "Limited", "Overland"]),
    m("cherokee", "شيروكي", "Cherokee", "suv", suv, ["Latitude", "Limited"]),
    m("compass", "كومباس", "Compass", "suv", suv, ["Sport", "Limited"]),
    m("gladiator", "جلادياتور", "Gladiator", "pickup", pickup, ["Sport", "Rubicon"]),
  ]),
  make("chevrolet", "شيفروليه", "Chevrolet", "C", [
    m("tahoe", "تاهو", "Tahoe", "suv", suv, ["LS", "LT", "Premier"]),
    m("suburban", "سوبربان", "Suburban", "suv", suv, ["LT", "Premier"]),
    m("malibu", "ماليبو", "Malibu", "sedan", sedan, ["LS", "LT"]),
    m("captiva", "كابتيفا", "Captiva", "suv", suv, ["LS", "Premier"]),
    m("silverado", "سيلفرادو", "Silverado", "pickup", pickup, ["LT", "High Country"]),
    m("traverse", "ترافيرس", "Traverse", "suv", suv, ["LT", "Premier"]),
  ]),
  make("ford", "فورد", "Ford", "F", [
    m("mustang", "موستانج", "Mustang", "coupe", coupe, ["EcoBoost", "GT", "GT Premium"]),
    m("explorer", "إكسبلورر", "Explorer", "suv", suv, ["XLT", "Limited", "ST"]),
    m("expedition", "إكسبيديشن", "Expedition", "suv", suv, ["XLT", "Limited", "Platinum"]),
    m("f150", "إف-150", "F-150", "pickup", pickup, ["XLT", "Lariat", "Raptor"]),
    m("taurus", "تورس", "Taurus", "sedan", sedan, ["SE", "SEL", "Limited"]),
    m("edge", "إيدج", "Edge", "suv", suv, ["SEL", "Titanium"]),
    m("bronco", "برونكو", "Bronco", "suv", suv, ["Big Bend", "Badlands"]),
  ]),
  make("dodge", "دودج", "Dodge", "D", [
    m("charger", "شارجر", "Charger", "sedan", sedan, ["SXT", "RT", "Hellcat"]),
    m("challenger", "تشالنجر", "Challenger", "coupe", coupe, ["SXT", "RT", "Hellcat"]),
    m("durango", " دورانجو", "Durango", "suv", suv, ["SXT", "GT", "RT"]),
  ]),
  make("gmc", "جي أم سي", "GMC", "G", [
    m("yukon", "يوكن", "Yukon", "suv", suv, ["SLE", "SLT", "Denali"]),
    m("terrain", "تيرين", "Terrain", "suv", suv, ["SLE", "SLT"]),
    m("acadia", "أكاديا", "Acadia", "suv", suv, ["SLE", "SLT"]),
    m("sierra", "سييرا", "Sierra", "pickup", pickup, ["SLE", "AT4", "Denali"]),
  ]),
  make("bmw", "بي أم دبليو", "BMW", "B", [
    m("3-series", "الفئة الثالثة", "3 Series", "sedan", sedan, ["320i", "330i", "M340i"]),
    m("5-series", "الفئة الخامسة", "5 Series", "sedan", sedan, ["520i", "530i", "M5"]),
    m("7-series", "الفئة السابعة", "7 Series", "sedan", sedan, ["740i", "750i"]),
    m("x3", "إكس 3", "X3", "suv", suv, ["xDrive30i", "M40i"]),
    m("x5", "إكس 5", "X5", "suv", suv, ["xDrive40i", "M50i"]),
    m("x6", "إكس 6", "X6", "suv", suv, ["xDrive40i", "M"]),
  ], "luxury"),
  make("mitsubishi", "ميتسوبيشي", "Mitsubishi", "M", [
    m("pajero", "باجيرو", "Pajero", "suv", suv, ["GLS", "Signature"]),
    m("outlander", "أوتلاندر", "Outlander", "suv", suv, ["ES", "SEL"]),
    m("l200", "إل 200", "L200", "pickup", pickup, ["GL", "GLS"]),
    m("asx", "إيه إس إكس", "ASX", "suv", suv, ["GL", "GLS"]),
    m("attrage", "أتراج", "Attrage", "sedan", sedan, ["GLX", "GSS"]),
  ]),
  make("kia", "كيا", "Kia", "K", [
    m("sportage", "سبورتاج", "Sportage", "suv", suv, ["LX", "EX", "SX"]),
    m("sorento", "سورينتو", "Sorento", "suv", suv, ["LX", "EX"]),
    m("k5", "كي 5", "K5", "sedan", sedan, ["LXS", "GT-Line"]),
    m("cerato", "سيراتو", "Cerato", "sedan", sedan, ["LX", "EX"]),
    m("telluride", "تيلورايد", "Telluride", "suv", suv, ["EX", "SX"]),
    m("carnival", "كرنفال", "Carnival", "suv", suv, ["LX", "EX"]),
  ]),
  make("mazda", "مازدا", "Mazda", "Mz", [
    m("mazda3", "مازدا 3", "Mazda3", "sedan", sedan, ["Sport", "Touring"]),
    m("mazda6", "مازدا 6", "Mazda6", "sedan", sedan, ["Sport", "Grand Touring"]),
    m("cx5", "سي إكس 5", "CX-5", "suv", suv, ["Touring", "Grand Touring"]),
    m("cx9", "سي إكس 9", "CX-9", "suv", suv, ["Touring", "Signature"]),
    m("cx30", "سي إكس 30", "CX-30", "suv", suv, ["Select", "Premium"]),
  ]),
  make("land-rover", "لاند روفر", "Land Rover", "LR", [
    m("defender", "ديفندر", "Defender", "suv", suv, ["90", "110", "X"]),
    m("discovery", "ديسكفري", "Discovery", "suv", suv, ["S", "SE", "HSE"]),
    m("range-rover", "رينج روفر", "Range Rover", "suv", suv, ["HSE", "Autobiography", "SV"]),
    m("range-rover-sport", "رينج روفر سبورت", "Range Rover Sport", "suv", suv, ["SE", "HSE", "SVR"]),
    m("evoque", "إيفوك", "Evoque", "suv", suv, ["S", "SE", "HSE"]),
  ], "luxury"),
  make("infiniti", "انفينيتي", "Infiniti", "I", [
    m("qx80", "كيو إكس 80", "QX80", "suv", suv, ["Luxe", "Sensory"]),
    m("qx60", "كيو إكس 60", "QX60", "suv", suv, ["Pure", "Luxe"]),
    m("q50", "كيو 50", "Q50", "sedan", sedan, ["Pure", "Luxe", "Red Sport"]),
    m("qx55", "كيو إكس 55", "QX55", "suv", suv, ["Essential", "Sensory"]),
  ], "luxury"),
  make("suzuki", "سوزوكي", "Suzuki", "S", [
    m("jimny", "جمني", "Jimny", "suv", suv, ["GL", "GLX"]),
    m("vitara", "فيتارا", "Vitara", "suv", suv, ["GL", "GLX"]),
    m("ciaz", "سياز", "Ciaz", "sedan", sedan, ["GL", "GLX"]),
    m("swift", "سويفت", "Swift", "hatch", sedan, ["GL", "GLX"]),
    m("ertiga", "إرتيجا", "Ertiga", "suv", suv, ["GL", "GLX"]),
  ]),
  make("volkswagen", "فولكس فاجن", "Volkswagen", "VW", [
    m("tiguan", "تيجوان", "Tiguan", "suv", suv, ["S", "SE", "SEL"]),
    m("jetta", "جيتا", "Jetta", "sedan", sedan, ["S", "SE", "SEL"]),
    m("passat", "باسات", "Passat", "sedan", sedan, ["SE", "SEL"]),
    m("touareg", "طوارق", "Touareg", "suv", suv, ["SE", "SEL"]),
    m("teramont", "تيرامونت", "Teramont", "suv", suv, ["SE", "SEL"]),
  ]),
  make("byd", "بي واي دي", "BYD", "BYD", [
    m("seal", "سيل", "Seal", "sedan", ev, ["Dynamic", "Premium", "Performance"]),
    m("han", "هان", "Han", "sedan", ev, ["EV", "DM-i"]),
    m("song-plus", "سونج بلس", "Song Plus", "suv", ev, ["Champion", "Flagship"]),
    m("atto3", "أتو 3", "Atto 3", "suv", ev, ["Dynamic", "Extended"]),
    m("shark", "شارك", "Shark", "pickup", pickup, ["Premium"]),
  ], "china"),
  make("mg", "إم جي", "MG", "MG", [
    m("mg5", "إم جي 5", "MG5", "sedan", sedan, ["Comfort", "Luxury"]),
    m("mg6", "إم جي 6", "MG6", "sedan", sedan, ["Comfort", "Trophy"]),
    m("zs", "زد إس", "ZS", "suv", suv, ["Comfort", "Luxury"]),
    m("hs", "اتش إس", "HS", "suv", suv, ["Comfort", "Trophy"]),
    m("rx8", "آر إكس 8", "RX8", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("tesla", "تسلا", "Tesla", "TS", [
    m("model-3", "موديل 3", "Model 3", "sedan", ev, ["RWD", "Long Range", "Performance"]),
    m("model-y", "موديل واي", "Model Y", "suv", ev, ["RWD", "Long Range", "Performance"]),
    m("model-s", "موديل إس", "Model S", "sedan", ev, ["Long Range", "Plaid"]),
    m("model-x", "موديل إكس", "Model X", "suv", ev, ["Long Range", "Plaid"]),
  ], "luxury"),
  make("mini", "ميني", "Mini", "MN", [
    m("cooper", "كوبر", "Cooper", "hatch", sedan, ["Classic", "S", "JCW"]),
    m("countryman", "كانتري مان", "Countryman", "suv", suv, ["Classic", "S"]),
    m("clubman", "كلب مان", "Clubman", "hatch", sedan, ["Classic", "S"]),
  ], "luxury"),
  make("subaru", "سوبارو", "Subaru", "SB", [
    m("forester", "فورستر", "Forester", "suv", suv, ["Premium", "Touring"]),
    m("outback", "أوت باك", "Outback", "suv", suv, ["Premium", "Touring"]),
    m("xv", "إكس في", "XV / Crosstrek", "suv", suv, ["Premium", "Limited"]),
    m("wrx", "دبليو آر إكس", "WRX", "sedan", sedan, ["Premium", "STI"]),
  ]),
  make("ram", "رام", "RAM", "R", [
    m("1500", "1500", "1500", "pickup", pickup, ["Big Horn", "Laramie", "TRX"]),
    m("2500", "2500", "2500", "pickup", pickup, ["Tradesman", "Laramie"]),
    m("3500", "3500", "3500", "pickup", pickup, ["Tradesman", "Limited"]),
  ]),
  make("porsche", "بورشه", "Porsche", "P", [
    m("911", "911", "911", "coupe", coupe, ["Carrera", "Carrera S", "Turbo"]),
    m("cayenne", "كايين", "Cayenne", "suv", suv, ["Base", "S", "Turbo"]),
    m("macan", "ماكان", "Macan", "suv", suv, ["Base", "S", "GTS"]),
    m("panamera", "باناميرا", "Panamera", "sedan", sedan, ["Base", "4S", "Turbo"]),
    m("taycan", "تايكان", "Taycan", "sedan", ev, ["4S", "Turbo"]),
  ], "luxury"),
  make("renault", "رينو", "Renault", "RN", [
    m("duster", "داستر", "Duster", "suv", suv, ["PE", "SE", "LE"]),
    m("koleos", "كوليوس", "Koleos", "suv", suv, ["PE", "LE"]),
    m("megane", "ميجان", "Megane", "sedan", sedan, ["PE", "SE"]),
    m("symbol", "سيمبول", "Symbol", "sedan", sedan, ["PE", "SE"]),
  ]),
  make("audi", "أودي", "Audi", "A", [
    m("a4", "إيه 4", "A4", "sedan", sedan, ["Premium", "Prestige"]),
    m("a6", "إيه 6", "A6", "sedan", sedan, ["Premium", "Prestige"]),
    m("q5", "كيو 5", "Q5", "suv", suv, ["Premium", "Prestige"]),
    m("q7", "كيو 7", "Q7", "suv", suv, ["Premium", "Prestige"]),
    m("q8", "كيو 8", "Q8", "suv", suv, ["Premium", "Prestige"]),
  ], "luxury"),
  make("chrysler", "كرايسلر", "Chrysler", "CR", [
    m("300", "300", "300", "sedan", sedan, ["Touring", "S", "C"]),
    m("pacifica", "باسيفيكا", "Pacifica", "suv", suv, ["Touring", "Limited"]),
  ]),
  make("isuzu", "إيسوزو", "Isuzu", "IZ", [
    m("dmax", "دي ماكس", "D-Max", "pickup", pickup, ["LS", "LS-M", "V-Cross"]),
    m("mu-x", "إم يو إكس", "MU-X", "suv", suv, ["LS", "LS-T"]),
  ], "truck"),
  make("changan", "تشانجان", "Changan", "CA", [
    m("cs75", "سي إس 75", "CS75 Plus", "suv", suv, ["Comfort", "Luxury"]),
    m("uni-v", "يوني في", "UNI-V", "sedan", sedan, ["Comfort", "Luxury"]),
    m("alsvin", "ألسفين", "Alsvin", "sedan", sedan, ["Comfort", "Luxury"]),
    m("hunter", "هنتر", "Hunter", "pickup", pickup, ["Comfort", "Luxury"]),
  ], "china"),
  make("cadillac", "كاديلاك", "Cadillac", "CD", [
    m("escalade", "إسكاليد", "Escalade", "suv", suv, ["Luxury", "Premium", "Sport"]),
    m("xt5", "إكس تي 5", "XT5", "suv", suv, ["Luxury", "Premium"]),
    m("ct5", "سي تي 5", "CT5", "sedan", sedan, ["Luxury", "Sport"]),
  ], "luxury"),
  make("genesis", "جينيسيس", "Genesis", "GN", [
    m("g70", "جي 70", "G70", "sedan", sedan, ["2.0T", "3.3T"]),
    m("g80", "جي 80", "G80", "sedan", sedan, ["2.5T", "3.5T"]),
    m("gv70", "جي في 70", "GV70", "suv", suv, ["2.5T", "3.5T"]),
    m("gv80", "جي في 80", "GV80", "suv", suv, ["2.5T", "3.5T"]),
  ], "luxury"),
  make("lincoln", "لينكولن", "Lincoln", "LN", [
    m("navigator", "نافيجيتور", "Navigator", "suv", suv, ["Standard", "Reserve", "Black Label"]),
    m("aviator", "أفييتور", "Aviator", "suv", suv, ["Standard", "Reserve"]),
    m("nautilus", "نوتيلس", "Nautilus", "suv", suv, ["Standard", "Reserve"]),
  ], "luxury"),
  make("daihatsu", "دايهاتسو", "Daihatsu", "DH", [
    m("terios", "تيريوس", "Terios", "suv", suv, ["X", "R"]),
    m("gran-max", "جران ماكس", "Gran Max", "pickup", pickup, ["PU", "MB"]),
  ]),
  make("geely", "جيلي", "Geely", "GL", [
    m("coolray", "كول راي", "Coolray", "suv", suv, ["Basic", "Sport"]),
    m("okavango", "أوكافانجو", "Okavango", "suv", suv, ["Comfort", "Luxury"]),
    m("emgrand", "إمجراند", "Emgrand", "sedan", sedan, ["Comfort", "Luxury"]),
    m("tugella", "توجيلا", "Tugella", "suv", suv, ["GF", "GF+"]),
  ], "china"),
  make("jetour", "جيتور", "Jetour", "JT", [
    m("x70", "إكس 70", "X70", "suv", suv, ["Comfort", "Luxury"]),
    m("x90", "إكس 90", "X90", "suv", suv, ["Comfort", "Luxury"]),
    m("dashing", "داشينج", "Dashing", "suv", suv, ["Comfort", "Luxury"]),
    m("t2", "تي 2", "T2", "suv", suv, ["Adventure"]),
  ], "china"),
  make("yamaha", "ياماها", "Yamaha", "YM", [
    m("r1", "آر 1", "YZF-R1", "moto", bike, ["Standard"]),
    m("mt07", "إم تي 07", "MT-07", "moto", bike, ["Standard"]),
    m("nmax", "إن ماكس", "NMAX", "moto", bike, ["Standard"]),
  ], "moto"),
  make("peugeot", "بيجو", "Peugeot", "PG", [
    m("3008", "3008", "3008", "suv", suv, ["Active", "Allure", "GT"]),
    m("5008", "5008", "5008", "suv", suv, ["Active", "Allure"]),
    m("208", "208", "208", "hatch", sedan, ["Active", "Allure"]),
    m("partner", "بارتنر", "Partner", "van", truck, ["Standard"]),
  ]),
  make("volvo", "فولفو", "Volvo", "VO", [
    m("xc60", "إكس سي 60", "XC60", "suv", suv, ["Momentum", "Inscription"]),
    m("xc90", "إكس سي 90", "XC90", "suv", suv, ["Momentum", "Inscription"]),
    m("s60", "إس 60", "S60", "sedan", sedan, ["Momentum", "Inscription"]),
    m("s90", "إس 90", "S90", "sedan", sedan, ["Momentum", "Inscription"]),
  ], "luxury"),
  make("harley-davidson", "هارلي ديفيدسون", "Harley-Davidson", "HD", [
    m("sportster", "سبورتستر", "Sportster", "moto", bike, ["S", "Iron"]),
    m("street-glide", "ستريت جلايد", "Street Glide", "moto", bike, ["Standard", "Special"]),
    m("fat-boy", "فات بوي", "Fat Boy", "moto", bike, ["Standard"]),
  ], "moto"),
  make("tata", "تاتا", "Tata", "TT", [
    m("nexon", "نيكسون", "Nexon", "suv", suv, ["XM", "XZ+"]),
    m("harrier", "هارير", "Harrier", "suv", suv, ["XZ", "XZ+"]),
    m("punch", "بانش", "Punch", "suv", suv, ["Pure", "Adventure"]),
  ], "other"),
  make("jaguar", "جاكوار", "Jaguar", "JG", [
    m("f-pace", "إف بيس", "F-Pace", "suv", suv, ["S", "SE", "SVR"]),
    m("e-pace", "إي بيس", "E-Pace", "suv", suv, ["S", "SE"]),
    m("xf", "إكس إف", "XF", "sedan", sedan, ["S", "SE"]),
    m("f-type", "إف تايب", "F-Type", "coupe", coupe, ["P300", "R"]),
  ], "luxury"),
  make("maserati", "مازيراتي", "Maserati", "MS", [
    m("ghibli", "غيبلي", "Ghibli", "sedan", sedan, ["GT", "Modena", "Trofeo"]),
    m("levante", "ليفانتي", "Levante", "suv", suv, ["GT", "Modena", "Trofeo"]),
    m("grecale", "غريكالي", "Grecale", "suv", suv, ["GT", "Modena"]),
  ], "luxury"),
  make("man", "مان", "MAN", "MAN", [
    m("tgx", "تي جي إكس", "TGX", "truck", truck, ["Standard"]),
    m("tgs", "تي جي إس", "TGS", "truck", truck, ["Standard"]),
  ], "truck"),
  make("kawasaki", "كاواساكي", "Kawasaki", "KW", [
    m("ninja", "نينجا", "Ninja", "moto", bike, ["ZX-6R", "ZX-10R"]),
    m("z900", "زد 900", "Z900", "moto", bike, ["Standard", "SE"]),
    m("versys", "فيرسيس", "Versys", "moto", bike, ["650", "1000"]),
  ], "moto"),
  make("gac", "جي إيه سي", "GAC", "GAC", [
    m("emzoom", "إم زوم", "Emzoom", "suv", suv, ["Comfort", "Luxury"]),
    m("empow", "إم باو", "Empow", "sedan", sedan, ["Comfort", "Luxury"]),
    m("gs8", "جي إس 8", "GS8", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("foton", "فوتون", "Foton", "FT", [
    m("tunland", "تونلاند", "Tunland", "pickup", pickup, ["G7", "V9"]),
    m("view", "فيو", "View", "van", truck, ["C2", "CS2"]),
  ], "truck"),
  make("fiat", "فيات", "Fiat", "FI", [
    m("500", "500", "500", "hatch", sedan, ["Pop", "Lounge"]),
    m("tipo", "تيبو", "Tipo", "sedan", sedan, ["Easy", "Lounge"]),
    m("doblo", "دوبلو", "Doblo", "van", truck, ["Cargo", "Panorama"]),
  ]),
  make("chery", "شيري", "Chery", "CH", [
    m("tiggo8", "تيجو 8", "Tiggo 8", "suv", suv, ["Comfort", "Luxury"]),
    m("tiggo7", "تيجو 7", "Tiggo 7 Pro", "suv", suv, ["Comfort", "Luxury"]),
    m("arrizo5", "أريزو 5", "Arrizo 5", "sedan", sedan, ["Comfort", "Luxury"]),
  ], "china"),
  make("great-wall", "جريت وول", "Great Wall", "GW", [
    m("poer", "باور", "Poer", "pickup", pickup, ["Comfort", "Luxury"]),
    m("wingle", "وينجل", "Wingle", "pickup", pickup, ["Standard"]),
  ], "china"),
  make("jac", "جاك", "JAC", "JAC", [
    m("js6", "جيه إس 6", "JS6", "suv", suv, ["Comfort", "Luxury"]),
    m("t8", "تي 8", "T8", "pickup", pickup, ["Comfort", "Luxury"]),
    m("j7", "جيه 7", "J7", "sedan", sedan, ["Comfort", "Luxury"]),
  ], "china"),
  make("mercury", "ميركري", "Mercury", "MY", [
    m("grand-marquis", "جراند ماركيز", "Grand Marquis", "sedan", sedan, ["GS", "LS"]),
    m("mountaineer", "ماونتينير", "Mountaineer", "suv", suv, ["Convenience", "Premier"]),
  ], "other"),
  make("hino", "هينو", "Hino", "HN", [
    m("300", "300", "300 Series", "truck", truck, ["Standard"]),
    m("500", "500", "500 Series", "truck", truck, ["Standard"]),
  ], "truck"),
  make("sharmax", "شارماكس", "Sharmax", "SX", [
    m("atv", "دفع رباعي", "ATV", "moto", bike, ["Standard"]),
    m("snow", "ثلج", "Snowmobile", "moto", bike, ["Standard"]),
  ], "moto"),
  make("ashok-leyland", "اشوك ليلاند", "Ashok Leyland", "AL", [
    m("partner", "بارتنر", "Partner", "truck", truck, ["Standard"]),
    m("boss", "بوس", "Boss", "truck", truck, ["Standard"]),
  ], "truck"),
  make("other", "أخرى", "Other", "OT", [
    m("custom", "مخصص", "Custom", "sedan", generic, ["Base"]),
    m("kit", "معدل / كيت", "Kit / Modified", "coupe", coupe, ["Custom"]),
  ], "other"),
  make("rox", "روكس", "ROX", "ROX", [
    m("01", "01", "01", "suv", suv, ["Standard", "Premium"]),
    m("other", "طراز آخر", "Other", "suv", suv, ["Base"]),
  ], "china"),
  make("polaris", "بولاريس", "Polaris", "PL", [
    m("rzr", "آر زد آر", "RZR", "moto", bike, ["Trail", "Pro"]),
    m("ranger", "رينجر", "Ranger", "moto", bike, ["XP", "Crew"]),
  ], "moto"),
  make("alfa-romeo", "الفا روميو", "Alfa Romeo", "AR", [
    m("giulia", "جوليا", "Giulia", "sedan", sedan, ["Sprint", "Veloce", "Quadrifoglio"]),
    m("stelvio", "ستيلفيو", "Stelvio", "suv", suv, ["Sprint", "Veloce", "Quadrifoglio"]),
    m("tonale", "تونالي", "Tonale", "suv", suv, ["Sprint", "Veloce"]),
  ], "luxury"),
  make("hongqi", "هونشي", "Hongqi", "HQ", [
    m("hs5", "اتش إس 5", "HS5", "suv", suv, ["Comfort", "Luxury"]),
    m("h5", "اتش 5", "H5", "sedan", sedan, ["Comfort", "Luxury"]),
    m("e-hs9", "إي اتش إس 9", "E-HS9", "suv", ev, ["Standard", "Flagship"]),
  ], "china"),
  make("golden-dragon", "جولدن دراجون", "Golden Dragon", "GD", [
    m("bus", "باص", "Bus", "truck", truck, ["Standard"]),
  ], "truck"),
  make("baic", "بايك", "BAIC", "BA", [
    m("x55", "إكس 55", "X55", "suv", suv, ["Comfort", "Luxury"]),
    m("u5", "يو 5", "U5", "sedan", sedan, ["Comfort", "Luxury"]),
    m("bj40", "بي جيه 40", "BJ40", "suv", suv, ["Plus", "Seeker"]),
  ], "china"),
  make("bajaj", "باجاج", "Bajaj", "BJ", [
    m("pulsar", "بولسار", "Pulsar", "moto", bike, ["NS200", "RS200"]),
    m("dominar", "دومينار", "Dominar", "moto", bike, ["250", "400"]),
  ], "moto"),
  make("hummer", "همر", "Hummer", "HM", [
    m("h2", "اتش 2", "H2", "suv", suv, ["Base", "Adventure"]),
    m("h3", "اتش 3", "H3", "suv", suv, ["Base", "Alpha"]),
    m("ev", "كهربائي", "Hummer EV", "pickup", pickup, ["Edition 1", "3X"]),
  ], "luxury"),
  make("haval", "هافال", "Haval", "HV", [
    m("jolion", "جوليون", "Jolion", "suv", suv, ["Comfort", "Luxury"]),
    m("h6", "اتش 6", "H6", "suv", suv, ["Comfort", "Luxury"]),
    m("dargo", "دارجو", "Dargo", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("bestune", "بيستون", "Bestune", "BT", [
    m("t77", "تي 77", "T77", "suv", suv, ["Comfort", "Luxury"]),
    m("b70", "بي 70", "B70", "sedan", sedan, ["Comfort", "Luxury"]),
  ], "china"),
  make("tvs", "تي في إس", "TVS", "TVS", [
    m("apache", "أباتشي", "Apache", "moto", bike, ["RTR 160", "RTR 200"]),
    m("ntorq", "إن تورك", "Ntorq", "moto", bike, ["125"]),
  ], "moto"),
  make("scion", "سيون", "Scion", "SC", [
    m("tc", "تي سي", "tC", "coupe", coupe, ["Base"]),
    m("xb", "إكس بي", "xB", "hatch", sedan, ["Base"]),
  ], "other"),
  make("jcb", "جي سي بي", "JCB", "JCB", [
    m("3cx", "3CX", "3CX", "truck", truck, ["Standard"]),
    m("forklift", "رافعة", "Forklift", "truck", truck, ["Standard"]),
  ], "truck"),
  make("king-long", "كنج لونج", "King Long", "KL", [
    m("bus", "باص", "Bus", "truck", truck, ["Standard"]),
  ], "truck"),
  make("bentley", "بنتلي", "Bentley", "BN", [
    m("continental", "كونتيننتال", "Continental GT", "coupe", coupe, ["V8", "W12"]),
    m("bentayga", "بنتايجا", "Bentayga", "suv", suv, ["V8", "Speed"]),
    m("flying-spur", "فلاينج سبير", "Flying Spur", "sedan", sedan, ["V8", "W12"]),
  ], "luxury"),
  make("rolls-royce", "رولز رويس", "Rolls-Royce", "RR", [
    m("ghost", "جوست", "Ghost", "sedan", sedan, ["Standard", "Extended"]),
    m("phantom", "فانتوم", "Phantom", "sedan", sedan, ["Standard", "Extended"]),
    m("cullinan", "كولينان", "Cullinan", "suv", suv, ["Standard", "Black Badge"]),
  ], "luxury"),
  make("jmc", "جي إم سي الصينية", "JMC", "JMC", [
    m("vigus", "فيجوس", "Vigus", "pickup", pickup, ["Comfort", "Luxury"]),
    m("yusheng", "يوشينغ", "Yusheng", "suv", suv, ["S350"]),
  ], "truck"),
  make("ssangyong", "سانج يونج", "SsangYong / KG Mobility", "SY", [
    m("rexton", "ريكستون", "Rexton", "suv", suv, ["Comfort", "Luxury"]),
    m("tivoli", "تيفولي", "Tivoli", "suv", suv, ["Comfort", "Luxury"]),
    m("musso", "موسو", "Musso", "pickup", pickup, ["Comfort", "Luxury"]),
  ]),
  make("lynk-co", "لينك آند كو", "Lynk & Co", "LC", [
    m("01", "01", "01", "suv", suv, ["Standard", "Pro"]),
    m("05", "05", "05", "suv", coupe, ["Standard", "Pro"]),
  ], "china"),
  make("komatsu", "كوماتسو", "Komatsu", "KM", [
    m("excavator", "حفار", "Excavator", "truck", truck, ["Standard"]),
    m("loader", "لودر", "Wheel Loader", "truck", truck, ["Standard"]),
  ], "truck"),
  make("ktm", "كي تي إم", "KTM", "KTM", [
    m("duke", "ديوك", "Duke", "moto", bike, ["390", "890"]),
    m("rc", "آر سي", "RC", "moto", bike, ["390"]),
  ], "moto"),
  make("ferrari", "فيراري", "Ferrari", "FE", [
    m("roma", "روما", "Roma", "coupe", coupe, ["Standard"]),
    m("sf90", "إس إف 90", "SF90", "coupe", coupe, ["Stradale"]),
    m("purosangue", "بوروسانجي", "Purosangue", "suv", suv, ["Standard"]),
  ], "luxury"),
  make("lamborghini", "لامبورغيني", "Lamborghini", "LB", [
    m("huracan", "هوراكان", "Huracán", "coupe", coupe, ["Evo", "Tecnica"]),
    m("urus", "أوروس", "Urus", "suv", suv, ["S", "Performante"]),
    m("revuelto", "ريفويلتو", "Revuelto", "coupe", coupe, ["Standard"]),
  ], "luxury"),
  make("slingshot", "سلنج شوت", "Slingshot", "SL", [
    m("r", "آر", "R", "moto", bike, ["Standard", "Limited"]),
    m("sl", "إس إل", "SL", "moto", bike, ["Standard"]),
  ], "moto"),
  make("can-am", "كان آم", "Can-Am", "CA", [
    m("maverick", "مافريك", "Maverick", "moto", bike, ["X3", "Sport"]),
    m("outlander", "أوتلاندر", "Outlander ATV", "moto", bike, ["XT", "MAX"]),
    m("ryker", "رايكر", "Ryker", "moto", bike, ["Sport", "Rally"]),
  ], "moto"),
  make("citroen", "سيتروين", "Citroën", "CT", [
    m("c5-aircross", "سي 5 إيركروس", "C5 Aircross", "suv", suv, ["Live", "Feel", "Shine"]),
    m("c3", "سي 3", "C3", "hatch", sedan, ["Live", "Feel"]),
    m("berlingo", "برلينجو", "Berlingo", "van", truck, ["Live", "Feel"]),
  ]),
  make("skoda", "سكودا", "Škoda", "SK", [
    m("octavia", "أوكتافيا", "Octavia", "sedan", sedan, ["Ambition", "Style"]),
    m("kodiaq", "كودياك", "Kodiaq", "suv", suv, ["Ambition", "Style"]),
    m("karoq", "كاروك", "Karoq", "suv", suv, ["Ambition", "Style"]),
  ]),
  make("cmc", "سي إم سي", "CMC", "CMC", [
    m("veryca", "فيريكا", "Veryca", "van", truck, ["Standard"]),
  ], "truck"),
  make("maxus", "ماكسيوس", "Maxus", "MX", [
    m("d90", "دي 90", "D90", "suv", suv, ["Comfort", "Luxury"]),
    m("t60", "تي 60", "T60", "pickup", pickup, ["Comfort", "Luxury"]),
    m("g10", "جي 10", "G10", "van", truck, ["Standard"]),
  ], "china"),
  make("indian", "إنديان", "Indian", "IN", [
    m("scout", "سكاوت", "Scout", "moto", bike, ["Standard", "Bobber"]),
    m("chief", "تشيف", "Chief", "moto", bike, ["Dark Horse", "Classic"]),
  ], "moto"),
  make("zeekr", "زيكر", "Zeekr", "ZK", [
    m("001", "001", "001", "sedan", ev, ["Standard", "Performance"]),
    m("x", "إكس", "X", "suv", ev, ["Standard"]),
    m("7x", "7 إكس", "7X", "suv", ev, ["Standard"]),
  ], "china"),
  make("deepal", "ديبال", "Deepal", "DP", [
    m("s07", "إس 07", "S07", "suv", ev, ["Standard", "Long Range"]),
    m("l07", "إل 07", "L07", "sedan", ev, ["Standard"]),
  ], "china"),
  make("dongfeng", "دونغفنغ", "Dongfeng", "DF", [
    m("ax7", "إيه إكس 7", "AX7", "suv", suv, ["Comfort", "Luxury"]),
    m("rich", "ريتش", "Rich", "pickup", pickup, ["Standard"]),
  ], "china"),
  make("pontiac", "بونتياك", "Pontiac", "PT", [
    m("g8", "جي 8", "G8", "sedan", sedan, ["Base", "GT"]),
    m("solstice", "سولستيس", "Solstice", "coupe", coupe, ["Base", "GXP"]),
  ], "other"),
  make("forthing", "فورثنج", "Forthing", "FR", [
    m("t5", "تي 5", "T5", "suv", suv, ["Comfort", "Luxury"]),
    m("yacht", "يخت", "Yacht", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("iveco", "إيفيكو", "Iveco", "IV", [
    m("daily", "ديلي", "Daily", "truck", truck, ["Standard"]),
    m("eurocargo", "يوركارجو", "Eurocargo", "truck", truck, ["Standard"]),
  ], "truck"),
  make("avatr", "أفاتار", "Avatr", "AV", [
    m("11", "11", "11", "suv", ev, ["Standard", "Long Range"]),
    m("12", "12", "12", "sedan", ev, ["Standard"]),
  ], "china"),
  make("benelli", "بينيلي", "Benelli", "BE", [
    m("trk", "تي آر كيه", "TRK", "moto", bike, ["502", "702"]),
    m("leoncino", "ليونسينو", "Leoncino", "moto", bike, ["500"]),
  ], "moto"),
  make("royal-enfield", "رويال انفيلد", "Royal Enfield", "RE", [
    m("classic", "كلاسيك", "Classic", "moto", bike, ["350", "500"]),
    m("himalayan", "هيمالايان", "Himalayan", "moto", bike, ["450"]),
    m("interceptor", "إنترسبتور", "Interceptor", "moto", bike, ["650"]),
  ], "moto"),
  make("sym", "إس واي إم", "SYM", "SYM", [
    m("jet", "جيت", "Jet", "moto", bike, ["14", "X"]),
    m("maxsym", "ماكس سيم", "Maxsym", "moto", bike, ["400", "TL"]),
  ], "moto"),
  make("victory", "فيكتوري", "Victory", "VC", [
    m("vegas", "فيجاس", "Vegas", "moto", bike, ["Standard"]),
    m("cross", "كروس", "Cross Roads", "moto", bike, ["Standard"]),
  ], "moto"),
  make("scania", "سكانيا", "Scania", "SN", [
    m("r-series", "آر", "R-series", "truck", truck, ["Standard"]),
    m("s-series", "إس", "S-series", "truck", truck, ["Standard"]),
  ], "truck"),
  make("shacman", "شاكمان", "SHACMAN", "SH", [
    m("x3000", "إكس 3000", "X3000", "truck", truck, ["Standard"]),
    m("f3000", "إف 3000", "F3000", "truck", truck, ["Standard"]),
  ], "truck"),
  make("xcmg", "إكس سي إم جي", "XCMG", "XC", [
    m("crane", "رافعة", "Crane", "truck", truck, ["Standard"]),
    m("excavator", "حفار", "Excavator", "truck", truck, ["Standard"]),
  ], "truck"),
  make("sdlg", "إس دي إل جي", "SDLG", "SD", [
    m("loader", "لودر", "Loader", "truck", truck, ["Standard"]),
  ], "truck"),
  make("buick", "بيوك", "Buick", "BU", [
    m("enclave", "إنكليف", "Enclave", "suv", suv, ["Preferred", "Avenir"]),
    m("encore", "إنكور", "Encore", "suv", suv, ["Preferred", "Essence"]),
    m("regal", "ريغال", "Regal", "sedan", sedan, ["Preferred", "GS"]),
  ]),
  make("proton", "بروتون", "Proton", "PR", [
    m("x50", "إكس 50", "X50", "suv", suv, ["Executive", "Premium"]),
    m("x70", "إكس 70", "X70", "suv", suv, ["Executive", "Premium"]),
    m("saga", "ساجا", "Saga", "sedan", sedan, ["Standard", "Premium"]),
  ], "other"),
  make("triumph", "ترايمف", "Triumph", "TR", [
    m("street-triple", "ستريت تريبل", "Street Triple", "moto", bike, ["R", "RS"]),
    m("tiger", "تايجر", "Tiger", "moto", bike, ["900", "1200"]),
    m("bonneville", "بونيفيلي", "Bonneville", "moto", bike, ["T100", "T120"]),
  ], "moto"),
  make("xiaomi", "شاومي", "Xiaomi", "MI", [
    m("su7", "إس يو 7", "SU7", "sedan", ev, ["Standard", "Pro", "Max"]),
    m("yu7", "يو 7", "YU7", "suv", ev, ["Standard", "Pro"]),
  ], "china"),
  make("exeed", "إكسيد", "EXEED", "EX", [
    m("txl", "تي إكس إل", "TXL", "suv", suv, ["Comfort", "Luxury"]),
    m("vx", "في إكس", "VX", "suv", suv, ["Comfort", "Luxury"]),
    m("rx", "آر إكس", "RX", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("soueast", "ساوايست", "Soueast", "SE", [
    m("dx7", "دي إكس 7", "DX7", "suv", suv, ["Comfort", "Luxury"]),
    m("dx8", "دي إكس 8", "DX8", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("motors-212", "212 موتورز", "212 Motors", "212", [
    m("t01", "تي 01", "T01", "suv", suv, ["Standard", "Adventure"]),
  ], "china"),
  make("caterpillar", "كاتربلر", "Caterpillar", "CAT", [
    m("excavator", "حفار", "Excavator", "truck", truck, ["Standard"]),
    m("dozer", "بلدوزر", "Dozer", "truck", truck, ["Standard"]),
  ], "truck"),
  make("bomag", "بوماج", "BOMAG", "BM", [
    m("roller", "مدحلة", "Roller", "truck", truck, ["Standard"]),
  ], "truck"),
  make("hamm", "هام", "Hamm", "HM", [
    m("roller", "مدحلة", "Roller", "truck", truck, ["Standard"]),
  ], "truck"),
  make("bobcat", "بوبكات", "Bobcat", "BC", [
    m("skid", "لودر انزلاقي", "Skid Steer", "truck", truck, ["Standard"]),
    m("excavator", "حفار", "Compact Excavator", "truck", truck, ["Standard"]),
  ], "truck"),
  make("brilliance", "تألق", "Brilliance", "BR", [
    m("v3", "في 3", "V3", "suv", suv, ["Comfort", "Luxury"]),
    m("v7", "في 7", "V7", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("opel", "أوبل", "Opel", "OP", [
    m("corsa", "كورسا", "Corsa", "hatch", sedan, ["Edition", "GS"]),
    m("astra", "أسترا", "Astra", "hatch", sedan, ["Edition", "GS"]),
    m("mokka", "موكا", "Mokka", "suv", suv, ["Edition", "Ultimate"]),
  ]),
  make("daewoo", "دايو", "Daewoo", "DW", [
    m("lanos", "لانوس", "Lanos", "sedan", sedan, ["S", "SE"]),
    m("nubira", "نوبيرا", "Nubira", "sedan", sedan, ["SE", "CDX"]),
  ], "other"),
  make("cfmoto", "سي اف موتو", "CFMOTO", "CF", [
    m("300nk", "300 إن كيه", "300NK", "moto", bike, ["Standard"]),
    m("700clx", "700 سي إل إكس", "700CL-X", "moto", bike, ["Heritage", "Sport"]),
    m("atv", "دفع رباعي", "ATV", "moto", bike, ["CForce"]),
  ], "moto"),
  make("jianshe", "جيانشي", "Jianshe", "JS", [
    m("atv", "دفع رباعي", "ATV", "moto", bike, ["Standard"]),
  ], "moto"),
  make("kymco", "كيمكو", "KYMCO", "KY", [
    m("ak550", "إيه كيه 550", "AK 550", "moto", bike, ["Standard"]),
    m("x-town", "إكس تاون", "X-Town", "moto", bike, ["300i"]),
  ], "moto"),
  make("moto-guzzi", "موتو جوزي", "Moto Guzzi", "MGZ", [
    m("v7", "في 7", "V7", "moto", bike, ["Stone", "Special"]),
    m("v85", "في 85", "V85 TT", "moto", bike, ["Standard", "Travel"]),
  ], "moto"),
  make("higer", "هايجر", "Higer", "HG", [
    m("bus", "باص", "Bus", "truck", truck, ["Standard"]),
  ], "truck"),
  make("ineos", "انيوس", "Ineos", "IN", [
    m("grenadier", "غرينادير", "Grenadier", "suv", suv, ["Station Wagon", "Trialmaster"]),
    m("quartermaster", "كوارترماستر", "Quartermaster", "pickup", pickup, ["Standard"]),
  ], "luxury"),
  make("voyah", "ڤويا", "Voyah", "VY", [
    m("free", "فري", "Free", "suv", ev, ["Standard", "Long Range"]),
    m("passion", "باشن", "Passion", "sedan", ev, ["Standard"]),
  ], "china"),
  make("denza", "دينزا", "Denza", "DZ", [
    m("d9", "دي 9", "D9", "suv", ev, ["Standard", "Premium"]),
    m("n7", "إن 7", "N7", "suv", ev, ["Standard"]),
  ], "china"),
  make("seres", "سيريس", "Seres", "SR", [
    m("5", "5", "5", "suv", ev, ["Standard", "Long Range"]),
    m("7", "7", "7", "suv", ev, ["Standard"]),
  ], "china"),
  make("tank", "تانك", "Tank", "TK", [
    m("300", "300", "300", "suv", suv, ["Comfort", "Luxury"]),
    m("500", "500", "500", "suv", suv, ["Comfort", "Luxury"]),
  ], "china"),
  make("hyster", "هايستر", "Hyster", "HY", [
    m("forklift", "رافعة شوكية", "Forklift", "truck", truck, ["Standard"]),
  ], "truck"),
  make("massey-ferguson", "ماسي فيرغسون", "Massey Ferguson", "MF", [
    m("tractor", "جرار", "Tractor", "truck", truck, ["Standard"]),
  ], "truck"),
  make("new-holland", "نيو هولاند", "New Holland", "NH", [
    m("tractor", "جرار", "Tractor", "truck", truck, ["Standard"]),
  ], "truck"),
  make("grove", "جروف", "Grove", "GR", [
    m("crane", "رافعة", "Crane", "truck", truck, ["Standard"]),
  ], "truck"),
  make("gorica", "جوريكا", "GORICA", "GO", [
    m("trailer", "مقطورة", "Trailer", "truck", truck, ["Standard"]),
  ], "truck"),
  make("sany", "ساني", "Sany", "SY", [
    m("excavator", "حفار", "Excavator", "truck", truck, ["Standard"]),
    m("crane", "رافعة", "Crane", "truck", truck, ["Standard"]),
  ], "truck"),
  make("hangcha", "هانغتشا", "Hangcha", "HC", [
    m("forklift", "رافعة شوكية", "Forklift", "truck", truck, ["Standard"]),
  ], "truck"),
  make("zoomlion", "زووملايون", "Zoomlion", "ZL", [
    m("crane", "رافعة", "Crane", "truck", truck, ["Standard"]),
    m("excavator", "حفار", "Excavator", "truck", truck, ["Standard"]),
  ], "truck"),
  make("mays", "ميس", "MAYS", "MY", [
    m("custom", "مخصص", "Custom", "sedan", generic, ["Base"]),
  ], "other"),
  make("acura", "أكيورا", "Acura", "AC", [
    m("mdx", "إم دي إكس", "MDX", "suv", suv, ["Technology", "A-Spec"]),
    m("rdx", "آر دي إكس", "RDX", "suv", suv, ["Technology", "A-Spec"]),
    m("tlx", "تي إل إكس", "TLX", "sedan", sedan, ["Technology", "Type S"]),
  ], "luxury"),
  make("aston-martin", "أستون مارتن", "Aston Martin", "AM", [
    m("dbx", "دي بي إكس", "DBX", "suv", suv, ["DBX", "707"]),
    m("vantage", "فانتاج", "Vantage", "coupe", coupe, ["Base", "F1 Edition"]),
    m("db12", "دي بي 12", "DB12", "coupe", coupe, ["Coupe", "Volante"]),
  ], "luxury"),
  make("mclaren", "مكلارين", "McLaren", "MC", [
    m("artura", "أرتورا", "Artura", "coupe", coupe, ["Standard", "Spider"]),
    m("720s", "720إس", "720S", "coupe", coupe, ["Coupe", "Spider"]),
    m("gt", "جي تي", "GT", "coupe", coupe, ["Standard"]),
  ], "luxury"),
  make("bugatti", "بوجاتي", "Bugatti", "BG", [
    m("chiron", "شيرون", "Chiron", "coupe", coupe, ["Standard", "Sport"]),
    m("veyron", "فيرون", "Veyron", "coupe", coupe, ["16.4"]),
  ], "luxury"),
  make("seat", "سيات", "SEAT", "SE", [
    m("leon", "ليون", "Leon", "hatch", sedan, ["FR", "Cupra"]),
    m("ateca", "أتيكا", "Ateca", "suv", suv, ["Style", "FR"]),
    m("ibiza", "إبيزا", "Ibiza", "hatch", sedan, ["Style", "FR"]),
  ]),
  make("cupra", "كوبرا", "Cupra", "CU", [
    m("formentor", "فورمينتور", "Formentor", "suv", suv, ["V", "VZ"]),
    m("leon", "ليون", "Leon", "hatch", sedan, ["V", "VZ"]),
    m("tavascan", "تافاسكان", "Tavascan", "suv", ev, ["Endurance", "V"]),
  ]),
  make("dacia", "داسيا", "Dacia", "DA", [
    m("duster", "داستر", "Duster", "suv", suv, ["Essential", "Expression"]),
    m("sandero", "سانديرو", "Sandero", "hatch", sedan, ["Essential", "Expression"]),
    m("jogger", "جوغر", "Jogger", "suv", suv, ["Expression"]),
  ]),
  make("rivian", "ريفيان", "Rivian", "RV", [
    m("r1t", "آر 1 تي", "R1T", "pickup", pickup, ["Explore", "Adventure"]),
    m("r1s", "آر 1 إس", "R1S", "suv", suv, ["Explore", "Adventure"]),
  ], "luxury"),
  make("lucid", "لوسيد", "Lucid", "LU", [
    m("air", "إير", "Air", "sedan", ev, ["Pure", "Touring", "Grand Touring"]),
    m("gravity", "غرافيتي", "Gravity", "suv", ev, ["Touring", "Grand Touring"]),
  ], "luxury"),
];

/** Overlay expanded bilingual models + real thumbnails when generated catalog exists. */
type GeneratedModel = {
  id: string;
  name: Copy;
  body: string;
  image: string;
  trims: string[];
};

const generated = generatedModels as Record<string, GeneratedModel[]>;

for (const makeItem of allMakes) {
  const models = generated[makeItem.id];
  if (models?.length) {
    makeItem.models = models.map((item) => ({
      id: item.id,
      name: L(item.name.ar, item.name.en),
      body: item.body,
      image: item.image,
      trims: item.trims?.length ? item.trims : ["Base"],
    }));
  }
}

export const makeCategories = [
  { id: "all", name: L("الكل", "All") },
  { id: "cars", name: L("سيارات", "Cars") },
  { id: "luxury", name: L("فاخرة", "Luxury") },
  { id: "china", name: L("صينية / كهرباء", "China / EV") },
  { id: "moto", name: L("دراجات", "Motorcycles") },
  { id: "truck", name: L("شاحنات ومعدات", "Trucks & equipment") },
  { id: "other", name: L("أخرى", "Other") },
] as const;
