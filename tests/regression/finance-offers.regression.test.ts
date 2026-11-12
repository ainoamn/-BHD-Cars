import { describe, expect, it } from "vitest";
import { financeOffers } from "@/lib/quotes";
import type { Bank } from "@/lib/types";

/**
 * BHD-001 isolated regression (not in default CI gate).
 * Empty finance offers remain a UX edge case driven by illustrative bank seed data.
 * Later batches must replace seed banks with partner-backed offers and real eligibility.
 */
describe("regression · empty finance offers [isolated]", () => {
  it("returns an empty list when no bank accepts the constraints", () => {
    const banks: Bank[] = [
      {
        id: "strict",
        name: { ar: "صارم", en: "Strict" },
        apr: 5,
        minDown: 40,
        maxYears: 3,
        note: { ar: "", en: "" },
      },
    ];
    expect(financeOffers(banks, 20_000, 10, 7)).toEqual([]);
  });

  it.todo("partner-backed finance eligibility must not rely on static seed banks (BHD-017)");
});
