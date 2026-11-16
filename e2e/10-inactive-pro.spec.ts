import { expect, test } from "@playwright/test";
import { E2E, ids } from "./fixture";
import { backendLogin, type BackendClient, type CallRow } from "./helpers";

/**
 * נציג כבוי: כפתורי החיוג וה-WhatsApp בדף הנחיתה מפנים למספר של המנהל,
 * כך שהנציג לא מקבל פניות בזמן שהוא כבוי.
 */
const landingPath = `/${E2E.pro.profession}/${E2E.pro.city}`;
const fallbackDigits = E2E.adminFallbackPhone.replace(/\D/g, ""); // 972509990099
let admin: BackendClient;

async function setActive(active: boolean) {
  const pros = await admin.get<{ id: string; isActive: boolean }[]>("/api/admin/pros");
  const pro = pros.find((p) => p.id === ids().proId)!;
  if (pro.isActive !== active) {
    // toggle-status של המנהל גם נועל/משחרר את הנציג — מוחזר למצב פעיל בסוף
    await admin.patch(`/api/admin/pros/${ids().proId}/toggle-status`, {});
  }
}

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await setActive(true);
  await admin.dispose();
});

test.describe("דף נחיתה של נציג כבוי", () => {
  test("נציג פעיל: הכפתורים מפנים למספר של הנציג", async ({ page }) => {
    await setActive(true);
    await page.goto(landingPath);
    await expect(page.locator(`a[href="tel:${E2E.page.twilioNumber}"]`).first()).toBeAttached();
    await expect(page.locator('a[href="https://wa.me/972509990001"]').first()).toBeAttached();
  });

  test("נציג כבוי: החיוג וה-WhatsApp מפנים למספר המנהל ולא לנציג", async ({ page }) => {
    await setActive(false);
    await page.goto(landingPath);

    await expect(page.locator(`a[href="tel:${E2E.adminFallbackPhone}"]`).first()).toBeAttached();
    await expect(page.locator(`a[href="https://wa.me/${fallbackDigits}"]`).first()).toBeAttached();
    await expect(page.locator(`a[href="tel:${E2E.page.twilioNumber}"]`)).toHaveCount(0);
    await expect(page.locator('a[href="https://wa.me/972509990001"]')).toHaveCount(0);
    await expect(page.getByText("050-999-0099").first()).toBeVisible();
  });

  test("נציג כבוי: שיחה מהדף נרשמת כפנייה למנהל, לא לנציג", async ({ page }) => {
    await setActive(false);
    await page.goto(landingPath);

    const logged = page.waitForResponse((r) => r.url().endsWith("/api/webhook/call-click"));
    await page.locator(`a[href="tel:${E2E.adminFallbackPhone}"]`).first().dispatchEvent("click");
    expect((await logged).status()).toBe(201);

    await expect.poll(async () => {
      const calls = await admin.get<CallRow[]>("/api/admin/calls");
      return calls.filter((c) => c.destinationPhone === E2E.adminFallbackPhone && c.proId === null).length;
    }).toBeGreaterThan(0);
  });

  test("נציג חוזר להיות פעיל: הדף חוזר מיד למספר שלו", async ({ page }) => {
    await setActive(true);
    await page.goto(landingPath);
    await expect(page.locator(`a[href="tel:${E2E.page.twilioNumber}"]`).first()).toBeAttached();
    await expect(page.locator(`a[href="tel:${E2E.adminFallbackPhone}"]`)).toHaveCount(0);
  });
});
