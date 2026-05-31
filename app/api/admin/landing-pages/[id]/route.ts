import { adminProxy } from "@/lib/adminFetch";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminProxy(`/landing-pages/${id}/draft`, { method: "PATCH" });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminProxy(`/landing-pages/${id}`, { method: "DELETE" });
}
