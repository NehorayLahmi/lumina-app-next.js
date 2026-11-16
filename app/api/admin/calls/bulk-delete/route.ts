import { adminProxy } from "@/lib/adminFetch";

// מחיקת כמה שיחות בפעם אחת — Body: { ids: string[] }
export async function POST(req: Request) {
  const body = await req.text();
  return adminProxy("/calls/bulk-delete", { method: "POST", body });
}
