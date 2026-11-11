import type { Bank, Insurer } from "./types";

export function monthlyPayment(principal: number, apr: number, years: number) {
  const n = years * 12;
  const r = apr / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

export function financeOffers(
  banks: Bank[],
  priceOmr: number,
  downPercent: number,
  years: number,
) {
  const down = priceOmr * (downPercent / 100);
  const principal = Math.max(priceOmr - down, 0);
  return banks
    .filter((bank) => years <= bank.maxYears && downPercent + 0.01 >= bank.minDown)
    .map((bank) => {
      const monthly = monthlyPayment(principal, bank.apr, years);
      return {
        bank,
        principal,
        down,
        monthly,
        total: monthly * years * 12,
      };
    })
    .sort((a, b) => a.monthly - b.monthly);
}

export type Cover = "tpl" | "comp" | "border";

export function insuranceQuotes(
  insurers: Insurer[],
  input: { valueOmr: number; year: number; cover: Cover },
) {
  const age = Math.max(0, 2026 - input.year);
  return insurers
    .map((insurer) => {
      let price = 0;
      if (input.cover === "border") price = 14 + insurer.factor * 8;
      else if (input.cover === "tpl") price = 36 + age * 1.4 + insurer.factor * 18;
      else price = Math.max(90, input.valueOmr * (0.017 + insurer.factor * 0.006) + age * 2);
      return {
        insurer,
        priceOmr: Math.round(price),
        excessOmr: input.cover === "comp" ? insurer.excessOmr : 0,
      };
    })
    .sort((a, b) => a.priceOmr - b.priceOmr);
}

export function marketPosition(price: number, market: number) {
  const delta = (price - market) / market;
  if (delta <= -0.04) return "below" as const;
  if (delta >= 0.04) return "above" as const;
  return "fair" as const;
}
