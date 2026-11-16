import { expect, test, type Page } from "@playwright/test";
import { E2E, uniqueName } from "./fixture";
import { backendLogin, findLeadByName, loginUI, parseShekels, submitLead, type BackendClient } from "./helpers";

let admin: BackendClient;

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await admin.dispose();
});

function monthlyTotal(page: Page) {
  return page.locator("section", { hasText: 'סה"כ לתשלום החודש' }).locator("h1");
}

test.describe("לוח הבקרה של הנציג", () => {
  test("הנציג רואה את הליד שלו, ואישור עסקה מוסיף את מחיר הליד לסכום לתשלום", async ({ page, request }) => {
    const name = uniqueName("Pro Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990008", city: E2E.pro.city, profession: E2E.pro.profession });

    await loginUI(page, E2E.pro.email, E2E.pro.password);
    await expect(page).toHaveURL(/\/pro\/dashboard$/);
    const before = parseShekels(await monthlyTotal(page).textContent());

    await page.getByRole("button", { name: /פעילות/ }).click();
    const item = page.locator(".pro-glass", { hasText: name });
    await expect(item).toBeVisible();

    await item.getByRole("button", { name: /נסגרה עסקה/ }).click();
    await expect.poll(async () => (await findLeadByName(admin, name))?.jobClosed).toBe(true);

    await page.getByRole("button", { name: /ניהול/ }).click();
    await expect(monthlyTotal(page)).toHaveText(new RegExp(`${before + E2E.pro.pricePerLead}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")));

    // ביטול הסימון (לחיצה חוזרת) מחזיר את הסכום
    await page.getByRole("button", { name: /פעילות/ }).click();
    await item.getByRole("button", { name: /נסגרה עסקה/ }).click();
    await expect.poll(async () => (await findLeadByName(admin, name))?.jobClosed).toBeNull();
    await page.getByRole("button", { name: /ניהול/ }).click();
    await expect.poll(async () => parseShekels(await monthlyTotal(page).textContent())).toBe(before);
  });

  test("אישור שנעשה במקום אחר (אדמין/טלגרם) מופיע בלוח של הנציג בלי רענון", async ({ page, request }) => {
    const name = uniqueName("Remote Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990009", city: E2E.pro.city, profession: E2E.pro.profession });
    const lead = await findLeadByName(admin, name);

    await loginUI(page, E2E.pro.email, E2E.pro.password);
    await expect(page).toHaveURL(/\/pro\/dashboard$/);
    const before = parseShekels(await monthlyTotal(page).textContent());

    await admin.patch(`/api/admin/job-status/lead/${lead!.id}`, { jobClosed: true });

    await expect.poll(async () => parseShekels(await monthlyTotal(page).textContent()), { timeout: 25_000 })
      .toBe(before + E2E.pro.pricePerLead);
  });

  test("נציג יכול לעדכן את סטטוס הזמינות של עצמו דרך האתר", async ({ page }) => {
    await loginUI(page, E2E.pro.email, E2E.pro.password);
    await expect(page).toHaveURL(/\/pro\/dashboard$/);

    const off = await page.request.patch("/api/pro/status", { data: { isActive: false } });
    expect(off.status()).toBe(200);
    expect((await off.json()).isActive).toBe(false);

    const on = await page.request.patch("/api/pro/status", { data: { isActive: true } });
    expect(on.status()).toBe(200);
    expect((await on.json()).isActive).toBe(true);
  });

  test("נציג לא יכול לעדכן ליד שלא שייך לו", async ({ request }) => {
    const name = uniqueName("Foreign Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990010", ...E2E.unassigned });
    const lead = await findLeadByName(admin, name);

    const pro = await backendLogin(E2E.pro.email, E2E.pro.password);
    const res = await pro.ctx.patch(`/api/pros/job-status/lead/${lead!.id}`, {
      headers: { Authorization: `Bearer ${pro.token}` },
      data: { jobClosed: true },
    });
    expect([403, 404]).toContain(res.status());
    expect((await findLeadByName(admin, name))?.jobClosed).toBeNull();
    await pro.dispose();
  });
});
