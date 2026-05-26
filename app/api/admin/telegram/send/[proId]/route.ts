import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function POST(req: NextRequest, { params }: { params: Promise<{ proId: string }> }) {
  const { proId } = await params;
  const body = await req.json().catch(() => ({}));
  return adminProxy(`/telegram/send/${proId}`, { method: "POST", body: JSON.stringify(body) });
}
