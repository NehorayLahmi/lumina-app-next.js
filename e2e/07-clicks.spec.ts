import { expect, test } from "@playwright/test";
import { E2E, ids } from "./fixture";
import { backendLogin, type BackendClient, type CallRow } from "./helpers";

const landingPath = `/${E2E.pro.profession}/${E2E.pro.city}`;
let admin: BackendClient;

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await admin.dispose();
});

async function proCalls(): Promise<CallRow[]> {
  const all = await admin.get<CallRow[]>("/api/admin/calls");
  return all.filter((c) => c.proId === ids().proId);
}

test.describe("מעקב קליקים בדף הנחיתה", () => {
  test("לחיצה על כפתור החיוג נרשמת כשיחה ומשויכת לנציג", async ({ page }) => {
    const before = (await proCalls()).filter((c) => c.type === "PHONE").length;
    await page.goto(landingPath);

    const logged = page.waitForResponse((r) => r.url().endsWith("/api/webhook/call-click"));
    // tel: לא נפתח בדפדפן הבדיקות — מספיק שהאירוע נשלח
    await page.locator('a[href^="tel:"]').first().dispatchEvent("click");
    expect((await logged).status()).toBe(201);

    await expect.poll(async () => (await proCalls()).filter((c) => c.type === "PHONE").length).toBe(before + 1);
  });

  test("לחיצה על WhatsApp נרשמת כשיחת WhatsApp", async ({ page }) => {
    const before = (await proCalls()).filter((c) => c.type === "WHATSAPP").length;
    await page.goto(landingPath);

    const logged = page.waitForResponse((r) => r.url().endsWith("/api/webhook/whatsapp-click"));
    await page.locator('a[href^="https://wa.me/"]').first().dispatchEvent("click");
    // הנתיב באתר הוא fire-and-forget ותמיד מחזיר 200 — האימות האמיתי הוא ב-DB למטה
    expect((await logged).ok()).toBe(true);

    await expect.poll(async () => (await proCalls()).filter((c) => c.type === "WHATSAPP").length).toBe(before + 1);
  });
});
