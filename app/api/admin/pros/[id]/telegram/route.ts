import { adminProxy } from "@/lib/adminFetch";

// המנהל מנתק נציג מבוט הטלגרם
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminProxy(`/pros/${encodeURIComponent(id)}/telegram`, { method: "DELETE" });
}
