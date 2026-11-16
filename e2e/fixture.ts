/**
 * נתוני הבדיקות. כל מה שנוצר מזוהה ע"י אימייל @lumina.test ועיר "e2e-..."
 * ונמחק בתחילת ובסוף כל הרצה (leads-project/scripts/e2e-db.ts).
 */
export const FRONTEND_PORT = 3100;
export const BACKEND_PORT = 3101;
export const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;
export const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

/** צ'אט ה"מנהל" בטלגרם כפי שהשרת רואה אותו בזמן הבדיקות (TELEGRAM_CHAT_ID) */
export const ADMIN_CHAT_ID = 999000111;

export const E2E = {
  admin: { email: "e2e-admin@lumina.test", password: "E2e-Admin-Pass-1" },
  pro: {
    email: "e2e-pro@lumina.test",
    password: "E2e-Pro-Pass-1",
    firstName: "Eetest",
    lastName: "Pro",
    phone: "0509990001",
    city: "e2e-city",
    profession: "e2e-service",
    pricePerLead: 100,
  },
  page: { mainTitle: "דף נחיתה לבדיקות E2E", twilioNumber: "0509990001" },
  /** צירוף עיר/מקצוע בלי נציג — לבדיקת ליד לא משויך */
  unassigned: { city: "e2e-city", profession: "e2e-nobody" },
  /** נציג שנוצר ונמחק דרך ממשק האדמין */
  uiPro: {
    email: "e2e-ui-pro@lumina.test",
    password: "E2e-Ui-Pass-1",
    firstName: "Uitest",
    lastName: "Created",
    phone: "0509990002",
    city: "e2e-ui-city",
    profession: "e2e-ui-service",
  },
  testPhones: ["0509990001", "0509990002"],
};

/** המזהים שנוצרו ב-global-setup (נקראים מ-process.env בזמן הבדיקות) */
export function ids(): { proId: string; landingPageId: string } {
  const raw = process.env.E2E_IDS;
  if (!raw) throw new Error("E2E_IDS missing — did global-setup run?");
  return JSON.parse(raw);
}

/** שם ליד ייחודי שעובר את הוולידציה (אותיות בלבד) */
export function uniqueName(prefix: string): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += letters[Math.floor(Math.random() * letters.length)];
  return `${prefix} ${suffix}`;
}
