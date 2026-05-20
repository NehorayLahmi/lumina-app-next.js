import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminProxy(`/pros/${id}/toggle-status`, { method: "PATCH" });
}
