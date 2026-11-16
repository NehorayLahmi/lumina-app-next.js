import { execFileSync } from "node:child_process";
import path from "node:path";
import { E2E } from "./fixture";

export const BACKEND_DIR = path.resolve(
  __dirname,
  "..",
  process.env.E2E_BACKEND_DIR ?? "../leads-project"
);

/** מריץ את scripts/e2e-db.ts בפרויקט השרת ומחזיר את ה-stdout */
export function runDbScript(cmd: "setup" | "cleanup"): string {
  return execFileSync("npx", ["tsx", "scripts/e2e-db.ts", cmd], {
    cwd: BACKEND_DIR,
    env: { ...process.env, NODE_ENV: "test", E2E_FIXTURE: JSON.stringify(E2E) },
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "inherit"],
  });
}
