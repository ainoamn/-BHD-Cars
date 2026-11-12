import { describe, expect, it } from "vitest";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
const isDisposable =
  /localhost|127\.0\.0\.1|:5432|bhd.?cars.?test|test/i.test(databaseUrl) &&
  !/prod|production/i.test(databaseUrl);

describe.skipIf(!isDisposable)("integration · PostgreSQL scaffold (BHD-003)", () => {
  it("placeholder: migrate + seed + wipe on disposable DATABASE_URL only", () => {
    expect(databaseUrl.length).toBeGreaterThan(0);
  });
});

describe("integration · guardrails", () => {
  it("does not run destructive DB tests without an explicit disposable DATABASE_URL", () => {
    if (!databaseUrl) {
      expect(isDisposable).toBe(false);
      return;
    }
    expect(isDisposable || /test/i.test(databaseUrl)).toBe(true);
  });
});
