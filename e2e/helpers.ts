import { expect, request as pwRequest, type APIRequestContext, type Page } from "@playwright/test";
import { BACKEND_URL } from "./fixture";

// ─── UI ──────────────────────────────────────────────────────────────────────

export async function loginUI(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login");
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "התחברות למערכת" }).click();
}

/** מחלץ מספר מטקסט כמו "₪1,250" */
export function parseShekels(text: string | null): number {
  const digits = (text ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

// ─── API ישיר מול השרת (לאימות מצב ה-DB ולהכנת נתונים) ──────────────────────

export interface BackendClient {
  ctx: APIRequestContext;
  token: string;
  get<T = unknown>(path: string): Promise<T>;
  patch<T = unknown>(path: string, body: unknown): Promise<T>;
  dispose(): Promise<void>;
}

export async function backendLogin(email: string, password: string): Promise<BackendClient> {
  const ctx = await pwRequest.newContext({ baseURL: BACKEND_URL });
  const res = await ctx.post("/api/auth/login", { data: { email, password } });
  expect(res.status(), `login ${email}`).toBe(200);
  const { token } = (await res.json()) as { token: string };
  expect(token).toBeTruthy();
  const headers = { Authorization: `Bearer ${token}` };

  return {
    ctx,
    token,
    async get<T>(path: string) {
      const r = await ctx.get(path, { headers });
      expect(r.status(), `GET ${path}`).toBe(200);
      return (await r.json()) as T;
    },
    async patch<T>(path: string, body: unknown) {
      const r = await ctx.patch(path, { headers, data: body });
      expect(r.status(), `PATCH ${path}`).toBe(200);
      return (await r.json()) as T;
    },
    dispose: () => ctx.dispose(),
  };
}

export interface LeadRow {
  id: string;
  clientName: string;
  clientPhone: string;
  status: string;
  proId: string | null;
  jobClosed: boolean | null;
}
export interface CallRow {
  id: string;
  type: "PHONE" | "WHATSAPP";
  destinationPhone: string;
  proId: string | null;
  jobClosed: boolean | null;
}

export async function findLeadByName(admin: BackendClient, name: string): Promise<LeadRow | undefined> {
  const res = await admin.get<{ items: LeadRow[] }>(
    `/api/admin/leads?page=1&limit=20&search=${encodeURIComponent(name)}`
  );
  return res.items.find((l) => l.clientName === name);
}

/** יוצר ליד דרך טופס הלידים הציבורי של האתר (בלי דפדפן) */
export async function submitLead(
  api: APIRequestContext,
  lead: { clientName: string; clientPhone: string; city: string; profession: string }
): Promise<void> {
  const res = await api.post("/api/leads", { data: lead });
  expect(res.status(), "POST /api/leads").toBe(201);
}

export async function getStats(admin: BackendClient): Promise<{ totalRevenue: number }> {
  return admin.get<{ totalRevenue: number }>("/api/admin/stats");
}
