/**
 * Builds expanded model lists + resolves real thumbnail URLs (Wikimedia/Wikipedia).
 * Output: src/lib/generated-models.json
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT = path.join(process.cwd(), "src", "lib", "generated-models.json");
const CACHE = path.join(process.cwd(), "scripts", "wiki-thumb-cache.json");

const BODY_FALLBACK = {
  sedan: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
  coupe: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  pickup: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80",
  hatch: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
  van: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=900&q=80",
  moto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
  truck: "https://images.unsplash.com/photo-1601584115197-04ecc1da58d4?auto=format&fit=crop&w=900&q=80",
  ev: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
};

/** @type {Record<string, [string, string, string, string, string[]][]>} id, ar, en, body, trims */
const CATALOG = {
  toyota: [
    ["camry", "كامري", "Camry", "sedan", ["LE", "SE", "XLE", "Grande"]],
    ["corolla", "كورولا", "Corolla", "sedan", ["XLI", "GLI", "SE"]],
    ["land-cruiser", "لاند كروزر", "Land Cruiser", "suv", ["GXR", "VX", "VXR"]],
    ["prado", "برادو", "Prado", "suv", ["TXL", "VX", "VXR"]],
    ["hilux", "هايلكس", "Hilux", "pickup", ["GL", "GLX", "Adventure"]],
    ["rav4", "راف فور", "RAV4", "suv", ["LE", "XLE", "Limited"]],
    ["fortuner", "فورتشنر", "Fortuner", "suv", ["GXR", "VRZ"]],
    ["yaris", "ياريس", "Yaris", "hatch", ["SE", "Y"]],
    ["avalon", "أفالون", "Avalon", "sedan", ["XLE", "Limited"]],
    ["highlander", "هايلاندر", "Highlander", "suv", ["XLE", "Limited"]],
    ["4runner", "فور رنر", "4Runner", "suv", ["SR5", "TRD"]],
    ["tacoma", "تاكوما", "Tacoma", "pickup", ["SR", "TRD"]],
    ["tundra", "تundra", "Tundra", "pickup", ["SR5", "Limited"]],
    ["sequoia", "سيكويا", "Sequoia", "suv", ["SR5", "Limited"]],
    ["supra", "سوبرا", "Supra", "coupe", ["3.0", "A91"]],
    ["c-hr", "سي إتش آر", "C-HR", "suv", ["LE", "Limited"]],
    ["rush", "راش", "Rush", "suv", ["G", "S"]],
    ["innova", "إنوفا", "Innova", "van", ["G", "V"]],
    ["hiace", "هايس", "HiAce", "van", ["GL", "GLX"]],
    ["coaster", "كوستر", "Coaster", "van", ["Standard"]],
    ["crown", "كراون", "Crown", "sedan", ["XLE", "Limited"]],
    ["prius", "بريوس", "Prius", "hatch", ["LE", "XLE"]],
    ["sienna", "سيينا", "Sienna", "van", ["LE", "XLE"]],
    ["land-cruiser-70", "لاند كروزر 70", "Land Cruiser 70", "suv", ["Pickup", "Wagon"]],
    ["urban-cruiser", "أوربان كروزر", "Urban Cruiser", "suv", ["Premium"]],
    ["raize", "رايز", "Raize", "suv", ["G", "Z"]],
    ["veloz", "فيلوز", "Veloz", "suv", ["G", "Q"]],
    ["gr86", "جي آر 86", "GR86", "coupe", ["Base", "Premium"]],
  ],
  nissan: [
    ["patrol", "باترول", "Patrol", "suv", ["SE", "LE", "Platinum", "NISMO"]],
    ["altima", "التيما", "Altima", "sedan", ["S", "SV", "SL"]],
    ["x-trail", "إكس تريل", "X-Trail", "suv", ["S", "SV", "Titanium"]],
    ["xterra", "إكستيرا", "X-Terra", "suv", ["S", "SE", "Titanium"]],
    ["sunny", "صني", "Sunny", "sedan", ["S", "SV"]],
    ["kicks", "كيكس", "Kicks", "suv", ["S", "SV", "SR"]],
    ["navara", "نافارا", "Navara", "pickup", ["SE", "LE"]],
    ["maxima", "ماكسيما", "Maxima", "sedan", ["SV", "SL", "Platinum"]],
    ["pathfinder", "باثفايندر", "Pathfinder", "suv", ["S", "SV", "Platinum"]],
    ["armada", "أرمادا", "Armada", "suv", ["SV", "SL", "Platinum"]],
    ["sentra", "سنترا", "Sentra", "sedan", ["S", "SV", "SR"]],
    ["rogue", "روج", "Rogue", "suv", ["S", "SV", "SL"]],
    ["gt-r", "جي تي آر", "GT-R", "coupe", ["Premium", "NISMO"]],
    ["z", "زد", "Z", "coupe", ["Sport", "Performance"]],
    ["murano", "مورانو", "Murano", "suv", ["SV", "SL"]],
    ["versa", "فيرسا", "Versa", "sedan", ["S", "SV"]],
    ["frontier", "فرونتير", "Frontier", "pickup", ["SV", "PRO-4X"]],
    ["titan", "تيتان", "Titan", "pickup", ["SV", "PRO-4X"]],
    ["juke", "جوك", "Juke", "suv", ["S", "SV"]],
    ["qashqai", "قشقاي", "Qashqai", "suv", ["S", "SV"]],
    ["terra", "تيرا", "Terra", "suv", ["S", "VL"]],
    ["urvan", "أورفان", "Urvan", "van", ["Standard"]],
  ],
  lexus: [
    ["es", "إي إس", "ES", "sedan", ["250", "300h", "350"]],
    ["ls", "إل إس", "LS", "sedan", ["500", "500h"]],
    ["lx", "إل إكس", "LX", "suv", ["570", "600"]],
    ["rx", "آر إكس", "RX", "suv", ["350", "450h"]],
    ["nx", "إن إكس", "NX", "suv", ["250", "350h"]],
    ["gx", "جي إكس", "GX", "suv", ["460", "550"]],
    ["is", "آي إس", "IS", "sedan", ["300", "350", "500"]],
    ["ux", "يو إكس", "UX", "suv", ["200", "250h"]],
    ["rc", "آر سي", "RC", "coupe", ["300", "350", "F"]],
    ["lc", "إل سي", "LC", "coupe", ["500", "500h"]],
    ["tx", "تي إكس", "TX", "suv", ["350", "500h"]],
    ["rz", "آر زد", "RZ", "suv", ["300e", "450e"]],
    ["lm", "إل إم", "LM", "van", ["350", "500h"]],
  ],
  mercedes: [
    ["a-class", "الفئة A", "A-Class", "hatch", ["A200", "A250"]],
    ["c-class", "الفئة C", "C-Class", "sedan", ["C200", "C300", "AMG"]],
    ["e-class", "الفئة E", "E-Class", "sedan", ["E200", "E300", "AMG"]],
    ["s-class", "الفئة S", "S-Class", "sedan", ["S450", "S580"]],
    ["g-class", "الفئة G", "G-Class", "suv", ["G500", "G63"]],
    ["gle", "جي إل إي", "GLE", "suv", ["GLE350", "GLE450"]],
    ["glc", "جي إل سي", "GLC", "suv", ["GLC300", "AMG"]],
    ["gla", "جي إل إيه", "GLA", "suv", ["GLA200", "GLA250"]],
    ["glb", "جي إل بي", "GLB", "suv", ["GLB200", "GLB250"]],
    ["gls", "جي إل إس", "GLS", "suv", ["GLS450", "GLS580"]],
    ["cla", "سي إل إيه", "CLA", "sedan", ["CLA200", "CLA250", "AMG"]],
    ["cls", "سي إل إس", "CLS", "sedan", ["CLS450", "AMG"]],
    ["amg-gt", "إيه إم جي جي تي", "AMG GT", "coupe", ["GT", "GT 63"]],
    ["v-class", "الفئة V", "V-Class", "van", ["V250", "V300"]],
    ["maybach-s", "مايباخ S", "Maybach S-Class", "sedan", ["S580", "S680"]],
    ["eqe", "إي كيو إي", "EQE", "sedan", ["350", "500"]],
    ["eqs", "إي كيو إس", "EQS", "sedan", ["450", "580"]],
    ["eqb", "إي كيو بي", "EQB", "suv", ["250", "350"]],
    ["cle", "سي إل إي", "CLE", "coupe", ["CLE200", "CLE300"]],
  ],
  honda: [
    ["accord", "أكورد", "Accord", "sedan", ["EX", "EX-L", "Touring"]],
    ["civic", "سيفيك", "Civic", "sedan", ["LX", "EX", "Sport"]],
    ["crv", "سي آر في", "CR-V", "suv", ["EX", "EX-L", "Touring"]],
    ["hrv", "اتش آر في", "HR-V", "suv", ["LX", "EX"]],
    ["pilot", "بايلوت", "Pilot", "suv", ["EX", "Touring"]],
    ["city", "سيتي", "City", "sedan", ["DX", "LX"]],
    ["odyssey", "أوديسي", "Odyssey", "van", ["EX", "Touring"]],
    ["passport", "باسبورت", "Passport", "suv", ["EX-L", "TrailSport"]],
    ["ridgeline", "ريدجلاين", "Ridgeline", "pickup", ["RTL", "TrailSport"]],
    ["jazz", "جاز", "Jazz", "hatch", ["DX", "LX"]],
    ["zr-v", "زد آر في", "ZR-V", "suv", ["EX", "Sport"]],
    ["wr-v", "دبليو آر في", "WR-V", "suv", ["VX", "ZX"]],
    ["brv", "بي آر في", "BR-V", "suv", ["E", "V"]],
  ],
  hyundai: [
    ["tucson", "توسان", "Tucson", "suv", ["Smart", "Comfort", "Premium"]],
    ["sonata", "سوناتا", "Sonata", "sedan", ["GL", "GLS", "N Line"]],
    ["elantra", "إلنترا", "Elantra", "sedan", ["Smart", "Comfort"]],
    ["santa-fe", "سانتافي", "Santa Fe", "suv", ["Comfort", "Calligraphy"]],
    ["palisade", "باليسيد", "Palisade", "suv", ["SEL", "Limited"]],
    ["creta", "كريتا", "Creta", "suv", ["Smart", "Premium"]],
    ["accent", "أكسنت", "Accent", "sedan", ["Smart", "GL"]],
    ["kona", "كونا", "Kona", "suv", ["SEL", "Limited"]],
    ["venue", "فينيو", "Venue", "suv", ["Smart", "Comfort"]],
    ["staria", "ستاريا", "Staria", "van", ["Smart", "Premium"]],
    ["ioniq-5", "أيونيك 5", "Ioniq 5", "suv", ["SE", "Limited"]],
    ["ioniq-6", "أيونيك 6", "Ioniq 6", "sedan", ["SE", "Limited"]],
    ["azera", "أزيرة", "Azera", "sedan", ["GLS", "Limited"]],
    ["santa-cruz", "سانتا كروز", "Santa Cruz", "pickup", ["SEL", "Limited"]],
    ["bayon", "بايون", "Bayon", "suv", ["Comfort"]],
    ["i10", "آي 10", "i10", "hatch", ["Smart"]],
    ["i20", "آي 20", "i20", "hatch", ["Comfort"]],
    ["stargazer", "ستارغيزر", "Stargazer", "van", ["Smart", "Prime"]],
  ],
  jeep: [
    ["wrangler", "رانجلر", "Wrangler", "suv", ["Sport", "Sahara", "Rubicon"]],
    ["grand-cherokee", "جراند شيروكي", "Grand Cherokee", "suv", ["Laredo", "Limited", "Overland"]],
    ["cherokee", "شيروكي", "Cherokee", "suv", ["Latitude", "Limited"]],
    ["compass", "كومباس", "Compass", "suv", ["Sport", "Limited"]],
    ["gladiator", "جلادياتور", "Gladiator", "pickup", ["Sport", "Rubicon"]],
    ["renegade", "رينيجيد", "Renegade", "suv", ["Sport", "Limited"]],
    ["wagoneer", "واغونير", "Wagoneer", "suv", ["Series II", "Series III"]],
    ["grand-wagoneer", "جراند واغونير", "Grand Wagoneer", "suv", ["Series II", "Obsidian"]],
    ["avenger", "أفينجر", "Avenger", "suv", ["Longitude", "Summit"]],
  ],
  chevrolet: [
    ["tahoe", "تاهو", "Tahoe", "suv", ["LS", "LT", "Premier"]],
    ["suburban", "سوبربان", "Suburban", "suv", ["LT", "Premier"]],
    ["malibu", "ماليبو", "Malibu", "sedan", ["LS", "LT"]],
    ["captiva", "كابتيفا", "Captiva", "suv", ["LS", "Premier"]],
    ["silverado", "سيلفرادو", "Silverado", "pickup", ["LT", "High Country"]],
    ["traverse", "ترافيرس", "Traverse", "suv", ["LT", "Premier"]],
    ["equinox", "إكوينوكس", "Equinox", "suv", ["LT", "Premier"]],
    ["blazer", "بليزر", "Blazer", "suv", ["LT", "RS"]],
    ["camaro", "كامارو", "Camaro", "coupe", ["LT", "SS", "ZL1"]],
    ["corvette", "كورفيت", "Corvette", "coupe", ["1LT", "2LT", "Z06"]],
    ["colorado", "كولورادو", "Colorado", "pickup", ["LT", "ZR2"]],
    ["trailblazer", "تريل بليزر", "Trailblazer", "suv", ["LT", "RS"]],
    ["trax", "تراكس", "Trax", "suv", ["LS", "LT"]],
    ["express", "إكسبريس", "Express", "van", ["LS", "LT"]],
  ],
  ford: [
    ["mustang", "موستانج", "Mustang", "coupe", ["EcoBoost", "GT", "Dark Horse"]],
    ["explorer", "إكسبلورر", "Explorer", "suv", ["XLT", "Limited", "ST"]],
    ["f150", "إف-150", "F-150", "pickup", ["XLT", "Lariat", "Raptor"]],
    ["taurus", "تورس", "Taurus", "sedan", ["SE", "SEL", "Limited"]],
    ["edge", "إيدج", "Edge", "suv", ["SEL", "Titanium"]],
    ["escape", "إسكيب", "Escape", "suv", ["SE", "SEL"]],
    ["bronco", "برونكو", "Bronco", "suv", ["Big Bend", "Badlands"]],
    ["bronco-sport", "برونكو سبورت", "Bronco Sport", "suv", ["Big Bend", "Badlands"]],
    ["ranger", "رينجر", "Ranger", "pickup", ["XLT", "Lariat", "Raptor"]],
    ["expedition", "إكسبيديشن", "Expedition", "suv", ["XLT", "Limited", "King Ranch"]],
    ["everest", "إيفرست", "Everest", "suv", ["Trend", "Limited"]],
    ["territory", "تيريتوري", "Territory", "suv", ["Trend", "Titanium"]],
    ["figo", "فيجو", "Figo", "hatch", ["Ambiente", "Trend"]],
    ["ecosport", "إيكو سبورت", "EcoSport", "suv", ["Ambiente", "Titanium"]],
    ["transit", "ترانزيت", "Transit", "van", ["Cargo", "Passenger"]],
    ["mach-e", "ماك إي", "Mustang Mach-E", "suv", ["Select", "Premium", "GT"]],
  ],
  dodge: [
    ["charger", "تشارجر", "Charger", "sedan", ["SXT", "GT", "Scat Pack", "Hellcat"]],
    ["challenger", "تشالنجر", "Challenger", "coupe", ["SXT", "R/T", "Hellcat"]],
    ["durango", "دورانجو", "Durango", "suv", ["SXT", "GT", "R/T", "SRT"]],
    ["hornet", "هورنت", "Hornet", "suv", ["GT", "R/T"]],
    ["ram-1500", "رام 1500", "Ram 1500", "pickup", ["Big Horn", "Laramie"]],
  ],
  gmc: [
    ["yukon", "يوكون", "Yukon", "suv", ["SLE", "SLT", "Denali"]],
    ["yukon-xl", "يوكون إكس إل", "Yukon XL", "suv", ["SLT", "Denali"]],
    ["sierra", "سييرا", "Sierra", "pickup", ["SLE", "AT4", "Denali"]],
    ["terrain", "تيرين", "Terrain", "suv", ["SLE", "SLT", "AT4"]],
    ["acadia", "أكاديا", "Acadia", "suv", ["SLE", "SLT", "Denali"]],
    ["canyon", "كانيون", "Canyon", "pickup", ["Elevation", "AT4", "Denali"]],
    ["hummer-ev", "همر إي في", "HUMMER EV", "pickup", ["2X", "3X"]],
  ],
  bmw: [
    ["1-series", "الفئة الأولى", "1 Series", "hatch", ["118i", "M135i"]],
    ["2-series", "الفئة الثانية", "2 Series", "coupe", ["220i", "M240i"]],
    ["3-series", "الفئة الثالثة", "3 Series", "sedan", ["320i", "330i", "M340i"]],
    ["4-series", "الفئة الرابعة", "4 Series", "coupe", ["420i", "430i", "M440i"]],
    ["5-series", "الفئة الخامسة", "5 Series", "sedan", ["520i", "530i", "M5"]],
    ["7-series", "الفئة السابعة", "7 Series", "sedan", ["740i", "760i"]],
    ["x1", "إكس 1", "X1", "suv", ["sDrive18i", "xDrive25i"]],
    ["x3", "إكس 3", "X3", "suv", ["xDrive20i", "M40i"]],
    ["x4", "إكس 4", "X4", "suv", ["xDrive20i", "M40i"]],
    ["x5", "إكس 5", "X5", "suv", ["xDrive40i", "M60i"]],
    ["x6", "إكس 6", "X6", "suv", ["xDrive40i", "M60i"]],
    ["x7", "إكس 7", "X7", "suv", ["xDrive40i", "M60i"]],
    ["ix", "آي إكس", "iX", "suv", ["xDrive40", "xDrive50"]],
    ["i4", "آي 4", "i4", "sedan", ["eDrive40", "M50"]],
    ["i7", "آي 7", "i7", "sedan", ["xDrive60", "M70"]],
    ["z4", "زد 4", "Z4", "coupe", ["sDrive20i", "M40i"]],
    ["xm", "إكس إم", "XM", "suv", ["XM", "Label"]],
  ],
  mitsubishi: [
    ["pajero", "باجيرو", "Pajero", "suv", ["GLS", "Signature"]],
    ["montero-sport", "مونتيرو سبورت", "Montero Sport", "suv", ["GLS", "Premium"]],
    ["l200", "إل 200", "L200", "pickup", ["GL", "GLX", "Sportero"]],
    ["outlander", "آوتلاندر", "Outlander", "suv", ["ES", "SE", "GT"]],
    ["asx", "إيه إس إكس", "ASX", "suv", ["ES", "LS"]],
    ["eclipse-cross", "إكليبس كروس", "Eclipse Cross", "suv", ["ES", "SE"]],
    ["xpander", "إكسباندر", "Xpander", "van", ["GLX", "GT"]],
    ["attrage", "أتراج", "Attrage", "sedan", ["GLX", "GLS"]],
    ["mirage", "ميراج", "Mirage", "hatch", ["ES", "LE"]],
  ],
  kia: [
    ["sportage", "سبورتاج", "Sportage", "suv", ["LX", "EX", "GT-Line"]],
    ["sorento", "سورينتو", "Sorento", "suv", ["LX", "EX", "SX"]],
    ["cerato", "سيراتو", "Cerato", "sedan", ["LX", "EX"]],
    ["k5", "كي 5", "K5", "sedan", ["LXS", "GT-Line", "GT"]],
    ["telluride", "تيلورايد", "Telluride", "suv", ["LX", "EX", "SX"]],
    ["seltos", "سيلتوس", "Seltos", "suv", ["LX", "EX", "SX"]],
    ["carnival", "كرنفال", "Carnival", "van", ["LX", "EX", "SX"]],
    ["rio", "ريو", "Rio", "sedan", ["LX", "S"]],
    ["soul", "سول", "Soul", "hatch", ["LX", "EX"]],
    ["ev6", "إي في 6", "EV6", "suv", ["Light", "Wind", "GT"]],
    ["ev9", "إي في 9", "EV9", "suv", ["Light", "Land", "GT"]],
    ["picanto", "بيكانتو", "Picanto", "hatch", ["LX", "EX"]],
    ["sonet", "سونيت", "Sonet", "suv", ["LX", "HTX"]],
    ["pe", "بيegas", "Pegas", "sedan", ["LX", "EX"]],
  ],
  mazda: [
    ["mazda3", "مازدا 3", "Mazda3", "sedan", ["Sport", "Select", "Premium"]],
    ["mazda6", "مازدا 6", "Mazda6", "sedan", ["Sport", "Touring", "Grand Touring"]],
    ["cx5", "سي إكس 5", "CX-5", "suv", ["Sport", "Touring", "Carbon"]],
    ["cx30", "سي إكس 30", "CX-30", "suv", ["Select", "Preferred"]],
    ["cx60", "سي إكس 60", "CX-60", "suv", ["Exclusive", "Homura"]],
    ["cx90", "سي إكس 90", "CX-90", "suv", ["Preferred", "Premium", "PHEV"]],
    ["cx9", "سي إكس 9", "CX-9", "suv", ["Touring", "Grand Touring"]],
    ["mx5", "إم إكس 5", "MX-5 Miata", "coupe", ["Sport", "Club", "RF"]],
    ["bt50", "بي تي 50", "BT-50", "pickup", ["XT", "XTR"]],
  ],
  "land-rover": [
    ["defender", "ديفندر", "Defender", "suv", ["90", "110", "130"]],
    ["range-rover", "رينج روفر", "Range Rover", "suv", ["SE", "Autobiography", "SV"]],
    ["range-rover-sport", "رينج روفر سبورت", "Range Rover Sport", "suv", ["SE", "Dynamic", "Autobiography"]],
    ["range-rover-velar", "فيلار", "Range Rover Velar", "suv", ["S", "R-Dynamic", "Autobiography"]],
    ["range-rover-evoque", "إيفوك", "Range Rover Evoque", "suv", ["S", "R-Dynamic", "Autobiography"]],
    ["discovery", "ديسكفري", "Discovery", "suv", ["S", "Dynamic SE", "Metropolitan"]],
    ["discovery-sport", "ديسكفري سبورت", "Discovery Sport", "suv", ["S", "Dynamic SE"]],
  ],
  infiniti: [
    ["qx80", "كيو إكس 80", "QX80", "suv", ["Luxe", "Sensory", "Autograph"]],
    ["qx60", "كيو إكس 60", "QX60", "suv", ["Luxe", "Sensory", "Autograph"]],
    ["qx55", "كيو إكس 55", "QX55", "suv", ["Luxe", "Sensory"]],
    ["qx50", "كيو إكس 50", "QX50", "suv", ["Luxe", "Sensory", "Autograph"]],
    ["q50", "كيو 50", "Q50", "sedan", ["Luxe", "Sensory", "Red Sport"]],
    ["q60", "كيو 60", "Q60", "coupe", ["Luxe", "Red Sport"]],
  ],
  suzuki: [
    ["jimny", "جيمني", "Jimny", "suv", ["GL", "GLX"]],
    ["vitara", "فيتارا", "Vitara", "suv", ["GL", "GLX"]],
    ["grand-vitara", "جراند فيتارا", "Grand Vitara", "suv", ["GL", "GLX", "Alpha"]],
    ["swift", "سويفت", "Swift", "hatch", ["GL", "GLX"]],
    ["dzire", "ديزاير", "Dzire", "sedan", ["GL", "GLX"]],
    ["ertiga", "إرتيجا", "Ertiga", "van", ["GL", "GLX"]],
    ["ciaz", "سياز", "Ciaz", "sedan", ["GL", "GLX"]],
    ["s-presso", "إس بريسو", "S-Presso", "hatch", ["GL", "VXI"]],
    ["baleno", "بالينو", "Baleno", "hatch", ["GL", "Alpha"]],
    ["fronx", "فرونكس", "Fronx", "suv", ["GL", "Alpha"]],
    ["xl7", "إكس إل 7", "XL7", "suv", ["GL", "Alpha"]],
  ],
  volkswagen: [
    ["golf", "غولف", "Golf", "hatch", ["Life", "Style", "R"]],
    ["passat", "باسات", "Passat", "sedan", ["SE", "SEL", "R-Line"]],
    ["tiguan", "تيجوان", "Tiguan", "suv", ["SE", "SEL", "R-Line"]],
    ["touareg", "طواريق", "Touareg", "suv", ["SE", "R-Line"]],
    ["jetta", "جيتا", "Jetta", "sedan", ["S", "SE", "SEL"]],
    ["arteon", "آرتيون", "Arteon", "sedan", ["SE", "SEL", "R-Line"]],
    ["t-roc", "تي روك", "T-Roc", "suv", ["Life", "Style", "R"]],
    ["id4", "آي دي 4", "ID.4", "suv", ["Pro", "Pro S"]],
    ["id7", "آي دي 7", "ID.7", "sedan", ["Pro", "Pro S"]],
    ["teramont", "تيرامونت", "Teramont", "suv", ["SE", "SEL"]],
    ["polo", "بولو", "Polo", "hatch", ["Life", "Style"]],
  ],
  byd: [
    ["seal", "سيل", "Seal", "sedan", ["Dynamic", "Premium", "Performance"]],
    ["song-plus", "سونج بلس", "Song Plus", "suv", ["Champion", "Flagship"]],
    ["han", "هان", "Han", "sedan", ["EV", "DM-i"]],
    ["tang", "تانغ", "Tang", "suv", ["EV", "DM-i"]],
    ["atto-3", "أتو 3", "Atto 3", "suv", ["Standard", "Extended"]],
    ["dolphin", "دولفين", "Dolphin", "hatch", ["Active", "Comfort"]],
    ["sealion-7", "سيلايون 7", "Sealion 7", "suv", ["Comfort", "Excellence"]],
    ["qin-plus", "تشين بلس", "Qin Plus", "sedan", ["DM-i"]],
    ["yuan-plus", "يوان بلس", "Yuan Plus", "suv", ["Standard"]],
    ["shark", "شارك", "Shark", "pickup", ["Premium"]],
  ],
  mg: [
    ["mg5", "إم جي 5", "MG5", "sedan", ["Comfort", "Luxury"]],
    ["mg6", "إم جي 6", "MG6", "sedan", ["Comfort", "Trophy"]],
    ["zs", "زد إس", "ZS", "suv", ["Comfort", "Luxury"]],
    ["hs", "إتش إس", "HS", "suv", ["Comfort", "Trophy"]],
    ["rx5", "آر إكس 5", "RX5", "suv", ["Comfort", "Luxury"]],
    ["rx8", "آر إكس 8", "RX8", "suv", ["Comfort", "Luxury"]],
    ["one", "وان", "ONE", "suv", ["COM", "LUX"]],
    ["gt", "جي تي", "GT", "sedan", ["COM", "LUX"]],
    ["cyberster", "سايبرستر", "Cyberster", "coupe", ["Trophy"]],
    ["whale", "ويل", "Whale", "pickup", ["Comfort"]],
  ],
  tesla: [
    ["model-3", "موديل 3", "Model 3", "sedan", ["RWD", "Long Range", "Performance"]],
    ["model-y", "موديل واي", "Model Y", "suv", ["RWD", "Long Range", "Performance"]],
    ["model-s", "موديل إس", "Model S", "sedan", ["Long Range", "Plaid"]],
    ["model-x", "موديل إكس", "Model X", "suv", ["Long Range", "Plaid"]],
    ["cybertruck", "سايبرترك", "Cybertruck", "pickup", ["RWD", "AWD", "Cyberbeast"]],
  ],
  mini: [
    ["cooper", "كوبر", "Cooper", "hatch", ["Classic", "S", "JCW"]],
    ["countryman", "كانتري مان", "Countryman", "suv", ["Classic", "S", "JCW"]],
    ["clubman", "كلب مان", "Clubman", "hatch", ["Classic", "S"]],
    ["convertible", "كونفرتيبل", "Convertible", "coupe", ["Classic", "S"]],
    ["paceman", "بيس مان", "Aceman", "suv", ["Classic", "SE"]],
  ],
  subaru: [
    ["outback", "آوت باك", "Outback", "suv", ["Premium", "Limited", "Wilderness"]],
    ["forester", "فورستر", "Forester", "suv", ["Premium", "Limited", "Wilderness"]],
    ["crosstrek", "كروستريك", "Crosstrek", "suv", ["Premium", "Limited"]],
    ["ascent", "أسينت", "Ascent", "suv", ["Premium", "Limited", "Touring"]],
    ["impreza", "إمبريزا", "Impreza", "sedan", ["Premium", "Sport"]],
    ["wrx", "دبليو آر إكس", "WRX", "sedan", ["Premium", "GT"]],
    ["brz", "بي آر زد", "BRZ", "coupe", ["Premium", "Limited"]],
    ["legacy", "ليجاسي", "Legacy", "sedan", ["Premium", "Limited"]],
  ],
  ram: [
    ["1500", "1500", "1500", "pickup", ["Big Horn", "Laramie", "Limited", "TRX"]],
    ["2500", "2500", "2500", "pickup", ["Big Horn", "Laramie", "Limited"]],
    ["3500", "3500", "3500", "pickup", ["Big Horn", "Laramie", "Limited"]],
    ["700", "700", "700", "pickup", ["SLT", "Laramie"]],
  ],
  porsche: [
    ["911", "911", "911", "coupe", ["Carrera", "Carrera S", "Turbo", "GT3"]],
    ["cayenne", "كايين", "Cayenne", "suv", ["Base", "S", "GTS", "Turbo"]],
    ["macan", "ماكان", "Macan", "suv", ["Base", "S", "GTS", "Turbo"]],
    ["panamera", "باناميرا", "Panamera", "sedan", ["Base", "4S", "Turbo"]],
    ["taycan", "تايكان", "Taycan", "sedan", ["Base", "4S", "Turbo"]],
    ["718-cayman", "718 بوكستر", "718 Boxster", "coupe", ["Base", "S", "GTS"]],
    ["718-caymanman", "718 كايمان", "718 Cayman", "coupe", ["Base", "S", "GT4"]],
  ],
  renault: [
    ["duster", "داستر", "Duster", "suv", ["PE", "SE", "LE"]],
    ["koleos", "كوليوس", "Koleos", "suv", ["PE", "SE", "LE"]],
    ["megane", "ميجان", "Megane", "sedan", ["PE", "SE"]],
    ["symbol", "سيمبول", "Symbol", "sedan", ["PE", "SE"]],
    ["captur", "كابتشر", "Captur", "suv", ["PE", "SE"]],
    ["talisman", "تاليسمان", "Talisman", "sedan", ["PE", "SE"]],
    ["arkana", "أركانا", "Arkana", "suv", ["Techno", "Esprit Alpine"]],
    ["austral", "أسترال", "Austral", "suv", ["Techno", "Iconic"]],
  ],
  audi: [
    ["a3", "إيه 3", "A3", "sedan", ["40 TFSI", "S3"]],
    ["a4", "إيه 4", "A4", "sedan", ["40 TFSI", "45 TFSI"]],
    ["a6", "إيه 6", "A6", "sedan", ["45 TFSI", "55 TFSI"]],
    ["a7", "إيه 7", "A7", "sedan", ["45 TFSI", "55 TFSI"]],
    ["a8", "إيه 8", "A8", "sedan", ["55 TFSI", "60 TFSI"]],
    ["q2", "كيو 2", "Q2", "suv", ["35 TFSI", "40 TFSI"]],
    ["q3", "كيو 3", "Q3", "suv", ["35 TFSI", "40 TFSI", "RS"]],
    ["q5", "كيو 5", "Q5", "suv", ["40 TFSI", "45 TFSI", "SQ5"]],
    ["q7", "كيو 7", "Q7", "suv", ["45 TFSI", "55 TFSI", "SQ7"]],
    ["q8", "كيو 8", "Q8", "suv", ["55 TFSI", "SQ8", "RS Q8"]],
    ["e-tron", "إي ترون", "Q8 e-tron", "suv", ["50", "55", "S"]],
    ["etron-gt", "إي ترون جي تي", "e-tron GT", "sedan", ["quattro", "RS"]],
    ["tt", "تي تي", "TT", "coupe", ["45 TFSI", "TTS", "RS"]],
    ["r8", "آر 8", "R8", "coupe", ["V10", "Performance"]],
  ],
};

// Extend with remaining makes from a compact list so every agency has models
const EXTRA = {
  chrysler: [["300", "300", "300", "sedan", ["Touring", "Limited"]], ["pacifica", "باسيفيكا", "Pacifica", "van", ["Touring", "Limited"]], ["voyager", "فوياجر", "Voyager", "van", ["LX"]]],
  isuzu: [["d-max", "دي ماكس", "D-Max", "pickup", ["LS", "LT", "V-Cross"]], ["mu-x", "إم يو إكس", "mu-X", "suv", ["LS", "LT"]], ["npr", "إن بي آر", "NPR", "truck", ["Standard"]]],
  changan: [["cs75", "سي إس 75", "CS75 Plus", "suv", ["Comfort", "Luxury"]], ["uni-t", "يوني تي", "UNI-T", "suv", ["Premium"]], ["uni-v", "يوني في", "UNI-V", "sedan", ["Premium"]], ["alsvin", "ألسفين", "Alsvin", "sedan", ["Comfort"]], ["hunter", "هنتر", "Hunter", "pickup", ["Luxury"]]],
  cadillac: [["escalade", "إسكاليد", "Escalade", "suv", ["Luxury", "Premium", "Sport"]], ["xt5", "إكس تي 5", "XT5", "suv", ["Luxury", "Premium"]], ["xt4", "إكس تي 4", "XT4", "suv", ["Luxury", "Sport"]], ["xt6", "إكس تي 6", "XT6", "suv", ["Luxury", "Sport"]], ["ct5", "سي تي 5", "CT5", "sedan", ["Luxury", "Sport", "V"]], ["lyriq", "ليريك", "Lyriq", "suv", ["Tech", "Luxury"]]],
  genesis: [["g70", "جي 70", "G70", "sedan", ["2.0T", "3.3T"]], ["g80", "جي 80", "G80", "sedan", ["2.5T", "3.5T"]], ["g90", "جي 90", "G90", "sedan", ["3.5T"]], ["gv70", "جي في 70", "GV70", "suv", ["2.5T", "3.5T"]], ["gv80", "جي في 80", "GV80", "suv", ["2.5T", "3.5T"]], ["gv60", "جي في 60", "GV60", "suv", ["Standard", "Performance"]]],
  lincoln: [["navigator", "نافيجيتور", "Navigator", "suv", ["Reserve", "Black Label"]], ["aviator", "أفياتور", "Aviator", "suv", ["Reserve", "Black Label"]], ["nautilus", "نوتيلوس", "Nautilus", "suv", ["Reserve", "Black Label"]], ["corsair", "كورسير", "Corsair", "suv", ["Reserve", "Grand Touring"]]],
  daihatsu: [["terios", "تيريوس", "Terios", "suv", ["X", "R"]], ["gran-max", "جران ماكس", "Gran Max", "van", ["Standard"]], ["rocky", "روكي", "Rocky", "suv", ["X", "R"]], ["ayla", "آيلا", "Ayla", "hatch", ["X", "R"]], ["xenia", "كسينيا", "Xenia", "van", ["X", "R"]]],
  geely: [["coolray", "كولراي", "Coolray", "suv", ["GF", "GF+"]], ["monjaro", "مونجارو", "Monjaro", "suv", ["Exclusive"]], ["okavango", "أوكافانجو", "Okavango", "suv", ["GF"]], ["emgrand", "إمجراند", "Emgrand", "sedan", ["GF"]], ["tugella", "توجيلا", "Tugella", "suv", ["GF"]], ["geometry-c", "جيومتري سي", "Geometry C", "suv", ["Standard"]]],
  jetour: [["x70", "إكس 70", "X70", "suv", ["Comfort", "Luxury"]], ["x90", "إكس 90", "X90", "suv", ["Comfort", "Luxury"]], ["dashing", "داشينغ", "Dashing", "suv", ["Comfort", "Luxury"]], ["t2", "تي 2", "T2", "suv", ["Adventure"]]],
  peugeot: [["208", "208", "208", "hatch", ["Active", "Allure", "GT"]], ["3008", "3008", "3008", "suv", ["Active", "Allure", "GT"]], ["5008", "5008", "5008", "suv", ["Active", "Allure", "GT"]], ["2008", "2008", "2008", "suv", ["Active", "Allure"]], ["508", "508", "508", "sedan", ["Allure", "GT"]], ["partner", "بارتنر", "Partner", "van", ["Active"]], ["landtrek", "لاندتريك", "Landtrek", "pickup", ["Allure"]]],
  volvo: [["xc40", "إكس سي 40", "XC40", "suv", ["Core", "Plus", "Ultra"]], ["xc60", "إكس سي 60", "XC60", "suv", ["Core", "Plus", "Ultra"]], ["xc90", "إكس سي 90", "XC90", "suv", ["Core", "Plus", "Ultra"]], ["s60", "إس 60", "S60", "sedan", ["Core", "Plus"]], ["s90", "إس 90", "S90", "sedan", ["Core", "Plus", "Ultra"]], ["c40", "سي 40", "C40", "suv", ["Plus", "Ultimate"]], ["ex30", "إي إكس 30", "EX30", "suv", ["Core", "Plus"]], ["ex90", "إي إكس 90", "EX90", "suv", ["Plus", "Ultra"]]],
  jaguar: [["f-pace", "إف بيس", "F-Pace", "suv", ["S", "R-Dynamic", "SVR"]], ["e-pace", "إي بيس", "E-Pace", "suv", ["S", "R-Dynamic"]], ["i-pace", "آي بيس", "I-Pace", "suv", ["S", "HSE"]], ["xf", "إكس إف", "XF", "sedan", ["S", "R-Dynamic"]], ["f-type", "إف تايب", "F-Type", "coupe", ["R", "R-Dynamic"]]],
  maserati: [["ghibli", "غيبلي", "Ghibli", "sedan", ["GT", "Modena", "Trofeo"]], ["quattroporte", "كواتروبورتي", "Quattroporte", "sedan", ["GT", "Modena", "Trofeo"]], ["levante", "ليفانتي", "Levante", "suv", ["GT", "Modena", "Trofeo"]], ["grecale", "غريكالي", "Grecale", "suv", ["GT", "Modena", "Trofeo"]], ["mc20", "إم سي 20", "MC20", "coupe", ["Cielo", "Coupe"]], ["granturismo", "جران توريسمو", "GranTurismo", "coupe", ["Modena", "Trofeo"]]],
  fiat: [["500", "500", "500", "hatch", ["Lounge", "Sport"]], ["tipo", "تيبو", "Tipo", "sedan", ["Easy", "Lounge"]], ["doblo", "دوبلو", "Doblo", "van", ["Cargo"]], ["pulse", "بالس", "Pulse", "suv", ["Drive", "Audace"]], ["fastback", "فاست باك", "Fastback", "suv", ["Audace", "Abarth"]]],
  chery: [["tiggo-4", "تيجو 4", "Tiggo 4 Pro", "suv", ["Comfort", "Luxury"]], ["tiggo-7", "تيجو 7", "Tiggo 7 Pro", "suv", ["Comfort", "Luxury"]], ["tiggo-8", "تيجو 8", "Tiggo 8 Pro", "suv", ["Comfort", "Luxury"]], ["arrizo-5", "أريزو 5", "Arrizo 5", "sedan", ["Comfort"]], ["arrizo-8", "أريزو 8", "Arrizo 8", "sedan", ["Luxury"]], ["omoda-5", "أومودا 5", "Omoda 5", "suv", ["Comfort", "Luxury"]]],
  "great-wall": [["poer", "بوير", "Poer", "pickup", ["Comfort", "Luxury"]], ["wingle", "وينجل", "Wingle", "pickup", ["Standard"]], ["cannon", "كانون", "Cannon", "pickup", ["Comfort"]]],
  haval: [["h6", "إتش 6", "H6", "suv", ["Active", "Premium"]], ["jolion", "جوليون", "Jolion", "suv", ["Active", "Premium"]], ["dargo", "دارجو", "Dargo", "suv", ["Premium"]], ["h9", "إتش 9", "H9", "suv", ["Premium"]]],
  tank: [["300", "300", "300", "suv", ["Luxury", "Adventure"]], ["500", "500", "500", "suv", ["Luxury"]], ["700", "700", "700", "suv", ["Luxury"]]],
  gac: [["emkoo", "إمكو", "Emkoo", "suv", ["GS", "GE"]], ["emzoom", "إمزوم", "Emzoom", "suv", ["GS", "GE"]], ["gs8", "جي إس 8", "GS8", "suv", ["GE"]], ["ga8", "جي إيه 8", "GA8", "sedan", ["GE"]], ["aion-y", "أيون واي", "Aion Y", "suv", ["Standard"]], ["aion-s", "أيون إس", "Aion S", "sedan", ["Standard"]]],
  jac: [["js4", "جيه إس 4", "JS4", "suv", ["Comfort"]], ["js6", "جيه إس 6", "JS6", "suv", ["Luxury"]], ["t8", "تي 8", "T8", "pickup", ["Comfort"]], ["j7", "جيه 7", "J7", "sedan", ["Luxury"]]],
  hongqi: [["h5", "إتش 5", "H5", "sedan", ["Comfort", "Luxury"]], ["h9", "إتش 9", "H9", "sedan", ["Luxury"]], ["hs5", "إتش إس 5", "HS5", "suv", ["Comfort"]], ["hs7", "إتش إس 7", "HS7", "suv", ["Luxury"]], ["e-hs9", "إي إتش إس 9", "E-HS9", "suv", ["Premium"]]],
  baic: [["x55", "إكس 55", "X55", "suv", ["Comfort"]], ["x7", "إكس 7", "X7", "suv", ["Luxury"]], ["u5", "يو 5", "U5", "sedan", ["Comfort"]], ["bj40", "بي جيه 40", "BJ40", "suv", ["Adventure"]]],
  bentley: [["bentayga", "بنتايجا", "Bentayga", "suv", ["V8", "Azure", "Speed"]], ["flying-spur", "فلاينج سبير", "Flying Spur", "sedan", ["V8", "Azure"]], ["continental-gt", "كونتيننتال", "Continental GT", "coupe", ["V8", "Azure", "Speed"]]],
  "rolls-royce": [["ghost", "غوست", "Ghost", "sedan", ["Standard", "Black Badge"]], ["phantom", "فانتوم", "Phantom", "sedan", ["Standard", "EWB"]], ["cullinan", "كولينان", "Cullinan", "suv", ["Standard", "Black Badge"]], ["spectre", "سبيكتر", "Spectre", "coupe", ["Standard"]], ["wraith", "رايث", "Wraith", "coupe", ["Standard"]]],
  ferrari: [["roma", "روما", "Roma", "coupe", ["Coupe", "Spider"]], ["sf90", "إس إف 90", "SF90", "coupe", ["Stradale", "Spider"]], ["296", "296", "296 GTB", "coupe", ["GTB", "GTS"]], ["purosangue", "بوروسانجوي", "Purosangue", "suv", ["Standard"]], ["812", "812", "812", "coupe", ["Superfast", "GTS"]]],
  lamborghini: [["urus", "أوروس", "Urus", "suv", ["S", "Performante", "SE"]], ["huracan", "هوراكان", "Huracán", "coupe", ["Tecnica", "STO", "Sterrato"]], ["revuelto", "ريفويلتو", "Revuelto", "coupe", ["Standard"]], ["temerario", "تيميراريو", "Temerario", "coupe", ["Standard"]]],
  "alfa-romeo": [["giulia", "جوليا", "Giulia", "sedan", ["Sprint", "Veloce", "Quadrifoglio"]], ["stelvio", "ستيلفيو", "Stelvio", "suv", ["Sprint", "Veloce", "Quadrifoglio"]], ["tonale", "تونالي", "Tonale", "suv", ["Sprint", "Veloce"]], ["junior", "جونيور", "Junior", "suv", ["Ibrida", "Elettrica"]]],
  skoda: [["octavia", "أوكتافيا", "Octavia", "sedan", ["Ambition", "Style", "RS"]], ["superb", "سوبيرب", "Superb", "sedan", ["Ambition", "Style", "L&K"]], ["kodiaq", "كودياك", "Kodiaq", "suv", ["Ambition", "Style", "Sportline"]], ["karoq", "كاروك", "Karoq", "suv", ["Ambition", "Style"]], ["kamiq", "كاميك", "Kamiq", "suv", ["Ambition", "Style"]], ["enyaq", "إنياك", "Enyaq", "suv", ["60", "80", "RS"]], ["scala", "سكالا", "Scala", "hatch", ["Ambition", "Style"]]],
  citroen: [["c3", "سي 3", "C3", "hatch", ["Live", "Feel", "Shine"]], ["c4", "سي 4", "C4", "hatch", ["Feel", "Shine"]], ["c5-aircross", "سي 5 إيركروس", "C5 Aircross", "suv", ["Feel", "Shine"]], ["berlingo", "بيرلينجو", "Berlingo", "van", ["Live", "Feel"]], ["c-elysee", "سي إليزيه", "C-Elysée", "sedan", ["Live", "Feel"]]],
  opel: [["corsa", "كورسا", "Corsa", "hatch", ["Edition", "GS"]], ["astra", "أسترا", "Astra", "hatch", ["Edition", "GS"]], ["mokka", "موكا", "Mokka", "suv", ["Edition", "GS"]], ["crossland", "كروسلاند", "Crossland", "suv", ["Edition"]], ["grandland", "جراندلاند", "Grandland", "suv", ["Edition", "GS"]]],
  ssangyong: [["rexton", "ريكستون", "Rexton", "suv", ["Adventure", "Ultimate"]], ["tivoli", "تيفولي", "Tivoli", "suv", ["Adventure"]], ["korando", "كorando", "Korando", "suv", ["Adventure"]], ["musso", "موسو", "Musso", "pickup", ["Adventure", "Ultimate"]], ["torres", "توريس", "Torres", "suv", ["Adventure"]]],
  maxus: [["d60", "دي 60", "D60", "suv", ["Comfort"]], ["d90", "دي 90", "D90", "suv", ["Luxury"]], ["t60", "تي 60", "T60", "pickup", ["Comfort"]], ["t90", "تي 90", "T90", "pickup", ["Luxury"]], ["g10", "جي 10", "G10", "van", ["Standard"]], ["mifa-9", "ميفا 9", "MIFA 9", "van", ["Luxury"]]],
  exeed: [["txl", "تي إكس إل", "TXL", "suv", ["Luxury"]], ["vx", "في إكس", "VX", "suv", ["Luxury"]], ["rx", "آر إكس", "RX", "suv", ["Luxury"]], ["lx", "إل إكس", "LX", "suv", ["Comfort"]]],
  zeekr: [["001", "001", "001", "sedan", ["You", "WE"]], ["007", "007", "007", "sedan", ["You"]], ["x", "إكس", "X", "suv", ["You"]], ["009", "009", "009", "van", ["WE"]]],
  denza: [["d9", "دي 9", "D9", "van", ["EV", "DM"]], ["n7", "إن 7", "N7", "suv", ["EV"]], ["n8", "إن 8", "N8", "suv", ["EV"]]],
  voyah: [["free", "فري", "Free", "suv", ["EV", "EREV"]], ["dreamer", "دريمر", "Dreamer", "van", ["EV"]], ["passion", "باشن", "Passion", "sedan", ["EV"]]],
  seres: [["5", "5", "5", "suv", ["Standard", "Premium"]], ["7", "7", "7", "suv", ["Premium"]], ["sf5", "إس إف 5", "SF5", "suv", ["Standard"]]],
  ineos: [["grenadier", "غرينادير", "Grenadier", "suv", ["Trialmaster", "Fieldmaster"]], ["quartermaster", "كوارترماستر", "Quartermaster", "pickup", ["Trialmaster"]]],
  hummer: [["h2", "إتش 2", "H2", "suv", ["Base", "Adventure"]], ["h3", "إتش 3", "H3", "suv", ["Base", "Adventure"]], ["ev-pickup", "إي في بيك أب", "EV Pickup", "pickup", ["2X", "3X"]], ["ev-suv", "إي في دفع رباعي", "EV SUV", "suv", ["2X", "3X"]]],
  buick: [["enclave", "إنكليف", "Enclave", "suv", ["Preferred", "Avenir"]], ["envision", "إنفيجن", "Envision", "suv", ["Preferred", "Avenir"]], ["encore", "إنكور", "Encore GX", "suv", ["Preferred", "Avenir"]], ["lacrosse", "لاكروس", "LaCrosse", "sedan", ["Preferred"]]],
  proton: [["saga", "ساجا", "Saga", "sedan", ["Standard", "Premium"]], ["x50", "إكس 50", "X50", "suv", ["Executive", "Premium"]], ["x70", "إكس 70", "X70", "suv", ["Executive", "Premium"]], ["x90", "إكس 90", "X90", "suv", ["Premium"]], ["persona", "بيرسونا", "Persona", "sedan", ["Standard"]]],
  xiaomi: [["su7", "إس يو 7", "SU7", "sedan", ["Standard", "Pro", "Max"]], ["yu7", "يو 7", "YU7", "suv", ["Standard", "Pro"]]],
  "motors-212": [["t01", "تي 01", "T01", "suv", ["Standard", "Adventure"]], ["t02", "تي 02", "T02", "suv", ["Standard"]]],
  acura: [["mdx", "إم دي إكس", "MDX", "suv", ["Technology", "A-Spec", "Type S"]], ["rdx", "آر دي إكس", "RDX", "suv", ["Technology", "A-Spec"]], ["tlx", "تي إل إكس", "TLX", "sedan", ["Technology", "Type S"]], ["integra", "إنتيجرا", "Integra", "sedan", ["A-Spec", "Type S"]]],
  "aston-martin": [["dbx", "دي بي إكس", "DBX", "suv", ["DBX", "707"]], ["vantage", "فانتاج", "Vantage", "coupe", ["Base", "F1"]], ["db12", "دي بي 12", "DB12", "coupe", ["Coupe", "Volante"]], ["dbs", "دي بي إس", "DBS", "coupe", ["770 Ultimate"]]],
  mclaren: [["artura", "أرتورا", "Artura", "coupe", ["Standard", "Spider"]], ["720s", "720إس", "720S", "coupe", ["Coupe", "Spider"]], ["gt", "جي تي", "GT", "coupe", ["Standard"]], ["750s", "750إس", "750S", "coupe", ["Coupe", "Spider"]]],
  bugatti: [["chiron", "شيرون", "Chiron", "coupe", ["Standard", "Sport"]], ["veyron", "فيرون", "Veyron", "coupe", ["16.4"]], ["tourait", "توربيون", "Tourbillon", "coupe", ["Standard"]]],
  seat: [["leon", "ليون", "Leon", "hatch", ["FR", "Cupra"]], ["ateca", "أتيكا", "Ateca", "suv", ["Style", "FR"]], ["ibiza", "إبيزا", "Ibiza", "hatch", ["Style", "FR"]], ["tarraco", "تاراكو", "Tarraco", "suv", ["Style", "FR"]]],
  cupra: [["formentor", "فورمينتور", "Formentor", "suv", ["V", "VZ"]], ["leon", "ليون", "Leon", "hatch", ["V", "VZ"]], ["tavascan", "تافاسكان", "Tavascan", "suv", ["Endurance", "V"]], ["born", "بورن", "Born", "hatch", ["V"]]],
  dacia: [["duster", "داستر", "Duster", "suv", ["Essential", "Expression"]], ["sandero", "سانديرو", "Sandero", "hatch", ["Essential", "Expression"]], ["jogger", "جوغر", "Jogger", "suv", ["Expression"]], ["bigster", "بيغستر", "Bigster", "suv", ["Expression"]]],
  rivian: [["r1t", "آر 1 تي", "R1T", "pickup", ["Explore", "Adventure"]], ["r1s", "آر 1 إس", "R1S", "suv", ["Explore", "Adventure"]], ["r2", "آر 2", "R2", "suv", ["Standard"]]],
  lucid: [["air", "إير", "Air", "sedan", ["Pure", "Touring", "Grand Touring"]], ["gravity", "غرافيتي", "Gravity", "suv", ["Touring", "Grand Touring"]]],
  yamaha: [["r1", "آر 1", "YZF-R1", "moto", ["Standard", "M"]], ["r6", "آر 6", "YZF-R6", "moto", ["Standard"]], ["mt-07", "إم تي 07", "MT-07", "moto", ["Standard"]], ["mt-09", "إم تي 09", "MT-09", "moto", ["Standard", "SP"]], ["tmax", "تي ماكس", "TMAX", "moto", ["Standard"]], ["nmax", "إن ماكس", "NMAX", "moto", ["Standard"]]],
  "harley-davidson": [["sportster", "سبورتستر", "Sportster", "moto", ["S", "Nightster"]], ["street-glide", "ستريت جلايد", "Street Glide", "moto", ["Standard", "Special"]], ["road-king", "رود كينج", "Road King", "moto", ["Standard"]], ["fat-boy", "فات بوي", "Fat Boy", "moto", ["Standard"]], ["pan-america", "بان أمريكا", "Pan America", "moto", ["Special"]]],
  kawasaki: [["ninja-650", "نينجا 650", "Ninja 650", "moto", ["Standard"]], ["ninja-zx10r", "نينجا زد إكس 10 آر", "Ninja ZX-10R", "moto", ["Standard", "KRT"]], ["z900", "زد 900", "Z900", "moto", ["Standard"]], ["versys", "فيرسيس", "Versys", "moto", ["650", "1000"]], ["klx", "كي إل إكس", "KLX", "moto", ["230", "300"]]],
  ktm: [["390-duke", "390 دوك", "390 Duke", "moto", ["Standard"]], ["1290-super-duke", "1290 سوبر دوك", "1290 Super Duke", "moto", ["R", "Evo"]], ["adventure-890", "أدفنتشر 890", "890 Adventure", "moto", ["Standard", "R"]], ["rc-390", "آر سي 390", "RC 390", "moto", ["Standard"]]],
  "royal-enfield": [["classic-350", "كلاسيك 350", "Classic 350", "moto", ["Standard", "Chrome"]], ["hunter-350", "هنتر 350", "Hunter 350", "moto", ["Retro", "Metro"]], ["himalayan", "هيمالايان", "Himalayan", "moto", ["Standard"]], ["interceptor", "إنترسبتور", "Interceptor 650", "moto", ["Standard"]], ["gt-650", "جي تي 650", "Continental GT 650", "moto", ["Standard"]]],
  triumph: [["street-triple", "ستريت تريبل", "Street Triple", "moto", ["R", "RS"]], ["speed-triple", "سبيد تريبل", "Speed Triple", "moto", ["RS"]], ["bonneville", "بونيفيل", "Bonneville", "moto", ["T100", "T120"]], ["tiger", "تايجر", "Tiger", "moto", ["900", "1200"]], ["trident", "ترايدنت", "Trident 660", "moto", ["Standard"]]],
  "can-am": [["spyder", "سبايدر", "Spyder", "moto", ["F3", "RT"]], ["ryker", "رايكر", "Ryker", "moto", ["600", "900"]], ["maverick", "مافريك", "Maverick", "moto", ["X3", "Sport"]], ["outlander", "آوتلاندر", "Outlander", "moto", ["450", "850"]]],
  polaris: [["rzr", "آر زد آر", "RZR", "moto", ["Trail", "Pro"]], ["ranger", "رينجر", "Ranger", "moto", ["XP", "Crew"]], ["general", "جنرال", "General", "moto", ["XP"]], ["slingshot", "سلنج شوت", "Slingshot", "moto", ["SL", "R"]], ["sportsman", "سبورتسمان", "Sportsman", "moto", ["570", "850"]]],
  indian: [["scout", "سكاوت", "Scout", "moto", ["Standard", "Bobber"]], ["chief", "تشيف", "Chief", "moto", ["Dark Horse", "Bobber"]], ["challenger", "تشالنجر", "Challenger", "moto", ["Dark Horse"]], ["roadmaster", "رودماستر", "Roadmaster", "moto", ["Limited"]]],
  bajaj: [["pulsar", "بولسار", "Pulsar", "moto", ["150", "200", "NS400"]], ["dominar", "دومينار", "Dominar", "moto", ["250", "400"]], ["avenger", "أفينجر", "Avenger", "moto", ["160", "220"]], ["chetak", "شيتاك", "Chetak", "moto", ["Premium"]]],
  tvs: [["apache", "أباتشي", "Apache", "moto", ["160", "200", "RR 310"]], ["ntorq", "إن تورك", "Ntorq", "moto", ["125"]], ["jupiter", "جوبيتر", "Jupiter", "moto", ["Standard"]], ["ronin", "رونين", "Ronin", "moto", ["Standard"]]],
  benelli: [["trk-502", "تي آر كي 502", "TRK 502", "moto", ["Standard", "X"]], ["leoncino", "ليونشينو", "Leoncino", "moto", ["500"]], ["502c", "502 سي", "502C", "moto", ["Standard"]], ["tnt", "تي إن تي", "TNT", "moto", ["135", "600"]]],
  "moto-guzzi": [["v7", "في 7", "V7", "moto", ["Stone", "Special"]], ["v85", "في 85", "V85 TT", "moto", ["Standard"]], ["v100", "في 100", "V100 Mandello", "moto", ["Standard"]]],
  cfmoto: [["800mt", "800 إم تي", "800MT", "moto", ["Sport", "Touring"]], ["700cl-x", "700 سي إل إكس", "700CL-X", "moto", ["Sport", "Heritage"]], ["450ss", "450 إس إس", "450SS", "moto", ["Standard"]], ["250nk", "250 إن كيه", "250NK", "moto", ["Standard"]]],
  kymco: [["ak-550", "إيه كيه 550", "AK 550", "moto", ["Standard"]], ["x-town", "إكس تاون", "X-Town", "moto", ["300i"]], ["like", "لايك", "Like", "moto", ["150"]], ["agility", "أجيليتي", "Agility", "moto", ["16+"]]],
  sym: [["maxsym", "ماكس سيم", "Maxsym", "moto", ["400", "TL"]], ["jet", "جيت", "Jet", "moto", ["14", "X"]], ["fiddle", "فيدل", "Fiddle", "moto", ["125"]], ["cruisy", "كروزي", "Cruisym", "moto", ["300"]]],
  other: [["custom", "مخصص", "Custom / Other", "sedan", ["Base"]], ["kit", "معدل", "Modified / Kit", "coupe", ["Custom"]]],
};

Object.assign(CATALOG, EXTRA);

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "BHDCarsCatalogBot/1.0 (marketplace demo; contact: local)",
          Accept: "application/json,image/*,*/*",
        },
        timeout: 20000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, url).toString()).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks) }));
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

async function resolveThumb(makeEn, modelEn, cache) {
  const key = `${makeEn} ${modelEn}`.toLowerCase();
  if (cache[key]) return cache[key];

  const titles = [
    `${makeEn} ${modelEn}`,
    modelEn.includes(makeEn) ? modelEn : null,
  ].filter(Boolean);

  for (const title of titles) {
    try {
      const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=640&pilicense=any&redirects=1&titles=${encodeURIComponent(title)}`;
      const { status, buf } = await get(api);
      if (status !== 200) continue;
      const json = JSON.parse(buf.toString("utf8"));
      const pages = Object.values(json.query?.pages || {});
      const thumb = pages[0]?.thumbnail?.source;
      if (thumb && !/disambig|question_mark|Wiki_letter/i.test(thumb)) {
        cache[key] = thumb;
        return thumb;
      }
    } catch {
      /* next */
    }
    await sleep(200);
  }
  cache[key] = null;
  return null;
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

(async () => {
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
  const result = {};
  let resolved = 0;
  let fallback = 0;
  const makeIds = Object.keys(CATALOG);

  for (const makeId of makeIds) {
    const makeEn = makeEnFromId(makeId);
    result[makeId] = [];
    for (const [id, ar, en, body, trims] of CATALOG[makeId]) {
      let image = null;
      // Prefer already downloaded local file
      for (const ext of [".jpg", ".png", ".webp"]) {
        const local = path.join(process.cwd(), "public", "models", `${makeId}--${id}${ext}`);
        if (fs.existsSync(local) && fs.statSync(local).size > 1000) {
          image = `/models/${makeId}--${id}${ext}`;
          break;
        }
      }
      if (!image) {
        const thumb = await resolveThumb(makeEn, en, cache);
        if (thumb) {
          image = thumb;
          resolved++;
        } else {
          image = BODY_FALLBACK[body] || BODY_FALLBACK.sedan;
          fallback++;
        }
        await sleep(250);
      } else {
        resolved++;
      }
      result[makeId].push({ id, name: { ar, en }, body, image, trims });
      if ((resolved + fallback) % 25 === 0) {
        fs.writeFileSync(CACHE, JSON.stringify(cache));
        console.log("progress", resolved, "resolved", fallback, "fallback");
      }
    }
  }

  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  const total = Object.values(result).reduce((a, m) => a + m.length, 0);
  console.log("DONE makes=" + makeIds.length + " models=" + total + " wiki/local=" + resolved + " bodyFallback=" + fallback);
})();
