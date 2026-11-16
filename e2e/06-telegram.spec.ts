import { expect, test, type APIRequestContext } from "@playwright/test";
import { ADMIN_CHAT_ID, E2E, uniqueName } from "./fixture";
import { backendLogin, findLeadByName, getStats, submitLead, type BackendClient } from "./helpers";

/**
 * כפתורי "נסגרה עסקה / לא נסגרה" בהודעות הטלגרם.
 * מדמים את הבקשה שטלגרם שולח ל-webhook באתר → האתר מעביר לשרת → השרת מעדכן את ה-DB.
 */
let admin: BackendClient;

test.beforeAll(async () => {
  admin = await backendLogin(E2E.admin.email, E2E.admin.password);
});
test.afterAll(async () => {
  await admin.dispose();
});

async function pressButton(api: APIRequestContext, data: string, chatId: number) {
  const res = await api.post("/api/telegram-webhook", {
    data: {
      update_id: Date.now(),
      callback_query: { id: `e2e-${Date.now()}`, data, message: { message_id: 1, chat: { id: chatId } } },
    },
  });
  expect(res.status()).toBe(200);
}

async function newLead(api: APIRequestContext, phone: string) {
  const name = uniqueName("Telegram Lead");
  await submitLead(api, { clientName: name, clientPhone: phone, city: E2E.pro.city, profession: E2E.pro.profession });
  const lead = await findLeadByName(admin, name);
  expect(lead).toBeTruthy();
  return lead!;
}

test.describe("כפתורי טלגרם", () => {
  test("לחיצה על 'נסגרה עסקה' מצ'אט המנהל מעדכנת את הליד ואת ההכנסה", async ({ request }) => {
    const lead = await newLead(request, "0509990011");
    const before = (await getStats(admin)).totalRevenue;

    await pressButton(request, `job:l:${lead.id}:1`, ADMIN_CHAT_ID);

    await expect.poll(async () => (await findLeadByName(admin, lead.clientName))?.jobClosed).toBe(true);
    expect((await getStats(admin)).totalRevenue).toBe(before + E2E.pro.pricePerLead);
  });

  test("לחיצה על 'לא נסגרה' מסמנת false", async ({ request }) => {
    const lead = await newLead(request, "0509990012");
    await pressButton(request, `job:l:${lead.id}:0`, ADMIN_CHAT_ID);
    await expect.poll(async () => (await findLeadByName(admin, lead.clientName))?.jobClosed).toBe(false);
  });

  test("פורמט הכפתורים הישן (הודעות שנשלחו לפני העדכון) עדיין עובד", async ({ request }) => {
    const lead = await newLead(request, "0509990013");
    await pressButton(request, `job:${lead.id}:1`, ADMIN_CHAT_ID);
    await expect.poll(async () => (await findLeadByName(admin, lead.clientName))?.jobClosed).toBe(true);
  });

  test("לחיצה מצ'אט זר לא משנה את הליד", async ({ request }) => {
    const lead = await newLead(request, "0509990014");
    await pressButton(request, `job:l:${lead.id}:1`, 123456789);
    // נותנים לבקשה זמן להגיע לשרת, ומוודאים שלא השתנה דבר
    await new Promise((r) => setTimeout(r, 2000));
    expect((await findLeadByName(admin, lead.clientName))?.jobClosed).toBeNull();
  });
});
