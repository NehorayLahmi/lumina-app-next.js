import { expect, test } from "@playwright/test";
import { E2E } from "./fixture";
import { loginUI } from "./helpers";

test.describe("התחברות והתנתקות", () => {
  test("סיסמה שגויה מציגה שגיאה ונשארים בדף ההתחברות", async ({ page }) => {
    await loginUI(page, E2E.admin.email, "wrong-password-123");
    await expect(page.getByText("פרטי הכניסה שגויים")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("מנהל: התחברות → /admin, כניסה ל-login מחזירה ל-/admin, התנתקות חוסמת שוב", async ({ page }) => {
    await loginUI(page, E2E.admin.email, E2E.admin.password);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText("הכנסה כוללת")).toBeVisible();

    await page.goto("/login");
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByTitle("התנתק").click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?from=%2Fadmin/);
  });

  test("אחרי התחברות חוזרים לדף שביקשו (from)", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?from=%2Fadmin/);
    await page.locator("#login-email").fill(E2E.admin.email);
    await page.locator("#login-password").fill(E2E.admin.password);
    await page.getByRole("button", { name: "התחברות למערכת" }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("נציג: התחברות → /pro/dashboard, אין גישה ל-/admin, התנתקות מהפרופיל", async ({ page }) => {
    await loginUI(page, E2E.pro.email, E2E.pro.password);
    await expect(page).toHaveURL(/\/pro\/dashboard$/);
    await expect(page.getByText('סה"כ לתשלום החודש')).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/pro\/dashboard$/);

    await page.getByRole("button", { name: /פרופיל/ }).click();
    await page.getByRole("button", { name: /התנתקות/ }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/pro/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
