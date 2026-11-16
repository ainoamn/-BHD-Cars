import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export type OmanPlace = { id: string; name: Copy };
export type OmanWilayat = OmanPlace & { villages: OmanPlace[] };
export type OmanGovernorate = OmanPlace & { wilayats: OmanWilayat[] };

function v(id: string, ar: string, en: string): OmanPlace {
  return { id, name: L(ar, en) };
}

function w(id: string, ar: string, en: string, villages: OmanPlace[]): OmanWilayat {
  return { id, name: L(ar, en), villages };
}

/** Full Oman hierarchy for listing location: محافظة → ولاية → قرية/منطقة. */
export const omanGovernorates: OmanGovernorate[] = [
  {
    id: "muscat",
    name: L("مسقط", "Muscat"),
    wilayats: [
      w("muscat-city", "مسقط", "Muscat", [
        v("ruwi", "روي", "Ruwi"),
        v("wadi-kabir", "وادي كبير", "Wadi Kabir"),
        v("hamriya", "الحمرية", "Al Hamriya"),
        v("wattayah", "الوطية", "Wattayah"),
        v("qurm", "القرم", "Qurum"),
        v("madinat-qaboos", "مدينة سلطان قابوس", "Madinat Sultan Qaboos"),
        v("shati-qurm", "شاطئ القرم", "Shati Al Qurum"),
      ]),
      w("muttrah", "مطرح", "Muttrah", [
        v("muttrah-souq", "سوق مطرح", "Muttrah Souq"),
        v("corniche", "الكورنيش", "Corniche"),
        v("darsait", "دارسيت", "Darsait"),
        v("sidab", "سيداب", "Sidab"),
        v("kalbuh", "كلبو", "Kalbuh"),
      ]),
      w("bausher", "بوشر", "Bausher", [
        v("ghala", "غلا", "Ghala"),
        v("ghubrah", "الغبرة", "Al Ghubrah"),
        v("khuwair", "الخوير", "Al Khuwair"),
        v("aathiba", "العذيبة", "Al Athaiba"),
        v("sarooj", "الساروج", "Sarooj"),
        v("bausher-heights", "مرتفعات بوشر", "Bausher Heights"),
      ]),
      w("seeb", "السيب", "Seeb", [
        v("mawaleh", "المعبيلة", "Al Mawaleh"),
        v("khoud", "الخوض", "Al Khoud"),
        v("maabela-south", "المعبيلة الجنوبية", "Mawaleh South"),
        v("maabela-north", "المعبيلة الشمالية", "Mawaleh North"),
        v("hallat-al-sud", "حلة السود", "Hallat Al Sud"),
        v("mabela", "المبيلة", "Mabela"),
        v("airport-heights", "مرتفعات المطار", "Airport Heights"),
      ]),
      w("amerat", "العامرات", "Al Amerat", [
        v("amerat-center", "وسط العامرات", "Al Amerat Center"),
        v("maya", "مياح", "Maya"),
        v("yiti", "يتي", "Yiti"),
      ]),
      w("qurayyat", "قريات", "Qurayyat", [
        v("qurayyat-center", "وسط قريات", "Qurayyat Center"),
        v("dibab", "دباب", "Dibab"),
        v("fins", "فنس", "Fins"),
      ]),
    ],
  },
  {
    id: "batinah-north",
    name: L("شمال الباطنة", "Al Batinah North"),
    wilayats: [
      w("sohar", "صحار", "Sohar", [
        v("sohar-center", "وسط صحار", "Sohar Center"),
        v("falaj-al-qabail", "فلج القبائل", "Falaj Al Qabail"),
        v("majis", "مجس", "Majis"),
        v("al-humaidah", "الحميدة", "Al Humaidah"),
        v("industrial", "المنطقة الصناعية", "Industrial Area"),
      ]),
      w("liwa", "لوى", "Liwa", [v("liwa-center", "وسط لوى", "Liwa Center"), v("al-khabourah-border", "حدود الخابورة", "Khabourah border")]),
      w("shinas", "شناص", "Shinas", [v("shinas-center", "وسط شناص", "Shinas Center"), v("aswad", "أسود", "Aswad")]),
      w("saham", "صحم", "Saham", [v("saham-center", "وسط صحم", "Saham Center"), v("al-khuwayriyah", "الخويرية", "Al Khuwayriyah")]),
      w("khabourah", "الخابورة", "Al Khabourah", [v("khabourah-center", "وسط الخابورة", "Al Khabourah Center")]),
      w("suwaiq", "السويق", "As Suwaiq", [v("suwaiq-center", "وسط السويق", "Suwaiq Center"), v("tharmad", "ثرمد", "Tharmad")]),
    ],
  },
  {
    id: "batinah-south",
    name: L("جنوب الباطنة", "Al Batinah South"),
    wilayats: [
      w("rustaq", "الرستاق", "Rustaq", [v("rustaq-center", "وسط الرستاق", "Rustaq Center"), v("wadi-sahtan", "وادي ساحتن", "Wadi Sahtan")]),
      w("barka", "بركاء", "Barka", [v("barka-center", "وسط بركاء", "Barka Center"), v("al-hail", "الحيل", "Al Hail"), v("al-rumais", "الرميس", "Al Rumais")]),
      w("musannah", "المصنعة", "Al Musannah", [v("musannah-center", "وسط المصنعة", "Al Musannah Center")]),
      w("nakhal", "نخل", "Nakhal", [v("nakhal-center", "وسط نخل", "Nakhal Center"), v("wadi-bani-auf", "وادي بني عوف", "Wadi Bani Auf")]),
      w("wadi-maawil", "وادي المعاول", "Wadi Al Maawil", [v("maawil-center", "وسط المعاول", "Al Maawil Center")]),
      w("awabi", "العوابي", "Al Awabi", [v("awabi-center", "وسط العوابي", "Al Awabi Center")]),
    ],
  },
  {
    id: "dakhiliyah",
    name: L("الداخلية", "Ad Dakhiliyah"),
    wilayats: [
      w("nizwa", "نزوى", "Nizwa", [v("nizwa-center", "وسط نزوى", "Nizwa Center"), v("farq", "فرق", "Farq"), v("tanuf", "تنوف", "Tanuf")]),
      w("bahla", "بهلاء", "Bahla", [v("bahla-center", "وسط بهلاء", "Bahla Center"), v("jabreen", "جبرين", "Jabreen")]),
      w("manah", "منح", "Manah", [v("manah-center", "وسط منح", "Manah Center")]),
      w("hamra", "الحمراء", "Al Hamra", [v("hamra-center", "وسط الحمراء", "Al Hamra Center"), v("misfat", "مسفاة العبريين", "Misfat Al Abriyeen")]),
      w("adam", "أدم", "Adam", [v("adam-center", "وسط أدم", "Adam Center")]),
      w("izki", "إزكي", "Izki", [v("izki-center", "وسط إزكي", "Izki Center")]),
      w("samail", "سمائل", "Samail", [v("samail-center", "وسط سمائل", "Samail Center")]),
      w("bidbid", "بدبد", "Bidbid", [v("bidbid-center", "وسط بدبد", "Bidbid Center")]),
    ],
  },
  {
    id: "sharqiyah-north",
    name: L("شمال الشرقية", "Ash Sharqiyah North"),
    wilayats: [
      w("ibra", "إبراء", "Ibra", [v("ibra-center", "وسط إبراء", "Ibra Center"), v("al-yahmadi", "اليحمدي", "Al Yahmadi")]),
      w("mudhaibi", "المضيبي", "Al Mudhaibi", [v("mudhaibi-center", "وسط المضيبي", "Al Mudhaibi Center")]),
      w("bidiyah", "بدية", "Bidiyah", [v("bidiyah-center", "وسط بدية", "Bidiyah Center")]),
      w("qabil", "القابل", "Al Qabil", [v("qabil-center", "وسط القابل", "Al Qabil Center")]),
      w("wadi-bani-khalid", "وادي بني خالد", "Wadi Bani Khalid", [v("wbk-center", "وسط وادي بني خالد", "Wadi Bani Khalid Center")]),
      w("dima-tayeen", "دماء والطائيين", "Dima Wa At Tayeen", [v("dima-center", "وسط دماء", "Dima Center")]),
    ],
  },
  {
    id: "sharqiyah-south",
    name: L("جنوب الشرقية", "Ash Sharqiyah South"),
    wilayats: [
      w("sur", "صور", "Sur", [v("sur-center", "وسط صور", "Sur Center"), v("ayjah", "عيجاة", "Ayjah"), v("ras-al-hadd", "رأس الحد", "Ras Al Hadd")]),
      w("kamil-wafi", "الكامل والوافي", "Al Kamil Wal Wafi", [v("kamil-center", "وسط الكامل", "Al Kamil Center")]),
      w("jalan-hassan", "جعلان بني بو حسن", "Jalan Bani Bu Hassan", [v("jbh-center", "وسط جعلان بني بو حسن", "JBBH Center")]),
      w("jalan-ali", "جعلان بني بو علي", "Jalan Bani Bu Ali", [v("jba-center", "وسط جعلان بني بو علي", "JBBA Center")]),
      w("masirah", "مصيرة", "Masirah", [v("masirah-center", "وسط مصيرة", "Masirah Center")]),
    ],
  },
  {
    id: "dhahirah",
    name: L("الظاهرة", "Ad Dhahirah"),
    wilayats: [
      w("ibri", "عبري", "Ibri", [v("ibri-center", "وسط عبري", "Ibri Center"), v("bat", "بات", "Bat")]),
      w("yanqul", "ينقل", "Yanqul", [v("yanqul-center", "وسط ينقل", "Yanqul Center")]),
      w("dhank", "ضنك", "Dhank", [v("dhank-center", "وسط ضنك", "Dhank Center")]),
    ],
  },
  {
    id: "buraimi",
    name: L("البريمي", "Al Buraimi"),
    wilayats: [
      w("al-buraimi", "البريمي", "Al Buraimi", [v("buraimi-center", "وسط البريمي", "Al Buraimi Center"), v("hamasa", "حماسة", "Hamasa")]),
      w("mahda", "محضة", "Mahda", [v("mahda-center", "وسط محضة", "Mahda Center")]),
      w("sunaynah", "السنينة", "As Sunaynah", [v("sunaynah-center", "وسط السنينة", "As Sunaynah Center")]),
    ],
  },
  {
    id: "wusta",
    name: L("الوسطى", "Al Wusta"),
    wilayats: [
      w("haima", "هيما", "Haima", [v("haima-center", "وسط هيما", "Haima Center")]),
      w("duqm", "الدقم", "Duqm", [v("duqm-center", "وسط الدقم", "Duqm Center"), v("duqm-port", "ميناء الدقم", "Duqm Port")]),
      w("mahout", "محوت", "Mahout", [v("mahout-center", "وسط محوت", "Mahout Center")]),
      w("jazer", "الجازر", "Al Jazer", [v("jazer-center", "وسط الجازر", "Al Jazer Center")]),
    ],
  },
  {
    id: "dhofar",
    name: L("ظفار", "Dhofar"),
    wilayats: [
      w("salalah", "صلالة", "Salalah", [
        v("salalah-center", "وسط صلالة", "Salalah Center"),
        v("awqad", "عوقد", "Awqad"),
        v("dahariz", "دهاريز", "Dahariz"),
        v("salalah-hills", "مرتفعات صلالة", "Salalah Hills"),
      ]),
      w("taqah", "طاقة", "Taqah", [v("taqah-center", "وسط طاقة", "Taqah Center")]),
      w("mirbat", "مرباط", "Mirbat", [v("mirbat-center", "وسط مرباط", "Mirbat Center")]),
      w("rakhyut", "رخيوت", "Rakhyut", [v("rakhyut-center", "وسط رخيوت", "Rakhyut Center")]),
      w("thumrait", "ثمريت", "Thumrait", [v("thumrait-center", "وسط ثمريت", "Thumrait Center")]),
      w("dhalkut", "ضلكوت", "Dhalkut", [v("dhalkut-center", "وسط ضلكوت", "Dhalkut Center")]),
      w("mazyona", "المزيونة", "Al Mazyona", [v("mazyona-center", "وسط المزيونة", "Al Mazyona Center")]),
      w("muqshin", "مقشن", "Muqshin", [v("muqshin-center", "وسط مقشن", "Muqshin Center")]),
      w("shalim", "شليم وجزر الحلانيات", "Shalim and Hallaniyat", [v("shalim-center", "وسط شليم", "Shalim Center")]),
    ],
  },
  {
    id: "musandam",
    name: L("مسندم", "Musandam"),
    wilayats: [
      w("khasab", "خصب", "Khasab", [v("khasab-center", "وسط خصب", "Khasab Center"), v("kumzar", "كمزار", "Kumzar")]),
      w("bukha", "بخاء", "Bukha", [v("bukha-center", "وسط بخاء", "Bukha Center")]),
      w("dibba", "دبا", "Dibba", [v("dibba-center", "وسط دبا", "Dibba Center")]),
      w("madha", "مدحاء", "Madha", [v("madha-center", "وسط مدحاء", "Madha Center")]),
    ],
  },
];

export function findGovernorate(id: string) {
  return omanGovernorates.find((row) => row.id === id) || null;
}

export function findWilayat(governorateId: string, wilayatId: string) {
  return findGovernorate(governorateId)?.wilayats.find((row) => row.id === wilayatId) || null;
}

export function findVillage(governorateId: string, wilayatId: string, villageId: string) {
  return findWilayat(governorateId, wilayatId)?.villages.find((row) => row.id === villageId) || null;
}

export function locationLabel(input: {
  governorateId: string;
  wilayatId: string;
  villageId: string;
  locale: "ar" | "en";
}) {
  const g = findGovernorate(input.governorateId);
  const w = findWilayat(input.governorateId, input.wilayatId);
  const v = findVillage(input.governorateId, input.wilayatId, input.villageId);
  const pick = (c?: Copy) => (c ? (input.locale === "ar" ? c.ar : c.en) : "");
  return [pick(v?.name), pick(w?.name), pick(g?.name)].filter(Boolean).join(" · ");
}
