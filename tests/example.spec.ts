import { test, expect } from "@playwright/test";

test("should see 'Hello World!'", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");
  // The new page should contain an h1 with "Hello World!"
  await expect(page.locator("h1")).toContainText("Hello World!");
});
