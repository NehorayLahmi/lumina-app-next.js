import { adminProxy } from "@/lib/adminFetch";

// מחיקת כמה לידים בפעם אחת — Body: { ids: string[] }
export async function POST(req: Request) {
  const body = await req.text();
  return adminProxy("/leads/bulk-delete", { method: "POST", body });
}
