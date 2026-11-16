import { expect, test } from "@playwright/test";
import { E2E, ids, uniqueName } from "./fixture";
import { backendLogin, findLeadByName, submitLead, type BackendClient } from "./helpers";

const landingPath = `/${E2E.pro.profession}/${E2E.pro.city}`;
let admin: BackendClient;

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await admin.dispose();
});

test.describe("טופס לידים בדף הנחיתה", () => {
  test("שדות ריקים ומספר לא תקין מציגים שגיאות ולא נשלחים", async ({ page }) => {
    let submitted = false;
    page.on("request", (r) => { if (r.url().endsWith("/api/leads")) submitted = true; });

    await page.goto(landingPath);
    await page.getByRole("button", { name: "שלח פרטים לקבלת שיחה חוזרת" }).click();
    await expect(page.getByText("יש להזין שם מלא")).toBeVisible();
    await expect(page.getByText("יש להזין מספר טלפון")).toBeVisible();

    await page.locator("#lead-full-name").fill("Valid Name");
    await page.locator("#lead-phone").fill("12345");
    await page.getByRole("button", { name: "שלח פרטים לקבלת שיחה חוזרת" }).click();
    await expect(page.getByText(/מספר לא תקין/)).toBeVisible();

    expect(submitted).toBe(false);
  });

  test("ליד תקין נשלח, נשמר ומשויך לנציג של הדף", async ({ page }) => {
    const name = uniqueName("Form Lead");
    await page.goto(landingPath);
    await page.locator("#lead-full-name").fill(name);
    await page.locator("#lead-phone").fill("050-9990003");
    await page.getByRole("button", { name: "שלח פרטים לקבלת שיחה חוזרת" }).click();

    await expect(page.getByText("הפרטים נשלחו בהצלחה!")).toBeVisible();

    const lead = await findLeadByName(admin, name);
    expect(lead, "הליד נשמר ב-DB").toBeTruthy();
    expect(lead!.status).toBe("ASSIGNED");
    expect(lead!.proId).toBe(ids().proId);
    expect(lead!.jobClosed).toBeNull();
  });

  test("ליד בלי נציג פעיל נשמר כ'חדש' ולא משויך", async ({ request }) => {
    const name = uniqueName("Orphan Lead");
    await submitLead(request, { clientName: name, clientPhone: "0509990004", ...E2E.unassigned });

    const lead = await findLeadByName(admin, name);
    expect(lead).toBeTruthy();
    expect(lead!.status).toBe("NEW");
    expect(lead!.proId).toBeNull();
  });

  test("השרת דוחה ליד עם טלפון לא תקין גם בלי הדפדפן", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { clientName: "Valid Name", clientPhone: "abc", city: E2E.pro.city, profession: E2E.pro.profession },
    });
    expect(res.status()).toBe(400);
  });
});
