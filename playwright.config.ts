import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { ADMIN_CHAT_ID, BACKEND_PORT, BACKEND_URL, E2E, FRONTEND_PORT, FRONTEND_URL } from "./e2e/fixture";

/**
 * בדיקות E2E לכל המערכת: האתר (Next) + השרת (Express) + ה-DB.
 *
 * מריצים: npm run test:e2e
 *
 * - שני השרתים עולים על פורטים נפרדים (3100 / 3101) כדי לא להתנגש עם שרתי הפיתוח.
 * - האתר רץ כ-build של production — כמו ב-Vercel.
 * - טלגרם מנוטרל: טוקן מזויף, כך שלא נשלחות הודעות אמיתיות.
 * - ה-DB הוא ה-DB שמוגדר ב-.env של השרת. נתוני הבדיקות נוצרים ונמחקים ע"י e2e/db.ts.
 */
const backendDir = path.resolve(__dirname, process.env.E2E_BACKEND_DIR ?? "../leads-project");
const FAKE_TELEGRAM_TOKEN = "e2e-disabled";

export default defineConfig({
  testDir: "./e2e",
  // הבדיקות חולקות DB ומשנות סכומים משותפים — מריצים אחת אחרי השנייה
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: FRONTEND_URL,
    locale: "he-IL",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      name: "backend",
      command: "npx tsx src/app.ts",
      cwd: backendDir,
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        PORT: String(BACKEND_PORT),
        NODE_ENV: "test",
        TELEGRAM_BOT_TOKEN: FAKE_TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID: String(ADMIN_CHAT_ID),
        ADMIN_FALLBACK_PHONE: E2E.adminFallbackPhone,
        FRONTEND_URL,
      },
    },
    {
      name: "frontend",
      command: `npx next build && npx next start -p ${FRONTEND_PORT}`,
      url: `${FRONTEND_URL}/login`,
      reuseExistingServer: false,
      timeout: 300_000,
      env: {
        BACKEND_URL,
        FRONTEND_URL,
        TELEGRAM_BOT_TOKEN: FAKE_TELEGRAM_TOKEN,
      },
    },
  ],
});
