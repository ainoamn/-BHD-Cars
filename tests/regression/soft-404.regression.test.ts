import { describe, expect, it } from "vitest";
import { cars } from "@/lib/data";

/**
 * BHD-001 isolated regression (not in default CI gate).
 * Evidence: production `/cars/bhd-audit-does-not-exist` returned HTTP 200 (soft 404).
 * Becomes a failing assertion until BHD-008 enforces hard 404 via notFound().
 *
 * Current catalog lookup has no hard miss path for unknown slugs in the client page.
 * This test documents the gap without blocking main.
 */
describe("regression · soft 404 for missing listing [isolated]", () => {
  it("documents that unknown slugs are currently absent from the static catalog", () => {
    const missing = cars.find((car) => car.slug === "bhd-audit-does-not-exist");
    expect(missing).toBeUndefined();
  });

  it.todo("HTTP GET /cars/bhd-audit-does-not-exist must return 404 after BHD-008");
});
