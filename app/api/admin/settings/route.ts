import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function GET() {
  return adminProxy("/settings");
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return adminProxy("/settings", { method: "PATCH", body: JSON.stringify(body) });
}
