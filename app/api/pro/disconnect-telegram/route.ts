import { proProxy } from "@/lib/proFetch";

// הנציג מתנתק מבוט הטלגרם
export async function POST() {
  return proProxy("/disconnect-telegram", { method: "POST" });
}
