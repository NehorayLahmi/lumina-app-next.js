import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function GET() {
  return adminProxy("/landing-pages");
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  return adminProxy("/landing-pages", { method: "POST", body });
}
