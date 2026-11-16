import { expect, test, request as pwRequest, type Page } from "@playwright/test";
import { BACKEND_URL, E2E, ids } from "./fixture";
import { backendLogin, loginUI, type BackendClient } from "./helpers";

/** ניתוק נציג מבוט הטלגרם — ע"י הנציג עצמו וע"י המנהל */
let admin: BackendClient;

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await admin.dispose();
});

async function setChatId(chatId: string | null) {
  await admin.patch(`/api/admin/pros/${ids().proId}`, { telegramChatId: chatId ?? "" });
}
async function currentChatId(): Promise<string | null> {
  const pros = await admin.get<{ id: string; telegramChatId: string | null }[]>("/api/admin/pros");
  return pros.find((p) => p.id === ids().proId)?.telegramChatId ?? null;
}
function acceptDialogs(page: Page) {
  page.on("dialog", (d) => d.accept());
}

test.describe("ניתוק מטלגרם", () => {
  test.afterEach(async () => {
    await setChatId(null);
  });

  test("נציג מתנתק בעצמו מלשונית הפרופיל", async ({ page }) => {
    await setChatId("555000111");
    acceptDialogs(page);
    await loginUI(page, E2E.pro.email, E2E.pro.password);
    await expect(page).toHaveURL(/\/pro\/dashboard$/);

    await page.getByRole("button", { name: /פרופיל/ }).click();
    await expect(page.getByText("מחובר · ID: 555000111")).toBeVisible();
    await page.getByRole("button", { name: /נתק טלגרם/ }).click();

    await expect(page.getByText("לא מחובר — לא תקבל התראות")).toBeVisible();
    await expect(page.getByRole("button", { name: /חבר טלגרם/ })).toBeVisible();
    expect(await currentChatId()).toBeNull();
  });

  test("ביטול בחלון האישור לא מנתק", async ({ page }) => {
    await setChatId("555000112");
    page.on("dialog", (d) => d.dismiss());
    await loginUI(page, E2E.pro.email, E2E.pro.password);
    await page.getByRole("button", { name: /פרופיל/ }).click();
    await page.getByRole("button", { name: /נתק טלגרם/ }).click();

    await expect(page.getByText("מחובר · ID: 555000112")).toBeVisible();
    expect(await currentChatId()).toBe("555000112");
  });

  test("מנהל מנתק נציג מהטלגרם מרשימת הנציגים", async ({ page }) => {
    await setChatId("555000113");
    acceptDialogs(page);
    await loginUI(page, E2E.admin.email, E2E.admin.password);
    await page.getByRole("button", { name: /נציגים \(\d+\)/ }).click();

    const card = page.locator(".pro-glass", { hasText: E2E.pro.email });
    await card.getByRole("button", { name: "נתק טלגרם" }).click();

    // בזמן הבקשה הכפתור מציג "מנתק..." — מחכים לעדכון ב-DB ולהיעלמות הכפתור אחרי הרענון
    await expect.poll(currentChatId).toBeNull();
    await expect(card.getByRole("button", { name: /נתק טלגרם|מנתק/ })).toHaveCount(0);
  });

  test("הרשאות: אנונימי לא מנתק, נציג לא משתמש בנתיב של המנהל", async () => {
    await setChatId("555000114");
    const anon = await pwRequest.newContext({ baseURL: BACKEND_URL });
    expect((await anon.post("/api/pros/disconnect-telegram")).status()).toBe(401);
    expect((await anon.delete(`/api/admin/pros/${ids().proId}/telegram`)).status()).toBe(401);
    await anon.dispose();

    const pro = await backendLogin(E2E.pro.email, E2E.pro.password);
    const res = await pro.ctx.delete(`/api/admin/pros/${ids().proId}/telegram`, {
      headers: { Authorization: `Bearer ${pro.token}` },
    });
    expect(res.status()).toBe(403);
    await pro.dispose();

    expect(await currentChatId()).toBe("555000114");
  });
});
