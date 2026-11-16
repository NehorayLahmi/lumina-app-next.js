import { expect, test, request as pwRequest, type Page } from "@playwright/test";
import { BACKEND_URL, E2E, ids, uniqueName } from "./fixture";
import {
  backendLogin, findLeadByName, loginUI, submitLead, type BackendClient, type CallRow,
} from "./helpers";

/** בחירה מרובה ומחיקה בבת אחת בלשונית "תנועה" של האדמין */
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

async function openTraffic(page: Page, sub: "שיחות" | "לידים") {
  await loginUI(page, E2E.admin.email, E2E.admin.password);
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("button", { name: /תנועה/ }).click();
  await page.getByRole("button", { name: sub, exact: true }).click();
}

test.describe("מחיקה מרובה בלשונית תנועה", () => {
  test("בחירת שני לידים מתוך שלושה ומחיקתם בפעם אחת", async ({ page, request }) => {
    const tag = uniqueName("Bulk");
    const names = [`${tag} one`, `${tag} two`, `${tag} three`];
    for (const [i, name] of names.entries()) {
      await submitLead(request, { clientName: name, clientPhone: `05099900${20 + i}`, city: E2E.pro.city, profession: E2E.pro.profession });
    }

    await openTraffic(page, "לידים");
    await page.getByPlaceholder("חיפוש...").fill(tag);
    await expect(page.getByText("3 תוצאות")).toBeVisible();

    await page.getByRole("checkbox", { name: `בחירת ליד ${names[0]}` }).check();
    await page.getByRole("checkbox", { name: `בחירת ליד ${names[1]}` }).check();
    await expect(page.getByText("נבחרו 2")).toBeVisible();

    // לחיצה על תיבת הבחירה לא פותחת את פרטי הליד
    await expect(page.getByRole("button", { name: /מחק ליד/ })).toHaveCount(0);

    await page.getByRole("button", { name: /מחק נבחרים \(2\)/ }).click();
    await expect(page.getByText("מחיקת 2 לידים")).toBeVisible();
    await page.getByRole("button", { name: "מחק", exact: true }).click();

    await expect(page.getByText("1 תוצאות")).toBeVisible();
    await expect(page.getByText(names[2], { exact: true })).toBeVisible();
    await expect(page.getByText("נבחרו")).toHaveCount(0);

    expect(await findLeadByName(admin, names[0])).toBeUndefined();
    expect(await findLeadByName(admin, names[1])).toBeUndefined();
    expect(await findLeadByName(admin, names[2])).toBeTruthy();
  });

  test("'בחר הכל בעמוד' בשיחות ומחיקה", async ({ page, request }) => {
    for (let i = 0; i < 2; i++) {
      const res = await request.post("/api/webhook/call-click", {
        data: { landingPageId: ids().landingPageId, destinationPhone: E2E.page.twilioNumber },
      });
      expect(res.status()).toBe(201);
    }
    const before = await proCalls();
    expect(before.length).toBeGreaterThanOrEqual(2);
    expect(before.length).toBeLessThanOrEqual(10); // כולן בעמוד אחד

    await openTraffic(page, "שיחות");
    await page.locator("select").filter({ hasText: "כל הנציגים" }).selectOption(ids().proId);
    await expect(page.getByText(`${before.length} תוצאות`)).toBeVisible();

    await page.getByRole("checkbox", { name: "בחר הכל בעמוד" }).check();
    await expect(page.getByText(`נבחרו ${before.length}`)).toBeVisible();

    await page.getByRole("button", { name: /מחק נבחרים/ }).click();
    await expect(page.getByText(`מחיקת ${before.length} שיחות`)).toBeVisible();
    await page.getByRole("button", { name: "מחק", exact: true }).click();

    await expect(page.getByText("לא נמצאו רשומות")).toBeVisible();
    expect(await proCalls()).toHaveLength(0);
  });

  test("ביטול בחלון האישור לא מוחק, והבחירה מתאפסת במעבר לשונית", async ({ page, request }) => {
    const name = uniqueName("Keep Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990030", city: E2E.pro.city, profession: E2E.pro.profession });

    await openTraffic(page, "לידים");
    await page.getByPlaceholder("חיפוש...").fill(name);
    await page.getByRole("checkbox", { name: `בחירת ליד ${name}` }).check();
    await page.getByRole("button", { name: /מחק נבחרים/ }).click();
    await page.getByRole("button", { name: "ביטול" }).click();
    expect(await findLeadByName(admin, name)).toBeTruthy();
    await expect(page.getByText("נבחרו 1")).toBeVisible();

    await page.getByRole("button", { name: "שיחות", exact: true }).click();
    await expect(page.getByText("נבחרו")).toHaveCount(0);
  });

  test("הרשאות וולידציה בשרת", async () => {
    const someId = "00000000-0000-4000-8000-000000000000";
    const anon = await pwRequest.newContext({ baseURL: BACKEND_URL });
    for (const kind of ["leads", "calls"]) {
      expect((await anon.post(`/api/admin/${kind}/bulk-delete`, { data: { ids: [someId] } })).status()).toBe(401);
    }
    await anon.dispose();

    const pro = await backendLogin(E2E.pro.email, E2E.pro.password);
    const proRes = await pro.ctx.post("/api/admin/leads/bulk-delete", {
      headers: { Authorization: `Bearer ${pro.token}` }, data: { ids: [someId] },
    });
    expect(proRes.status()).toBe(403);
    await pro.dispose();

    const auth = { Authorization: `Bearer ${admin.token}` };
    const bad = [{}, { ids: [] }, { ids: ["not-a-uuid"] }, { ids: Array(501).fill(someId) }];
    for (const data of bad) {
      expect((await admin.ctx.post("/api/admin/leads/bulk-delete", { headers: auth, data })).status()).toBe(400);
    }
  });
});
