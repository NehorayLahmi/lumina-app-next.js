import { NextRequest } from "next/server";
import { adminProxy } from "@/lib/adminFetch";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminProxy(`/pros/${id}`);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.text();
  return adminProxy(`/pros/${id}`, { method: "PATCH", body });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminProxy(`/pros/${id}`, { method: "DELETE" });
}
