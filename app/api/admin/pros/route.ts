import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function GET() {
  return adminProxy("/pros");
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  return adminProxy("/pros", { method: "POST", body });
}
