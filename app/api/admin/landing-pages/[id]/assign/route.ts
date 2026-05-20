import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.text();
  return adminProxy(`/landing-pages/${id}/assign`, { method: "PATCH", body });
}
