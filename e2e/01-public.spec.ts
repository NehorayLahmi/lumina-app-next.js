import { expect, test } from "@playwright/test";
import { E2E } from "./fixture";

const landingPath = `/${E2E.pro.profession}/${E2E.pro.city}`;

test.describe("דפים ציבוריים — גולש לא מחובר", () => {
  test("דף נחיתה נפתח בלי התחברות ומציג את הטופס", async ({ page }) => {
    const res = await page.goto(landingPath);
    expect(res?.status()).toBe(200);
    expect(page.url()).not.toContain("/login");
    await expect(page.getByText(E2E.page.mainTitle).first()).toBeVisible();
    await expect(page.locator("#lead-full-name")).toBeVisible();
    await expect(page.locator("#lead-phone")).toBeVisible();
  });

  test("כתובת עם אותיות גדולות מופנית לאותיות קטנות", async ({ page }) => {
    await page.goto(`/${E2E.pro.profession.toUpperCase()}/${E2E.pro.city}`);
    await expect(page).toHaveURL(new RegExp(`${landingPath}$`));
  });

  test("דף נחיתה שלא קיים מחזיר 404", async ({ page }) => {
    const res = await page.goto("/e2e-no-such-service/e2e-no-such-city");
    expect(res?.status()).toBe(404);
  });

  for (const path of ["/admin", "/pro/dashboard"]) {
    test(`${path} מפנה לדף ההתחברות`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`/login\\?from=${encodeURIComponent(path)}`));
    });
  }

  test("ה-webhook של טלגרם פתוח לשירותים חיצוניים (לא מופנה ל-login)", async ({ request }) => {
    const res = await request.post("/api/telegram-webhook", { data: {}, maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test("נתיבי API של אדמין חסומים לגולש לא מחובר", async ({ request }) => {
    const res = await request.get("/api/admin/stats", { maxRedirects: 0 });
    expect([401, 403]).toContain(res.status());
  });
});
