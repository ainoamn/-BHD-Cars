import { describe, expect, it } from "vitest";
import { financeOffers, monthlyPayment } from "@/lib/quotes";
import type { Bank } from "@/lib/types";

const banks: Bank[] = [
  {
    id: "demo-a",
    name: { ar: "بنك أ", en: "Bank A" },
    apr: 6,
    minDown: 20,
    maxYears: 5,
    note: { ar: "", en: "" },
  },
  {
    id: "demo-b",
    name: { ar: "بنك ب", en: "Bank B" },
    apr: 7.5,
    minDown: 10,
    maxYears: 7,
    note: { ar: "", en: "" },
  },
];

describe("finance business rules (unit harness)", () => {
  it("computes a stable monthly payment for fixed inputs", () => {
    const monthly = monthlyPayment(10_000, 6, 5);
    expect(monthly).toBeGreaterThan(0);
    expect(Number(monthly.toFixed(3))).toBe(193.328);
  });

  it("filters banks that reject term or down payment", () => {
    const offers = financeOffers(banks, 12_000, 15, 6);
    expect(offers.map((item) => item.bank.id)).toEqual(["demo-b"]);
  });

  it("fails CI when principal math regresses (guard)", () => {
    const offers = financeOffers(banks, 10_000, 20, 5);
    expect(offers[0]?.principal).toBe(8_000);
    expect(offers[0]?.down).toBe(2_000);
  });
});
