import { runDbScript } from "./db";

export default async function globalTeardown(): Promise<void> {
  if (process.env.E2E_KEEP_DATA === "1") return; // לדיבאג: השארת נתוני הבדיקה ב-DB
  runDbScript("cleanup");
}
