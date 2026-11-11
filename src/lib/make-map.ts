import { allMakes } from "./makes-full";

/** Map marketplace listing make labels → catalog make ids (for real logos). */
const ALIASES: Record<string, string> = {
  "mercedes-benz": "mercedes",
  mercedes: "mercedes",
  "land rover": "land-rover",
  landrover: "land-rover",
  "range rover": "land-rover",
  vw: "volkswagen",
  "volkswagen": "volkswagen",
  bmw: "bmw",
  byd: "byd",
  "rolls-royce": "rolls-royce",
  "rolls royce": "rolls-royce",
  "alfa romeo": "alfa-romeo",
  "great wall": "great-wall",
  gwm: "great-wall",
  "harley-davidson": "harley-davidson",
  "harley davidson": "harley-davidson",
  ssangyong: "ssangyong",
  "kg mobility": "ssangyong",
};

export function makeIdFromLabel(label: string): string | null {
  const key = label.trim().toLowerCase();
  if (ALIASES[key]) return ALIASES[key];
  const direct = allMakes.find(
    (item) =>
      item.id === key ||
      item.name.en.toLowerCase() === key ||
      item.name.ar === label.trim() ||
      item.name.en.toLowerCase().replace(/-/g, " ") === key,
  );
  return direct?.id ?? null;
}

export function makeLabelFromId(id: string): string {
  const found = allMakes.find((item) => item.id === id);
  return found?.name.en ?? id;
}

/** Popular makes shown first in logo grids (Sooq-style). */
export const popularMakeIds = [
  "toyota",
  "nissan",
  "lexus",
  "mercedes",
  "honda",
  "hyundai",
  "jeep",
  "chevrolet",
  "ford",
  "bmw",
  "land-rover",
  "porsche",
  "byd",
  "kia",
  "mitsubishi",
  "gmc",
] as const;
