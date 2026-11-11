import { adminProxy } from "@/lib/adminFetch";

export async function PATCH(req: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  const body = await req.text();
  return adminProxy(`/job-status/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`, { method: "PATCH", body });
}
