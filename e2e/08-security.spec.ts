import { expect, test, request as pwRequest } from "@playwright/test";
import { BACKEND_URL, E2E, ids } from "./fixture";
import { backendLogin } from "./helpers";

/**
 * הרשאות בשרת עצמו (Render חשוף לאינטרנט — אפשר לפנות אליו ישירות, לא רק דרך האתר).
 */
test.describe("הרשאות בשרת", () => {
  test("נתיבי אדמין דורשים התחברות", async () => {
    const anon = await pwRequest.newContext({ baseURL: BACKEND_URL });
    for (const path of ["/api/admin/stats", "/api/admin/leads", "/api/admin/calls", "/api/admin/pros"]) {
      expect((await anon.get(path)).status(), path).toBe(401);
    }
    await anon.dispose();
  });

  test("נציג לא יכול לגשת לנתיבי אדמין", async () => {
    const pro = await backendLogin(E2E.pro.email, E2E.pro.password);
    const res = await pro.ctx.get("/api/admin/stats", { headers: { Authorization: `Bearer ${pro.token}` } });
    expect(res.status()).toBe(403);
    await pro.dispose();
  });

  test("גולש אנונימי לא יכול לכבות נציג", async () => {
    const anon = await pwRequest.newContext({ baseURL: BACKEND_URL });
    const res = await anon.patch(`/api/pros/${ids().proId}`, { data: { isActive: false } });
    expect(res.status()).toBe(401);
    await anon.dispose();

    // אם הבדיקה נכשלה — מחזירים את הנציג לפעיל כדי לא לשבור בדיקות אחרות
    const admin = await backendLogin(E2E.admin.email, E2E.admin.password);
    const pro = await admin.get<{ isActive: boolean }>(`/api/admin/pros/${ids().proId}`);
    if (!pro.isActive) await admin.ctx.patch(`/api/admin/pros/${ids().proId}/toggle-status`, { headers: { Authorization: `Bearer ${admin.token}` } });
    await admin.dispose();
  });

  test("גולש אנונימי לא יכול לקרוא את רשימת השיחות", async () => {
    const anon = await pwRequest.newContext({ baseURL: BACKEND_URL });
    expect((await anon.get("/api/calls")).status()).toBe(401);
    await anon.dispose();
  });

  test("גולש אנונימי לא יכול לקרוא פרטי נציג (כולל אימייל)", async () => {
    const anon = await pwRequest.newContext({ baseURL: BACKEND_URL });
    expect((await anon.get(`/api/pros/${ids().proId}`)).status()).toBe(401);
    expect((await anon.get("/api/pros")).status()).toBe(401);
    await anon.dispose();
  });

  test("נציג ניגש רק לפרופיל של עצמו", async () => {
    const pro = await backendLogin(E2E.pro.email, E2E.pro.password);
    const auth = { Authorization: `Bearer ${pro.token}` };
    expect((await pro.ctx.get(`/api/pros/${ids().proId}`, { headers: auth })).status()).toBe(200);

    const otherId = "00000000-0000-4000-8000-000000000000";
    expect((await pro.ctx.get(`/api/pros/${otherId}`, { headers: auth })).status()).toBe(403);
    expect((await pro.ctx.patch(`/api/pros/${otherId}`, { headers: auth, data: { isActive: false } })).status()).toBe(403);
    expect((await pro.ctx.get("/api/pros", { headers: auth })).status()).toBe(403);
    expect((await pro.ctx.get("/api/calls", { headers: auth })).status()).toBe(403);
    await pro.dispose();
  });

  test("מנהל ממשיך לגשת לפרופיל נציג ולרשימת השיחות", async () => {
    const admin = await backendLogin(E2E.admin.email, E2E.admin.password);
    const auth = { Authorization: `Bearer ${admin.token}` };
    expect((await admin.ctx.get(`/api/pros/${ids().proId}`, { headers: auth })).status()).toBe(200);
    expect((await admin.ctx.get("/api/calls", { headers: auth })).status()).toBe(200);
    await admin.dispose();
  });
});
