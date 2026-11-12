import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home responds in Arabic shell", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveTitle(/BHD|سيارات|Cars/i);
  });

  test("cars market page loads", async ({ page }) => {
    await page.goto("/cars");
    await expect(page.locator("body")).toBeVisible();
  });
});
