import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export type OmanCity = { id: string; name: Copy };
export type OmanRegion = { id: string; name: Copy; cities: OmanCity[] };

export const omanRegions: OmanRegion[] = [
  {
    id: "muscat",
    name: L("مسقط", "Muscat"),
    cities: [
      { id: "muscat", name: L("مسقط", "Muscat") },
      { id: "seeb", name: L("السيب", "Seeb") },
      { id: "bausher", name: L("بوشر", "Bausher") },
      { id: "al-khoud", name: L("الخوض", "Al Khoud") },
      { id: "al-mawaleh", name: L("المعبيلة", "Al Mawaleh") },
      { id: "muttrah", name: L("مطرح", "Muttrah") },
      { id: "amerat", name: L("العامرات", "Al Amerat") },
    ],
  },
  {
    id: "batinah-north",
    name: L("شمال الباطنة", "Al Batinah North"),
    cities: [
      { id: "sohar", name: L("صحار", "Sohar") },
      { id: "liwa", name: L("لوى", "Liwa") },
      { id: "shinas", name: L("شناص", "Shinas") },
      { id: "saham", name: L("صحم", "Saham") },
    ],
  },
  {
    id: "batinah-south",
    name: L("جنوب الباطنة", "Al Batinah South"),
    cities: [
      { id: "rustaq", name: L("الرستاق", "Rustaq") },
      { id: "barka", name: L("بركاء", "Barka") },
      { id: "musannah", name: L("المصنعة", "Al Musannah") },
      { id: "nakhal", name: L("نخل", "Nakhal") },
    ],
  },
  {
    id: "dhahirah",
    name: L("الظاهرة", "Ad Dhahirah"),
    cities: [
      { id: "ibri", name: L("عبري", "Ibri") },
      { id: "yanqul", name: L("ينقل", "Yanqul") },
      { id: "dhank", name: L("ضنك", "Dhank") },
    ],
  },
  {
    id: "dakhiliyah",
    name: L("الداخلية", "Ad Dakhiliyah"),
    cities: [
      { id: "nizwa", name: L("نزوى", "Nizwa") },
      { id: "bahla", name: L("بهلاء", "Bahla") },
      { id: "samail", name: L("سمائل", "Samail") },
      { id: "izki", name: L("إزكي", "Izki") },
    ],
  },
  {
    id: "sharqiyah-north",
    name: L("شمال الشرقية", "Ash Sharqiyah North"),
    cities: [
      { id: "ibra", name: L("إبراء", "Ibra") },
      { id: "bidiyah", name: L("بدية", "Bidiyah") },
      { id: "mudhaibi", name: L("المضيبي", "Al Mudhaibi") },
    ],
  },
  {
    id: "sharqiyah-south",
    name: L("جنوب الشرقية", "Ash Sharqiyah South"),
    cities: [
      { id: "sur", name: L("صور", "Sur") },
      { id: "jaalan", name: L("جعلان", "Ja'alan") },
      { id: "masirah", name: L("مصيرة", "Masirah") },
    ],
  },
  {
    id: "dhofar",
    name: L("ظفار", "Dhofar"),
    cities: [
      { id: "salalah", name: L("صلالة", "Salalah") },
      { id: "taqah", name: L("طاقة", "Taqah") },
      { id: "mirbat", name: L("مرباط", "Mirbat") },
    ],
  },
  {
    id: "buraimi",
    name: L("البريمي", "Al Buraimi"),
    cities: [
      { id: "al-buraimi", name: L("البريمي", "Al Buraimi") },
      { id: "mahda", name: L("محضة", "Mahda") },
    ],
  },
  {
    id: "wusta",
    name: L("الوسطى", "Al Wusta"),
    cities: [
      { id: "haima", name: L("هيما", "Haima") },
      { id: "duqm", name: L("الدقم", "Duqm") },
    ],
  },
  {
    id: "musandam",
    name: L("مسندم", "Musandam"),
    cities: [
      { id: "khasab", name: L("خصب", "Khasab") },
      { id: "bukha", name: L("بخاء", "Bukha") },
    ],
  },
];

export function regionForCity(cityEn: string, cityAr?: string) {
  const en = cityEn.toLowerCase();
  const ar = cityAr ?? "";
  return omanRegions.find((region) =>
    region.cities.some(
      (city) =>
        city.name.en.toLowerCase() === en ||
        city.name.ar === ar ||
        en.includes(city.name.en.toLowerCase()) ||
        ar.includes(city.name.ar),
    ),
  );
}
