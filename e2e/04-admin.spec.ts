import { expect, test, type Page } from "@playwright/test";
import { E2E, uniqueName } from "./fixture";
import {
  backendLogin, findLeadByName, getStats, loginUI, parseShekels, submitLead, type BackendClient,
} from "./helpers";

let admin: BackendClient;

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await admin.dispose();
});

/** שדה בתוך חלון (Modal) לפי הכותרת שלו */
function field(page: Page, label: string, tag: "input" | "select" = "input") {
  return page.locator(`xpath=//label[normalize-space()='${label}']/following-sibling::${tag}`);
}

function revenueLocator(page: Page) {
  return page.locator("section", { hasText: "הכנסה כוללת" }).locator("h1");
}

async function openLeadInTraffic(page: Page, name: string) {
  await page.getByRole("button", { name: /תנועה/ }).click();
  await page.getByRole("button", { name: "לידים", exact: true }).click();
  await page.getByPlaceholder("חיפוש...").fill(name);
  const row = page.getByText(name, { exact: true }).first();
  await expect(row).toBeVisible();
  await row.click(); // פותח את פרטי הליד
}

test.describe("פאנל אדמין", () => {
  test.beforeEach(async ({ page }) => {
    await loginUI(page, E2E.admin.email, E2E.admin.password);
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("יצירת נציג חדש דרך הממשק ומחיקתו", async ({ page }) => {
    const p = E2E.uiPro;
    await page.getByRole("button", { name: /נציגים \(\d+\)/ }).click();
    await page.getByRole("button", { name: "+ הוסף נציג" }).click();
    await expect(page.getByText("הוספת נציג חדש")).toBeVisible();

    await field(page, "אימייל").fill(p.email);
    await field(page, "סיסמה").fill(p.password);
    await field(page, "שם פרטי").fill(p.firstName);
    await field(page, "שם משפחה").fill(p.lastName);
    await field(page, "טלפון").fill(p.phone);
    await field(page, "עיר", "select").selectOption("__custom__");
    await field(page, "עיר").fill(p.city);
    await field(page, "מקצוע", "select").selectOption("__custom__");
    await field(page, "מקצוע").fill(p.profession);
    await page.locator("form button[type=submit]").click();

    const card = page.locator(".pro-glass", { hasText: p.email });
    await expect(card).toBeVisible();
    await expect(card).toContainText(`${p.firstName} ${p.lastName}`);

    await card.getByRole("button", { name: "מחיקה" }).click();
    await page.getByRole("button", { name: "מחק", exact: true }).click();
    await expect(card).toHaveCount(0);

    const pros = await admin.get<{ user: { email: string } }[]>("/api/admin/pros");
    expect(pros.some((x) => x.user.email === p.email)).toBe(false);
  });

  test("מנהל פותח את הדשבורד של נציג (תצוגת מנהל)", async ({ page }) => {
    await page.getByRole("button", { name: /נציגים \(\d+\)/ }).click();
    const card = page.locator(".pro-glass", { hasText: E2E.pro.email });
    await card.getByRole("button", { name: "דשבורד" }).click();

    await expect(page).toHaveURL(/\/admin\/pros\/[^/]+\/dashboard$/);
    await expect(page.getByText("תצוגת מנהל")).toBeVisible();
    await expect(page.getByText('סה"כ לתשלום החודש')).toBeVisible();
  });

  test("אישור עסקה בלשונית 'תנועה' מעלה את ההכנסה הכוללת במחיר הליד", async ({ page, request }) => {
    const name = uniqueName("Revenue Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990005", city: E2E.pro.city, profession: E2E.pro.profession });
    const before = (await getStats(admin)).totalRevenue;

    await page.reload();
    await expect(revenueLocator(page)).toHaveText(new RegExp(before.toLocaleString("en-US")));

    await openLeadInTraffic(page, name);
    await page.getByRole("button", { name: /נסגרה עסקה/ }).click();
    await expect(page.getByText("נסגרה עסקה").first()).toBeVisible();

    await expect.poll(async () => (await findLeadByName(admin, name))?.jobClosed).toBe(true);
    expect((await getStats(admin)).totalRevenue).toBe(before + E2E.pro.pricePerLead);

    // היתרה במסך מתעדכנת בלי רענון ידני
    await page.getByRole("button", { name: /סקירה/ }).click();
    await expect.poll(async () => parseShekels(await revenueLocator(page).textContent()), { timeout: 20_000 })
      .toBe(before + E2E.pro.pricePerLead);
  });

  test("ליד שסומן 'לא נסגרה' לא נכנס להכנסה", async ({ page, request }) => {
    const name = uniqueName("Rejected Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990006", city: E2E.pro.city, profession: E2E.pro.profession });
    const before = (await getStats(admin)).totalRevenue;

    await page.reload();
    await openLeadInTraffic(page, name);
    await page.getByRole("button", { name: /לא נסגרה/ }).click();

    await expect.poll(async () => (await findLeadByName(admin, name))?.jobClosed).toBe(false);
    expect((await getStats(admin)).totalRevenue).toBe(before);
  });

  test("מחיקת ליד מהממשק", async ({ page, request }) => {
    const name = uniqueName("Delete Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990007", city: E2E.pro.city, profession: E2E.pro.profession });

    await page.reload();
    await openLeadInTraffic(page, name);
    await page.getByRole("button", { name: /מחק ליד/ }).click();
    await page.getByRole("button", { name: "מחק", exact: true }).click();

    await expect(page.getByText("לא נמצאו רשומות")).toBeVisible();
    expect(await findLeadByName(admin, name)).toBeUndefined();
  });
});
