import { runDbScript } from "./db";

export default async function globalSetup(): Promise<void> {
  const out = runDbScript("setup");
  const line = out.split(/\r?\n/).find((l) => l.startsWith("E2E_IDS="));
  if (!line) throw new Error(`e2e-db setup did not return ids:\n${out}`);
  // עובר ל-workers של Playwright דרך משתני הסביבה
  process.env.E2E_IDS = line.slice("E2E_IDS=".length);
}
