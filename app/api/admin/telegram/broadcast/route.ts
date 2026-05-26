import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return adminProxy("/telegram/broadcast", { method: "POST", body: JSON.stringify(body) });
}
